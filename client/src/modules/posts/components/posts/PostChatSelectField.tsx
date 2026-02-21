import type { ChatType } from "@/modules/shared/types/types";
import type { Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/Select";
import DialogField from "../DialogField";
import type { PostFormInput, PostFormOutput } from "@/modules/shared/lib/validators";

interface ChatSelectFieldProps {
  control: Control<PostFormInput, unknown, PostFormOutput>;
  chats?: ChatType[] | null;
  isPending: boolean;
  isError: boolean;
}

const PostChatSelectField = ({ control, chats, isPending, isError }: ChatSelectFieldProps) => {
  return (
    <DialogField control={control} name="chatId" formLabel="Select an existing chat">
      {(field) => (
        <Select value={field.value ?? ""} onValueChange={(value) => field.onChange(value === "none" ? "" : value)}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue
              placeholder={
                isPending ? "Loading..." : isError ? "Error while fetching chats." : "Select an available chat"
              }
            />
          </SelectTrigger>

          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel className="bg-gray-200">Chats</SelectLabel>
              <SelectItem value="none" className="cursor-pointer hover:bg-gray-100">
                None
              </SelectItem>
              {chats?.map((chat: ChatType) => (
                <SelectItem key={chat.id} value={String(chat.id)} className="cursor-pointer hover:bg-gray-100">
                  {chat.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </DialogField>
  );
};

export default PostChatSelectField;
