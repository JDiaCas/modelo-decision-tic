import React, { useCallback } from 'react'
import { useApp } from './AppContext.jsx'

export const STEPS_OPERATIVOS = [
  { id: 'contexto', label: 'Contexto del proyecto', short: 'Contexto' },
  { id: 'encuesta', label: 'Encuesta de diagnóstico', short: 'Encuesta' },
  { id: 'revision', label: 'Revisión del diagnóstico', short: 'Revisión' },
  { id: 'resultado', label: 'Resultado del modelo', short: 'Resultado' },
  { id: 'acciones', label: 'Acciones priorizadas', short: 'Acciones' },
  { id: 'checklist', label: 'Checklist del PM', short: 'Checklist' },
  { id: 'tareas', label: 'Tareas de gestión', short: 'Tareas' },
  { id: 'informe', label: 'Informe final', short: 'Informe' },
]

export const TOTAL_OP_STEPS = STEPS_OPERATIVOS.length // 8

function getStepState(stepIdx, currentStep, maxStepReached, pasosDesactualizados) {
  if (stepIdx === currentStep) return 'current'
  if (pasosDesactualizados[stepIdx]) return 'needsReview'
  if (stepIdx < currentStep) return 'completed'
  if (stepIdx <= maxStepReached) return 'completed'
  return 'locked'
}

function getAriaLabel(step, stepIdx, state) {
  const base = `Paso ${stepIdx}: ${step.label}`
  switch (state) {
    case 'current': return `${base} — paso actual`
    case 'completed': return `Ir al paso ${step.short} — completado`
    case 'needsReview': return `Ir al paso ${step.short} — requiere revisión`
    case 'locked': return `${base} — bloqueado hasta completar pasos anteriores`
  }
}

export default function ProgressBar() {
  const { state, dispatch } = useApp()
  const currentStep = state.step
  const maxStepReached = state.maxStepReached
  const pasosDesactualizados = state.pasosDesactualizados

  const handleClick = useCallback((stepIdx) => {
    if (stepIdx === currentStep) return
    const stepState = getStepState(stepIdx, currentStep, maxStepReached, pasosDesactualizados)
    if (stepState === 'locked') return
    dispatch({ type: 'SET_STEP', payload: stepIdx })
  }, [currentStep, maxStepReached, pasosDesactualizados, dispatch])

  const handleKeyDown = useCallback((e, stepIdx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(stepIdx)
    }
  }, [handleClick])

  return (
    <nav className="progress-bar" aria-label="Navegación por pasos del diagnóstico">
      {STEPS_OPERATIVOS.map((step, arrIdx) => {
        const stepIdx = arrIdx + 1 // reducer step indices are 1-7
        const stepState = getStepState(stepIdx, currentStep, maxStepReached, pasosDesactualizados)
        const isInteractive = stepState !== 'locked'
        const ariaLabel = getAriaLabel(step, stepIdx, stepState)

        const content = (
          <>
            <div className={`progress-dot ${stepState === 'needsReview' ? 'dot-needs-review' : ''}`}>
              {stepState === 'completed' ? '✓' : stepState === 'needsReview' ? '!' : stepIdx}
            </div>
            <span className="progress-label">{step.short}</span>
          </>
        )

        if (isInteractive) {
          return (
            <button
              key={step.id}
              className={`progress-step progress-step-${stepState}`}
              onClick={() => handleClick(stepIdx)}
              onKeyDown={(e) => handleKeyDown(e, stepIdx)}
              aria-current={stepState === 'current' ? 'step' : undefined}
              aria-label={ariaLabel}
              type="button"
            >
              {content}
            </button>
          )
        }

        return (
          <div
            key={step.id}
            className="progress-step progress-step-locked"
            aria-disabled="true"
            aria-label={ariaLabel}
          >
            {content}
          </div>
        )
      })}
    </nav>
  )
}
