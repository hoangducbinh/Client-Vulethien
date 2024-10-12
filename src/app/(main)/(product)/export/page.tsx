"use client"

import { useState, useEffect } from 'react'
import { Search, Filter, Download, ChevronDown, Loader2, X, Check, Truck } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

type Product = {
  id: number
  name: string
  quantity: number
  prepared: boolean
}

type ExportOrder = {
  id: number
  customerName: string
  exportDate: string
  status: 'pending' | 'preparing' | 'ready' | 'exported'
  products: Product[]
  warehouse: string
  responsiblePerson: string
}

function ExportOrderDetailsDialog({ exportOrder, onProductPreparedChange, onConfirmExport }: { 
  exportOrder: ExportOrder; 
  onProductPreparedChange: (orderId: number, productId: number, prepared: boolean) => void;
  onConfirmExport: (orderId: number) => void;
}) {
  const allPrepared = exportOrder.products.every(product => product.prepared)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Chi tiết</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chi tiết phiếu xuất kho #{exportOrder.id}</DialogTitle>
          <DialogDescription>
            Xuất kho cho khách hàng {exportOrder.customerName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Ngày xuất:</span>
            <span className="col-span-3">{exportOrder.exportDate}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Kho xuất:</span>
            <span className="col-span-3">{exportOrder.warehouse}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Người phụ trách:</span>
            <span className="col-span-3">{exportOrder.responsiblePerson}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Trạng thái:</span>
            <span className="col-span-3">
              <ExportStatusBadge status={exportOrder.status} />
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium col-span-4">Sản phẩm:</span>
            <ul className="list-none pl-0 col-span-4 space-y-2">
              {exportOrder.products.map((product) => (
                <li key={product.id} className="flex items-center justify-between">
                  <span>{product.name} x{product.quantity}</span>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={product.prepared}
                      onCheckedChange={(checked) => onProductPreparedChange(exportOrder.id, product.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Đã chuẩn bị
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => onConfirmExport(exportOrder.id)} 
            disabled={!allPrepared || exportOrder.status === 'exported'}
          >
            {exportOrder.status === 'exported' ? 'Đã xuất kho' : 'Xác nhận xuất kho'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ExportStatusBadge({ status }: { status: ExportOrder['status'] }) {
  const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    preparing: { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-800' },
    ready: { label: 'Sẵn sàng xuất', color: 'bg-green-100 text-green-800' },
    exported: { label: 'Đã xuất kho', color: 'bg-gray-100 text-gray-800' },
  }

  const { label, color } = statusConfig[status]

  return (
    <Badge className={`${color} font-medium`}>
      {label}
    </Badge>
  )
}

export default function QuanLyXuatKho() {
  const [exportOrders, setExportOrders] = useState<ExportOrder[]>([])
  const [filteredExportOrders, setFilteredExportOrders] = useState<ExportOrder[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ordersPerPage = 10


  const { toast } = useToast()
  useEffect(() => {
    const fetchExportOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        const mockExportOrders: ExportOrder[] = Array.from({ length: 50 }, (_, index) => ({
          id: index + 1,
          customerName: `Khách hàng ${index + 1}`,
          exportDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
          status: ['pending', 'preparing', 'ready', 'exported'][Math.floor(Math.random() * 4)] as ExportOrder['status'],
          products: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, prodIndex) => ({
            id: prodIndex + 1,
            name: `Sản phẩm ${prodIndex + 1}`,
            quantity: Math.floor(Math.random() * 5) + 1,
            prepared: Math.random() > 0.5
          })),
          warehouse: ['Kho A', 'Kho B', 'Kho C'][Math.floor(Math.random() * 3)],
          responsiblePerson: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'][Math.floor(Math.random() * 3)]
        }))
        setExportOrders(mockExportOrders)
        setFilteredExportOrders(mockExportOrders)
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExportOrders()
  }, [])

  const handleSearch = () => {
    const filtered = exportOrders.filter(order => 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    )
    setFilteredExportOrders(filtered)
    setCurrentPage(1)
  }

  const handleFilter = (status: string) => {
    setStatusFilter(status)
    const filtered = status === 'all' 
      ? exportOrders 
      : exportOrders.filter(order => order.status === status)
    setFilteredExportOrders(filtered)
    setCurrentPage(1)
  }

  const handleProductPreparedChange = (orderId: number, productId: number, prepared: boolean) => {
    setExportOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId
          ? {
              ...order,
              products: order.products.map(product =>
                product.id === productId ? { ...product, prepared } : product
              ),
              status: order.products.every(p => p.id === productId ? prepared : p.prepared) ? 'ready' : 'preparing'
            }
          : order
      )
    )
    setFilteredExportOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId
          ? {
              ...order,
              products: order.products.map(product =>
                product.id === productId ? { ...product, prepared } : product
              ),
              status: order.products.every(p => p.id === productId ? prepared : p.prepared) ? 'ready' : 'preparing'
            }
          : order
      )
    )
    toast({
      title: prepared ? "Sản phẩm đã chuẩn bị" : "Sản phẩm chưa chuẩn bị",
      description: `Sản phẩm #${productId} trong phiếu xuất kho #${orderId} đã được cập nhật.`,
    })
  }

  const handleConfirmExport = (orderId: number) => {
    setExportOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'exported' } : order
      )
    )
    setFilteredExportOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'exported' } : order
      )
    )
    toast({
      title: "Xuất kho thành công",
      description: `Phiếu xuất kho #${orderId} đã được xác nhận xuất kho.`,
    })
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

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <X className="h-6 w-6" />
              <p>{error}</p>
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
            <Select  value={statusFilter} onValueChange={handleFilter}>
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
                <TableHead>Ngày xuất</TableHead>
                <TableHead>Kho xuất</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentExportOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.exportDate}</TableCell>
                  <TableCell>{order.warehouse}</TableCell>
                  <TableCell>
                    <ExportStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleConfirmExport(order.id)}>
                          <Truck className="mr-2 h-4 w-4" />
                          Xác nhận xuất kho
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <ExportOrderDetailsDialog 
                            exportOrder={order} 
                            onProductPreparedChange={handleProductPreparedChange}
                            onConfirmExport={handleConfirmExport}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
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
  )
}