import { useAuthStore } from "@/modules/auth/store/userStore";
import User from "@/modules/shared/components/User";
import type { UserType } from "@/modules/shared/types/types";
import ProfileLink from "../components/ProfileLink";
import calendar from "@/assets/calendar.svg";
import location from "@/assets/location.svg";
import rank from "@/assets/rank.svg";
import dayjs from "dayjs";
import { Separator } from "@/modules/shared/components/ui/Separator";
import Stats from "../components/Stats";

const user: UserType = {
  id: "usr_9f3a7c21b6e4",
  username: "codeNomad42",
  country: "Germany",
  gender: "male",
  role: "moderator",
  bio: "Passionate coder and avid traveler. Exploring the world one line of code at a time. Always eager to learn and share knowledge with fellow developers.",
  activityReputation: 842,
  feedbackReputation: 91,
  email: "codenomad42@example.com",
  createdAt: new Date("2024-03-15T10:24:00Z"),
  updatedAt: new Date("2026-02-20T18:42:00Z"),
};

const badges = {
  GOLD: 5,
  SILVER: 12,
  BRONZE: 30,
};

const UserProfile = () => {
  const { getUser } = useAuthStore();
  const id = getUser()?.id;
  console.log(id);

  return (
    <>
      <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-6">
          <User
            username={user?.username}
            className="h-24 w-24 shrink-0 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
            fallbackClassName="text-3xl"
          />

          <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-5">
            <h2 className="h2-bold whitespace-nowrap">@{user.username}</h2>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:justify-start">
              <ProfileLink imgUrl={location} title={user.country} />
              <ProfileLink imgUrl={calendar} title={dayjs(user.createdAt).format("MMMM YYYY")} />
              <ProfileLink imgUrl={rank} title={user.feedbackReputation} />
            </div>

            {user.bio && (
              <p className="paragraph-regular mt-2 max-w-2xl text-center lg:mt-4 lg:text-left">{user.bio}</p>
            )}
          </div>
        </div>

        <div className="flex w-full justify-end max-sm:mb-4 sm:mt-2 sm:w-auto">Edit</div>
      </div>

      <Stats badges={badges} />

      <div className="mt-10">
        <Separator className="border-gray my-5" />
        <h2 className="h2-bold text-center">Feedback</h2>
      </div>
    </>
  );
};

export default UserProfile;
