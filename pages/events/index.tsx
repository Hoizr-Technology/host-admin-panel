import MainLayout from "@/components/layouts/mainBodyLayout";
import DataTable from "@/components/common/dataTable";
import DataTableDateTimeCell from "@/components/common/dataTable/common/dateTimeCell";
import DataTableNumberCell from "@/components/common/dataTable/common/numberCell";
import DataTableTextCell from "@/components/common/dataTable/common/textCell";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EventStatus,
  ProfileStatus,
  RowsPerPageEnum,
  FilterDataEnum,
  FilterDataInput,
  SortDataEnum,
  SortDataInput,
  Event,
} from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import { redirectPathFromStatus } from "@/utils/functions/redirectPathFromStatus";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  getPageSizeNumber,
  getPageSizeEnum,
} from "@/utils/functions/common";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const EventsDashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { setToastData, setSelectedSideBarMenu } = useGlobalStore();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    revenue: 0,
    avgApplications: 0,
  });

  const [events, setEvents] = useState<any[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);

  // Table Pagination States
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<RowsPerPageEnum>(
    RowsPerPageEnum.Ten
  );

  // Table Filter States
  const [filterData, setFilterData] = useState<{
    key?: string;
    filterFn?: FilterDataEnum;
    value?: string | string[];
  }>();
  const [searchFilter, setSearchFilter] = useState<string>();

  // Table Sorting States
  const [sortData, setSortData] = useState<{
    key?: string;
    sortType?: SortDataEnum;
  }>();

  // Table Download States
  const downloadFileName = useMemo(() => "EventsData", []);
  const [downloadBtnLoading, setDownloadBtnLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let filterInput: FilterDataInput | null = null;
        let sortInput: SortDataInput | null = null;

        if (
          filterData &&
          filterData.key &&
          filterData.value &&
          filterData.filterFn
        ) {
          filterInput = {
            key: filterData.key,
            operation: filterData.filterFn,
          };

          if (Array.isArray(filterData.value)) {
            filterInput.valueArr = filterData.value as string[];
          } else {
            filterInput.value = filterData.value.toString();
          }
        }

        if (sortData && sortData.key && sortData.sortType) {
          sortInput = {
            key: sortData.key,
            sortType: sortData.sortType,
          };
        }

        const response = await sdk.getAllEventsHost({
          search: searchFilter || "",
          sort: sortInput,
          filter: filterInput ? [filterInput] : [],
          page: {
            pageNumber: pageIndex,
            rowsPerPage: pageSize,
          },
        });

        if (response.getAllEventsHost) {
          setEvents(response.getAllEventsHost.items || []);
          setTotalEvents(response.getAllEventsHost.total || 0);

          // Calculate stats
          const pendingCount = response.getAllEventsHost.items.filter(
            (e: any) => e.status === EventStatus.Draft
          ).length;

          const totalRevenue = response.getAllEventsHost.items.reduce(
            (sum: number, event: any) => sum + (event.budget?.min || 0),
            0
          );

          const totalApplications = response.getAllEventsHost.items.reduce(
            (sum: number, event: any) => sum + (event.djsApplied || 0),
            0
          );

          const avgApplications =
            response.getAllEventsHost.items.length > 0
              ? totalApplications / response.getAllEventsHost.items.length
              : 0;

          setStats({
            total: response.getAllEventsHost.total,
            pending: pendingCount,
            revenue: totalRevenue,
            avgApplications,
          });
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    setSelectedSideBarMenu("Events");
    fetchEvents();
  }, [
    setToastData,
    setSelectedSideBarMenu,
    pageIndex,
    pageSize,
    filterData,
    sortData,
    searchFilter,
  ]);

  const handleCreateEvent = async () => {
    try {
      const response = await sdk.createEvent();
      if (response.createEvent) {
        router.push(
          `/event-update/basic-info?eventId=${response.createEvent}&edit=false`
        );
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/event-update/basic-info?eventId=${eventId}&edit=true`);
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  // Format status for display
  const formatEventStatus = (status: EventStatus) => {
    switch (status) {
      case EventStatus.Draft:
        return "Draft";
      case EventStatus.Active:
        return "Published";
      case EventStatus.Cancelled:
        return "Cancelled";
      case EventStatus.Completed:
        return "Completed";
      default:
        return status;
    }
  };

  const columnHelper = createColumnHelper<Event>();

  const columns: ColumnDef<Event, any>[] = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Event Title",
        enableColumnFilter: true,
        filterFn: "auto",
        enableSorting: true,
        cell: ({ row }) => <DataTableTextCell value={row.original.title} />,
      }),

      columnHelper.accessor("budget.min", {
        header: "Budget (Min)",
        enableColumnFilter: false,
        filterFn: "auto",
        enableSorting: true,
        cell: ({ row }) => (
          <DataTableNumberCell
            value={row.original.budget?.min}
            isPrice={true}
          />
        ),
      }),
      columnHelper.accessor("budget.max", {
        header: "Budget (Max)",
        enableColumnFilter: false,
        filterFn: "auto",
        enableSorting: true,
        cell: ({ row }) => (
          <DataTableNumberCell
            value={row.original.budget?.max}
            isPrice={true}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        enableColumnFilter: true,
        filterFn: "auto",
        enableSorting: true,
        cell: ({ row }) => (
          <DataTableTextCell
            value={formatEventStatus(row.original.status ?? EventStatus.Draft)}
          />
        ),
      }),

      columnHelper.accessor("genresPreferred", {
        header: "Genres",
        enableColumnFilter: false,
        filterFn: "auto",
        enableSorting: false,
        cell: ({ row }) => (
          <DataTableTextCell
            value={row.original.genresPreferred?.join(", ") || "N/A"}
          />
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <TooltipProvider>
              <div className="flex space-x-2 justify-center items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Eye
                      className="text-primary text-lg cursor-pointer"
                      onClick={() => handleViewEvent(row.original._id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white max-w-xs">
                    <p>View event details</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Edit
                      className="text-primary text-lg cursor-pointer"
                      onClick={() => handleEditEvent(row.original._id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white max-w-xs">
                    <p>Edit event</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          );
        },
      }),
    ],
    [columnHelper]
  );

  const handleCsvDownload = async (selectedIds?: string[]) => {
    // setDownloadBtnLoading(true);
    // try {
    //   const response = await sdk.eventsHostCsvExport({
    //     input: {
    //       fileName: "eventsData",
    //       selectedRows: selectedIds,
    //     },
    //   });
    //   if (!response.eventsHostCsvExport) {
    //     setToastData({
    //       message:
    //         "Something went wrong while exporting your data. Please try again later!",
    //       type: "error",
    //     });
    //     return;
    //   }
    //   window.open(response.eventsHostCsvExport, "_blank", "noreferrer");
    // } catch (error) {
    //   const errorMessage = extractErrorMessage(error);
    //   setToastData({
    //     type: "error",
    //     message: errorMessage,
    //   });
    // } finally {
    //   setDownloadBtnLoading(false);
    // }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Events Dashboard</h1>
          <p className="text-white/85 mt-1">
            {stats.total} Total Events | {stats.pending} Pending Applications |
            ${(stats.revenue / 1000).toFixed(1)}K Revenue
          </p>
        </div>
        <CButton variant={ButtonType.Primary} onClick={handleCreateEvent}>
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Event
          </div>
        </CButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-secondaryBg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary">Total Events</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-primary p-3 rounded-full">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Avg. Applications */}
        <div className="bg-secondaryBg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary">Avg. Applications</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(stats.avgApplications)}
              </p>
            </div>
            <div className="bg-primary p-3 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Booking Rate */}
        <div className="bg-secondaryBg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary">Booking Rate</p>
              <p className="text-2xl font-bold text-white">N/A</p>
            </div>
            <div className="bg-primary p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-secondaryBg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary">Revenue (90 Days)</p>
              <p className="text-2xl font-bold text-white">
                ${(stats.revenue / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="bg-primary p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Events DataTable */}
      <div className="" style={{ height: "calc(100vh - 400px)" }}>
        {events.length > 0 ||
        filterData !== undefined ||
        sortData !== undefined ||
        (searchFilter ?? "") !== "" ? (
          <DataTable
            totalRows={totalEvents}
            columns={columns}
            data={events}
            loading={loading}
            addClickHandler={handleCreateEvent}
            manualPagination={true}
            pageSize={getPageSizeNumber(pageSize)}
            pageCount={Math.ceil(totalEvents / getPageSizeNumber(pageSize))}
            nextPage={() => {
              const totalPages = Math.ceil(
                totalEvents / getPageSizeNumber(pageSize)
              );
              if (pageIndex < totalPages) {
                setPageIndex((prev) => prev + 1);
              }
            }}
            prevPage={() => {
              if (pageIndex > 1) {
                setPageIndex((prev) => prev - 1);
              }
            }}
            paginationData={{
              pageIndex: pageIndex - 1, // tanstack table considers index to start from 0
              pageSize: getPageSizeNumber(pageSize),
            }}
            pageSizeChangeHandler={(size) => {
              setPageIndex(1);
              setPageSize(getPageSizeEnum(size));
            }}
            downloadClickHandler={async (selectedIds) => {
              handleCsvDownload(selectedIds);
            }}
            downloadFileName={downloadFileName}
            downloadLoading={downloadBtnLoading}
            filterClickHandler={async (data) => {
              setPageIndex(1);
              setSearchFilter(undefined);
              setFilterData(data);
            }}
            sortClickHandler={async (data) => {
              setSortData(data);
            }}
            setSearchFilter={(e) => {
              setPageIndex(1);
              setFilterData(undefined);
              setSearchFilter(e);
            }}
          />
        ) : (
          <div className="bg-secondaryBg text-white rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] space-y-4 border border-gray-300 shadow-sm">
            <div className="text-base font-light text-blackBg whitespace-pre-wrap text-center">
              {"No events found,\nstart by creating your first event."}
            </div>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex justify-between items-center space-x-2 text-sm"
            >
              <Plus size={15} />
              <span>{"Create Event"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

EventsDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default EventsDashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie ?? "";
  const tokenExists = cookieHeader.includes("accessToken=");

  if (!tokenExists) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await sdk.meCheckHost(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    const { status } = response.meHost;
    const redirectUrl = redirectPathFromStatus(status ?? ProfileStatus.Blocked);
    if (status === ProfileStatus.Active) {
      return {
        props: {},
      };
    }
    return redirectUrl;
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
