
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import MacOSTitleBar from "@/components/MacOSTitleBar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full h-full max-w-6xl max-h-[800px] mac-window flex flex-col">
        <MacOSTitleBar title="Ollama Chat Settings" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate("/")} className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
