import { usePostForm } from "../hooks/usePostForm";
import { Form } from "@/modules/shared/components/ui/Form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/Dialog";
import { FormField, FormItem, FormLabel, FormControl } from "@/modules/shared/components/ui/Form";
import { Input } from "@/modules/shared/components/ui/Input";
import { Textarea } from "@/modules/shared/components/ui/Textarea";
import { Button } from "@/modules/shared/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/Select";
import PostTag from "./PostTag";
import { usePost } from "../hooks/usePost";
import { useAuthStore } from "@/modules/auth/store/userStore";
import type { Control } from "react-hook-form";
import type { CreatePostInput, CreatePostOutput } from "@/modules/shared/lib/validators";
import type { PostType } from "@/modules/shared/types/types";

const MAX_TAGS = 3;

interface Props {
  open: boolean;
  dialog: (open: boolean) => void;
  onSubmit: (values: CreatePostOutput & { tags: string[] }) => void;
  post: PostType;
  mode: "edit" | "create";
}

export default function PostDialogContent({ open, dialog, post, onSubmit, mode = "edit" }: Props) {
  const user = useAuthStore().getUser();

  const { form, tags, addTag, removeTag } = usePostForm({
    mode,
    defaultValues: {
      title: post.title,
      description: post.description,
      groupSize: String(post.groupSize),
      tags: post.postTags?.map((t) => t.tag.name),
      tagInput: "",
      chatTitle: "",
      chatId: "",
    },
  });

  const control = form.control as unknown as Control<CreatePostInput>;
  const { useChatsQuery } = usePost();
  const { data: chats, isPending: chatsPending, isError: chatsError } = useChatsQuery(user?.id, mode === "edit");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        dialog(false);
        if (!open) form.reset();
      }}
    >
      <DialogContent className="border-none bg-white [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Post" : "Create Post"}</DialogTitle>
          <DialogDescription className="body-light my-3">
            {mode === "edit" ? "Update your post details below." : "Fill out the form to create a new post."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your title..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add your post description..." className="min-h-30 resize-none" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="groupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Size</FormLabel>
                  <FormControl>
                    <Input type="number" min={2} max={10} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="tagInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (max {MAX_TAGS})</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={tags.length >= MAX_TAGS}
                      placeholder="Type tag and press Enter..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && field.value?.trim()) {
                          e.preventDefault();
                          addTag(field.value.trim());
                          field.onChange("");
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <PostTag key={tag} isDeletable label={tag} removeTag={() => removeTag(tag)} />
              ))}
            </div>

            {mode === "edit" && (
              <>
                <FormField
                  control={control}
                  name="chatTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Create a new chat</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Add your chat title..." />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {chats && chats.length > 0 && (
                  <FormField
                    control={control}
                    name="chatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select an existing chat</FormLabel>
                        <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v === "none" ? "" : v)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={chatsPending ? "Loading..." : chatsError ? "Error" : "Select chat"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Chats</SelectLabel>
                              <SelectItem value="none">None</SelectItem>
                              {chats.map((chat) => (
                                <SelectItem key={chat.id} value={String(chat.id)}>
                                  {chat.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <DialogFooter className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="background-blue cursor-pointer border text-white hover:bg-[#226abb] sm:flex-1"
              >
                {mode === "edit" ? "Save Changes" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  dialog(false);
                  form.reset();
                }}
                className="cursor-pointer hover:bg-gray-100 sm:flex-1"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
