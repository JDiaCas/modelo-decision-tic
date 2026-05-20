import React from 'react'
import { useApp } from './AppContext.jsx'
import { TIPOLOGIAS } from '../data/tipologias.js'
import { VARIABLES } from '../data/preguntas.js'
import { calcularPosicionFinal, clasificarModalidad, calcularNivelGobernanza } from '../utils/calculos.js'
import { obtenerRiesgosYFortalezas, generarExplicacionResultado, RECOMENDACIONES_GOBERNANZA } from '../utils/interpretaciones.js'

function ModalidadBar({ puntuacion }) {
  const segments = [
    { min: 0, max: 24, label: 'Presencial reforzada', color: '#d32f2f' },
    { min: 25, max: 39, label: 'Presencial + híbrido', color: '#f57c00' },
    { min: 40, max: 69, label: 'Híbrida', color: '#1976d2' },
    { min: 70, max: 84, label: 'Remota + gobernanza', color: '#388e3c' },
    { min: 85, max: 100, label: 'Remota', color: '#2e7d32' },
  ]

  return (
    <div className="modalidad-barra-container">
      <div className="modalidad-barra">
        {segments.map((seg) => (
          <div
            key={seg.min}
            className="modalidad-segment"
            style={{
              width: `${seg.max - seg.min + 1}%`,
              backgroundColor: seg.color,
              opacity: puntuacion >= seg.min && puntuacion <= seg.max ? 1 : 0.25,
            }}
            title={seg.label}
          />
        ))}
        <div className="modalidad-indicator" style={{ left: `${puntuacion}%` }}>
          <div className="modalidad-indicator-triangle" />
          <div className="modalidad-indicator-value">{puntuacion}</div>
        </div>
      </div>
      <div className="modalidad-labels">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  )
}

export default function ResultadoModelo() {
  const { state, dispatch, getVariables } = useApp()
  const variables = getVariables()
  const tipologia = TIPOLOGIAS.find((t) => t.id === state.contexto.tipologia)
  const posicionBase = tipologia ? tipologia.posicionBase : 0
  const puntuacionFinal = calcularPosicionFinal(posicionBase, variables)
  const clasif = clasificarModalidad(puntuacionFinal)
  const gobernanza = calcularNivelGobernanza(puntuacionFinal, variables)
  const { riesgos, fortalezas } = obtenerRiesgosYFortalezas(variables)
  const explicacion = generarExplicacionResultado(puntuacionFinal, clasif.modalidad, tipologia?.nombre || '', variables)

  const varImpactoNegativo = [...VARIABLES]
    .filter((v) => variables[v.id] < 0)
    .sort((a, b) => variables[a.id] - variables[b.id])

  const varImpactoPositivo = [...VARIABLES]
    .filter((v) => variables[v.id] > 0)
    .sort((a, b) => variables[b.id] - variables[a.id])

  return (
    <div className="section-card">
      <h2>Resultado del modelo</h2>

      <div className="resultado-header">
        <div className="resultado-info">
          <div className="info-row"><strong>Proyecto:</strong> {state.contexto.nombre}</div>
          <div className="info-row"><strong>Tipología:</strong> {tipologia?.nombre}</div>
          <div className="info-row"><strong>Modalidad actual:</strong> {state.contexto.modalidadActual}</div>
        </div>
        <div className={`resultado-badge gobernanza-${gobernanza.nivel}`}>
          {gobernanza.label}
        </div>
      </div>

      <div className="resultado-principal">
        <div className="resultado-puntuacion">
          <div className="puntuacion-valor">{puntuacionFinal}</div>
          <div className="puntuacion-label">/ 100</div>
        </div>
        <div className="resultado-modalidad">
          <div className="modalidad-recomendada">{clasif.modalidad}</div>
          <div className="modalidad-simplificada">{clasif.simplificada}</div>
          <div className="modalidad-comparacion">
            {state.contexto.modalidadActual && (
              <span>Actual: {state.contexto.modalidadActual} → Recomendada: {clasif.modalidad}</span>
            )}
          </div>
        </div>
      </div>

      <ModalidadBar puntuacion={puntuacionFinal} />

      <div className="resultado-grid">
        <div className="resultado-card">
          <h4>Posición base</h4>
          <div className="card-value">{posicionBase}</div>
          <div className="card-desc">{tipologia?.nombre}</div>
        </div>
        {VARIABLES.map((v) => (
          <div key={v.id} className={`resultado-card ${variables[v.id] < 0 ? 'card-negative' : variables[v.id] > 0 ? 'card-positive' : ''}`}>
            <h4>{v.nombre}</h4>
            <div className="card-value">{variables[v.id] > 0 ? `+${variables[v.id]}` : variables[v.id]}</div>
            <div className="card-desc">
              {variables[v.id] < -5 ? 'Impacto alto' : variables[v.id] > 5 ? 'Impacto positivo' : 'Impacto neutro'}
              {state.ajustesManuales[v.id] && ' (ajustado)'}
            </div>
          </div>
        ))}
      </div>

      <div className="resultado-detalles">
        {varImpactoNegativo.length > 0 && (
          <div className="detalle-bloque">
            <h4>Variables con mayor impacto negativo</h4>
            {varImpactoNegativo.map((v) => (
              <div key={v.id} className="detalle-linea text-red">
                {v.nombre}: {variables[v.id]}
              </div>
            ))}
          </div>
        )}
        {varImpactoPositivo.length > 0 && (
          <div className="detalle-bloque">
            <h4>Variables con mayor impacto positivo</h4>
            {varImpactoPositivo.map((v) => (
              <div key={v.id} className="detalle-linea text-green">
                {v.nombre}: +{variables[v.id]}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="resultado-grid-2col">
        {riesgos.length > 0 && (
          <div className="riesgos-section">
            <h4>Principales riesgos</h4>
            <ul>
              {riesgos.map((r) => (
                <li key={r.variable}><strong>{r.variable}:</strong> {r.descripcion}</li>
              ))}
            </ul>
          </div>
        )}
        {fortalezas.length > 0 && (
          <div className="fortalezas-section">
            <h4>Principales fortalezas</h4>
            <ul>
              {fortalezas.map((f) => (
                <li key={f.variable}><strong>{f.variable}:</strong> {f.descripcion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="explicacion-box">
        <h4>Explicación del resultado</h4>
        <p>{explicacion}</p>
      </div>

      <div className="gobernanza-box">
        <h4>Recomendaciones de {gobernanza.label}</h4>
        <ul>
          {RECOMENDACIONES_GOBERNANZA[gobernanza.nivel].map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}>
          Anterior
        </button>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })}>
          Ver acciones priorizadas
        </button>
      </div>
    </div>
  )
}
