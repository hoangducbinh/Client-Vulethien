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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Checkbox } from "@/components/ui/checkbox"


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
  supplier_id: Supplier;
  warehouse_id: Warehouse;
  date_received: string;
  total_value: number;
  stockEntryDetails: StockEntryDetail[];
}

interface StockEntryDetail {
  _id: string;
  stock_entry_id: string;
  product_id: string;
  quantity_received: number;
  quantity_ordered: number;
  import_price: number;
}

interface Warehouse {
  _id: string;
  name: string;
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}


export default function InventoryPage() {
  
  
 
  const [newSupplier, setNewSupplier] = useState<NewSupplier>({ name: '', contact_info: '', address: '' })
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([])
  const [isAddingStockEntry, setIsAddingStockEntry] = useState(false)
  const [newStockEntry, setNewStockEntry] = useState<StockEntry>({
    _id: '',
    supplier_id: { _id: '', name: '', contact_info: '', address: '' },
    warehouse_id: { _id: '', name: '' },
    date_received: '',
    total_value: 0,
    stockEntryDetails: []
  })

  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filterSupplier, setFilterSupplier] = useState('all')
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')


  useEffect(() => {
    fetchSuppliers()
    fetchStockEntries()
    fetchWarehouses()
    fetchProducts()
  }, [])


  const getPaymentStatus = (totalValue: number, payment: number) => {
    if (payment >= totalValue) return 'Đã thanh toán đủ';
    if (payment > 0) return 'Còn nợ';
    return 'Chưa thanh toán';
  }


  const fetchWarehouses = async () => {
    try {
      const response = await handleAPI('/warehouse/getAll', 'get')
      setWarehouses(response.data.data)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await handleAPI('/product/getAll', 'get')
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }


  const fetchStockEntries = async () => {
    try {
      const response = await handleAPI('/stockEntry/getAll', 'get')
      console.log(response.data.stockEntries)
      setStockEntries(
        response.data.stockEntries  
      )
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
      const response = await handleAPI('/stockEntry/create', {
        supplier_id: newStockEntry.supplier_id._id,
        warehouse_id: newStockEntry.warehouse_id._id,
        date_received: newStockEntry.date_received,
        total_value: newStockEntry.total_value,
        stockEntryDetails: newStockEntry.stockEntryDetails.map(detail => ({
          product_id: detail.product_id,
          quantity_received: detail.quantity_received,
          import_price: detail.import_price
        }))
      }, 'post');

      if (response.status === 201) {
        setIsAddingStockEntry(false);
        setNewStockEntry({
          _id: '',
          supplier_id: { _id: '', name: '', contact_info: '', address: '' },
          warehouse_id: { _id: '', name: '' },
          date_received: '',
          total_value: 0,
          stockEntryDetails: []
        });
        fetchStockEntries();
      }
    } catch (error) {
      console.error('Error adding stock entry:', error);
    }
  };


  const handleDeleteStockEntry = async (stockEntryId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu nhập này?')) {
      try {
        await handleAPI(`/stockEntry/delete/${stockEntryId}`, {}, 'delete')
        fetchStockEntries()
      } catch (error) {
        console.error('Error deleting stock entry:', error)
      }
    }
  }

  const filteredStockEntries = stockEntries?.filter(entry => 
    (filterSupplier === 'all' || entry.supplier_id._id === filterSupplier) &&
    (filterWarehouse === 'all' || entry.warehouse_id._id === filterWarehouse) &&
    (filterPaymentStatus === 'all' || getPaymentStatus(entry.total_value, entry.payment) === filterPaymentStatus) &&
    (entry.supplier_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     entry.warehouse_id.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredStockEntries?.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)




  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý nhập hàng</h1>
      
      <Tabs defaultValue="stockEntries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stockEntries">Phiếu nhập</TabsTrigger>
          <TabsTrigger value="suppliers">Nhà cung cấp</TabsTrigger>
        </TabsList>
        <TabsContent value="stockEntries" className="space-y-4">
        <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Tìm kiếm theo nhà cung cấp hoặc kho"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter-supplier">Nhà cung cấp</Label>
              <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                <SelectTrigger id="filter-supplier">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier._id} value={supplier._id}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-warehouse">Kho</Label>
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger id="filter-warehouse">
                  <SelectValue placeholder="Chọn kho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {warehouses && warehouses.map((warehouse) => (
                    <SelectItem key={warehouse._id} value={warehouse._id}>{warehouse.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-payment-status">Trạng thái thanh toán</Label>
              <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                <SelectTrigger id="filter-payment-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Đã thanh toán đủ">Đã thanh toán đủ</SelectItem>
                  <SelectItem value="Còn nợ">Còn nợ</SelectItem>
                  <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Danh sách phiếu nhập</h2>
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
            <TableHead>Trạng thái thanh toán</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {stockEntries && stockEntries.map((entry) => (
        <TableRow key={entry._id}>
          <TableCell>{entry.supplier_id.name}</TableCell>
          <TableCell>{entry.warehouse_id.name}</TableCell>
          <TableCell>{new Date(entry.date_received).toLocaleDateString()}</TableCell>
          <TableCell>{entry.total_value.toLocaleString()} VND</TableCell>
          
          <TableCell>{getPaymentStatus(entry.total_value, entry.payment)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
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

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => paginate(currentPage - 1)} aria-disabled={currentPage === 1} />
            </PaginationItem>
            {Array.from({ length: Math.ceil(filteredStockEntries?.length / itemsPerPage) }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink onClick={() => paginate(index + 1)} isActive={currentPage === index + 1}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => paginate(currentPage + 1)}
                aria-disabled={currentPage === Math.ceil(filteredStockEntries?.length / itemsPerPage)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

     
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
                      <DialogDescription></DialogDescription>
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
              <DialogDescription></DialogDescription>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Thêm phiếu nhập mới</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">Nhà cung cấp</Label>
              <Select
                value={newStockEntry.supplier_id._id}
                onValueChange={(value) => setNewStockEntry({...newStockEntry, supplier_id: { ...newStockEntry.supplier_id, _id: value }})}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier._id} value={supplier._id}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="warehouse">Kho</Label>
              <Select
                value={newStockEntry.warehouse_id._id}
                onValueChange={(value) => setNewStockEntry({...newStockEntry, warehouse_id: { ...newStockEntry.warehouse_id, _id: value }})}
              >
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Chọn kho" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses && warehouses.map((warehouse) => (
                    <SelectItem key={warehouse._id} value={warehouse._id}>{warehouse.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date_received">Ngày nhận</Label>
              <Input
                id="date_received"
                type="date"
                value={newStockEntry.date_received}
                onChange={(e) => setNewStockEntry({...newStockEntry, date_received: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="total_value">Tổng giá trị</Label>
              <Input
                id="total_value"
                type="number"
                value={newStockEntry.total_value}
                onChange={(e) => setNewStockEntry({...newStockEntry, total_value: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label>Chi tiết sản phẩm</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newStockEntry.stockEntryDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={detail.product_id}
                        onValueChange={(value) => {
                          const updatedDetails = [...newStockEntry.stockEntryDetails];
                          updatedDetails[index].product_id = value;
                          setNewStockEntry({...newStockEntry, stockEntryDetails: updatedDetails});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product: IProduct) => (
                            <SelectItem key={product._id} value={product._id}>{product.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={detail.quantity_received}
                        onChange={(e) => {
                          const updatedDetails = [...newStockEntry.stockEntryDetails];
                          updatedDetails[index].quantity_received = parseInt(e.target.value);
                          setNewStockEntry({...newStockEntry, stockEntryDetails: updatedDetails});
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={detail.import_price}
                        onChange={(e) => {
                          const updatedDetails = [...newStockEntry.stockEntryDetails];
                          updatedDetails[index].import_price = parseFloat(e.target.value);
                          setNewStockEntry({...newStockEntry, stockEntryDetails: updatedDetails});
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {(detail.quantity_received * detail.import_price).toLocaleString()} VND
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              onClick={() => setNewStockEntry({
                ...newStockEntry,
                stockEntryDetails: [...newStockEntry.stockEntryDetails, 
                  { product_id: '', 
                    quantity_received: 0, 
                    import_price: 0, 
                    quantity_ordered: 0, 
                    stock_entry_id: '',
                    _id: '' }]
              })}
              className="mt-2"
            >
              Thêm sản phẩm
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStockEntry}>Thêm phiếu nhập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}