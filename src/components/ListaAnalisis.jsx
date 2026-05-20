import React, { useState, useCallback, useRef } from 'react'
import { useApp } from './AppContext.jsx'
import { obtenerTodos, eliminarAnalisis, duplicarAnalisis, importarAnalisisDesdeJson, guardarAnalisis, exportarAnalisisAJson } from '../data/analisisGuardados.js'
import { TIPOLOGIAS } from '../data/tipologias.js'
import { VARIABLES } from '../data/preguntas.js'
import { clasificarModalidad, calcularPosicionFinal, calcularNivelGobernanza } from '../utils/calculos.js'

function buildSnapshot(state) {
  const tipologiaObj = TIPOLOGIAS.find(t => t.id === state.contexto.tipologia)
  const posicionBase = tipologiaObj?.posicionBase || 0
  const variables = buildVariables(state)
  const puntuacionFinal = calcularPosicionFinal(posicionBase, variables)
  const clasif = clasificarModalidad(puntuacionFinal)
  const gob = calcularNivelGobernanza(puntuacionFinal, variables)

  return {
    id: state.analisisActualId || 'a_' + Date.now().toString(36),
    fechaCreacion: new Date().toISOString(),
    ultimaModificacion: new Date().toISOString(),
    contexto: state.contexto,
    respuestas: state.respuestas,
    variablesCalculadas: state.variablesCalculadas,
    variablesAjustadas: state.variablesAjustadas,
    ajustesManuales: state.ajustesManuales,
    accionesEstado: state.accionesEstado,
    checklist: state.checklist,
    checklistAuto: state.checklistAuto,
    explicacionesChecklist: state.explicacionesChecklist,
    origenChecklist: state.origenChecklist,
    tareas: state.tareas,
    maxStepReached: state.maxStepReached,
    plantilla: state.plantilla,
    fasePreguntasAdaptadas: state.fasePreguntasAdaptadas,
    modalidadRecomendada: clasif.modalidad,
    puntuacionFinal,
    nivelGobernanza: gob.nivel,
    labelGobernanza: gob.label,
  }
}

function buildVariables(state) {
  const final = {}
  for (const v of VARIABLES) {
    if (state.variablesAjustadas[v.id] !== undefined) {
      final[v.id] = state.variablesAjustadas[v.id]
    } else if (state.variablesCalculadas[v.id] !== undefined) {
      final[v.id] = state.variablesCalculadas[v.id]
    } else {
      final[v.id] = 0
    }
  }
  return final
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  } catch { return iso }
}

export default function ListaAnalisis({ onClose }) {
  const { state, dispatch } = useApp()
  const [analisis, setAnalisis] = useState(() => obtenerTodos())
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef(null)

  const refresh = useCallback(() => {
    setAnalisis(obtenerTodos())
  }, [])

  const handleOpen = useCallback((a) => {
    dispatch({ type: 'LOAD_ANALISIS', payload: a })
    if (onClose) onClose()
  }, [dispatch, onClose])

  const handleDuplicate = useCallback((id) => {
    duplicarAnalisis(id)
    refresh()
  }, [refresh])

  const handleDelete = useCallback((id) => {
    if (confirm('¿Eliminar este análisis?')) {
      eliminarAnalisis(id)
      refresh()
    }
  }, [refresh])

  const handleImport = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    importarAnalisisDesdeJson(file)
      .then(() => { refresh(); setImportError('') })
      .catch(err => setImportError(err.message))
    e.target.value = ''
  }, [refresh])

  const handleSaveCurrent = useCallback(() => {
    const data = buildSnapshot(state)
    guardarAnalisis(data)
    refresh()
  }, [state, refresh])

  const exportJson = useCallback((a) => {
    exportarAnalisisAJson(a.id)
  }, [])

  return (
    <div className="lista-analisis-overlay" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose() }}>
      <div className="lista-analisis-panel">
        <div className="lista-analisis-header">
          <h2>Análisis guardados</h2>
          <p className="section-desc">
            Los análisis se guardan localmente en este navegador. No se envían a ningún servidor.
          </p>
          <button className="btn btn-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="lista-analisis-toolbar">
          <button className="btn btn-primary" onClick={handleSaveCurrent}>
            Guardar análisis actual
          </button>
          <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
            Importar JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
        {importError && <p className="text-red" style={{ fontSize: 13 }}>{importError}</p>}

        {analisis.length === 0 ? (
          <div className="empty-acciones">
            <p>No hay análisis guardados. Completa un diagnóstico y guárdalo para verlo aquí.</p>
          </div>
        ) : (
          <div className="lista-analisis-content">
            {analisis.map(a => (
              <div key={a.id} className="analisis-card">
                <div className="analisis-card-header">
                  <h3>{a.contexto?.nombre || '(sin nombre)'}</h3>
                  <div className="analisis-card-badges">
                    <span className="badge badge-primary">{a.modalidadRecomendada || '—'}</span>
                    <span className="badge badge-blue">{a.puntuacionFinal != null ? `${a.puntuacionFinal}/100` : '—'}</span>
                  </div>
                </div>
                <div className="analisis-card-meta">
                  <span>Creado: {formatDate(a.fechaCreacion)}</span>
                  <span>Modificado: {formatDate(a.ultimaModificacion)}</span>
                  {a.contexto?.tipologia && (
                    <span>{TIPOLOGIAS.find(t => t.id === a.contexto.tipologia)?.nombre || a.contexto.tipologia}</span>
                  )}
                  {a.contexto?.faseProyecto && <span>Fase: {a.contexto.faseProyecto}</span>}
                  {a.tareas?.length > 0 && <span>{a.tareas.length} tareas</span>}
                </div>
                <div className="analisis-card-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => handleOpen(a)}>
                    Abrir
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => handleDuplicate(a.id)}>
                    Duplicar
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => exportJson(a)}>
                    Exportar JSON
                  </button>
                  <button className="btn btn-sm btn-outline tarea-delete" onClick={() => handleDelete(a.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
