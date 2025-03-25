export type CareerStatus = "active" | "inactive" | "draft";
export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";

export interface CareerPosting {
  id?: number;
  name: string;
  description: string;
  url: string;
  is_active: boolean;
  microsites: string[];
  status: CareerStatus;
  branchId?: string;
  branchName?: string;
  postedDate: string;
  lastUpdated: string;
}

export interface CareerPostingFormData {
  name: string;
  url: string;
  description: string;
  microsites: string[];
  is_active: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CareerPostingsResponse extends ApiResponse<CareerPosting[]> {}
export interface CareerPostingResponse extends ApiResponse<CareerPosting> {}
