"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  MessageSquare,
  Globe2,
  Users,
  BarChart3,
  PieChart,
  TrendingUp,
  Share2,
  Activity,
  ArrowUpRight,
  ChartLine,
} from "lucide-react";
import DashboardLoading from "./loading";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

function getProgressColor(percentage: number) {
  if (percentage <= 33) return "bg-red-500";
  if (percentage <= 66) return "bg-yellow-500";
  return "bg-green-500";
}

function getCardTitleColor(
  type:
    | "branches"
    | "contacts"
    | "microsites"
    | "staff"
    | "traffic"
    | "social"
    | "regional"
) {
  const colors = {
    branches: "text-blue-600",
    contacts: "text-emerald-600",
    microsites: "text-indigo-600",
    staff: "text-violet-600",
    traffic: "text-cyan-600",
    social: "text-purple-600",
    regional: "text-teal-600",
  };
  return colors[type];
}

const cardHoverClass =
  "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer";

// Dummy data for charts
const visitorData = [
  { name: "Jan", visitors: 4000 },
  { name: "Feb", visitors: 3000 },
  { name: "Mar", visitors: 5000 },
  { name: "Apr", visitors: 4500 },
  { name: "May", visitors: 6000 },
  { name: "Jun", visitors: 5500 },
];

const revenueData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 1398 },
  { name: "Mar", revenue: 9800 },
  { name: "Apr", revenue: 3908 },
  { name: "May", revenue: 4800 },
  { name: "Jun", revenue: 3800 },
];

const orderData = [
  { name: "Mon", orders: 20 },
  { name: "Tue", orders: 35 },
  { name: "Wed", orders: 45 },
  { name: "Thu", orders: 30 },
  { name: "Fri", orders: 55 },
  { name: "Sat", orders: 40 },
  { name: "Sun", orders: 25 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading } = useDashboard();

  const handleLogout = () => {
    clearAuth();
    // Redirect to login page
    window.location.href = "/login";
  };

  if (isLoading) {
    return <DashboardLoading />;
  }
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="ml-auto">
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="grid gap-4">
          <Card className={cardHoverClass}>
            <CardHeader>
              <CardTitle>Recently added menu items</CardTitle>
              <CardDescription>
                {data?.recentMenuItems.length} items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data?.recentMenuItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={20}
                        height={20}
                        className="rounded-md"
                      />
                      <div>{item.name}</div>
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                      <span className="text-xs text-muted-foreground block">
                        {item.branches}
                      </span>
                      Branches
                    </div>
                  </div>
                ))}
                {data?.recentMenuItems.length &&
                  data?.recentMenuItems.length > 0 && (
                    <div className="border-l border-gray-200" />
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className={cardHoverClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium",
                  getCardTitleColor("branches")
                )}
              >
                Branches with Online Ordering
              </CardTitle>
              <Building2
                className={cn("h-4 w-4", getCardTitleColor("branches"))}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.statistics.branchesWithOrdering.count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {data?.statistics.branchesWithOrdering.newLinks} new links added
                this week
              </p>
            </CardContent>
          </Card>

          <Card className={cardHoverClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium",
                  getCardTitleColor("contacts")
                )}
              >
                Contact Entries
              </CardTitle>
              <MessageSquare
                className={cn("h-4 w-4", getCardTitleColor("contacts"))}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.statistics.contactEntries.count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {data?.statistics.contactEntries.unread} unread entries
              </p>
            </CardContent>
          </Card>

          <Card className={cardHoverClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium",
                  getCardTitleColor("microsites")
                )}
              >
                Live Microsites
              </CardTitle>
              <Globe2
                className={cn("h-4 w-4", getCardTitleColor("microsites"))}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.statistics.micrositesLive.count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {data?.statistics.micrositesLive.newToday} new today
              </p>
            </CardContent>
          </Card>

          <Card className={cardHoverClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium",
                  getCardTitleColor("staff")
                )}
              >
                Total Staff
              </CardTitle>
              <Users className={cn("h-4 w-4", getCardTitleColor("staff"))} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.staffCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Active team members
              </p>
            </CardContent>
          </Card>

          <Card className={cardHoverClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium",
                  getCardTitleColor("traffic")
                )}
              >
                Lifetime Visitors
              </CardTitle>
              <Users className={cn("h-4 w-4", getCardTitleColor("traffic"))} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.statistics.lifetimeVisitors.count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {data?.statistics.lifetimeVisitors.message}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Menu Items */}
      {data?.recentMenuItems && data.recentMenuItems.length > 0 && (
        <Card className={cardHoverClass}>
          <CardHeader>
            <CardTitle className={getCardTitleColor("branches")}>
              Recent Menu Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentMenuItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.updatedAt}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className={cardHoverClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-medium">
                Visitor Analytics
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily visitor count
              </p>
            </div>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorData}>
                  <defs>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={cardHoverClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-medium">
                Revenue Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly revenue trends
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Web Traffic Section with updated icons */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className={cardHoverClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={getCardTitleColor("traffic")}>
              Traffic Sources
            </CardTitle>
            <Share2 className={cn("h-4 w-4", getCardTitleColor("traffic"))} />
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.webTraffic.sources.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {source.percentage}%
                  </span>
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

        <Card className={cardHoverClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={getCardTitleColor("social")}>
              Social Media Engagement
            </CardTitle>
            <ArrowUpRight
              className={cn("h-4 w-4", getCardTitleColor("social"))}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Likes</span>
                <span className="text-2xl font-bold">
                  {data?.socialMedia.likes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium">Total Comments</span>
                <span className="text-2xl font-bold">
                  {data?.socialMedia.comments.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Analytics */}
      <Card className={cardHoverClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Order Analytics
          </CardTitle>
          <BarChart className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Regional Traffic */}
      <Card className={cardHoverClass}>
        <CardHeader>
          <CardTitle className={getCardTitleColor("regional")}>
            Traffic by Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data?.trafficByRegion.map((region) => {
              const percentage = (region.visits / 70) * 100;
              return (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <span className="text-sm text-muted-foreground">
                      {region.visits}k
                    </span>
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
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
