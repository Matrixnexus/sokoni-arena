import { Link, useLocation } from "react-router-dom";
import { Home, Store, Plus, Calendar, User, Wrench, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type Item = {
  href: string;
  label: string;
  icon: any;
  newBadge?: boolean;
};

// Layout: 7 columns. Center (col 4) is the floating "+" button.
// Order: Home, Shops, Services, [+], FunCircle, Account, Events
const leftItems: Item[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shops", label: "Shops", icon: Store, newBadge: true },
  { href: "/services", label: "Services", icon: Wrench },
];

const rightItems: Item[] = [
  { href: "/fun-circle", label: "FunCircle", icon: Users },
  { href: "/dashboard", label: "Account", icon: User },
  { href: "/events", label: "Events", icon: Calendar },
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
        <div className="relative grid grid-cols-7 items-end h-16">
          {leftItems.map((item) => (
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

          {rightItems.map((item) => (
            <NavItem key={item.href} item={item} active={location.pathname === item.href} />
          ))}
        </div>
      </nav>
    </>
  );
}

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium relative px-0.5",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", active && "fill-primary/10")} />
      <span className="leading-none truncate max-w-full">{item.label}</span>
      {item.newBadge && (
        <span className="absolute top-0.5 right-1 text-[7px] font-bold px-1 rounded bg-amber-400 text-amber-950 leading-tight">
          NEW
        </span>
      )}
    </Link>
  );
}
