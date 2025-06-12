import React from "react";

interface ButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  icon,
  children,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center px-2 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" ${className}`}
    >
      {icon && (
        <span className={children ? "mr-2" : ""}>
            {icon}
        </span>
      )}

      {children}
    </button>
  );
};

export default Button;
