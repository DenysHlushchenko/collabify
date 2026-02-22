import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/user";

import { Input } from "@/modules/shared/components/ui/Input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import { RegisterSchema } from "@/modules/shared/lib/validators";
import { Button } from "@/modules/shared/components/ui/Button";
import { genders, roles } from "@/modules/shared/components/constants/links";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/Select";
import { useState } from "react";
import Error from "@/modules/shared/components/Error";
import { countries } from "country-data-list";

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      country: "",
      gender: "",
      role: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      setError(backendError);
      console.error("Registration failed:", error);
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    mutation.mutate({
      username: values.username,
      country: values.country,
      gender: values.gender,
      role: values.role,
      email: values.email,
      password: values.password,
    });
  }
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-lg space-y-5 p-6">
        <div className="space-y-2 text-center">
          <h3 className="h2-bold">Create an account</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username..." {...field} type="text" />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="bg-white">
                      {countries.all.map((country) => (
                        <SelectItem
                          key={country.name}
                          value={country.name}
                          className="flex cursor-pointer items-center gap-3 hover:bg-gray-100"
                        >
                          <p>{country.emoji}</p>
                          <span>{country.name}</span>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email..." {...field} type="email" />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password..." {...field} type="password" />
                  </FormControl>
                  {fieldState.error && <Error message={fieldState.error.message} />}
                </FormItem>
              )}
            />
            <Button
              className="w-full cursor-pointer bg-black text-white disabled:cursor-not-allowed"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registering..." : "Register"}
            </Button>
            <p className="paragraph-regular text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue cursor-pointer font-medium hover:underline">
                Log in
              </Link>
            </p>
            {error && <Error message={error} />}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
