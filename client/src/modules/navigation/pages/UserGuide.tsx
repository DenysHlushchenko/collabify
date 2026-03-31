import { useState } from "react";
import { Stepper } from "@/modules/shared/components/ui/Stepper";
import { Button } from "@/modules/shared/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { guideSteps } from "../constants/guideSteps";

const UserGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen flex-col overflow-y-auto bg-linear-to-br to-indigo-100 px-3 py-6 md:justify-center md:px-4 md:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-3 space-y-1 text-center md:mb-2">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Welcome to Collabify!</h1>
          <p className="text-xs text-gray-600 md:text-xs">
            Let's get you started with a quick guide to the essential features
          </p>
        </div>

        <div className="space-y-2 md:space-y-3">
          <div className="flex flex-col items-start justify-between rounded-sm bg-white p-4 shadow-md md:flex-row md:items-center md:p-6">
            <Stepper steps={guideSteps} currentStep={currentStep} onStepClick={setCurrentStep} />
            <button
              onClick={handleComplete}
              className="mx-auto mt-1 cursor-pointer px-2 text-xs text-gray-500 hover:text-gray-700 hover:underline md:mt-0 md:ml-auto md:text-sm"
            >
              Skip
            </button>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-md md:p-4">
            <p className="text-center text-lg font-semibold">{guideSteps[currentStep].title}</p>
            <p className="text-center text-sm text-gray-600">{guideSteps[currentStep].description}</p>

            <div className="mt-4 md:h-100 md:w-250">
              <img
                className="md:mx-auto md:h-100"
                src={guideSteps[currentStep].gif}
                alt={guideSteps[currentStep].title}
              />
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="cursor-pointer text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              Previous
            </Button>

            <div className="text-center text-xs text-gray-600 md:text-sm">
              Step {currentStep + 1}/{guideSteps.length}
            </div>

            {currentStep === guideSteps.length - 1 ? (
              <Button
                onClick={handleComplete}
                className="background-blue cursor-pointer text-xs text-white hover:bg-blue-700 md:text-sm"
              >
                Continue to Login
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="background-blue cursor-pointer text-xs text-white hover:bg-blue-700 md:text-sm"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
