import type { LoginRequest, TokenResponse, User, Role } from '~/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
}

const authState = reactive<AuthState>({
  token: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false
})

export const useAuth = () => {
  const config = useRuntimeConfig()
  const baseURL = import.meta.client ? '' : (config.public.apiBase || 'http://localhost:8080')

  const initAuth = () => {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      
      if (savedToken && savedUser) {
        try {
          authState.token = savedToken
          authState.user = JSON.parse(savedUser)
          authState.isAuthenticated = true
          authState.isAdmin = authState.user?.role === 'ADMIN'
        } catch {
          logout()
        }
      }
    }
  }

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await $fetch<{ data: TokenResponse }>(`${baseURL}/api/auth/login`, {
        method: 'POST',
        body: credentials
      })

      const tokenData = response.data
      authState.token = tokenData.token

      // Decodifica o token JWT para extrair informações do usuário
      const payload = parseJwt(tokenData.token)
      // O JWT usa 'upn' para username e 'groups' (array) para roles
      const groups: string[] = payload.groups || []
      const role = groups.includes('ADMIN') ? 'ADMIN' : 'COMMON'
      
      authState.user = {
        username: payload.upn || payload.sub || credentials.username,
        role: role
      }
      authState.isAuthenticated = true
      authState.isAdmin = role === 'ADMIN'

      if (import.meta.client) {
        localStorage.setItem('auth_token', tokenData.token)
        localStorage.setItem('auth_user', JSON.stringify(authState.user))
      }

      return true
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  const logout = () => {
    authState.token = null
    authState.user = null
    authState.isAuthenticated = false
    authState.isAdmin = false

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  const getAuthHeader = () => {
    if (authState.token) {
      return { Authorization: `Bearer ${authState.token}` }
    }
    return {}
  }

  const parseJwt = (token: string): any => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch {
      return {}
    }
  }

  return {
    authState: readonly(authState),
    token: computed(() => authState.token),
    user: computed(() => authState.user),
    isAuthenticated: computed(() => authState.isAuthenticated),
    isAdmin: computed(() => authState.isAdmin),
    initAuth,
    login,
    logout,
    getAuthHeader
  }
}
