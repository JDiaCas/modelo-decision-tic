import React, { useState, useMemo, useCallback } from 'react'
import { useApp } from './AppContext.jsx'
import {
  exportarCSV,
  exportarJSON,
  exportarMarkdown,
  exportarParaPlataforma,
} from '../utils/exportacionTareas.js'
import { STEPS_OPERATIVOS } from './ProgressBar.jsx'

const ESTADOS_TAREA = ['Pendiente', 'En curso', 'Bloqueada', 'Completada', 'Descartada']
const PRIORIDADES = ['Crítica', 'Alta', 'Media', 'Baja']
const RESPONSABLES_SUGERIDOS = [
  'Project Manager', 'Product Manager', 'Tech Lead',
  'DevOps / SRE', 'Seguridad de la información', 'Operaciones / soporte',
  'QA / Testing', 'Customer Success', 'Dirección / negocio',
]

export default function TareasPanel() {
  const { state, dispatch } = useApp()
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas')
  const [filtroOrigen, setFiltroOrigen] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [editandoId, setEditandoId] = useState(null)
  const [showExport, setShowExport] = useState(false)

  const tareas = state.tareas

  const filtradas = useMemo(() => {
    return tareas.filter(t => {
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false
      if (filtroOrigen !== 'todos' && (t.origen || '').toLowerCase() !== filtroOrigen.toLowerCase()) return false
      if (filtroEstado !== 'todas' && t.estado !== filtroEstado) return false
      return true
    })
  }, [tareas, filtroPrioridad, filtroOrigen, filtroEstado])

  // Prioridad sorting helper
  const ordenPrioridad = { crítica: 1, alta: 2, media: 3, baja: 4 }
  const sorted = useMemo(() => {
    return [...filtradas].sort((a, b) => {
      const pa = ordenPrioridad[a.prioridad?.toLowerCase()] || 9
      const pb = ordenPrioridad[b.prioridad?.toLowerCase()] || 9
      return pa - pb
    })
  }, [filtradas])

  const handleDelete = useCallback((id) => {
    dispatch({ type: 'DELETE_TAREA', payload: id })
  }, [dispatch])

  const handleEdit = useCallback((id, cambios) => {
    dispatch({ type: 'EDIT_TAREA', payload: { id, cambios } })
  }, [dispatch])

  const handleExport = useCallback((tipo, plataforma) => {
    const nombre = state.contexto.nombre || 'proyecto'
    const lista = filtradas.length > 0 ? filtradas : tareas
    if (tipo === 'csv') exportarCSV(lista, nombre)
    else if (tipo === 'json') exportarJSON(lista, nombre)
    else if (tipo === 'md') exportarMarkdown(lista, nombre)
    else if (tipo === 'plataforma') exportarParaPlataforma(lista, nombre, plataforma)
  }, [filtradas, tareas, state.contexto.nombre])

  const origenesUnicos = useMemo(() => {
    const set = new Set(tareas.map(t => t.origen).filter(Boolean))
    return ['todos', ...Array.from(set)]
  }, [tareas])

  const stats = useMemo(() => {
    return {
      total: tareas.length,
      criticas: tareas.filter(t => t.prioridad === 'Crítica').length,
      altas: tareas.filter(t => t.prioridad === 'Alta').length,
      pendientes: tareas.filter(t => t.estado === 'Pendiente').length,
      sinResp: tareas.filter(t => !t.responsable).length,
      playbook: tareas.filter(t => t.origen === 'Playbook').length,
      checklist: tareas.filter(t => t.origen === 'Checklist').length,
    }
  }, [tareas])

  const nombreProyecto = state.contexto.nombre || '(sin nombre)'

  return (
    <div className="section-card">
      <h2>Tareas de gestión</h2>
      <p className="section-desc">
        Gestiona las tareas derivadas del diagnóstico, el checklist y las acciones priorizadas.
        Puedes editarlas, asignar responsables y exportarlas a tu herramienta favorita.
      </p>

      {/* Stats */}
      <div className="tareas-stats">
        <div className="stat-item"><span className="stat-num">{stats.total}</span> Total</div>
        <div className="stat-item"><span className="stat-num text-red">{stats.criticas}</span> Críticas</div>
        <div className="stat-item"><span className="stat-num text-warning">{stats.altas}</span> Altas</div>
        <div className="stat-item"><span className="stat-num text-amber">{stats.pendientes}</span> Pendientes</div>
        {stats.sinResp > 0 && (
          <div className="stat-item"><span className="stat-num text-red">{stats.sinResp}</span> Sin responsable</div>
        )}
        <div className="stat-item"><span className="stat-num">{stats.playbook}</span> Playbook</div>
        <div className="stat-item"><span className="stat-num">{stats.checklist}</span> Checklist</div>
      </div>

      {/* Filters */}
      <div className="tareas-filtros">
        <div className="filtro-group">
          <label>Prioridad:</label>
          <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
            <option value="todas">Todas</option>
            {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="filtro-group">
          <label>Origen:</label>
          <select value={filtroOrigen} onChange={e => setFiltroOrigen(e.target.value)}>
            {origenesUnicos.map(o => (
              <option key={o} value={o}>
                {o === 'todos' ? 'Todos' : o}
              </option>
            ))}
          </select>
        </div>
        <div className="filtro-group">
          <label>Estado:</label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="todas">Todos</option>
            {ESTADOS_TAREA.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Export buttons */}
        <div className="tareas-export-group">
          <button className="btn btn-sm btn-outline" onClick={() => setShowExport(!showExport)}>
            Exportar ▼
          </button>
          {showExport && (
            <div className="tareas-export-dropdown">
              <button onClick={() => { handleExport('csv'); setShowExport(false) }}>CSV</button>
              <button onClick={() => { handleExport('json'); setShowExport(false) }}>JSON</button>
              <button onClick={() => { handleExport('md'); setShowExport(false) }}>Markdown</button>
              <button onClick={() => { handleExport('plataforma', 'asana'); setShowExport(false) }}>Asana</button>
              <button onClick={() => { handleExport('plataforma', 'clickup'); setShowExport(false) }}>ClickUp</button>
            </div>
          )}
        </div>
      </div>

      {/* Tasks table */}
      {sorted.length === 0 ? (
        <div className="empty-acciones">
          <p>No hay tareas. Genera tareas desde las acciones priorizadas o el checklist del PM.</p>
        </div>
      ) : (
        <div className="tabla-tareas-wrapper">
          <table className="tabla-tareas">
            <thead>
              <tr>
                <th>Título</th>
                <th>Origen</th>
                <th>Prioridad</th>
                <th>Responsable</th>
                <th>Fecha objetivo</th>
                <th>Estado</th>
                <th>Etiquetas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(t => (
                <TaskRow
                  key={t.id}
                  task={t}
                  isEditing={editandoId === t.id}
                  onStartEdit={() => setEditandoId(t.id)}
                  onSave={handleEdit}
                  onDelete={handleDelete}
                  onCancelEdit={() => setEditandoId(null)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 6 })}>
          Anterior
        </button>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'SET_STEP', payload: 8 })}>
          Ir al informe final
        </button>
      </div>
    </div>
  )
}

/* ─── Task row sub-component ─────────────────────────────────────────── */

function TaskRow({ task, isEditing, onStartEdit, onSave, onDelete, onCancelEdit }) {
  const [form, setForm] = useState({
    titulo: task.titulo,
    responsable: task.responsable || '',
    fechaObjetivo: task.fechaObjetivo || '',
    estado: task.estado || 'Pendiente',
    prioridad: task.prioridad || 'Media',
    notas: task.notas || '',
  })

  React.useEffect(() => {
    setForm({
      titulo: task.titulo,
      responsable: task.responsable || '',
      fechaObjetivo: task.fechaObjetivo || '',
      estado: task.estado || 'Pendiente',
      prioridad: task.prioridad || 'Media',
      notas: task.notas || '',
    })
  }, [task])

  const handleSave = () => {
    onSave(task.id, form)
    onCancelEdit()
  }

  if (isEditing) {
    return (
      <tr className="tarea-edit-row">
        <td><input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} /></td>
        <td><span className="badge badge-blue">{task.origen}</span></td>
        <td>
          <select value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}>
            {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </td>
        <td>
          <select value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))}>
            <option value="">—</option>
            {RESPONSABLES_SUGERIDOS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </td>
        <td><input type="date" value={form.fechaObjetivo} onChange={e => setForm(f => ({ ...f, fechaObjetivo: e.target.value }))} /></td>
        <td>
          <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
            {ESTADOS_TAREA.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </td>
        <td>{(task.etiquetas || []).join(', ')}</td>
        <td>
          <div className="tarea-actions">
            <button className="btn btn-xs btn-primary" onClick={handleSave}>Guardar</button>
            <button className="btn btn-xs btn-outline" onClick={onCancelEdit}>Cancelar</button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td className="td-titulo">
        {task.titulo}
        {task.notas && <span className="tarea-nota-indicator" title={task.notas}>📎</span>}
      </td>
      <td><span className={`badge badge-${task.origen === 'Playbook' ? 'purple' : 'blue'}`}>{task.origen}</span></td>
      <td><span className={`badge badge-${prioridadColor(task.prioridad)}`}>{task.prioridad}</span></td>
      <td className="td-responsable">{task.responsable || <em className="text-gray">—</em>}</td>
      <td className="td-fecha">{task.fechaObjetivo || '—'}</td>
      <td><span className={`badge badge-${estadoColor(task.estado)}`}>{task.estado}</span></td>
      <td className="td-etiquetas">{(task.etiquetas || []).slice(0, 2).join(', ')}</td>
      <td>
        <div className="tarea-actions">
          <button className="btn btn-xs btn-outline" onClick={onStartEdit}>Editar</button>
          <button className="btn btn-xs btn-outline tarea-delete" onClick={() => onDelete(task.id)}>×</button>
        </div>
      </td>
    </tr>
  )
}

/* ─── Color helpers ──────────────────────────────────────────────────── */

function prioridadColor(p) {
  const map = { crítica: 'red', alta: 'amber', media: 'blue', baja: 'gray' }
  return map[p?.toLowerCase()] || 'gray'
}

function estadoColor(e) {
  const map = { pendiente: 'red', en_curso: 'amber', bloqueada: 'red', completada: 'green', descartada: 'gray' }
  return map[e?.toLowerCase()] || 'gray'
}
