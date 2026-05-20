import React, { useMemo, useState, useCallback } from 'react'
import { useApp } from './AppContext.jsx'
import { VARIABLES } from '../data/preguntas.js'
import { ACCIONES_POR_VARIABLE, AREA_NOMBRES, enrichAction } from '../data/playbook.js'
import {
  getAccionesPriorizadas,
  generarAnalisisPriorizacion,
  clasificarModalidad,
  calcularPosicionFinal,
} from '../utils/calculos.js'
import { TIPOLOGIAS } from '../data/tipologias.js'
import { crearTareaDesdeAccion } from '../utils/exportacionTareas.js'

const ESTADOS = ['Pendiente', 'En curso', 'Completado']
const TIPO_LABELS = { correctiva: 'Correctiva', preventiva: 'Preventiva', optimizadora: 'Optimizadora' }
const TIPO_COLORS = { correctiva: 'red', preventiva: 'amber', optimizadora: 'blue' }

export default function AccionesPriorizadas() {
  const { state, dispatch, getVariables } = useApp()
  const variables = getVariables()
  const [filtro, setFiltro] = useState('top10')

  const fase = state.contexto.faseProyecto
  const tipologia = TIPOLOGIAS.find((t) => t.id === state.contexto.tipologia)
  const posicionBase = tipologia ? tipologia.posicionBase : 0
  const puntuacionFinal = calcularPosicionFinal(posicionBase, variables)
  const modalidadRec = clasificarModalidad(puntuacionFinal).modalidad

  const accionesEnriquecidas = useMemo(() => {
    const enriched = {}
    for (const [varId, accs] of Object.entries(ACCIONES_POR_VARIABLE)) {
      enriched[varId] = accs.map(a => enrichAction(a, varId))
    }
    return enriched
  }, [])

  const { activas, cubiertas } = useMemo(() =>
    getAccionesPriorizadas(
      accionesEnriquecidas,
      variables,
      state.respuestas,
      fase,
      modalidadRec,
      state.accionesEstado,
      state.checklist
    ),
    [accionesEnriquecidas, variables, state.respuestas, fase, modalidadRec, state.accionesEstado, state.checklist]
  )

  const analisis = useMemo(() =>
    generarAnalisisPriorizacion(variables, state.respuestas, activas, cubiertas),
    [variables, state.respuestas, activas, cubiertas]
  )

  const filtradas = useMemo(() => {
    if (filtro === 'top10') return activas.slice(0, 10)
    if (filtro === 'correctivas') return activas.filter(a => a.tipo === 'correctiva')
    return activas
  }, [filtro, activas])

  const handleEstadoChange = useCallback((id, estado) => {
    dispatch({ type: 'SET_ACCION_ESTADO', payload: { id, estado } })
  }, [dispatch])

  const [tareaMsg, setTareaMsg] = useState('')
  const nombreProyecto = state.contexto.nombre || '(sin nombre)'

  const handleCrearTarea = useCallback((accion) => {
    const tarea = crearTareaDesdeAccion(accion, nombreProyecto)
    dispatch({ type: 'ADD_TAREA', payload: tarea })
    setTareaMsg(`Tarea creada: "${accion.accion.slice(0, 40)}..."`)
    setTimeout(() => setTareaMsg(''), 3000)
  }, [dispatch, nombreProyecto])

  const handleCrearTareasTop10 = useCallback(() => {
    const top10 = activas.slice(0, 10)
    const tareas = top10.map(a => crearTareaDesdeAccion(a, nombreProyecto))
    dispatch({ type: 'SET_MULTIPLE_TAREAS', payload: tareas })
    setTareaMsg(`Se crearon ${tareas.length} tareas desde el Top 10.`)
    setTimeout(() => setTareaMsg(''), 4000)
  }, [dispatch, activas, nombreProyecto])

  const textosFiltro = {
    top10: 'Mostrando las 10 acciones con mayor prioridad global.',
    correctivas: 'Mostrando acciones correctivas derivadas de debilidades o riesgos detectados.',
    todas: 'Mostrando todas las acciones recomendadas por el diagnóstico.',
  }

  return (
    <div className="section-card">
      <h2>Acciones priorizadas del playbook</h2>
      <p className="section-desc">
        Acciones ordenadas por prioridad global según el diagnóstico completo del proyecto.
      </p>

      <div className="analisis-global-box">
        <h4>Análisis global de priorización</h4>
        <p>{analisis}</p>
      </div>

      {/* Filtros principales */}
      <div className="filtros-acciones-principales">
        <span className="filtros-label">Mostrar:</span>
        {[
          { key: 'top10', label: 'Top 10' },
          { key: 'correctivas', label: 'Correctivas' },
          { key: 'todas', label: 'Todas' },
        ].map(f => (
          <button
            key={f.key}
            className={`btn btn-sm ${filtro === f.key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="filtro-desc">
        {textosFiltro[filtro]}
        <span className="acciones-count">
          {' '}· {filtradas.length} {filtro === 'correctivas' ? 'acciones correctivas' :
            filtro === 'top10' ? `de ${activas.length} acciones recomendadas` :
            'acciones recomendadas'}
        </span>
      </div>

      {tareaMsg && <div className="tarea-toast">{tareaMsg}</div>}

      <div className="acciones-tarea-bulk">
        <button className="btn btn-sm btn-primary" onClick={handleCrearTareasTop10} disabled={activas.length === 0}>
          Crear tareas desde Top 10
        </button>
      </div>

      {filtradas.length === 0 ? (
        <div className="empty-acciones">
          <p>No hay acciones que mostrar con el filtro actual.</p>
        </div>
      ) : (
        <div className="tabla-acciones-wrapper">
          <table className="tabla-acciones">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Variable</th>
                <th>Área</th>
                <th>Acción recomendada</th>
                <th>Motivo / Justificación</th>
                <th>Estado</th>
                <th>Tarea</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((acc, idx) => (
                <tr key={acc.id}>
                  <td className="td-prioridad">{idx + 1}</td>
                  <td>
                    <span className={`badge badge-${TIPO_COLORS[acc.tipo] || 'gray'}`}>
                      {TIPO_LABELS[acc.tipo] || acc.tipo}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${acc.variable === 'criticidad' ? 'red' : acc.variable === 'coordinacion' ? 'amber' : acc.variable === 'madurez' ? 'blue' : 'purple'}`}>
                      {acc.variable === 'criticidad' ? 'Criticidad' :
                       acc.variable === 'coordinacion' ? 'Coordinación' :
                       acc.variable === 'madurez' ? 'Madurez' : 'Riesgo'}
                    </span>
                  </td>
                  <td>{AREA_NOMBRES[acc.area] || acc.area}</td>
                  <td className="td-accion">{acc.accion}</td>
                  <td className="td-motivo">{acc.motivo}</td>
                  <td>
                    <select
                      value={acc.estado}
                      onChange={(e) => handleEstadoChange(acc.id, e.target.value)}
                      className="estado-select"
                    >
                      {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handleCrearTarea(acc)}
                      title="Crear tarea desde esta acción"
                    >
                      +Tarea
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Covered actions */}
      {cubiertas.filter(c => c.prioridad > -999).length > 0 && (
        <details className="cubiertas-section">
          <summary className="cubiertas-toggle">
            Acciones cubiertas por el diagnóstico ({cubiertas.filter(c => c.prioridad > -999).length})
          </summary>
          <div className="cubiertas-lista">
            <p className="cubiertas-desc">
              Estas acciones no se recomiendan como prioritarias porque el diagnóstico indica que ya están cubiertas.
            </p>
            <table className="tabla-acciones">
              <thead>
                <tr><th>Variable</th><th>Área</th><th>Acción</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {cubiertas.filter(c => c.prioridad > -999).map((acc) => (
                  <tr key={acc.id} className="cubierta-row">
                    <td>{acc.variable}</td>
                    <td>{AREA_NOMBRES[acc.area]}</td>
                    <td className="td-accion">{acc.accion}</td>
                    <td><span className="badge badge-green">Cubierta</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}>
          Anterior
        </button>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'SET_STEP', payload: 6 })}>
          Ir al checklist del PM
        </button>
      </div>
    </div>
  )
}
