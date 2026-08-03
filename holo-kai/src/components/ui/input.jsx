import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, id, name, placeholder, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const inputName = name || id || (placeholder ? placeholder.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'input_field');

  return (
    (<input
      type={type}
      id={inputId}
      name={inputName}
      placeholder={placeholder}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
