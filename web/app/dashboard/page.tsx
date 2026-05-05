import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessageStats, getRecentMessages } from "@/actions/messageActions";
import { MessageSquare, Users, TrendingUp, Activity, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DashboardPage() {
  const stats = await getMessageStats();
  const recentMessages = await getRecentMessages(10);

  const statCards = [
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      description: "All time messages",
      trend: "+12.5%",
      trendUp: true,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Messages Today",
      value: stats.messagesToday,
      icon: TrendingUp,
      description: "Messages received today",
      trend: "+8.2%",
      trendUp: true,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      title: "Active Groups",
      value: stats.activeGroups,
      icon: Users,
      description: "Currently monitored",
      trend: "2 new",
      trendUp: true,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      title: "AI Processed",
      value: stats.aiProcessed,
      icon: Activity,
      description: "Messages analyzed",
      trend: "+15.3%",
      trendUp: true,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Welcome back! Here's what's happening with your Telegram groups.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium">Live Monitoring</span>
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold tracking-tight">{stat.value.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Messages Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Messages - Takes 2 columns on large screens */}
            <Card className="lg:col-span-2 border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recent Messages
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Latest messages from your monitored groups
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="hidden sm:flex">
                    {recentMessages.length} messages
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {recentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Collector is monitoring your groups
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentMessages.map((message) => (
                      <div
                        key={message.id}
                        className="group relative flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-semibold text-primary">
                            {message.sender_name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold truncate">{message.sender_name}</p>
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {message.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                              <Clock className="h-3 w-3" />
                              {new Date(message.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground truncate">
                            {message.group_name}
                          </p>
                          
                          <p className="text-sm line-clamp-2 text-foreground/90">
                            {message.raw_text || message.message || "[Media message]"}
                          </p>
                          
                          {message.message_type === "media" && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              📎 Media
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions - Takes 1 column on large screens */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Frequently used features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="/ai-query"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 transition-all duration-200 group"
                >
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">AI Query</p>
                    <p className="text-xs text-muted-foreground">Ask AI about messages</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>

                <a
                  href="/messages"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-br from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 transition-all duration-200 group"
                >
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">View All Messages</p>
                    <p className="text-xs text-muted-foreground">Browse message history</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>

                <a
                  href="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 transition-all duration-200 group"
                >
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Manage Groups</p>
                    <p className="text-xs text-muted-foreground">Configure group settings</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
