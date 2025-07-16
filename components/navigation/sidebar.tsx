import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useGlobalStore from "@/store/global";
import useUserStore from "@/store/user";
import { sdk } from "@/utils/graphqlClient";
import {
  ChevronRightIcon,
  ChevronsUpDown,
  HelpCircleIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImLocation } from "react-icons/im";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { getSidebarList } from "./common/sidebar-data";
import useAuthStore from "@/store/authStore";
import { extractErrorMessage } from "@/utils/functions/common";
import logo1 from "../../assets/logo/text.png";
import Image from "next/image";

export default function AppSidebar() {
  const { firstName, lastName } = useAuthStore();
  const [canAddRestaurant, setCanAddRestaurant] = useState(false);

  const { meUser } = useUserStore();
  // const permissions = meUser?.permissions || [];

  const router = useRouter();
  const { setSelectedSideBarMenu, setToastData } = useGlobalStore();

  const handleLogout = async () => {
    try {
      const response = await sdk.hostLogout();
      if (response && response.hostLogout) {
        router.replace("/login");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  // Mobile Handler
  const { isMobile, state, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      id="app-sidebar"
      collapsible="icon"
      className="bg-background text-white"
    >
      <SidebarHeader className="bg-background">
        <SidebarMenu id="">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:!bg-secondaryBg flex items-center justify-between"
                >
                  <div className="flex w-full h-full items-center justify-center">
                    <Image className="" src={logo1} alt="Logo" width={100} />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <hr />
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            {getSidebarList().map((sidebarItem) => {
              if ((sidebarItem.subItems ?? []).length > 0) {
                return (
                  <Collapsible
                    key={sidebarItem.title}
                    asChild
                    defaultOpen={false}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={sidebarItem.title}
                          className="hover:!bg-secondaryBg !rounded-xl py-5 my-[1px"
                          onClick={() => {
                            if (state === "collapsed") {
                              toggleSidebar();
                            }
                          }}
                        >
                          {sidebarItem.icon && <sidebarItem.icon />}
                          <span>{sidebarItem.title}</span>
                          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {(sidebarItem.subItems ?? []).map((subItem) => {
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  onClick={() => {
                                    if (isMobile) {
                                      toggleSidebar();
                                    }
                                    setSelectedSideBarMenu(subItem.title);
                                    router.push(subItem.href);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }
              return (
                <SidebarMenuItem
                  key={sidebarItem.title}
                  className={`hover:bg-secondaryBg rounded-xl my-[1px] ${
                    sidebarItem.title === "Menu Management"
                      ? router.pathname.includes("/menu/menu-builder")
                        ? "text-primary !bg-secondaryBg "
                        : ""
                      : sidebarItem.title === "Reports" &&
                        router.pathname.includes("Reports")
                      ? "text-primary !bg-secondaryBg "
                      : router.pathname === sidebarItem.href
                      ? "text-primary !bg-secondaryBg "
                      : ""
                  }`}
                >
                  <SidebarMenuButton
                    tooltip={sidebarItem.title}
                    onClick={() => {
                      if (sidebarItem.active) {
                        if (isMobile || sidebarItem.title === "CMS") {
                          if (state === "expanded") {
                            toggleSidebar();
                          }
                        }
                        setSelectedSideBarMenu(sidebarItem.title);
                        router.push(sidebarItem.href);
                      }
                    }}
                    className="py-5"
                  >
                    <>
                      {sidebarItem.icon && <sidebarItem.icon />}
                      <span>{sidebarItem.title}</span>
                    </>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 bg-background">
        <Link
          href={"/knowledge-base/overview"}
          className={`flex flex-row justify-center items-center group space-x-2`}
        >
          <HelpCircleIcon className="text-primary" size={18} />
          {state !== "collapsed" ? (
            <p className="text-sm text-primary">Knowledge Centre</p>
          ) : null}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
