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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/Select";
import type { ChatType } from "@/modules/shared/types/types";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import { Input } from "@/modules/shared/components/ui/Input";
import { Textarea } from "@/modules/shared/components/ui/Textarea";
import { Button } from "@/modules/shared/components/ui/Button";
import { PostSchema, type CreatePostInput, type CreatePostOutput } from "@/modules/shared/lib/validators";
import Error from "@/modules/shared/components/Error";
import { type Control } from "react-hook-form";
import z from "zod";
import PostTag from "./PostTag";
import { usePostForm } from "../hooks/usePostForm";
import { usePost } from "@/modules/posts/hooks/usePost";

const MAX_TAGS = 3;

interface PostDialogProps {
  submitPost: (values: CreatePostOutput & { tags: string[] }) => void;
}

const CreatePostDialog = ({ submitPost }: PostDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = useAuthStore().getUser();

  const { form, tags, addTag, removeTag } = usePostForm({ mode: "create" });

  const { useChatsQuery } = usePost();
  const { data: chats, isPending, isError } = useChatsQuery(user?.id, true);

  const control = form.control as unknown as Control<CreatePostInput>;

  const onSubmit = (values: z.output<typeof PostSchema>) => {
    submitPost(values);
    setDialogOpen(false);
    form.reset();
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) form.reset();
      }}
    >
      <Form {...form}>
        <DialogTrigger asChild>
          <Button className="small-medium flex w-30 cursor-pointer rounded-md bg-[#e8edf3] px-4 py-3 text-center text-black hover:bg-[#f2f6fa]">
            Create
          </Button>
        </DialogTrigger>

        <DialogContent className="border-none bg-white [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle>Add New Post</DialogTitle>
            <DialogDescription className="body-light my-3">
              Fill out the form below to create a new post.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5 py-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your title..." type="text" {...field} />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="textarea-message"
                      placeholder="Add your post description..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="groupSize"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Group Size</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group size" type="number" min={2} max={10} {...field} />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="tagInput"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={tags.length >= MAX_TAGS}
                      type="text"
                      placeholder="Add tags..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && field.value) {
                          e.preventDefault();
                          addTag(field.value as string);
                          field.onChange("");
                        }
                      }}
                    />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            <div className="flex gap-1">
              {tags.map((tag) => (
                <PostTag key={tag} isDeletable label={tag} removeTag={removeTag} />
              ))}
            </div>

            <FormField
              control={control}
              name="tags"
              render={({ fieldState }) => <>{fieldState.error && <Error message={fieldState.error.message} />}</>}
            />

            <FormField
              control={control}
              name="chatTitle"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Create a new chat</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Add your chat title..." />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            {chats && chats.length > 0 && (
              <FormField
                control={control}
                name="chatId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Select an existing chat</FormLabel>

                    <Select
                      value={field.value ?? ""}
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue
                            placeholder={
                              isPending
                                ? "Loading..."
                                : isError
                                  ? "Error while fetching chats."
                                  : "Select an available chat"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectLabel className="bg-gray-200">Chats</SelectLabel>

                          <SelectItem value="none" className="cursor-pointer hover:bg-gray-100">
                            None
                          </SelectItem>

                          {chats?.map((chat: ChatType) => (
                            <SelectItem
                              key={chat.id}
                              value={String(chat.id)}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              {chat.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
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
                Create
              </Button>

              <DialogClose asChild>
                <Button
                  onClick={() => form.reset()}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 sm:flex-1"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default CreatePostDialog;
