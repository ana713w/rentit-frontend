import { http } from '../lib/api'

export const register = (user) => http.post('/auth/register', user)

// aqui un 401 no es sesion caducada
export const login = (credentials) => http.post('/auth/login', credentials, { ignoreUnauthorized: true })

export const logout = () => http.post('/auth/logout')

export const getMe = () => http.get('/auth/me', { ignoreUnauthorized: true })

// Nombre, telefono y direccion
export const updateMe = (data) => http.patch('/auth/me', data)

export const promoteAdmin = (email) => http.post('/admin/promote', { email })
