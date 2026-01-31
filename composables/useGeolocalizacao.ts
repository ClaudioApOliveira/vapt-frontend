export const useGeolocalizacao = () => {
  const localizacao = ref<{ latitude: number; longitude: number } | null>(null)
  const erro = ref<string | null>(null)
  const carregando = ref(false)

  const obterLocalizacao = async () => {
    if (!process.client) return

    carregando.value = true
    erro.value = null

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      localizacao.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    } catch (e) {
      erro.value = 'Não foi possível obter sua localização'
    } finally {
      carregando.value = false
    }
  }

  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return {
    localizacao,
    erro,
    carregando,
    obterLocalizacao,
    calcularDistancia
  }
}
