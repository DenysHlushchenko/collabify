import type { PostType } from "@/modules/shared/types/types";
import Post from "@/modules/posts/components/Post";
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
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema } from "@/modules/shared/lib/validators";
import { Input } from "@/modules/shared/components/ui/Input";
import Error from "@/modules/shared/components/Error";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { Field, FieldDescription } from "@/modules/shared/components/ui/field";

const UserPosts = ({ posts }: { posts: PostType[] }) => {
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      description: "",
      groupSize: 2,
      tags: "",
    },
  });

  return (
    <div>
      <Dialog>
        <Form {...form}>
          <form>
            <DialogTrigger asChild>
              <Button
                onClick={() => {}}
                className="small-medium background-blue mb-6 min-h-8 w-20 cursor-pointer rounded-lg px-4 py-3 text-white shadow-none"
              >
                Create
              </Button>
            </DialogTrigger>

            <DialogContent className="border-none bg-white sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add New Post</DialogTitle>
              </DialogHeader>

              <DialogDescription className="flex flex-col gap-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your title..." {...field} type="text" />
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
                        <Field>
                          <FieldDescription className="small-medium text-gray-400">Describe your post</FieldDescription>
                          <Textarea
                            id="textarea-message"
                            placeholder="Add your post description..."
                            {...field}
                            className="max-h-37.5"
                          />
                        </Field>
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
                      <FormLabel>Group Size (from 2 to 10 people)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter group size" {...field} type="text" />
                      </FormControl>
                      {fieldState.error && <Error message={fieldState.error.message} />}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Add tags..." {...field} type="text" />
                      </FormControl>
                      {fieldState.error && <Error message={fieldState.error.message} />}
                    </FormItem>
                  )}
                />
              </DialogDescription>

              <DialogFooter className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button type="submit" className="background-blue w-full cursor-pointer border text-white sm:flex-1">
                  Create
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" className="w-full cursor-pointer sm:flex-1">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </form>
        </Form>
      </Dialog>

      {posts.length !== 0 ? (
        posts.map((post: PostType) => <Post key={post.id} post={post} />)
      ) : (
        <h1 className="text-center text-sm">No posts yet!</h1>
      )}
    </div>
  );
};

export default UserPosts;
