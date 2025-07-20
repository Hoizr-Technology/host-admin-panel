import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useGlobalStore from "@/store/global";
import { MdCopyAll } from "react-icons/md";

interface DataTableTextCellProps {
  value?: string | null;
  className?: string;
  isPrice?: boolean;
  onClick?: () => void; // Add optional onClick prop
  isClickable?: boolean; // Optional flag to style as clickable
}

const DataTableTextCell = ({
  value,
  className,
  isPrice = false,
  onClick,
  isClickable = false, // Default to false
}: DataTableTextCellProps) => {
  const { setToastData } = useGlobalStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onClick) {
      onClick();
    }
  };

  if (!value) {
    return (
      <p
        className={cn(
          "group flex items-center text-white text-sm font-medium whitespace-nowrap",
          className,
          {
            "cursor-pointer": isClickable,
          }
        )}
      >
        <span>N/A</span>
      </p>
    );
  }
  if (value.length > 30) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p
              className={cn(
                "group flex items-center text-white text-sm font-medium whitespace-nowrap",
                className,
                {
                  "cursor-pointer": isClickable,
                }
              )}
              onClick={handleClick}
            >
              <span>{value.slice(0, 30) + " ..."}</span>
              <MdCopyAll
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(value || "");
                  setToastData({
                    message: "Successfully copied to the clipboard",
                    type: "success",
                  });
                }}
                size={15}
                className="inline-block opacity-0 group-hover:opacity-100 hover:text-primary ml-2 cursor-pointer"
              />
            </p>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white max-w-xs break-words">
            {value}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <p
      className={cn(
        "group flex items-center text-white text-sm font-medium whitespace-nowrap",
        className,
        {
          "cursor-pointer": isClickable,
        }
      )}
      onClick={handleClick}
    >
      {isPrice ? <span>$ {value}</span> : <span>{value}</span>}
      <MdCopyAll
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(value || "");
          setToastData({
            message: "Successfully copied to the clipboard",
            type: "success",
          });
        }}
        size={15}
        className="inline-block opacity-0 group-hover:opacity-100 hover:text-primary ml-2 cursor-pointer"
      />
    </p>
  );
};

export default DataTableTextCell;
