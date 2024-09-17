'use client'
import Image from 'next/image';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import useAuthStore from '@/zustand/store';
import React from 'react';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUser, FaChartBar, FaBell, FaExpand } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return (
        <header className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shadow-md z-50">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <Image
                    src="/vscode.png"
                    width={30}
                    height={30}
                    alt="Logo"
                    className="ml-2"
                />
                <Link href="/home" scroll={false} className="text-lg font-semibold text-gray-800">
                    Code ở tấm lòng
                </Link>
            </div>

            {/* Center Links */}
            <div className="flex space-x-6">
                <Link href="/settings" className="flex items-center p-2 hover:text-blue-600 transition-colors duration-200">
                    <FaTachometerAlt className="mr-2" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/product" className="flex items-center p-2 hover:text-blue-600 transition-colors duration-200">
                    <FaBox className="mr-2" />
                    <span>Sản phẩm</span>
                </Link>
                <Link href="/orders" className="flex items-center p-2 hover:text-blue-600 transition-colors duration-200">
                    <FaShoppingCart className="mr-2" />
                    <span>Đơn hàng</span>
                </Link>
                <Link href="/customers" className="flex items-center p-2 hover:text-blue-600 transition-colors duration-200">
                    <FaUser className="mr-2" />
                    <span>Khách hàng</span>
                </Link>
                <Link href="/reports" className="flex items-center p-2 hover:text-blue-600 transition-colors duration-200">
                    <FaChartBar className="mr-2" />
                    <span>Báo cáo</span>
                </Link>
            </div>

            {/* Fullscreen Icon */}
            <button onClick={toggleFullscreen} className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <FaExpand className="text-xl" />
            </button>

            

            {/* Notification Icon */}
            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <FaBell className="text-xl" />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        3
                    </span>
                </button>

                {/* Avatar with dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Image
                            src="/react.png"
                            width={30}
                            height={30}
                            className="rounded-full cursor-pointer"
                            alt="Avatar"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mt-2 mr-4 w-48">
                        <DropdownMenuItem>
                            <Link href="/profile" className="w-full text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md">Trang cá nhân</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/settings" className="w-full text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md">Cài đặt</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <button onClick={handleLogout} className="w-full text-red-700 hover:bg-gray-100 px-4 py-2 rounded-md">Đăng xuất</button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
