"use client"

import { useEffect, useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ArrowUpDown,
  FileDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import useAPI, { mutateAPI } from "@/services/handleAPI"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Card } from "@/components/ui/card";
import Image from "next/image"

const orderStatuses = ["pending", "preparing", "ready", "exported", "confirmed", "cancelled", "delivered"]

const statusColors = {
  "pending": "bg-yellow-500",
  "preparing": "bg-blue-500",
  "ready": "bg-green-500",
  "exported": "bg-gray-500",
  "confirmed": "bg-green-500",
  "cancelled": "bg-red-500",
  "delivered": "bg-green-500",
}

export default function EnhancedOrderManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState("date_ordered")
  const [sortDirection, setSortDirection] = useState("desc")
  const [totalPages, setTotalPages] = useState(1)

  const { data: ordersResponse, isLoading, isError, mutate } = useAPI(`/order/getAll?page=${currentPage}&limit=10&sort=${sortColumn}&order=${sortDirection}&search=${searchTerm}&status=${statusFilter}`)

  useEffect(() => {
    if (ordersResponse && ordersResponse.data) {
      setOrders(ordersResponse.data.orders || [])
      setTotalPages(ordersResponse.data.totalPages || 1)
    }
  }, [ordersResponse])

  const handleSort = (column: any) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await mutateAPI(`/order/updateOrderStatus`, { orderId, status: newStatus }, 'put');
      
      if (response && response.data) {
        setSelectedOrder((prev: any) => prev && { ...prev, status: newStatus });
        mutate(); // Refresh the order list
        toast.success('Cập nhật trạng thái đơn hàng thành công');
      } else {
        throw new Error(response.message || "Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: any) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleExportData = () => {
    // Implement export functionality here
    toast.info('Chức năng xuất dữ liệu đang được phát triển')
  }

  const handleViewDetails = async (orderId: any) => {
    try {
      const response = await mutateAPI(`/order/getOrderById/${orderId}`, null, 'get');
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Không thể lấy thông tin chi tiết đơn hàng');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Đang tải...</div>
  if (isError) return <div className="flex justify-center items-center h-screen">Đã xảy ra lỗi khi tải dữ liệu</div>

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 text-center">Quản lý đơn đặt hàng</h1>
      <Card className="shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8 border rounded-lg shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] border rounded-lg shadow-sm">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))} */}
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                <SelectItem value="ready">Sẵn sàng xuất</SelectItem>
                <SelectItem value="exported">Đã xuất kho</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleExportData} className="border rounded-lg shadow-sm">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort("_id")}>
                    ID 
                    {sortColumn === "_id" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("date_ordered")}>
                    Ngày đặt
                    {sortColumn === "date_ordered" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort("total_value")}>
                    Tổng tiền
                    {sortColumn === "total_value" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>{order.customer_id?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(order.date_ordered).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      {order.total_value.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(order._id)}>
                          Chi tiết
                        </Button>
                        {['pending', 'confirmed', 'cancelled'].includes(order.status) ? (
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order._id, value)}
                          >
                            <SelectTrigger className="w-[140px] border rounded-lg shadow-sm">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Chờ xử lý</SelectItem>
                              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                              <SelectItem value="cancelled">Đã hủy</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={`${statusColors[order.status as keyof typeof statusColors]} text-white`}>
                            {order.status === 'preparing' && 'Đang chuẩn bị'}
                            {order.status === 'ready' && 'Sẵn sàng xuất'}
                            {order.status === 'exported' && 'Đã xuất kho'}
                            {order.status === 'delivered' && 'Đã giao hàng'}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Không tìm thấy đơn hàng</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border rounded-lg shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <div className="text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border rounded-lg shadow-sm"
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">Chi tiết đơn hàng</DialogTitle>
              <DialogDescription>#{selectedOrder._id}</DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-8">
              <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="text-lg font-semibold">{selectedOrder.customer_id?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="text-lg font-semibold">{selectedOrder.customer_id?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="text-lg font-semibold">{new Date(selectedOrder.date_ordered).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <Badge className={`${statusColors[selectedOrder.status as keyof typeof statusColors]} text-white px-3 py-1 text-sm`}>
                    {selectedOrder.status === 'pending' && 'Chờ xử lý'}
                    {selectedOrder.status === 'preparing' && 'Đang chuẩn bị'}
                    {selectedOrder.status === 'ready' && 'Sẵn sàng xuất'}
                    {selectedOrder.status === 'exported' && 'Đã xuất kho'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày giao hàng</p>
                  <p className="text-lg font-semibold">{selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toLocaleDateString('vi-VN') : 'Đang cập nhật'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Sản phẩm</h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center">
                          <Image src={item.product_id.image} alt={item.product_id.name} width={50} height={50} className="mr-4" />
                          <div className="flex-1">
                            <p className="font-medium">{item.product_id.name}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{(item.quantity * item.price).toLocaleString()} VNĐ</p>
                          <p className="text-sm text-gray-500">{item.price.toLocaleString()} VNĐ / sản phẩm</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Không có thông tin sản phẩm</p>
                )}
              </div>

              <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <p className="text-xl font-semibold">Tổng cộng</p>
                <p className="text-2xl font-bold">{selectedOrder.total_value.toLocaleString()} VNĐ</p>
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
