import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", disabled, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm text-gray-700 mb-1">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            border rounded-lg w-full p-2
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
