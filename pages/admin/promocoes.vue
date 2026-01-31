<script setup lang="ts">
import type { PromocaoRequest, ValorPromocao, RedeResponse, UnidadeComRede } from '~/types'

const { criar } = usePromocoes()
const { buscarTodas: buscarRedes } = useRedes()
const { buscarPorCidade, buscarCidades } = useUnidades()

const redes = ref<RedeResponse[]>([])
const cidades = ref<string[]>([])
const unidades = ref<UnidadeComRede[]>([])
const carregando = ref(false)
const salvando = ref(false)
const erro = ref<string | null>(null)
const sucesso = ref<string | null>(null)

const redeSelecionada = ref('')
const cidadeSelecionada = ref('')
const unidadesSelecionadas = ref<string[]>([])

const promocao = ref<ValorPromocao>({
    nome: '',
    descricao: '',
    valor: 0,
    unidade: 'un',
    quantidadeMedida: 1,
    marca: '',
    categoria: ''
})

const promocoesCriadas = ref<{ promocao: ValorPromocao; unidades: string[]; total: number }[]>([])

const categorias = [
    'Alimentos',
    'Bebidas',
    'Limpeza',
    'Higiene',
    'Hortifruti',
    'Carnes',
    'Laticínios',
    'Padaria',
    'Congelados',
    'Outros'
]

const unidadesMedida = [
    { value: 'un', label: 'Unidade' },
    { value: 'kg', label: 'Quilograma' },
    { value: 'g', label: 'Grama' },
    { value: 'l', label: 'Litro' },
    { value: 'ml', label: 'Mililitro' },
    { value: 'pct', label: 'Pacote' },
    { value: 'cx', label: 'Caixa' },
    { value: 'dz', label: 'Dúzia' }
]

const redesOptions = computed(() => redes.value.map(r => ({ value: r.id, label: r.nome })))

const carregarRedes = async () => {
    try {
        redes.value = await buscarRedes()
    } catch (e) {
        console.error('Erro ao carregar redes:', e)
    }
}

const carregarCidades = async () => {
    try {
        cidades.value = await buscarCidades()
    } catch (e) {
        console.error('Erro ao carregar cidades:', e)
    }
}

const carregarUnidades = async () => {
    if (!cidadeSelecionada.value) {
        unidades.value = []
        return
    }

    try {
        carregando.value = true
        const todas = await buscarPorCidade(cidadeSelecionada.value)

        if (redeSelecionada.value) {
            unidades.value = todas.filter(u => u.redeId === redeSelecionada.value)
        } else {
            unidades.value = todas
        }
    } catch (e) {
        console.error('Erro ao carregar unidades:', e)
    } finally {
        carregando.value = false
    }
}

watch([cidadeSelecionada, redeSelecionada], () => {
    unidadesSelecionadas.value = []
    carregarUnidades()
})

const selecionarTodas = () => {
    if (unidadesSelecionadas.value.length === unidades.value.length) {
        unidadesSelecionadas.value = []
    } else {
        unidadesSelecionadas.value = unidades.value.map(u => u.id)
    }
}

const textoSelecionarTodas = computed(() => {
    return unidadesSelecionadas.value.length === unidades.value.length ? 'Desmarcar todas' : 'Selecionar todas'
})

const salvar = async () => {
    erro.value = null
    sucesso.value = null

    if (!unidadesSelecionadas.value.length) {
        erro.value = 'Selecione pelo menos uma unidade'
        return
    }

    if (!promocao.value.nome.trim()) {
        erro.value = 'Nome do produto é obrigatório'
        return
    }

    if (!promocao.value.valor || promocao.value.valor <= 0) {
        erro.value = 'Valor deve ser maior que zero'
        return
    }

    try {
        salvando.value = true

        const request: PromocaoRequest = {
            unidadeIds: unidadesSelecionadas.value,
            valorPromocaos: [{ ...promocao.value }]
        }

        const result = await criar(request)
        sucesso.value = `${result.total} promoção(ões) criada(s) com sucesso!`

        promocoesCriadas.value.unshift({
            promocao: { ...promocao.value },
            unidades: [...unidadesSelecionadas.value],
            total: result.total
        })

        promocao.value = {
            nome: '',
            descricao: '',
            valor: 0,
            unidade: 'un',
            quantidadeMedida: 1,
            marca: '',
            categoria: promocao.value.categoria
        }
    } catch (e: any) {
        erro.value = e?.data?.message || e?.message || 'Erro ao cadastrar promoção'
        console.error('Erro:', e)
    } finally {
        salvando.value = false
    }
}

const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor)
}

onMounted(() => {
    carregarRedes()
    carregarCidades()
})

useHead({
    title: 'Cadastrar Promoção - Vapt'
})
</script>

<template>
    <div>
        <UiPageHeader title="Cadastrar Promoção" subtitle="Cadastre uma nova promoção para uma ou mais unidades" />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Seleção de Unidades -->
            <UiBaseCard title="1. Selecione as Unidades">
                <div class="space-y-4">
                    <UiBaseSelect v-model="redeSelecionada" label="Rede" :options="redesOptions"
                        placeholder="Todas as redes" />

                    <UiBaseSelect v-model="cidadeSelecionada" label="Cidade" :options="cidades"
                        placeholder="Selecione a cidade" required />

                    <UiBaseSpinner v-if="carregando" size="sm" />

                    <div v-else-if="unidades.length" class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">{{ unidades.length }} unidade(s)</span>
                            <button @click="selecionarTodas" class="text-sm text-green-600 hover:text-green-700">
                                {{ textoSelecionarTodas }}
                            </button>
                        </div>

                        <div class="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                            <label v-for="unidade in unidades" :key="unidade.id"
                                class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input type="checkbox" v-model="unidadesSelecionadas" :value="unidade.id"
                                    class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900">{{ unidade.nomeLoja }}</p>
                                    <p class="text-xs text-gray-500">{{ unidade.rede?.nome }}</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div v-else-if="cidadeSelecionada" class="text-center py-4 text-gray-500">
                        Nenhuma unidade encontrada
                    </div>
                </div>

                <div v-if="unidadesSelecionadas.length" class="mt-4 p-3 bg-green-50 rounded-lg">
                    <p class="text-sm text-green-700 font-medium">
                        {{ unidadesSelecionadas.length }} unidade(s) selecionada(s)
                    </p>
                </div>
            </UiBaseCard>

            <!-- Formulário de Promoção -->
            <UiBaseCard title="2. Dados da Promoção">
                <UiBaseAlert v-if="erro" type="error" class="mb-4">
                    {{ erro }}
                </UiBaseAlert>

                <UiBaseAlert v-if="sucesso" type="success" class="mb-4">
                    {{ sucesso }}
                </UiBaseAlert>

                <form @submit.prevent="salvar" class="space-y-4">
                    <UiBaseInput v-model="promocao.nome" label="Nome do Produto" placeholder="Ex: Arroz Tio João 5kg"
                        required />

                    <UiBaseInput v-model="promocao.marca" label="Marca" placeholder="Ex: Tio João" />

                    <UiBaseSelect v-model="promocao.categoria" label="Categoria" :options="categorias"
                        placeholder="Selecione" />

                    <UiFormSection :cols="2">
                        <UiBaseInput v-model="promocao.valor" label="Valor" type="number" placeholder="0,00" required />

                        <UiBaseSelect v-model="promocao.unidade" label="Unidade" :options="unidadesMedida" />
                    </UiFormSection>

                    <UiBaseInput v-model="promocao.quantidadeMedida" label="Quantidade/Medida" type="number"
                        placeholder="1" />

                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea v-model="promocao.descricao" rows="2" placeholder="Observações sobre a promoção..."
                            class="form-input"></textarea>
                    </div>

                    <UiBaseButton type="submit" variant="primary" size="lg" block :loading="salvando"
                        :disabled="!unidadesSelecionadas.length">
                        {{ salvando ? 'Salvando...' : 'Cadastrar Promoção' }}
                    </UiBaseButton>
                </form>
            </UiBaseCard>

            <!-- Promoções Criadas -->
            <UiBaseCard title="Promoções Cadastradas">
                <div v-if="!promocoesCriadas.length" class="text-center py-8 text-gray-500">
                    Nenhuma promoção cadastrada nesta sessão
                </div>

                <div v-else class="space-y-3 max-h-[600px] overflow-y-auto">
                    <div v-for="(item, index) in promocoesCriadas" :key="index" class="list-item">
                        <div class="flex-1">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="font-medium text-gray-900">{{ item.promocao.nome }}</p>
                                    <p v-if="item.promocao.marca" class="text-sm text-gray-600">{{ item.promocao.marca
                                        }}</p>
                                </div>
                                <p class="text-lg font-bold text-green-600">{{ formatarMoeda(item.promocao.valor) }}</p>
                            </div>
                            <div class="mt-2 flex items-center gap-2">
                                <span class="badge badge-blue">{{ item.unidades.length }} unidade(s)</span>
                                <span v-if="item.promocao.categoria" class="badge badge-gray">{{ item.promocao.categoria
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </UiBaseCard>
        </div>
    </div>
</template>
