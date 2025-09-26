// components/ui/inputs/NumberInput.jsx
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function NumberInput({
  name,
  label,
  placeholder,
  min,
  max,
  step = 1,
  value,
  onChange,
  error: externalError,
  rules = {},
  required = false,
}) {
  const inputId = useId();

  // Try to get form context, but handle case where it doesn't exist
  const formContext = useFormContext();

  // If we have form context, use react-hook-form
  if (formContext) {
    const { control } = formContext;
    const {
      field,
      fieldState: { error },
    } = useController({
      name,
      control,
      rules: {
        valueAsNumber: true, // This ensures the value is converted to a number
        ...rules,
      },
    });

    return (
      <div>
        <label
          className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
          htmlFor={inputId}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={inputId}
          type="number"
          {...field}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          max={max}
          min={min}
          placeholder={placeholder}
          step={step}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }

  // Fallback to regular input when no form context
  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor={inputId}
      >
        {label} {required && "*"}
      </label>
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        id={inputId}
        max={max}
        min={min}
        name={name}
        placeholder={placeholder}
        step={step}
        type="number"
        value={value || ""}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      {externalError && (
        <p className="text-red-500 text-sm mt-1">{externalError}</p>
      )}
    </div>
  );
}
