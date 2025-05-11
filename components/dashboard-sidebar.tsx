"use client"

import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Search, GraduationCap, Settings, Menu, X, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      icon: BookOpen,
      label: "Courses",
      href: "/dashboard",
      active: false,
    },
    {
      icon: Search,
      label: "Browse Courses",
      href: "/browse-courses",
      active: pathname === "/browse-courses",
    },
    {
      icon: GraduationCap,
      label: "Grades",
      href: "/grades",
      active: pathname === "/grades",
    },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      active: pathname === "/profile",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard",
      active: false,
    },
  ]

  const handleLogout = async () => {
    await signOut()
  }

  const getInitials = () => {
    const fullName = user?.user_metadata?.full_name || "Student User"
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/80 md:hidden" onClick={() => setOpen(false)} />}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 rounded-md bg-zinc-900 p-2 text-white md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-zinc-900 transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-zinc-800 px-6">
            <h2 className="text-xl font-bold text-red-500">Student Portal</h2>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-zinc-400 hover:bg-zinc-800 hover:text-white",
                  item.active && "bg-zinc-800 text-white",
                )}
                onClick={() => {
                  router.push(item.href)
                  if (window.innerWidth < 768) {
                    setOpen(false)
                  }
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="border-t border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-sm font-medium">{getInitials()}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.user_metadata?.full_name || "Student"}</p>
                  <p className="text-xs text-zinc-400">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
