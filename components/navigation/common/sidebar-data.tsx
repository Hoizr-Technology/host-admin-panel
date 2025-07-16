import {
  BlocksIcon,
  BookHeartIcon,
  BoxIcon,
  CircleDollarSignIcon,
  CircleUserRoundIcon,
  FileChartLineIcon,
  HomeIcon,
  MenuSquareIcon,
  MonitorIcon,
  SettingsIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react";

export type TSidebarSubItem = {
  title: string;
  href: string;
};

export type TSidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  subItems?: TSidebarSubItem[];
};

export const getSidebarList = (): TSidebarItem[] => [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    active: true,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: MenuSquareIcon,
    active: true,
  },
  {
    title: "Events",
    href: "/events",
    icon: BlocksIcon,
    active: true,
  },
  {
    title: "Messages",
    href: "/Messages",
    icon: BookHeartIcon,
    active: true,
  },
  {
    title: "Contracts",
    href: "/contracts",
    icon: BoxIcon,
    active: true,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CircleUserRoundIcon,
    active: true,
  },
  {
    title: "Event Analytics",
    href: "/event-analytics",
    icon: UsersRoundIcon,
    active: true,
  },
  {
    title: "Saved Assets",
    href: "/event-analytics",
    icon: UsersRoundIcon,
    active: true,
  },
  {
    title: "Settings",
    href: "/artist-settings",
    icon: SettingsIcon,
    active: true,
  },
];
