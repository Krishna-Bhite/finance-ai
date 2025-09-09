import * as React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl p-6 backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_0_25px_rgba(6,182,212,0.15)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <h2
      className={`text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
};

export const CardContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className = "", ...props }) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
