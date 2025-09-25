import { Check } from "lucide-react";
import { Button } from "./Button";

export default function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isClickable = stepNumber <= currentStep && onStepClick;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                } ${isClickable ? "cursor-pointer hover:scale-105" : ""}`}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    stepNumber < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Navigation component for stepper
export function StepperNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isLoading = false,
  canGoNext = true,
  nextButtonText = "Lanjut",
  submitButtonText = "Simpan",
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
      >
        Sebelumnya
      </Button>

      <div className="text-sm text-gray-500">
        Langkah {currentStep} dari {totalSteps}
      </div>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canGoNext}
          isLoading={isLoading}
          loadingText="Menyimpan..."
        >
          {submitButtonText}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext || isLoading}
        >
          {nextButtonText}
        </Button>
      )}
    </div>
  );
}

// Step content wrapper
export function StepContent({ children, stepId, className = "" }) {
  // This component should be used within the context of a parent that provides currentStep
  // For now, we'll render all children and let the parent handle step visibility
  return <div className={`py-6 ${className}`}>{children}</div>;
}
