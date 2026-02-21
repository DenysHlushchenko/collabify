import type { ReactNode } from "react";
import { Controller, type Control, type ControllerRenderProps, type FieldPath } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import Error from "@/modules/shared/components/Error";
import type { PostFormInput, PostFormOutput } from "@/modules/shared/lib/validators";

type Name = FieldPath<PostFormInput>;

interface DialogFieldProps {
  control: Control<PostFormInput, unknown, PostFormOutput>;
  name: Name;
  formLabel: string;
  children: (field: ControllerRenderProps<PostFormInput, Name>) => ReactNode;
}

const DialogField = ({ control, name, formLabel, children }: DialogFieldProps) => {
  return (
    <Controller<PostFormInput, Name, PostFormOutput>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>{children(field)}</FormControl>
          {fieldState.error && <Error message={fieldState.error.message} />}
        </FormItem>
      )}
    />
  );
};

export default DialogField;
