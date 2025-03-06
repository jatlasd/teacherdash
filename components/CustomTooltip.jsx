import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  
const CustomTooltip = ({ children, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="w-64 bg-[#aea3d9] text-white rounded-md border border-primary-300 shadow-xl">
          {typeof content === 'string' ? (
            <p className="font-medium">{content}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {content}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CustomTooltip