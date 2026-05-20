import React, { useState } from 'react'
import { useApp } from './AppContext.jsx'
import { TOTAL_OP_STEPS } from './ProgressBar.jsx'
import ListaAnalisis from './ListaAnalisis.jsx'

export default function IntroSection() {
  const { state, dispatch } = useApp()
  const [showSaved, setShowSaved] = useState(false)
  const tieneProgreso = state.maxStepReached > 0
  const ultimoPaso = state.maxStepReached

  return (
    <>
      {showSaved && <ListaAnalisis onClose={() => setShowSaved(false)} />}

      <div className="section-card intro-section">
        <div className="intro-header">
          <div className="intro-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1>Modelo de Decisión para Proyectos TIC</h1>
            <p className="subtitle">Startups SaaS · Análisis de modalidad de trabajo</p>
          </div>
        </div>

        <div className="intro-content">
          <p>
            Esta herramienta ayuda al <strong>Project Manager</strong> a determinar la modalidad de trabajo
            más adecuada para un proyecto TIC en un entorno SaaS: <strong>presencial, híbrida o remota</strong>.
          </p>

          <div className="intro-grid">
            <div className="intro-card">
              <h3>Tipología funcional</h3>
              <p>Clasificación del proyecto según su naturaleza técnica y operativa.</p>
            </div>
            <div className="intro-card">
              <h3>Nivel de criticidad</h3>
              <p>Impacto potencial sobre el negocio, clientes y continuidad del servicio.</p>
            </div>
            <div className="intro-card">
              <h3>Coordinación síncrona</h3>
              <p>Grado de dependencia y necesidad de interacción en tiempo real.</p>
            </div>
            <div className="intro-card">
              <h3>Madurez organizativa</h3>
              <p>Capacidad del equipo para trabajar de forma autónoma y documentada.</p>
            </div>
            <div className="intro-card">
              <h3>Riesgo operativo</h3>
              <p>Exposición a incidencias, seguridad y continuidad operativa.</p>
            </div>
          </div>

          <div className="intro-note">
            <strong>Nota importante:</strong> El resultado de esta herramienta no es una decisión rígida,
            sino una <strong>recomendación trazable y ajustable</strong> por el Project Manager en función
            de su contexto y criterio profesional.
          </div>
        </div>

        <div className="intro-actions">
          {tieneProgreso ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => dispatch({ type: 'SET_STEP', payload: ultimoPaso })}
              >
                Continuar análisis
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
              >
                Revisar desde contexto
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
            >
              Comenzar análisis
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={() => setShowSaved(true)}
          >
            Ver análisis guardados
          </button>
        </div>
      </div>
    </>
  )
}
