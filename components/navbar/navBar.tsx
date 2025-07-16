import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGlobalStore from "@/store/global";
import useUserStore from "@/store/user";
import { sdk } from "@/utils/graphqlClient";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import useAuthStore from "@/store/authStore";
import { extractErrorMessage } from "@/utils/functions/common";

const Navbar = () => {
  const router = useRouter();
  const { firstName, lastName } = useAuthStore();
  const { meUser } = useUserStore();
  const { setToastData, selectedSideBarMenu } = useGlobalStore();

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

  const { isMobile } = useSidebar();

  return (
    // bg-[#F3F7FB]
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between  bg-background shadow-sm transition-all duration-200">
      {/* Left Section */}
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger />
        <div className="hidden md:block font-semibold">
          {selectedSideBarMenu}
        </div>
      </div>

      {/* Right Section - Account Management */}
      <div className="flex items-center gap-4 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild id="nav-account-management">
            <button className="hover:bg-secondary flex items-center p-2 rounded-xl transition-colors outline-none">
              <Avatar
                className={`h-8 w-8 rounded-xl bg-greenNeon ${
                  !isMobile ? "mr-2" : ""
                }`}
              >
                <AvatarFallback className="rounded-xl text-primary">
                  {`${firstName?.[0]}${lastName?.[0]}`}
                </AvatarFallback>
              </Avatar>
              {isMobile ? null : (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {meUser?.firstName || "User Name"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {meUser?.email || "Email"}
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-greenNeon text-black">
                    {`${firstName?.[0]}${lastName?.[0]}`}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {meUser?.firstName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {meUser?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="gap-2 p-2 hover:text-black  cursor-pointer font-medium"
              >
                My account
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/artist-settings"
                className="gap-2 p-2 hover:text-black cursor-pointer font-medium"
              >
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 p-2 text-red-600 !hover:text-red-700  cursor-pointer font-semibold"
            >
              <>
                <LogOutIcon size={16} />
                Log out
              </>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
