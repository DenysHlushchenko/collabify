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
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shared/components/ui/Popover";
import { Check, ChevronsUpDown, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/modules/shared/components/ui/Command";
import { cn } from "@/modules/shared/lib/utils";
import { useIsMobile } from "@/modules/shared/hooks/useIsMobile";

type StepField = keyof z.infer<typeof RegisterSchema>;

const STEPS: { field: StepField; label: string }[] = [
  { field: "username", label: "Username" },
  { field: "country", label: "Country" },
  { field: "gender", label: "Gender" },
  { field: "role", label: "Role" },
  { field: "email", label: "Email" },
  { field: "password", label: "Password" },
];

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      navigate("/user-guide");
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

  const handleNext = async () => {
    const fieldName = STEPS[currentStep].field;
    const isValid = await form.trigger(fieldName);
    if (isValid) {
      const nextStep = Math.min(currentStep + 1, STEPS.length - 1);
      form.clearErrors(STEPS[nextStep].field);
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Shared field renderers
  const renderUsernameField = () => (
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
  );

  const renderCountryField = () => (
    <FormField
      control={form.control}
      name="country"
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col gap-1.5">
          <FormLabel>Country</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-label="Select country"
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
                          className={cn("mr-2 h-4 w-4", country.name === field.value ? "opacity-100" : "opacity-0")}
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
          {fieldState.error && <Error message={fieldState.error.message} />}
        </FormItem>
      )}
    />
  );

  const renderGenderField = () => (
    <FormField
      control={form.control}
      name="gender"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Gender</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full cursor-pointer">
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
  );

  const renderRoleField = () => (
    <FormField
      control={form.control}
      name="role"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full cursor-pointer">
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
  );

  const renderEmailField = () => (
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
  );

  const renderPasswordField = () => (
    <FormField
      control={form.control}
      name="password"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Input placeholder="Enter your password..." {...field} type={showPassword ? "text" : "password"} />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormControl>
          {fieldState.error && <Error message={fieldState.error.message} />}
        </FormItem>
      )}
    />
  );

  const renderMobileCountryField = () => (
    <FormField
      control={form.control}
      name="country"
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col gap-1.5">
          <FormLabel>Country</FormLabel>
          {field.value && (
            <div className="flex items-center gap-2 rounded-md border border-black/10 bg-gray-50 px-3 py-2 text-sm">
              <span>{countries.all.find((c) => c.name === field.value)?.emoji}</span>
              <span className="font-medium">{field.value}</span>
              <button
                type="button"
                aria-label="Clear selected country"
                className="ml-auto text-gray-400 hover:text-gray-600"
                onClick={() => form.setValue("country", "", { shouldValidate: true })}
              >
                ✕
              </button>
            </div>
          )}
          <Command className="rounded-md border">
            <CommandInput placeholder="Search country..." />
            <CommandList className="max-h-48">
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
                    <Check className={cn("mr-2 h-4 w-4", country.name === field.value ? "opacity-100" : "opacity-0")} />
                    <div className="flex items-center gap-2">
                      <span>{country.emoji}</span>
                      <span>{country.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {fieldState.error && <Error message={fieldState.error.message} />}
        </FormItem>
      )}
    />
  );

  const fieldRenderers: Record<StepField, () => React.JSX.Element> = {
    username: renderUsernameField,
    country: isMobile ? renderMobileCountryField : renderCountryField,
    gender: renderGenderField,
    role: renderRoleField,
    email: renderEmailField,
    password: renderPasswordField,
  };

  // Step indicator for module
  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-center gap-2">
      {STEPS.map((step, index) => (
        <div key={step.field} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
              index < currentStep
                ? "bg-black text-white"
                : index === currentStep
                  ? "scale-110 bg-black text-white ring-4 ring-black/20"
                  : "bg-gray-200 text-gray-500"
            )}
          >
            {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn("h-0.5 w-4 transition-all duration-300", index < currentStep ? "bg-black" : "bg-gray-200")}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Mobile stepper layout
  const renderMobileLayout = () => {
    const isLastStep = currentStep === STEPS.length - 1;
    const currentStepData = STEPS[currentStep];

    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4">
        <div className="w-full max-w-md space-y-5">
          <div className="space-y-2 text-center">
            <h3 className="h2-bold">Create an account</h3>
            <p className="text-sm text-gray-500">
              Step {currentStep + 1} of {STEPS.length} — {currentStepData.label}
            </p>
          </div>

          {renderStepIndicator()}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <div key={currentStepData.field} className="min-h-15">
                {fieldRenderers[currentStepData.field]()}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" className="flex-1 cursor-pointer" onClick={handleBack}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                )}

                {isLastStep ? (
                  <Button
                    className="flex-1 cursor-pointer bg-black text-white disabled:cursor-not-allowed"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Registering..." : "Register"}
                  </Button>
                ) : (
                  <Button type="button" className="flex-1 cursor-pointer bg-black text-white" onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>

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

  // Desktop layout
  const renderDesktopLayout = () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-lg space-y-5 p-6">
        <div className="space-y-2 text-center">
          <h3 className="h2-bold">Create an account</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
            {renderUsernameField()}
            {renderCountryField()}
            {renderGenderField()}
            {renderRoleField()}
            {renderEmailField()}
            {renderPasswordField()}
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

  return isMobile ? renderMobileLayout() : renderDesktopLayout();
};

export default Register;
