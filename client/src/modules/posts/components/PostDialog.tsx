import { Input } from "@/modules/shared/components/ui/Input";
import Error from "@/modules/shared/components/Error";
import { Textarea } from "@/modules/shared/components/ui/Textarea";
import { Field, FieldDescription } from "@/modules/shared/components/ui/Field";
import { Button } from "@/modules/shared/components/ui/Button";
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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import { useForm, type ControllerRenderProps, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema } from "@/modules/shared/lib/validators";
import type { FormSchemaType } from "../types/types";
import { useState } from "react";
import type { PostFormType } from "@/modules/shared/types/types";

type PropType = "title" | "description" | "groupSize" | "tags" | "chatTitle";

interface PostFormFieldProps {
  form: UseFormReturn<FormSchemaType>;
  name: PropType;
  formLabel: string;
  children: (field: ControllerRenderProps<FormSchemaType, PropType>) => React.ReactNode;
}

const DialogField = (props: PostFormFieldProps) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{props.formLabel}</FormLabel>
          <FormControl>{props.children(field)}</FormControl>
          {fieldState.error && <Error message={fieldState.error.message} />}
        </FormItem>
      )}
    />
  );
};

const Tag = ({ label }: { label: string }) => {
  return (
    <div className="w-20">
      <p className="small-medium flex-center rounded-xl bg-green-200 py-1 text-gray-600">{label}</p>
    </div>
  );
};

interface PostDialogProps {
  submitPost: (values: Omit<PostFormType, "userId">) => void;
  error: string | null;
}

const PostDialog = ({ submitPost, error }: PostDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      description: "",
      groupSize: 2,
      tags: "",
      chatTitle: "",
    },
  });

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>, field: ControllerRenderProps<FormSchemaType, PropType>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget as HTMLInputElement;
      const value = input.value.trim();
      setTags((prev) => [...prev, value]);
      if (!value) return;
      e.preventDefault();
      field.value = "";
    }
  };

  const onSubmit = (values: FormSchemaType) => {
    const result = {
      ...values,
      tags,
    };

    submitPost(result);
    setDialogOpen(false);
    form.reset();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Form {...form}>
        <DialogTrigger asChild>
          <Button className="small-medium background-blue mx-auto mb-4 flex h-8 w-30 cursor-pointer rounded-xl px-4 py-3 text-center text-white hover:bg-[#226abb]">
            Create
          </Button>
        </DialogTrigger>

        <DialogContent className="border-none bg-white sm:max-w-sm">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Post</DialogTitle>
            </DialogHeader>

            <DialogDescription className="body-light my-3">
              Fill out the form below to create a new post.
            </DialogDescription>

            <div className="flex flex-col gap-y-5">
              <DialogField form={form} name="title" formLabel="Title">
                {(field) => <Input placeholder="Enter your title..." {...field} type="text" />}
              </DialogField>

              <DialogField form={form} name="description" formLabel="Description">
                {(field) => (
                  <Field>
                    <FieldDescription className="small-medium text-gray-400">Describe your post</FieldDescription>
                    <Textarea
                      id="textarea-message"
                      placeholder="Add your post description..."
                      {...field}
                      className="max-h-37.5"
                    />
                  </Field>
                )}
              </DialogField>

              <DialogField form={form} name="groupSize" formLabel="Group Size (from 2 to 10 people)">
                {(field) => <Input placeholder="Enter group size" {...field} type="number" min={2} max={10} />}
              </DialogField>

              <DialogField form={form} name="tags" formLabel="Tags">
                {(field) => (
                  <Input {...field} type="text" placeholder="Add tags..." onKeyDown={(e) => addTag(e, field)} />
                )}
              </DialogField>

              <div className="flex w-80 flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>

              <DialogField form={form} name="chatTitle" formLabel="Chat Title">
                {(field) => <Input placeholder="Add chat title..." {...field} type="text" />}
              </DialogField>
            </div>

            <DialogFooter className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button
                type="submit"
                className="background-blue w-full cursor-pointer border text-white hover:bg-[#226abb] sm:flex-1"
              >
                Create
              </Button>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    form.reset();
                    form.clearErrors();
                    setTags([]);
                  }}
                  variant="outline"
                  className="h w-full cursor-pointer hover:bg-gray-100 sm:flex-1"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
        {error && <Error message={error} />}
      </Form>
    </Dialog>
  );
};

export default PostDialog;
