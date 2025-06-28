import React from "react"
import { cn } from "@/lib/utils"

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, className, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        "ml-1 peer-[.header-fixed]/header:mt-22",
        "flex-1 px-4 pt-6",
        fixed && "fixed-main flex flex-grow flex-col overflow-hidden",

        // "max-w-full w-full ml-auto",
        // "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-8rem)]",
        // "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width)+20rem))]",
        // "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width)-2rem))]",
        "transition-[width] duration-200 ease-linear",
        className
      )}
      {...props}
    />
  )
}

Main.displayName = "Main"
