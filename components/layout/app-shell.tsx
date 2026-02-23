'use client'

import React from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col">
                <Header />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}
