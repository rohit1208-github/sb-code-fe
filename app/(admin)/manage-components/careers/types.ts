export type CareerStatus = "active" | "inactive" | "draft";
export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";

export interface CareerPosting {
  id?: number;
  name: string;
  description: string;
  url: string;
  is_active: boolean;
  microsites: number[];
  status: CareerStatus;
  branch?: number;
  branchName?: string;
  postedDate: string;
  lastUpdated: string;
  department: string;
  job_type: string;
}

export interface CareerPostingFormData {
  name: string;
  url: string;
  description: string;
  microsites: number[];
  is_active: boolean;
  department: string;
  job_type: string;
  branch: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CareerPostingsResponse extends ApiResponse<CareerPosting[]> {}
export interface CareerPostingResponse extends ApiResponse<CareerPosting> {}
