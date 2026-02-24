"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bell,
  Search,
  Upload,
  ChevronDown,
  Wallet,
  User,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  Megaphone,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  Zap,
  Palette,
  Sun,
  Moon,
  PaintRoller,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ThemesDialog } from "@/components/dashboard/themes-dialog"

const dropdownItems = [
  { label: "My Profile", icon: User },
  { label: "Buy Balance", icon: CreditCard },
  { label: "Billing", icon: Receipt },
  { label: "Settings", icon: Settings },
]

type NotifCategory = "all" | "campaigns" | "billing" | "system"

interface Notification {
  id: number
  icon: typeof Megaphone
  accentColor: string
  accentBg: string
  borderAccent: string
  category: NotifCategory
  title: string
  description: string
  time: string
  timeLabel: string
  unread: boolean
  action?: string
}

const notifications: Notification[] = [
  {
    id: 1,
    icon: Megaphone,
    accentColor: "text-[hsl(var(--primary))]",
    accentBg: "bg-orange-500/10",
    borderAccent: "border-l-[hsl(var(--primary))]",
    category: "campaigns",
    title: 'Campaign "Summer Sale" is live',
    description:
      "Your campaign has been approved and is now running across 12 channels.",
    time: "2m",
    timeLabel: "2 min ago",
    unread: true,
    action: "View Campaign",
  },
  {
    id: 2,
    icon: TrendingUp,
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    borderAccent: "border-l-emerald-400",
    category: "campaigns",
    title: "Impressions milestone reached",
    description:
      "Brand Networks campaign hit 50K impressions. Performance is above average.",
    time: "1h",
    timeLabel: "1 hour ago",
    unread: true,
    action: "View Analytics",
  },
  {
    id: 3,
    icon: AlertCircle,
    accentColor: "text-amber-400",
    accentBg: "bg-amber-500/10",
    borderAccent: "border-l-amber-400",
    category: "billing",
    title: "Low balance warning",
    description:
      "Your account balance is below $20. Top up to keep your campaigns running.",
    time: "3h",
    timeLabel: "3 hours ago",
    unread: true,
    action: "Top Up Now",
  },
  {
    id: 4,
    icon: CheckCircle2,
    accentColor: "text-sky-400",
    accentBg: "bg-sky-400/10",
    borderAccent: "border-l-sky-400",
    category: "campaigns",
    title: "Ad review completed",
    description: 'Your ad "Holiday Promo" passed moderation review.',
    time: "1d",
    timeLabel: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    icon: Receipt,
    accentColor: "text-muted-foreground",
    accentBg: "bg-secondary",
    borderAccent: "border-l-border",
    category: "billing",
    title: "Payment processed",
    description: "Invoice #1042 for $250.00 has been successfully paid.",
    time: "2d",
    timeLabel: "2 days ago",
    unread: false,
  },
  {
    id: 6,
    icon: Zap,
    accentColor: "text-violet-400",
    accentBg: "bg-violet-400/10",
    borderAccent: "border-l-violet-400",
    category: "system",
    title: "New AI targeting available",
    description: "Smart Automation now supports audience lookalike targeting.",
    time: "3d",
    timeLabel: "3 days ago",
    unread: false,
  },
]

const categoryTabs: { label: string; value: NotifCategory }[] = [
  { label: "All", value: "all" },
  { label: "Campaigns", value: "campaigns" },
  { label: "Billing", value: "billing" },
  { label: "System", value: "system" },
]

export function Header() {
  const { toast } = useToast()
  const { resolvedTheme, setTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isThemesOpen, setIsThemesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<NotifCategory>("all")
  const [notifList, setNotifList] = useState(notifications)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifList.filter((n) => n.unread).length

  const filtered =
    activeTab === "all"
      ? notifList
      : notifList.filter((n) => n.category === activeTab)

  function markAllRead() {
    setNotifList((prev) => prev.map((n) => ({ ...n, unread: false })))
    toast({
      variant: "success",
      title: "Success!",
      description: "All notifications have been marked as read.",
    })
  }

  function dismissNotif(id: number) {
    setNotifList((prev) => prev.filter((n) => n.id !== id))
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="relative z-[110] flex h-16 flex-shrink-0 items-center justify-between px-8 animate-fade-in">
      {/* Left: Page Title + Search */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns, ads, channels..."
            className="h-10 w-72 rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Upload AD Button */}
        <button className="btn-gelatine flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Upload className="h-4 w-4" />
          Upload AD
        </button>

        {/* Balance */}
        <div className="flex h-10 items-center gap-2.5 rounded-xl border border-border bg-card px-4">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">$100.00</span>
        </div>

        {/* Light/Dark mode toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="btn-gelatine flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          {mounted && isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen)
              setIsProfileOpen(false)
            }}
            className="btn-gelatine relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-[400px] origin-top-right animate-scale-in rounded-2xl bg-card shadow-2xl ring-1 ring-border">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-[15px] font-bold text-foreground">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="flex h-5 items-center rounded-md bg-primary/15 px-1.5 text-[11px] font-bold text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Mark all read
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-1 px-5 py-2">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
                      activeTab === tab.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mx-5 h-px bg-border" />

              {/* Notification List */}
              <div className="max-h-[360px] overflow-y-auto px-3 py-2">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-[13px] text-muted-foreground">
                      No notifications
                    </p>
                  </div>
                ) : (
                  filtered.map((notif, idx) => (
                    <div
                      key={notif.id}
                      className={`group relative mb-1.5 rounded-xl p-3 transition-all duration-200 hover:bg-secondary/60  ${notif.unread ? "bg-secondary/30" : "bg-transparent"}`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* Dismiss button */}
                      <button
                        onClick={() => dismissNotif(notif.id)}
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${notif.accentBg}`}
                        >
                          <notif.icon
                            className={`h-4 w-4 ${notif.accentColor}`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden pr-4">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-[13px] leading-snug ${
                                notif.unread
                                  ? "font-bold text-foreground"
                                  : "font-medium text-foreground/70"
                              }`}
                            >
                              {notif.title}
                            </p>
                            {notif.unread && (
                              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground/70">
                            {notif.description}
                          </p>

                          {/* Footer: Time + Action */}
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-[10px] font-medium text-muted-foreground/50">
                              {notif.timeLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mx-5 h-px bg-border" />

              {/* Footer */}
              <div className="p-3">
                <button className="btn-gelatine flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary">
                  View all notifications
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-1 h-8 w-px bg-border" />

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen)
              setIsNotifOpen(false)
            }}
            className="btn-gelatine flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-card"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground">
                John Doe
              </span>
              <span className="text-[11px] text-muted-foreground">
                Advertiser
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-scale-in rounded-xl bg-card p-1.5 shadow-xl ring-1 ring-border">
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    John Doe
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    john@adstorm.com
                  </span>
                </div>
              </div>

              <div className="mx-2 my-1 h-px bg-border" />

              <div className="py-1">
                {dropdownItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mx-2 my-1 h-px bg-border" />

              <button
                onClick={() => {
                  setIsProfileOpen(false)
                  setIsThemesOpen(true)
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <PaintRoller className="h-4 w-4" />
                Themes
              </button>

              <div className="mx-2 my-1 h-px bg-border" />

              <div className="py-1">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-400/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ThemesDialog open={isThemesOpen} onOpenChange={setIsThemesOpen} />
    </header>
  )
}
