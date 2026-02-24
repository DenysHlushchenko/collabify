import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/Avatar";
import { Card, CardDescription, CardHeader } from "@/modules/shared/components/ui/Card";
import { Separator } from "@/modules/shared/components/ui/Separator";
import type { FeedbackType } from "@/modules/shared/types/types";
import { convertNameToInitial, convertToDateString } from "@/modules/shared/utils/utils";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface FeedbackProps {
  feedback: FeedbackType;
}

const Feedback = ({ feedback }: FeedbackProps) => {
  return (
    <>
      <Card className="border-gray">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Link to={`/profile/${feedback.sender.id}`}>
              <Avatar className="flex-center bg-[#D9D9D9] text-gray-500">
                <AvatarFallback>{convertNameToInitial(feedback.sender.username)}</AvatarFallback>
              </Avatar>
            </Link>

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
