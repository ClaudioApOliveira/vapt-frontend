<script setup lang="ts">
import type { UnidadeRequest, RedeResponse } from '~/types'

const { criar } = useUnidades()
const { buscarTodas: buscarRedes } = useRedes()

const redes = ref<RedeResponse[]>([])
const unidadesCriadas = ref<(UnidadeRequest & { id?: string })[]>([])
const carregando = ref(false)
const salvando = ref(false)
const erro = ref<string | null>(null)
const sucesso = ref<string | null>(null)

const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const redesOptions = computed(() => redes.value.map(r => ({ value: r.id, label: r.nome })))

const form = ref<UnidadeRequest>({
    redeId: '',
    nomeLoja: '',
    logradouro: '',
    cidade: '',
    estado: '',
    longitude: 0,
    latitude: 0
})

const carregarRedes = async () => {
    try {
        carregando.value = true
        redes.value = await buscarRedes()
    } catch (e) {
        console.error('Erro ao carregar redes:', e)
    } finally {
        carregando.value = false
    }
}

const obterCoordenadas = async () => {
    if (!form.value.logradouro || !form.value.cidade || !form.value.estado) {
        erro.value = 'Preencha o endereço completo para obter as coordenadas'
        return
    }

    try {
        const endereco = `${form.value.logradouro}, ${form.value.cidade}, ${form.value.estado}, Brasil`
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`
        )
        const data = await response.json()

        if (data && data.length > 0) {
            form.value.latitude = parseFloat(data[0].lat)
            form.value.longitude = parseFloat(data[0].lon)
            sucesso.value = 'Coordenadas obtidas com sucesso!'
            erro.value = null
        } else {
            erro.value = 'Não foi possível obter as coordenadas. Verifique o endereço.'
        }
    } catch (e) {
        erro.value = 'Erro ao buscar coordenadas'
        console.error('Erro:', e)
    }
}

const salvar = async () => {
    erro.value = null
    sucesso.value = null

    if (!form.value.redeId) {
        erro.value = 'Selecione uma rede'
        return
    }

    if (!form.value.nomeLoja.trim()) {
        erro.value = 'Nome da loja é obrigatório'
        return
    }

    if (!form.value.logradouro.trim() || !form.value.cidade.trim() || !form.value.estado) {
        erro.value = 'Endereço completo é obrigatório'
        return
    }

    if (!form.value.latitude || !form.value.longitude) {
        erro.value = 'Clique em "Obter Coordenadas" para preencher a localização'
        return
    }

    try {
        salvando.value = true
        const result = await criar(form.value)
        sucesso.value = 'Unidade cadastrada com sucesso!'

        unidadesCriadas.value.unshift({ ...form.value, id: result.id })

        form.value = {
            redeId: form.value.redeId,
            nomeLoja: '',
            logradouro: '',
            cidade: '',
            estado: form.value.estado,
            longitude: 0,
            latitude: 0
        }
    } catch (e: any) {
        erro.value = e?.data?.message || e?.message || 'Erro ao cadastrar unidade'
        console.error('Erro:', e)
    } finally {
        salvando.value = false
    }
}

const getRedeNome = (redeId: string) => {
    const rede = redes.value.find(r => r.id === redeId)
    return rede?.nome || 'Rede desconhecida'
}

onMounted(() => {
    carregarRedes()
})

useHead({
    title: 'Cadastrar Unidade - Vapt'
})
</script>

<template>
    <div>
        <UiPageHeader title="Cadastrar Unidade" subtitle="Cadastre uma nova loja/unidade de supermercado" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Formulário -->
            <UiBaseCard title="Nova Unidade">
                <UiBaseAlert v-if="erro" type="error" class="mb-4">
                    {{ erro }}
                </UiBaseAlert>

                <UiBaseAlert v-if="sucesso" type="success" class="mb-4">
                    {{ sucesso }}
                </UiBaseAlert>

                <form @submit.prevent="salvar" class="space-y-4">
                    <UiBaseSelect v-model="form.redeId" label="Rede" :options="redesOptions"
                        placeholder="Selecione a rede" required />

                    <UiBaseInput v-model="form.nomeLoja" label="Nome da Loja" placeholder="Ex: Filial Centro"
                        required />

                    <UiBaseInput v-model="form.logradouro" label="Logradouro" placeholder="Ex: Av. Brasil, 1000"
                        required />

                    <UiFormSection :cols="2">
                        <UiBaseInput v-model="form.cidade" label="Cidade" placeholder="Ex: São Paulo" required />

                        <UiBaseSelect v-model="form.estado" label="Estado" :options="estados" placeholder="UF"
                            required />
                    </UiFormSection>

                    <UiFormSection :cols="2">
                        <UiBaseInput v-model="form.latitude" label="Latitude" type="number" readonly />

                        <UiBaseInput v-model="form.longitude" label="Longitude" type="number" readonly />
                    </UiFormSection>

                    <UiBaseButton type="button" variant="outline" block @click="obterCoordenadas">
                        📍 Obter Coordenadas pelo Endereço
                    </UiBaseButton>

                    <UiBaseButton type="submit" variant="primary" size="lg" block :loading="salvando">
                        {{ salvando ? 'Salvando...' : 'Cadastrar Unidade' }}
                    </UiBaseButton>
                </form>
            </UiBaseCard>

            <!-- Lista de Unidades Criadas -->
            <UiBaseCard title="Unidades Cadastradas Recentemente">
                <div v-if="!unidadesCriadas.length" class="text-center py-8 text-gray-500">
                    Nenhuma unidade cadastrada nesta sessão
                </div>

                <div v-else class="space-y-3">
                    <div v-for="(unidade, index) in unidadesCriadas" :key="index" class="list-item">
                        <div class="flex-1">
                            <p class="font-medium text-gray-900">{{ unidade.nomeLoja }}</p>
                            <p class="text-sm text-green-600">{{ getRedeNome(unidade.redeId) }}</p>
                            <p class="text-sm text-gray-500">{{ unidade.logradouro }}</p>
                            <p class="text-sm text-gray-500">{{ unidade.cidade }} - {{ unidade.estado }}</p>
                        </div>
                    </div>
                </div>
            </UiBaseCard>
        </div>
    </div>
</template>
