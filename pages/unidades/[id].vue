<script setup lang="ts">
import type { UnidadeResponse, PromocaoResponse } from '~/types'

const route = useRoute()
const { buscarPorId } = useUnidades()
const { buscarPorUnidade } = usePromocoes()

const unidade = ref<UnidadeResponse | null>(null)
const promocoes = ref<PromocaoResponse[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

const carregarDados = async () => {
  try {
    carregando.value = true
    erro.value = null
    const id = route.params.id as string
    
    const [unidadeData, promocoesData] = await Promise.all([
      buscarPorId(id),
      buscarPorUnidade(id)
    ])
    
    unidade.value = unidadeData
    promocoes.value = Array.isArray(promocoesData) ? promocoesData : []
  } catch (e: any) {
    erro.value = e?.message || 'Erro ao carregar dados da unidade'
    console.error('Erro:', e)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarDados()
})

useHead({
  title: computed(() => unidade.value ? `${unidade.value.nomeLoja} - Vapt` : 'Carregando...')
})
</script>

<template>
  <div>
    <div v-if="carregando" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">Carregando...</p>
    </div>

    <div v-else-if="erro" class="text-center py-12">
      <p class="text-red-600">{{ erro }}</p>
      <NuxtLink to="/unidades" class="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Voltar para lojas
      </NuxtLink>
    </div>

    <div v-else-if="unidade">
      <div class="mb-6">
        <NuxtLink to="/unidades" class="text-green-600 hover:text-green-700 mb-4 inline-flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </NuxtLink>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ unidade.nomeLoja }}</h1>
            <p v-if="unidade.rede" class="text-lg text-gray-600">{{ unidade.rede.nome }}</p>
          </div>
          <img 
            v-if="unidade.rede?.urlLogo" 
            :src="unidade.rede.urlLogo" 
            :alt="unidade.rede.nome"
            class="w-20 h-20 object-contain"
          >
        </div>
        
        <div class="text-gray-700 space-y-2">
          <p class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ unidade.logradouro }}
          </p>
          <p class="ml-7">{{ unidade.cidade }} - {{ unidade.estado }}</p>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Ofertas Disponíveis
          <span class="text-lg font-normal text-gray-600">({{ promocoes.length }})</span>
        </h2>

        <div v-if="!promocoes.length" class="text-center py-12 bg-white rounded-lg">
          <p class="text-gray-600">Nenhuma oferta disponível no momento</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PromocaoCard
            v-for="promocao in promocoes"
            :key="promocao.id"
            :promocao="promocao"
          />
        </div>
      </div>
    </div>
  </div>
</template>
