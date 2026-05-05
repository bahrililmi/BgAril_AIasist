import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupsTable } from "@/components/groups-table";
import { getGroups } from "@/actions/groupActions";

export default async function SettingsPage() {
  const groups = await getGroups();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="groups">Groups Management</TabsTrigger>
            <TabsTrigger value="ai">AI Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Telegram Groups Configuration</CardTitle>
                <CardDescription>
                  Manage monitored Telegram groups and their categories. 
                  New groups are automatically added as UNMAPPED by the collector.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GroupsTable initialGroups={groups} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
                <CardDescription>
                  Configure AI behavior and system prompts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI preferences configuration coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
