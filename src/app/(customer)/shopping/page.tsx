'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { mutateAPI } from '@/services/handleAPI'
import useAuthStore from '@/store/store'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
  unit: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const router = useRouter()
  const { customer } = useAuthStore(state => ({ customer: state.customer }))

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
    if (customer) {
      setCustomerInfo({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || ''
      })
    }
  }, [customer])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const item = cart.find(item => item.id === id)
    if (item && newQuantity > item.stock) {
      toast.error(`Chỉ còn ${item.stock} ${item.unit} trong kho`)
      return
    }
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    updateCart(newCart)
  }

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id)
    updateCart(newCart)
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  const applyCoupon = () => {
    if (couponCode === 'GIAMGIA50') {
      setDiscount(50)
      toast.success('Áp dụng mã giảm giá thành công', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else {
      toast.error('Mã giảm giá không hợp lệ')
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 500000 ? 0 : 30000
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal + shippingFee - discountAmount

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async () => {
    if (!customer) {
      toast.error('Vui lòng đăng nhập để đặt hàng')
      router.push('/signin')
      return
    }

    if (!customerInfo.phone || !customerInfo.address) {
      toast.error('Vui lòng điền đầy đủ số điện thoại và địa chỉ')
      return
    }

    try {
      const orderData = {
        customer_id: customer._id,
        status: 'Chờ xác nhận',
        total_value: total,
        orderDetails: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
      }

      const response = await mutateAPI('/order/create', orderData, 'post')
      
      if (response.message === "Tạo đơn hàng mới thành công") {
        toast.success('Đặt hàng thành công!')
        localStorage.removeItem('cart')
        setCart([])
        router.push('/allorders')
      } else {
        toast.error('Đặt hàng thất bại, vui lòng thử lại.')
      }
    } catch (err: any) {
      toast.error('Đã xảy ra lỗi khi đặt hàng.')
      console.error('Lỗi đặt hàng:', err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Giỏ hàng của bạn</h1>
      <ToastContainer />
      {cart.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="flex flex-col items-center">
            <ShoppingBag className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống</p>
            <p className="text-gray-400 mb-4">Hãy thêm một số sản phẩm và quay lại đây nhé!</p>
            <Button onClick={() => router.push('/allproducts')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="flex-grow lg:w-2/3">
            {cart.map(item => (
              <Card key={item.id} className="mb-4 overflow-hidden transition-shadow duration-300 hover:shadow-xl rounded-lg">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={80} 
                    height={80} 
                    className="rounded-md object-contain" 
                  />
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">{item.price.toLocaleString()} ₫/{item.unit}</p>
                    <Badge variant="outline" className="mt-1">Còn {item.stock} {item.unit}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 hover:bg-gray-300"><Minus className="h-4 w-4" /></Button>
                    <Input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 text-center" 
                    />
                    <Button variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 hover:bg-gray-300"><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} ₫</p>
                    <Button variant="ghost" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/90">
                      <Trash2 className="h-4 w-4 mr-2" /> Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <Card className="sticky top-4 rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                    <p className="mb-2">Họ tên: {customerInfo.name}</p>
                    <Input
                      placeholder="Số điện thoại"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className="mb-2"
                    />
                    <Input
                      placeholder="Địa chỉ"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleCustomerInfoChange}
                      className="mb-2"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tổng tiền hàng</span>
                      <span>{subtotal.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span>{shippingFee > 0 ? `${shippingFee.toLocaleString()} ₫` : 'Miễn phí'}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span>-{discountAmount.toLocaleString()} ₫</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng</span>
                      <span>{total.toLocaleString()} ₫</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Nhập mã giảm giá" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow"
                    />
                    <Button onClick={applyCoupon} variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                  Đặt hàng
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      <div className="mt-8">
        <Button variant="outline" onClick={() => router.push('/allproducts')} className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90">
          <ArrowLeft className="mr-2 h-4 w-4" /> Tiếp tục mua sắm
        </Button>
      </div>
    </div>
  )
}