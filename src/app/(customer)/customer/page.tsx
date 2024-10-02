'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShoppingCart, Package, Truck, CreditCard, Search, ChevronRight, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Bell, User, ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'

export default function CustomerHome() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  const recentOrders = [
    { id: 'DH-1234', status: 'Đang xử lý', date: '2023-06-15', total: '15.500.000 ₫', items: 5 },
    { id: 'DH-1233', status: 'Đã giao', date: '2023-06-10', total: '22.300.000 ₫', items: 8 },
    { id: 'DH-1232', status: 'Đang vận chuyển', date: '2023-06-05', total: '18.430.000 ₫', items: 6 },
  ]

  const notifications = [
    { type: 'info', message: 'Đơn hàng DH-1235 đã được xác nhận' },
    { type: 'success', message: 'Ưu đãi mới: Giảm 10% cho đơn hàng trên 10 triệu' },
    { type: 'warning', message: 'Đơn hàng DH-1230 đang được giao, dự kiến đến trong hôm nay' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Xin chào, Hoàng Đức Bình</h1>
        <div className="flex items-center gap-4">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">
                {notificationCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4 text-blue-500" />
            <span>Đơn hàng DH-1235 đã được xác nhận</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4 text-green-500" />
            <span>Ưu đãi mới: Giảm 10% cho đơn hàng trên 10 triệu</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Đơn hàng DH-1230 đang được giao, dự kiến đến trong hôm nay</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center font-medium">
            Xem tất cả thông báo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/vscode.png" alt="@customer" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Hoàng Đức Bình</p>
              <p className="text-xs leading-none text-muted-foreground">
                customer@abc.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Thông tin tài khoản</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Lịch sử đơn hàng</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Heart className="mr-2 h-4 w-4" />
            <span>Sản phẩm yêu thích</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MapPin className="mr-2 h-4 w-4" />
            <span>Địa chỉ giao hàng</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </div>
      </header>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 w-full max-w-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng đang xử lý</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Đang chờ xác nhận</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi tiêu (30 ngày)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56.230.000 ₫</div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">Cập nhật 5 phút trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng đang giao</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <Progress value={66} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">2/3 đơn hàng đúng hạn</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm trong giỏ hàng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Tổng giá trị: 4.500.000 ₫</p>
          </CardContent>
        </Card>
      </div>


      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Đơn hàng gần đây</h2>
          <Link href="/allorders">
            <Button variant="outline">
              Xem tất cả đơn hàng
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items} sản phẩm</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'Đã giao' ? 'secondary' :
                        order.status === 'Đang vận chuyển' ? 'default' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Chi tiết</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sản phẩm đề xuất</h2>
        <Link href="/listproduct">
          <Button variant="outline">
            Xem tất cả sản phẩm
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { name: 'Nước giải khát ABC', price: '120.000 ₫', unit: 'Thùng', minOrder: 10 },
          { name: 'Bánh kẹo XYZ', price: '85.000 ₫', unit: 'Hộp', minOrder: 20 },
          { name: 'Dầu ăn DEF', price: '210.000 ₫', unit: 'Thùng', minOrder: 5 },
          { name: 'Mì ăn liền GHI', price: '95.000 ₫', unit: 'Thùng', minOrder: 15 }
        ].map((product, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4">
                <Image
                  width={500}
                  height={500}
                  src={`/react.png?text=${product.name}`}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-md"
                />
                <Badge className="absolute top-2 right-2" variant="secondary">Đề xuất</Badge>
              </div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{product.price}</span>
                <span className="text-sm text-muted-foreground">/{product.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Đơn hàng tối thiểu: {product.minOrder} {product.unit}</p>
              
              <Button className="w-full">Thêm vào giỏ hàng</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}