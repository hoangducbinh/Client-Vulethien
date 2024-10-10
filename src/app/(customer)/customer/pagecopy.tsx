'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search,ArrowRight, ChevronRight, Star, ShoppingBag, TrendingUp, Shield, Truck, Headphones, ChevronLeft, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
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
import { Badge } from "@/components/ui/badge"
import { Bell, User, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const notifications = [
    { type: 'info', message: 'Đơn hàng DH-1235 đã được xác nhận' },
    { type: 'success', message: 'Ưu đãi mới: Giảm 10% cho đơn hàng trên 10 triệu' },
    { type: 'warning', message: 'Đơn hàng DH-1230 đang được giao, dự kiến đến trong hôm nay' },
  ]

  const categories = [
    { name: 'Thực phẩm', icon: '🍎', color: 'bg-red-100' },
    { name: 'Đồ uống', icon: '🥤', color: 'bg-blue-100' },
    { name: 'Đồ gia dụng', icon: '🏠', color: 'bg-green-100' },
    { name: 'Văn phòng phẩm', icon: '📚', color: 'bg-yellow-100' },
    { name: 'Chăm sóc cá nhân', icon: '🧴', color: 'bg-purple-100' },
    { name: 'Điện tử', icon: '📱', color: 'bg-indigo-100' },
  ]

  const heroImages = [
    '/ecommerce.png?height=400&width=800&text=Ưu+đãi+mùa+hè',
    '/ecommerce-express.jpg?height=400&width=800&text=Sản+phẩm+mới',
  ]

  const featuredProducts = [
    { name: 'Nước giải khát ABC', price: '120.000 ₫', unit: 'Thùng', image: '/placeholder.png?height=150&width=150&text=Nước+giải+khát+ABC' },
    { name: 'Bánh kẹo XYZ', price: '85.000 ₫', unit: 'Hộp', image: '/placeholder.png?height=150&width=150&text=Bánh+kẹo+XYZ' },
    { name: 'Dầu ăn DEF', price: '210.000 ₫', unit: 'Thùng', image: '/placeholder.png?height=150&width=150&text=Dầu+ăn+DEF' },
    { name: 'Mì ăn liền GHI', price: '95.000 ₫', unit: 'Thùng', image: '/placeholder.png?height=150&width=150&text=Mì+ăn+liền+GHI' },
    { name: 'Nước mắm JKL', price: '75.000 ₫', unit: 'Chai', image: '/placeholder.png?height=150&width=150&text=Nước+mắm+JKL' },
    { name: 'Gia vị MNO', price: '45.000 ₫', unit: 'Hộp', image: '/placeholder.png?height=150&width=150&text=Gia+vị+MNO' },
    { name: 'Đồ uống PQR', price: '35.000 ₫', unit: 'Lon', image: '/placeholder.png?height=150&width=150&text=Đồ+uống+PQR' },
    { name: 'Snack STU', price: '25.000 ₫', unit: 'Gói', image: '/placeholder.png?height=150&width=150&text=Snack+STU' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">EasyShop</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push('/shopping')}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Giỏ hàng
            </Button>
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
                {notifications.map((notification, index) => (
                  <DropdownMenuItem key={index}>
                    <Bell className={`mr-2 h-4 w-4 ${
                      notification.type === 'info' ? 'text-blue-500' :
                      notification.type === 'success' ? 'text-green-500' : 'text-yellow-500'
                    }`} />
                    <span>{notification.message}</span>
                  </DropdownMenuItem>
                ))}
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
                    <AvatarImage src="/facebook.svg" alt="@customer" />
                    <AvatarFallback></AvatarFallback>
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
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 relative overflow-hidden rounded-lg shadow-2xl">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px]"
          >
            <Image
              src={heroImages[currentImageIndex]}
              alt="Hero image"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  Chào mừng đến với EasyShop
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-white mb-8"
                >
                  Khám phá ưu đãi đặc biệt và sản phẩm mới nhất
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button size="lg" variant="secondary">Mua sắm ngay</Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 w-full h-14 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${category.color} border-none`}>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <span className="text-5xl mb-4">{category.icon}</span>
                    <h3 className="font-semibold text-center text-gray-800">{category.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide space-x-6 pb-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-64"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <h3 className="font-semibold mb-2 text-lg line-clamp-2">{product.name}</h3>
                      <div className="mt-auto">
                        <p className="text-xl font-bold text-blue-600">{product.price}</p>
                        <p className="text-sm text-gray-500 mb-4">/{product.unit}</p>
                        <Button className="w-full" size="lg">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Ưu đãi đặc biệt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
                <CardContent className="p-6 flex items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Giảm 20% cho đơn hàng đầu tiên</h3>
                    <p className="mb-4">Áp dụng cho tất cả sản phẩm. Hạn sử dụng: 30/06/2023</p>
                    <Button variant="secondary">Sử dụng ngay</Button>
                  </div>
                  <div className="hidden md:block">
                    <Image src="/placeholder.svg?height=150&width=150&text=20%" width={150} height={150} alt="Discount" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white overflow-hidden">
                <CardContent className="p-6 flex items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Freeship cho đơn từ 500.000đ</h3>
                    <p className="mb-4">Áp dụng cho tất cả khu vực. Không giới hạn số lần sử dụng</p>
                    <Button variant="secondary">Tìm hiểu thêm</Button>
                  </div>
                  <div className="hidden md:block">
                    <Image src="/placeholder.svg?height=150&width=150&text=Free+Ship" width={150} height={150} alt="Free Shipping" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Tại sao chọn chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp className="h-8 w-8" />, title: "Giá cả cạnh tranh", description: "Chúng tôi cam kết mang đến giá tốt nhất cho bạn" },
              { icon: <Shield className="h-8 w-8" />, title: "Đảm bảo chất lượng", description: "Tất cả sản phẩm đều được kiểm tra kỹ lưỡng" },
              { icon: <Truck className="h-8 w-8" />, title: "Giao hàng nhanh chóng", description: "Đơn hàng được xử lý và giao trong 24h" },
              { icon: <Headphones className="h-8 w-8" />, title: "Hỗ trợ 24/7", description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 text-blue-500">{item.icon}</div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Nguyễn Văn A', comment: 'Sản phẩm chất lượng, giao hàng nhanh!', rating: 5, avatar: '/placeholder.svg?height=50&width=50&text=NVA' },
              { name: 'Trần Thị B', comment: 'Dịch vụ khách hàng tuyệt vời, sẽ ủng hộ tiếp!', rating: 4, avatar: '/placeholder.svg?height=50&width=50&text=TTB' },
              { name: 'Lê Văn C', comment: 'Giá cả hợp lý, đóng gói cẩn thận.', rating: 5, avatar: '/placeholder.svg?height=50&width=50&text=LVC' },
            ].map((review, index) => (
              <motion.div key={index} whileHover={{ y: -5 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{review.name}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">{review.comment}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-400 text-white overflow-hidden shadow-lg">
            <CardContent className="p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                <h2 className="text-4xl font-bold mb-4">Đăng ký nhận thông tin ưu đãi</h2>
                <p className="text-xl mb-4">Nhận ngay ưu đãi đặc biệt và cập nhật mới nhất về sản phẩm!</p>
              </div>
              <div className="flex w-full md:w-auto">
                <Input type="email" placeholder="Nhập email của bạn" className="rounded-r-none text-black py-6 min-w-[300px]" />
                <Button variant="secondary" size="lg" className="rounded-l-none text-blue-600">
                  Đăng ký
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Về chúng tôi</h3>
              <p className="text-gray-400">EasyShop - Nền tảng mua sắm B2B hàng đầu cho doanh nghiệp của bạn.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Liên kết nhanh</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Trung tâm hỗ trợ</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Liên hệ</h3>
              <p className="text-gray-400">Email: support@easyshop.com</p>
              <p className="text-gray-400">Hotline: 1900 1234</p>
              <p className="text-gray-400">Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Kết nối với chúng tôi</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2023 EasyShop. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}