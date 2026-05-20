import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useApp } from './AppContext.jsx'
import { getBloquesParaFase } from '../data/preguntas.js'

// LABELS removed — now uses per-question responseOptions from preguntas.js

const VAR_NOMBRES = {
  criticidad: 'Criticidad',
  coordinacion: 'Coordinación síncrona',
  madurez: 'Madurez organizativa',
  riesgo: 'Riesgo operativo',
}

const VAR_ICONS = {
  criticidad: '⚠',
  coordinacion: '🔗',
  madurez: '📋',
  riesgo: '⚡',
}

export default function EncuestaDiagnostico() {
  const { state, dispatch } = useApp()
  const fase = state.contexto.faseProyecto
  const [blockIndex, setBlockIndex] = useState(0)
  const [errores, setErrores] = useState({})
  const [mostrarError, setMostrarError] = useState(false)
  const bloqueRefs = useRef({})

  const bloques = useMemo(() => getBloquesParaFase(fase), [fase])
  const bloqueActual = bloques[blockIndex]

  const preguntaIdsBloque = useMemo(() => {
    const map = {}
    for (const bloque of bloques) {
      map[bloque.variableId] = new Set(bloque.preguntas.map(p => p.id))
    }
    return map
  }, [bloques])

  const handleRespuesta = useCallback((preguntaId, valor) => {
    dispatch({ type: 'SET_RESPUESTAS', payload: { [preguntaId]: parseInt(valor) } })
    setErrores(prev => ({ ...prev, [preguntaId]: false }))
    setMostrarError(false)
  }, [dispatch])

  const preguntasSinResponder = useCallback((bloque) => {
    return bloque.preguntas.filter(p => state.respuestas[p.id] == null)
  }, [state.respuestas])

  const validarBloque = useCallback((bloque) => {
    const sinResponder = preguntasSinResponder(bloque)
    if (sinResponder.length > 0) {
      const nuevosErrores = {}
      for (const p of sinResponder) {
        nuevosErrores[p.id] = true
      }
      setErrores(nuevosErrores)
      setMostrarError(true)
      const firstId = sinResponder[0].id
      setTimeout(() => {
        const el = document.getElementById(`pregunta-${firstId}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
      return false
    }
    return true
  }, [preguntasSinResponder])

  const handleSiguiente = useCallback(() => {
    if (validarBloque(bloqueActual)) {
      setErrores({})
      setMostrarError(false)
      setBlockIndex(prev => Math.min(prev + 1, bloques.length - 1))
    }
  }, [validarBloque, bloqueActual, bloques.length])

  const handleAnterior = useCallback(() => {
    setErrores({})
    setMostrarError(false)
    setBlockIndex(prev => Math.max(prev - 1, 0))
  }, [])

  const handleFinalizar = useCallback(() => {
    if (validarBloque(bloqueActual)) {
      dispatch({ type: 'CALCULAR_VARIABLES' })
      dispatch({ type: 'SET_STEP', payload: 3 })
    }
  }, [validarBloque, bloqueActual, dispatch])

  const statusBloque = useCallback((bloque) => {
    const total = bloque.preguntas.length
    const respondidas = bloque.preguntas.filter(p => state.respuestas[p.id] != null).length
    if (respondidas === 0) return { label: 'Pendiente', class: 'pendiente' }
    if (respondidas < total) return { label: 'En curso', class: 'en-curso' }
    return { label: 'Completado', class: 'completado' }
  }, [state.respuestas])

  const pctBloque = useCallback((bloque) => {
    const total = bloque.preguntas.length
    const respondidas = bloque.preguntas.filter(p => state.respuestas[p.id] != null).length
    return total === 0 ? 0 : Math.round((respondidas / total) * 100)
  }, [state.respuestas])

  const totalRespondidasGlobal = useMemo(() => {
    let count = 0
    for (const bloque of bloques) {
      count += bloque.preguntas.filter(p => state.respuestas[p.id] != null).length
    }
    return count
  }, [bloques, state.respuestas])

  const totalPreguntas = useMemo(() => {
    return bloques.reduce((sum, b) => sum + b.preguntas.length, 0)
  }, [bloques])

  const pctGlobal = totalPreguntas === 0 ? 0 : Math.round((totalRespondidasGlobal / totalPreguntas) * 100)

  return (
    <div className="section-card">
      <h2>Encuesta de diagnóstico</h2>

      <div className="info-banner">
        <strong>Fase del proyecto:</strong> {fase || 'No definida'}
        {fase && <span> · Las preguntas se han adaptado a la fase <strong>"{fase}"</strong>.</span>}
      </div>
      {state.faseAdvertencia && (
        <div className="warning-banner">
          Cambiar la fase puede modificar las preguntas de diagnóstico. Revisa tus respuestas antes de recalcular el resultado.
        </div>
      )}
      <p className="section-desc">
        Responde cada pregunta según tu evaluación del proyecto. Escala del 1 (muy bajo / favorable para remoto)
        al 5 (muy alto / exige más control).
      </p>

      {/* Progress indicator */}
      <div className="encuesta-progress">
        <div className="encuesta-step-info">
          Paso {blockIndex + 1} de {bloques.length}: <strong>{VAR_NOMBRES[bloqueActual?.variableId]}</strong>
        </div>
        <div className="encuesta-pct-bar">
          <div className="encuesta-pct-fill" style={{ width: `${pctGlobal}%` }} />
        </div>
        <div className="encuesta-pct-label">{pctGlobal}% completado</div>
      </div>

      {/* Block stepper */}
      <div className="encuesta-stepper">
        {bloques.map((bloque, idx) => {
          const st = statusBloque(bloque)
          return (
            <div
              key={bloque.variableId}
              className={`stepper-item ${idx === blockIndex ? 'active' : ''} ${st.class}`}
              onClick={() => {
                if (idx < blockIndex || (idx === blockIndex)) {
                  setBlockIndex(idx)
                  setErrores({})
                  setMostrarError(false)
                } else if (idx === blockIndex + 1) {
                  if (validarBloque(bloqueActual)) {
                    setBlockIndex(idx)
                    setErrores({})
                    setMostrarError(false)
                  }
                }
              }}
            >
              <div className="stepper-dot">
                {st.class === 'completado' ? '✓' : idx + 1}
              </div>
              <div className="stepper-label">{VAR_NOMBRES[bloque.variableId]}</div>
              <div className={`stepper-status status-${st.class}`}>{st.label}</div>
            </div>
          )
        })}
      </div>

      {/* Error banner */}
      {mostrarError && (
        <div className="encuesta-error-banner">
          Hay preguntas pendientes en este apartado. Complétalas antes de continuar.
        </div>
      )}

      {/* Current block questions */}
      {bloqueActual && (
        <div key={bloqueActual.variableId} className="bloque-encuesta">
          <div className="bloque-header">
            <h3>{VAR_NOMBRES[bloqueActual.variableId] || bloqueActual.variableId}</h3>
            <span className="bloque-status-badge">
              <span className={`badge badge-${statusBloque(bloqueActual).class === 'completado' ? 'green' : statusBloque(bloqueActual).class === 'en-curso' ? 'amber' : 'gray'}`}>
                {statusBloque(bloqueActual).label}
              </span>
            </span>
            <span className="bloque-objetivo">{bloqueActual.objetivo}</span>
          </div>

          <div className="bloque-pct-mini">
            <div className="bloque-pct-bar">
              <div className="bloque-pct-fill" style={{ width: `${pctBloque(bloqueActual)}%` }} />
            </div>
            <span className="bloque-pct-text">{pctBloque(bloqueActual)}%</span>
          </div>

          {bloqueActual.preguntas.map((pregunta, idx) => {
            const hayError = errores[pregunta.id]
            return (
              <div
                key={pregunta.id}
                id={`pregunta-${pregunta.id}`}
                className={`pregunta-item ${hayError ? 'pregunta-error' : ''}`}
                ref={el => bloqueRefs.current[pregunta.id] = el}
              >
                <div className="pregunta-texto">
                  <span className="pregunta-num">{idx + 1}</span>
                  <span>{pregunta.texto}</span>
                  <span className="pregunta-peso">(peso: {pregunta.peso})</span>
                </div>
                <div className="pregunta-opciones">
                  {(pregunta.responseOptions && pregunta.responseOptions.length > 0
                    ? pregunta.responseOptions
                    : [1, 2, 3, 4, 5].map(v => ({ value: v, label: ['Muy bajo', 'Bajo', 'Medio / neutro', 'Alto', 'Muy alto'][v - 1] }))
                  ).map((opt) => (
                    <label key={opt.value} className={`opcion-label ${state.respuestas[pregunta.id] === opt.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={pregunta.id}
                        value={opt.value}
                        checked={state.respuestas[pregunta.id] === opt.value}
                        onChange={() => handleRespuesta(pregunta.id, opt.value)}
                      />
                      <span className="opcion-valor">{opt.value}</span>
                      <span className="opcion-texto">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {hayError && (
                  <div className="pregunta-msg-error">
                    Esta pregunta es obligatoria para continuar.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Block navigation */}
      <div className="encuesta-nav">
        <div className="encuesta-nav-left">
          {blockIndex > 0 && (
            <button className="btn btn-secondary" onClick={handleAnterior}>
              ← Anterior
            </button>
          )}
          {blockIndex === 0 && (
            <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>
              ← Anterior
            </button>
          )}
        </div>
        <div className="encuesta-nav-right">
          {mostrarError && (
            <span className="encuesta-error-msg">Completa las preguntas pendientes</span>
          )}
          {blockIndex < bloques.length - 1 ? (
            <button className="btn btn-primary" onClick={handleSiguiente}>
              Siguiente →
            </button>
          ) : (
            <button className="btn btn-primary btn-finalizar" onClick={handleFinalizar}>
              Finalizar diagnóstico
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
