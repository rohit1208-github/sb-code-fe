'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CountriesService, type Country, type CreateCountryDto, type UpdateCountryDto } from '@/services/countries.service'
import { AxiosError } from 'axios'

const QUERY_KEY = 'countries'

interface ApiError {
  message: string
  code: string
}

export function useCountries() {
  const queryClient = useQueryClient()

  const { data: countries, isLoading, error } = useQuery<Country[], AxiosError<ApiError>>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const response = await CountriesService.getAll()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newCountry: CreateCountryDto) => {
      const response = await CountriesService.create(newCountry)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updateData: UpdateCountryDto) => {
      const response = await CountriesService.update(updateData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => CountriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    countries,
    isLoading,
    error,
    createCountry: createMutation.mutate,
    updateCountry: updateMutation.mutate,
    deleteCountry: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
} 