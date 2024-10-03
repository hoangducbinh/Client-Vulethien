'use client';

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart2, Users, Package, 
  ShoppingCart, Settings,
  LogOut, Menu, Search, 
  ChevronDown, ArrowDown, 
  Truck, FileText, ClipboardList, Building  } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/store';
export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const router = useRouter();
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
 
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className={`bg-gray-100 rounded-lg w-64 min-h-screen ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="flex items-center h-16 px-4">
          <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" />
          <span className="text-xl font-semibold">Code toàn bug</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/#" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <BarChart2 className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/customer" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <Users className="mr-2 h-4 w-4" />
            Khách hàng
          </Link>
          <Link href="/home" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <Users className="mr-2 h-4 w-4" />
            Nhân viên
          </Link>
          <Link href="/product" className="w-full justify-start  rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <Package className="mr-2 h-4 w-4" />
            Sản phẩm
          </Link>
          <Link href="/order-manager" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Đơn hàng
          </Link>
          <Link href="/inventory" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <ArrowDown className="mr-2 h-4 w-4" />
            Nhập hàng
          </Link>
          <Link href="/#" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <Truck className="mr-2 h-4 w-4" />
            Xuất hàng
          </Link>

          <Link href="/warehouse" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <Building className="mr-2 h-4 w-4" />
            Kho hàng
          </Link>
          <Link href="/#" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <FileText className="mr-2 h-4 w-4" />
             Hóa đơn
          </Link>
          <Link href="/#" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <ClipboardList className="mr-2 h-4 w-4" />
             Báo cáo
          </Link>
          <Link href="/settings" className="w-full justify-start rounded-lg hover:bg-gray-200 transition-colors flex items-center p-2">
            <Settings className="mr-2 h-4 w-4" />
            Cài đặt
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white h-16 flex items-center justify-end px-4 md:px-6">

          <Button variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          {/* <div className="flex items-center flex-1 md:ml-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-8 w-full"
              />
            </div>
          </div> */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-600" />
                  {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={handleLogout}>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className='overflow-y-auto p-2'>
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}