'use client';

import React, { useState, useEffect } from 'react'
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
import { Bell, Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/store';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter();
  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
 
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (header) {
        header.classList.toggle('bg-opacity-80', window.scrollY > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="bg-white">
      <header id="header" className="shadow-md sticky top-0 bg-white z-50 transition-opacity duration-200">
        <div className="mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            <Image src="/ecommerce.png" alt="logo" width={100} height={100} priority={true} className='w-10 h-10 rounded-lg' />
          </Link>
          <div className="flex items-center space-x-6">
            <Button variant="ghost" onClick={() => router.push('/shopping')}>
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/allorders')}>
                  Đơn hàng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className='flex-grow overflow-hidden'>
      <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>

      <footer className="bg-gray-200 py-12 text-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Giới thiệu</h3>
              <p>Nhà phân phối sản phẩm chất lượng cao.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">Về chúng tôi</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Liên hệ</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <p>Email: vulethien@gmail.com</p>
              <p>Điện thoại: 0987654321</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-black">
            <p>&copy; 2024 Thiết kế và phát triển bởi <Link href="https://github.com/hoangducbinh" target="_blank" className="text-red-600 hover:text-gray-200">Duck Bình</Link>.</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Link href="#" className="hover:text-gray-300">Facebook</Link>
              <Link href="#" className="hover:text-gray-300">Twitter</Link>
              <Link href="#" className="hover:text-gray-300">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
