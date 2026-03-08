import { Button } from "@/modules/shared/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/components/ui/Dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  handleDelete: () => void;
  title: string;
  description: string;
}

const DeleteDialog = ({ handleDelete, title, description }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="small-medium flex cursor-pointer rounded-md border border-[#e8edf3] text-center text-black hover:bg-[#f2f6fa]"
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="border-none bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-start ml-auto gap-x-3">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="cursor-pointer border-[#e8edf3] hover:bg-[#f2f6fa]"
          >
            Delete
          </Button>
          <Button
            className="cursor-pointer bg-[#e8edf3] text-center text-black hover:bg-[#f2f6fa]"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
