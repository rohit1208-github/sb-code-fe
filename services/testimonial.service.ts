import { apiClient } from "@/lib/api";
import type { Testimonial } from "@/app/(admin)/manage-components/testimonials/components/columns";
import { API_CONFIG } from "@/lib/api-config";

const TESTIMONIALS_BASE_URL = API_CONFIG.ENDPOINTS.TESTIMONIALS;

export interface CreateTestimonialDto {
  name: string;
  content: string;
  is_active: boolean;
  microsites?: string;
}

export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> {
  id: string;
}

export const TestimonialService = {
  getAll: async () => {
    console.log("🔍 [TestimonialService] Fetching all testimonials");
    try {
      const response = await apiClient.get<Testimonial[]>(
        TESTIMONIALS_BASE_URL
      );
      console.log(
        "✅ [TestimonialService] Successfully fetched testimonials:",
        {
          count: response.data.length,
        }
      );
      return response;
    } catch (error) {
      console.error("❌ [TestimonialService] Error fetching testimonials:", {
        error,
      });
      throw error;
    }
  },

  create: async (data: CreateTestimonialDto) => {
    console.log("📝 [TestimonialService] Creating new testimonial:", data);
    try {
      const response = await apiClient.post<Testimonial>(
        `${TESTIMONIALS_BASE_URL}/`,
        data
      );
      console.log("✅ [TestimonialService] Successfully created testimonial:", {
        id: response.data.id,
      });
      return response;
    } catch (error) {
      console.error("❌ [TestimonialService] Error creating testimonial:", {
        error,
        data,
      });
      throw error;
    }
  },

  update: async ({ id, ...data }: UpdateTestimonialDto) => {
    console.log(`📝 [TestimonialService] Updating testimonial ${id}:`, data);
    try {
      const response = await apiClient.patch<Testimonial>(
        `${TESTIMONIALS_BASE_URL}/${id}/`,
        data
      );
      console.log("✅ [TestimonialService] Successfully updated testimonial:", {
        id: response.data.id,
      });
      return response;
    } catch (error) {
      console.error(
        `❌ [TestimonialService] Error updating testimonial ${id}:`,
        {
          error,
          data,
        }
      );
      throw error;
    }
  },

  delete: async (id: string) => {
    console.log(`🗑️ [TestimonialService] Deleting testimonial ${id}`);
    try {
      const response = await apiClient.delete(`${TESTIMONIALS_BASE_URL}${id}/`);
      console.log("✅ [TestimonialService] Successfully deleted testimonial:", {
        id,
      });
      return response;
    } catch (error) {
      console.error(
        `❌ [TestimonialService] Error deleting testimonial ${id}:`,
        {
          error,
        }
      );
      throw error;
    }
  },
};
