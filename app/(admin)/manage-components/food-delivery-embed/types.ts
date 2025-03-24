export type DeliveryProvider = 'talabat' | 'deliveroo' | 'uber-eats' | 'careem'

export type DeliveryStatus = 'active' | 'inactive' | 'pending'

export interface DeliveryConfig {
  id: string
  provider: DeliveryProvider
  branchId: string
  branchName: string
  embedCode: string
  status: DeliveryStatus
  lastUpdated: string
  createdAt: string
}

export interface DeliveryConfigFormData {
  provider: DeliveryProvider
  branchId: string
  embedCode: string
}

// API Response types for future integration
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface DeliveryConfigsResponse extends ApiResponse<DeliveryConfig[]> {}
export interface DeliveryConfigResponse extends ApiResponse<DeliveryConfig> {} 