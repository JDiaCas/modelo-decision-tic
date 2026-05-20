import { VARIABLES, getBloquesParaFase } from '../data/preguntas.js'

export function normalizarValor(respuesta) {
  return (respuesta - 3) / 2
}

export function calcularVariable(respuestas, variableId, fase) {
  const bloques = getBloquesParaFase(fase)
  const bloque = bloques.find((b) => b.variableId === variableId)
  const variable = VARIABLES.find((v) => v.id === variableId)
  if (!bloque || !variable) return 0

  let suma = 0
  for (const pregunta of bloque.preguntas) {
    const resp = respuestas[pregunta.id]
    if (resp == null) return null
    const normalizado = normalizarValor(resp)
    const dir = pregunta.answerDirection || variable.answerDirection || 'negativeHigh'
    const orientacion = dir === 'positiveHigh' ? 1 : -1
    suma += normalizado * pregunta.peso * orientacion * 20
  }

  return Math.round(suma * 100) / 100
}

export function calcularTodasVariables(respuestas, fase) {
  const resultado = {}
  for (const v of VARIABLES) {
    resultado[v.id] = calcularVariable(respuestas, v.id, fase)
  }
  return resultado
}

export function calcularPosicionFinal(posicionBase, variables) {
  let posicion = posicionBase
  for (const v of VARIABLES) {
    posicion += variables[v.id] ?? 0
  }
  return Math.max(0, Math.min(100, Math.round(posicion)))
}

export function clasificarModalidad(puntuacion) {
  if (puntuacion <= 24) return { modalidad: 'Presencial reforzada', simplificada: 'Presencial o presencial con componente híbrido' }
  if (puntuacion <= 39) return { modalidad: 'Presencial con componente híbrido', simplificada: 'Presencial o presencial con componente híbrido' }
  if (puntuacion <= 69) return { modalidad: 'Híbrida', simplificada: 'Híbrida' }
  if (puntuacion <= 84) return { modalidad: 'Remota con gobernanza reforzada', simplificada: 'Remota o remota con mecanismos reforzados de gobernanza' }
  return { modalidad: 'Remota', simplificada: 'Remota o remota con mecanismos reforzados de gobernanza' }
}

export function calcularNivelGobernanza(puntuacionFinal, variables) {
  const esAlta = puntuacionFinal < 40 || variables.criticidad < -10 || variables.riesgo < -10 || variables.madurez < -10
  if (esAlta) return { nivel: 'alta', label: 'Gobernanza alta' }

  const esMedia = (puntuacionFinal >= 40 && puntuacionFinal <= 69) ||
    [variables.criticidad, variables.coordinacion, variables.madurez, variables.riesgo].filter(v => v < -5 && v >= -10).length >= 2
  if (esMedia) return { nivel: 'media', label: 'Gobernanza media' }

  return { nivel: 'baja', label: 'Gobernanza baja' }
}

export function calcularMediaRespuestas(respuestas, variableId, fase) {
  const bloques = getBloquesParaFase(fase)
  const bloque = bloques.find((b) => b.variableId === variableId)
  if (!bloque) return 0
  const valores = bloque.preguntas.map((p) => respuestas[p.id]).filter((r) => r != null)
  if (valores.length === 0) return 0
  return valores.reduce((a, b) => a + b, 0) / valores.length
}

export function calcularImpactoPorPregunta(respuestas, variableId, fase) {
  const bloques = getBloquesParaFase(fase)
  const bloque = bloques.find((b) => b.variableId === variableId)
  const variable = VARIABLES.find((v) => v.id === variableId)
  if (!bloque || !variable) return []

  return bloque.preguntas.map((p) => {
    const resp = respuestas[p.id] ?? 3
    const normalizado = normalizarValor(resp)
    const impacto = normalizado * p.peso * variable.orientacion * 20
    return {
      ...p,
      respuesta: resp,
      normalizado,
      impacto: Math.round(impacto * 100) / 100,
    }
  })
}

export function calcularIntensidadNegativa(valor) {
  return valor < 0 ? Math.abs(valor) : 0
}

/** Calculate gap 0-4 for a single answer based on answerDirection */
export function calcularGap(respuesta, answerDirection) {
  if (respuesta == null) return 4
  if (answerDirection === 'positiveHigh') {
    if (respuesta <= 1) return 4
    if (respuesta <= 2) return 3
    if (respuesta <= 3) return 1.5
    return 0
  }
  if (answerDirection === 'negativeHigh') {
    if (respuesta >= 5) return 4
    if (respuesta >= 4) return 3
    if (respuesta >= 3) return 1.5
    return 0
  }
  return 0
}

/** Check if a specific question is "covered" (answer indicates no action needed) */
export function preguntaCubierta(respuesta, answerDirection) {
  if (respuesta == null) return false
  if (answerDirection === 'positiveHigh') return respuesta >= 4
  if (answerDirection === 'negativeHigh') return respuesta <= 2
  return false
}

/** Get answer direction for a variable */
export function getAnswerDirection(variableId) {
  const map = { criticidad: 'negativeHigh', coordinacion: 'negativeHigh', madurez: 'positiveHigh', riesgo: 'negativeHigh' }
  return map[variableId] || 'negativeHigh'
}

/**
 * Compute global priority for a single action.
 * Factors: variable global, related question gaps, severity, transversal impact,
 * enabling value, phase fit, modality fit, benefit/effort ratio.
 */
export function calcularPrioridadAccion(accion, variables, respuestas, fase, modalidadRecomendada) {
  const varPrincipal = accion.variablePrincipal || accion.variable
  const valorVar = variables[varPrincipal] ?? 0
  const dirVar = getAnswerDirection(varPrincipal)

  // 1. Impacto por variable global
  let impactoVarGlobal = 0
  if (valorVar < 0) {
    impactoVarGlobal = Math.abs(valorVar) * 1.5
  } else if (accion.tipo === 'preventiva' || accion.tipo === 'optimizadora') {
    impactoVarGlobal = valorVar * 0.3
  }

  // 2. Impacto por preguntas relacionadas
  let impactoPreguntas = 0
  let maxGap = 0
  let gapsCriticos = 0
  let gapsParciales = 0
  const gapsDetalle = []

  if (accion.relatedQuestionIds && accion.relatedQuestionIds.length > 0) {
    for (const qId of accion.relatedQuestionIds) {
      const pregVar = varPrincipal
      const dir = getAnswerDirection(pregVar)
      const resp = respuestas[qId]
      const gap = calcularGap(resp, dir)
      gapsDetalle.push({ qId, gap, resp })
      if (gap >= 4) { gapsCriticos++; maxGap = Math.max(maxGap, gap) }
      else if (gap >= 1.5) { gapsParciales++; maxGap = Math.max(maxGap, gap) }
      if (resp == null) gapsCriticos++
    }
    impactoPreguntas = (gapsCriticos * 8) + (gapsParciales * 3) + (maxGap * 2)
  } else {
    // Fallback: use variable global intensity
    impactoPreguntas = calcularIntensidadNegativa(valorVar) * 2
  }

  // 3. Severidad mitigada
  const severidadMap = { baja: 2, media: 5, alta: 8, critica: 12 }
  const severidad = severidadMap[accion.severidad] || 5

  // 4. Impacto transversal
  const transversal = (accion.variablesRelacionadas?.length || 0) * 3

  // 5. Valor habilitador
  const habilitador = accion.valorHabilitador ? 6 : 0

  // 6. Ajuste por fase
  let ajusteFase = 0
  if (accion.fases && accion.fases.includes(fase)) ajusteFase = 4

  // 7. Ajuste por modalidad
  let ajusteModalidad = 0
  if (accion.modalidades && accion.modalidades.includes(modalidadRecomendada)) ajusteModalidad = 3

  // 8. Beneficio-esfuerzo
  const esfuerzo = accion.esfuerzo || 5
  const beneficioEsfuerzo = severidad > 5 && esfuerzo <= 3 ? 5 : (severidad > 5 ? 2 : 0)

  // 9. Penalización por esfuerzo alto si no es crítica
  const penalizacionEsfuerzo = (esfuerzo >= 4 && severidad < 8) ? -3 : 0

  // 10. Penalización por acción cubierta
  const cubierta = accionCubierta(accion, respuestas)
  const penalizacionCubierta = cubierta ? -999 : 0

  const prioridad = impactoVarGlobal + impactoPreguntas + severidad + transversal + habilitador +
    ajusteFase + ajusteModalidad + beneficioEsfuerzo + penalizacionEsfuerzo + penalizacionCubierta

  return Math.round(prioridad * 10) / 10
}

/** Determine if an action is already covered by survey answers */
export function accionCubierta(accion, respuestas) {
  if (!accion.relatedQuestionIds || accion.relatedQuestionIds.length === 0) return false
  const dir = getAnswerDirection(accion.variablePrincipal || accion.variable)
  let cubiertas = 0
  for (const qId of accion.relatedQuestionIds) {
    const resp = respuestas[qId]
    if (preguntaCubierta(resp, dir)) cubiertas++
  }
  return cubiertas >= accion.relatedQuestionIds.length * 0.6
}

/** Classify an action based on gaps and variable state */
export function clasificarAccion(accion, variables, respuestas) {
  const varPrincipal = accion.variablePrincipal || accion.variable
  const valorVar = variables[varPrincipal] ?? 0
  const dir = getAnswerDirection(varPrincipal)

  let maxGap = 0
  if (accion.relatedQuestionIds) {
    for (const qId of accion.relatedQuestionIds) {
      const gap = calcularGap(respuestas[qId], dir)
      maxGap = Math.max(maxGap, gap)
    }
  }

  if (maxGap >= 4 || (valorVar < -8 && maxGap >= 3)) return 'correctiva'
  if (maxGap >= 1.5 || valorVar < -3) return 'preventiva'
  return 'optimizadora'
}

/** Generate dynamic motive for an action */
export function generarMotivo(accion, variables, respuestas, gaps) {
  const varPrincipal = accion.variablePrincipal || accion.variable
  const valorVar = variables[varPrincipal] ?? 0
  const tipo = clasificarAccion(accion, variables, respuestas)
  const gapsCriticos = (gaps || []).filter(g => g.gap >= 4).length
  const gapsParciales = (gaps || []).filter(g => g.gap >= 1.5 && g.gap < 4).length

  let partes = []
  if (tipo === 'correctiva') partes.push('Alta prioridad')
  else if (tipo === 'preventiva') partes.push('Prioridad media-alta')
  else partes.push('Acción preventiva/optimizadora recomendada')

  if (gapsCriticos > 0) {
    partes.push(`porque ${gapsCriticos} pregunta(s) relacionada(s) muestran una carencia crítica`)
  } else if (gapsParciales > 0) {
    partes.push(`porque ${gapsParciales} pregunta(s) relacionada(s) muestran una situación parcial`)
  } else if (valorVar < 0) {
    partes.push(`porque la variable "${varPrincipal}" tiene impacto negativo (${valorVar})`)
  } else {
    partes.push(`porque refuerza fortalezas en "${varPrincipal}"`)
  }

  if (accion.variablesRelacionadas && accion.variablesRelacionadas.length > 1) {
    partes.push('y tiene impacto transversal sobre múltiples variables')
  }

  if (accion.valorHabilitador) {
    partes.push('y permite habilitar otras acciones del plan')
  }

  const areaNombre = {
    continuidad_servicio: 'continuidad del servicio',
    seguridad_informacion: 'seguridad',
    gestion_riesgos: 'gestión de riesgos',
    quality_management: 'calidad',
    seguimiento_operativo: 'seguimiento operativo',
    gestion_documental: 'gestión documental',
    knowledge_transfer: 'transferencia de conocimiento',
    coordinacion_equipos: 'coordinación de equipos',
    ceremonias: 'ceremonias',
    gestion_capacidad: 'gestión de capacidad',
    gestion_recursos: 'gestión de recursos',
    rotacion_personal: 'rotación',
    usos_horarios: 'usos horarios',
  }
  const area = areaNombre[accion.area] || accion.area
  partes.push(`. Acción de ${area}.`)
  if (accion.impacto) partes.push(` Impacto esperado: ${accion.impacto}`)

  return partes.join(' ')
}

/** Get all enriched actions sorted by global priority */
export function getAccionesPriorizadas(accionesPorVariable, variables, respuestas, fase, modalidadRecomendada, accionesEstado = {}, checklist = {}) {
  const todas = []

  for (const [varId, accs] of Object.entries(accionesPorVariable)) {
    for (const acc of accs) {
      const accId = `${varId}-${acc.area}-${acc.accion.slice(0, 20)}`
      const estadoTabla = accionesEstado[accId]?.estado || 'Pendiente'

      const enriched = {
        ...acc,
        id: accId,
        variable: varId,
        variablePrincipal: varId,
        variablesRelacionadas: acc.variablesRelacionadas || [varId],
        relatedQuestionIds: acc.relatedQuestionIds || [],
        severidad: acc.severidad || 'media',
        esfuerzo: acc.esfuerzo || 3,
        valorHabilitador: acc.valorHabilitador || false,
        fases: acc.fases || [],
        modalidades: acc.modalidades || [],
        estado: estadoTabla,
        responsable: accionesEstado[accId]?.responsable || '',
        fechaObjetivo: accionesEstado[accId]?.fechaObjetivo || '',
      }

      // Check if covered by checklist
      const checkCubierto = Object.entries(checklist).some(([ckId, ckVal]) =>
        ckId.includes(varId) && ckVal === 'completado'
      )
      if (estadoTabla === 'Completado') enriched.cubierta = true
      else enriched.cubierta = accionCubierta(enriched, respuestas) || checkCubierto

      enriched.tipo = clasificarAccion(enriched, variables, respuestas)
      enriched.prioridad = calcularPrioridadAccion(enriched, variables, respuestas, fase, modalidadRecomendada)

      // Generate gaps detail
      const gaps = []
      if (enriched.relatedQuestionIds) {
        for (const qId of enriched.relatedQuestionIds) {
          const dir = getAnswerDirection(enriched.variablePrincipal || enriched.variable)
          const resp = respuestas[qId]
          gaps.push({ qId, resp, gap: calcularGap(resp, dir) })
        }
      }
      enriched.gaps = gaps
      enriched.motivo = generarMotivo(enriched, variables, respuestas, gaps)

      todas.push(enriched)
    }
  }

  // Sort by priority descending
  todas.sort((a, b) => b.prioridad - a.prioridad)

  // Split into active and covered
  const activas = todas.filter(a => !a.cubierta && a.prioridad > 0)
  const cubiertas = todas.filter(a => a.cubierta || a.prioridad <= 0)

  return { activas, cubiertas }
}

/** Generate global analysis text for the priority view */
export function generarAnalisisPriorizacion(variables, respuestas, activas, cubiertas) {
  const lines = []

  // Variable con mayor impacto negativo
  const varsNeg = Object.entries(variables)
    .filter(([, v]) => v < 0)
    .sort(([, a], [, b]) => a - b)
  if (varsNeg.length > 0) {
    const peor = varsNeg[0]
    lines.push(`La variable con mayor impacto negativo es "${peor[0]}" (${peor[1]}).`)
  }

  // Questions with highest gap
  const gapsPorPregunta = []
  for (const [varId, val] of Object.entries(variables)) {
    const dir = getAnswerDirection(varId)
    for (let i = 1; i <= 8; i++) {
      const qId = varId[0] + i
      const resp = respuestas[qId]
      const gap = calcularGap(resp, dir)
      if (gap >= 3) gapsPorPregunta.push({ qId, gap, varId })
    }
  }
  gapsPorPregunta.sort((a, b) => b.gap - a.gap)
  if (gapsPorPregunta.length > 0) {
    const topGaps = gapsPorPregunta.slice(0, 3)
    lines.push(`Las preguntas con mayor gap son: ${topGaps.map(g => g.qId).join(', ')}.`)
  }

  // Covered actions
  if (cubiertas.length > 0) {
    lines.push(`${cubiertas.length} acción(es) no se muestran como prioritarias porque están cubiertas por el diagnóstico.`)
  }

  // Transversal actions
  const transversales = activas.filter(a => (a.variablesRelacionadas?.length || 1) > 1)
  if (transversales.length > 0) {
    lines.push(`${transversales.length} acción(es) prioritarias tienen impacto transversal.`)
  }

  return lines.join(' ')
}

/* ─── Checklist auto-complete ──────────────────────────────────────────── */

/**
 * Calculate the automatic state for a single checklist item based on related answers.
 * Returns 'pendiente', 'en_curso', or 'completado'.
 */
export function calcularEstadoItemAutomatico(item, respuestas) {
  if (!item.relatedQuestionIds || item.relatedQuestionIds.length === 0) return 'pendiente'

  const dir = item.interpretation || 'positiveHigh'
  let hasRisk = false
  let hasPartial = false
  let allCovered = true

  for (const qId of item.relatedQuestionIds) {
    const resp = respuestas[qId]
    if (resp == null) { hasRisk = true; continue }

    if (dir === 'positiveHigh') {
      if (resp <= 2) { hasRisk = true; allCovered = false }
      else if (resp === 3) { hasPartial = true; allCovered = false }
      else { /* 4-5 = covered */ }
    } else {
      // negativeHigh
      if (resp >= 4) { hasRisk = true; allCovered = false }
      else if (resp === 3) { hasPartial = true; allCovered = false }
      else { /* 1-2 = covered */ }
    }
  }

  if (hasRisk) return 'pendiente'
  if (hasPartial) return 'en_curso'
  if (allCovered) return 'completado'
  return 'pendiente'
}

/**
 * Generate an auto-complete explanation for a checklist item.
 */
export function generarExplicacionChecklist(item, respuestas) {
  const dir = item.interpretation || 'positiveHigh'
  const reasons = []

  if (!item.relatedQuestionIds || item.relatedQuestionIds.length === 0) {
    return 'No hay preguntas relacionadas para calcular el estado automático.'
  }

  for (const qId of item.relatedQuestionIds) {
    const resp = respuestas[qId]
    if (resp == null) {
      reasons.push(`${qId}: sin respuesta`)
      continue
    }
    if (dir === 'positiveHigh') {
      if (resp <= 2) reasons.push(`${qId}: respuesta baja (${resp}) → debilidad`)
      else if (resp === 3) reasons.push(`${qId}: respuesta media (${resp}) → parcial`)
      else reasons.push(`${qId}: respuesta alta (${resp}) → cubierto`)
    } else {
      if (resp >= 4) reasons.push(`${qId}: respuesta alta (${resp}) → riesgo`)
      else if (resp === 3) reasons.push(`${qId}: respuesta media (${resp}) → parcial`)
      else reasons.push(`${qId}: respuesta baja (${resp}) → cubierto`)
    }
  }

  return reasons.join('; ')
}

/**
 * Generate initial auto-completed checklist state for all items.
 * SECCIONES_CHECKLIST must be passed in to avoid circular deps.
 */
export function generarChecklistAutomatico(secciones, respuestas) {
  const auto = {}
  const explicaciones = {}
  for (const sec of secciones) {
    for (const item of sec.items) {
      const estado = calcularEstadoItemAutomatico(item, respuestas)
      auto[item.id] = estado
      explicaciones[item.id] = generarExplicacionChecklist(item, respuestas)
    }
  }
  return { auto, explicaciones }
}

/**
 * Calculate global checklist completion percentage.
 */
export function calcularPctChecklist(items, estadoMap) {
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

/**
 * Count items by state and origin.
 */
export function resumenChecklist(secciones, estadoMap, origenMap) {
  let total = 0
  let completados = 0
  let enCurso = 0
  let pendientes = 0
  let noAplica = 0
  let automaticos = 0
  let modificados = 0

  for (const sec of secciones) {
    for (const item of sec.items) {
      const est = estadoMap[item.id] || 'pendiente'
      if (est !== 'no_aplica') total++
      if (est === 'completado') completados++
      else if (est === 'en_curso') enCurso++
      else if (est === 'pendiente') pendientes++
      else if (est === 'no_aplica') noAplica++

      if (origenMap[item.id] === 'modificado') modificados++
      else automaticos++
    }
  }

  return { total, completados, enCurso, pendientes, noAplica, automaticos, modificados }
}

/**
 * Update action priority to consider checklist states.
 * Returns a penalty to apply to actions whose related checklist items are completed.
 */
export function penalizacionPorChecklist(accion, checklist, origenChecklist) {
  const relatedCheckIds = accion.relatedChecklistIds || []
  if (relatedCheckIds.length === 0) return 0

  let penalty = 0
  for (const ckId of relatedCheckIds) {
    const estado = checklist[ckId] || 'pendiente'
    if (estado === 'completado') penalty -= 5
    else if (estado === 'en_curso') penalty -= 1
    else if (estado === 'no_aplica') penalty -= 10
    else if (estado === 'pendiente') penalty += 2
  }
  return penalty
}

