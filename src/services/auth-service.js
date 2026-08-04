import { http } from '../lib/api'

export const register = (user) => http.post('/auth/register', user)

// ignoreUnauthorized: un 401 aquí significa "credenciales inválidas" o "anónimo", no sesión caducada
export const login = (credentials) => http.post('/auth/login', credentials, { ignoreUnauthorized: true })

export const logout = () => http.post('/auth/logout')

export const getMe = () => http.get('/auth/me', { ignoreUnauthorized: true })

// Nombre, teléfono y dirección (donde se recogen y devuelven los objetos del usuario)
export const updateMe = (data) => http.patch('/auth/me', data)

export const promoteAdmin = (userId) => http.post('/admin/promote', { userId })
