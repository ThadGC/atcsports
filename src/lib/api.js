// Thin fetch wrapper. Auth rides on an httpOnly cookie, so every call sends credentials.
const BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:4000/api'

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields || {}
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch {
    throw new ApiError(
      'We could not reach the server. Check your connection and try again.',
      0,
    )
  }

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => ({})) : {}

  if (!res.ok) {
    throw new ApiError(
      data.error || `Something went wrong (${res.status}).`,
      res.status,
      data.fields,
    )
  }
  return data
}

export const auth = {
  register: (payload) => api('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => api('/auth/login', { method: 'POST', body: payload }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  me: (signal) => api('/auth/me', { signal }),
}

export const athletes = {
  list: () => api('/athletes'),
  create: (payload) => api('/athletes', { method: 'POST', body: payload }),
  remove: (id) => api(`/athletes/${id}`, { method: 'DELETE' }),
}

export const contact = {
  send: (payload) => api('/contact', { method: 'POST', body: payload }),
}
