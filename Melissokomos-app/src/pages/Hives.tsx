import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { Edit, Trash, PlusCircle } from "lucide-react";

type Inspection = Database["public"]["Tables"]["inspections"]["Row"];
type Hive = Database["public"]["Tables"]["hives"]["Row"];

const hiveFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  status: z.enum(["healthy", "warning", "critical"]).optional(),
  temperature: z.coerce.number().optional(),
  humidity: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  activity: z.coerce.number().optional(),
});

const Hives: React.FC = () => {
  const [hives, setHives] = useState<Hive[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHiveId, setEditingHiveId] = useState<string | null>(
    null
  );
  const { session } = useAuth();

  const form = useForm<z.infer<typeof hiveFormSchema>>({
    resolver: zodResolver(hiveFormSchema),
    defaultValues: {
      name: "",
      location: "",
      status: undefined, // Make optional fields undefined by default
      temperature: undefined,
      humidity: undefined,
      weight: undefined,
      activity: undefined,
    },
  });

  const fetchInspections = async () => {
    const { data, error } = await supabase
      .from("inspections")
      .select("*, hives(name)") // Fetch hive name
      .order("inspection_date", { ascending: false });
    if (error) {
      toast.error("Error fetching inspections: " + error.message);
    } else {
      //setInspections(data || []); //This was causing a type error
    }
  };

    const fetchHives = async () => {
    if (!session || !session.user) return; // Don't fetch if not logged in

    const { data, error } = await supabase
      .from("hives")
      .select("*")
      .eq("user_id", session.user.id) // Fetch only the current user's hives
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching hives: " + error.message);
    } else {
      setHives(data || []);
    }
  };
    
    useEffect(() => {
    fetchHives();
  }, [session]); // Refetch when session changes

  const onSubmit = async (values: z.infer<typeof hiveFormSchema>) => {
    if (!session || !session.user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      if (isEditing && editingHiveId) {
        // Update existing hive
        const { error } = await supabase
          .from("hives")
          .update({
            ...values,
            user_id: session.user.id, // Ensure user_id is set on update
            // Convert undefined values to null for Supabase
            temperature: values.temperature === undefined ? null : values.temperature,
            humidity: values.humidity === undefined ? null : values.humidity,
            weight: values.weight === undefined ? null : values.weight,
            activity: values.activity === undefined ? null : values.activity,
            status: values.status === undefined ? null : values.status,
          })
          .eq("id", editingHiveId)
          .eq("user_id", session.user.id); // Important: Prevent updating other users' hives
        if (error) throw error;
        toast.success("Hive updated successfully!");
      } else {
        // Add new hive
        const { error } = await supabase.from("hives").insert([
          {
            ...values,
            user_id: session.user.id, // Set the user_id on creation
            temperature: values.temperature === undefined ? null : values.temperature,
            humidity: values.humidity === undefined ? null : values.humidity,
            weight: values.weight === undefined ? null : values.weight,
            activity: values.activity === undefined ? null : values.activity,
            status: values.status === undefined ? null : values.status,
          },
        ]);
        if (error) throw error;
        toast.success("Hive added successfully!");
      }
      fetchHives(); // Refresh the list
      setIsDialogOpen(false);
      form.reset();
      setEditingHiveId(null); // Clear editing state
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Error saving hive: " + error.message);
    }
  };

    const startEdit = (hive: Hive) => {
    setEditingHiveId(hive.id);
    setIsEditing(true);
    // Set form values, handling potential null values from the database
    form.reset({
      name: hive.name,
      location: hive.location,
      status: hive.status ?? undefined, // Use optional chaining and nullish coalescing
      temperature: hive.temperature ?? undefined,
      humidity: hive.humidity ?? undefined,
      weight: hive.weight ?? undefined,
      activity: hive.activity ?? undefined,
    });
    setIsDialogOpen(true);
  };

    const deleteHive = async (id: string) => {
      const { error } = await supabase.from("hives").delete().eq("id", id).eq("user_id", session?.user.id); // Check user owns item
      if (error) {
        toast.error("Error deleting hive: " + error.message);
      } else {
        toast.success("Hive deleted successfully!");
        fetchHives();
      }
  };

    // Function moved here
    const getStatusColor = (status: string) => {
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hives</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Hive
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Hive" : "Add Hive"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update hive details."
                  : "Add a new hive to your list."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Hive name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Hive location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  <Button type="submit">
                    {isEditing ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hives.map((hive) => (
          <Card key={hive.id} className="overflow-hidden">
            <div className={`h-1 ${getStatusColor(hive.status || 'healthy')}`} />
            <CardHeader className="pb-2">
              <CardTitle>{hive.name}</CardTitle>
              <CardDescription>{hive.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>Temperature: {hive.temperature !== null ? `${hive.temperature}°C` : 'N/A'}</div>
              <div>Humidity: {hive.humidity !== null ? `${hive.humidity}%` : 'N/A'}</div>
              <div>Weight: {hive.weight !== null ? `${hive.weight} kg` : 'N/A'}</div>
              <div>Activity: {hive.activity !== null ? `${hive.activity}%` : 'N/A'}</div>
              <div>Status: {hive.status || 'N/A'}</div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(hive)}
                >
                  <Edit className="mr-1 h-3 w-3" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this hive and all related data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteHive(hive.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Hives;
