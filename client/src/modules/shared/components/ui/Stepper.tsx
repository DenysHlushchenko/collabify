import React from "react";
import { cn } from "@/modules/shared/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string | number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, onStepClick, orientation = "horizontal", className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full",
          orientation === "vertical"
            ? "flex-col gap-8"
            : "hidden flex-col items-center gap-2 md:flex md:flex-row md:gap-4",
          className
        )}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                orientation === "vertical"
                  ? "flex flex-col items-start gap-2"
                  : "flex w-full items-center gap-1 md:w-auto md:flex-1 md:gap-2"
              )}
            >
              <div className="flex w-full items-center gap-2">
                <button
                  onClick={() => onStepClick?.(index)}
                  disabled={index > currentStep}
                  className={cn(
                    "relative h-8 w-8 rounded-full border-2 text-xs font-semibold transition-all duration-200 md:h-10 md:w-10 md:text-sm",
                    "flex shrink-0 items-center justify-center",
                    isCompleted && "background-blue text-white hover:bg-blue-700",
                    isCurrent && "background-blue text-white",
                    !isCompleted && !isCurrent && "border-gray-300 bg-gray-100 text-gray-600",
                    index > currentStep && "cursor-not-allowed opacity-50"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                </button>

                {orientation === "horizontal" && index < steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden h-1 flex-1 rounded-full transition-colors duration-200 md:block",
                      isCompleted ? "background-blue" : "bg-gray-300"
                    )}
                  />
                )}
              </div>

              {orientation === "vertical" && (
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-semibold transition-colors duration-200 md:text-sm",
                      isCurrent || isCompleted ? "text-gray-900" : "text-gray-600"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p
                      className={cn("text-xs md:text-sm", isCurrent || isCompleted ? "text-gray-600" : "text-gray-500")}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              )}

              {orientation === "vertical" && index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-8 w-1 rounded-full transition-colors duration-200",
                    isCompleted ? "background-blue" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = "Stepper";
