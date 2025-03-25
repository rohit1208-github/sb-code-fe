import { apiClient } from "@/lib/api";
import { API_CONFIG } from "@/lib/api-config";
import { Role } from "@/types/roles";
import { StaffMember, StaffRole } from "@/types/staff";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const USER_BASE_URL = API_CONFIG.ENDPOINTS.USERS;
const ROLES_BASE_URL = API_CONFIG.ENDPOINTS.ROLES;

export class StaffService {
  static async getStaffMembers() {
    const response = await apiClient.get<StaffMember[]>(`${USER_BASE_URL}`);
    return response;
  }

  static async getRoles() {
    const response = await apiClient.get<StaffRole[]>(`${ROLES_BASE_URL}`);
    return response;
  }

  static async getStaffMember(id: string) {
    const response = await apiClient.get<StaffMember>(`${USER_BASE_URL}/${id}`);
    return response;
  }

  static async createStaffMember(data: Omit<StaffMember, "id">) {
    const response = await apiClient.post<StaffMember>(
      `${USER_BASE_URL}`,
      data
    );
    return response;
  }

  static async updateStaffMember(id: string, data: Partial<StaffMember>) {
    const response = await apiClient.patch<StaffMember>(
      `${USER_BASE_URL}/${id}/`,
      data
    );
    return response;
  }

  static async deleteStaffMember(id: string) {
    const response = await apiClient.delete<StaffMember>(
      `${USER_BASE_URL}/${id}`
    );
    return response;
  }
}
