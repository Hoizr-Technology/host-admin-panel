import MainLayout from "@/components/layouts/mainBodyLayout";
import { ProfileStatus } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserStore from "@/store/user";
import { redirectPathFromStatus } from "@/utils/functions/redirectPathFromStatus";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Bell,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  Sliders,
  Search,
  Plus,
  FileSignature,
  AlertTriangle,
} from "lucide-react";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "draft" | "cancelled" | "setup_needed";
  venue: string;
  dj?: string;
  djRating?: number;
  alert?: string;
}

interface Task {
  id: string;
  task: string;
  event: string;
  deadline: string;
  status: "urgent" | "high" | "medium";
}

interface Activity {
  id: string;
  time: string;
  action: string;
  event?: string;
  dj?: string;
  amount?: number;
}

const HostDashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();
  const { meUser } = useUserStore();
  const hostName = meUser?.firstName || "Host";

  // Current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Mock data for the dashboard
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Neon Nights",
      date: "Sat, Jul 19",
      time: "10:00 PM",
      status: "confirmed",
      venue: "Downtown Club",
      dj: "Maria Vega",
      djRating: 4.8,
    },
    {
      id: "2",
      name: "Summer Fest",
      date: "Sun, Jul 20",
      time: "7:00 PM",
      status: "setup_needed",
      venue: "Miami Beach",
      alert: "Pending rider approval",
    },
    {
      id: "3",
      name: "Bass Festival",
      date: "Fri, Jul 25",
      time: "8:00 PM",
      status: "pending",
      venue: "Arena Park",
      dj: "Alex Rex",
      djRating: 4.5,
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      task: "Sign Contract",
      event: "Bass Festival",
      deadline: "Today",
      status: "urgent",
    },
    {
      id: "2",
      task: "Review DJ Rider",
      event: "Summer Fest",
      deadline: "Tomorrow",
      status: "urgent",
    },
    {
      id: "3",
      task: "Payment Pending",
      event: "Rooftop Sessions",
      deadline: "Jul 19",
      status: "high",
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      time: "10:30 AM",
      action: "DJ Kira applied",
      event: "Bass Festival",
    },
    {
      id: "2",
      time: "9:15 AM",
      action: "Contract signed",
      dj: "Alex Rex",
      event: "Neon Nights",
    },
    {
      id: "3",
      time: "Yesterday",
      action: "Payment received",
      amount: 2500,
      event: "Sunset Beats",
    },
  ]);

  // Stats data
  const statsData = [
    {
      title: "Total Events",
      value: 27,
      change: 12,
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Avg. Applications",
      value: 14,
      change: 8,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Booking Rate",
      value: 68,
      change: 15,
      isPercentage: true,
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Revenue (90 Days)",
      value: 42,
      isCurrency: true,
      change: 22,
      icon: <DollarSign className="h-6 w-6" />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-orange-500/10 text-orange-500";
      case "draft":
        return "bg-blue-500/10 text-blue-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      case "setup_needed":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "draft":
        return "Draft";
      case "cancelled":
        return "Cancelled";
      case "setup_needed":
        return "Setup Needed";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500";
      case "high":
        return "bg-orange-500/10 text-orange-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handleCreateEvent = () => {
    router.push("/events/create");
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleFindDJs = () => {
    router.push("/discover");
  };

  const handleGenerateInvoice = () => {
    setToastData({
      message: "Invoice generation feature coming soon!",
      type: "warning",
    });
  };

  const handleContactSupport = () => {
    setToastData({
      message: "Support team will contact you shortly",
      type: "success",
    });
  };

  const handleResolveTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setToastData({
      message: "Task marked as resolved!",
      type: "success",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {hostName}!
          </h1>
          <p className="text-primary mt-1">Today: {currentDate}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondaryBg rounded-lg px-4 py-2">
            <Bell className="h-5 w-5 text-primary" />
            <span className="text-white">12</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="text-white">
              <span className="font-semibold">12</span> Upcoming Events
            </div>
            <div className="text-orange-500">
              <span className="font-semibold">8</span> Pending Actions
            </div>
            <div className="text-green-500">
              <span className="font-semibold">$24.8K</span> Revenue
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-secondaryBg rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-primary">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.isCurrency ? "$" : ""}
                  {stat.value}
                  {stat.isPercentage ? "%" : ""}
                </p>
              </div>
              <div className="bg-primary p-2 rounded-lg">{stat.icon}</div>
            </div>
            <div className="flex items-center mt-3">
              {stat.change > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`ml-1 text-sm ${
                  stat.change > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}% {stat.change > 0 ? "increase" : "decrease"} from
                last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-secondaryBg rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Next 7 Days</h2>
          <button className="text-primary hover:text-primary/80 text-sm flex items-center">
            View all events <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="flex overflow-x-auto pb-4 -mx-2 px-2">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-80 bg-card rounded-lg border border-card mr-4 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{event.name}</h3>
                  <p className="text-sm text-primary mt-1">
                    {event.date} · {event.time}
                  </p>
                  <p className="text-sm text-white mt-1">{event.venue}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    event.status
                  )}`}
                >
                  {getStatusText(event.status)}
                </span>
              </div>

              {event.dj && (
                <div className="mt-4 flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{event.dj}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(event.djRating || 0)
                              ? "text-yellow-400"
                              : "text-gray-700"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-primary ml-1">
                        {event.djRating}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {event.alert && (
                <div className="mt-4 flex items-start p-3 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <p className="text-yellow-500 text-sm ml-2">{event.alert}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleViewEvent(event.id)}
                  className="flex-1 bg-card hover:bg-card/80 text-white py-2 rounded-lg text-sm"
                >
                  View Details
                </button>
                <button className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondaryBg rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">
              Immediate Attention
            </h2>
            <button className="text-primary hover:text-primary/80 text-sm flex items-center">
              View all tasks <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left pb-3 text-sm font-medium text-primary">
                    Task
                  </th>
                  <th className="text-left pb-3 text-sm font-medium text-primary">
                    Event
                  </th>
                  <th className="text-left pb-3 text-sm font-medium text-primary">
                    Deadline
                  </th>
                  <th className="text-right pb-3 text-sm font-medium text-primary">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-800 last:border-0"
                  >
                    <td className="py-3">
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            task.status === "urgent"
                              ? "bg-red-500"
                              : task.status === "high"
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                          }`}
                        ></span>
                        <span className="text-white">{task.task}</span>
                      </div>
                    </td>
                    <td className="py-3 text-white">{task.event}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.deadline === "Today"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-gray-500/10 text-primary"
                        }`}
                      >
                        {task.deadline}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleResolveTask(task.id)}
                        className="text-primary hover:text-white text-sm font-medium px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-lg"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-secondaryBg rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">
              Recent Activity
            </h2>
            <button className="text-primary hover:text-primary/80 text-sm flex items-center">
              View full log <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="w-px h-full bg-gray-700"></div>
                </div>
                <div className="pb-4">
                  <p className="text-sm text-primary">{activity.time}</p>
                  <p className="text-white mt-1">
                    <span className="font-medium">{activity.action}</span>
                    {activity.event && (
                      <span className="text-primary">
                        {" "}
                        for {activity.event}
                      </span>
                    )}
                    {activity.dj && (
                      <span className="text-primary"> by {activity.dj}</span>
                    )}
                    {activity.amount && (
                      <span className="text-green-500">
                        {" "}
                        (${activity.amount})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-secondaryBg rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Performance Insights
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Velocity Chart Placeholder */}
          <div className="bg-card rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-white">Booking Velocity</h3>
              <div className="flex gap-2">
                <button className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  6M
                </button>
                <button className="text-xs px-2 py-1 bg-card text-white rounded">
                  1Y
                </button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between px-4">
              {[60, 80, 120, 90, 140, 160, 200].map((height, index) => (
                <div
                  key={index}
                  className="w-8 bg-gradient-to-t from-primary to-primary/30 rounded-t"
                  style={{ height: `${height / 4}px` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2 text-xs text-primary">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
            </div>
          </div>

          {/* Top Genres Chart Placeholder */}
          <div className="bg-card rounded-lg p-4">
            <h3 className="font-medium text-white mb-4">Top Genres</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { genre: "House", percentage: 32, color: "bg-purple-500" },
                { genre: "Techno", percentage: 28, color: "bg-blue-500" },
                { genre: "Hip-Hop", percentage: 22, color: "bg-green-500" },
                { genre: "Pop", percentage: 12, color: "bg-yellow-500" },
                { genre: "Other", percentage: 6, color: "bg-gray-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 ${item.color} rounded mr-2`}></div>
                  <span className="text-white text-sm">{item.genre}</span>
                  <span className="text-primary text-sm ml-2">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm bg-primary/10 p-3 rounded-lg">
              <p className="font-medium text-white">Pro Insight</p>
              <p className="text-primary mt-1">
                Hip-Hop events have 18% higher booking rates in your area.
                Consider promoting more!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-secondaryBg rounded-full shadow-lg p-2 flex items-center z-10">
        <div className="flex gap-2">
          <CButton
            variant={ButtonType.Primary}
            onClick={handleCreateEvent}
            className="rounded-full"
          >
            <Plus className="h-5 w-5" />
            <span className="ml-2">Create Event</span>
          </CButton>

          <CButton
            variant={ButtonType.Secondary}
            onClick={handleFindDJs}
            className="rounded-full"
          >
            <Search className="h-5 w-5" />
            <span className="ml-2">Find DJs</span>
          </CButton>

          <CButton
            variant={ButtonType.Secondary}
            onClick={handleGenerateInvoice}
            className="rounded-full"
          >
            <FileText className="h-5 w-5" />
            <span className="ml-2">Generate Invoice</span>
          </CButton>

          <CButton
            variant={ButtonType.Secondary}
            onClick={handleContactSupport}
            className="rounded-full"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2">Support</span>
          </CButton>
        </div>
      </div>
    </div>
  );
};

HostDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default HostDashboard;

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
