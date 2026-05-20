/* Each checklist item maps to related question IDs.
 * interpretation: how to evaluate responses
 *   - 'positiveHigh': high answer = good (1-2→Pendiente, 3→En curso, 4-5→Completado)
 *   - 'negativeHigh': high answer = risk (1-2→Completado, 3→En curso, 4-5→Pendiente)
 */

export const SECCIONES_CHECKLIST = [
  {
    id: 'gobernanza',
    nombre: 'Gobernanza',
    items: [
      { id: 'g1', texto: 'Roles y responsabilidades definidos.', relatedQuestionIds: ['m1'], interpretation: 'positiveHigh' },
      { id: 'g2', texto: 'Responsable de decisión identificado.', relatedQuestionIds: ['m1', 'm4'], interpretation: 'positiveHigh' },
      { id: 'g3', texto: 'Criterios de escalado definidos.', relatedQuestionIds: ['m4', 's5'], interpretation: 'positiveHigh' },
      { id: 'g4', texto: 'Cadencia de seguimiento establecida.', relatedQuestionIds: ['m4', 'c4'], interpretation: 'positiveHigh' },
      { id: 'g5', texto: 'Decisiones clave documentadas.', relatedQuestionIds: ['m3', 'm6'], interpretation: 'positiveHigh' },
      { id: 'g6', texto: 'Reglas de comunicación definidas.', relatedQuestionIds: ['s6', 'm4'], interpretation: 'positiveHigh' },
      { id: 'g7', texto: 'Criterios de priorización acordados.', relatedQuestionIds: ['m4', 'c2'], interpretation: 'positiveHigh' },
    ],
  },
  {
    id: 'coordinacion',
    nombre: 'Coordinación',
    items: [
      { id: 'co1', texto: 'Canales de comunicación definidos.', relatedQuestionIds: ['s6', 'm4'], interpretation: 'positiveHigh' },
      { id: 'co2', texto: 'Ventanas de trabajo síncrono establecidas.', relatedQuestionIds: ['s5', 's2'], interpretation: 'negativeHigh' },
      { id: 'co3', texto: 'Ceremonias adaptadas a la modalidad recomendada.', relatedQuestionIds: ['s7'], interpretation: 'negativeHigh' },
      { id: 'co4', texto: 'Dependencias entre equipos identificadas.', relatedQuestionIds: ['s3', 's6'], interpretation: 'negativeHigh' },
      { id: 'co5', texto: 'Tiempos máximos de respuesta definidos.', relatedQuestionIds: ['s2', 's5'], interpretation: 'negativeHigh' },
      { id: 'co6', texto: 'Mecanismo de escalado ante bloqueos definido.', relatedQuestionIds: ['m4', 's5'], interpretation: 'positiveHigh' },
      { id: 'co7', texto: 'Responsables por área identificados.', relatedQuestionIds: ['m1', 's6'], interpretation: 'positiveHigh' },
    ],
  },
  {
    id: 'documentacion',
    nombre: 'Documentación y conocimiento',
    items: [
      { id: 'd1', texto: 'Repositorio documental centralizado.', relatedQuestionIds: ['m3', 'r3'], interpretation: 'positiveHigh' },
      { id: 'd2', texto: 'Estándares mínimos de documentación definidos.', relatedQuestionIds: ['m3', 'm8'], interpretation: 'positiveHigh' },
      { id: 'd3', texto: 'Handovers documentados.', relatedQuestionIds: ['m7'], interpretation: 'positiveHigh' },
      { id: 'd4', texto: 'Knowledge transfer planificado.', relatedQuestionIds: ['m7', 'r3'], interpretation: 'positiveHigh' },
      { id: 'd5', texto: 'Backup funcional para roles críticos.', relatedQuestionIds: ['m7', 'r3'], interpretation: 'positiveHigh' },
      { id: 'd6', texto: 'Decisiones técnicas registradas.', relatedQuestionIds: ['m3', 'm6'], interpretation: 'positiveHigh' },
      { id: 'd7', texto: 'Procedimientos operativos actualizados.', relatedQuestionIds: ['m3', 'r8'], interpretation: 'positiveHigh' },
    ],
  },
  {
    id: 'riesgos',
    nombre: 'Riesgos y continuidad',
    items: [
      { id: 'r1', texto: 'Riesgos principales identificados.', relatedQuestionIds: ['c4', 'r1'], interpretation: 'negativeHigh' },
      { id: 'r2', texto: 'Umbrales de escalado definidos.', relatedQuestionIds: ['m4', 's5'], interpretation: 'positiveHigh' },
      { id: 'r3', texto: 'Planes de contingencia establecidos.', relatedQuestionIds: ['r6', 'r8'], interpretation: 'negativeHigh' },
      { id: 'r4', texto: 'Capacidad reservada para incidencias.', relatedQuestionIds: ['r7'], interpretation: 'negativeHigh' },
      { id: 'r5', texto: 'Seguimiento de riesgos activo.', relatedQuestionIds: ['r4', 'c4'], interpretation: 'negativeHigh' },
      { id: 'r6', texto: 'Procedimientos de rollback definidos.', relatedQuestionIds: ['c7', 'r6'], interpretation: 'negativeHigh' },
      { id: 'r7', texto: 'Runbooks actualizados.', relatedQuestionIds: ['m3', 'r8'], interpretation: 'positiveHigh' },
    ],
  },
  {
    id: 'seguridad',
    nombre: 'Seguridad de la información',
    items: [
      { id: 's1', texto: 'Accesos revisados.', relatedQuestionIds: ['r2'], interpretation: 'negativeHigh' },
      { id: 's2', texto: 'Protocolos de seguridad definidos.', relatedQuestionIds: ['r2', 'm4'], interpretation: 'negativeHigh' },
      { id: 's3', texto: 'Trazabilidad de cambios asegurada.', relatedQuestionIds: ['r4', 'm6'], interpretation: 'negativeHigh' },
      { id: 's4', texto: 'Entornos sensibles controlados.', relatedQuestionIds: ['r2', 'c7'], interpretation: 'negativeHigh' },
      { id: 's5', texto: 'Medidas específicas para remoto/híbrido definidas.', relatedQuestionIds: ['r2'], interpretation: 'negativeHigh' },
      { id: 's6', texto: 'Gestión de credenciales revisada.', relatedQuestionIds: ['r2'], interpretation: 'negativeHigh' },
      { id: 's7', texto: 'Control de permisos según rol aplicado.', relatedQuestionIds: ['r2', 'm1'], interpretation: 'negativeHigh' },
    ],
  },
  {
    id: 'calidad',
    nombre: 'Calidad y seguimiento',
    items: [
      { id: 'q1', texto: 'Criterios de calidad definidos.', relatedQuestionIds: ['m8', 'c6'], interpretation: 'positiveHigh' },
      { id: 'q2', texto: 'Validaciones intermedias planificadas.', relatedQuestionIds: ['c6', 'c4'], interpretation: 'negativeHigh' },
      { id: 'q3', texto: 'KPIs operativos establecidos.', relatedQuestionIds: ['r4', 'c4'], interpretation: 'negativeHigh' },
      { id: 'q4', texto: 'Reporting periódico configurado.', relatedQuestionIds: ['c4', 'r4'], interpretation: 'negativeHigh' },
      { id: 'q5', texto: 'Revisiones técnicas previas a despliegue definidas.', relatedQuestionIds: ['c6', 'c7'], interpretation: 'negativeHigh' },
      { id: 'q6', texto: 'Métricas de avance visibles.', relatedQuestionIds: ['m6', 'r4'], interpretation: 'positiveHigh' },
      { id: 'q7', texto: 'Revisión de entregables críticos planificada.', relatedQuestionIds: ['c6', 'm8'], interpretation: 'positiveHigh' },
    ],
  },
]

export const ESTADOS_CHECKLIST = ['pendiente', 'en_curso', 'completado', 'no_aplica']
