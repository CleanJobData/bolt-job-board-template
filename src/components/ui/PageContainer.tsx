import * as React from "react";
import { cn } from "../../lib/utils";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-3xl",
  lg: "max-w-4xl",
  full: "",
} as const;

export type PageContainerSize = keyof typeof sizeClasses;

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: PageContainerSize;
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("container mx-auto px-4 py-12", sizeClasses[size], className)}
      {...props}
    />
  )
);
PageContainer.displayName = "PageContainer";

export { PageContainer };
