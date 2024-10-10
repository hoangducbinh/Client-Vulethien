"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit2, Trash2, Eye, Search, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from "lucide-react"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: "Active" | "Inactive"
  totalPurchases: number
  avatar?: string
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "0123456789", address: "123 Main St, City", status: "Active", totalPurchases: 1500, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "0987654321", address: "456 Elm St, Town", status: "Inactive", totalPurchases: 750, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "0123498765", address: "789 Oak St, Village", status: "Active", totalPurchases: 2200, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "Diana Ross", email: "diana@example.com", phone: "0987612345", address: "101 Pine St, County", status: "Active", totalPurchases: 3000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "Edward Norton", email: "edward@example.com", phone: "0123987456", address: "202 Maple St, State", status: "Inactive", totalPurchases: 500, avatar: "/placeholder.svg?height=40&width=40" },
  ])
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({ name: "", email: "", phone: "", address: "", status: "Active", totalPurchases: 0 })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 5

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage)

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      setCustomers([...customers, { ...newCustomer, id: customers.length + 1, avatar: "/placeholder.svg?height=40&width=40" }])
      setNewCustomer({ name: "", email: "", phone: "", address: "", status: "Active", totalPurchases: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteCustomer = (customerId: number) => {
    setCustomers(customers.filter(cust => cust.id !== customerId))
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailDialogOpen(true)
  }

  const handleEditCustomer = (editedCustomer: Customer) => {
    setCustomers(customers.map(cust => cust.id === editedCustomer.id ? editedCustomer : cust))
    setIsDetailDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quản lý khách hàng</CardTitle>
          <CardDescription>Xem và quản lý thông tin khách hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Tìm kiếm khách hàng..."
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
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Thêm khách hàng</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm khách hàng mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Tên</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleAddCustomer}>Thêm khách hàng</Button>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng mua hàng</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={customer.avatar} alt={customer.name} />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.totalPurchases.toLocaleString()} đ</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(customer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(customer)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
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
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                      <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{selectedCustomer.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={selectedCustomer.status === "Active" ? "default" : "secondary"}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="font-bold">Tổng mua hàng</Label>
                      <p>{selectedCustomer.totalPurchases.toLocaleString()} đ</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="edit">
                <div className="space-y-4 py-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-name" className="text-right">Tên</Label>
                      <Input
                        id="edit-name"
                        value={selectedCustomer.name}
                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                        className="col-span-3"
                      />
                    
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-email" className="text-right">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={selectedCustomer.email}
                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-phone" className="text-right">Số điện thoại</Label>
                      <Input
                        id="edit-phone"
                        value={selectedCustomer.phone}
                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-address" className="text-right">Địa chỉ</Label>
                      <Input
                        id="edit-address"
                        value={selectedCustomer.address}
                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, address: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleEditCustomer(selectedCustomer)}>Lưu thay đổi</Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}