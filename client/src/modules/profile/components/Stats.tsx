import { Separator } from "@/modules/shared/components/ui/Separator";
import { formatAndDivideNumber } from "@/modules/shared/lib";
import type { BadgeCounts } from "@/modules/shared/types/types";
import goldMedal from "@/assets/gold-medal.svg";
import silverMedal from "@/assets/silver-medal.svg";
import bronzeMedal from "@/assets/bronze-medal.svg";

interface BadgeStageProps {
  imageUrl: string;
  value: number;
  title: string;
}

const BadgeStage = ({ imageUrl, value, title }: BadgeStageProps) => {
  return (
    <div className="shadow-light-300 flex flex-wrap items-center justify-center gap-4 rounded-md border border-gray-300 bg-gray-100 p-6">
      <img src={imageUrl} alt="badge status" width={40} height={40} />
      <div className="flex flex-col items-center text-center">
        <p className="paragraph-semibold">{formatAndDivideNumber(value)}</p>
        <p className="body-medium">{title}</p>
      </div>
    </div>
  );
};

interface StatsProp {
  badges: BadgeCounts;
}

const Stats = ({ badges }: StatsProp) => {
  return (
    <div className="mt-10">
      <Separator className="border-gray my-5" />
      <h4 className="h3-semibold">Stats</h4>
      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
        <BadgeStage imageUrl={goldMedal} value={badges.GOLD} title="Gold Badges" />
        <BadgeStage imageUrl={silverMedal} value={badges.SILVER} title="Silver Badges" />
        <BadgeStage imageUrl={bronzeMedal} value={badges.BRONZE} title="Bronze Badges" />
      </div>
    </div>
  );
};

export default Stats;
//    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-center gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200"></div>
