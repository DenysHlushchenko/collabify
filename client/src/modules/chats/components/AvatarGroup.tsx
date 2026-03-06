import User from "@/modules/shared/components/User";
import { cn } from "@/modules/shared/lib/utils";
import type { ChatMemberType } from "@/modules/shared/types/types";

interface AvatarGroupProps {
  users: ChatMemberType[];
}

const AvatarGroup = ({ users }: AvatarGroupProps) => {
  const slicedUsers = users.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={cn(
            "absolute inline-block h-5.25 w-5.25 overflow-hidden rounded-full",
            positionMap[index as keyof typeof positionMap]
          )}
        >
          <User
            userId={user.user.id}
            username={user.user.username}
            className="flex-center size-full bg-[#D9D9D9] text-gray-500"
            fallbackClassName="text-[10px]"
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
