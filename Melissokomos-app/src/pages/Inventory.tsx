import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageOpen, Plus, Edit, Trash } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  user_id: string; // Add user_id
  created_at: string;
}

const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
});

const Inventory: React.FC = () => {
  const { user, session } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof inventoryItemSchema>>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
    },
  });

  const fetchInventory = async () => {
    if (!user) return; // Don't fetch if not logged in

    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id) // Fetch only the current user's items
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching inventory: " + error.message);
    } else {
      setInventoryItems(data || []);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]); // Refetch when the user changes

  const onSubmit = async (values: z.infer<typeof inventoryItemSchema>) => {
    if (!session || !session.user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      if (isEditing && editingItemId) {
        // Update existing item
        const { error } = await supabase
          .from("inventory")
          .update(values)
          .eq("id", editingItemId)
          .eq("user_id", session.user.id); // Ensure user owns the item
        if (error) throw error;
        toast.success("Item updated successfully!");
      } else {
        // Add new item
        const { error } = await supabase.from("inventory").insert([
          {
            ...values,
            user_id: session.user.id, // Set the user_id on creation
          },
        ]);
        if (error) throw error;
        toast.success("Item added successfully!");
      }
      fetchInventory(); // Refresh the list
      setIsDialogOpen(false);
      form.reset();
      setEditingItemId(null);
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Error saving item: " + error.message);
    }
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setIsEditing(true);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id).eq("user_id", session?.user.id); // Check user owns item
    if (error) {
      toast.error("Error deleting item: " + error.message);
    } else {
      toast.success("Item deleted successfully!");
      fetchInventory();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Item" : "Add Item"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update item details."
                  : "Add a new item to your inventory."}
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
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Tools">Tools</SelectItem>
                          <SelectItem value="Protective Gear">
                            Protective Gear
                          </SelectItem>
                          <SelectItem value="Packaging">Packaging</SelectItem>
                          <SelectItem value="Supplies">Supplies</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Quantity" {...field} />
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted font-medium">
              <div>Name</div>
              <div>Category</div>
              <div>Quantity</div>
              <div>Actions</div>
            </div>

            {inventoryItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-4 gap-4 p-4 border-t"
              >
                <div className="flex items-center gap-2">
                  <PackageOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{item.name}</span>
                </div>
                <div>{item.category}</div>
                <div>{item.quantity}</div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => startEdit(item)}
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
                          delete this item from your inventory.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteItem(item.id)}
                        >
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

export default Inventory;
