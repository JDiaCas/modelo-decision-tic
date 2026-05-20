import React, { useState } from 'react'
import { useApp } from './AppContext.jsx'
import { VARIABLES } from '../data/preguntas.js'
import { calcularMediaRespuestas, calcularImpactoPorPregunta } from '../utils/calculos.js'
import { obtenerInterpretacion } from '../utils/interpretaciones.js'

function BarraVariable({ valor, label }) {
  const pct = ((valor + 20) / 40) * 100
  const color = valor < -5 ? '#d32f2f' : valor > 5 ? '#2e7d32' : '#f57c00'

  return (
    <div className="barra-variable-container">
      <div className="barra-variable-label">{label}</div>
      <div className="barra-variable-track">
        <div className="barra-variable-scale">
          <span>-20</span>
          <span>-10</span>
          <span>0</span>
          <span>+10</span>
          <span>+20</span>
        </div>
        <div className="barra-variable-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
        <div className="barra-variable-value" style={{ left: `${pct}%` }}>{valor > 0 ? `+${valor}` : valor}</div>
      </div>
    </div>
  )
}

function PreguntaImpacto({ titulo, preguntas }) {
  if (!preguntas || preguntas.length === 0) return null
  return (
    <div className="impacto-item">
      <strong>{titulo}:</strong>{' '}
      {preguntas.map((p, i) => (
        <span key={p.id}>
          P{preguntas[0].id.slice(1)} ({p.texto.slice(0, 60)}…)
          {i < preguntas.length - 1 ? '; ' : ''}
        </span>
      ))}
    </div>
  )
}

export default function RevisionDiagnostico() {
  const { state, dispatch } = useApp()
  const [editando, setEditando] = useState(null)
  const [valorEdit, setValorEdit] = useState(0)
  const [justificacion, setJustificacion] = useState('')

  const fase = state.contexto.faseProyecto

  const getValor = (variableId) => {
    if (state.variablesAjustadas[variableId] !== undefined) return state.variablesAjustadas[variableId]
    return state.variablesCalculadas[variableId] ?? 0
  }

  const esAjustada = (variableId) => state.variablesAjustadas[variableId] !== undefined

  const handleEditar = (variableId) => {
    setEditando(variableId)
    setValorEdit(getValor(variableId))
    setJustificacion(state.ajustesManuales[variableId] || '')
  }

  const handleGuardar = () => {
    if (editando) {
      dispatch({ type: 'AJUSTAR_VARIABLE', payload: { id: editando, valor: valorEdit, justificacion } })
      setEditando(null)
    }
  }

  const handleRestaurar = (variableId) => {
    dispatch({ type: 'RESTAURAR_VARIABLE', payload: variableId })
  }

  return (
    <div className="section-card">
      <h2>Revisión del diagnóstico</h2>
      <p className="section-desc">
        Revisa los valores calculados para cada variable. Puedes ajustarlos manualmente si tu contexto lo justifica.
      </p>

      <div className="info-banner">
        <strong>Fase del proyecto:</strong> {fase || 'No definida'}
        {state.fasePreguntasAdaptadas && <span> · Diagnóstico calculado con preguntas adaptadas a esta fase.</span>}
      </div>

      {VARIABLES.map((variable) => {
        const valor = getValor(variable.id)
        const media = calcularMediaRespuestas(state.respuestas, variable.id, fase)
        const impactos = calcularImpactoPorPregunta(state.respuestas, variable.id, fase)
        const interpretacion = obtenerInterpretacion(variable.id, valor)
        const mayorPeso = [...impactos].sort((a, b) => b.peso - a.peso)[0]
        const mayorNegativo = [...impactos].filter(i => i.impacto < 0).sort((a, b) => a.impacto - b.impacto)[0]
        const mayorPositivo = [...impactos].filter(i => i.impacto > 0).sort((a, b) => b.impacto - a.impacto)[0]

        return (
          <div key={variable.id} className={`variable-revision ${esAjustada(variable.id) ? 'ajustada' : ''}`}>
            <div className="revision-header">
              <h3>{variable.nombre}</h3>
              {esAjustada(variable.id) && <span className="badge badge-amber">Ajustado manualmente</span>}
            </div>

            <BarraVariable valor={valor} label={`Valor: ${valor > 0 ? '+' : ''}${valor}`} />

            <div className="revision-detalles">
              <div className="detalle-item">
                <span className="detalle-label">Media de respuestas:</span>
                <span className="detalle-value">{media.toFixed(2)} / 5</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Pregunta con mayor peso:</span>
                <span className="detalle-value">{mayorPeso ? `P${mayorPeso.id.slice(1)} (${mayorPeso.peso})` : '-'}</span>
              </div>
              {mayorNegativo && (
                <div className="detalle-item">
                  <span className="detalle-label">Mayor impacto negativo:</span>
                  <span className="detalle-value text-red">P{mayorNegativo.id.slice(1)} ({mayorNegativo.impacto})</span>
                </div>
              )}
              {mayorPositivo && (
                <div className="detalle-item">
                  <span className="detalle-label">Mayor impacto positivo:</span>
                  <span className="detalle-value text-green">P{mayorPositivo.id.slice(1)} (+{mayorPositivo.impacto})</span>
                </div>
              )}
            </div>

            <div className="interpretacion">{interpretacion}</div>

            <div className="revision-actions">
              {editando === variable.id ? (
                <div className="editar-variable">
                  <div className="form-group">
                    <label>Valor ajustado ({variable.id})</label>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="0.5"
                      value={valorEdit}
                      onChange={(e) => setValorEdit(parseFloat(e.target.value))}
                    />
                    <span className="range-value">{valorEdit > 0 ? `+${valorEdit}` : valorEdit}</span>
                  </div>
                  <div className="form-group">
                    <label>Justificación del ajuste</label>
                    <textarea
                      value={justificacion}
                      onChange={(e) => setJustificacion(e.target.value)}
                      placeholder="Explica por qué ajustas este valor"
                      rows={2}
                    />
                  </div>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-primary" onClick={handleGuardar}>Guardar ajuste</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditando(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEditar(variable.id)}>
                    Ajustar manualmente
                  </button>
                  {esAjustada(variable.id) && (
                    <button className="btn btn-sm btn-outline" onClick={() => handleRestaurar(variable.id)}>
                      Restaurar valor automático
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}

      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>
          Anterior
        </button>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}>
          Ver resultado del modelo
        </button>
      </div>
    </div>
  )
}
