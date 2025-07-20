import { ProfileStatus } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserStore from "@/store/user";
import { redirectPathFromStatus } from "@/utils/functions/redirectPathFromStatus";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Calendar,
  Bell,
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
  Plus,
  FileSignature,
  AlertTriangle,
  UserCircle2,
  Search,
  Users,
} from "lucide-react";
import MainLayout from "@/components/layouts/mainBodyLayout";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";
import { useState } from "react";
import { sdk } from "@/utils/graphqlClient";

// AVATAR utility for DJ/event placeholders
function Avatar({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const initials =
    name
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "DJ";
  return (
    <div
      className={`flex items-center justify-center bg-primary/90 text-black font-semibold rounded-full w-10 h-10 border-2 border-primary ${className}`}
    >
      {initials}
    </div>
  );
}

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

  // ===== Mock Data ========
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

  // ===== Dashboard Stats =====
  const statsData = [
    {
      title: "Total Events",
      value: 27,
      change: 12,
      icon: <Calendar className="h-6 w-6" />,
      bg: "from-purple-600 to-purple-400",
    },
    {
      title: "Avg. Applications",
      value: 14,
      change: 8,
      icon: <Users className="h-6 w-6" />,
      bg: "from-blue-600 to-blue-400",
    },
    {
      title: "Booking Rate",
      value: 68,
      change: 15,
      isPercentage: true,
      icon: <TrendingUp className="h-6 w-6" />,
      bg: "from-green-600 to-green-400",
    },
    {
      title: "Revenue (90 Days)",
      value: 42,
      isCurrency: true,
      change: 22,
      icon: <DollarSign className="h-6 w-6" />,
      bg: "from-yellow-600 to-yellow-400",
    },
  ];

  // ====== Utils =====
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

  // ===== Handlers ======
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
    setTasks(tasks.filter((task: any) => task.id !== taskId));
    setToastData({
      message: "Task marked as resolved!",
      type: "success",
    });
  };

  // =====================================
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={hostName} className="w-12 h-12 text-lg" />
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">
              Welcome, <span className="text-primary">{hostName}</span>!
            </h1>
            <p className="text-primary/80 mt-1 text-sm">Today: {currentDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="relative bg-secondaryBg rounded-lg px-4 py-2 flex gap-2 items-center hover:ring-2 hover:ring-primary transition">
            <Bell className="h-5 w-5 text-primary" />
            <span className="text-white font-semibold">12</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5 shadow">
              3
            </span>
          </button>
          <div className="hidden sm:flex gap-8 text-sm">
            <div className="text-white/80">
              <span className="font-semibold text-primary">12</span> Upcoming
              Events
            </div>
            <div className="text-orange-400 font-semibold">
              8 Pending Actions
            </div>
            <div className="text-green-400 font-semibold">$24.8K Revenue</div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl px-6 py-5 bg-secondaryBg border border-card shadow hover:shadow-lg transition group`}
          >
            <div
              className={`absolute top-0 right-0 w-20 h-20 blur-[32px] opacity-30 rounded-br-2xl rounded-tl-2xl pointer-events-none`}
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                ["--tw-gradient-from" as any]: stat.bg.split(" ")[0],
                ["--tw-gradient-to" as any]: stat.bg.split(" ")[2],
              }}
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary/80 font-medium">
                  {stat.title}
                </p>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {stat.isCurrency ? "$" : ""}
                    {stat.value}
                    {stat.isPercentage ? "%" : ""}
                  </span>
                  <span
                    className={`text-sm font-semibold ml-1 ${
                      stat.change > 0 ? "text-green-500" : "text-red-500"
                    } flex items-center`}
                  >
                    {stat.change > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                    )}
                    {stat.change}%
                  </span>
                </div>
              </div>
              <div className="rounded-lg shadow p-2 bg-primary/10">
                {stat.icon}
              </div>
            </div>
            <span className="block mt-2 text-xs text-primary/50">
              {(stat.change > 0 ? "Increase" : "Decrease") + " from last month"}
            </span>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <section className="bg-card rounded-2xl p-6 border border-card shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events (7 Days)
          </h2>
          <button className="text-primary hover:underline text-sm flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-0.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3">
          {upcomingEvents.map((event: any) => (
            <div
              key={event.id}
              className="w-80 flex-shrink-0 bg-secondaryBg rounded-xl border border-card p-4 shadow group relative hover:ring-2 hover:ring-primary/50 transition"
              tabIndex={0}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">{event.name}</h3>
                  <p className="text-xs text-primary/70 mt-0.5">
                    {event.date} · {event.time}
                  </p>
                  <p className="text-sm text-white/80 my-1">{event.venue}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 ${getStatusColor(
                    event.status
                  )}`}
                >
                  {getStatusText(event.status)}
                </span>
              </div>
              {/* DJ Section */}
              {event.dj && (
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={event.dj} />
                  <div>
                    <p className="text-xs text-white font-medium">{event.dj}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-yellow-400">
                        {event.djRating?.toFixed(1)}
                      </span>
                      <span className="text-primary font-medium">★</span>
                    </div>
                  </div>
                </div>
              )}
              {event.alert && (
                <div className="mt-4 flex items-center gap-2 bg-yellow-600/10 rounded p-2 text-sm text-yellow-700">
                  <AlertTriangle className="h-5 w-5" /> {event.alert}
                </div>
              )}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleViewEvent(event.id)}
                  className="flex-1 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/80 shadow focus:ring-2 focus:ring-primary/40 transition"
                >
                  View Details
                </button>
                <button
                  className="bg-secondaryBg rounded-lg border border-card p-2 hover:bg-primary/20 transition"
                  title="Message"
                >
                  <MessageSquare className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Tasks */}
        <section className="bg-card rounded-2xl p-6 border border-card shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              Immediate Attention
            </h2>
            <button className="text-primary hover:underline text-sm flex items-center">
              View all tasks <ChevronRight className="h-4 w-4 ml-0.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondaryBg">
                  <th className="text-left pb-2 text-primary/80 font-semibold">
                    Task
                  </th>
                  <th className="text-left pb-2 text-primary/80 font-semibold">
                    Event
                  </th>
                  <th className="text-left pb-2 text-primary/80 font-semibold">
                    Deadline
                  </th>
                  <th className="text-right pb-2 text-primary/80 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task: any) => (
                  <tr
                    key={task.id}
                    className="border-b border-secondaryBg last:border-0 group"
                  >
                    <td className="py-3 flex items-center gap-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          task.status === "urgent"
                            ? "bg-red-500"
                            : task.status === "high"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}
                        title={task.status}
                      ></span>
                      <span className="text-white">{task.task}</span>
                    </td>
                    <td className="py-3 text-white/90">{task.event}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          task.deadline === "Today"
                            ? "bg-red-500/10 text-red-500"
                            : task.deadline === "Tomorrow"
                            ? "bg-orange-400/10 text-orange-400"
                            : "bg-gray-500/10 text-primary"
                        }`}
                      >
                        {task.deadline}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleResolveTask(task.id)}
                        className="text-sm font-medium px-3 py-1 rounded-lg bg-primary/10 text-primary hover:text-black hover:bg-primary transition"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-primary/60"
                    >
                      🎉 All urgent tasks are cleared!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* Right: Activity Feed */}
        <section className="bg-card rounded-2xl p-6 border border-card shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            <button className="text-primary hover:underline text-sm flex items-center">
              View full log <ChevronRight className="h-4 w-4 ml-0.5" />
            </button>
          </div>
          <ol className="relative border-l-2 border-primary/20 pl-4">
            {activities.map((activity, idx) => (
              <li key={activity.id} className="mb-8 ml-2 last:mb-0 relative">
                <div className="absolute -left-4 top-1 w-3 h-3 bg-primary rounded-full border-2 border-card shadow" />
                <span className="text-xs text-primary/80">{activity.time}</span>
                <div className="mt-1 text-white">
                  <span className="font-semibold">{activity.action}</span>
                  {activity.event && (
                    <span className="text-primary ml-1">
                      for {activity.event}
                    </span>
                  )}
                  {activity.dj && (
                    <span className="text-primary ml-1">by {activity.dj}</span>
                  )}
                  {activity.amount && (
                    <span className="text-green-400 ml-1 font-medium">
                      {" "}
                      (${activity.amount})
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Performance Insights */}
      <section className="bg-card rounded-2xl p-6 border border-card shadow-lg space-y-6">
        <h2 className="text-lg font-semibold text-white mb-2 flex gap-2 items-center tracking-tight">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Velocity */}
          <div className="bg-secondaryBg rounded-xl p-6 shadow space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold text-base">
                Booking Velocity
              </h3>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-lg font-semibold shadow">
                  6M
                </button>
                <button className="text-xs px-3 py-1 bg-card text-white rounded-lg shadow">
                  1Y
                </button>
              </div>
            </div>
            <div className="flex gap-2 items-end h-24 w-full">
              {[60, 80, 120, 90, 140, 160, 200].map((height, index) => (
                <div
                  key={index}
                  className="w-8 bg-gradient-to-t from-primary to-primary/30 rounded-t-lg transition-all duration-500"
                  style={{ height: `${height / 2.5}px` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-primary">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
            </div>
          </div>

          {/* Top Genres */}
          <div className="bg-secondaryBg rounded-xl p-6 shadow space-y-5">
            <h3 className="font-semibold text-white mb-1">Top Genres</h3>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { genre: "House", percentage: 32, color: "bg-purple-500" },
                { genre: "Techno", percentage: 28, color: "bg-blue-500" },
                { genre: "Hip-Hop", percentage: 22, color: "bg-green-500" },
                { genre: "Pop", percentage: 12, color: "bg-yellow-500" },
                { genre: "Other", percentage: 6, color: "bg-gray-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-2`} />
                  <span className="text-white">{item.genre}</span>
                  <span className="text-primary ml-2">{item.percentage}%</span>
                  <div className="bg-primary/30 rounded h-2 ml-4 flex-1">
                    <div
                      className={`h-2 ${item.color} rounded`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-primary/10 p-4 flex gap-3 items-start shadow animate-pulse-sm">
              <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <div className="font-semibold text-white text-base">
                  Pro Insight
                </div>
                <div className="text-primary mt-1 text-sm">
                  Hip-Hop events have{" "}
                  <span className="font-bold text-green-500">
                    18% higher booking rates
                  </span>{" "}
                  in your area. <b>Consider featuring more!</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Toolbar */}
      <nav
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-secondaryBg rounded-full shadow-2xl border border-card px-3 py-2 flex flex-row gap-2 z-20 animate-fade-in"
        style={{
          // backdropFilter: "blur(7px)",
          background: "rgba(27,32,45,0.95)",
        }}
      >
        <CButton
          variant={ButtonType.Primary}
          onClick={handleCreateEvent}
          className="rounded-full font-semibold whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          <span className="ml-2">Create Event</span>
        </CButton>
        <CButton
          variant={ButtonType.Secondary}
          onClick={handleFindDJs}
          className="rounded-full font-semibold whitespace-nowrap"
        >
          <Search className="h-5 w-5" />
          <span className="ml-2">Find DJs</span>
        </CButton>
        <CButton
          variant={ButtonType.Secondary}
          onClick={handleGenerateInvoice}
          className="rounded-full font-semibold whitespace-nowrap"
        >
          <FileText className="h-5 w-5" />
          <span className="ml-2">Generate Invoice</span>
        </CButton>
        <CButton
          variant={ButtonType.Secondary}
          onClick={handleContactSupport}
          className="rounded-full font-semibold whitespace-nowrap"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="ml-2">Support</span>
        </CButton>
      </nav>
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
