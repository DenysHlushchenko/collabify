import FeedbackDialog from "./FeedbackDialog";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createFeedback, getFeedbacks } from "../api/feedback";
import type { AxiosError } from "axios";
import type { FeedbackFormValues } from "@/modules/shared/types/types";
import Error from "@/modules/shared/components/Error";
import Feedback from "./Feedback";
import FeedbacksSkeleton from "./FeedbacksSkeleton";

const Feedbacks = () => {
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore().getUser(); // sender
  const { userId } = useParams(); // receiver
  const queryClient = useQueryClient();

  const {
    data: feedbacks,
    isPending,
    isPlaceholderData,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["feedbacks", userId],
    queryFn: () => getFeedbacks(Number(userId)),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });

  const mutation = useMutation({
    mutationFn: createFeedback,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["feedbacks", userId] });
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },

    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      setError(backendError);
      console.error("Post creation failed: ", error);
    },
  });

  const handleCreateFeedback = (values: FeedbackFormValues) => {
    if (!user) return;

    mutation.mutate({
      ...values,
      senderId: user.id,
      receiverId: Number(userId),
    });
  };

  if (isPending && !isPlaceholderData) return <FeedbacksSkeleton />;

  if (isError) <Error message={`${fetchError.message}: There are currently no feedbacks available.`} />;
  return (
    <div>
      <h2 className="h2-bold mb-5 text-center">Feedbacks</h2>
      {user?.id !== Number(userId) && (
        <div className="mb-7 flex justify-end">
          <FeedbackDialog submitFeedback={handleCreateFeedback} error={error} isSubmitting={mutation.isPending} />
        </div>
      )}
      {feedbacks?.length !== 0 ? (
        feedbacks?.map((feedback) => <Feedback key={feedback.id} feedback={feedback} />)
      ) : (
        <h1 className="pt-10 text-center text-sm">No feedbacks yet!</h1>
      )}
    </div>
  );
};

export default Feedbacks;
