'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminTopBar } from '@/features/admin/components/AdminTopBar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#08090B] text-[#F5F3EE]">{children}</main>
  }

  return (
    <div className="flex min-h-screen bg-[#08090B] text-[#F5F3EE]">
      {/* 240px Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-[1600px] w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
