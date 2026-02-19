"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Megaphone,
  FileImage,
  BarChart3,
  Wallet,
  Receipt,
  Settings,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Building2,
  MapPin,
  Tv,
  type LucideIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme"

interface SubItem {
  icon: LucideIcon
  label: string
  href?: string
}

interface NavItem {
  icon: LucideIcon
  label: string
  href?: string
  children?: SubItem[]
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  {
    icon: Store,
    label: "Marketplace",
    children: [
      { icon: Building2, label: "Brands", href: "/brands" },
      { icon: MapPin, label: "Sites & Locations", href: "/sites" },
      { icon: Tv, label: "Channels & Genres", href: "/channels-genres" },
    ],
  },
  { icon: Megaphone, label: "Campaigns" },
  { icon: FileImage, label: "My Ads" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Wallet, label: "Balance" },
  { icon: Receipt, label: "Billing" },
  { icon: Settings, label: "Settings" },
]

function pathnameToLabel(pathname: string): string | null {
  if (pathname === "/") return "Dashboard"
  if (pathname === "/carousel") return "Carousel"
  if (pathname === "/brands") return "Brands"
  if (pathname === "/sites") return "Sites & Locations"
  if (pathname === "/channels-genres") return "Channels & Genres"
  return null
}

export function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [marketplaceOpen, setMarketplaceOpen] = useState(false)
  const isLight = resolvedTheme === "light"
  const logoSrc = isLight ? "/images/logo-dark.png" : "/images/logo.png"

  useEffect(() => {
    const label = pathnameToLabel(pathname)
    if (label) {
      setActiveItem(label)
      if (pathname === "/brands" || pathname === "/sites" || pathname === "/channels-genres") setMarketplaceOpen(true)
    }
  }, [pathname])

  const marketplaceChildren = navItems.find((i) => i.label === "Marketplace")?.children
  const isMarketplaceChildActive = marketplaceChildren?.some((c) => c.label === activeItem)

  function handleItemClick(item: NavItem) {
    if (item.children) {
      if (collapsed) {
        setCollapsed(false)
        setMarketplaceOpen(true)
      } else {
        setMarketplaceOpen((prev) => !prev)
      }
    } else if (!item.href) {
      setActiveItem(item.label)
      setMarketplaceOpen(false)
    }
  }

  function handleChildClick(child: SubItem) {
    if (!child.href) setActiveItem(child.label)
  }

  return (
    <aside
      className={cn(
        "sidebar-nav relative flex h-full flex-shrink-0 flex-col transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 z-50 btn-gelatine flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-colors hover:bg-accent hover:text-foreground"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
      </button>

      <div className="flex items-center justify-center px-4 py-6">
        {collapsed ? (
          <Image src="/logo.png" alt="ADStorm" width={32} height={32} className="h-8 w-8 object-contain object-left" />
        ) : (
          <Image src={logoSrc} alt="ADStorm" width={140} height={36} className="h-8 w-auto" />
        )}
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto pt-4">
        <ul className="flex flex-col">
          {navItems.map((item) => {
            const hasChildren = !!item.children
            const isParentActive = item.label === activeItem || (hasChildren && isMarketplaceChildActive)
            const isDirectActive = item.label === activeItem && !hasChildren
            const showCurves = isDirectActive || (hasChildren && isMarketplaceChildActive && !marketplaceOpen)

            return (
              <li key={item.label}>
                <div className={cn("nav-item relative", showCurves && "active")}>
                  <span className="curve-top" aria-hidden="true" />
                  <span className="curve-bottom" aria-hidden="true" />
                  {item.href && !hasChildren ? (
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "nav-link relative z-10 flex w-full items-center transition-colors",
                        collapsed ? "mx-auto justify-center px-0 py-3.5" : "ml-3 w-[calc(100%-12px)] gap-4 rounded-l-2xl px-5 py-3.5 text-sm font-medium",
                        showCurves ? "active-link" : isParentActive ? "text-foreground" : "text-[hsl(var(--sidebar-foreground))] hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={isParentActive ? 2.2 : 1.6} />
                      {!collapsed && <span className="font-display flex-1 whitespace-nowrap text-left">{item.label}</span>}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleItemClick(item)}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "nav-link relative z-10 flex w-full items-center transition-colors",
                        collapsed ? "mx-auto justify-center px-0 py-3.5" : "ml-3 w-[calc(100%-12px)] gap-4 rounded-l-2xl px-5 py-3.5 text-sm font-medium",
                        showCurves ? "active-link" : isParentActive ? "text-foreground" : "text-[hsl(var(--sidebar-foreground))] hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={isParentActive ? 2.2 : 1.6} />
                      {!collapsed && (
                        <>
                          <span className="font-display flex-1 whitespace-nowrap text-left">{item.label}</span>
                          {hasChildren && <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", marketplaceOpen && "rotate-180")} strokeWidth={1.8} />}
                        </>
                      )}
                    </button>
                  )}
                </div>

                {hasChildren && !collapsed && (
                  <div className={cn("overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out", marketplaceOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0")}>
                    <ul className="py-1">
                      {item.children!.map((child) => {
                        const isChildActive = activeItem === child.label
                        const linkClass = cn(
                          "nav-link relative z-10 flex w-full items-center transition-colors",
                          "ml-3 w-[calc(100%-12px)] gap-3 rounded-l-2xl py-2.5 pl-12 pr-5 text-[13px] font-medium",
                          isChildActive ? "active-link" : "text-[hsl(var(--sidebar-foreground))] hover:text-foreground"
                        )
                        return (
                          <li key={child.label} className={cn("nav-item relative", isChildActive && "active")}>
                            <span className="curve-top" aria-hidden="true" />
                            <span className="curve-bottom" aria-hidden="true" />
                            {child.href ? (
                              <Link href={child.href} className={linkClass}>
                                <child.icon className="h-4 w-4 flex-shrink-0" strokeWidth={isChildActive ? 2.2 : 1.6} />
                                <span className="font-display whitespace-nowrap">{child.label}</span>
                              </Link>
                            ) : (
                              <button onClick={() => handleChildClick(child)} className={linkClass}>
                                <child.icon className="h-4 w-4 flex-shrink-0" strokeWidth={isChildActive ? 2.2 : 1.6} />
                                <span className="font-display whitespace-nowrap">{child.label}</span>
                              </button>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="mx-4 mb-5 rounded-2xl bg-[hsl(var(--primary))] p-4">
          <h4 className="font-display text-sm font-bold text-[#0a0a0a]">New Campaign</h4>
          <p className="mt-1 text-xs leading-relaxed text-[#0a0a0a]/70">Ready to advertise? Launch a campaign and start reaching your audience now.</p>
          <button className="btn-gelatine mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] py-2.5 text-xs font-semibold text-[hsl(var(--primary))] transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Campaign
          </button>
        </div>
      )}

      {collapsed && (
        <div className="mb-5 flex justify-center">
          <button title="New Campaign" className="btn-gelatine flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[#0a0a0a] transition-opacity hover:opacity-90">
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </aside>
  )
}
