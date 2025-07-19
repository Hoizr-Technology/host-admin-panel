import MainLayout from "@/components/layouts/mainBodyLayout";
import {
  EventStatus,
  ProfileStatus,
  RowsPerPageEnum,
} from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserStore from "@/store/user";
import { redirectPathFromStatus } from "@/utils/functions/redirectPathFromStatus";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";
import {
  extractErrorMessage,
  getPageSizeNumber,
} from "@/utils/functions/common";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "draft" | "cancelled";
  djsApplied: number;
  venue?: string;
  genre?: string;
  budget?: number;
}

interface FilterState {
  search: string;
  status: string;
  dateRange: string;
  genre: string;
  budgetRange: string;
}

const EventsDashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();
  const [loading, setLoading] = useState(true); // Add loading state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    revenue: 0,
    avgApplications: 0,
  });
  const [events, setEvents] = useState<any[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 1,
    rowsPerPage: RowsPerPageEnum.Ten,
  });

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    dateRange: "all",
    genre: "all",
    budgetRange: "all",
  });

  const [showFilters, setShowFilters] = useState(false);

  const avgApplications =
    events.reduce((sum, event) => sum + event.djsApplied, 0) / totalEvents || 0;
  const bookingRate =
    (events.filter((e) => e.status === "confirmed").length / totalEvents) *
      100 || 0;
  const totalRevenue = events.reduce(
    (sum, event) => sum + (event.budget || 0),
    0
  );

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await sdk.getAllEvents({
        search: "",
        sort: null,
        filter: [],
        page: {
          pageNumber: pageInfo.pageNumber,
          rowsPerPage: pageInfo.rowsPerPage,
        },
      });

      if (response.getAllEvents) {
        setEvents(response.getAllEvents.items || []);
        setTotalEvents(response.getAllEvents.total || 0);

        // Calculate stats
        const pendingCount = response.getAllEvents.items.filter(
          (e: any) => e.status === EventStatus.Draft
        ).length;

        const totalRevenue = response.getAllEvents.items.reduce(
          (sum: number, event: any) => sum + (event.budget?.min || 0),
          0
        );

        const totalApplications = response.getAllEvents.items.reduce(
          (sum: number, event: any) => sum + (event.djsApplied || 0),
          0
        );

        const avgApplications =
          response.getAllEvents.items.length > 0
            ? totalApplications / response.getAllEvents.items.length
            : 0;

        setStats({
          total: response.getAllEvents.total,
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

  useEffect(() => {
    fetchEvents();
  }, [pageInfo]);

  const applyFilters = () => {
    let filtered = events;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.venue?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    // Genre filter
    if (filters.genre !== "all") {
      filtered = filtered.filter((event) => event.genre === filters.genre);
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, events]);

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

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/events/${eventId}/edit`);
  };

  const handlePromoteEvent = (eventId: string) => {
    setToastData({
      message: "Event promotion feature coming soon!",
      type: "success",
    });
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-xl font-semibold text-white mb-2">No events yet!</h3>
      <p className="text-primary mb-6 text-center max-w-md">
        Get started by creating your first event to attract DJs and sell
        tickets.
      </p>
      <button
        onClick={handleCreateEvent}
        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Create New Event
      </button>
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <Calendar className="h-6 w-6 text-black" />
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
              <Users className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        {/* Booking Rate */}
        <div className="bg-secondaryBg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary">Booking Rate</p>
              <p className="text-2xl font-bold text-white">
                {/* Calculate based on your business logic */}
                N/A
              </p>
            </div>
            <div className="bg-primary p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-black" />
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
              <DollarSign className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
          <input
            type="text"
            placeholder="Search events by name, venue, or DJ..."
            className="input input-primary"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="bg-card rounded-lg border border-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondaryBg border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-white">
                    Event Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-white">
                    Date & Time
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-white">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-white">
                    Venue
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event: any) => (
                  <tr
                    key={event._id}
                    className="hover:bg-secondaryBg transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">
                          {event.title}
                        </div>
                        {event.genre && (
                          <div className="text-sm text-gray-500">
                            {event.genresPreferred?.join(", ") || "N/A"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {formatDate(event.eventDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(event.eventDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {getStatusIcon(event.status)}
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span> */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary">
                        {event.location?.addressLine1 || "Venue not set"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* ... action buttons ... */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {events.length} of {totalEvents} events
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setPageInfo((prev) => ({
                    ...prev,
                    pageNumber: Math.max(1, prev.pageNumber - 1),
                  }))
                }
                disabled={pageInfo.pageNumber === 1}
                className="px-3 py-1 rounded border border-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPageInfo((prev) => ({
                    ...prev,
                    pageNumber: prev.pageNumber + 1,
                  }))
                }
                disabled={
                  events.length < getPageSizeNumber(pageInfo.rowsPerPage)
                }
                className="px-3 py-1 rounded border border-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-card">
          <EmptyState />
        </div>
      )}
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
