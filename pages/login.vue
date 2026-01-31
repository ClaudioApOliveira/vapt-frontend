<script setup lang="ts">
const { login, isAuthenticated, isAdmin } = useAuth()
const router = useRouter()

const form = ref({
    username: '',
    password: ''
})
const carregando = ref(false)
const erro = ref<string | null>(null)

const handleLogin = async () => {
    erro.value = null

    if (!form.value.username.trim() || !form.value.password.trim()) {
        erro.value = 'Usuário e senha são obrigatórios'
        return
    }

    try {
        carregando.value = true
        const success = await login(form.value)

        if (success) {
            if (isAdmin.value) {
                router.push('/admin/redes')
            } else {
                erro.value = 'Acesso negado. Apenas administradores podem acessar esta área.'
            }
        } else {
            erro.value = 'Usuário ou senha inválidos'
        }
    } catch (e: any) {
        erro.value = e?.data?.message || e?.message || 'Erro ao fazer login'
        console.error('Erro:', e)
    } finally {
        carregando.value = false
    }
}

onMounted(() => {
    if (isAuthenticated.value && isAdmin.value) {
        router.push('/admin/redes')
    }
})

useHead({
    title: 'Login - Vapt Admin'
})
</script>

<template>
    <div class="min-h-[70vh] flex items-center justify-center">
        <div class="w-full max-w-md">
            <UiBaseCard class="p-8">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-green-600">Vapt</h1>
                    <p class="text-gray-600 mt-2">Área Administrativa</p>
                </div>

                <UiBaseAlert v-if="erro" type="error" class="mb-6">
                    {{ erro }}
                </UiBaseAlert>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <UiBaseInput v-model="form.username" label="Usuário" placeholder="Digite seu usuário"
                        :disabled="carregando" autocomplete="username" />

                    <UiBaseInput v-model="form.password" label="Senha" type="password" placeholder="Digite sua senha"
                        :disabled="carregando" autocomplete="current-password" />

                    <UiBaseButton type="submit" variant="primary" size="lg" block :loading="carregando">
                        {{ carregando ? 'Entrando...' : 'Entrar' }}
                    </UiBaseButton>
                </form>

                <div class="mt-6 text-center">
                    <NuxtLink to="/" class="text-sm text-green-600 hover:text-green-700">
                        ← Voltar para ofertas
                    </NuxtLink>
                </div>
            </UiBaseCard>
        </div>
    </div>
</template>
