import { Link, useLocation } from "react-router-dom";
import { Home, Store, Plus, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/events", label: "Events", icon: Calendar, newBadge: true },
  { href: "/dashboard", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      {/* spacer so content doesn't sit under the bar */}
      <div className="h-16 md:hidden" aria-hidden />

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-safe"
        aria-label="Bottom navigation"
      >
        <div className="relative grid grid-cols-5 items-end h-16">
          {items.slice(0, 2).map((item) => (
            <NavItem key={item.href} item={item} active={location.pathname === item.href} />
          ))}

          {/* Center floating Post button */}
          <div className="flex items-center justify-center">
            <Link
              to={user ? "/dashboard?tab=new" : "/register"}
              aria-label="Post"
              className="absolute -top-5 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Plus className="h-6 w-6" />
            </Link>
          </div>

          {items.slice(2).map((item) => (
            <NavItem key={item.href} item={item} active={location.pathname === item.href} />
          ))}
        </div>
      </nav>
    </>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { href: string; label: string; icon: any; newBadge?: boolean };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-medium relative",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", active && "fill-primary/10")} />
      <span>{item.label}</span>
      {item.newBadge && (
        <span className="absolute top-1 right-3 text-[8px] font-bold px-1 rounded bg-amber-400 text-amber-950">
          NEW
        </span>
      )}
    </Link>
  );
}
