export type CareerStatus = "active" | "inactive" | "draft";
export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";

export interface CareerPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  status: CareerStatus;
  branchId?: string;
  branchName?: string;
  postedDate: string;
  lastUpdated: string;
}

export interface CareerPostingFormData {
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  branchId?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CareerPostingsResponse extends ApiResponse<CareerPosting[]> {}
export interface CareerPostingResponse extends ApiResponse<CareerPosting> {} 