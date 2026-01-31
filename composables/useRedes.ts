import type { RedeResponse, RedeRequest, IdResponse } from '~/types'

export const useRedes = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8080'
  const { getAuthHeader } = useAuth()

  const buscarTodas = async () => {
    const response = await $fetch<{ data: RedeResponse[] }>(`${baseURL}/api/redes`)
    return response.data
  }

  const buscarPorId = async (id: string) => {
    const response = await $fetch<{ data: RedeResponse }>(`${baseURL}/api/redes/${id}`)
    return response.data
  }

  const criar = async (data: RedeRequest) => {
    return await $fetch<IdResponse>(`${baseURL}/api/redes`, {
      method: 'POST',
      body: data,
      headers: getAuthHeader()
    })
  }

  return {
    buscarTodas,
    buscarPorId,
    criar
  }
}
