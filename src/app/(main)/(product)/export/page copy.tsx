"use client"

import { useState, useEffect } from 'react'
import { Search, Filter, Download, ChevronDown, Loader2, X, Check, Truck, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import useAPI, { mutateAPI } from "@/services/handleAPI"
import { mutate } from 'swr'

type Product = {
  id: number
  name: string
  quantity: number
  prepared: boolean
}

type ExportOrder = {
  _id: string
  customer_id: {
    name: string
  }
  date_ordered: string
  status: 'pending' | 'preparing' | 'ready' | 'exported'
  products: Product[]
  warehouse: string
  responsiblePerson: string
}

function ExportOrderDetailsDialog({ exportOrder, onProductPreparedChange, onConfirmExport, onStatusChange }: { 
  exportOrder: ExportOrder; 
  onProductPreparedChange: (orderId: string, productId: number, prepared: boolean) => void;
  onConfirmExport: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: ExportOrder['status']) => void;
}) {
  const allPrepared = (exportOrder.products || []).every(product => product.prepared);

  return (
    <>
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="text-2xl font-bold">Chi tiết phiếu xuất kho #{exportOrder._id}</DialogTitle>
        <DialogDescription className="text-lg mt-2">
          Xuất kho cho khách hàng: <span className="font-semibold">{exportOrder.customer_id.name}</span>
        </DialogDescription>
      </DialogHeader>
      <div className="py-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Thông tin chung</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày xuất:</span>
                <span className="font-medium">{new Date(exportOrder.date_ordered).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kho xuất:</span>
                <span className="font-medium">{exportOrder.warehouse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Người phụ trách:</span>
                <span className="font-medium">{exportOrder.responsiblePerson}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <ExportStatusBadge 
                  status={exportOrder.status} 
                  orderId={exportOrder._id}
                  onStatusChange={onStatusChange}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Danh sách sản phẩm</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {(exportOrder.products || []).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500 ml-2">x{product.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={product.prepared}
                      onCheckedChange={(checked) => onProductPreparedChange(exportOrder._id, product.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Đã chuẩn bị
                    </label>  
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <DialogFooter className="border-t pt-4">
        <Button 
          onClick={() => onConfirmExport(exportOrder._id)} 
          disabled={!allPrepared || exportOrder.status === 'exported'}
          className="w-full sm:w-auto"
        >
          {exportOrder.status === 'exported' ? 'Đã xuất kho' : 'Xác nhận xuất kho'}
        </Button>
      </DialogFooter>
    </>
  )
}








function ExportStatusBadge({ status, orderId, onStatusChange }: { 
  status: ExportOrder['status']; 
  orderId: string;
  onStatusChange: (orderId: string, newStatus: ExportOrder['status']) => void;
}) {
  const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    preparing: { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-800' },
    ready: { label: 'Sẵn sàng xuất', color: 'bg-green-100 text-green-800' },
    exported: { label: 'Đã xuất kho', color: 'bg-gray-100 text-gray-800' },
  }

  const { label, color } = statusConfig[status] || { label: status, color: 'bg-red-100 text-red-800' }

  return (
    <Select
      value={status}
      onValueChange={(newStatus) => onStatusChange(orderId, newStatus as ExportOrder['status'])}
    >
      <SelectTrigger className={`w-[140px] ${color}`}>
        <SelectValue>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([value, { label }]) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function QuanLyXuatKho() {
  const { data: exportOrders, isLoading, isError } = useAPI('/order/getAll', 'get', {
    page: 1,
    limit: 50,
    sort: 'date_ordered',
    order: 'desc',
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: orderDetails, isLoading: isOrderDetailsLoading, isError: isOrderDetailsError } = useAPI(
    selectedOrderId ? `/order/getOrderDetails/${selectedOrderId}` : '', 
    'get'
  );

  const [filteredExportOrders, setFilteredExportOrders] = useState<ExportOrder[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  const { toast } = useToast()
  const [localOrderDetails, setLocalOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (exportOrders) {
      setFilteredExportOrders(exportOrders.data.orders)
    }
  }, [exportOrders])

  const handleSearch = () => {
    const filtered = exportOrders.data.orders.filter((order: ExportOrder) => 
      order.customer_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toString().includes(searchTerm)
    )
    setFilteredExportOrders(filtered)
    setCurrentPage(1)
  }

  const handleFilter = (status: string) => {
    setStatusFilter(status)
    const filtered = status === 'all' 
      ? exportOrders.data.orders 
      : exportOrders.data.orders.filter((order: ExportOrder) => order.status === status)
    setFilteredExportOrders(filtered)
    setCurrentPage(1)
  }

  const handleStatusChange = async (orderId: string, newStatus: ExportOrder['status']) => {
    try {
      // Gọi API để cập nhật trạng thái
      const response = await mutateAPI('/order/updateOrderStatus', { orderId, status: newStatus }, 'put');
  
      if (response.message === "Cập nhật trạng thái đơn hàng thành công") {
        // Cập nhật state local
        setFilteredExportOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
  
        // Cập nhật localOrderDetails nếu đang mở dialog
        if (selectedOrderId === orderId) {
          setLocalOrderDetails((prevDetails: any) => ({
            ...prevDetails,
            status: newStatus
          }));
        }
  
        // Revalidate các endpoint liên quan
        mutate('/order/getAll');
        mutate(`/order/getOrderDetails/${orderId}`);
  
        toast({
          title: "Cập nhật trạng thái thành công",
          description: `Trạng thái của đơn hàng #${orderId} đã được cập nhật thành ${newStatus}.`,
        });
      } else {
        throw new Error(response.message || "Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (error) {
      console.error("Failed to update order status", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái đơn hàng.",
        variant: "destructive",
      });
    }
  };



  const handleProductPreparedChange = async (orderId: string, productId: number, prepared: boolean) => {
    // Cập nhật state local ngay lập tức
    setLocalOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      products: prevDetails.products.map((product: any) =>
        product.id === productId ? { ...product, prepared } : product
      ),
      status: prevDetails.products.every((p: any) => p.id === productId ? prepared : p.prepared) ? 'ready' : 'preparing'
    }));
    try {
      // Gọi API để cập nhật trạng thái chuẩn bị sản phẩm
      await mutateAPI(`/order/updateProductPreparedStatus`, { orderId, productId, prepared }, 'put');

      // Update the local state
      setFilteredExportOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId
            ? {
                ...order,
                products: (order.products || []).map(product =>
                  product.id === productId ? { ...product, prepared } : product
                ),
                status: (order.products || []).every(p => p.id === productId ? prepared : p.prepared) ? 'ready' : 'preparing'
              }
            : order
        )
      );
      mutate('/order/getAll');
      mutate(`/order/getOrderDetails/${orderId}`);
      mutate(`/order/getOrderById/${orderId}`);
      mutate(`/order/updateProductPreparedStatus`);

      toast({
        title: prepared ? "Sản phẩm đã chuẩn bị" : "Sản phẩm chưa chuẩn bị",
        description: `Sản phẩm #${productId} trong phiếu xuất kho #${orderId} đã được cập nhật.`,
      });
    } catch (error) {
      console.error("Failed to update product prepared status", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái sản phẩm.",
      });
    }
  };

  // const handleConfirmExport = (orderId: string) => {
  //   setFilteredExportOrders(prevOrders => 
  //     prevOrders.map(order => 
  //       order._id === orderId ? { ...order, status: 'exported' } : order
  //     )
  //   )
  //   toast({
  //     title: "Xuất kho thành công",
  //     description: `Phiếu xuất kho #${orderId} đã được xác nhận xuất kho.`,
  //   })
  // }

  const handleConfirmExport = async (orderId: string) => {
    try {
      await mutateAPI('/order/updateOrderStatus', { orderId, status: 'exported' }, 'put');
      setFilteredExportOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: 'exported' } : order
        )
      );
      toast({
        title: "Xuất kho thành công",
        description: `Phiếu xuất kho #${orderId} đã được xác nhận xuất kho.`,
      });
      // Revalidate các endpoint liên quan
      mutate('/order/getAll');
      mutate(`/order/getOrderDetails/${orderId}`);
    } catch (error) {
      console.error("Failed to confirm export", error);
      toast({
        title: "Lỗi",
        description: "Không thể xác nhận xuất kho.",
        variant: "destructive",
      });
    }
  }


  const handleExport = () => {
    // Implement export logic here
    toast({
      title: "Xuất dữ liệu",
      description: "Dữ liệu xuất kho đã được xuất thành công.",
    })
  }

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentExportOrders = filteredExportOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = async (orderId: string) => {
    setSelectedOrderId(orderId);
    try {
      // Sử dụng mutateAPI để lấy chi tiết đơn hàng
      const response = await mutateAPI(`/order/getOrderDetails/${orderId}`, null, 'get');
      console.log(response); // Log để kiểm tra cấu trúc dữ liệu
  
      // Tìm đơn hàng trong currentExportOrders
      const selectedOrder = currentExportOrders.find(order => order._id === orderId);
      
      if (selectedOrder && response.data) {
        const orderDetailsData = Array.isArray(response.data) ? response.data : [response.data];
        setLocalOrderDetails({
          ...selectedOrder,
          products: orderDetailsData.map((detail: any) => ({
            id: detail.product_id._id,
            name: detail.product_id.name,
            quantity: detail.quantity,
            prepared: detail.prepared
          }))
        });
        setIsDialogOpen(true);
      } else {
        throw new Error('Order not found or details not available');
      }
    } catch (error) {
      console.error(`Error fetching order details: ${error}`);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin chi tiết đơn hàng.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <X className="h-6 w-6" />
              <p>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý Xuất Kho</h1>
        <Button onClick={handleExport} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" /> Xuất dữ liệu
        </Button>
      </div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên khách hàng hoặc mã phiếu xuất"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" /> Tìm kiếm
            </Button>
            <Select value={statusFilter} onValueChange={handleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                <SelectItem value="ready">Sẵn sàng xuất</SelectItem>
                <SelectItem value="exported">Đã xuất kho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã phiếu xuất</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Kho xuất</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentExportOrders.map(order => (
                <TableRow key={order._id}>
                  <TableCell>#{order._id}</TableCell>
                  <TableCell>{order.customer_id.name}</TableCell>
                  <TableCell>{new Date(order.date_ordered).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{order.warehouse || 'Đang cập nhật'}</TableCell>
                  <TableCell>
                  <ExportStatusBadge 
                    status={order.status} 
                    orderId={order._id}
                    onStatusChange={handleStatusChange}
                  />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(order._id)}>
                        <Eye className="h-4 w-4 mr-1" /> Chi tiết
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleConfirmExport(order._id)}
                        disabled={order.status !== 'ready'}
                      >
                        <Truck className="h-4 w-4  mr-1" /> Xuất kho
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Hiển thị {indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredExportOrders.length)} trên tổng số {filteredExportOrders.length} đơn hàng
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastOrder >= filteredExportOrders.length}
          >
            Sau
          </Button>
        </div>
      </div>
      
      {selectedOrderId && localOrderDetails && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[60%] max-h-[90vh] overflow-y-auto">
            <ExportOrderDetailsDialog
              exportOrder={localOrderDetails}
              onProductPreparedChange={handleProductPreparedChange}
              onConfirmExport={handleConfirmExport}
              onStatusChange={handleStatusChange}
            />
          </DialogContent>
        </Dialog>
      )}  

      {isOrderDetailsLoading && <p>Đang tải thông tin chi tiết đơn hàng...</p>}
      {isOrderDetailsError && <p>Có lỗi khi tải thông tin chi tiết đơn hàng.</p>}
    </div>
  )
}
