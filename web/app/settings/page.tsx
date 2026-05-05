import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupsTable } from "@/components/groups-table";
import { getGroups } from "@/actions/groupActions";
import { Settings as SettingsIcon, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const groups = await getGroups();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-3">
                <SettingsIcon className="h-8 w-8 text-primary" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Manage your groups, categories, and AI preferences
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
              <TabsTrigger value="groups" className="gap-2 py-3">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Groups Management</span>
                <span className="sm:hidden">Groups</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2 py-3">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Preferences</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="mt-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Telegram Groups Configuration
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Manage monitored Telegram groups and their categories. 
                        New groups are automatically added as UNMAPPED by the collector.
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="hidden sm:flex">
                      {groups.length} groups
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <GroupsTable initialGroups={groups} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Preferences
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Configure AI behavior and system prompts for message analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">AI Preferences</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      Configure AI model settings, system prompts, and analysis preferences. Coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
