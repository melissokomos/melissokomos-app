import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  ThermometerSun,
  Droplets,
  Scale,
  PlusCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter, // Import CardFooter
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import WeatherWidget from "@/components/WeatherWidget";
import AIAnalysis from "@/components/AIAnalysis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select

interface Hive {
  id: string;
  name: string;
  location: string;
  status: "healthy" | "warning" | "critical" | null; // Allow null
  temperature: number | null;
  humidity: number | null;
  weight: number | null;
  activity: number | null;
  last_inspection: string | null;
}

interface Task {
  id: string;
  task: string;
  due_date: string;
  completed: boolean;
  hive_id?: string;
}

// Use the same schema as Hives.tsx
const hiveFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  status: z.enum(["healthy", "warning", "critical"]).optional(),
  temperature: z.coerce.number().optional(),
  humidity: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  activity: z.coerce.number().optional(),
});

const Dashboard: React.FC = () => {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hives, setHives] = useState<Hive[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHiveDialogOpen, setIsHiveDialogOpen] = useState(false);

  // Use the same form setup as in Hives.tsx
  const hiveForm = useForm<z.infer<typeof hiveFormSchema>>({
    resolver: zodResolver(hiveFormSchema),
    defaultValues: {
      name: "",
      location: "",
      status: undefined,
      temperature: undefined,
      humidity: undefined,
      weight: undefined,
      activity: undefined,
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: hivesData, error: hivesError } = await supabase
        .from("hives")
        .select("*")
        .eq("user_id", session?.user.id) // Only fetch user's hives
        .order("created_at", { ascending: false });

      if (hivesError) throw hivesError;

      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("completed", false)
        .order("due_date", { ascending: true })
        .limit(4);

      if (tasksError) throw tasksError;

      setHives(hivesData as Hive[]);
      setTasks(tasksData as Task[]);
    } catch (error: any) {
      toast.error(`Error fetching data: ${error.message}`);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]); // Refetch when session changes

  const refreshData = () => {
    fetchData();
  };

  // Reusing getStatusColor from Hives page logic.
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

    const onSubmit = async (values: z.infer<typeof hiveFormSchema>) => {
    if (!session || !session.user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      // Add new hive
      const { error } = await supabase.from("hives").insert([
        {
          ...values,
          user_id: session.user.id, // Set the user_id on creation
          // Convert undefined to null for Supabase
          temperature: values.temperature === undefined ? null : values.temperature,
          humidity: values.humidity === undefined ? null : values.humidity,
          weight: values.weight === undefined ? null : values.weight,
          activity: values.activity === undefined ? null : values.activity,
          status: values.status === undefined ? null : values.status,
        },
      ]);
      if (error) throw error;
      toast.success("Hive added successfully!");

      fetchData(); // Refresh the list
      setIsHiveDialogOpen(false);
      hiveForm.reset();

    } catch (error: any) {
      toast.error("Error saving hive: " + error.message);
    }
  };


  const markTaskComplete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: true })
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task marked as complete!");
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error: any) {
      toast.error(`Error updating task: ${error.message}`);
    }
  };

  const calculateHealthScore = (hive: Hive) => {
    // Use 0 as default value for potentially null fields
    const tempScore =
      hive.temperature !== null && hive.temperature >= 32 && hive.temperature <= 35
        ? 100
        : hive.temperature !== null && hive.temperature >= 30 && hive.temperature <= 37
        ? 70
        : 40;

    const humidityScore =
      hive.humidity !== null && hive.humidity >= 40 && hive.humidity <= 60
        ? 100
        : hive.humidity !== null && hive.humidity >= 30 && hive.humidity <= 70
        ? 70
        : 40;

    const activityScore = hive.activity ?? 0; // Default to 0 if null

    return Math.round((tempScore + humidityScore + activityScore) / 3);
  };

  const getAverageHealthScore = () => {
    if (hives.length === 0) return 0;
    return Math.round(
      hives.reduce((sum, hive) => sum + calculateHealthScore(hive), 0) /
        hives.length
    );
  };

  const countActiveAlerts = () => {
    return hives.filter(
      (hive) => hive.status === "warning" || hive.status === "critical"
    ).length;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {/* Only show welcome message if user is loaded */}
          {user && (
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.name}! Here's an overview of your hives.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {/* Use Dialog and the same form as Hives.tsx */}
          <Dialog open={isHiveDialogOpen} onOpenChange={(open) => {
            setIsHiveDialogOpen(open);
            if (!open) {
              hiveForm.reset(); // Reset the form when closing
              fetchData();    // Refetch data to update dashboard
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Hive
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Hive</DialogTitle>
                <DialogDescription>
                  Enter the details for your new hive.
                </DialogDescription>
              </DialogHeader>
              {/* Reuse the form from Hives.tsx */}
              <Form {...hiveForm}>
                <form
                  onSubmit={hiveForm.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={hiveForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hive name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={hiveForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hive location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={hiveForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthy">Healthy</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={hiveForm.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Temperature" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={hiveForm.control}
                    name="humidity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Humidity (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Humidity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={hiveForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={hiveForm.control}
                    name="activity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Activity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Add Hive</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{hives.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {hives.length > 0
                ? `${hives.length} hives being monitored`
                : "No hives yet"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getAverageHealthScore()}%</div>
            <div className="text-xs text-green-500 mt-1">
              {hives.length > 0
                ? "Hives are in good condition"
                : "No data available"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{countActiveAlerts()}</div>
            <div className="text-xs text-amber-500 mt-1">
              {countActiveAlerts() > 0
                ? countActiveAlerts() === 1
                  ? "1 hive needs attention"
                  : `${countActiveAlerts()} hives need attention`
                : "No alerts at this time"}
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-1">
          <WeatherWidget />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Hives</h2>
          {/* Removed "View All" button */}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="opacity-50">
                <div className="h-1 bg-gray-200" />
                <CardHeader className="pb-2 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-4 animate-pulse">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-10 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardContent>
                <CardFooter className="border-t pt-4 pb-2 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : hives.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium">No Hives Yet</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't added any hives to monitor yet. Add your first hive
                to start tracking its health and performance.
              </p>
              <Button onClick={() => setIsHiveDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Hive
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hives.map((hive) => (
              <Card key={hive.id} className="overflow-hidden">
                <div className={`h-1 ${getStatusColor(hive.status)}`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{hive.name}</CardTitle>
                      <CardDescription>{hive.location}</CardDescription>
                    </div>
                    {hive.status !== "healthy" && hive.status !== null && (
                      <div className="bg-amber-500/10 rounded-full p-1">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hive.temperature !== null
                            ? `${hive.temperature}°C`
                            : "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Temperature
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hive.humidity !== null ? `${hive.humidity}%` : "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Humidity
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hive.weight !== null ? `${hive.weight} kg` : "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">Weight</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hive.activity !== null ? `${hive.activity}%` : "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Activity
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-medium">Overall Health</p>
                      <p className="text-xs font-medium">
                        {calculateHealthScore(hive)}%
                      </p>
                    </div>
                    <Progress
                      value={calculateHealthScore(hive)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
                {/* Removed Edit/Delete buttons */}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View Calendar <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 px-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Upcoming Tasks</h3>
                  <p className="text-muted-foreground">
                    You don't have any tasks scheduled. Add a task to get
                    started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-4 px-6"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{task.task}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(task.due_date).toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markTaskComplete(task.id)}
                    >
                      Mark Complete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Insights</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View Details <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <AIAnalysis />
      </div>
    </div>
  );
};

export default Dashboard;
