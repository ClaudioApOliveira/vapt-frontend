export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isAdmin, initAuth } = useAuth()
  
  // Inicializa autenticação
  initAuth()

  // Verifica se é rota admin
  if (to.path.startsWith('/admin')) {
    if (!isAuthenticated.value) {
      return navigateTo('/login')
    }
    
    if (!isAdmin.value) {
      return navigateTo('/login')
    }
  }
})
