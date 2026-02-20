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
import PostTag from "./PostTag";

type PropType = "title" | "description" | "groupSize" | "tags" | "chatTitle";

interface PostFormFieldProps {
  form: UseFormReturn<FormSchemaType>;
  name: PropType;
  formLabel: string;
  children: (field: ControllerRenderProps<FormSchemaType, PropType>) => React.ReactNode;
}

const MAX_TAGS = 3;

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
      groupSize: "2",
      tags: "",
      chatTitle: "",
    },
  });

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>, field: ControllerRenderProps<FormSchemaType, PropType>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget as HTMLInputElement;
      const value = input.value.trim();
      if (!value) return;
      setTags((prev) => [...prev, value]);
      e.preventDefault();
      field.value = "";
    }
  };

  const removeTag = (label: string) => {
    setTags(tags.filter((tag) => tag !== label));
  };

  const resetForm = () => {
    form.reset();
    form.clearErrors();
    setTags([]);
  };

  const onSubmit = (values: FormSchemaType) => {
    const result = {
      ...values,
      tags,
    };

    submitPost(result);
    setDialogOpen(false);
    resetForm();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Form {...form}>
        <DialogTrigger asChild>
          <Button className="small-medium mx-auto mb-4 flex h-8 w-30 cursor-pointer rounded-md bg-[#e8edf3] px-4 py-3 text-center text-black hover:bg-[#f2f6fa]">
            Create
          </Button>
        </DialogTrigger>

        <DialogContent className="border-none bg-white">
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                    <FieldDescription className="small-medium text-gray-400">
                      Describe your post: your ideas, difficulties, etc.
                    </FieldDescription>
                    <Textarea id="textarea-message" placeholder="Add your post description..." {...field} />
                  </Field>
                )}
              </DialogField>

              <DialogField form={form} name="groupSize" formLabel="Group Size (from 2 to 10 people)">
                {(field) => <Input placeholder="Enter group size" {...field} type="number" min={2} max={10} />}
              </DialogField>

              <DialogField form={form} name="tags" formLabel="Tags">
                {(field) => (
                  <Input
                    {...field}
                    disabled={tags.length >= MAX_TAGS}
                    type="text"
                    placeholder="Add tags..."
                    onKeyDown={(e) => {
                      if (tags.length < MAX_TAGS) {
                        addTag(e, field);
                        field.value = "";
                      }
                    }}
                  />
                )}
              </DialogField>

              <div className="flex flex-row gap-1">
                {tags.map((tag) => (
                  <PostTag key={tag} isDeletable={true} label={tag} removeTag={removeTag} />
                ))}
              </div>

              <DialogField form={form} name="chatTitle" formLabel="Chat Title">
                {(field) => <Input placeholder="Add chat title..." {...field} type="text" />}
              </DialogField>
            </div>

            <DialogFooter className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button
                type="submit"
                className="background-blue cursor-pointer border text-white hover:bg-[#226abb] sm:flex-1"
              >
                Create
              </Button>
              <DialogClose asChild>
                <Button onClick={resetForm} variant="outline" className="cursor-pointer hover:bg-gray-100 sm:flex-1">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
      {error && <Error message={error} />}
    </Dialog>
  );
};

export default PostDialog;
