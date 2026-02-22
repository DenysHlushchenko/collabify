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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProfileSchema } from "@/modules/shared/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "../hooks/useCurrentUser";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import { Button } from "@/modules/shared/components/ui/Button";
import { Input } from "@/modules/shared/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/Select";
import { countries } from "country-data-list";
import { Textarea } from "@/modules/shared/components/ui/Textarea";
import { genders, roles } from "@/modules/shared/components/constants/links";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateUser } from "../api/user";
import Error from "@/modules/shared/components/Error";

interface ProfileDialogProps {
  userId: number;
}

const ProfileDialog = ({ userId }: ProfileDialogProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser(userId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: currentUser?.user.username,
      gender: currentUser?.user.gender,
      role: currentUser?.user.role,
      country: currentUser?.user.country.name,
      bio: currentUser?.user.bio || "",
    },
  });

  const reset = () => {
    form.reset();
    form.clearErrors();
  };

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof ProfileSchema>) => {
      return updateUser(Number(currentUser?.user.id), {
        username: values.username,
        gender: values.gender,
        role: values.role,
        country: values.country,
        bio: values.bio,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setDialogOpen(false);
      reset();
    },

    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      setError(backendError);
      console.error("User update failed: ", error);
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setError(null);
    mutation.mutate(values);
  }

  useEffect(() => {
    if (dialogOpen && currentUser) {
      form.reset({
        username: currentUser.user.username,
        gender: currentUser.user.gender,
        role: currentUser.user.role,
        country: currentUser.user.country?.name,
        bio: currentUser.user.bio ?? "",
      });
      form.clearErrors();
    }
  }, [dialogOpen, currentUser, form]);
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) reset();
      }}
    >
      <Form {...form}>
        <DialogTrigger asChild>
          <Button className="small-medium flex w-30 cursor-pointer rounded-md bg-[#e8edf3] px-4 py-3 text-center text-black hover:bg-[#f2f6fa]">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="border-none bg-white [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription className="body-light my-3">
              Fill out the form below to edit your profile information.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-5 py-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {countries.all.map((c) => (
                          <SelectItem key={c.name} value={c.name} className="cursor-pointer hover:bg-gray-100">
                            {c.emoji} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="bg-white">
                        {genders.map((gender) => (
                          <SelectItem key={gender} value={gender} className="cursor-pointer hover:bg-gray-100">
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {roles.map((role) => (
                          <SelectItem key={role} value={role} className="cursor-pointer hover:bg-gray-100">
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell something about yourself..."
                        className="resize-none"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    {fieldState.error && <Error message={fieldState.error.message} />}
                  </FormItem>
                )}
              />

              <DialogFooter className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button
                  type="submit"
                  className="background-blue cursor-pointer border text-white hover:bg-[#226abb] sm:flex-1"
                >
                  Save changes
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
      </Form>
    </Dialog>
  );
};

export default ProfileDialog;
