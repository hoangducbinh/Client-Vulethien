'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Search, ShoppingBag, ShoppingCart, Star, Truck, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useAPI from '@/services/handleAPI'; 
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast, ToastContainer } from 'react-toastify'







export default function Component() {

  // Fetch featured products from API
  const { data: productsData, isLoading, isError } = useAPI('/product/getAll', 'get');
  const products = productsData?.data || [];

  // Lấy 8 sản phẩm ngẫu nhiên
  const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);

  const addToCart = useCallback((product: any) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.unit_price,
      quantity: 1,
      stock: product.quantity_in_stock,
      unit: product.unit,
      image: product.image
    }
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === cartItem.id)
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    toast.success('Sản phẩm đã được thêm vào giỏ hàng', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-16 bg-gradient-to-r from-blue-600 to-green-500 text-white py-10 rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold mb-4 text-center">Chào mừng đến với BeeBer Shop</h1>
          <p className="text-xl text-center mb-8">Khám phá các sản phẩm chất lượng cao cho doanh nghiệp của bạn</p>
          <div className="flex justify-center">
            <Link href="/allproducts">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 shadow-lg">
              Khám phá ngay
            </Button>
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {randomProducts.map((product: any, index: number) => ( // {{ edit_2 }}
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card key={product._id} className="flex flex-col">
              <CardHeader>
                <Image loading="lazy" placeholder="blur" blurDataURL={product.image} src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-contain rounded-t-lg" />
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                </div>
                <p className="text-lg font-semibold mb-2">{product.unit_price.toLocaleString()} ₫/{product.unit}</p>
                <Badge variant={product.quantity_in_stock > 0 ? "secondary" : "destructive"}>
                  {product.quantity_in_stock > 0 ? `Còn ${product.quantity_in_stock} ${product.unit}` : 'Hết hàng'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">{product.category}</p>
                <p className="text-sm text-muted-foreground">Đơn hàng tối thiểu: {product.min_order} {product.unit}</p>
                <div className="flex items-center mt-2">
                  <Truck className="h-4 w-4 mr-1" />
                  <span className="text-sm"> <span className="text-green-500">3 đến 5 ngày</span> {product.delivery_time}</span>
                </div>
                {product.promotion && (
                  <div className="mt-2 p-2 bg-yellow-100 rounded-md">
                    <p className="text-sm text-yellow-800">{product.promotion}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                  <Button className="flex-grow mr-2" onClick={() => addToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                </Button>
              </CardFooter>
            </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <Card className="bg-gray-100 border-0">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">Đăng ký nhận thông tin</h2>
                <p className="text-gray-600 mb-4">Nhận các ưu đãi độc quyền và cập nhật mới nhất về sản phẩm</p>
              </div>
              <div className="flex w-full md:w-auto">
                <Input type="email" placeholder="Nhập email của bạn" className="rounded-r-none" />
                <Button className="rounded-l-none bg-black text-white hover:bg-gray-800 shadow-md">
                  Đăng ký
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

     
    </div>
  )
}
