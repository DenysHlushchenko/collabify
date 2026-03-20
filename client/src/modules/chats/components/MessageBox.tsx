import { useAuthStore } from "@/modules/auth/store/userStore";
import User from "@/modules/shared/components/User";
import { convertToDateString } from "@/modules/shared/lib";
import { cn } from "@/modules/shared/lib/utils";
import type { MessagesType } from "@/modules/shared/types/types";
import { useRef, useState, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useMessageReaction } from "../hooks/useMessageReaction";
import { useParams } from "react-router-dom";
import { Button } from "@/modules/shared/components/ui/Button";

interface MessageBoxProps {
  data: MessagesType;
}

const MessageBox = ({ data }: MessageBoxProps) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { chatId } = useParams();
  const { react } = useMessageReaction(Number(chatId));
  const user = useAuthStore().getUser();
  const isOwn = user?.id === data.sender.id;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    react(data.id, emojiData.emoji);
    setShowReactionPicker(false);
  };

  // Calculate picker position to avoid overflow
  useEffect(() => {
    if (showReactionPicker && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 10;
      const PICKER_HEIGHT = 350;

      // Position above or below depending on available space
      const top = spaceBelow < PICKER_HEIGHT ? rect.top - PICKER_HEIGHT - 10 : rect.bottom + 10;

      setPickerPosition({
        top: Math.max(10, top),
        left: rect.left + (isOwn ? rect.width - 300 : 0),
      });
    }
  }, [showReactionPicker, isOwn]);

  const container = cn("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = cn(isOwn && "order-2");
  const body = cn("flex flex-col gap-2", isOwn && "items-end");
  const message = cn(
    "text-sm py-2 px-3 w-fit overflow-hidden rounded-lg",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100"
  );

  // Group reactions by emoji
  const reactionGroups = (data.reactions ?? []).reduce<Record<string, { count: number; usernames: string[] }>>(
    (acc, r) => {
      if (!acc[r.reaction]) acc[r.reaction] = { count: 0, usernames: [] };
      acc[r.reaction].count++;
      acc[r.reaction].usernames.push(r.user.username);
      return acc;
    },
    {}
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <User
          userId={data.sender.id}
          username={data.sender.username}
          className="flex-center bg-[#D9D9D9] text-gray-500"
        />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.username}</div>
          <div className="text-xs text-gray-400">{convertToDateString(data.created_at)}</div>
        </div>

        <div
          className="relative flex items-center gap-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowReactionPicker(false);
          }}
          onTouchStart={(e) => e.preventDefault()}
        >
          {isOwn && (
            <button
              ref={buttonRef}
              onClick={() => setShowReactionPicker((prev) => !prev)}
              aria-label="Add reaction"
              className={cn(
                "cursor-pointer rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <SmilePlus size={16} />
            </button>
          )}

          <div className={message}>
            <p>{data.message}</p>
          </div>

          {!isOwn && (
            <button
              ref={buttonRef}
              onClick={() => setShowReactionPicker((prev) => !prev)}
              aria-label="Add reaction"
              className={cn(
                "cursor-pointer rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <SmilePlus size={16} />
            </button>
          )}

          {showReactionPicker && (
            <div
              ref={pickerRef}
              className="fixed z-50"
              style={{
                top: `${pickerPosition.top}px`,
                left: `${Math.max(10, Math.min(pickerPosition.left, window.innerWidth - 310))}px`,
                pointerEvents: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                height={350}
                width={300}
                searchDisabled
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>

        {Object.keys(reactionGroups).length > 0 && (
          <div className={cn("flex flex-wrap gap-1", isOwn && "justify-end")}>
            {Object.entries(reactionGroups).map(([emoji, { count, usernames }]) => {
              const hasReacted = (data.reactions ?? []).some((r) => r.reaction === emoji && r.user.id === user?.id);
              return (
                <Button
                  key={emoji}
                  onClick={() => react(data.id, hasReacted ? "" : emoji)}
                  title={usernames.join(", ")}
                  aria-label={`React with ${emoji}`}
                  className="flex cursor-pointer items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-xs transition hover:bg-gray-100"
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="text-gray-500">{count}</span>}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
