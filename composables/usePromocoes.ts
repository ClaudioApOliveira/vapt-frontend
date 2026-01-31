import type { PromocaoResponse, PromocaoRequest, PromocaoMultiResponse } from '~/types'

export const usePromocoes = () => {
  const config = useRuntimeConfig()
  const baseURL = process.client ? '' : (config.public.apiBase || 'http://localhost:8080')
  const { getAuthHeader } = useAuth()

  const buscarAtivas = async () => {
    const response = await $fetch<{ data: PromocaoResponse[] }>(`${baseURL}/api/promocoes/ativas`)
    return response.data
  }

  const buscarPorUnidade = async (unidadeId: string) => {
    const response = await $fetch<{ data: PromocaoResponse[] }>(`${baseURL}/api/promocoes/unidade/${unidadeId}`)
    return response.data
  }

  const buscarPorCidadeERede = async (cidade: string, redeId: string) => {
    const response = await $fetch<{ data: PromocaoResponse[] }>(`${baseURL}/api/promocoes/cidade/${encodeURIComponent(cidade)}/rede/${redeId}`)
    return response.data
  }

  const criar = async (data: PromocaoRequest) => {
    return await $fetch<PromocaoMultiResponse>(`${baseURL}/api/promocoes`, {
      method: 'POST',
      body: data,
      headers: getAuthHeader()
    })
  }

  return {
    buscarAtivas,
    buscarPorUnidade,
    buscarPorCidadeERede,
    criar
  }
}
