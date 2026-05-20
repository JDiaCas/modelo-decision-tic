import React, { useCallback } from 'react'
import { AppProvider, useApp } from './components/AppContext.jsx'
import ProgressBar, { TOTAL_OP_STEPS } from './components/ProgressBar.jsx'
import IntroSection from './components/IntroSection.jsx'
import ContextoProyecto from './components/ContextoProyecto.jsx'
import EncuestaDiagnostico from './components/EncuestaDiagnostico.jsx'
import RevisionDiagnostico from './components/RevisionDiagnostico.jsx'
import ResultadoModelo from './components/ResultadoModelo.jsx'
import AccionesPriorizadas from './components/AccionesPriorizadas.jsx'
import ChecklistPM from './components/ChecklistPM.jsx'
import TareasPanel from './components/TareasPanel.jsx'
import InformeFinal from './components/InformeFinal.jsx'

function AppContent() {
  const { state, dispatch } = useApp()
  const step = state.step

  const handleHomeClick = useCallback(() => {
    dispatch({ type: 'SET_STEP', payload: 0 })
  }, [dispatch])

  const handleHomeKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      dispatch({ type: 'SET_STEP', payload: 0 })
    }
  }, [dispatch])

  const isOperationalStep = step >= 1 && step <= TOTAL_OP_STEPS

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <button
            className="app-logo"
            onClick={handleHomeClick}
            onKeyDown={handleHomeKeyDown}
            aria-label="Volver al inicio de la herramienta"
            type="button"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>Modelo de Decisión TIC</span>
          </button>
          {isOperationalStep && (
            <div className="app-step-indicator">
              Paso {step} de {TOTAL_OP_STEPS}
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {isOperationalStep && <ProgressBar />}

        {state.avisoModificacion && (
          <div className="aviso-modificacion" role="alert">
            <span className="aviso-icon">i</span>
            <p>{state.avisoModificacion}</p>
            <button
              className="aviso-cerrar"
              onClick={() => dispatch({ type: 'CLEAR_AVISO' })}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        )}

        <div className="app-content">
          {step === 0 && <IntroSection />}
          {step === 1 && <ContextoProyecto />}
          {step === 2 && <EncuestaDiagnostico />}
          {step === 3 && <RevisionDiagnostico />}
          {step === 4 && <ResultadoModelo />}
          {step === 5 && <AccionesPriorizadas />}
          {step === 6 && <ChecklistPM />}
          {step === 7 && <TareasPanel />}
          {step === 8 && <InformeFinal />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
