import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageTable } from "@/components/message-table";
import { getRecentMessages } from "@/actions/messageActions";

export default async function MessagesPage() {
  const messages = await getRecentMessages(500);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages (Last 500)</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageTable data={messages} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
