'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Upload,
    ShoppingBag,
    LayoutDashboard,
    User,
    Menu,
    X,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Upload Data', href: '/upload', icon: Upload },
    { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/profile', icon: User },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)

    // Only show sidebar on non-landing pages in a real app, 
    // but for hackathon we might want it everywhere or just specific ones.
    // User spec: "Sidebar: Left fixed (lg), collapsible hamburger mobile."

    return (
        <>
            {/* Mobile Toggle */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg bg-accent text-accent-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={cn(
                "fixed left-0 top-0 bottom-0 z-40 w-64 bg-card/50 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                        <div className="w-10 h-10 relative">
                            <img src="/logo.png" alt="NexaVita" className="object-contain" />
                        </div>
                        <span className="font-bold text-xl tracking-tight italic bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                            NexaVita
                        </span>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                                        isActive
                                            ? "bg-accent/10 text-accent font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 transition-transform group-hover:scale-110",
                                        isActive ? "text-accent" : "text-muted-foreground"
                                    )} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                                        />
                                    )}
                                    <ChevronRight className={cn(
                                        "w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all",
                                        isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-100 group-hover:translate-x-0"
                                    )} />
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-blue-600/10 border border-white/5">
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Privacy Focus</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Your data is encrypted locally using ZK-STARKs before hitting the blockchain.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
}
