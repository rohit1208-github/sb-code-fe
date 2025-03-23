import { useQuery } from '@tanstack/react-query'
import { MicrositeService } from '@/services/microsite.service'
import type { Microsite } from '@/types/microsites'

export function useMicrosites() {
  console.log('🎣 [useMicrosites] Hook initialized')
  const QUERY_KEY = ['microsites']

  const { data: microsites, isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      console.log('🔄 [useMicrosites] Executing query function')
      const response = await MicrositeService.getAll()
      console.log('📦 [useMicrosites] Query data received:', {
        count: response.data.length,
        firstItem: response.data[0]?.name,
      })
      return response.data
    }
  })

  if (error) {
    console.error('❌ [useMicrosites] Query error:', error)
  }

  return {
    microsites,
    isLoading,
    error,
  }
}

export function useMicrosite(id: number) {
  console.log(`🎣 [useMicrosite] Hook initialized for id: ${id}`)
  const QUERY_KEY = ['microsites', id]

  const { data: microsite, isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      console.log(`🔄 [useMicrosite] Executing query function for id: ${id}`)
      const response = await MicrositeService.getById(id)
      console.log('📦 [useMicrosite] Query data received:', {
        id: response.data.id,
        name: response.data.name,
      })
      return response.data
    },
    enabled: !!id
  })

  if (error) {
    console.error(`❌ [useMicrosite] Query error for id ${id}:`, error)
  }

  return {
    microsite,
    isLoading,
    error,
  }
} 