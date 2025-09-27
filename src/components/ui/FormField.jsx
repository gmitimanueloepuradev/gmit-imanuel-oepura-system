// components/ui/FormField.jsx
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function FormField({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
  error: externalError,
  className = "",
  ...props
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
    } = useController({ name, control });

    return (
      <div className="form-control w-full mb-4">
        {label && (
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor={inputId}
          >
            {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          {...field}
          className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
            error ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500" : ""
          } ${className}`}
          placeholder={placeholder}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>
        )}
      </div>
    );
  }

  // Fallback to regular input when no form context
  return (
    <div className="form-control w-full mb-4">
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          htmlFor={inputId}
        >
          {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
          externalError ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500" : ""
        } ${className}`}
        id={inputId}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {externalError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{externalError}</p>
      )}
    </div>
  );
}