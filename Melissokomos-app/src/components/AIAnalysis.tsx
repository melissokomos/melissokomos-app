import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface AIInsight {
  type: "positive" | "negative" | "warning";
  message: string;
  icon: React.ReactNode;
}

const AIAnalysis = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8080", // Replace with your actual URL
            "X-Title": "Buzzkeeper",
          },
          body: JSON.stringify({
            model: "google/gemma-3-27b-it:free",
            messages: [
              {
                role: "user",
                content:
                  "Analyze the following beekeeping data and provide concise insights (positive, negative, or warnings): Hive 1: Temperature is stable at 34°C, humidity is 50%, weight increased by 2kg in the last week, bee activity is high. Hive 2: Temperature is fluctuating between 30°C and 37°C, humidity is 65%, weight decreased by 0.5kg, bee activity is moderate. Hive 3: Temperature is 28°C, humidity is 75%, weight is stable, bee activity is low.  Give short bullet point style insights.",
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Basic parsing of the AI response (you might need a more robust parser)
      const parsedInsights: AIInsight[] = aiResponse
        .split("\n")
        .filter((line: string) => line.trim() !== "")
        .map((line: string) => {
          let type: "positive" | "negative" | "warning" = "positive";
          let icon = <TrendingUp className="h-4 w-4 text-green-500" />;

          if (line.toLowerCase().includes("warning") || line.toLowerCase().includes("alert")) {
            type = "warning";
            icon = <AlertCircle className="h-4 w-4 text-amber-500" />;
          } else if (line.toLowerCase().includes("decreased") || line.toLowerCase().includes("low")) {
            type = "negative";
            icon = <TrendingDown className="h-4 w-4 text-red-500" />;
          }

          return {
            type,
            message: line.replace(/^(-|\*|\+)\s*/, ""), // Remove leading bullet points/dashes
            icon,
          };
        });

      setInsights(parsedInsights);
    } catch (error: any) {
      console.error("Error fetching AI insights:", error);
      toast.error("Failed to fetch AI insights: " + error.message);
      setInsights([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Analysis
            </CardTitle>
            <CardDescription>
              Smart insights based on your hive data
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchInsights} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p>Loading insights...</p>
          ) : insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === "positive"
                    ? "bg-green-500/10"
                    : insight.type === "warning"
                    ? "bg-amber-500/10"
                    : "bg-red-500/10"
                }`}
              >
                <h3
                  className={`font-semibold mb-1 ${
                    insight.type === "positive"
                      ? "text-green-600"
                      : insight.type === "warning"
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {insight.icon}
                  {insight.type === "positive"
                    ? "Positive Trend"
                    : insight.type === "warning"
                    ? "Warning"
                    : "Negative Trend"}
                </h3>
                <p className="text-sm">{insight.message}</p>
              </div>
            ))
          ) : (
            <p>No insights available at the moment.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;
