import User from "@/modules/shared/components/User";
import ProfileLink from "../components/ProfileLink";
import calendar from "@/assets/calendar.svg";
import location from "@/assets/location.svg";
import rank from "@/assets/rank.svg";
import role from "@/assets/role.svg";
import dayjs from "dayjs";
import { Separator } from "@/modules/shared/components/ui/Separator";
import Stats from "../components/Stats";
import Error from "@/modules/shared/components/Error";
import { useCurrentUser } from "../hooks/useCurrentUser";
import UserProfileSkeleton from "../components/UserProfileSkeleton";
import ProfileDialog from "../components/ProfileDialog";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/userStore";
import Feedbacks from "@/modules/feedback/components/Feedbacks";
import { Avatar } from "@/modules/shared/components/ui/Avatar";
import { cn } from "@/modules/shared/lib/utils";
import { useSocket } from "@/modules/socket/context/SocketContext";

const UserProfile = () => {
  const { userId } = useParams();
  const { activeUsersIds } = useSocket();
  const { getUser } = useAuthStore();
  const loggedInUserId = getUser()?.id;
  const { isPending, isPlaceholderData, isError, data: currentUser, error } = useCurrentUser(Number(userId));
  if (isPending && !isPlaceholderData) return <UserProfileSkeleton />;

  if (isError) return <Error message={error.message} />;

  const isUserActive = activeUsersIds.some((id) => id === Number(userId));

  return (
    <>
      <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-6">
          <User
            userId={Number(userId)}
            username={currentUser.user.username}
            className="h-24 w-24 shrink-0 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
            fallbackClassName="text-3xl bg-[#6395CD] text-white"
          />

          <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-5">
            <div className="flex-center gap-x-3">
              <h2 className="h2-bold whitespace-nowrap">
                @{currentUser.user.username} <span className="text-sm text-gray-700">({currentUser.user.gender})</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:justify-start">
              <ProfileLink imgUrl={location} title={currentUser.user.country.name} />
              <ProfileLink imgUrl={calendar} title={dayjs(currentUser.user.createdAt).format("MMMM YYYY")} />
              <ProfileLink imgUrl={rank} title={currentUser.user.reputation} />
              <ProfileLink imgUrl={role} title={currentUser.user.role} />
            </div>

            <div
              className={cn(
                "flex-center gap-x-2 rounded-xl border px-1.5",
                isUserActive ? "border-green-500" : "border-red-500"
              )}
            >
              <Avatar className={cn("h-1 w-1 rounded-full", isUserActive ? "bg-green-500" : "bg-red-500")} />
              <span className={cn(isUserActive ? "text-green-500" : "text-red-500", "small-medium")}>
                {isUserActive ? "Online" : "Disconnected"}
              </span>
            </div>

            {currentUser.user.bio && (
              <p className="paragraph-regular mt-2 max-w-2xl text-center lg:mt-4 lg:text-left">
                {currentUser.user.bio}
              </p>
            )}
          </div>
        </div>

        {loggedInUserId === Number(userId) && (
          <div className="flex w-full justify-end max-sm:mb-4 sm:mt-2 sm:w-auto">
            <ProfileDialog userId={Number(userId)} />
          </div>
        )}
      </div>

      <Stats badges={currentUser.badgeCounts} />

      <div className="mt-10">
        <Separator className="border-gray my-5" />
        <Feedbacks />
      </div>
    </>
  );
};

export default UserProfile;
