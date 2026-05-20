import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useApp } from './AppContext.jsx'
import { SECCIONES_CHECKLIST, ESTADOS_CHECKLIST } from '../data/checklist.js'
import { calcularEstadoItemAutomatico, generarExplicacionChecklist, resumenChecklist, calcularPctChecklist } from '../utils/calculos.js'
import { crearTareaDesdeChecklist } from '../utils/exportacionTareas.js'

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  en_curso: 'En curso',
  completado: 'Completado',
  no_aplica: 'N/A',
}

const ESTADO_COLORS = {
  pendiente: 'red',
  en_curso: 'amber',
  completado: 'green',
  no_aplica: 'gray',
}

export default function ChecklistPM() {
  const { state, dispatch, getVariables } = useApp()
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [filtroOrigen, setFiltroOrigen] = useState('todas')
  const [autoGenerado, setAutoGenerado] = useState(false)
  const [seccionesExpandidas, setSeccionesExpandidas] = useState(() => {
    const s = {}
    for (const sec of SECCIONES_CHECKLIST) s[sec.id] = false
    return s
  })
  const [tareaMsg, setTareaMsg] = useState('')
  const nombreProyecto = state.contexto.nombre || '(sin nombre)'

  const handleCrearTarea = useCallback((item, seccionNombre, estado) => {
    const tarea = crearTareaDesdeChecklist(item, seccionNombre, estado, nombreProyecto)
    dispatch({ type: 'ADD_TAREA', payload: tarea })
    setTareaMsg(`Tarea creada: "${item.texto.slice(0, 40)}..."`)
    setTimeout(() => setTareaMsg(''), 3000)
  }, [dispatch, nombreProyecto])

  const handleCrearTareasPendientes = useCallback(() => {
    const pendientes = []
    for (const sec of SECCIONES_CHECKLIST) {
      for (const item of sec.items) {
        const est = state.checklist[item.id] || 'pendiente'
        if (est === 'pendiente' || est === 'en_curso') {
          const tarea = crearTareaDesdeChecklist(item, sec.nombre, est, nombreProyecto)
          pendientes.push(tarea)
        }
      }
    }
    dispatch({ type: 'SET_MULTIPLE_TAREAS', payload: pendientes })
    setTareaMsg(`Se crearon ${pendientes.length} tareas desde el checklist.`)
    setTimeout(() => setTareaMsg(''), 4000)
  }, [dispatch, state.checklist, nombreProyecto])

  // Generate auto-checklist if not done yet
  useEffect(() => {
    if (autoGenerado) return
    const preguntasRespondidas = Object.values(state.respuestas).some(v => v != null)
    if (!preguntasRespondidas) return

    const auto = {}
    const explicaciones = {}
    for (const sec of SECCIONES_CHECKLIST) {
      for (const item of sec.items) {
        const estado = calcularEstadoItemAutomatico(item, state.respuestas)
        auto[item.id] = estado
        explicaciones[item.id] = generarExplicacionChecklist(item, state.respuestas)
      }
    }

    dispatch({ type: 'SET_CHECKLIST_AUTO', payload: { auto, explicaciones } })

    // Only set initial checklist if user has not manually edited anything
    const hasManualChanges = Object.values(state.origenChecklist).some(o => o === 'modificado')
    if (!hasManualChanges) {
      const updates = {}
      const origenes = {}
      for (const sec of SECCIONES_CHECKLIST) {
        for (const item of sec.items) {
          updates[item.id] = auto[item.id]
          origenes[item.id] = 'automatico'
        }
      }
      dispatch({ type: 'SET_CHECKLIST', payload: updates })
      dispatch({ type: 'SET_CHECKLIST_ORIGEN', payload: origenes })
    }
    setAutoGenerado(true)
  }, [state.respuestas, state.origenChecklist, dispatch, autoGenerado])

  const handleEstadoChange = useCallback((itemId, valor) => {
    dispatch({ type: 'SET_CHECKLIST', payload: { [itemId]: valor } })
    dispatch({ type: 'SET_CHECKLIST_ORIGEN', payload: { [itemId]: 'modificado' } })
  }, [dispatch])

  const restaurarAutomatico = useCallback((itemId) => {
    const autoEstado = state.checklistAuto[itemId]
    if (autoEstado) {
      dispatch({ type: 'SET_CHECKLIST', payload: { [itemId]: autoEstado } })
      dispatch({ type: 'SET_CHECKLIST_ORIGEN', payload: { [itemId]: 'automatico' } })
    }
  }, [state.checklistAuto, dispatch])

  const pctGlobal = useMemo(() => {
    const todos = SECCIONES_CHECKLIST.flatMap(s => s.items)
    return calcularPctChecklist(todos, state.checklist)
  }, [state.checklist])

  const resumen = useMemo(() =>
    resumenChecklist(SECCIONES_CHECKLIST, state.checklist, state.origenChecklist),
    [state.checklist, state.origenChecklist]
  )

  const seccionesFiltradas = useMemo(() => {
    return SECCIONES_CHECKLIST.map(sec => ({
      ...sec,
      items: sec.items.filter(item => {
        const estadoMatch = filtroEstado === 'todas' || item.id === filtroEstado ||
          state.checklist[item.id] === filtroEstado
        const origen = state.origenChecklist[item.id] || 'automatico'
        const origenMatch = filtroOrigen === 'todas' || origen === filtroOrigen
        return estadoMatch && origenMatch
      }),
    })).filter(sec => sec.items.length > 0)
  }, [filtroEstado, filtroOrigen, state.checklist, state.origenChecklist])

  const toggleSeccion = useCallback((id) => {
    setSeccionesExpandidas(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  return (
    <div className="section-card">
      <h2>Checklist del Project Manager</h2>
      <p className="section-desc">
        Revisa y completa los elementos de gestión para garantizar el éxito del proyecto.
        Los estados se calculan automáticamente según las respuestas de la encuesta.
      </p>

      {/* Progress */}
      <div className="checklist-progress">
        <div className="progress-bar-checklist">
          <div className="progress-fill-checklist" style={{ width: `${pctGlobal}%` }} />
        </div>
        <span className="progress-label-checklist">{pctGlobal}% completado</span>
      </div>

      {/* Summary */}
      <div className="checklist-resumen">
        <div className="resumen-item"><span className="badge badge-green">{resumen.completados}</span> Completados</div>
        <div className="resumen-item"><span className="badge badge-amber">{resumen.enCurso}</span> En curso</div>
        <div className="resumen-item"><span className="badge badge-red">{resumen.pendientes}</span> Pendientes</div>
        <div className="resumen-item"><span className="badge badge-gray">{resumen.noAplica}</span> N/A</div>
        <div className="resumen-item"><span className="badge badge-blue">{resumen.automaticos}</span> Automáticos</div>
        <div className="resumen-item"><span className="badge badge-purple">{resumen.modificados}</span> Modificados</div>
      </div>

      {/* Filters */}
      <div className="checklist-filtros">
        <div className="filtro-group">
          <label>Estado:</label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="todas">Todas</option>
            {ESTADOS_CHECKLIST.map(e => (
              <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
            ))}
          </select>
        </div>
        <div className="filtro-group">
          <label>Origen:</label>
          <select value={filtroOrigen} onChange={e => setFiltroOrigen(e.target.value)}>
            <option value="todas">Todos</option>
            <option value="automatico">Automáticos</option>
            <option value="modificado">Modificados por PM</option>
          </select>
        </div>
      </div>

      {tareaMsg && <div className="tarea-toast">{tareaMsg}</div>}

      <div className="acciones-tarea-bulk">
        <button className="btn btn-sm btn-primary" onClick={handleCrearTareasPendientes}>
          Crear tareas desde pendientes
        </button>
      </div>

      {/* Sections */}
      {seccionesFiltradas.length === 0 ? (
        <div className="empty-acciones">
          <p>No hay elementos que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        seccionesFiltradas.map(sec => {
          const secPct = calcularPctChecklist(sec.items, state.checklist)
          return (
            <div key={sec.id} className="checklist-section">
              <div className="seccion-header" onClick={() => toggleSeccion(sec.id)}>
                <div className="seccion-titulo">
                  <span className={`seccion-arrow ${seccionesExpandidas[sec.id] ? 'expanded' : ''}`}>▶</span>
                  <h3>{sec.nombre}</h3>
                </div>
                <div className="seccion-metadata">
                  <div className="mini-progress">
                    <div className="mini-progress-fill" style={{ width: `${secPct}%` }} />
                  </div>
                  <span className="seccion-count">{sec.items.length} ítems</span>
                </div>
              </div>

              {seccionesExpandidas[sec.id] && (
                <div className="seccion-items">
                  <table className="tabla-checklist">
                    <thead>
                      <tr>
                        <th>Elemento</th>
                        <th>Estado</th>
                        <th>Origen</th>
                        <th>Acción</th>
                        <th>Tarea</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sec.items.map(item => {
                        const estado = state.checklist[item.id] || 'pendiente'
                        const origen = state.origenChecklist[item.id] || 'automatico'
                        const explicacion = state.explicacionesChecklist[item.id] || ''
                        return (
                          <tr key={item.id}>
                            <td className="td-check-texto">
                              {item.texto}
                              {explicacion && (
                                <details className="check-explicacion">
                                  <summary>Ver justificación</summary>
                                  <p className="explicacion-texto">{explicacion}</p>
                                </details>
                              )}
                            </td>
                            <td>
                              <select
                                value={estado}
                                onChange={e => handleEstadoChange(item.id, e.target.value)}
                                className="estado-select"
                              >
                                {ESTADOS_CHECKLIST.map(e => (
                                  <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <span className={`badge badge-${origen === 'modificado' ? 'purple' : 'blue'} badge-origen`}>
                                {origen === 'modificado' ? 'Modificado por PM' : 'Automático'}
                              </span>
                            </td>
                            <td>
                              {origen === 'modificado' && (
                                <button
                                  className="btn btn-xs btn-outline"
                                  onClick={() => restaurarAutomatico(item.id)}
                                  title="Restaurar estado automático"
                                >
                                  Restaurar
                                </button>
                              )}
                            </td>
                            <td>
                              {(estado === 'pendiente' || estado === 'en_curso') && (
                                <button
                                  className="btn btn-xs btn-outline"
                                  onClick={() => handleCrearTarea(item, sec.nombre, estado)}
                                  title="Crear tarea desde este ítem"
                                >
                                  +Tarea
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })
      )}

      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })}>
          Anterior
        </button>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'SET_STEP', payload: 7 })}>
          Ir a tareas de gestión
        </button>
      </div>
    </div>
  )
}
