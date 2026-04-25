import { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ExternalLink, User, Cpu, GitBranch, FolderGit2, Mail, MoreVertical } from "lucide-react";

const navItems = [
  { to: "/admin", label: "About", icon: User, end: true },
  { to: "/admin/tech", label: "Tech", icon: Cpu },
  { to: "/admin/career", label: "Career", icon: GitBranch },
  { to: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { to: "/admin/contact", label: "Contact", icon: Mail },
];

const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-mono text-[10px] text-primary tracking-widest uppercase">Portfolio</span>
          <span className="text-sm font-bold">CMS</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/" target="_blank" className="gap-2 cursor-pointer">
                <ExternalLink className="w-4 h-4" />
                View Site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:min-h-screen border-r border-border bg-card/40 p-6 flex-col gap-4">
        <Link to="/" className="mb-4">
          <p className="font-mono text-xs text-primary tracking-widest uppercase">Portfolio</p>
          <p className="text-sm font-bold">CMS Admin</p>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-2 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground truncate" title={user?.email ?? ""}>{user?.email}</p>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link to="/" target="_blank">
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-5 sm:px-6 md:p-10 max-w-4xl pb-24 md:pb-10">
        {children ?? <Outlet />}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                  <span className="leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminLayout;
