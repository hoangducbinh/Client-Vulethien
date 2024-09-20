'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function InventoryManagement() {
  const [newWarehouse, setNewWarehouse] = useState({ name: '', address: '', capacity: '' })
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  
  // Dummy data for demonstration
  const products = [
    { id: 1, name: 'Sản phẩm A', quantity: 100, location: 'Kho 1', minStock: 50, maxStock: 200 },
    { id: 2, name: 'Sản phẩm B', quantity: 150, location: 'Kho 2', minStock: 75, maxStock: 250 },
    { id: 3, name: 'Sản phẩm C', quantity: 75, location: 'Kho 1', minStock: 25, maxStock: 150 },
  ]
  
  const inventoryData = [
    { name: 'T1', 'Sản phẩm A': 100, 'Sản phẩm B': 150, 'Sản phẩm C': 75 },
    { name: 'T2', 'Sản phẩm A': 120, 'Sản phẩm B': 140, 'Sản phẩm C': 80 },
    { name: 'T3', 'Sản phẩm A': 110, 'Sản phẩm B': 160, 'Sản phẩm C': 90 },
    { name: 'T4', 'Sản phẩm A': 130, 'Sản phẩm B': 155, 'Sản phẩm C': 85 },
    { name: 'T5', 'Sản phẩm A': 125, 'Sản phẩm B': 165, 'Sản phẩm C': 95 },
    { name: 'T6', 'Sản phẩm A': 135, 'Sản phẩm B': 170, 'Sản phẩm C': 100 },
  ]

  const handleAddWarehouse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Thêm kho mới:', newWarehouse)
    // Xử lý thêm kho mới ở đây
    setNewWarehouse({ name: '', address: '', capacity: '' })
  }

  const filteredProducts = products.filter(product => 
    (selectedProduct === 'all' || product.name === selectedProduct) &&
    (selectedWarehouse === 'all' || product.location === selectedWarehouse)
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý kho hàng</h1>
      
      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="add-warehouse">Thêm kho</TabsTrigger>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>Xem tất cả sản phẩm trong kho</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Vị trí</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-warehouse">
          <Card>
            <CardHeader>
              <CardTitle>Thêm kho hàng mới</CardTitle>
              <CardDescription>Nhập thông tin để thêm kho mới</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddWarehouse} className="space-y-4">
                <div>
                  <Label htmlFor="warehouse-name">Tên kho</Label>
                  <Input 
                    id="warehouse-name" 
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                    placeholder="Nhập tên kho" 
                  />
                </div>
                <div>
                  <Label htmlFor="warehouse-address">Địa chỉ</Label>
                  <Input 
                    id="warehouse-address" 
                    value={newWarehouse.address}
                    onChange={(e) => setNewWarehouse({...newWarehouse, address: e.target.value})}
                    placeholder="Nhập địa chỉ kho" 
                  />
                </div>
                <div>
                  <Label htmlFor="warehouse-capacity">Sức chứa</Label>
                  <Input 
                    id="warehouse-capacity" 
                    type="number" 
                    value={newWarehouse.capacity}
                    onChange={(e) => setNewWarehouse({...newWarehouse, capacity: e.target.value})}
                    placeholder="Nhập sức chứa kho" 
                  />
                </div>
                <Button type="submit">Thêm kho</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quản lý tồn kho</CardTitle>
              <CardDescription>Xem và phân tích tồn kho chi tiết</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <Label htmlFor="product-filter">Lọc theo sản phẩm</Label>
                  <Select onValueChange={setSelectedProduct} defaultValue={selectedProduct}>
                    <SelectTrigger id="product-filter">
                      <SelectValue placeholder="Chọn sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/2">
                  <Label htmlFor="warehouse-filter">Lọc theo kho</Label>
                  <Select onValueChange={setSelectedWarehouse} defaultValue={selectedWarehouse}>
                    <SelectTrigger id="warehouse-filter">
                      <SelectValue placeholder="Chọn kho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả kho</SelectItem>
                      <SelectItem value="Kho 1">Kho 1</SelectItem>
                      <SelectItem value="Kho 2">Kho 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Số lượng hiện tại</TableHead>
                    <TableHead>Tồn kho tối thiểu</TableHead>
                    <TableHead>Tồn kho tối đa</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>{product.maxStock}</TableCell>
                      <TableCell>{product.location}</TableCell>
                      <TableCell>
                        {product.quantity < product.minStock ? (
                          <span className="text-red-500">Cần nhập thêm</span>
                        ) : product.quantity > product.maxStock ? (
                          <span className="text-yellow-500">Dư thừa</span>
                        ) : (
                          <span className="text-green-500">Bình thường</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ tồn kho theo thời gian</CardTitle>
              <CardDescription>Theo dõi xu hướng tồn kho của các sản phẩm qua các tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Sản phẩm A" fill="#8884d8" />
                    <Bar dataKey="Sản phẩm B" fill="#82ca9d" />
                    <Bar dataKey="Sản phẩm C" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Sản phẩm A" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Sản phẩm B" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Sản phẩm C" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}