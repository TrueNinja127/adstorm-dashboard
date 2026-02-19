"use client"

import Image from "next/image"
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
  ShoppingCart,
  Trash2,
  MapPin,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ThemesDialog } from "@/components/layout/themes-dialog"
import { useCart } from "@/contexts/cart-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  { id: 1, icon: Megaphone, accentColor: "text-[hsl(var(--primary))]", accentBg: "bg-orange-500/10", borderAccent: "border-l-[hsl(var(--primary))]", category: "campaigns", title: "Campaign \"Summer Sale\" is live", description: "Your campaign has been approved and is now running across 12 channels.", time: "2m", timeLabel: "2 min ago", unread: true, action: "View Campaign" },
  { id: 2, icon: TrendingUp, accentColor: "text-emerald-400", accentBg: "bg-emerald-500/10", borderAccent: "border-l-emerald-400", category: "campaigns", title: "Impressions milestone reached", description: "Brand Networks campaign hit 50K impressions. Performance is above average.", time: "1h", timeLabel: "1 hour ago", unread: true, action: "View Analytics" },
  { id: 3, icon: AlertCircle, accentColor: "text-amber-400", accentBg: "bg-amber-500/10", borderAccent: "border-l-amber-400", category: "billing", title: "Low balance warning", description: "Your account balance is below $20. Top up to keep your campaigns running.", time: "3h", timeLabel: "3 hours ago", unread: true, action: "Top Up Now" },
  { id: 4, icon: CheckCircle2, accentColor: "text-sky-400", accentBg: "bg-sky-400/10", borderAccent: "border-l-sky-400", category: "campaigns", title: "Ad review completed", description: "Your ad \"Holiday Promo\" passed moderation review.", time: "1d", timeLabel: "Yesterday", unread: false },
  { id: 5, icon: Receipt, accentColor: "text-muted-foreground", accentBg: "bg-secondary", borderAccent: "border-l-border", category: "billing", title: "Payment processed", description: "Invoice #1042 for $250.00 has been successfully paid.", time: "2d", timeLabel: "2 days ago", unread: false },
  { id: 6, icon: Zap, accentColor: "text-violet-400", accentBg: "bg-violet-400/10", borderAccent: "border-l-violet-400", category: "system", title: "New AI targeting available", description: "Smart Automation now supports audience lookalike targeting.", time: "3d", timeLabel: "3 days ago", unread: false },
]

const categoryTabs: { label: string; value: NotifCategory }[] = [
  { label: "All", value: "all" },
  { label: "Campaigns", value: "campaigns" },
  { label: "Billing", value: "billing" },
  { label: "System", value: "system" },
]

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function Header() {
  const { toast } = useToast()
  const { resolvedTheme, setTheme } = useTheme()
  const { items: cartItems, count: cartCount, removeItem, clearCart } = useCart()
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price ?? 0), 0)
  const [isCartOpen, setIsCartOpen] = useState(false)
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
  const filtered = activeTab === "all" ? notifList : notifList.filter((n) => n.category === activeTab)

  function markAllRead() {
    setNotifList((prev) => prev.map((n) => ({ ...n, unread: false })))
    toast({ variant: "success", title: "Success!", description: "All notifications have been marked as read." })
  }

  function dismissNotif(id: number) {
    setNotifList((prev) => prev.filter((n) => n.id !== id))
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="relative z-[110] flex h-16 flex-shrink-0 items-center justify-between px-8 animate-fade-in">
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

      <div className="flex items-center gap-3">
        <button className="btn-gelatine flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Upload className="h-4 w-4" />
          Upload AD
        </button>
        <div className="flex h-10 items-center gap-2.5 rounded-xl border border-border bg-card px-4">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">$100.00</span>
        </div>

        {/* Shopping cart */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open cart"
          className="btn-gelatine relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="btn-gelatine flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          {mounted && isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false) }}
            className="btn-gelatine relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">{unreadCount}</span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-[400px] origin-top-right animate-scale-in rounded-2xl bg-card shadow-2xl ring-1 ring-border">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-[15px] font-bold text-foreground">Notifications</h3>
                  {unreadCount > 0 && <span className="flex h-5 items-center rounded-md bg-primary/15 px-1.5 text-[11px] font-bold text-primary">{unreadCount} new</span>}
                </div>
                <button onClick={markAllRead} className="text-[11px] font-semibold text-primary transition-colors hover:text-primary/80">Mark all read</button>
              </div>
              <div className="flex gap-1 px-5 py-2">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${activeTab === tab.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mx-5 h-px bg-border" />
              <div className="max-h-[360px] overflow-y-auto px-3 py-2">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-[13px] text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  filtered.map((notif, idx) => (
                    <div key={notif.id} className={`group relative mb-1.5 rounded-xl p-3 transition-all duration-200 hover:bg-secondary/60 ${notif.unread ? "bg-secondary/30" : "bg-transparent"}`} style={{ animationDelay: `${idx * 50}ms` }}>
                      <button onClick={() => dismissNotif(notif.id)} className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${notif.accentBg}`}>
                          <notif.icon className={`h-4 w-4 ${notif.accentColor}`} />
                        </div>
                        <div className="flex-1 overflow-hidden pr-4">
                          <div className="flex items-center gap-2">
                            <p className={`text-[13px] leading-snug ${notif.unread ? "font-bold text-foreground" : "font-medium text-foreground/70"}`}>{notif.title}</p>
                            {notif.unread && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground/70">{notif.description}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-[10px] font-medium text-muted-foreground/50">{notif.timeLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mx-5 h-px bg-border" />
              <div className="p-3">
                <button className="btn-gelatine flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary">
                  View all notifications
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 h-8 w-px bg-border" />

        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false) }}
            className="btn-gelatine flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-card"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground">John Doe</span>
              <span className="text-[11px] text-muted-foreground">Advertiser</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-scale-in rounded-xl bg-card p-1.5 shadow-xl ring-1 ring-border">
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">John Doe</span>
                  <span className="text-[11px] text-muted-foreground">john@adstorm.com</span>
                </div>
              </div>
              <div className="mx-2 my-1 h-px bg-border" />
              <div className="py-1">
                {dropdownItems.map((item) => (
                  <button key={item.label} onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mx-2 my-1 h-px bg-border" />
              <button onClick={() => { setIsProfileOpen(false); setIsThemesOpen(true) }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <PaintRoller className="h-4 w-4" />
                Themes
              </button>
              <div className="mx-2 my-1 h-px bg-border" />
              <div className="py-1">
                <button onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-400/10">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ThemesDialog open={isThemesOpen} onOpenChange={setIsThemesOpen} />

      {/* Cart drawer */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col border-l border-border/60 bg-gradient-to-b from-background to-muted/20 p-0 sm:max-w-[420px]"
        >
          <SheetHeader className="shrink-0 space-y-0 border-b border-border/50 bg-card/50 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center justify-between pr-8">
              <SheetTitle className="font-display text-xl font-bold tracking-tight text-foreground">
                Your cart
              </SheetTitle>
              {cartCount > 0 && (
                <Badge variant="secondary" className="font-semibold tabular-nums">
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </SheetHeader>

          <div className="flex flex-1 min-h-0 flex-col">
            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-base font-semibold text-foreground">
                    Your cart is empty
                  </p>
                  <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground">
                    Add sites or locations from the Sites &amp; Locations page to get started.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue browsing
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <ul className="space-y-3">
                    {cartItems.map((item) => (
                      <li
                        key={item.id}
                        className="group flex gap-3 rounded-2xl border border-border/60 bg-card/80 p-3.5 shadow-sm transition-all hover:border-border hover:shadow-md"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate text-sm">
                            {item.name}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px] font-medium">
                              {item.type === "site" ? "Site" : "Location"}
                            </Badge>
                            <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {item.cityName}, {item.stateName}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {item.metric}
                          </p>
                          <p className="mt-1.5 text-sm font-bold text-foreground tabular-nums">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground opacity-70 transition-opacity hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
                          onClick={() => {
                            removeItem(item.id)
                            toast({
                              title: "Removed from cart",
                              description: `${item.name} has been removed from your cart.`,
                            })
                          }}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="shrink-0 border-t border-border/50 bg-card/80 px-4 py-4 backdrop-blur-sm">
                  <div className="space-y-2 rounded-2xl bg-muted/30 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax (est.)</span>
                      <span className="font-medium tabular-nums text-foreground">
                        {formatPrice(0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                      <span className="font-display font-semibold text-foreground">
                        Total
                      </span>
                      <span className="font-display text-lg font-bold tabular-nums text-foreground">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      className="w-full rounded-xl bg-primary py-6 text-base font-semibold shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                      onClick={() => {
                        toast({
                          variant: "success",
                          title: "Order placed",
                          description: `Your order of ${formatPrice(cartTotal)} for ${cartCount} item${cartCount !== 1 ? "s" : ""} has been submitted. We'll process it shortly.`,
                        })
                        clearCart()
                        setIsCartOpen(false)
                      }}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Buy all — {formatPrice(cartTotal)}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        clearCart()
                        setIsCartOpen(false)
                      }}
                    >
                      Clear cart
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
