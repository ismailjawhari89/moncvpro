import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <input
        type="checkbox"
        ref={ref}
        className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
            className
        )}
        {...props}
    />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
