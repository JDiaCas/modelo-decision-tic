import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { VARIABLES } from '../data/preguntas.js'
import { calcularTodasVariables } from '../utils/calculos.js'
import { SECCIONES_CHECKLIST } from '../data/checklist.js'

const AppContext = createContext()

const TOTAL_STEPS = 8 // 0=intro, 1=contexto ... 7=tareas, 8=informe

const initialState = {
  step: 0,
  maxStepReached: 0,
  avisoModificacion: null,
  pasosDesactualizados: {},
  plantilla: null,
  analisisActualId: null,
  tareas: [],
  contexto: {
    nombre: '',
    descripcion: '',
    tipologia: '',
    tamanoEquipo: '',
    modalidadActual: '',
    faseProyecto: '',
    stakeholders: [],
    observaciones: '',
  },
  respuestas: {},
  variablesCalculadas: {},
  variablesAjustadas: {},
  ajustesManuales: {},
  accionesEstado: {},
  checklist: {},
  checklistAuto: {},
  explicacionesChecklist: {},
  origenChecklist: {},
  fasePreguntasAdaptadas: false,
}

function buildInitialChecklist() {
  const ck = {}
  for (const sec of SECCIONES_CHECKLIST) {
    for (const item of sec.items) {
      ck[item.id] = 'pendiente'
    }
  }
  return ck
}

function buildInitialOrigen() {
  const o = {}
  for (const sec of SECCIONES_CHECKLIST) {
    for (const item of sec.items) {
      o[item.id] = 'automatico'
    }
  }
  return o
}

initialState.checklist = buildInitialChecklist()
initialState.origenChecklist = buildInitialOrigen()

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PLANTILLA':
      return { ...state, plantilla: action.payload }
    case 'SET_CONTEXTO': {
      const newContexto = { ...state.contexto, ...action.payload }
      const newState = { ...state, contexto: newContexto }
      if (action.payload.faseProyecto && action.payload.faseProyecto !== state.contexto.faseProyecto) {
        const hasAnswers = Object.values(state.respuestas).some(v => v != null)
        if (hasAnswers) {
          newState.faseAdvertencia = true
        }
      }
      if (state.step > 1) {
        const d = {}
        for (let i = 2; i <= TOTAL_STEPS; i++) d[i] = true
        newState.pasosDesactualizados = { ...state.pasosDesactualizados, ...d }
        newState.avisoModificacion = 'Has modificado información que puede afectar al diagnóstico y a las recomendaciones. Los resultados se actualizarán automáticamente.'
      }
      return newState
    }
    case 'SET_STAKEHOLDERS':
      return { ...state, contexto: { ...state.contexto, stakeholders: action.payload } }
    case 'SET_RESPUESTAS': {
      if (state.step > 2) {
        const d = {}
        for (let i = 3; i <= TOTAL_STEPS; i++) d[i] = true
        return {
          ...state,
          respuestas: { ...state.respuestas, ...action.payload },
          pasosDesactualizados: { ...state.pasosDesactualizados, ...d },
          avisoModificacion: 'Has modificado información que puede afectar al diagnóstico y a las recomendaciones. Los resultados se actualizarán automáticamente.',
        }
      }
      return { ...state, respuestas: { ...state.respuestas, ...action.payload } }
    }
    case 'CALCULAR_VARIABLES': {
      const fase = state.contexto.faseProyecto
      const calculadas = calcularTodasVariables(state.respuestas, fase)
      if (state.step > 3) {
        const d = {}
        for (let i = 4; i <= TOTAL_STEPS; i++) d[i] = true
        return {
          ...state,
          variablesCalculadas: calculadas,
          fasePreguntasAdaptadas: true,
          faseAdvertencia: false,
          pasosDesactualizados: { ...state.pasosDesactualizados, ...d },
          avisoModificacion: 'Los cambios realizados pueden modificar el informe final. Revisa los pasos posteriores antes de exportarlo.',
        }
      }
      return { ...state, variablesCalculadas: calculadas, fasePreguntasAdaptadas: true, faseAdvertencia: false }
    }
    case 'AJUSTAR_VARIABLE': {
      const newState = {
        ...state,
        variablesAjustadas: { ...state.variablesAjustadas, [action.payload.id]: action.payload.valor },
        ajustesManuales: { ...state.ajustesManuales, [action.payload.id]: action.payload.justificacion || '' },
      }
      if (state.step > 3) {
        const d = {}
        for (let i = 4; i <= TOTAL_STEPS; i++) d[i] = true
        newState.pasosDesactualizados = { ...state.pasosDesactualizados, ...d }
        newState.avisoModificacion = 'Los cambios realizados pueden modificar el informe final. Revisa los pasos posteriores antes de exportarlo.'
      }
      return newState
    }
    case 'RESTAURAR_VARIABLE': {
      const newAjustadas = { ...state.variablesAjustadas }
      const newManuales = { ...state.ajustesManuales }
      delete newAjustadas[action.payload]
      delete newManuales[action.payload]
      return { ...state, variablesAjustadas: newAjustadas, ajustesManuales: newManuales }
    }
    case 'SET_ACCION_ESTADO':
      return {
        ...state,
        accionesEstado: { ...state.accionesEstado, [action.payload.id]: { ...state.accionesEstado[action.payload.id], estado: action.payload.estado } },
      }
    case 'SET_ACCION_CAMPO':
      return {
        ...state,
        accionesEstado: { ...state.accionesEstado, [action.payload.id]: { ...state.accionesEstado[action.payload.id], ...action.payload.campos } },
      }
    case 'SET_CHECKLIST':
      return { ...state, checklist: { ...state.checklist, ...action.payload } }
    case 'SET_STEP': {
      const newMax = Math.max(state.maxStepReached, action.payload)
      const newDesactualizados = { ...state.pasosDesactualizados }
      delete newDesactualizados[action.payload]
      return { ...state, step: action.payload, maxStepReached: newMax, avisoModificacion: null, pasosDesactualizados: newDesactualizados }
    }
    case 'SET_CHECKLIST_AUTO':
      return {
        ...state,
        checklistAuto: action.payload.auto,
        explicacionesChecklist: action.payload.explicaciones,
      }
    case 'SET_CHECKLIST_ORIGEN':
      return { ...state, origenChecklist: { ...state.origenChecklist, ...action.payload } }
    case 'SET_ANALISIS_ID':
      return { ...state, analisisActualId: action.payload }
    case 'ADD_TAREA':
      return { ...state, tareas: [...state.tareas, action.payload] }
    case 'SET_MULTIPLE_TAREAS':
      return { ...state, tareas: [...state.tareas, ...action.payload] }
    case 'EDIT_TAREA': {
      const tareasEdit = state.tareas.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.cambios } : t
      )
      return { ...state, tareas: tareasEdit }
    }
    case 'DELETE_TAREA':
      return { ...state, tareas: state.tareas.filter(t => t.id !== action.payload) }
    case 'SET_TAREAS':
      return { ...state, tareas: action.payload }
    case 'CLEAR_AVISO':
      return { ...state, avisoModificacion: null }
    case 'LOAD_ANALISIS': {
      const data = action.payload
      return {
        ...initialState,
        step: 0,
        maxStepReached: data.maxStepReached || 0,
        contexto: { ...initialState.contexto, ...(data.contexto || {}) },
        respuestas: data.respuestas || {},
        variablesCalculadas: data.variablesCalculadas || {},
        variablesAjustadas: data.variablesAjustadas || {},
        ajustesManuales: data.ajustesManuales || {},
        accionesEstado: data.accionesEstado || {},
        checklist: data.checklist || buildInitialChecklist(),
        checklistAuto: data.checklistAuto || {},
        explicacionesChecklist: data.explicacionesChecklist || {},
        origenChecklist: data.origenChecklist || buildInitialOrigen(),
        tareas: data.tareas || [],
        analisisActualId: data.id || null,
        plantilla: data.plantilla || null,
        fasePreguntasAdaptadas: !!data.fasePreguntasAdaptadas,
      }
    }
    case 'RESET':
      return { ...initialState, checklist: buildInitialChecklist(), origenChecklist: buildInitialOrigen() }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const getVariables = useCallback(() => {
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
  }, [state.variablesCalculadas, state.variablesAjustadas])

  const value = { state, dispatch, getVariables }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
