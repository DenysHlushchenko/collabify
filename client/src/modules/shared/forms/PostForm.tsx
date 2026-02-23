import { useForm, type ControllerRenderProps } from "react-hook-form";
import { PostSchema } from "../lib/validators";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import { Button } from "../components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../components/ui/Form";
import { Input } from "../components/ui/Input";
import Error from "../components/Error";
import { getAllChatsByUserId } from "@/modules/chats/api/chat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import type { EditPostFormValues, PostFormValues, PostType } from "../types/types";
import { Badge } from "../components/ui/Badge";
import close from "@/assets/close.svg";

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

  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: () => (user ? getAllChatsByUserId(user.id) : null),
    staleTime: 1000 * 10,
    retry: 2,
  });

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: postDetails?.title || "",
      description: postDetails?.description || "",
      groupSize: postDetails?.groupSize || 2,
      tags: postDetails?.postTags?.map((pt) => pt.tag.name) || [],
      chatTitle: "",
      chatId: undefined,
    },
  });

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
        if (!field.value.includes(tagValue as never)) {
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
        <Button className="small-medium flex w-30 cursor-pointer rounded-md bg-[#e8edf3] px-4 py-3 text-center text-black hover:bg-[#f2f6fa]">
          {type === "create" ? "Create Post" : "Edit Post"}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-white [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle>{type === "create" ? "Create a new post" : "Edit your post"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
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
                    <Input placeholder="Post description..." {...field} />
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
                    <>
                      <Input
                        disabled={type === "edit" || field.value.length >= 3}
                        className="no-focus paragraph-regular border disabled:cursor-not-allowed disabled:bg-gray-100"
                        placeholder={field.value.length >= 3 ? "Maximum 3 tags reached" : "Add tags..."}
                        onKeyDown={(e) => handleInputKeyDown(e, field)}
                      />

                      {field.value.length > 0 && (
                        <div className="flex-start mt-2.5 gap-2.5">
                          {field.value.map((tag: string) => (
                            <Badge
                              key={tag}
                              className="subtle-medium flex items-center justify-center gap-2 rounded-md border-none bg-[#ececec] px-4 py-2 capitalize"
                              onClick={() => (type !== "edit" ? handleRemoveTag(tag, field) : () => {})}
                            >
                              {tag}
                              {type !== "edit" && (
                                <img
                                  src={close}
                                  width={12}
                                  height={12}
                                  alt="Close icon"
                                  className="cursor-pointer object-contain invert-0"
                                />
                              )}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </>
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
                className="background-blue cursor-pointer border text-white hover:bg-[#226abb] sm:flex-1"
              >
                {isSubmitting
                  ? type === "create"
                    ? "Creating..."
                    : "Editing..."
                  : type === "create"
                    ? "Create"
                    : "Edit"}
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

export default PostForm;
