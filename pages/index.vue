<script setup lang="ts">
import type { PromocaoResponse, RedeResponse } from '~/types'

const { buscarPorCidadeERede } = usePromocoes()
const { buscarCidades } = useUnidades()
const { obterLocalizacao } = useGeolocalizacao()
const { buscarTodas: buscarTodasRedes } = useRedes()

type PromocaoComRede = PromocaoResponse & { redeDados?: RedeResponse }
const promocoes = ref<PromocaoComRede[]>([])
const cidades = ref<string[]>([])
const redesDisponiveis = ref<RedeResponse[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)
const busca = ref('')
const categoriaFiltro = ref('')
const cidadeSelecionada = ref('')
const redeSelecionada = ref('')
const redeSelecionadaId = ref('')

const redesOptions = computed(() => redesDisponiveis.value.map(r => ({ value: r.nome, label: r.nome })))

const carregarPromocoes = async () => {
  if (!cidadeSelecionada.value || !redeSelecionadaId.value) {
    promocoes.value = []
    return
  }

  try {
    carregando.value = true
    erro.value = null
    const data = await buscarPorCidadeERede(cidadeSelecionada.value, redeSelecionadaId.value)

    const rede = redesDisponiveis.value.find(r => r.id === redeSelecionadaId.value)

    promocoes.value = (Array.isArray(data) ? data : []).map(promo => ({
      ...promo,
      redeDados: rede
    }))
  } catch (e: any) {
    erro.value = e?.message || 'Erro ao carregar promoções'
    console.error('Erro:', e)
  } finally {
    carregando.value = false
  }
}

watch([cidadeSelecionada, redeSelecionadaId], () => {
  carregarPromocoes()
})

watch(redeSelecionada, (novoNome) => {
  const rede = redesDisponiveis.value.find(r => r.nome === novoNome)
  redeSelecionadaId.value = rede?.id || ''
})

const carregarCidades = async () => {
  try {
    cidades.value = await buscarCidades()
  } catch (e) {
    console.error('Erro ao carregar cidades:', e)
  }
}

const carregarRedes = async () => {
  try {
    redesDisponiveis.value = await buscarTodasRedes()
  } catch (e) {
    console.error('Erro ao carregar redes:', e)
  }
}

const promocoesFiltradas = computed(() => {
  let resultado = promocoes.value

  if (busca.value) {
    const termo = busca.value.toLowerCase()
    resultado = resultado.filter(p =>
      p.nome.toLowerCase().includes(termo) ||
      p.marca?.toLowerCase().includes(termo) ||
      p.descricao?.toLowerCase().includes(termo)
    )
  }

  if (categoriaFiltro.value) {
    resultado = resultado.filter(p => p.categoria === categoriaFiltro.value)
  }

  return resultado
})

const redeSelecionadaDados = computed(() => {
  return redesDisponiveis.value.find(r => r.id === redeSelecionadaId.value)
})

const categorias = computed(() => {
  const cats = new Set(promocoes.value.map(p => p.categoria).filter((c): c is string => Boolean(c)))
  return Array.from(cats)
})

obterLocalizacao()
carregarCidades()
carregarRedes()
</script>

<template>
  <div>
    <UiPageHeader title="Ofertas Ativas" subtitle="Encontre o menor preço num vapt-vupt" />

    <div class="mb-6 space-y-4">
      <input v-model="busca" type="text" placeholder="Buscar produtos, marcas..." class="form-input py-3">

      <div class="flex flex-wrap gap-4">
        <UiBaseSelect v-model="cidadeSelecionada" label="Cidade" :options="cidades" placeholder="Selecione a cidade"
          required />

        <UiBaseSelect v-model="redeSelecionada" label="Rede" :options="redesOptions" placeholder="Selecione a rede"
          required />
      </div>

      <UiBaseAlert v-if="!cidadeSelecionada || !redeSelecionada" type="info">
        <span class="font-medium">Dica:</span> Selecione uma cidade e uma rede para ver as promoções disponíveis.
      </UiBaseAlert>

      <div v-if="categorias.length" class="flex flex-wrap gap-2">
        <button @click="categoriaFiltro = ''" class="filter-chip"
          :class="!categoriaFiltro ? 'filter-chip-active' : 'filter-chip-inactive'">
          Todas
        </button>
        <button v-for="cat in categorias" :key="cat" @click="categoriaFiltro = cat" class="filter-chip"
          :class="categoriaFiltro === cat ? 'filter-chip-active' : 'filter-chip-inactive'">
          {{ cat }}
        </button>
      </div>
    </div>

    <div v-if="carregando" class="text-center py-12">
      <UiBaseSpinner size="lg" />
      <p class="mt-4 text-gray-600">Carregando ofertas...</p>
    </div>

    <UiBaseAlert v-else-if="erro" type="error" class="mb-4">
      {{ erro }}
      <UiBaseButton variant="primary" size="sm" class="mt-2" @click="carregarPromocoes">
        Tentar novamente
      </UiBaseButton>
    </UiBaseAlert>

    <div v-else-if="cidadeSelecionada && redeSelecionada && !promocoesFiltradas.length" class="text-center py-12">
      <p class="text-gray-600">Nenhuma oferta encontrada para {{ redeSelecionada }} em {{ cidadeSelecionada }}</p>
    </div>

    <div v-else-if="promocoesFiltradas.length" class="space-y-6">
      <div class="flex items-center gap-4 pb-2 border-b-2 border-gray-200">
        <img v-if="redeSelecionadaDados?.urlLogo" :src="redeSelecionadaDados.urlLogo" :alt="redeSelecionada"
          class="w-16 h-16 object-contain">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ redeSelecionada }}</h2>
          <p class="text-gray-600">{{ cidadeSelecionada }} - {{ promocoesFiltradas.length }} ofertas</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PromocaoCard v-for="promocao in promocoesFiltradas" :key="promocao.id" :promocao="promocao" />
      </div>
    </div>
  </div>
</template>
