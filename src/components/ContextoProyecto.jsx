import React, { useState } from 'react'
import { useApp } from './AppContext.jsx'
import { TIPOLOGIAS } from '../data/tipologias.js'
import { PLANTILLAS, PLANTILLA_VACIA } from '../data/plantillas.js'

const STAKEHOLDER_OPTIONS = [
  'Dirección / negocio', 'Project Manager', 'Product Manager', 'Product Owner',
  'Tech Lead', 'Equipo de desarrollo', 'QA / Testing', 'DevOps / SRE',
  'Equipo de infraestructura', 'Seguridad de la información', 'Data / Analytics',
  'Operaciones / soporte', 'Customer Success', 'Soporte técnico',
  'Ventas / comercial', 'Marketing', 'Cliente externo', 'Usuario final',
  'Legal / Compliance', 'Finanzas', 'Recursos Humanos',
  'Proveedor externo', 'Partner tecnológico', 'Otro',
]

function StakeholderSelect({ selected, onChange }) {
  const [search, setSearch] = useState('')
  const [custom, setCustom] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filtered = STAKEHOLDER_OPTIONS.filter(
    (opt) => opt.toLowerCase().includes(search.toLowerCase()) && !selected.includes(opt)
  )

  const addStakeholder = (value) => {
    if (value && !selected.includes(value)) {
      onChange([...selected, value])
    }
    setSearch('')
    setCustom('')
  }

  const addCustom = () => {
    if (custom.trim()) {
      addStakeholder(custom.trim())
    }
  }

  const removeStakeholder = (value) => {
    onChange(selected.filter((s) => s !== value))
  }

  return (
    <div className="stakeholder-selector">
      <div className="stakeholder-chips">
        {selected.map((s) => (
          <span key={s} className="chip">
            {s}
            <button type="button" className="chip-remove" onClick={() => removeStakeholder(s)}>×</button>
          </span>
        ))}
      </div>

      <div className="stakeholder-input-wrapper">
        <input
          type="text"
          className="stakeholder-search"
          placeholder={selected.length === 0 ? 'Buscar o escribir stakeholder...' : 'Añadir más stakeholders...'}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showDropdown && (
          <div className="stakeholder-dropdown">
            {filtered.map((opt) => (
              <div key={opt} className="stakeholder-option" onMouseDown={() => addStakeholder(opt)}>
                {opt === 'Otro' ? (
                  <div className="otro-input-wrapper">
                    <span>Otro:</span>
                    <input
                      type="text"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="Especificar..."
                      onMouseDown={(e) => e.stopPropagation()}
                      onBlur={() => { if (custom.trim()) addCustom() }}
                    />
                  </div>
                ) : (
                  opt
                )}
              </div>
            ))}
            {filtered.length === 0 && search && (
              <div className="stakeholder-option" onMouseDown={() => addStakeholder(search)}>
                Añadir "{search}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContextoProyecto() {
  const { state, dispatch } = useApp()
  const { contexto, plantilla } = state

  const [plantillaAviso, setPlantillaAviso] = useState('')

  const handleChange = (field, value) => {
    dispatch({ type: 'SET_CONTEXTO', payload: { [field]: value } })
  }

  const handleStakeholders = (stakeholders) => {
    dispatch({ type: 'SET_STAKEHOLDERS', payload: stakeholders })
  }

  const aplicarPlantilla = (template) => {
    const ctx = template.contexto
    dispatch({ type: 'SET_PLANTILLA', payload: template.id })
    dispatch({ type: 'SET_CONTEXTO', payload: { ...ctx } })
    dispatch({ type: 'SET_STAKEHOLDERS', payload: ctx.stakeholders || [] })
    setPlantillaAviso('Plantilla aplicada. Puedes modificar cualquier campo antes de continuar.')
  }

  const limpiarPlantilla = () => {
    if (plantilla && Object.values(contexto).some(v => v && (Array.isArray(v) ? v.length > 0 : true))) {
      if (!window.confirm('¿Deseas borrar los datos actuales y empezar desde cero?')) return
    }
    dispatch({ type: 'SET_PLANTILLA', payload: null })
    dispatch({ type: 'SET_CONTEXTO', payload: { nombre: '', descripcion: '', tipologia: '', tamanoEquipo: '', modalidadActual: '', faseProyecto: '', stakeholders: [], observaciones: '' } })
    dispatch({ type: 'SET_STAKEHOLDERS', payload: [] })
    setPlantillaAviso('')
  }

  const canContinue = contexto.nombre && contexto.tipologia && contexto.modalidadActual && contexto.faseProyecto

  return (
    <div className="section-card">
      <h2>Contexto del proyecto</h2>
      <p className="section-desc">Selecciona una plantilla o completa manualmente los datos del proyecto.</p>

      <div className="plantillas-grid">
        {PLANTILLAS.map((t) => (
          <div
            key={t.id}
            className={`plantilla-card ${plantilla === t.id ? 'selected' : ''}`}
            onClick={() => aplicarPlantilla(t)}
          >
            <div className="plantilla-nombre">{t.nombre}</div>
            <div className="plantilla-desc">{t.descripcion}</div>
            <div className="plantilla-meta">
              <span className="badge badge-blue">{TIPOLOGIAS.find(tp => tp.id === t.contexto.tipologia)?.nombre || t.contexto.tipologia}</span>
              <span className="badge badge-amber">{t.contexto.faseProyecto}</span>
              <span className="badge badge-green">{t.contexto.modalidadActual}</span>
            </div>
          </div>
        ))}
        <div
          className={`plantilla-card plantilla-vacia ${plantilla === null && !contexto.nombre ? 'selected' : ''}`}
          onClick={limpiarPlantilla}
        >
          <div className="plantilla-nombre">{PLANTILLA_VACIA.nombre}</div>
          <div className="plantilla-desc">{PLANTILLA_VACIA.descripcion}</div>
          <div className="plantilla-meta">
            <span className="badge badge-gray">Sin plantilla</span>
          </div>
        </div>
      </div>

      {plantillaAviso && (
        <div className="aviso-plantilla">
          <span>{plantillaAviso}</span>
          <button className="btn btn-sm btn-outline" onClick={() => setPlantillaAviso('')}>Cerrar</button>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Nombre del proyecto *</label>
          <input
            type="text"
            value={contexto.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Migración a microservicios"
          />
        </div>

        <div className="form-group full-width">
          <label>Descripción breve del proyecto</label>
          <textarea
            value={contexto.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Describe brevemente el alcance y objetivos del proyecto"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Tipología funcional *</label>
          <select value={contexto.tipologia} onChange={(e) => handleChange('tipologia', e.target.value)}>
            <option value="">Seleccionar tipología</option>
            {TIPOLOGIAS.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          {contexto.tipologia && (
            <div className="info-badge">
              Posición base: {TIPOLOGIAS.find(t => t.id === contexto.tipologia)?.posicionBase} · {TIPOLOGIAS.find(t => t.id === contexto.tipologia)?.justificacion}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Tamaño del equipo</label>
          <input
            type="text"
            value={contexto.tamanoEquipo}
            onChange={(e) => handleChange('tamanoEquipo', e.target.value)}
            placeholder="Ej: 8 personas"
          />
        </div>

        <div className="form-group">
          <label>Modalidad actual *</label>
          <select value={contexto.modalidadActual} onChange={(e) => handleChange('modalidadActual', e.target.value)}>
            <option value="">Seleccionar modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrida">Híbrida</option>
            <option value="Remota">Remota</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fase del proyecto *</label>
          <select value={contexto.faseProyecto} onChange={(e) => {
            handleChange('faseProyecto', e.target.value)
            dispatch({ type: 'SET_CONTEXTO', payload: { faseProyecto: e.target.value } })
          }}>
            <option value="">Seleccionar fase</option>
            <option value="Inicio">Inicio</option>
            <option value="Desarrollo">Desarrollo</option>
            <option value="Despliegue">Despliegue</option>
            <option value="Operación">Operación</option>
            <option value="Mejora continua">Mejora continua</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Stakeholders principales</label>
          <StakeholderSelect
            selected={contexto.stakeholders || []}
            onChange={handleStakeholders}
          />
        </div>

        <div className="form-group full-width">
          <label>Observaciones</label>
          <textarea
            value={contexto.observaciones}
            onChange={(e) => handleChange('observaciones', e.target.value)}
            placeholder="Cualquier información adicional relevante"
            rows={2}
          />
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 0 })}>
          Anterior
        </button>
        <button
          className="btn btn-primary"
          disabled={!canContinue}
          onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
        >
          Siguiente: Encuesta de diagnóstico
        </button>
      </div>
    </div>
  )
}
