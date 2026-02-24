import { useForm, type ControllerRenderProps } from "react-hook-form";
import { PostSchema } from "@/modules/shared/lib/validators";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import { Input } from "@/modules/shared/components/ui/Input";
import Error from "@/modules/shared/components/Error";
import { getAllChatsByUserId } from "@/modules/chats/api/chat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/Select";
import type { EditPostFormValues, PostFormValues, PostType } from "@/modules/shared/types/types";
import { Textarea } from "@/modules/shared/components/ui/Textarea";
import PostTag from "../PostTag";

interface PostFormProps {
  type: "create" | "edit";
  postDetails?: PostType;
  submitPost: (values: PostFormValues | EditPostFormValues) => void;
  error?: string | null;
  isSubmitting?: boolean;
}

const PostForm = ({ type, postDetails, submitPost, error, isSubmitting }: PostFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = useAuthStore().getUser();

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats", user?.id],
    queryFn: () => (user ? getAllChatsByUserId(user.id) : null),
    staleTime: 1000 * 10,
    enabled: type === "create" && !!user,
    retry: 2,
  });

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      description: "",
      groupSize: 2,
      tags: [],
      chatTitle: "",
      chatId: undefined,
    },
  });

  useEffect(() => {
    if (postDetails && type === "edit") {
      form.reset({
        title: postDetails.title,
        description: postDetails.description,
        groupSize: postDetails.group_size || 2,
        tags: postDetails.postTags?.map((pt) => pt.tag.name) || [],
      });
    }
  }, [postDetails, type, form]);

  const reset = () => {
    form.reset();
    form.clearErrors();
  };

  async function onSubmit(values: z.infer<typeof PostSchema>) {
    submitPost(values);
    setDialogOpen(false);
    reset();
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<z.infer<typeof PostSchema>, "tags">
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (!field.value.includes(tagValue)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleRemoveTag = (tag: string, field: ControllerRenderProps<z.infer<typeof PostSchema>, "tags">) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button className="small-medium flex w-30 cursor-pointer rounded-md bg-[#e8edf3] px-4 py-3 text-center text-black hover:bg-[#f2f6fa]">
            Create
          </Button>
        ) : (
          type === "edit" &&
          user?.id === postDetails?.user.id && (
            <Button className="small-medium flex h-7 w-15 cursor-pointer rounded-md bg-[#e8edf3] text-center text-black hover:bg-[#f2f6fa]">
              Edit
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="border-none bg-white [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle>{type === "create" ? "Create a new post" : "Edit your post"}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {type === "create"
            ? "Use this form to create a new post. Provide a title, description, desired group size, and optional tags."
            : "Edit the title, description, group size, and tags of your existing post."}
        </DialogDescription>

        <Form {...form}>
          {isLoading ? (
            <div className="py-6 text-center">Loading form...</div>
          ) : (
            <form className="space-y-5 py-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Post title..." {...field} />
                    </FormControl>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Post description..." {...field} className="max-h-50" />
                    </FormControl>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupSize"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Group size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Group size"
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="paragraph-semibold">Tags</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          disabled={field.value.length >= 3}
                          className="no-focus paragraph-regular border disabled:cursor-not-allowed disabled:bg-gray-100"
                          placeholder={field.value.length >= 3 ? "Maximum 3 tags reached" : "Add tags..."}
                          onKeyDown={(e) => handleInputKeyDown(e, field)}
                        />

                        {field.value.length > 0 && (
                          <div className="flex-start mt-2.5 gap-2.5">
                            {field.value.map((tag: string) => (
                              <PostTag
                                key={tag}
                                isDeletable={true}
                                tag={tag}
                                field={field}
                                handleRemoveTag={handleRemoveTag}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {type === "create" && (
                <FormField
                  control={form.control}
                  name="chatTitle"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Chat title</FormLabel>
                      <FormControl>
                        <Input placeholder="Chat title..." {...field} />
                      </FormControl>
                      {fieldState.error && <Error message={fieldState.error.message} />}
                    </FormItem>
                  )}
                />
              )}

              {type === "create" && chats && chats?.length > 0 && (
                <FormField
                  control={form.control}
                  name="chatId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Chats</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your chat" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="bg-white">
                          {chats?.map((chat) => (
                            <SelectItem
                              key={chat.id}
                              value={chat.id.toString()}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              {chat.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <Error message={fieldState.error.message} />}
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="background-blue cursor-pointer border text-white hover:bg-[#226abb] sm:flex-1"
                >
                  {isSubmitting
                    ? type === "create"
                      ? "Creating..."
                      : "Editing..."
                    : type === "create"
                      ? "Create"
                      : "Save"}
                </Button>
                <DialogClose asChild>
                  <Button onClick={reset} variant="outline" className="cursor-pointer hover:bg-gray-100 sm:flex-1">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
              {error && <Error message={error} />}
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;
