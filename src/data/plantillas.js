export const PLANTILLAS = [
  {
    id: 'lanzamiento',
    nombre: 'Lanzamiento de nueva funcionalidad SaaS',
    descripcion: 'Desarrollo y despliegue de una nueva funcionalidad de producto para clientes actuales o nuevos usuarios.',
    contexto: {
      nombre: 'Lanzamiento de nueva funcionalidad SaaS',
      descripcion: 'Desarrollo y despliegue de una nueva funcionalidad de producto para clientes actuales o nuevos usuarios.',
      tipologia: 'aplicacion',
      tamanoEquipo: '6-10 personas',
      modalidadActual: 'Híbrida',
      faseProyecto: 'Desarrollo',
      stakeholders: ['Project Manager', 'Product Manager', 'Equipo de desarrollo', 'QA / Testing', 'Customer Success', 'Dirección / negocio'],
      observaciones: 'Proyecto orientado a entrega de valor de producto, con necesidad de coordinación entre producto, desarrollo, calidad y áreas de cliente.',
    },
  },
  {
    id: 'migracion',
    nombre: 'Migración de infraestructura cloud',
    descripcion: 'Migración de servicios, entornos o componentes de plataforma hacia una nueva infraestructura cloud o arquitectura técnica.',
    contexto: {
      nombre: 'Migración de infraestructura cloud',
      descripcion: 'Migración de servicios, entornos o componentes de plataforma hacia una nueva infraestructura cloud o arquitectura técnica.',
      tipologia: 'infraestructura',
      tamanoEquipo: '4-8 personas',
      modalidadActual: 'Híbrida',
      faseProyecto: 'Despliegue',
      stakeholders: ['Project Manager', 'Tech Lead', 'DevOps / SRE', 'Equipo de infraestructura', 'Seguridad de la información', 'Operaciones / soporte'],
      observaciones: 'Proyecto con impacto potencial sobre disponibilidad, despliegues, configuración técnica, seguridad y continuidad del servicio.',
    },
  },
  {
    id: 'incidencia',
    nombre: 'Gestión de incidencia crítica o mejora operativa',
    descripcion: 'Proyecto orientado a resolver una incidencia relevante, estabilizar el servicio o mejorar procesos operativos críticos.',
    contexto: {
      nombre: 'Gestión de incidencia crítica o mejora operativa',
      descripcion: 'Proyecto orientado a resolver una incidencia relevante, estabilizar el servicio o mejorar procesos operativos críticos.',
      tipologia: 'operacion',
      tamanoEquipo: '4-8 personas',
      modalidadActual: 'Híbrida',
      faseProyecto: 'Operación',
      stakeholders: ['Project Manager', 'Operaciones / soporte', 'DevOps / SRE', 'Seguridad de la información', 'Customer Success', 'Dirección / negocio'],
      observaciones: 'Proyecto con necesidad de respuesta rápida, trazabilidad, seguimiento operativo, coordinación entre equipos y control de riesgos.',
    },
  },
]

export const PLANTILLA_VACIA = {
  id: 'vacia',
  nombre: 'Crear proyecto desde cero',
  descripcion: 'Define manualmente todos los datos del proyecto sin plantilla predefinida.',
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
}
