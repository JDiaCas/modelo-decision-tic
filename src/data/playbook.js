export const PRIORIDAD_AREA = {
  'continuidad_servicio': 10,
  'seguridad_informacion': 9,
  'gestion_riesgos': 8,
  'quality_management': 7,
  'seguimiento_operativo': 7,
  'gestion_documental': 6,
  'knowledge_transfer': 6,
  'coordinacion_equipos': 5,
  'ceremonias': 4,
  'gestion_capacidad': 4,
  'gestion_recursos': 4,
  'rotacion_personal': 3,
  'usos_horarios': 3,
}

export const AREA_NOMBRES = {
  continuidad_servicio: 'Continuidad del servicio',
  seguridad_informacion: 'Seguridad de la información',
  gestion_riesgos: 'Gestión de riesgos y desviaciones',
  quality_management: 'Quality management',
  seguimiento_operativo: 'Seguimiento operativo',
  gestion_documental: 'Gestión documental',
  knowledge_transfer: 'Knowledge transfer',
  coordinacion_equipos: 'Coordinación de equipos distribuidos',
  ceremonias: 'Ceremonias',
  gestion_capacidad: 'Gestión de capacidad',
  gestion_recursos: 'Gestión de recursos',
  rotacion_personal: 'Rotación de personal',
  usos_horarios: 'Usos horarios y geolocalización',
}

export const ACCIONES_POR_VARIABLE = {
  criticidad: [
    { area: 'quality_management', accion: 'Definir criterios de calidad claros y compartidos entre equipos.', motivo: 'La criticidad del proyecto exige estándares de calidad explícitos.', impacto: 'Reducción de desviaciones y entregables fuera de especificación.' },
    { area: 'quality_management', accion: 'Introducir validaciones intermedias durante el ciclo de trabajo.', motivo: 'El impacto potencial del proyecto justifica puntos de control periódicos.', impacto: 'Detección temprana de errores y desviaciones.' },
    { area: 'quality_management', accion: 'Incrementar la supervisión de entregables críticos.', motivo: 'Los entregables con alto impacto requieren revisión adicional.', impacto: 'Mayor calidad y alineación con expectativas del cliente.' },
    { area: 'quality_management', accion: 'Establecer revisiones técnicas previas a despliegues o cambios relevantes.', motivo: 'La criticidad del entorno exige validaciones antes de cambios.', impacto: 'Reducción de incidencias en producción.' },
    { area: 'seguridad_informacion', accion: 'Restringir accesos remotos en función del nivel de criticidad.', motivo: 'Proyectos críticos requieren control de acceso más estricto.', impacto: 'Protección de datos y sistemas sensibles.' },
    { area: 'seguridad_informacion', accion: 'Definir protocolos específicos de seguridad y control de accesos.', motivo: 'La criticidad aumenta la exposición a riesgos de seguridad.', impacto: 'Cumplimiento normativo y reducción de brechas de seguridad.' },
    { area: 'seguridad_informacion', accion: 'Establecer entornos controlados para actividades sensibles.', motivo: 'Actividades de alto impacto requieren aislamiento controlado.', impacto: 'Mitigación de riesgos en entornos productivos.' },
    { area: 'seguridad_informacion', accion: 'Reforzar la trazabilidad sobre accesos y modificaciones críticas.', motivo: 'La visibilidad del proyecto exige auditoría completa.', impacto: 'Capacidad de investigación y respuesta ante incidentes.' },
    { area: 'gestion_capacidad', accion: 'Monitorizar la carga operativa de los equipos.', motivo: 'Proyectos críticos requieren visibilidad de capacidad disponible.', impacto: 'Prevención de cuellos de botella y saturación.' },
    { area: 'gestion_capacidad', accion: 'Ajustar prioridades en función del impacto sobre el servicio.', motivo: 'La criticidad obliga a priorizar tareas de alto impacto.', impacto: 'Alineación de esfuerzos con valor del proyecto.' },
    { area: 'gestion_capacidad', accion: 'Redistribuir tareas para evitar cuellos de botella.', motivo: 'La criticidad no permite bloqueos prolongados.', impacto: 'Flujo de trabajo continuo y predecible.' },
    { area: 'gestion_capacidad', accion: 'Reservar capacidad para incidencias o tareas críticas no planificadas.', motivo: 'Proyectos críticos requieren margen para imprevistos.', impacto: 'Capacidad de respuesta ante eventos inesperados.' },
    { area: 'seguimiento_operativo', accion: 'Definir KPIs operativos alineados con la criticidad del servicio.', motivo: 'La criticidad del proyecto exige métricas de seguimiento.', impacto: 'Visibilidad del estado y salud del proyecto.' },
    { area: 'seguimiento_operativo', accion: 'Establecer mecanismos de reporting periódico.', motivo: 'La visibilidad del proyecto requiere informes regulares.', impacto: 'Toma de decisiones informada y oportuna.' },
    { area: 'seguimiento_operativo', accion: 'Incrementar la visibilidad sobre incidencias y desviaciones.', motivo: 'La criticidad exige detección temprana de problemas.', impacto: 'Reducción del impacto de incidencias.' },
    { area: 'seguimiento_operativo', accion: 'Implementar seguimiento reforzado en fases críticas del proyecto.', motivo: 'Las fases de alto impacto requieren supervisión adicional.', impacto: 'Control efectivo durante momentos críticos.' },
    { area: 'gestion_riesgos', accion: 'Definir umbrales de control y escalado.', motivo: 'La criticidad requiere límites claros para activar escalados.', impacto: 'Respuesta rápida ante desviaciones críticas.' },
    { area: 'gestion_riesgos', accion: 'Incrementar la frecuencia de seguimiento del proyecto.', motivo: 'Proyectos críticos necesitan supervisión más frecuente.', impacto: 'Detección y corrección temprana de desviaciones.' },
    { area: 'gestion_riesgos', accion: 'Establecer puntos de control síncronos en momentos críticos.', motivo: 'La criticidad exige coordinación en tiempo real en hitos clave.', impacto: 'Alineación de equipos en momentos decisivos.' },
    { area: 'gestion_riesgos', accion: 'Priorizar la gestión preventiva de riesgos operativos.', motivo: 'La criticidad del proyecto no permite reaccionar tarde.', impacto: 'Mitigación proactiva de riesgos identificados.' },
  ],
  coordinacion: [
    { area: 'knowledge_transfer', accion: 'Establecer sesiones estructuradas de transferencia de conocimiento.', motivo: 'La alta coordinación requerida exige conocimiento compartido.', impacto: 'Reducción de dependencias y silos de información.' },
    { area: 'knowledge_transfer', accion: 'Documentar decisiones técnicas y operativas relevantes.', motivo: 'La coordinación entre equipos requiere trazabilidad de decisiones.', impacto: 'Continuidad y alineación en la toma de decisiones.' },
    { area: 'knowledge_transfer', accion: 'Definir mecanismos de handover entre equipos y turnos.', motivo: 'La dependencia entre equipos exige traspasos estructurados.', impacto: 'Continuidad operativa sin pérdida de información.' },
    { area: 'knowledge_transfer', accion: 'Centralizar información clave en repositorios accesibles.', motivo: 'Equipos distribuidos necesitan acceso unificado a la información.', impacto: 'Reducción de tiempos de búsqueda y desinformación.' },
    { area: 'gestion_documental', accion: 'Centralizar documentación operativa y funcional.', motivo: 'La coordinación entre equipos exige una fuente única de verdad.', impacto: 'Consistencia y alineación en la ejecución del proyecto.' },
    { area: 'gestion_documental', accion: 'Definir estándares mínimos de documentación compartida.', motivo: 'La diversidad de equipos requiere formatos homogéneos.', impacto: 'Facilidad de acceso y comprensión de la documentación.' },
    { area: 'gestion_documental', accion: 'Mantener trazabilidad de cambios y decisiones.', motivo: 'La coordinación requiere visibilidad del historial del proyecto.', impacto: 'Capacidad de análisis retrospectivo y aprendizaje.' },
    { area: 'gestion_documental', accion: 'Asegurar accesibilidad homogénea para todos los equipos.', motivo: 'Equipos distribuidos necesitan acceso equitativo a la información.', impacto: 'Reducción de asimetrías de información entre equipos.' },
    { area: 'ceremonias', accion: 'Adaptar ceremonias al contexto híbrido o remoto.', motivo: 'La necesidad de coordinación requiere ceremonias efectivas.', impacto: 'Sincronización eficiente sin sobrecarga de reuniones.' },
    { area: 'ceremonias', accion: 'Establecer objetivos claros y tiempos definidos por reunión.', motivo: 'La coordinación requiere reuniones enfocadas y productivas.', impacto: 'Optimización del tiempo de los equipos.' },
    { area: 'ceremonias', accion: 'Priorizar ceremonias de sincronización en momentos críticos.', motivo: 'La coordinación es más necesaria en hitos clave del proyecto.', impacto: 'Alineación efectiva en momentos decisivos.' },
    { area: 'ceremonias', accion: 'Limitar reuniones innecesarias para reducir fatiga organizativa.', motivo: 'El exceso de coordinación puede ser contraproducente.', impacto: 'Mayor productividad y satisfacción del equipo.' },
    { area: 'coordinacion_equipos', accion: 'Definir ventanas comunes de trabajo síncrono.', motivo: 'La dependencia entre equipos requiere momentos de solapamiento.', impacto: 'Reducción de tiempos de espera y bloqueos.' },
    { area: 'coordinacion_equipos', accion: 'Establecer canales claros de comunicación y escalado.', motivo: 'La coordinación requiere rutas de comunicación definidas.', impacto: 'Resolución ágil de bloqueos y dependencias.' },
    { area: 'coordinacion_equipos', accion: 'Alinear dependencias entre equipos y responsables.', motivo: 'La coordinación requiere visibilidad de interdependencias.', impacto: 'Planificación realista y ejecución coordinada.' },
    { area: 'coordinacion_equipos', accion: 'Reducir silos organizativos entre modalidades de trabajo.', motivo: 'La coordinación se ve afectada por barreras organizativas.', impacto: 'Colaboración fluida entre equipos presenciales y remotos.' },
    { area: 'usos_horarios', accion: 'Establecer franjas horarias mínimas de solapamiento.', motivo: 'La coordinación requiere momentos de interacción en vivo.', impacto: 'Comunicación síncrona efectiva entre zonas horarias.' },
    { area: 'usos_horarios', accion: 'Priorizar mecanismos de comunicación asíncrona estructurada.', motivo: 'Las diferencias horarias limitan la coordinación síncrona.', impacto: 'Reducción de dependencia de reuniones en vivo.' },
    { area: 'usos_horarios', accion: 'Adaptar ceremonias y reuniones a zonas horarias comunes.', motivo: 'La equidad horaria mejora la participación y la coordinación.', impacto: 'Mayor inclusión y efectividad de las reuniones.' },
    { area: 'usos_horarios', accion: 'Definir tiempos máximos de respuesta entre equipos.', motivo: 'La coordinación distribuida requiere expectativas de respuesta claras.', impacto: 'Reducción de incertidumbre y tiempos de espera.' },
  ],
  madurez: [
    { area: 'gestion_documental', accion: 'Documentar procesos y decisiones clave de forma continua.', motivo: 'La baja madurez organizativa requiere formalización del conocimiento.', impacto: 'Reducción de dependencia de conocimiento tácito.' },
    { area: 'gestion_documental', accion: 'Definir mecanismos de onboarding y handover.', motivo: 'La baja madurez requiere procesos estructurados de incorporación.', impacto: 'Curva de aprendizaje más rápida para nuevos miembros.' },
    { area: 'gestion_documental', accion: 'Reducir dependencia de conocimiento tácito.', motivo: 'La baja madurez se caracteriza por información no documentada.', impacto: 'Menor riesgo ante rotación o ausencias.' },
    { area: 'gestion_documental', accion: 'Centralizar documentación del proyecto.', motivo: 'La información dispersa dificulta la autonomía del equipo.', impacto: 'Acceso homogéneo a información actualizada.' },
    { area: 'gestion_capacidad', accion: 'Planificar cargas de trabajo de forma estructurada.', motivo: 'La baja madurez requiere planificación explícita de capacidad.', impacto: 'Distribución equilibrada de la carga operativa.' },
    { area: 'gestion_capacidad', accion: 'Ajustar asignación de tareas según capacidad real.', motivo: 'Equipos con baja madurez necesitan supervisión de capacidad.', impacto: 'Prevención de sobrecarga y agotamiento.' },
    { area: 'gestion_capacidad', accion: 'Revisar periódicamente desviaciones de capacidad.', motivo: 'La baja madurez requiere ajustes frecuentes de planificación.', impacto: 'Corrección temprana de desviaciones de capacidad.' },
    { area: 'gestion_capacidad', accion: 'Identificar dependencias excesivas entre perfiles.', motivo: 'La baja madurez suele concentrar conocimiento en pocas personas.', impacto: 'Redistribución del conocimiento y reducción de riesgos.' },
    { area: 'quality_management', accion: 'Definir estándares de calidad compartidos.', motivo: 'La baja madurez requiere criterios de calidad explícitos.', impacto: 'Consistencia en la calidad de los entregables.' },
    { area: 'quality_management', accion: 'Establecer mecanismos de revisión autónoma.', motivo: 'Equipos con baja madurez necesitan guías de revisión.', impacto: 'Mayor calidad con menor supervisión directa.' },
    { area: 'quality_management', accion: 'Promover validaciones cruzadas entre equipos.', motivo: 'La baja madurez se beneficia de la revisión entre pares.', impacto: 'Detección de errores y mejora de calidad.' },
    { area: 'quality_management', accion: 'Reducir dependencia de supervisión constante.', motivo: 'La madurez baja requiere construir autonomía progresiva.', impacto: 'Mayor capacidad de trabajo independiente.' },
    { area: 'gestion_recursos', accion: 'Asignar responsabilidades según experiencia y autonomía.', motivo: 'La baja madurez requiere alinear tareas con capacidad real.', impacto: 'Distribución óptima del talento disponible.' },
    { area: 'gestion_recursos', accion: 'Reducir sobredependencia de perfiles senior.', motivo: 'La baja madurez concentra conocimiento crítico en pocas personas.', impacto: 'Distribución del conocimiento y reducción de riesgo.' },
    { area: 'gestion_recursos', accion: 'Identificar necesidades de acompañamiento operativo.', motivo: 'La baja madurez requiere soporte adicional en ciertas áreas.', impacto: 'Desarrollo de capacidades del equipo.' },
    { area: 'gestion_recursos', accion: 'Equilibrar autonomía y control organizativo.', motivo: 'La baja madurez requiere encontrar el punto óptimo de supervisión.', impacto: 'Gestión eficiente con nivel de control adecuado.' },
    { area: 'rotacion_personal', accion: 'Mantener documentación y procesos actualizados.', motivo: 'La rotación es más riesgosa con baja madurez documental.', impacto: 'Resiliencia ante cambios de personal.' },
    { area: 'rotacion_personal', accion: 'Definir mecanismos de backup funcional.', motivo: 'La baja madurez requiere redundancia de conocimiento.', impacto: 'Continuidad operativa ante ausencias.' },
    { area: 'rotacion_personal', accion: 'Reducir dependencia de personas concretas.', motivo: 'La concentración de conocimiento es un riesgo operativo.', impacto: 'Menor impacto ante rotación no planificada.' },
    { area: 'rotacion_personal', accion: 'Estandarizar procesos críticos del proyecto.', motivo: 'La estandarización reduce el impacto de la rotación.', impacto: 'Procesos predecibles y transferibles.' },
  ],
  riesgo: [
    { area: 'seguimiento_operativo', accion: 'Definir KPIs operativos y mecanismos de seguimiento continuo.', motivo: 'El alto riesgo operativo exige monitoreo permanente.', impacto: 'Visibilidad en tiempo real del estado operativo.' },
    { area: 'seguimiento_operativo', accion: 'Establecer reporting periódico sobre incidencias y bloqueos.', motivo: 'El riesgo requiere informes regulares de estado.', impacto: 'Toma de decisiones basada en datos actualizados.' },
    { area: 'seguimiento_operativo', accion: 'Incrementar visibilidad sobre riesgos operativos activos.', motivo: 'El riesgo requiere transparencia sobre amenazas activas.', impacto: 'Gestión proactiva de riesgos identificados.' },
    { area: 'seguimiento_operativo', accion: 'Implementar mecanismos de alerta temprana ante desviaciones.', motivo: 'El riesgo operativo requiere detección precoz de problemas.', impacto: 'Reducción del impacto de incidentes operativos.' },
    { area: 'gestion_documental', accion: 'Centralizar documentación operativa y técnica.', motivo: 'El riesgo requiere información accesible y actualizada.', impacto: 'Respuesta rápida ante incidencias operativas.' },
    { area: 'gestion_documental', accion: 'Mantener actualizados procedimientos críticos.', motivo: 'El riesgo operativo exige procedimientos fiables y vigentes.', impacto: 'Ejecución segura de procesos críticos.' },
    { area: 'gestion_documental', accion: 'Garantizar trazabilidad de cambios y decisiones.', motivo: 'El riesgo requiere capacidad de auditoría completa.', impacto: 'Investigación efectiva de incidentes.' },
    { area: 'gestion_documental', accion: 'Reducir dependencia de información informal o dispersa.', motivo: 'El riesgo aumenta con información no estructurada.', impacto: 'Información fiable y accesible para la toma de decisiones.' },
    { area: 'knowledge_transfer', accion: 'Estructurar sesiones periódicas de transferencia de conocimiento.', motivo: 'El riesgo operativo requiere conocimiento compartido.', impacto: 'Reducción de dependencia de conocimiento individual.' },
    { area: 'knowledge_transfer', accion: 'Documentar conocimiento crítico del proyecto.', motivo: 'El riesgo requiere preservar el conocimiento operativo clave.', impacto: 'Resiliencia ante rotación o ausencias.' },
    { area: 'knowledge_transfer', accion: 'Definir mecanismos de backup funcional entre perfiles.', motivo: 'El riesgo requiere redundancia de capacidades críticas.', impacto: 'Continuidad operativa ante bajas no planificadas.' },
    { area: 'knowledge_transfer', accion: 'Facilitar accesibilidad homogénea al conocimiento operativo.', motivo: 'El riesgo requiere que todo el equipo tenga acceso al conocimiento.', impacto: 'Capacidad de respuesta distribuida ante incidencias.' },
    { area: 'seguridad_informacion', accion: 'Definir protocolos de acceso y control de información sensible.', motivo: 'El riesgo operativo requiere protección de activos críticos.', impacto: 'Mitigación de brechas de seguridad.' },
    { area: 'seguridad_informacion', accion: 'Restringir accesos según roles y criticidad.', motivo: 'El riesgo exige control granular de accesos.', impacto: 'Protección de datos y sistemas sensibles.' },
    { area: 'seguridad_informacion', accion: 'Reforzar trazabilidad sobre acciones críticas.', motivo: 'El riesgo requiere auditoría completa de actividades sensibles.', impacto: 'Capacidad de detección y respuesta ante incidentes.' },
    { area: 'seguridad_informacion', accion: 'Establecer medidas de protección en entornos remotos e híbridos.', motivo: 'El riesgo aumenta en modalidades con menos control directo.', impacto: 'Operación segura en cualquier modalidad de trabajo.' },
    { area: 'continuidad_servicio', accion: 'Definir umbrales de riesgo y mecanismos de escalado.', motivo: 'El riesgo operativo requiere límites claros de actuación.', impacto: 'Respuesta estructurada ante eventos críticos.' },
    { area: 'continuidad_servicio', accion: 'Establecer revisiones periódicas de riesgos operativos.', motivo: 'El riesgo requiere evaluación continua del panorama de amenazas.', impacto: 'Actualización constante de medidas de mitigación.' },
    { area: 'continuidad_servicio', accion: 'Priorizar seguimiento sobre actividades críticas.', motivo: 'El riesgo exige focalizar supervisión en lo esencial.', impacto: 'Protección de procesos de mayor impacto.' },
    { area: 'continuidad_servicio', accion: 'Definir planes de contingencia ante incidencias relevantes.', motivo: 'El riesgo requiere preparación para escenarios adversos.', impacto: 'Capacidad de respuesta organizada ante crisis.' },
  ],
}

// ─── Enrichment helpers ─────────────────────────────────────────────────────

const KEYWORD_MAP = {
  // criticidad
  calidad: { related: ['c5', 'c6', 'c7'], vars: ['criticidad', 'calidad'], sev: 'alta', esfuerzo: 3 },
  validaciones: { related: ['c4', 'c6'], vars: ['criticidad'], sev: 'alta', esfuerzo: 3 },
  supervisión: { related: ['c4', 'c5', 'c8'], vars: ['criticidad', 'seguimiento'], sev: 'media', esfuerzo: 4 },
  revisiones: { related: ['c6', 'c7'], vars: ['criticidad', 'calidad'], sev: 'alta', esfuerzo: 3 },
  accesos: { related: ['c8', 'r2'], vars: ['criticidad', 'seguridad'], sev: 'alta', esfuerzo: 4 },
  seguridad: { related: ['c8', 'r2'], vars: ['criticidad', 'seguridad'], sev: 'critica', esfuerzo: 4 },
  entornos: { related: ['c7', 'r2'], vars: ['criticidad', 'seguridad'], sev: 'alta', esfuerzo: 5 },
  trazabilidad: { related: ['c8', 'r2', 'r4'], vars: ['criticidad', 'seguridad'], sev: 'alta', esfuerzo: 3 },
  monitorizar: { related: ['c4', 'r4', 'r7'], vars: ['criticidad', 'capacidad'], sev: 'media', esfuerzo: 4 },
  prioridades: { related: ['c2', 'c4'], vars: ['criticidad'], sev: 'media', esfuerzo: 3 },
  redistribuir: { related: ['c4', 'r7'], vars: ['criticidad', 'capacidad'], sev: 'media', esfuerzo: 4 },
  capacidad: { related: ['r7', 'c4'], vars: ['criticidad', 'capacidad'], sev: 'alta', esfuerzo: 4 },
  KPIs: { related: ['c4', 'c8', 'r4'], vars: ['criticidad', 'seguimiento'], sev: 'media', esfuerzo: 3 },
  reporting: { related: ['c4', 'c8', 'r4'], vars: ['criticidad', 'seguimiento'], sev: 'media', esfuerzo: 3 },
  visibilidad: { related: ['c8', 'r4'], vars: ['criticidad', 'seguimiento'], sev: 'media', esfuerzo: 3 },
  umbrales: { related: ['c4', 'c7', 'r6'], vars: ['criticidad', 'riesgos'], sev: 'alta', esfuerzo: 3 },
  frecuencia: { related: ['c4', 'r4'], vars: ['criticidad', 'riesgos'], sev: 'media', esfuerzo: 3 },
  'control síncronos': { related: ['c4', 's2', 's5'], vars: ['criticidad', 'coordinacion'], sev: 'alta', esfuerzo: 4 },
  preventiva: { related: ['c4', 'c7', 'r6'], vars: ['criticidad', 'riesgos'], sev: 'alta', esfuerzo: 3 },
  // coordinacion
  'transferencia de conocimiento': { related: ['m5', 'm7', 'r3'], vars: ['coordinacion', 'madurez'], sev: 'media', esfuerzo: 3 },
  documentar: { related: ['m3', 'm4', 'r3'], vars: ['coordinacion', 'madurez'], sev: 'media', esfuerzo: 3 },
  handover: { related: ['m7', 'r3'], vars: ['coordinacion', 'madurez'], sev: 'media', esfuerzo: 3 },
  repositorios: { related: ['m3', 's6'], vars: ['coordinacion', 'madurez'], sev: 'media', esfuerzo: 3 },
  'documentación operativa': { related: ['m3', 's6', 'r4'], vars: ['coordinacion', 'madurez'], sev: 'media', esfuerzo: 3 },
  estándares: { related: ['m3', 'm4'], vars: ['coordinacion', 'madurez'], sev: 'baja', esfuerzo: 3 },
  accesibilidad: { related: ['m3', 's1'], vars: ['coordinacion', 'madurez'], sev: 'baja', esfuerzo: 3 },
  ceremonias: { related: ['s7', 's5'], vars: ['coordinacion'], sev: 'media', esfuerzo: 3 },
  reunión: { related: ['s7', 's5'], vars: ['coordinacion'], sev: 'media', esfuerzo: 3 },
  sincronización: { related: ['s5', 's7', 's2'], vars: ['coordinacion'], sev: 'alta', esfuerzo: 4 },
  'ventanas comunes': { related: ['s1', 's3', 's6'], vars: ['coordinacion'], sev: 'alta', esfuerzo: 4 },
  canales: { related: ['s1', 's2', 's6'], vars: ['coordinacion'], sev: 'media', esfuerzo: 3 },
  dependencias: { related: ['s3', 's6'], vars: ['coordinacion'], sev: 'alta', esfuerzo: 4 },
  'silos organizativos': { related: ['s1', 's6', 's8'], vars: ['coordinacion'], sev: 'media', esfuerzo: 5 },
  franjas: { related: ['s1', 's2'], vars: ['coordinacion'], sev: 'media', esfuerzo: 3 },
  asíncrona: { related: ['s2', 's5'], vars: ['coordinacion'], sev: 'baja', esfuerzo: 3 },
  'zonas horarias': { related: ['s1', 's2'], vars: ['coordinacion'], sev: 'media', esfuerzo: 3 },
  respuesta: { related: ['s2', 's5'], vars: ['coordinacion'], sev: 'media', esfuerzo: 3 },
  // madurez
  'procesos y decisiones': { related: ['m3', 'm4', 'r3'], vars: ['madurez', 'documentacion'], sev: 'alta', esfuerzo: 3 },
  onboarding: { related: ['m1', 'm5', 'm7'], vars: ['madurez', 'recursos'], sev: 'media', esfuerzo: 3 },
  'conocimiento tácito': { related: ['m3', 'r3', 'm7'], vars: ['madurez', 'riesgo'], sev: 'alta', esfuerzo: 4 },
  planificar: { related: ['m2', 'm6', 'r7'], vars: ['madurez', 'capacidad'], sev: 'media', esfuerzo: 4 },
  responsables: { related: ['m1', 's3', 'r3'], vars: ['madurez', 'recursos'], sev: 'media', esfuerzo: 3 },
  sobredependencia: { related: ['m1', 'm7', 'r3'], vars: ['madurez', 'recursos'], sev: 'alta', esfuerzo: 5 },
  'backup funcional': { related: ['m7', 'r3'], vars: ['madurez', 'riesgo'], sev: 'alta', esfuerzo: 4 },
  estandarizar: { related: ['m4', 'm8', 'r6'], vars: ['madurez', 'calidad'], sev: 'alta', esfuerzo: 5 },
  // riesgo
  'seguimiento continuo': { related: ['r4', 'r7', 'c4'], vars: ['riesgo', 'seguimiento'], sev: 'alta', esfuerzo: 4 },
  'alertas': { related: ['r4', 'c4'], vars: ['riesgo', 'seguimiento'], sev: 'alta', esfuerzo: 4 },
  'procedimientos críticos': { related: ['r6', 'r8', 'm3'], vars: ['riesgo', 'documentacion'], sev: 'alta', esfuerzo: 3 },
  'planes de contingencia': { related: ['r6', 'r8'], vars: ['riesgo', 'continuidad'], sev: 'critica', esfuerzo: 4 },
  'escalado': { related: ['r4', 'c4', 's5'], vars: ['riesgo', 'continuidad'], sev: 'alta', esfuerzo: 3 },
  'protocolos': { related: ['r2', 'r6', 'c8'], vars: ['riesgo', 'seguridad'], sev: 'alta', esfuerzo: 4 },
  'protección': { related: ['r2', 'c7'], vars: ['riesgo', 'seguridad'], sev: 'alta', esfuerzo: 4 },
  'contingencia': { related: ['r6', 'r8'], vars: ['riesgo', 'continuidad'], sev: 'critica', esfuerzo: 4 },
}

const FASE_MAP = {
  inicio: ['Inicio'],
  desarrollo: ['Desarrollo'],
  despliegue: ['Despliegue'],
  operacion: ['Operación'],
  mejora: ['Mejora continua'],
  todas: ['Inicio', 'Desarrollo', 'Despliegue', 'Operación', 'Mejora continua'],
  critico: ['Despliegue', 'Operación'],
  temprano: ['Inicio', 'Desarrollo'],
  operativo: ['Operación', 'Mejora continua'],
}

const MODALIDAD_MAP = {
  remota: ['Remota', 'Remota con gobernanza reforzada'],
  hibrida: ['Híbrida', 'Remota con gobernanza reforzada'],
  presencial: ['Presencial reforzada', 'Presencial con componente híbrido', 'Híbrida'],
  todas: ['Presencial reforzada', 'Presencial con componente híbrido', 'Híbrida', 'Remota con gobernanza reforzada', 'Remota'],
}

function detectKeyword(texto) {
  const lower = texto.toLowerCase()
  for (const [kw, data] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(kw)) return data
  }
  return null
}

function inferQuestionIds(varId) {
  if (varId === 'criticidad') return ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8']
  if (varId === 'coordinacion') return ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']
  if (varId === 'madurez') return ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8']
  if (varId === 'riesgo') return ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8']
  return []
}

function inferSeveridad(varId) {
  if (varId === 'criticidad' || varId === 'riesgo') return 'alta'
  return 'media'
}

function inferFases(varId) {
  if (varId === 'criticidad') return FASE_MAP.critico
  if (varId === 'coordinacion') return FASE_MAP.todas
  if (varId === 'madurez') return FASE_MAP.temprano
  if (varId === 'riesgo') return FASE_MAP.operativo
  return FASE_MAP.todas
}

function inferModalidades(varId) {
  if (varId === 'coordinacion') return MODALIDAD_MAP.hibrida
  if (varId === 'madurez') return MODALIDAD_MAP.remota
  return MODALIDAD_MAP.todas
}

export function enrichAction(action, varId) {
  const detected = detectKeyword(action.accion)
  const baseQ = inferQuestionIds(varId)
  const related = detected?.related || baseQ.slice(0, 4)
  const varsRel = detected?.vars || [varId]
  return {
    ...action,
    variablePrincipal: varId,
    relatedQuestionIds: related,
    variablesRelacionadas: varsRel,
    severidad: detected?.sev || inferSeveridad(varId),
    esfuerzo: detected?.esfuerzo || 3,
    valorHabilitador: varsRel.length > 1 || related.length >= 4,
    fases: inferFases(varId),
    modalidades: inferModalidades(varId),
  }
}

export function getAccionesEnriquecidas() {
  const result = {}
  for (const [varId, acciones] of Object.entries(ACCIONES_POR_VARIABLE)) {
    result[varId] = acciones.map(a => enrichAction(a, varId))
  }
  return result
}
