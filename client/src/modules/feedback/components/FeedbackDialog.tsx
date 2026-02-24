import type { FeedbackFormValues } from "@/modules/shared/types/types";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FeedbackSchema } from "@/modules/shared/lib/validators";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/components/ui/Dialog";
import { Button } from "@/modules/shared/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import { Textarea } from "@/modules/shared/components/ui/Textarea";
import Error from "@/modules/shared/components/Error";
import { RatingInput } from "./RatingInput";

interface FeedbackDialogProps {
  submitFeedback: (values: FeedbackFormValues) => void;
  error: string | null;
  isSubmitting: boolean;
}

const FeedbackDialog = ({ submitFeedback, error, isSubmitting }: FeedbackDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      message: "",
      rating: 0,
    },
  });

  const reset = () => {
    form.reset();
    form.clearErrors();
  };

  async function onSubmit(values: z.infer<typeof FeedbackSchema>) {
    submitFeedback(values);
    setDialogOpen(false);
    reset();
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="small-medium flex w-30 cursor-pointer rounded-md bg-[#e8edf3] px-4 py-3 text-center text-black hover:bg-[#f2f6fa]">
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-white [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription className="body-light my-3">
            We value your feedback! Please share your thoughts and experiences on this person.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your feedback message"
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RatingInput value={field.value ?? 0} onChange={(v) => field.onChange(v)} />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="background-blue cursor-pointer border text-white hover:bg-[#226abb] disabled:cursor-not-allowed sm:flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <DialogClose asChild>
                <Button onClick={reset} variant="outline" className="cursor-pointer hover:bg-gray-100 sm:flex-1">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
            {error && <Error message={error} />}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
