import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  let base =
    "px-6 py-3 rounded-full font-semibold transition-transform shadow-md hover:scale-105";

  let variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]",
    secondary:
      "bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]",
    destructive:
      "bg-transparent border border-red-500/40 text-red-400 hover:bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    outline:
      "bg-transparent border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.4)]",
    

  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
