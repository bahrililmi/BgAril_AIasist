import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessageStats, getRecentMessages } from "@/actions/messageActions";
import { MessageSquare, Users, TrendingUp, Activity } from "lucide-react";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DashboardPage() {
  const stats = await getMessageStats();
  const recentMessages = await getRecentMessages(5);

  const statCards = [
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      description: "All time messages",
    },
    {
      title: "Messages Today",
      value: stats.messagesToday,
      icon: TrendingUp,
      description: "Messages received today",
    },
    {
      title: "Active Groups",
      value: stats.activeGroups,
      icon: Users,
      description: "Currently monitored",
    },
    {
      title: "AI Processed",
      value: stats.aiProcessed,
      icon: Activity,
      description: "Messages analyzed",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No messages yet. Collector is monitoring your groups.
              </p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-4 border-b pb-4 last:border-0"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{message.sender_name}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {message.group_name} • {message.category}
                      </p>
                      <p className="text-sm line-clamp-2">
                        {message.raw_text || message.message || "[Media message]"}
                      </p>
                      {message.message_type === "media" && (
                        <span className="text-xs text-blue-600">📎 Media attached</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
