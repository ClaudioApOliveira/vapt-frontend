<script setup lang="ts">
const { isAuthenticated, isAdmin, user, logout, initAuth } = useAuth()
const router = useRouter()

onMounted(() => {
  initAuth()
})

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-green-600">Vapt</span>
            <span class="text-sm text-gray-500">ofertas num vapt-vupt</span>
          </NuxtLink>

          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              Ofertas
            </NuxtLink>
            <NuxtLink to="/unidades"
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              Lojas
            </NuxtLink>

            <!-- Menu Admin (só aparece para admins logados) -->
            <div v-if="isAuthenticated && isAdmin" class="relative group">
              <button
                class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                Cadastros
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-1">
                  <NuxtLink to="/admin/redes"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600">
                    Redes
                  </NuxtLink>
                  <NuxtLink to="/admin/unidades"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600">
                    Unidades
                  </NuxtLink>
                  <NuxtLink to="/admin/promocoes"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600">
                    Promoções
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Usuário logado -->
            <div v-if="isAuthenticated" class="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <span class="text-sm text-gray-600">{{ user?.username }}</span>
              <button @click="handleLogout" class="text-sm text-red-600 hover:text-red-700 font-medium">
                Sair
              </button>
            </div>

            <!-- Botão Login (quando não logado) -->
            <NuxtLink v-else to="/login"
              class="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
              Admin
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>
