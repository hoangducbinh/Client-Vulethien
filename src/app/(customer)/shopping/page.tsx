'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from 'lucide-react'

export default function ShoppingCart() {
  // Giả lập dữ liệu giỏ hàng
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Sản phẩm A", price: 100000, quantity: 2 },
    { id: 2, name: "Sản phẩm B", price: 150000, quantity: 1 },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
      
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Tổng</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price.toLocaleString()} ₫</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      min={1}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>{(item.price * item.quantity).toLocaleString()} ₫</TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <CardTitle>Tổng cộng</CardTitle>
          <CardTitle>{total.toLocaleString()} ₫</CardTitle>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <Button size="lg">Tiến hành thanh toán </Button>
      </div>
    </div>
  )
}