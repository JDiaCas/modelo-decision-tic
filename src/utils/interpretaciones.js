const INTERPRETACIONES = {
  criticidad: {
    negativa: 'El proyecto tiene un impacto elevado sobre el negocio o la continuidad del servicio. Se requiere control, supervisión y trazabilidad reforzada.',
    positiva: 'El proyecto tiene baja exposición crítica. Existe margen para modalidades con menor control presencial.',
    neutra: 'El nivel de criticidad es equilibrado. No impone restricciones significativas sobre la modalidad de trabajo.',
  },
  coordinacion: {
    negativa: 'Existe alta dependencia síncrona entre equipos. Se requiere coordinación frecuente y momentos de trabajo en vivo.',
    positiva: 'Existe alta autonomía entre equipos. El proyecto puede ejecutarse con comunicación mayoritariamente asíncrona.',
    neutra: 'La necesidad de coordinación es equilibrada. No requiere ajustes significativos en la modalidad.',
  },
  madurez: {
    negativa: 'La madurez organizativa es baja. Se requiere supervisión, documentación y procesos más estructurados.',
    positiva: 'La madurez organizativa es alta. El equipo puede trabajar de forma autónoma y distribuida.',
    neutra: 'La madurez organizativa es adecuada. Existe capacidad base para trabajo autónomo.',
  },
  riesgo: {
    negativa: 'Existe exposición relevante a incidencias, seguridad o falta de contingencia. Se requiere control operativo reforzado.',
    positiva: 'El nivel de exposición operativa es bajo. Existe margen para modalidades más flexibles.',
    neutra: 'El riesgo operativo es controlable. No requiere medidas extraordinarias.',
  },
}

export function obtenerInterpretacion(variableId, valor) {
  const interp = INTERPRETACIONES[variableId]
  if (!interp) return ''
  if (valor < -3) return interp.negativa
  if (valor > 3) return interp.positiva
  return interp.neutra
}

export function obtenerRiesgosYFortalezas(variables) {
  const riesgos = []
  const fortalezas = []

  const mapNombres = {
    criticidad: { nombre: 'Criticidad', riesgo: 'impacto elevado sobre negocio o continuidad del servicio', fortaleza: 'baja exposición crítica' },
    coordinacion: { nombre: 'Coordinación síncrona', riesgo: 'alta dependencia síncrona entre equipos', fortaleza: 'alta autonomía entre equipos' },
    madurez: { nombre: 'Madurez organizativa', riesgo: 'baja autonomía, documentación o trazabilidad', fortaleza: 'buena capacidad de trabajo distribuido' },
    riesgo: { nombre: 'Riesgo operativo', riesgo: 'exposición relevante a incidencias, seguridad o falta de contingencia', fortaleza: 'bajo nivel de exposición operativa' },
  }

  for (const [id, info] of Object.entries(mapNombres)) {
    const valor = variables[id]
    if (valor < -3) {
      riesgos.push({ variable: info.nombre, valor, descripcion: info.riesgo })
    } else if (valor > 3) {
      fortalezas.push({ variable: info.nombre, valor, descripcion: info.fortaleza })
    }
  }

  return { riesgos, fortalezas }
}

export function generarExplicacionResultado(puntuacion, modalidad, tipologiaNombre, variables) {
  const partes = []
  partes.push(`El proyecto se clasifica como "${modalidad}" con una puntuación de ${puntuacion} sobre 100.`)

  const varsNegativas = []
  const varsPositivas = []

  for (const [id, valor] of Object.entries(variables)) {
    if (valor < 0) varsNegativas.push({ id, valor })
    else if (valor > 0) varsPositivas.push({ id, valor })
  }

  if (varsNegativas.length > 0) {
    const desc = varsNegativas.map((v) => `${v.id} (${v.valor})`).join(', ')
    partes.push(`Las variables que impulsan hacia mayor presencialidad son: ${desc}.`)
  }

  if (varsPositivas.length > 0) {
    const desc = varsPositivas.map((v) => `${v.id} (+${v.valor})`).join(', ')
    partes.push(`Las variables que favorecen mayor flexibilidad son: ${desc}.`)
  }

  partes.push(`La tipología funcional "${tipologiaNombre}" establece una posición base que se ha ajustado según el diagnóstico operativo.`)

  return partes.join(' ')
}

export const RECOMENDACIONES_GOBERNANZA = {
  alta: [
    'Seguimiento frecuente',
    'Documentación reforzada',
    'Criterios de escalado claros',
    'Control de riesgos',
    'Revisión de seguridad',
    'Validaciones de calidad',
  ],
  media: [
    'Cadencias periódicas',
    'Documentación mínima viable',
    'Seguimiento de dependencias',
    'Revisión de riesgos principales',
  ],
  baja: [
    'Mayor autonomía',
    'Comunicación asincrónica',
    'Seguimiento ligero',
    'Revisión periódica',
  ],
}
