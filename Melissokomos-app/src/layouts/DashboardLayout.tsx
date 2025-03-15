import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  BookOpen,
  MessageSquare,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PackageOpen,
  FileText,
  Boxes,
  ListChecks, // Added for Tasks
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  active,
}) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
      active
        ? "bg-primary/10 text-primary font-medium"
        : "hover:bg-muted text-foreground/80 hover:text-foreground"
    )}
  >
    <Icon size={20} className={active ? "text-primary" : "text-foreground/70"} />
    <span>{label}</span>
    {active && <ChevronRight size={16} className="ml-auto text-primary" />}
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut, isLoading } = useAuth(); // Get isLoading
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-all duration-300 bg-card",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 hexagon bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                BK
              </span>
            </div>
            {sidebarOpen && <span className="font-semibold">BuzzKeeper</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:flex hidden"
          >
            <ChevronRight
              size={18}
              className={cn(
                "transition-transform duration-200",
                !sidebarOpen && "rotate-180"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Sidebar links */}
        <nav className="flex-1 overflow-auto py-4 px-3">
          <div className="space-y-1">
            <SidebarLink
              to="/dashboard"
              icon={Home}
              label="Dashboard"
              active={location.pathname === "/dashboard"}
            />
            <SidebarLink
              to="/hives"
              icon={Boxes}
              label="Hives"
              active={location.pathname === "/hives"}
            />
            <SidebarLink
              to="/hive-monitoring"
              icon={BarChart2}
              label="Hive Monitoring"
              active={location.pathname === "/hive-monitoring"}
            />
            <SidebarLink
              to="/education"
              icon={BookOpen}
              label="Education"
              active={location.pathname === "/education"}
            />
            <SidebarLink
              to="/ai-assistant"
              icon={MessageSquare}
              label="AI Assistant"
              active={location.pathname === "/ai-assistant"}
            />
            <SidebarLink
              to="/inventory"
              icon={PackageOpen}
              label="Inventory"
              active={location.pathname === "/inventory"}
            />
            <SidebarLink
              to="/inspections"
              icon={FileText}
              label="Inspections"
              active={location.pathname === "/inspections"}
            />
            <SidebarLink
              to="/tasks"
              icon={ListChecks}
              label="Tasks"
              active={location.pathname === "/tasks"}
            />
            <SidebarLink
              to="/community"
              icon={MessageSquare}
              label="Community"
              active={location.pathname === "/community"}
            />
            <SidebarLink
              to="/shop"
              icon={ShoppingBag}
              label="Shop"
              active={location.pathname === "/shop"}
            />
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          {/* Conditionally render user info */}
          {!isLoading && user && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.name.charAt(0)}
                </span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut size={18} />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        {/* Mobile header */}
        <header className="h-16 border-b flex items-center px-4 sticky top-0 bg-background z-30 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="mr-4"
          >
            <Menu size={20} />
          </Button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 hexagon bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                BK
              </span>
            </div>
            <span className="font-semibold">BuzzKeeper</span>
          </Link>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
