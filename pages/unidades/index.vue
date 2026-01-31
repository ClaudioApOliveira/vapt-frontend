<script setup lang="ts">
import type { UnidadeComRede } from '~/types'

const { buscarPorCidade, buscarCidades } = useUnidades()
const { obterLocalizacao, localizacao, calcularDistancia } = useGeolocalizacao()

const unidades = ref<UnidadeComRede[]>([])
const cidades = ref<string[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)
const cidade = ref('')

const buscar = async () => {
  if (!cidade.value.trim()) return

  try {
    carregando.value = true
    erro.value = null
    const data = await buscarPorCidade(cidade.value)
    unidades.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    erro.value = e?.message || 'Erro ao buscar unidades'
    console.error('Erro:', e)
  } finally {
    carregando.value = false
  }
}

const carregarCidades = async () => {
  try {
    cidades.value = await buscarCidades()
  } catch (e) {
    console.error('Erro ao carregar cidades:', e)
  }
}

const unidadesPorRede = computed(() => {
  const grupos = new Map<string, { rede: any; unidades: any[] }>()

  unidades.value.forEach(unidade => {
    const redeNome = unidade.rede?.nome || 'Sem rede'
    if (!grupos.has(redeNome)) {
      grupos.set(redeNome, { rede: unidade.rede, unidades: [] })
    }
    grupos.get(redeNome)!.unidades.push(unidade)
  })

  return Array.from(grupos.values())
})

const calcularDistanciaUnidade = (unidade: UnidadeComRede) => {
  if (!localizacao.value) return undefined
  return calcularDistancia(
    localizacao.value.latitude,
    localizacao.value.longitude,
    unidade.latitude,
    unidade.longitude
  )
}

onMounted(() => {
  obterLocalizacao()
  carregarCidades()
})

useHead({
  title: 'Lojas - Vapt'
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Lojas</h1>
      <p class="text-gray-600">Encontre supermercados perto de você</p>
    </div>

    <div class="mb-6">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700">Cidade *</label>
        <select v-model="cidade" @change="buscar"
          class="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option value="">Selecione a cidade</option>
          <option v-for="c in cidades" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <div v-if="carregando" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">Buscando lojas...</p>
    </div>

    <div v-else-if="erro" class="text-center py-12">
      <p class="text-red-600">{{ erro }}</p>
    </div>

    <div v-else-if="!unidades.length && cidade" class="text-center py-12">
      <p class="text-gray-600">Nenhuma loja encontrada em {{ cidade }}</p>
    </div>

    <div v-else-if="unidadesPorRede.length" class="space-y-8">
      <div v-for="grupo in unidadesPorRede" :key="grupo.rede?.nome || 'sem-rede'" class="space-y-4">
        <div class="flex items-center gap-4 pb-2 border-b-2 border-gray-200">
          <img v-if="grupo.rede?.urlLogo" :src="grupo.rede.urlLogo" :alt="grupo.rede.nome"
            class="w-16 h-16 object-contain">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ grupo.rede?.nome || 'Sem rede' }}</h2>
            <p class="text-sm text-gray-600">{{ grupo.unidades.length }} {{ grupo.unidades.length === 1 ? 'loja' :
              'lojas' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UnidadeCard v-for="unidade in grupo.unidades" :key="unidade.id" :unidade="unidade"
            :distancia="calcularDistanciaUnidade(unidade)" />
        </div>
      </div>
    </div>
  </div>
</template>
