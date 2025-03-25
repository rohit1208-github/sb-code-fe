import { CareerPosting } from "@/app/(admin)/manage-components/careers/types";
import { apiClient } from "@/lib/api";
import { API_CONFIG } from "@/lib/api-config";
import { Role } from "@/types/roles";
import { StaffMember, StaffRole } from "@/types/staff";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const CAREERS_BASE_URL = API_CONFIG.ENDPOINTS.CAREERS;

export class CareersService {
  static async getCareerPostings() {
    const response = await apiClient.get<CareerPosting[]>(
      `${CAREERS_BASE_URL}/`
    );
    return response;
  }

  static async getCareerPosting(id: string) {
    const response = await apiClient.get<CareerPosting>(
      `${CAREERS_BASE_URL}/${id}/`
    );
    return response;
  }

  static async createCareerPosting(data: Omit<CareerPosting, "id">) {
    const response = await apiClient.post<CareerPosting>(
      `${CAREERS_BASE_URL}/`,
      data
    );
    return response;
  }

  static async updateCareerPosting(id: number, data: Partial<CareerPosting>) {
    const response = await apiClient.patch<CareerPosting>(
      `${CAREERS_BASE_URL}/${id}/`,
      data
    );
    return response;
  }

  static async deleteCareerPosting(id: string) {
    const response = await apiClient.delete<CareerPosting>(
      `${CAREERS_BASE_URL}/${id}/`
    );
    return response;
  }
}
