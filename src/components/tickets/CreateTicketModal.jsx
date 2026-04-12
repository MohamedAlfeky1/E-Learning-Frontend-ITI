import React from "react";
import { useForm } from "react-hook-form";
import { useCreateTicketMutation } from "@/mutations/ticketMutations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { TICKET_CATEGORIES } from "@/data/ticketCategories";

const CreateTicketModal = () => {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({defaultValues: {
    category: "other"}});
  const createMutation = useCreateTicketMutation();

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-bold gap-2">
          <Plus size={18} /> New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Open Support Ticket</DialogTitle>
          <DialogDescription>Briefly describe your issue and we'll get back to you.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label>Category</Label>
              <Select onValueChange={(val) => setValue("category", val)}>
  <SelectTrigger>
    <SelectValue placeholder="Select a category" />
  </SelectTrigger>

  <SelectContent>
    {TICKET_CATEGORIES.map((cat) => (
      <SelectItem key={cat.value} value={cat.value}>
        {cat.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input 
              {...register("subject", { required: "Subject is required" })} 
              placeholder="e.g., Cannot access video lessons"
            />
            {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Detailed Message</Label>
            <Textarea 
              {...register("message", { required: "Message is required" })} 
              placeholder="Describe your problem in detail..."
              className="min-h-[120px]"
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Submit Ticket"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;