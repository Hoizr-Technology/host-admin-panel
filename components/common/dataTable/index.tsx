import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterDataEnum, SortDataEnum } from "@/generated/graphql";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { FaSort } from "react-icons/fa";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import DataTableInfiniteFooter from "./infinite";
import DataTablePagination from "./pagination";
import DataTableToolbar from "./toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalRows: number;
  hideDownloadButton?: boolean;
  loading: boolean;
  manualPagination: boolean;
  pageSize: number;
  pageSizeChangeHandler?: (size: number) => void;
  staticTable?: boolean;
  pageCount?: number;
  nextPage?: () => void;
  prevPage?: () => void;
  paginationData?: PaginationState;
  addClickHandler?: () => void;
  downloadClickHandler?: (selectedIds?: string[]) => Promise<void>;
  downloadFileName?: string;
  downloadLoading?: boolean;
  defaultSortColumn?: string;
  filterClickHandler?: (data: {
    key?: string;
    filterFn?: FilterDataEnum;
    value?: string | string[];
  }) => Promise<void>;
  hideSearch?: boolean;
  searchFilter?: string;
  setSearchFilter?: (value: string) => void;

  sortData?: SortingState;
  sortClickHandler?: (data: {
    key?: string;
    sortType?: SortDataEnum;
  }) => Promise<void>;

  cursorPagination?: boolean;
  hasMore?: boolean;
  loadMore?: (lastRow: string) => void;
  showDateRange?: boolean;
  dateRangeCompareAllowed?: boolean;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  totalRows,
  loading,
  manualPagination,
  pageSize,
  pageSizeChangeHandler,
  pageCount,
  paginationData,
  nextPage,
  prevPage,
  addClickHandler,
  downloadClickHandler,
  downloadFileName,
  downloadLoading,
  filterClickHandler,
  hideSearch = false,
  searchFilter,
  setSearchFilter,
  sortClickHandler,
  hideDownloadButton = false,
  cursorPagination = false,
  hasMore = false,
  staticTable = false,
  loadMore,
  defaultSortColumn,
  showDateRange = false,
  dateRangeCompareAllowed = false,
}: DataTableProps<TData, TValue>) => {
  const [tableData, setTableData] = useState<TData[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const tableMeta = useMemo(() => {
    return {
      updateData: (rowIndex: number, columnId: string, value: TData) =>
        setTableData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    };
  }, []);

  const table = useReactTable(
    manualPagination
      ? {
          data: tableData,
          columns,
          getCoreRowModel: getCoreRowModel(),
          manualPagination: true,
          manualFiltering: true,
          manualSorting: true,
          pageCount: pageCount,
          state: { pagination: paginationData },
          getRowId: (row) => {
            return (row as any).id;
          },
          meta: tableMeta,
        }
      : {
          data: tableData,
          columns,
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getSortedRowModel: getSortedRowModel(),
          initialState: {
            pagination: { pageIndex: 0, pageSize: pageSize },
            sorting: defaultSortColumn
              ? [{ id: defaultSortColumn, desc: true }]
              : [],
          },
          meta: tableMeta,
        }
  );

  return (
    <div className=" text-white rounded-xl max-h-full flex flex-col justify-between ">
      {/* Toolbar */}

      {!staticTable && (
        <DataTableToolbar<TData>
          table={table}
          hideSearch={hideSearch}
          hideDownloadButton={hideDownloadButton}
          manual={manualPagination}
          fileName={downloadFileName}
          downloadLoading={downloadLoading}
          addClickHandler={addClickHandler}
          downloadClickHandler={downloadClickHandler}
          filterClickHandler={filterClickHandler}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          showDateRange={showDateRange}
          dateRangeCompareAllowed={dateRangeCompareAllowed}
        />
      )}
      {/* <DataTableToolbar<TData>
        table={table}
        hideDownloadButton={hideDownloadButton}
        manual={manualPagination}
        fileName={downloadFileName}
        downloadLoading={downloadLoading}
        addClickHandler={addClickHandler}
        downloadClickHandler={downloadClickHandler}
        filterClickHandler={filterClickHandler}
      /> */}

      {/* Table */}
      <div className="w-full flex-1 overflow-y-auto bg-tbbg rounded-t-xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`group hover:cursor-pointer whitespace-nowrap !text-white ${
                        header.id === "actions" ? "text-center" : ""
                      }`}
                      onClick={(e) => {
                        if (header.column.getCanSort()) {
                          const handler =
                            header.column.getToggleSortingHandler();
                          if (handler) {
                            handler(e);
                          }

                          if (manualPagination && sortClickHandler) {
                            sortClickHandler({
                              key: header.column.id,
                              sortType:
                                {
                                  asc: SortDataEnum.Asc,
                                  desc: SortDataEnum.Desc,
                                }[
                                  header.column.getNextSortingOrder() as string
                                ] ?? SortDataEnum.None,
                            });
                          }
                        }
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.isPlaceholder
                        ? null
                        : header.column.getCanSort()
                        ? {
                            asc: <FaArrowUp className="inline-block ml-2" />,
                            desc: <FaArrowDown className="inline-block ml-2" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <FaSort className="inline-block ml-2" />
                          )
                        : null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {loading ? (
            <>
              <TableBody>
                {[1, 2, 3, 4, 5].map((e) => (
                  <TableRow key={e}>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[40px] text-center"
                    >
                      <Skeleton className="h-[40px] w-full rounded-xl" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Footer / Pagination Controls */}

      {!staticTable && (
        <div className="bg-tbbg rounded-b-xl">
          {cursorPagination ? (
            <DataTableInfiniteFooter<TData>
              hasMore={hasMore}
              table={table}
              loadMoreHandler={loadMore}
            />
          ) : (
            <DataTablePagination<TData>
              table={table}
              manual={manualPagination}
              totalRows={totalRows}
              pageSizeChangeHandler={pageSizeChangeHandler}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
