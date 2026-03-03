import { Card, CardDescription, CardHeader } from "@/modules/shared/components/ui/Card";
import { Separator } from "@/modules/shared/components/ui/Separator";
import User from "@/modules/shared/components/User";
import { convertToDateString } from "@/modules/shared/lib";
import type { FeedbackType } from "@/modules/shared/types/types";
import { Star } from "lucide-react";

interface FeedbackProps {
  feedback: FeedbackType;
}

const Feedback = ({ feedback }: FeedbackProps) => {
  return (
    <>
      <Card className="border-gray">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User
              userId={feedback.sender.id}
              username={feedback.sender.username}
              className="flex-center bg-[#D9D9D9] text-gray-500"
            />

            <div className="flex flex-col">
              <p className="text-base leading-none font-medium">c/{feedback.sender.username}</p>
              <span className="text-muted-foreground text-xs">{convertToDateString(feedback.created_at)}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={15}
                className={i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}
              />
            ))}
            <span className="text-foreground ml-1.5 text-xs font-medium md:text-sm">{feedback.rating}/5</span>
          </div>

          <CardDescription className="text-foreground/90 mt-3 text-xs leading-relaxed md:text-sm">
            {feedback.message}
          </CardDescription>
        </CardHeader>
      </Card>
      <Separator className="border-gray my-5" />
    </>
  );
};

export default Feedback;
