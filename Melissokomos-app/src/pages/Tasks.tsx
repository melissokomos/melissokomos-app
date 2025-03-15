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
import { Edit, Trash, PlusCircle, CheckCircle2Icon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type Hive = Database["public"]["Tables"]["hives"]["Row"]; // Import Hive type

const taskFormSchema = z.object({
  task: z.string().min(1, "Task description is required"),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  hive_id: z.string().optional(), // Hive ID is optional
  completed: z.boolean().optional(),
});

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hives, setHives] = useState<Hive[]>([]); // State for hives
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(
    null
  );
  const { session } = useAuth();

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      due_date: format(new Date(), "yyyy-MM-dd"),
      completed: false,
    },
  });

  const fetchTasks = async () => {
    if (!session || !session.user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*, hives(name)") // Fetch associated hive name
      .eq("user_id", session.user.id)
      .order("due_date", { ascending: true });

    if (error) {
      toast.error("Error fetching tasks: " + error.message);
    } else {
      setTasks(data || []);
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
    fetchTasks();
    fetchHives(); // Fetch hives for the dropdown
  }, [session]);

    const onSubmit = async (values: z.infer<typeof taskFormSchema>) => {
        if (!session || !session.user) {
            toast.error("You must be logged in to perform this action.");
            return;
        }

        try {
            if (isEditing && editingTaskId) {
                // Update existing task
                const { error } = await supabase
                .from("tasks")
                .update({
                    ...values,
                    due_date: new Date(values.due_date).toISOString(), // Format date
                    user_id: session.user.id,
                    hive_id: values.hive_id === undefined ? null : values.hive_id, // Convert undefined to null
                })
                .eq("id", editingTaskId)
                .eq("user_id", session.user.id); // Prevent updating other users' tasks
                if (error) throw error;
                toast.success("Task updated successfully!");
            } else {
                // Add new task
                const { error } = await supabase.from("tasks").insert([
                {
                    ...values,
                    due_date: new Date(values.due_date).toISOString(), // Format date
                    user_id: session.user.id, // Set the user_id on creation
                    hive_id: values.hive_id === undefined ? null : values.hive_id, // Convert undefined to null

                },
                ]);
                if (error) throw error;
                toast.success("Task added successfully!");
            }
            fetchTasks(); // Refresh the list
            setIsDialogOpen(false);
            form.reset();
            setEditingTaskId(null); // Clear editing state
            setIsEditing(false);
            } catch (error: any) {
            toast.error("Error saving task: " + error.message);
            }
    };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setIsEditing(true);
    form.reset({
      task: task.task,
      due_date: format(new Date(task.due_date), "yyyy-MM-dd"),
      hive_id: task.hive_id,
      completed: task.completed,
    });
    setIsDialogOpen(true);
  };

  const deleteTask = async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", session?.user.id); // Check user owns item
      if (error) {
        toast.error("Error deleting task: " + error.message);
      } else {
        toast.success("Task deleted successfully!");
        fetchTasks();
      }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Task" : "Add Task"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update task details."
                  : "Add a new task to your list."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="hive_id"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hive</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a hive" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value={undefined}> 
                                None
                            </SelectItem>
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
                    name="completed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                        Completed
                        </FormLabel>
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

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted font-medium">
              <div>Task</div>
              <div>Due Date</div>
              <div>Hive</div>
              <div>Actions</div>
            </div>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-4 gap-4 p-4 border-t"
              >
                <div>{task.task}</div>
                <div>{format(new Date(task.due_date), "PPP")}</div>
                <div>
                    {task.hives ? (task.hives as any).name : "N/A"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(task)}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this task.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTask(task.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
