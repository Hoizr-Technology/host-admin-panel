import { cn } from "@/lib/utils";

const DataTableDateTimeCell = ({
  value,
  className,
}: {
  value: Date;
  className?: string;
}) => {
  return value === null ? (
    <p className="text-white text-sm font-medium whitespace-nowrap">N/A</p>
  ) : (
    <p
      className={cn(
        "text-white text-sm font-medium whitespace-nowrap",
        className
      )}
    >
      {value.toLocaleString()}
    </p>
  );
};

export default DataTableDateTimeCell;
