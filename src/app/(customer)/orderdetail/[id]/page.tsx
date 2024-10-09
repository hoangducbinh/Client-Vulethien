'use client'

import { useEffect, useState } from 'react'
import useAPI from '@/services/handleAPI'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'
import { CalendarIcon, PackageIcon, PrinterIcon, TruckIcon, UserIcon } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const OrderStatus = ({ status }: { status: string }) => {
  const statuses = ['Đang xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao hàng']
  const currentIndex = statuses.indexOf(status)

  return (
    <div className="relative mb-8">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2"></div>
      <div className="relative flex justify-between">
        {statuses.map((s, index) => (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
              index <= currentIndex ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-400'
            }`}>
              {index <= currentIndex ? '✓' : index + 1}
            </div>
            <div className={`mt-2 text-sm ${
              index <= currentIndex ? 'text-primary font-medium' : 'text-gray-400'
            }`}>
              {s}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const OrderDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const [order, setOrder] = useState<any>(null)
  const { data, isLoading, isError } = useAPI(`/order/getOrderById/${id}`, 'get')

  useEffect(() => {
    if (data) {
      setOrder(data.data)
    }
  }, [data])

  if (isLoading) return <OrderDetailSkeleton />
  if (isError) return <p className="text-red-500">Có lỗi xảy ra khi tải thông tin đơn hàng.</p>

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Chi tiết đơn hàng</h1>
          <p className="text-sm text-muted-foreground">Mã đơn hàng: {order?._id || order?.id || 'N/A'}</p>
        </div>
        <Button onClick={handlePrint} variant="outline" className="print:hidden w-full sm:w-auto">
          <PrinterIcon className="mr-2 h-4 w-4" /> In đơn hàng
        </Button>
      </div>

      {order && (
        <>
          <OrderStatus status={order.status} />
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                    <p className="font-medium">{new Date(order.date_ordered).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <PackageIcon className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <Badge variant={order.status === 'Đã giao hàng' ? 'success' : 'default'} className="mt-1">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tên khách hàng</p>
                    <p className="font-medium">{order.customer_id.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TruckIcon className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                    <p className="font-medium break-words">{order.customer_id.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] sm:h-[400px]">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] min-w-[200px]">Sản phẩm</TableHead>
                        <TableHead className="w-[120px] min-w-[120px]">Số lượng</TableHead>
                        <TableHead className="w-[120px] min-w-[120px]">Đơn giá</TableHead>
                        <TableHead className="w-[120px] min-w-[120px] text-right">Tổng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="w-[200px] min-w-[200px]">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="flex-shrink-0 relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden">
                                <Image 
                                  src={item.product_id.image} 
                                  alt={item.product_id.name} 
                                  fill
                                  sizes="(max-width: 640px) 40px, 48px"
                                  style={{ objectFit: "cover" }}
                                  loading="lazy"
                                />
                              </div>
                              <div className="font-medium text-sm sm:text-base">{item.product_id.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px] min-w-[120px]">{item.quantity}</TableCell>
                          <TableCell className="w-[120px] min-w-[120px] whitespace-nowrap">{item.price.toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell className="w-[120px] min-w-[120px] text-right whitespace-nowrap">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
              <Separator className="my-4 sm:my-6" />
              <div className="flex justify-between items-center font-semibold text-lg sm:text-xl">
                <span>Tổng cộng</span>
                <span>{order.total_value.toLocaleString('vi-VN')} ₫</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

const OrderDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-8">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-10 w-32" />
    </div>
    <Skeleton className="h-16 w-full" />
    <Card className="mb-6">
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-4">
            <Skeleton className="h-20 w-20 rounded-md" />
            <div className="flex-grow">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
)

export default OrderDetail