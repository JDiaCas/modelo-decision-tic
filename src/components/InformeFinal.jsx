import React, { useRef, useMemo, useState } from 'react'
import { useApp } from './AppContext.jsx'
import ListaAnalisis from './ListaAnalisis.jsx'
import { TIPOLOGIAS } from '../data/tipologias.js'
import { VARIABLES } from '../data/preguntas.js'
import { PLANTILLAS, PLANTILLA_VACIA } from '../data/plantillas.js'
import { ACCIONES_POR_VARIABLE, AREA_NOMBRES, enrichAction } from '../data/playbook.js'
import { SECCIONES_CHECKLIST } from '../data/checklist.js'
import { calcularPosicionFinal, clasificarModalidad, calcularNivelGobernanza, getAccionesPriorizadas, resumenChecklist } from '../utils/calculos.js'
import { obtenerRiesgosYFortalezas, RECOMENDACIONES_GOBERNANZA } from '../utils/interpretaciones.js'

function calcularPct(items, estadoMap) {
  let total = 0
  let sum = 0
  for (const item of items) {
    const est = estadoMap[item.id] || 'pendiente'
    if (est === 'no_aplica') continue
    total++
    if (est === 'completado') sum += 100
    else if (est === 'en_curso') sum += 50
  }
  return total === 0 ? 0 : Math.round(sum / total)
}

function nivelLabel(pct) {
  if (pct < 50) return 'Bajo'
  if (pct < 75) return 'Medio'
  return 'Alto'
}

export default function InformeFinal() {
  const { state, dispatch, getVariables } = useApp()
  const [showSaved, setShowSaved] = useState(false)
  const reportRef = useRef()
  const variables = getVariables()
  const tipologia = TIPOLOGIAS.find((t) => t.id === state.contexto.tipologia)
  const posicionBase = tipologia ? tipologia.posicionBase : 0
  const puntuacionFinal = calcularPosicionFinal(posicionBase, variables)
  const clasif = clasificarModalidad(puntuacionFinal)
  const gobernanza = calcularNivelGobernanza(puntuacionFinal, variables)
  const { riesgos, fortalezas } = obtenerRiesgosYFortalezas(variables)

  const plantillaInfo = state.plantilla
    ? PLANTILLAS.find(p => p.id === state.plantilla)
    : null

  const topAcciones = useMemo(() => {
    const enriched = {}
    for (const [varId, accs] of Object.entries(ACCIONES_POR_VARIABLE)) {
      enriched[varId] = accs.map(a => enrichAction(a, varId))
    }
    const puntuacion = calcularPosicionFinal(
      TIPOLOGIAS.find(t => t.id === state.contexto.tipologia)?.posicionBase || 0,
      variables
    )
    const modalidadRec = clasificarModalidad(puntuacion).modalidad
    const { activas } = getAccionesPriorizadas(
      enriched, variables, state.respuestas,
      state.contexto.faseProyecto, modalidadRec,
      state.accionesEstado, state.checklist
    )
    return activas.slice(0, 5)
  }, [variables, state.respuestas, state.contexto.faseProyecto, state.contexto.tipologia, state.accionesEstado, state.checklist])

  const globalPct = useMemo(() => {
    const allItems = SECCIONES_CHECKLIST.flatMap(s => s.items)
    return calcularPct(allItems, state.checklist)
  }, [state.checklist])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="section-card">
      {showSaved && <ListaAnalisis onClose={() => setShowSaved(false)} />}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-sm btn-primary" onClick={() => setShowSaved(true)}>
          Ver análisis guardados
        </button>
      </div>

      <div ref={reportRef} className="informe-final">
        <div className="informe-header">
          <h2>Informe final del análisis</h2>
          <p className="informe-fecha">Generado el {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        <div className="informe-seccion">
          <h3>Datos del proyecto</h3>
          <table className="informe-tabla">
            <tbody>
              <tr><td>Nombre</td><td>{state.contexto.nombre}</td></tr>
              <tr><td>Descripción</td><td>{state.contexto.descripcion || '—'}</td></tr>
              <tr><td>Tipología funcional</td><td>{tipologia?.nombre}</td></tr>
              <tr><td>Modalidad actual</td><td>{state.contexto.modalidadActual || '—'}</td></tr>
              <tr><td>Fase del proyecto</td><td>{state.contexto.faseProyecto}</td></tr>
              <tr><td>Tamaño del equipo</td><td>{state.contexto.tamanoEquipo || '—'}</td></tr>
              <tr>
                <td>Plantilla utilizada</td>
                <td>{plantillaInfo ? plantillaInfo.nombre : (state.contexto.nombre ? 'Proyecto desde cero' : '—')}</td>
              </tr>
              <tr>
                <td>Stakeholders</td>
                <td>{(state.contexto.stakeholders || []).length > 0
                  ? state.contexto.stakeholders.join(', ')
                  : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="informe-seccion">
          <h3>Resultado del modelo</h3>
          <table className="informe-tabla">
            <tbody>
              <tr><td>Posición base</td><td>{posicionBase}</td></tr>
              <tr><td>Puntuación final</td><td>{puntuacionFinal} / 100</td></tr>
              <tr><td>Modalidad recomendada</td><td><strong>{clasif.modalidad}</strong></td></tr>
              <tr><td>Clasificación simplificada</td><td>{clasif.simplificada}</td></tr>
              <tr><td>Nivel de gobernanza</td><td>{gobernanza.label}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="informe-seccion">
          <h3>Variables operativas</h3>
          <p className="nota-adaptacion">
            <em>Fase del proyecto: {state.contexto.faseProyecto}.</em>
            {state.fasePreguntasAdaptadas && <em> La encuesta de diagnóstico se ha adaptado a la fase seleccionada.</em>}
          </p>
          <table className="informe-tabla">
            <thead>
              <tr><th>Variable</th><th>Valor</th><th>Origen</th></tr>
            </thead>
            <tbody>
              {VARIABLES.map((v) => (
                <tr key={v.id}>
                  <td>{v.nombre}</td>
                  <td className={variables[v.id] < 0 ? 'text-red' : variables[v.id] > 0 ? 'text-green' : ''}>
                    {variables[v.id] > 0 ? `+${variables[v.id]}` : variables[v.id]}
                  </td>
                  <td>{state.ajustesManuales[v.id] ? 'Ajustado manualmente' : 'Automático'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {Object.entries(state.ajustesManuales).filter(([, j]) => j).map(([id, just]) => (
            <p key={id} className="just-ajuste"><em>{VARIABLES.find(v => v.id === id)?.nombre}:</em> {just}</p>
          ))}
        </div>

        <div className="informe-seccion">
          <h3>Justificación de la recomendación</h3>
          <p>
            La modalidad recomendada es <strong>{clasif.modalidad}</strong> con una puntuación de {puntuacionFinal} sobre 100.
            Esta recomendación se basa en la tipología funcional ({tipologia?.nombre}, posición base {posicionBase})
            y el análisis de las cuatro variables operativas del proyecto, con preguntas adaptadas a la fase de <strong>{state.contexto.faseProyecto}</strong>.
          </p>
        </div>

        <div className="informe-seccion">
          <h3>Principales riesgos</h3>
          {riesgos.length > 0 ? (
            <ul>{riesgos.map((r) => <li key={r.variable}><strong>{r.variable}:</strong> {r.descripcion}</li>)}</ul>
          ) : <p>No se identificaron riesgos significativos.</p>}
        </div>

        <div className="informe-seccion">
          <h3>Principales fortalezas</h3>
          {fortalezas.length > 0 ? (
            <ul>{fortalezas.map((f) => <li key={f.variable}><strong>{f.variable}:</strong> {f.descripcion}</li>)}</ul>
          ) : <p>No se identificaron fortalezas significativas.</p>}
        </div>

        <div className="informe-seccion">
          <h3>Top 5 acciones prioritarias</h3>
          <p className="nota-adaptacion">Priorización basada en impacto global, no solo en la peor variable.</p>
          <ol>
            {topAcciones.map((a, i) => (
              <li key={i}>
                <strong>[{a.tipo === 'correctiva' ? 'Correctiva' : a.tipo === 'preventiva' ? 'Preventiva' : 'Optimizadora'}] {AREA_NOMBRES[a.area]}:</strong>
                {' '}{a.accion}
                <br /><em className="motivo-informe">{a.motivo}</em>
              </li>
            ))}
          </ol>
        </div>
        {topAcciones.length === 0 && (
          <div className="informe-seccion">
            <h3>Acciones prioritarias</h3>
            <p>No se identificaron acciones prioritarias pendientes. El diagnóstico no muestra debilidades significativas.</p>
          </div>
        )}

        <div className="informe-seccion">
          <h3>Estado del checklist</h3>
          <p>Cumplimiento global: <strong>{globalPct}%</strong> ({nivelLabel(globalPct)})</p>
          {SECCIONES_CHECKLIST.map((sec) => {
            const pct = calcularPct(sec.items, state.checklist)
            return <p key={sec.id}>{sec.nombre}: {pct}%</p>
          })}
          <h4>Desglose por origen</h4>
          {(() => {
            const r = resumenChecklist(SECCIONES_CHECKLIST, state.checklist, state.origenChecklist)
            return (
              <table className="informe-tabla">
                <tbody>
                  <tr><td>Ítems automáticos</td><td>{r.automaticos}</td></tr>
                  <tr><td>Ítems modificados por PM</td><td>{r.modificados}</td></tr>
                </tbody>
              </table>
            )
          })()}
        </div>

        <div className="informe-seccion">
          <h3>Tareas de gestión generadas</h3>
          {state.tareas.length === 0 ? (
            <p>No se generaron tareas de gestión.</p>
          ) : (
            <>
              <p>Total de tareas: <strong>{state.tareas.length}</strong></p>
              <table className="informe-tabla">
                <tbody>
                  <tr><td>Tareas críticas</td><td>{state.tareas.filter(t => t.prioridad === 'Crítica').length}</td></tr>
                  <tr><td>Tareas altas</td><td>{state.tareas.filter(t => t.prioridad === 'Alta').length}</td></tr>
                  <tr><td>Tareas pendientes</td><td>{state.tareas.filter(t => t.estado === 'Pendiente').length}</td></tr>
                  <tr><td>Derivadas del playbook</td><td>{state.tareas.filter(t => t.origen === 'Playbook').length}</td></tr>
                  <tr><td>Derivadas del checklist</td><td>{state.tareas.filter(t => t.origen === 'Checklist').length}</td></tr>
                </tbody>
              </table>
              <p className="nota-adaptacion">
                Las tareas generadas mantienen trazabilidad con el diagnóstico, el checklist y las acciones priorizadas.
              </p>
              {state.tareas.filter(t => t.prioridad === 'Crítica' || t.prioridad === 'Alta').length > 0 && (
                <>
                  <h4>Top tareas recomendadas para exportar</h4>
                  <ul>
                    {state.tareas
                      .filter(t => t.prioridad === 'Crítica' || t.prioridad === 'Alta')
                      .slice(0, 5)
                      .map((t, i) => (
                        <li key={i}>
                          <strong>{t.titulo}</strong>
                          {t.responsable && <> — Responsable: {t.responsable}</>}
                          {t.fechaObjetivo && <> · Fecha: {t.fechaObjetivo}</>}
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>

        <div className="informe-seccion">
          <h3>Recomendaciones de gobernanza</h3>
          <ul>
            {RECOMENDACIONES_GOBERNANZA[gobernanza.nivel].map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        <div className="informe-seccion">
          <h3>Recomendaciones finales</h3>
          <p>
            Dado el perfil del proyecto y los resultados del análisis, se recomienda adoptar una modalidad
            <strong> {clasif.modalidad.toLowerCase()}</strong> con un nivel de gobernanza <strong>{gobernanza.nivel}</strong>.
            Se deben priorizar las acciones identificadas en el playbook operativo, especialmente aquellas
            relacionadas con las variables de mayor impacto negativo.
          </p>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 7 })}>
          Anterior
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          Imprimir / Exportar PDF
        </button>
        <button className="btn btn-outline" onClick={() => {
          dispatch({ type: 'RESET' })
          dispatch({ type: 'SET_STEP', payload: 0 })
        }}>
          Nuevo análisis
        </button>
      </div>
    </div>
  )
}
