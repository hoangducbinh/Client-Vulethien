'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import handleAPI from '@/services/handleAPI'


interface Supplier {
  _id: string;
  name: string;
  contact_info: string;
  address: string;
}

interface NewSupplier {
  name: string;
  contact_info: string;
  address: string;
}

interface StockEntry {
  _id: string;
  supplier_id: string;
  warehouse_id: string;
  date_received: string;
  total_value: number;
  payment: number;
  stockEntryDetails: StockEntryDetail[];
}

interface StockEntryDetail {
  _id: string;
  stock_entry_id: string;
  product_id: string;
  quantity_received: number;
  quantity_ordered: number;
}

interface Warehouse {
  _id: string;
  name: string;
}

export default function InventoryPage() {
  
  
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [newSupplier, setNewSupplier] = useState<NewSupplier>({ name: '', contact_info: '', address: '' })
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [newRecord, setNewRecord] = useState({ date: '', supplier: '', items: [{ name: '', quantity: 0, price: 0 }] })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' })
  const [filterSupplier, setFilterSupplier] = useState('all')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const [stockEntries, setStockEntries] = useState([])
  const [selectedStockEntry, setSelectedStockEntry] = useState(null)
  const [isAddingStockEntry, setIsAddingStockEntry] = useState(false)
  const [newStockEntry, setNewStockEntry] = useState({
    supplier_id: '',
    warehouse_id: '',
    date_received: '',
    total_value: 0,
    payment: 0,
    stockEntryDetails: []
  })

  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProducts] = useState([])


  useEffect(() => {
    fetchSuppliers()
    fetchStockEntries()
    fetchWarehouses()
    fetchProducts()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await handleAPI('/warehouse/getAll', 'get')
      setWarehouses(response.data.warehouses)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await handleAPI('/product/getAll', 'get')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }


  const fetchStockEntries = async () => {
    try {
      const response = await handleAPI('/stockEntry/getAll', 'get')
      setStockEntries(response.data.stockEntries)
    } catch (error) {
      console.error('Error fetching stock entries:', error)
    }
  }


  const fetchSuppliers = async () => {
    try {
      const response = await handleAPI('/supplier/getAll','get')
      setSuppliers(response.data.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  const handleAddSupplier = async () => {
    try {
      const response = await handleAPI('/supplier/create', newSupplier, 'post')
      setSuppliers([...suppliers, response.data.data])
      setNewSupplier({ name: '', contact_info: '', address: '' })
    } catch (error) {
      console.error('Error adding supplier:', error)
    }
  }

  const handleEditSupplier = async (supplier: Supplier) => {
    setEditingSupplier(supplier)
  }

  const handleUpdateSupplier = async () => {
    if (!editingSupplier) return
    try {
      const response = await handleAPI(`/supplier/update`, editingSupplier, 'put')
      setSuppliers(suppliers.map(s => s._id === editingSupplier._id ? response.data.data : s))
      setEditingSupplier(null)
    } catch (error) {
      console.error('Error updating supplier:', error)
    }
  }
  const handleDeleteSupplier = async (supplierId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      try {
        await handleAPI(`/supplier/delete/${supplierId}`, {}, 'delete')
        setSuppliers(suppliers.filter(s => s._id !== supplierId))
      } catch (error) {
        console.error('Error deleting supplier:', error)
      }
    }
  }


  const handleAddStockEntry = async () => {
    try {
      await handleAPI('/stockEntry/create', newStockEntry, 'post')
      setIsAddingStockEntry(false)
      setNewStockEntry({
        supplier_id: '',
        warehouse_id: '',
        date_received: '',
        total_value: 0,
        payment: 0,
        stockEntryDetails: []
      })
      fetchStockEntries()
    } catch (error) {
      console.error('Error adding stock entry:', error)
    }
  }
  const handleUpdateStockEntry = async () => {
    if (!selectedStockEntry) return
    try {
      await handleAPI(`/stockEntry/update/${selectedStockEntry._id}`, selectedStockEntry, 'put')
      setSelectedStockEntry(null)
      fetchStockEntries()
    } catch (error) {
      console.error('Error updating stock entry:', error)
    }
  }

  const handleDeleteStockEntry = async (stockEntryId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu nhập này?')) {
      try {
        await handleAPI(`/stockEntry/delete/${stockEntryId}`, {}, 'delete')
        fetchStockEntries()
      } catch (error) {
        console.error('Error deleting stock entry:', error)
      }
    }
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý nhập hàng</h1>
      
      <Tabs defaultValue="stockEntries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stockEntries">Phiếu nhập</TabsTrigger>
          <TabsTrigger value="suppliers">Nhà cung cấp</TabsTrigger>
        </TabsList>
        <TabsContent value="stockEntries" className="space-y-4">
          <div className="flex justify-between items-center">
            <Button onClick={() => setIsAddingStockEntry(true)}>
              <Plus className="mr-2 h-4 w-4" /> Thêm phiếu nhập mới
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày nhập</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Kho</TableHead>
                <TableHead>Tổng giá trị</TableHead>
                <TableHead>Đã thanh toán</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockEntries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{new Date(entry.date_received).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.supplier_id.name}</TableCell>
                  <TableCell>{entry.warehouse_id.name}</TableCell>
                  <TableCell>{entry.total_value.toLocaleString()} VND</TableCell>
                  <TableCell>{entry.payment.toLocaleString()} VND</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStockEntry(entry)}>
                      Chi tiết
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteStockEntry(entry._id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>


        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý nhà cung cấp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Danh sách nhà cung cấp</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Thêm nhà cung cấp
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Tên
                        </Label>
                        <Input
                          id="name"
                          value={newSupplier.name}
                          onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact_info" className="text-right">
                          Thông tin liên hệ
                        </Label>
                        <Input
                          id="contact_info"
                          value={newSupplier.contact_info}
                          onChange={(e) => setNewSupplier({...newSupplier, contact_info: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Địa chỉ
                        </Label>
                        <Input
                          id="address"
                          value={newSupplier.address}
                          onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddSupplier}>Thêm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên nhà cung cấp</TableHead>
                    <TableHead>Thông tin liên hệ</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier._id}>
                      <TableCell>{supplier._id}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contact_info}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditSupplier(supplier)}>
                          <Edit className="h-4 w-4 mr-1" /> Sửa
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSupplier(supplier._id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>

      
       {/* Edit Supplier Dialog */}
       {editingSupplier && (
        <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="edit-name"
                  value={editingSupplier.name}
                  onChange={(e) => setEditingSupplier({...editingSupplier, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact_info" className="text-right">
                  Thông tin liên hệ
                </Label>
                <Input
                  id="edit-contact_info"
                  value={editingSupplier.contact_info}
                  onChange={(e) => setEditingSupplier({...editingSupplier, contact_info: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Địa chỉ
                </Label>
                <Input
                  id="edit-address"
                  value={editingSupplier.address}
                  onChange={(e) => setEditingSupplier({...editingSupplier, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateSupplier}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


{/* Dialog for adding new stock entry */}
<Dialog open={isAddingStockEntry} onOpenChange={setIsAddingStockEntry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm phiếu nhập mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">Nhà cung cấp</Label>
              <Select
                value={newStockEntry.supplier_id}
                onValueChange={(value) => setNewStockEntry({...newStockEntry, supplier_id: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier._id} value={supplier._id}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warehouse" className="text-right">Kho</Label>
              <Select
                value={newStockEntry.warehouse_id}
                onValueChange={(value) => setNewStockEntry({...newStockEntry, warehouse_id: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn kho" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse._id} value={warehouse._id}>{warehouse.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_received" className="text-right">Ngày nhận</Label>
              <Input
                id="date_received"
                type="date"
                value={newStockEntry.date_received}
                onChange={(e) => setNewStockEntry({...newStockEntry, date_received: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_value" className="text-right">Tổng giá trị</Label>
              <Input
                id="total_value"
                type="number"
                value={newStockEntry.total_value}
                onChange={(e) => setNewStockEntry({...newStockEntry, total_value: parseFloat(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment" className="text-right">Đã thanh toán</Label>
              <Input
                id="payment"
                type="number"
                value={newStockEntry.payment}
                onChange={(e) => setNewStockEntry({...newStockEntry, payment: parseFloat(e.target.value)})}
                className="col-span-3"
              />
            </div>
            {/* Add fields for stock entry details */}
            {newStockEntry.stockEntryDetails.map((detail, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`product-${index}`} className="text-right">Sản phẩm {index + 1}</Label>
                <Select
                  value={detail.product_id}
                  onValueChange={(value) => {
                    const updatedDetails = [...newStockEntry.stockEntryDetails];
                    updatedDetails[index].product_id = value;
                    setNewStockEntry({...newStockEntry, stockEntryDetails: updatedDetails});
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>{product.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Số lượng"
                  value={detail.quantity_received}
                  onChange={(e) => {
                    const updatedDetails = [...newStockEntry.stockEntryDetails];
                    updatedDetails[index].quantity_received = parseInt(e.target.value);
                    setNewStockEntry({...newStockEntry, stockEntryDetails: updatedDetails});
                  }}
                  className="col-span-3"
                />
              </div>
            ))}
            <Button onClick={() => setNewStockEntry({
              ...newStockEntry,
              stockEntryDetails: [...newStockEntry.stockEntryDetails, { product_id: '', quantity_received: 0 }]
            })}>
              Thêm sản phẩm
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStockEntry}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}