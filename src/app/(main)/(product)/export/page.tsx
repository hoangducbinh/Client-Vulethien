"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, ChevronLeft, ChevronRight, FileText, Trash2, Calendar, User, Package } from "lucide-react"

interface InventoryOutbound {
  id: string
  date: string
  recipient: string
  status: "Pending" | "Completed" | "Cancelled"
  totalItems: number
  totalValue: number
}

interface InventoryItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

export default function InventoryOutboundManagement() {
  const [outbounds, setOutbounds] = useState<InventoryOutbound[]>([
    { id: "OUT001", date: "2024-03-10", recipient: "Công ty A", status: "Completed", totalItems: 50, totalValue: 5000000 },
    { id: "OUT002", date: "2024-03-11", recipient: "Cửa hàng B", status: "Pending", totalItems: 30, totalValue: 3000000 },
    { id: "OUT003", date: "2024-03-12", recipient: "Đại lý C", status: "Cancelled", totalItems: 20, totalValue: 2000000 },
    { id: "OUT004", date: "2024-03-13", recipient: "Khách hàng D", status: "Completed", totalItems: 40, totalValue: 4000000 },
    { id: "OUT005", date: "2024-03-14", recipient: "Công ty E", status: "Pending", totalItems: 60, totalValue: 6000000 },
  ])
  const [newOutbound, setNewOutbound] = useState<Omit<InventoryOutbound, "id" | "totalItems" | "totalValue">>({ date: "", recipient: "", status: "Pending" })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedOutbound, setSelectedOutbound] = useState<InventoryOutbound | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const outboundsPerPage = 5

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: "ITEM001", name: "Sản phẩm A", quantity: 100, unitPrice: 100000 },
    { id: "ITEM002", name: "Sản phẩm B", quantity: 200, unitPrice: 50000 },
    { id: "ITEM003", name: "Sản phẩm C", quantity: 150, unitPrice: 75000 },
  ])
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([])

  const filteredOutbounds = outbounds.filter(outbound =>
    outbound.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outbound.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outbound.date.includes(searchTerm)
  )

  const indexOfLastOutbound = currentPage * outboundsPerPage
  const indexOfFirstOutbound = indexOfLastOutbound - outboundsPerPage
  const currentOutbounds = filteredOutbounds.slice(indexOfFirstOutbound, indexOfLastOutbound)

  const totalPages = Math.ceil(filteredOutbounds.length / outboundsPerPage)

  const handleAddOutbound = () => {
    if (newOutbound.date && newOutbound.recipient && selectedItems.length > 0) {
      const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalValue = selectedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
      const newId = `OUT${(outbounds.length + 1).toString().padStart(3, '0')}`
      setOutbounds([...outbounds, { ...newOutbound, id: newId, totalItems, totalValue }])
      setNewOutbound({ date: "", recipient: "", status: "Pending" })
      setSelectedItems([])
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteOutbound = (outboundId: string) => {
    setOutbounds(outbounds.filter(outbound => outbound.id !== outboundId))
  }

  const handleViewDetails = (outbound: InventoryOutbound) => {
    setSelectedOutbound(outbound)
    setIsDetailDialogOpen(true)
  }

  const handleAddItem = (item: InventoryItem) => {
    const existingItem = selectedItems.find(i => i.id === item.id)
    if (existingItem) {
      setSelectedItems(selectedItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId))
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quản lý xuất kho</CardTitle>
          <CardDescription>Xem và quản lý các phiếu xuất kho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Tìm kiếm phiếu xuất kho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Tạo phiếu xuất kho</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tạo phiếu xuất kho mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Ngày xuất</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newOutbound.date}
                      onChange={(e) => setNewOutbound({ ...newOutbound, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recipient" className="text-right">Người nhận</Label>
                    <Input
                      id="recipient"
                      value={newOutbound.recipient}
                      onChange={(e) => setNewOutbound({ ...newOutbound, recipient: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Trạng thái</Label>
                    <Select onValueChange={(value) => setNewOutbound({ ...newOutbound, status: value as "Pending" | "Completed" | "Cancelled" })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Đang chờ</SelectItem>
                        <SelectItem value="Completed">Hoàn thành</SelectItem>
                        <SelectItem value="Cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Sản phẩm</Label>
                    <div className="col-span-3 space-y-2">
                      {inventoryItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <Button variant="outline" size="sm" onClick={() => handleAddItem(item)}>Thêm</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Đã chọn</Label>
                    <div className="col-span-3 space-y-2">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span>{item.name} (x{item.quantity})</span>
                          <Button variant="outline" size="sm" onClick={() => handleRemoveItem(item.id)}>Xóa</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddOutbound}>Tạo phiếu xuất kho</Button>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã phiếu</TableHead>
                <TableHead>Ngày xuất</TableHead>
                <TableHead>Người nhận</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng SP</TableHead>
                <TableHead>Tổng giá trị</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOutbounds.map((outbound) => (
                <TableRow key={outbound.id}>
                  <TableCell className="font-medium">{outbound.id}</TableCell>
                  <TableCell>{outbound.date}</TableCell>
                  <TableCell>{outbound.recipient}</TableCell>
                  <TableCell>
                    <Badge variant={outbound.status === "Completed" ? "default" : outbound.status === "Pending" ? "secondary" : "destructive"}>
                      {outbound.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{outbound.totalItems}</TableCell>
                  <TableCell>{outbound.totalValue.toLocaleString()} đ</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(outbound)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteOutbound(outbound.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
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
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu xuất kho</DialogTitle>
          </DialogHeader>
          {selectedOutbound && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Ngày xuất: {selectedOutbound.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Người nhận: {selectedOutbound.recipient}</span>
              
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={selectedOutbound.status === "Completed" ? "default" : selectedOutbound.status === "Pending" ? "secondary" : "destructive"}>
                  {selectedOutbound.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Tổng số sản phẩm: {selectedOutbound.totalItems}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">Tổng giá trị: {selectedOutbound.totalValue.toLocaleString()} đ</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}