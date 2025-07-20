import { Table } from "@tanstack/react-table";
// import Select from "react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationButton from "./buttons";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  manual: boolean;
  totalRows: number;
  pageSizeChangeHandler?: (size: number) => void;
  nextPage?: () => void;
  prevPage?: () => void;
}

const DataTablePagination = <TData,>(
  props: DataTablePaginationProps<TData>
) => {
  const { table, totalRows, pageSizeChangeHandler, prevPage, nextPage } = props;

  return (
    <div className="flex items-center justify-between px-4 py-2 w-full ">
      <p className="font-normal text-xs text-opacity-80">
        {nextPage ? (
          <>
            {Object.keys(table.getState().rowSelection).length} of {totalRows}{" "}
          </>
        ) : (
          <>
            {table.getSelectedRowModel().rows.length} of {table.getRowCount()}{" "}
          </>
        )}
        row(s) selected
      </p>
      <div className="flex justify-center items-center space-x-5">
        <div className="ml-1 md:ml-1 space-y-2 md:space-y-0 flex items-start md:items-center md:space-x-2 flex-col md:flex-row ">
          <p className="text-xs font-normal">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              if (pageSizeChangeHandler) {
                pageSizeChangeHandler(Number(value));
              }
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center items-center space-x-3 text-xs">
          <PaginationButton
            type="prev"
            clickHandler={() => {
              if (prevPage) {
                prevPage();
              } else {
                table.previousPage();
              }
            }}
            disabled={!table.getCanPreviousPage()}
          />
          <p className="mx-2 text-nowrap">
            {table.getPageCount() > 0 ? (
              <>
                {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </>
            ) : (
              "0 / 0"
            )}
          </p>
          <PaginationButton
            type="next"
            clickHandler={() => {
              if (nextPage) {
                nextPage();
              } else {
                table.nextPage();
              }
            }}
            disabled={!table.getCanNextPage()}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
