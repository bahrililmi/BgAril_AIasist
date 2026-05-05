"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // For now, just redirect to dashboard
    // TODO: Implement Supabase auth later
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">AI Assistant RMW</CardTitle>
          <CardDescription>
            Telegram Message Collector & AI Analyzer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click below to access the dashboard. Authentication will be added in production.
            </p>
            <Button onClick={handleLogin} className="w-full">
              Enter Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
