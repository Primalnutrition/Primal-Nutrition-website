/**
 * Small fetch wrapper for the Primal API.
 * Set VITE_API_URL in .env.local (defaults to http://localhost:8080 for dev).
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `HTTP ${res.status}`)
    err.status = res.status
    err.payload = data
    throw err
  }
  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
}

export const API_BASE_URL = API_URL
