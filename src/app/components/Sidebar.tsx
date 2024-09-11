// components/Sidebar.js

import Link from 'next/link';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUser, FaChartBar } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen bg-white text-black w-40 p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard">
              <span className="flex items-center p-2 rounded hover:bg-gray-200 cursor-pointer">
                <FaTachometerAlt className="mr-3" />
                <span>Dashboard</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/products">
              <span className="flex items-center p-2 rounded hover:bg-gray-200 cursor-pointer">
                <FaBox className="mr-3" />
                <span>Sản phẩm</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/orders">
              <span className="flex items-center p-2 rounded hover:bg-gray-200 cursor-pointer">
                <FaShoppingCart className="mr-3" />
                <span>Đơn hàng</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/customers">
              <span className="flex items-center p-2 rounded hover:bg-gray-200 cursor-pointer">
                <FaUser className="mr-3" />
                <span>Khách hàng</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/reports">
              <span className="flex items-center p-2 rounded hover:bg-gray-200 cursor-pointer">
                <FaChartBar className="mr-3" />
                <span>Báo cáo</span>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
