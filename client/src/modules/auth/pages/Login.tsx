import { LoginSchema } from "@/modules/shared/lib/validators";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/user";
import type { AxiosError } from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import { Input } from "@/modules/shared/components/ui/Input";
import { Button } from "@/modules/shared/components/ui/Button";
import Error from "@/modules/shared/components/Error";
import { useAuthStore } from "../store/userStore";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      useAuthStore.getState().login(data.accessToken);
      navigate("/");
    },

    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      setError(backendError);
      console.error("Login failed:", error);
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    mutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-lg space-y-5 p-6">
        <div className="space-y-2 text-center">
          <h3 className="h2-bold">Login to account</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
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
              {mutation.isPending ? "Loging in..." : "Log in"}
            </Button>
            <p className="paragraph-regular text-center">
              Do not have an account?{" "}
              <span
                className="text-blue cursor-pointer font-medium hover:underline hover:transition"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
            {error && <Error message={error} />}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
