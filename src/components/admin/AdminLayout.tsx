import { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink, User, Cpu, GitBranch, FolderGit2, Mail } from "lucide-react";

const navItems = [
  { to: "/admin", label: "About", icon: User, end: true },
  { to: "/admin/tech", label: "Tech Stack", icon: Cpu },
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-border bg-card/40 p-4 md:p-6 flex md:flex-col gap-4">
        <div className="flex md:flex-col md:gap-1 gap-2 flex-1 overflow-x-auto md:overflow-visible">
          <Link to="/" className="hidden md:block mb-4">
            <p className="font-mono text-xs text-primary tracking-widest uppercase">Portfolio</p>
            <p className="text-sm font-bold">CMS Admin</p>
          </Link>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex flex-col gap-2 pt-4 border-t border-border">
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

      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-4xl">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
