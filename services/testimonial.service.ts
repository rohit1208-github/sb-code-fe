import { apiClient } from "@/lib/api"
import type { Testimonial } from "@/app/(admin)/manage-components/testimonials/components/columns"

const BASE_URL = "/api/testimonials/"

export interface CreateTestimonialDto {
  customerName: string
  rating: number
  comment: string
  status: "published" | "draft" | "archived"
  branch: string
}

export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> {
  id: string
}

export const TestimonialService = {
  getAll: async () => {
    console.log("🔍 [TestimonialService] Fetching all testimonials")
    try {
      const response = await apiClient.get<Testimonial[]>(BASE_URL)
      console.log("✅ [TestimonialService] Successfully fetched testimonials:", {
        count: response.data.length,
        status: response.status,
      })
      return response
    } catch (error) {
      console.error("❌ [TestimonialService] Error fetching testimonials:", {
        error,
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  },

  create: async (data: CreateTestimonialDto) => {
    console.log("📝 [TestimonialService] Creating new testimonial:", data)
    try {
      const response = await apiClient.post<Testimonial>(BASE_URL, data)
      console.log("✅ [TestimonialService] Successfully created testimonial:", {
        id: response.data.id,
        status: response.status,
      })
      return response
    } catch (error) {
      console.error("❌ [TestimonialService] Error creating testimonial:", {
        error,
        status: error.response?.status,
        message: error.message,
        data,
      })
      throw error
    }
  },

  update: async ({ id, ...data }: UpdateTestimonialDto) => {
    console.log(`📝 [TestimonialService] Updating testimonial ${id}:`, data)
    try {
      const response = await apiClient.patch<Testimonial>(`${BASE_URL}${id}/`, data)
      console.log("✅ [TestimonialService] Successfully updated testimonial:", {
        id: response.data.id,
        status: response.status,
      })
      return response
    } catch (error) {
      console.error(`❌ [TestimonialService] Error updating testimonial ${id}:`, {
        error,
        status: error.response?.status,
        message: error.message,
        data,
      })
      throw error
    }
  },

  delete: async (id: string) => {
    console.log(`🗑️ [TestimonialService] Deleting testimonial ${id}`)
    try {
      const response = await apiClient.delete(`${BASE_URL}${id}/`)
      console.log("✅ [TestimonialService] Successfully deleted testimonial:", {
        id,
        status: response.status,
      })
      return response
    } catch (error) {
      console.error(`❌ [TestimonialService] Error deleting testimonial ${id}:`, {
        error,
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  },
} 