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
import { toast } from "react-toastify"
import { Card } from "@/components/ui/card";

const orderStatuses = ["Mới", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"]

const statusColors = {
  "Mới": "bg-blue-500",
  "Đã xác nhận": "bg-green-500",
  "Đang giao": "bg-purple-500",
  "Đã giao": "bg-gray-500",
  "Đã hủy": "bg-red-500",
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
      const response = await mutateAPI(`/order/update/${orderId}`, { status: newStatus }, 'put');
      if (response.data) {
        setSelectedOrder(response.data);
        mutate(); // Refresh the order list
        toast.success('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
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
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
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
                      <Badge className={`${statusColors[order.status as keyof typeof statusColors]} text-white`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(order._id)}>
                          Chi tiết
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order._id, value)}
                        >
                          <SelectTrigger className="w-[140px] border rounded-lg shadow-sm">
                            <SelectValue placeholder="Cập nhật" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatuses.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng #{selectedOrder._id}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h4 className="font-semibold">Khách hàng:</h4>
                <p>{selectedOrder.customer_id?.name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Ngày đặt hàng:</h4>
                <p>{new Date(selectedOrder.date_ordered).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <h4 className="font-semibold">Trạng thái:</h4>
                <Badge className={`${statusColors[selectedOrder.status as keyof typeof statusColors]} text-white`}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold">Tổng tiền:</h4>
                <p>{selectedOrder.total_value.toLocaleString()} VNĐ</p>
              </div>
              <div>
                <h4 className="font-semibold">Sản phẩm:</h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {selectedOrder.items.map((item: any, index: any) => (
                      <li key={index}>
                        {item.product_id.name} - Số lượng: {item.quantity} - Giá: {item.price.toLocaleString()} VNĐ
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có thông tin sản phẩm</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}