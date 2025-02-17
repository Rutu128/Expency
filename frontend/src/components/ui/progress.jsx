import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-gray-100",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-300",
        { 
          "bg-transparent": value === 0,
          "bg-gradient-to-r from-red-500 to-red-600": value > 0 && value <= 25,
          "bg-gradient-to-r from-orange-400 to-orange-500": value > 25 && value <= 50,
          "bg-gradient-to-r from-yellow-400 to-yellow-500": value > 50 && value <= 75,
          "bg-gradient-to-r from-green-400 to-green-500": value > 75,
        }
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }