'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CountriesService, type Country, type CreateCountryDto, type UpdateCountryDto } from '@/services/countries.service'

const QUERY_KEY = 'countries'

export function useCountries() {
  const queryClient = useQueryClient()

  const { data: countries, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const response = await CountriesService.getAll()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (newCountry: CreateCountryDto) => CountriesService.create(newCountry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (updateData: UpdateCountryDto) => CountriesService.update(updateData),
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
  }
} 