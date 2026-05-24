import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

export interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger?: "hover" | "click";
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  showArrow?: boolean;
  className?: string;
  contentClassName?: string;
  offset?: number;
}

function Popover({
  children,
  content,
  trigger = "hover",
  side = "bottom",
  align = "center",
  showArrow = true,
  className,
  contentClassName,
  offset = 8,
}: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleOpen = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setIsOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  const handleToggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Compute position
  const [position, setPosition] = React.useState<React.CSSProperties>({});

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (side) {
      case "top":
        top = triggerRect.top - popoverRect.height - offset;
        break;
      case "bottom":
        top = triggerRect.bottom + offset;
        break;
      case "left":
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case "right":
        left = triggerRect.right + offset;
        break;
    }

    switch (align) {
      case "start":
        if (side === "top" || side === "bottom") {
          left = triggerRect.left;
        } else {
          top = triggerRect.top;
        }
        break;
      case "center":
        if (side === "top" || side === "bottom") {
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        } else {
          top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        }
        break;
      case "end":
        if (side === "top" || side === "bottom") {
          left = triggerRect.right - popoverRect.width;
        } else {
          top = triggerRect.bottom - popoverRect.height;
        }
        break;
    }

    setPosition({ top, left });
  }, [side, align, offset]);

  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  // Close on outside click (for click mode)
  React.useEffect(() => {
    if (trigger !== "click" || !isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [trigger, isOpen]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const arrowClasses = {
    top: "bottom-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-card",
    bottom: "top-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-card",
    left: "right-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-card",
    right: "left-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-card",
  };

  const triggerProps =
    trigger === "hover"
      ? {
          onMouseEnter: handleOpen,
          onMouseLeave: handleClose,
        }
      : {
          onClick: handleToggle,
        };

  const popoverHoverProps =
    trigger === "hover"
      ? {
          onMouseEnter: handleOpen,
          onMouseLeave: handleClose,
        }
      : {};

  return (
    <div className={cn("inline-block", className)} ref={triggerRef} {...triggerProps}>
      {children}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className={cn(
              "fixed z-50 rounded-md border bg-card shadow-md",
              contentClassName
            )}
            style={position}
            {...popoverHoverProps}
          >
            {showArrow && (
              <div
                className={cn(
                  "absolute h-0 w-0 border-4",
                  arrowClasses[side]
                )}
              />
            )}
            <div className="p-3">{content}</div>
          </div>,
          document.body
        )}
    </div>
  );
}

export { Popover };
