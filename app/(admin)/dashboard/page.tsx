'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clearAuth } from "@/lib/client-auth"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/hooks/useDashboard"
import { Progress } from "@/components/ui/progress"
import { Building2, MessageSquare, Globe2, Users } from "lucide-react"
import DashboardLoading from "./loading"
import { cn } from "@/lib/utils"

function getProgressColor(percentage: number) {
  if (percentage <= 33) return "bg-red-500"
  if (percentage <= 66) return "bg-yellow-500"
  return "bg-green-500"
}

function getCardTitleColor(type: 'branches' | 'contacts' | 'microsites' | 'staff' | 'traffic' | 'social' | 'regional') {
  const colors = {
    branches: "text-blue-600",
    contacts: "text-emerald-600",
    microsites: "text-indigo-600",
    staff: "text-violet-600",
    traffic: "text-cyan-600",
    social: "text-purple-600",
    regional: "text-teal-600"
  }
  return colors[type]
}

export default function DashboardPage() {
  const router = useRouter()
  const { data, isLoading } = useDashboard()

  const handleLogout = () => {
    clearAuth()
    // Redirect to login page
    window.location.href = '/login'
  }

  if (isLoading) {
    return <DashboardLoading />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="ml-auto"
        >
          Logout
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", getCardTitleColor('branches'))}>
              Branches with Online Ordering
            </CardTitle>
            <Building2 className={cn("h-4 w-4", getCardTitleColor('branches'))} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.statistics.branchesWithOrdering.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.statistics.branchesWithOrdering.newLinks} new links added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", getCardTitleColor('contacts'))}>
              Contact Entries
            </CardTitle>
            <MessageSquare className={cn("h-4 w-4", getCardTitleColor('contacts'))} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.statistics.contactEntries.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.statistics.contactEntries.unread} unread entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", getCardTitleColor('microsites'))}>
              Live Microsites
            </CardTitle>
            <Globe2 className={cn("h-4 w-4", getCardTitleColor('microsites'))} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.statistics.micrositesLive.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.statistics.micrositesLive.newToday} new today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", getCardTitleColor('staff'))}>
              Total Staff
            </CardTitle>
            <Users className={cn("h-4 w-4", getCardTitleColor('staff'))} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.staffCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Web Traffic Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className={getCardTitleColor('traffic')}>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.webTraffic.sources.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source.name}</span>
                  <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                </div>
                <Progress 
                  value={source.percentage} 
                  className="h-2"
                  indicatorClassName={cn(
                    getProgressColor(source.percentage),
                    "transition-all"
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={getCardTitleColor('social')}>Social Media Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Likes</span>
                <span className="text-2xl font-bold">{data?.socialMedia.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium">Total Comments</span>
                <span className="text-2xl font-bold">{data?.socialMedia.comments.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Traffic */}
      <Card>
        <CardHeader>
          <CardTitle className={getCardTitleColor('regional')}>Traffic by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data?.trafficByRegion.map((region) => {
              const percentage = (region.visits / 70) * 100
              return (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <span className="text-sm text-muted-foreground">{region.visits}k</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    indicatorClassName={cn(
                      getProgressColor(percentage),
                      "transition-all"
                    )}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 