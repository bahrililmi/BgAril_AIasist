import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageTable } from "@/components/message-table";
import { getRecentMessages } from "@/actions/messageActions";
import { MessageSquare, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function MessagesPage() {
  const messages = await getRecentMessages(500);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                Messages
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Browse and search through all collected messages
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5 w-fit">
              <Filter className="h-3 w-3" />
              <span className="text-xs font-medium">{messages.length} messages loaded</span>
            </Badge>
          </div>

          {/* Messages Table */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Messages
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Last 500 messages from all monitored groups
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MessageTable data={messages} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
