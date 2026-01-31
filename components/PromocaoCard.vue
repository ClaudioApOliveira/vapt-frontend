<script setup lang="ts">
import type { PromocaoResponse } from '~/types'

defineProps<{
  promocao: PromocaoResponse
}>()

const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold text-gray-900">{{ promocao.nome }}</h3>
      <span class="text-2xl font-bold text-green-600">{{ formatarPreco(promocao.valor) }}</span>
    </div>
    
    <p v-if="promocao.descricao" class="text-sm text-gray-600 mb-2">
      {{ promocao.descricao }}
    </p>
    
    <div class="flex flex-wrap gap-2 mb-3">
      <span v-if="promocao.marca" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        {{ promocao.marca }}
      </span>
      <span v-if="promocao.categoria" class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
        {{ promocao.categoria }}
      </span>
      <span v-if="promocao.unidade" class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
        {{ promocao.unidade }}
      </span>
    </div>
    
    <div class="text-xs text-gray-500">
      <span>Válido até {{ formatarData(promocao.fimPromocao) }}</span>
    </div>
  </div>
</template>
