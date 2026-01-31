<script setup lang="ts">
import type { RedeRequest, RedeResponse } from '~/types'

const { criar, buscarTodas } = useRedes()

const redes = ref<RedeResponse[]>([])
const carregando = ref(false)
const salvando = ref(false)
const erro = ref<string | null>(null)
const sucesso = ref<string | null>(null)

const form = ref<RedeRequest>({
    nome: '',
    cnpj: '',
    urlLogo: ''
})

const carregarRedes = async () => {
    try {
        carregando.value = true
        redes.value = await buscarTodas()
    } catch (e) {
        console.error('Erro ao carregar redes:', e)
    } finally {
        carregando.value = false
    }
}

const salvar = async () => {
    erro.value = null
    sucesso.value = null

    if (!form.value.nome.trim() || !form.value.cnpj.trim()) {
        erro.value = 'Nome e CNPJ são obrigatórios'
        return
    }

    try {
        salvando.value = true
        await criar(form.value)
        sucesso.value = 'Rede cadastrada com sucesso!'
        form.value = { nome: '', cnpj: '', urlLogo: '' }
        await carregarRedes()
    } catch (e: any) {
        erro.value = e?.data?.message || e?.message || 'Erro ao cadastrar rede'
        console.error('Erro:', e)
    } finally {
        salvando.value = false
    }
}

const formatarCnpj = (valor: string) => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

const onCnpjInput = (value: string | number) => {
    const numeros = String(value).replace(/\D/g, '').slice(0, 14)
    form.value.cnpj = formatarCnpj(numeros)
}

onMounted(() => {
    carregarRedes()
})

useHead({
    title: 'Cadastrar Rede - Vapt'
})
</script>

<template>
    <div>
        <UiPageHeader title="Cadastrar Rede" subtitle="Cadastre uma nova rede de supermercados" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Formulário -->
            <UiBaseCard title="Nova Rede">
                <UiBaseAlert v-if="erro" type="error" class="mb-4">
                    {{ erro }}
                </UiBaseAlert>

                <UiBaseAlert v-if="sucesso" type="success" class="mb-4">
                    {{ sucesso }}
                </UiBaseAlert>

                <form @submit.prevent="salvar" class="space-y-4">
                    <UiBaseInput v-model="form.nome" label="Nome" placeholder="Ex: Supermercado Exemplo" required />

                    <UiBaseInput :model-value="form.cnpj" label="CNPJ" placeholder="00.000.000/0000-00" required
                        @update:model-value="onCnpjInput" />

                    <UiBaseInput v-model="form.urlLogo" label="URL do Logo" type="url"
                        placeholder="https://exemplo.com/logo.png" />

                    <div v-if="form.urlLogo" class="flex items-center gap-4">
                        <span class="text-sm text-gray-600">Preview:</span>
                        <img :src="form.urlLogo" alt="Preview do logo" class="h-12 object-contain"
                            @error="form.urlLogo = ''">
                    </div>

                    <UiBaseButton type="submit" variant="primary" size="lg" block :loading="salvando">
                        {{ salvando ? 'Salvando...' : 'Cadastrar Rede' }}
                    </UiBaseButton>
                </form>
            </UiBaseCard>

            <!-- Lista de Redes -->
            <UiBaseCard title="Redes Cadastradas">
                <UiBaseSpinner v-if="carregando" />

                <div v-else-if="!redes.length" class="text-center py-8 text-gray-500">
                    Nenhuma rede cadastrada
                </div>

                <div v-else class="space-y-3">
                    <div v-for="rede in redes" :key="rede.id" class="list-item">
                        <img v-if="rede.urlLogo" :src="rede.urlLogo" :alt="rede.nome" class="w-12 h-12 object-contain">
                        <div v-else class="list-item-avatar">
                            <span class="text-gray-500 text-lg font-bold">{{ rede.nome.charAt(0) }}</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium text-gray-900">{{ rede.nome }}</p>
                            <p class="text-sm text-gray-500">{{ rede.cnpj }}</p>
                        </div>
                    </div>
                </div>
            </UiBaseCard>
        </div>
    </div>
</template>
