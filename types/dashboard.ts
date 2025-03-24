export interface DashboardStatistics {
  branchesWithOrdering: {
    count: number
    newLinks: number
  }
  contactEntries: {
    count: number
    unread: number
  }
  micrositesLive: {
    count: number
    newToday: number
  }
  lifetimeVisitors: {
    count: number
    message: string
  }
}

export interface TrafficSource {
  name: string
  percentage: number
  color: string
}

export interface RegionalTraffic {
  region: string
  visits: number
}

export interface WebTraffic {
  total: number
  growth: number
  sources: TrafficSource[]
}

export interface SocialMedia {
  likes: number
  comments: number
}

export interface DashboardResponse {
  statistics: DashboardStatistics
  recentMenuItems: any[] // Can be typed more specifically if needed
  staffCount: number
  webTraffic: WebTraffic
  socialMedia: SocialMedia
  trafficByRegion: RegionalTraffic[]
} 