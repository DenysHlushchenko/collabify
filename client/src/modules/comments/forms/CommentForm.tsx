import { Form, FormControl, FormField, FormItem } from "@/modules/shared/components/ui/Form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { CommentFormValues } from "@/modules/shared/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/modules/shared/lib/validators";
import Error from "@/modules/shared/components/Error";
import { Button } from "@/modules/shared/components/ui/Button";
import { LoaderCircle } from "lucide-react";
import TipTap from "../components/editor/TipTap";

interface CommentFormProps {
  submitComment: (values: CommentFormValues) => void;
  error?: string | null;
  isSubmitting?: boolean;
}

const CommentForm = ({ submitComment, error, isSubmitting }: CommentFormProps) => {
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const reset = () => {
    form.reset();
    form.clearErrors();
  };

  async function onSubmit(values: z.infer<typeof CommentSchema>) {
    submitComment(values);
    reset();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex w-full flex-col">
        <FormField
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormControl className="mt-3.5">
                <TipTap description={field.value} onChange={field.onChange} />
              </FormControl>
              {fieldState.error && <Error message={fieldState.error.message} />}
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="background-blue w-fit cursor-pointer border text-white hover:bg-[#226abb] disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
        {error && <Error message={error} />}
      </form>
    </Form>
  );
};

export default CommentForm;
