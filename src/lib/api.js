import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

http.interceptors.response.use(
  (response) => (response.status === 204 ? null : response.data),
  (error) => {
    if (!error.response) {
      return Promise.reject({ status: 0, message: 'No se pudo conectar con el servidor', details: null })
    }

    const { status, data } = error.response

    if (status === 401 && !error.config?.ignoreUnauthorized) {
      window.location.href = '/login'
    }

    return Promise.reject({ status, message: data?.error || 'Error inesperado', details: data?.details || null })
  },
)
