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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/modules/shared/components/ui/Form";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shared/components/ui/Popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/modules/shared/components/ui/Command";
import { cn } from "@/modules/shared/lib/utils";

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
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
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
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel>Country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full cursor-pointer justify-between text-left font-normal"
                        >
                          {field.value ? countries.all.find((c) => c.name === field.value)?.name : "Select country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-(--radix-popover-trigger-width) bg-white p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList className="max-h-64">
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.all.map((country) => (
                              <CommandItem
                                className="cursor-pointer hover:bg-gray-100"
                                key={country.name}
                                value={country.name.toLowerCase()}
                                onSelect={() => {
                                  form.setValue("country", country.name, { shouldValidate: true });
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country.name === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex items-center gap-2">
                                  <span>{country.emoji}</span>
                                  <span>{country.name}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
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
                        <SelectValue placeholder="Select your role" />
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
    </Dialog>
  );
};

export default ProfileDialog;
