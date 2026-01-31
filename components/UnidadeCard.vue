<script setup lang="ts">
import type { UnidadeComRede } from '~/types'

defineProps<{
  unidade: UnidadeComRede
  distancia?: number
}>()
</script>

<template>
  <NuxtLink 
    :to="`/unidades/${unidade.id}`"
    class="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ unidade.nomeLoja }}</h3>
        <p v-if="unidade.rede" class="text-sm text-gray-600">{{ unidade.rede.nome }}</p>
      </div>
      <img 
        v-if="unidade.rede?.urlLogo" 
        :src="unidade.rede.urlLogo" 
        :alt="unidade.rede.nome"
        class="w-12 h-12 object-contain"
      >
    </div>
    
    <div class="text-sm text-gray-600 space-y-1">
      <p>{{ unidade.logradouro }}</p>
      <p>{{ unidade.cidade }} - {{ unidade.estado }}</p>
    </div>
    
    <div v-if="distancia" class="mt-3 flex items-center text-sm text-green-600">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {{ distancia.toFixed(1) }} km
    </div>
  </NuxtLink>
</template>
