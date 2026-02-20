import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { FormSchemaType, PropType } from "../types/types";
import { FormControl, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/Form";
import Error from "@/modules/shared/components/Error";

interface PostFormFieldProps {
  form: UseFormReturn<FormSchemaType>;
  name: PropType;
  formLabel: string;
  children: (field: ControllerRenderProps<FormSchemaType, PropType>) => React.ReactNode;
}

const DialogField = (props: PostFormFieldProps) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{props.formLabel}</FormLabel>
          <FormControl>{props.children(field)}</FormControl>
          {fieldState.error && <Error message={fieldState.error.message} />}
        </FormItem>
      )}
    />
  );
};

export default DialogField;
