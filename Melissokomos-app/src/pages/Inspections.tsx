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
import { useAuth } from "@/context/AuthContext"; // Import useAuth

type Inspection = Database["public"]["Tables"]["inspections"]["Row"];
type Hive = Database["public"]["Tables"]["hives"]["Row"];

const inspectionFormSchema = z.object({
  hive_id: z.string().min(1, "Please select a hive."),
  inspection_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  notes: z.string().optional(),
  brood_pattern: z.coerce.number().min(0).max(100).optional(),
  honey_stores: z.coerce.number().min(0).max(100).optional(),
  pollen_stores: z.coerce.number().min(0).max(100).optional(),
  queen_seen: z.boolean().optional(),
  issues: z.array(z.string()).optional(),
});

const Inspections: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [hives, setHives] = useState<Hive[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInspectionId, setEditingInspectionId] = useState<string | null>(
    null
  );
  const { session } = useAuth(); // Get the session from context

  const form = useForm<z.infer<typeof inspectionFormSchema>>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      inspection_date: format(new Date(), "yyyy-MM-dd"),
      issues: [],
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
      setInspections(data || []);
    }
  };

  const fetchHives = async () => {
    const { data, error } = await supabase.from("hives").select("id, name");
    if (error) {
      toast.error("Error fetching hives: " + error.message);
    } else {
      setHives(data || []);
    }
  };

  useEffect(() => {
    fetchInspections();
    fetchHives();
  }, []);

    const onSubmit = async (values: z.infer<typeof inspectionFormSchema>) => {
    // Get the session from the context.  It's already available!
    if (!session || !session.user) { // Check the session, not just user
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      if (isEditing && editingInspectionId) {
        // Update existing inspection
        const { error } = await supabase
          .from("inspections")
          .update({
            ...values,
            inspection_date: new Date(values.inspection_date).toISOString(),
            user_id: session.user.id, // Use session.user.id
          })
          .eq("id", editingInspectionId);
        if (error) throw error;
        toast.success("Inspection updated successfully!");
      } else {
        // Add new inspection
        const { error } = await supabase.from("inspections").insert([
          {
            ...values,
            inspection_date: new Date(values.inspection_date).toISOString(),
            user_id: session.user.id, // Use session.user.id
          },
        ]);
        if (error) throw error;
        toast.success("Inspection added successfully!");
      }
      fetchInspections(); // Refresh the list
      setIsDialogOpen(false);
      form.reset();
      setEditingInspectionId(null); // Clear editing state
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Error saving inspection: " + error.message);
    }
  };

  const startEdit = (inspection: Inspection) => {
    setEditingInspectionId(inspection.id);
    setIsEditing(true);
    form.reset({
      hive_id: inspection.hive_id,
      inspection_date: format(new Date(inspection.inspection_date), "yyyy-MM-dd"),
      notes: inspection.notes,
      brood_pattern: inspection.brood_pattern,
      honey_stores: inspection.honey_stores,
      pollen_stores: inspection.pollen_stores,
      queen_seen: inspection.queen_seen,
      issues: inspection.issues,
    });
    setIsDialogOpen(true);
  };

  const deleteInspection = async (id: string) => {
      const { error } = await supabase.from("inspections").delete().eq("id", id);
      if (error) {
        toast.error("Error deleting inspection: " + error.message);
      } else {
        toast.success("Inspection deleted successfully!");
        fetchInspections();
      }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hive Inspections</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Inspection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Inspection" : "Add Inspection"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update inspection details."
                  : "Add a new inspection record."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="hive_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hive</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a hive" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hives.map((hive) => (
                            <SelectItem key={hive.id} value={hive.id}>
                              {hive.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inspection_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inspection Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter inspection notes..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="brood_pattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brood Pattern (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="honey_stores"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Honey Stores (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pollen_stores"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pollen Stores (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="queen_seen"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Queen Seen
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issues</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any issues separated by commas (e.g., mites, disease)"
                            value={field.value?.join(", ") || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value.split(",").map((s) => s.trim()))
                            }
                          />
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

      <div className="grid gap-4">
        {inspections.map((inspection) => (
          <Card key={inspection.id}>
            <CardHeader>
              <CardTitle>
                Inspection on {format(new Date(inspection.inspection_date), "PPP")}
              </CardTitle>
              <CardDescription>
                Hive:{" "}
                {
                  (inspection.hives && (inspection.hives as any).name) ||
                  hives.find((h) => h.id === inspection.hive_id)?.name ||
                  "Unknown"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notes: {inspection.notes || "No notes"}</p>
              {inspection.brood_pattern !== null && inspection.brood_pattern !== undefined && (
                <p>Brood Pattern: {inspection.brood_pattern}%</p>
              )}
              {inspection.honey_stores !== null && inspection.honey_stores !== undefined && (
                <p>Honey Stores: {inspection.honey_stores}%</p>
              )}
              {inspection.pollen_stores !== null && inspection.pollen_stores !== undefined && (
                <p>Pollen Stores: {inspection.pollen_stores}%</p>
              )}
              {inspection.queen_seen !== null && inspection.queen_seen !== undefined && (
                <p>Queen Seen: {inspection.queen_seen ? "Yes" : "No"}</p>
              )}
              {inspection.issues && inspection.issues.length > 0 && (
                <p>Issues: {inspection.issues.join(", ")}</p>
              )}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(inspection)}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this inspection.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteInspection(inspection.id)}
                      >
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

export default Inspections;
