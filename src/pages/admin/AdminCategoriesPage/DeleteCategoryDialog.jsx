import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteCategoryMutation } from "@/mutations/useDeleteCategoryMutation";

const DeleteCategoryDialog = ({ category }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending, isError } = useDeleteCategoryMutation();

  const deleteHandler = async () => {
    await mutateAsync(category.slug);
    if (isError) {
      toast.error(`Failed to add category ${name}`);
    } else {
      setOpen(false);
      toast.success(`Category "${category.name}" has been deleted`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 size={22} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Category "{category.name}"</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "{category.name}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="secondary"
              className="bg-gray-50 text-black hover:bg-gray-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="primary"
            className="bg-red-500 hover:bg-red-700"
            onClick={deleteHandler}
          >
            <Spinner className={isPending ? "" : "hidden"} />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
