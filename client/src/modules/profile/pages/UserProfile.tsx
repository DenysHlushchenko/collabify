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

const UserProfile = () => {
  const { isPending, isError, data: currentUser, error } = useCurrentUser();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) return <Error message={error.message} />;

  return (
    <>
      <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-6">
          <User
            username={currentUser.user.username}
            className="h-24 w-24 shrink-0 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
            fallbackClassName="text-3xl"
          />

          <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-5">
            <h2 className="h2-bold whitespace-nowrap">@{currentUser.user.username}</h2>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:justify-start">
              <ProfileLink imgUrl={location} title={currentUser.user.country.name} />
              <ProfileLink imgUrl={calendar} title={dayjs(currentUser.user.createdAt).format("MMMM YYYY")} />
              <ProfileLink imgUrl={rank} title={currentUser.user.reputation} />
              <ProfileLink imgUrl={role} title={currentUser.user.role} />
            </div>

            {currentUser.user.bio && (
              <p className="paragraph-regular mt-2 max-w-2xl text-center lg:mt-4 lg:text-left">
                {currentUser.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full justify-end max-sm:mb-4 sm:mt-2 sm:w-auto">Edit</div>
      </div>

      <Stats badges={currentUser.badgeCounts} />

      <div className="mt-10">
        <Separator className="border-gray my-5" />
        <h2 className="h2-bold text-center">Feedback</h2>
      </div>
    </>
  );
};

export default UserProfile;
