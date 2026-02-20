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
import type { FormSchemaType } from "../../types/types";
import { getAllChatsByUserId } from "@/modules/chats/api/chat";
import { usePostForm } from "../../hooks/usePostForm";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useState } from "react";
import type { PostFormType } from "@/modules/shared/types/types";
import { Form } from "@/modules/shared/components/ui/Form";
import DialogField from "../DialogField";
import { Input } from "@/modules/shared/components/ui/Input";
import { Textarea } from "@/modules/shared/components/ui/Textarea";
import TagInput from "../tags/TagInput";
import PostChatSelectField from "./PostChatSelectField";
import Error from "@/modules/shared/components/Error";
import { Button } from "@/modules/shared/components/ui/Button";

interface PostDialogProps {
  submitPost: (values: Omit<PostFormType, "userId">) => void;
  error: string | null;
}

const PostDialog = ({ submitPost, error }: PostDialogProps) => {
  const user = useAuthStore().getUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { form, tags, addTag, removeTag, reset, MAX_TAGS } = usePostForm();

  const {
    data: chats,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => (user ? getAllChatsByUserId(user.id) : null),
    enabled: !!user,
    staleTime: 1000 * 10,
    retry: 2,
  });

  const onSubmit = (values: FormSchemaType) => {
    submitPost({ ...values, tags });
    setDialogOpen(false);
    reset();
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Post</DialogTitle>
            </DialogHeader>

            <DialogDescription className="body-light my-3">
              Fill out the form below to create a new post.
            </DialogDescription>

            <div className="flex flex-col gap-y-5">
              <DialogField form={form} name="title" formLabel="Title">
                {(field) => <Input {...field} placeholder="Enter your title..." type="text" />}
              </DialogField>

              <DialogField form={form} name="description" formLabel="Description">
                {(field) => <Textarea id="textarea-message" placeholder="Add your post description..." {...field} />}
              </DialogField>

              <DialogField form={form} name="groupSize" formLabel="Group Size">
                {(field) => <Input placeholder="Enter group size" {...field} type="number" min={2} max={10} />}
              </DialogField>

              <TagInput form={form} tags={tags} addTag={addTag} removeTag={removeTag} maxTags={MAX_TAGS} />

              <DialogField form={form} name="chatTitle" formLabel="Create a new chat">
                {(field) => <Input {...field} type="text" />}
              </DialogField>

              {chats && chats.length > 0 && (
                <PostChatSelectField form={form} chats={chats} isPending={isPending} isError={isError} />
              )}
            </div>

            <DialogFooter className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button
                type="submit"
                className="background-blue cursor-pointer border text-white hover:bg-[#226abb] sm:flex-1"
              >
                Create
              </Button>
              <DialogClose asChild>
                <Button onClick={reset} variant="outline" className="cursor-pointer hover:bg-gray-100 sm:flex-1">
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
