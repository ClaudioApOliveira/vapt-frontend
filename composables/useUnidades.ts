import type { UnidadeResponse, UnidadeComRede, UnidadeRequest, IdResponse } from '~/types'

export const useUnidades = () => {
  const config = useRuntimeConfig()
  const baseURL = process.client ? '' : (config.public.apiBase || 'http://localhost:8080')
  const { buscarPorId: buscarRede } = useRedes()
  const { getAuthHeader } = useAuth()

  const buscarPorId = async (id: string) => {
    const response = await $fetch<{ data: UnidadeResponse }>(`${baseURL}/api/unidades/${id}`)
    return response.data
  }

  const buscarCidades = async () => {
    const response = await $fetch<{ data: string[] }>(`${baseURL}/api/unidades/cidades`)
    return response.data
  }

  const buscarPorCidade = async (cidade: string) => {
    const cidadeSlug = cidade.toLowerCase().trim().replace(/\s+/g, '-')
    const response = await $fetch<{ data: UnidadeResponse[] }>(`${baseURL}/api/unidades/cidade/${cidadeSlug}`)
    
    const unidadesComRede: UnidadeComRede[] = await Promise.all(
      response.data.map(async (unidade) => {
        try {
          const rede = await buscarRede(unidade.redeId)
          return { ...unidade, rede }
        } catch {
          return unidade
        }
      })
    )
    
    return unidadesComRede
  }

  const criar = async (data: UnidadeRequest) => {
    return await $fetch<IdResponse>(`${baseURL}/api/unidades`, {
      method: 'POST',
      body: data,
      headers: getAuthHeader()
    })
  }

  return {
    buscarPorId,
    buscarCidades,
    buscarPorCidade,
    criar
  }
}
