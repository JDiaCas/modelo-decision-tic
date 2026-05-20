/* ─── Export helpers ─────────────────────────────────────────────────── */

function escapeCsv(val) {
  if (val == null) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function prioridadNum(p) {
  const map = { crítica: 1, alta: 2, media: 3, baja: 4 }
  return map[p?.toLowerCase()] || 9
}

/* ─── CSV Export ──────────────────────────────────────────────────────── */

export function exportarCSV(tareas, nombreProyecto = 'proyecto') {
  const headers = [
    'Task Name', 'Description', 'Assignee', 'Due Date',
    'Priority', 'Status', 'Tags', 'Source', 'Project',
    'Section', 'Related Variable', 'Expected Impact', 'Notes',
  ]
  const rows = tareas.map(t => [
    t.titulo,
    t.descripcion,
    t.responsable,
    t.fechaObjetivo || '',
    t.prioridad,
    t.estado,
    (t.etiquetas || []).join('; '),
    t.origen,
    nombreProyecto,
    t.seccion || '',
    t.variableRelacionada || '',
    t.impactoEsperado || '',
    t.notas || '',
  ].map(escapeCsv))

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  descargarArchivo(csv, `tareas-${nombreProyecto}.csv`, 'text/csv;charset=utf-8;')
}

/* ─── JSON Export ─────────────────────────────────────────────────────── */

export function exportarJSON(tareas, nombreProyecto = 'proyecto') {
  const data = { proyecto: nombreProyecto, fecha: new Date().toISOString(), tareas }
  const json = JSON.stringify(data, null, 2)
  descargarArchivo(json, `tareas-${nombreProyecto}.json`, 'application/json')
}

/* ─── Markdown Export ────────────────────────────────────────────────── */

export function exportarMarkdown(tareas, nombreProyecto = 'proyecto') {
  const lines = [`# Tareas de gestión - ${nombreProyecto}`, '']
  const porPrioridad = { crítica: [], alta: [], media: [], baja: [] }
  const labels = { crítica: 'Críticas', alta: 'Altas', media: 'Medias', baja: 'Bajas' }

  for (const t of tareas) {
    const p = t.prioridad?.toLowerCase()
    if (porPrioridad[p]) porPrioridad[p].push(t)
    else porPrioridad.baja.push(t)
  }

  for (const [key, label] of Object.entries(labels)) {
    const items = porPrioridad[key]
    if (items.length === 0) continue
    lines.push(`## Tareas ${label}`, '')
    for (const t of items) {
      lines.push(`- [ ] ${t.titulo}`)
      if (t.responsable) lines.push(`  - Responsable: ${t.responsable}`)
      if (t.fechaObjetivo) lines.push(`  - Fecha objetivo: ${t.fechaObjetivo}`)
      lines.push(`  - Prioridad: ${t.prioridad}`)
      lines.push(`  - Origen: ${t.origen}`)
      if (t.descripcion) lines.push(`  - Descripción: ${t.descripcion}`)
      lines.push('')
    }
  }

  descargarArchivo(lines.join('\n'), `tareas-${nombreProyecto}.md`, 'text/markdown;charset=utf-8;')
}

/* ─── Asana / ClickUp export (CSV with standard fields) ───────────────── */

export function exportarParaPlataforma(tareas, nombreProyecto = 'proyecto', plataforma = 'asana') {
  const headers = ['Name', 'Description', 'Assignee', 'Due Date', 'Priority', 'Status', 'Tags']
  const rows = tareas.map(t => {
    const descExtra = [
      t.origen ? `Origen: ${t.origen}` : '',
      t.variableRelacionada ? `Variable: ${t.variableRelacionada}` : '',
      t.motivo ? `Motivo: ${t.motivo}` : '',
      t.impactoEsperado ? `Impacto: ${t.impactoEsperado}` : '',
      t.idRelacionado ? `ID Asociado: ${t.idRelacionado}` : '',
    ].filter(Boolean).join(' | ')
    const descFinal = t.descripcion
      ? `${t.descripcion}\n\n${descExtra}`
      : descExtra
    return [
      t.titulo,
      descFinal,
      t.responsable || '',
      t.fechaObjetivo || '',
      t.prioridad,
      t.estado,
      (t.etiquetas || []).join('; '),
    ].map(escapeCsv)
  })

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const suffix = plataforma === 'clickup' ? 'clickup' : 'asana'
  descargarArchivo(csv, `tareas-${nombreProyecto}-${suffix}.csv`, 'text/csv;charset=utf-8;')
}

/* ─── Internal helper ────────────────────────────────────────────────── */

function descargarArchivo(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/* ─── Suggest priority from action/checklist ──────────────────────────── */

export function sugerirPrioridad(origen, tipo, prioridadGlobal, checklistEstado, seccion) {
  if (origen === 'playbook') {
    if (tipo === 'correctiva' && prioridadGlobal >= 80) return 'Crítica'
    if (tipo === 'correctiva' && prioridadGlobal >= 50) return 'Alta'
    if (tipo === 'preventiva' && prioridadGlobal >= 50) return 'Alta'
    if (tipo === 'preventiva') return 'Media'
    if (tipo === 'optimizadora') return 'Media'
    return 'Media'
  }
  if (origen === 'checklist') {
    const criticas = ['riesgos', 'seguridad', 'gobernanza', 'calidad']
    const esCritica = criticas.some(s => seccion?.toLowerCase().includes(s))
    if (checklistEstado === 'pendiente' && esCritica) return 'Alta'
    if (checklistEstado === 'pendiente') return 'Media'
    if (checklistEstado === 'en_curso') return 'Media'
    return 'Baja'
  }
  return 'Media'
}

/* ─── Suggest responsible from action/checklist area ─────────────────── */

const MAPA_RESPONSABLES = {
  seguridad: 'Seguridad de la información',
  riesgo: 'DevOps / SRE',
  contingencia: 'DevOps / SRE',
  calidad: 'QA / Testing',
  gobernanza: 'Project Manager',
  roles: 'Project Manager',
  coordinacion: 'Project Manager',
  documentacion: 'Project Manager',
  conocimiento: 'Project Manager',
  seguimiento: 'Project Manager',
  producto: 'Product Manager',
  priorizacion: 'Product Manager',
  tecnologia: 'Tech Lead',
  arquitectura: 'Tech Lead',
  despliegue: 'DevOps / SRE',
  operaciones: 'Operaciones / soporte',
  soporte: 'Operaciones / soporte',
  cliente: 'Customer Success',
  negocio: 'Dirección / negocio',
}

export function sugerirResponsable(texto) {
  const t = texto?.toLowerCase() || ''
  for (const [key, resp] of Object.entries(MAPA_RESPONSABLES)) {
    if (t.includes(key)) return resp
  }
  return 'Project Manager'
}

/* ─── Build task from action ─────────────────────────────────────────── */

export function crearTareaDesdeAccion(accion, proyectoNombre = '') {
  const prioridad = sugerirPrioridad('playbook', accion.tipo, accion.prioridad)
  return {
    id: 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7),
    titulo: accion.accion,
    descripcion: `Acción derivada del playbook operativo.\n\n${accion.motivo || ''}`.trim(),
    origen: 'Playbook',
    seccion: accion.area || '',
    variableRelacionada: accion.variablePrincipal || accion.variable || '',
    tipo: accion.tipo,
    prioridadGlobal: accion.prioridad || 0,
    motivo: accion.motivo || '',
    impactoEsperado: accion.impactoEsperado || '',
    esfuerzo: accion.esfuerzo || '',
    prioridad,
    responsable: sugerirResponsable(accion.accion + ' ' + (accion.area || '')),
    fechaObjetivo: '',
    estado: 'Pendiente',
    etiquetas: [accion.tipo, accion.variablePrincipal].filter(Boolean),
    proyecto: proyectoNombre,
    idRelacionado: accion.id,
    notas: '',
    fechaCreacion: new Date().toISOString(),
    plataformaObjetivo: '',
  }
}

/* ─── Build task from checklist item ─────────────────────────────────── */

export function crearTareaDesdeChecklist(item, seccionNombre, estadoChecklist, proyectoNombre = '') {
  const prioridad = sugerirPrioridad('checklist', null, null, estadoChecklist, seccionNombre)
  return {
    id: 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7),
    titulo: item.texto,
    descripcion: `Acción derivada del checklist del Project Manager.\nSección: ${seccionNombre}\nEstado del checklist: ${estadoChecklist}`,
    origen: 'Checklist',
    seccion: seccionNombre || '',
    variableRelacionada: '',
    tipo: '',
    prioridadGlobal: 0,
    motivo: '',
    impactoEsperado: '',
    esfuerzo: '',
    prioridad,
    responsable: sugerirResponsable(item.texto + ' ' + (seccionNombre || '')),
    fechaObjetivo: '',
    estado: 'Pendiente',
    etiquetas: ['checklist', seccionNombre].filter(Boolean),
    proyecto: proyectoNombre,
    idRelacionado: item.id,
    notas: '',
    fechaCreacion: new Date().toISOString(),
    plataformaObjetivo: '',
  }
}
