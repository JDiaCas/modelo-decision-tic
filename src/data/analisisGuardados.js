const STORAGE_KEY = 'mdtic_analisis'

function generarId() {
  return 'a_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7)
}

export function guardarAnalisis(datos) {
  const lista = obtenerTodos()
  const idx = lista.findIndex(a => a.id === datos.id)
  const ahora = new Date().toISOString()

  const entrada = {
    ...datos,
    ultimaModificacion: ahora,
    fechaCreacion: datos.fechaCreacion || ahora,
  }

  if (idx >= 0) {
    lista[idx] = { ...lista[idx], ...entrada, id: datos.id }
  } else {
    lista.unshift(entrada)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  return entrada
}

export function obtenerTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function obtenerPorId(id) {
  return obtenerTodos().find(a => a.id === id) || null
}

export function eliminarAnalisis(id) {
  const lista = obtenerTodos().filter(a => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
}

export function duplicarAnalisis(id) {
  const original = obtenerPorId(id)
  if (!original) return null
  const copia = { ...original, id: generarId(), nombre: original.nombre + ' (copia)' }
  return guardarAnalisis(copia)
}

export function nuevoAnalisisVacio() {
  return { id: generarId() }
}

export function exportarAnalisisAJson(id) {
  const a = obtenerPorId(id)
  if (!a) return null
  const blob = new Blob([JSON.stringify(a, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analisis-${a.nombre || 'sin-nombre'}-${a.id.slice(0, 8)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function importarAnalisisDesdeJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const datos = JSON.parse(e.target.result)
        if (!datos.id) datos.id = generarId()
        resolve(guardarAnalisis(datos))
      } catch { reject(new Error('Formato JSON inválido')) }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })
}
