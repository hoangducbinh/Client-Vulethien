'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, ArrowUpDown, DollarSign } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAPI,{ mutateAPI} from '@/services/handleAPI'
import Modal from '@/app/components/Modal'
import LottieAnimation from '@/app/components/LottieAnimation'
import trash from '@/lottie/trash.json'
import successAnimation from '@/lottie/success.json';
import errorAnimation from '@/lottie/error.json';

import { useForm, Controller } from 'react-hook-form';


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
  payment: any;
  stockEntryDetails: StockEntryDetail[];
}


interface StockEntryDetail {
  _id: string;
  stock_entry_id: string;
  product_id: any;
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
    date_received: new Date().toISOString().split('T')[0],
    total_value: 0,
    payment: {
      amount: 0,
      status: '',
      method: '',
      last_amount: 0,
      last_method: ''
    },
    stockEntryDetails: []
  })
  const [selectedStockEntry, setSelectedStockEntry] = useState<StockEntry | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [stockEntryDetails, setStockEntryDetails] = useState<StockEntryDetail[]>([]);


  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filterSupplier, setFilterSupplier] = useState('all')
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')
  const [open, setOpen] = useState(false)
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState('');
  const [isModalOpenDeleteStockEntry, setIsModalOpenDeleteStockEntry] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const { data: suppliersData, isLoading: isLoadingSuppliers, mutate: mutateSuppliers } = useAPI('/supplier/getAll');
  const { data: stockEntriesData, isLoading: isLoadingStockEntries, mutate: mutateStockEntries } = useAPI('/stockEntry/getAll');
  const { data: warehousesData, isLoading: isLoadingWarehouses } = useAPI('/warehouse/getAll');
  const { data: productsData, isLoading: isLoadingProducts } = useAPI('/product/getAll');

  useEffect(() => {
    if (suppliersData) setSuppliers(suppliersData.data);
    if (stockEntriesData) setStockEntries(stockEntriesData.stockEntries);
    if (warehousesData) setWarehouses(warehousesData.data);
    if (productsData) setProducts(productsData.data);
  }, [suppliersData, stockEntriesData, warehousesData, productsData]);





  const handleDeleteSupplier = (supplierId: string) => {
    setSupplierIdToDelete(supplierId);
    setIsModalOpen(true);
  };

  const handleDeleteStockEntry = (stockEntryId: string) => {
    setDeleteEntryId(stockEntryId);
    setIsModalOpenDeleteStockEntry(true);
  };







  const handleEditSupplier = async (supplier: Supplier) => {
    setEditingSupplier(supplier)
  }

  const handleUpdateSupplier = async () => {
    if (!editingSupplier) return;
    if (editingSupplier.name === '' || editingSupplier.contact_info === '' || editingSupplier.address === '') {
      toast.error('Vui lòng điền đầy đủ thông tin nhà cung cấp!');
      return;
    }
    try {
      await mutateAPI(`/supplier/update`, editingSupplier, 'put');
      mutateSuppliers();
      toast.success('Cập nhật thành công!');
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Có lỗi xảy ra khi cập nhật nhà cung cấp!');
    }
  };
  const confirmDeleteSupplier = async () => {
    try {
      await mutateAPI(`/supplier/delete/${supplierIdToDelete}`, {}, 'delete');
      mutateSuppliers();
      setIsModalOpen(false);
      toast.success('Xóa nhà cung cấp thành công!');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Có lỗi xảy ra khi xóa nhà cung cấp!');
    }
  };


  const handleAddStockEntry = async () => {
    try {
      await mutateAPI('/stockEntry/create', {
        supplier_id: newStockEntry.supplier_id._id,
        warehouse_id: newStockEntry.warehouse_id._id,
        date_received: newStockEntry.date_received,
        total_value: newStockEntry.total_value,
        stockEntryDetails: newStockEntry.stockEntryDetails.map(detail => ({
          product_id: detail.product_id,
          quantity_received: detail.quantity_received,
          import_price: detail.import_price
        })),
        payment: {
          amount: newStockEntry.payment.amount,
          status: newStockEntry.payment.status,
          method: newStockEntry.payment.method,
          total_amount: newStockEntry.payment.amount,
        }
      }, 'post');

      toast.success('Tạo phiếu nhập thành công!');
      setIsAddingStockEntry(false);
      setNewStockEntry({
        _id: '',
        supplier_id: { _id: '', name: '', contact_info: '', address: '' },
        warehouse_id: { _id: '', name: '' },
        date_received: '',
        total_value: 0,
        stockEntryDetails: [],
        payment: {
          amount: 0,
          status: '',
          method: ''
        },
      });
      mutateStockEntries();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm phiếu nhập!');
      console.error('Error adding stock entry:', error);
    }
  };
  const fetchStockEntryDetails = async (stockEntryId: string) => {
    try {
      const response = await mutateAPI(`/stockEntry/getDetails/${stockEntryId}`, {}, 'get');
      setStockEntryDetails(response.stockEntryDetails);
    } catch (error) {
      console.error('Error fetching stock entry details:', error);
    }
  };

  const handleUpdatePayment = async (updatedPayment: any) => {
    if (!selectedStockEntry) return;
    setIsUpdatingPayment(true);
    try {
      await mutateAPI(`/payment/update/${selectedStockEntry.payment._id}`, {
        amount: updatedPayment.amount,
        method: updatedPayment.method,
        status: updatedPayment.status,
        last_amount: updatedPayment.last_amount,
        last_method: updatedPayment.last_method,
        total_amount: updatedPayment.total_amount
      }, 'put');
      
      mutateStockEntries();
      setIsViewingDetails(false);
      setSelectedStockEntry(null);
      toast.success('Cập nhật thanh toán thành công!');
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thanh toán!');
    } finally {
      setIsUpdatingPayment(false);
    }
  };


  const handleViewDetails = (entry: StockEntry) => {
    setSelectedStockEntry(entry);
    fetchStockEntryDetails(entry._id);
    setIsViewingDetails(true);
  };



  const confirmDeleteStockEntry = async (stockEntryId: string) => {
    try {
      await mutateAPI(`/stockEntry/delete/${stockEntryId}`, {}, 'delete');
      mutateStockEntries();
      setIsModalOpenDeleteStockEntry(false);
      toast.success('Xóa phiếu nhập thành công!');
    } catch (error) {
      console.error('Error deleting stock entry:', error);
      toast.error('Có lỗi xảy ra khi xóa phiếu nhập!');
    }
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      contact_info: '',
      address: '',
    }
  });

  const onSubmitSupplier = async (data: any) => {
    try {
      await mutateAPI('/supplier/create', data, 'post');
      mutateSuppliers();
      reset();
      setAlertMessage('Thêm nhà cung cấp thành công!');
      setAlertType('success');
      setOpen(true);
    } catch (error: any) {
      setAlertMessage('Tên nhà cung cấp đã tồn tại!');
      setAlertType('error');
      setOpen(true);
    }
  };



  const filteredStockEntries = stockEntries?.filter(entry =>
    (filterSupplier === 'all' || entry.supplier_id._id === filterSupplier) &&
    (filterWarehouse === 'all' || entry.warehouse_id._id === filterWarehouse) &&
    (filterPaymentStatus === 'all' || entry.payment.status === filterPaymentStatus) &&
    (entry.supplier_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.warehouse_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.payment.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStockEntries?.slice(indexOfFirstItem, indexOfLastItem);


  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const calculateTotalAmount = () => {
    return newStockEntry.stockEntryDetails.reduce((total, detail) => {
      return total + (detail.quantity_received * detail.import_price);
    }, 0);
  };

  useEffect(() => {
    setNewStockEntry((prev) => ({
      ...prev,
      total_value: calculateTotalAmount(),
    }));
  }, [newStockEntry.stockEntryDetails]);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
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
                <TableHead>Tên kho nhập</TableHead>
                <TableHead>Tổng giá trị</TableHead>
                <TableHead>Thanh toán lần đầu</TableHead>
                <TableHead>Thanh toán lần sau</TableHead>
                <TableHead>Trạng thái thanh toán</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems && currentItems.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{new Date(entry.date_received).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.supplier_id.name}</TableCell>
                  <TableCell>{entry.warehouse_id.name}</TableCell>
                  <TableCell>{entry.total_value.toLocaleString()} VND</TableCell>
                  <TableCell>{entry.payment.amount.toLocaleString()} VND</TableCell>
                  <TableCell>{entry.payment.last_amount ? entry.payment.last_amount.toLocaleString() : '0'} VND</TableCell>
                  <TableCell>{entry.payment.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewDetails(entry)}>
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
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitSupplier)}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Tên nhà cung cấp
                          </Label>
                          <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Tên nhà cung cấp là bắt buộc' }}
                            render={({ field, fieldState: { error } }) => (
                              <div className="col-span-3">
                                <Input {...field} id="name" />
                                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                              </div>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contact_info" className="text-right">
                            Thông tin liên hệ
                          </Label>
                          <Controller
                            name="contact_info"
                            control={control}
                            rules={{ required: 'Thông tin liên hệ là bắt buộc' }}
                            render={({ field, fieldState: { error } }) => (
                              <div className="col-span-3">
                                <Input {...field} id="contact_info" />
                                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                              </div>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">
                            Địa chỉ nhà cung cấp
                          </Label>
                          <Controller
                            name="address"
                            control={control}
                            rules={{ required: 'Địa chỉ là bắt buộc' }}
                            render={({ field, fieldState: { error } }) => (
                              <div className="col-span-3">
                                <Input {...field} id="address" />
                                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Thêm</Button>
                      </DialogFooter>
                    </form>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Tên nhà cung cấp
                </Label>
                <Input
                  id="edit-name"
                  value={editingSupplier.name}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
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
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_info: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Địa chỉ nhà cung cấp
                </Label>
                <Input
                  id="edit-address"
                  value={editingSupplier.address}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm phiếu nhập mới</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">Nhà cung cấp</Label>
              <Select
                value={newStockEntry.supplier_id._id}
                onValueChange={(value) => setNewStockEntry({ ...newStockEntry, supplier_id: { ...newStockEntry.supplier_id, _id: value } })}
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
                onValueChange={(value) => setNewStockEntry({ ...newStockEntry, warehouse_id: { ...newStockEntry.warehouse_id, _id: value } })}
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
                onChange={(e) => setNewStockEntry({ ...newStockEntry, date_received: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="total_value">Tổng giá trị</Label>
              <div className="mt-2">
                <Label className="text-xl text-red-700 font-bold" >{calculateTotalAmount().toLocaleString()} VND</Label>
              </div>
              <Input
                id="total_value"
                type="number"
                value={newStockEntry.total_value}
                readOnly
                style={{
                  display: 'none'
                }}
              />
            </div>
          </div>
          {/*Thanh toán*/}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="payment_amount">Số tiền thanh toán</Label>
              <Input
                id="payment_amount"
                type="number"
                value={newStockEntry.payment.amount}
                onChange={(e) => setNewStockEntry({
                  ...newStockEntry,
                  payment: {
                    ...newStockEntry.payment,
                    amount: parseFloat(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="payment_method">Phương thức thanh toán</Label>
              <Select
                value={newStockEntry.payment.method}
                onValueChange={(value) => setNewStockEntry({
                  ...newStockEntry,
                  payment: {
                    ...newStockEntry.payment,
                    method: value
                  }
                })}
              >
                <SelectTrigger id="payment_method">
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  <SelectItem value="Thẻ tín dụng">Thẻ tín dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="payment_status">Trạng thái thanh toán</Label>
              <Select
                value={newStockEntry.payment.status}
                onValueChange={(value) => setNewStockEntry({
                  ...newStockEntry,
                  payment: {
                    ...newStockEntry.payment,
                    status: value
                  }
                })}
              >
                <SelectTrigger id="payment_status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đã thanh toán đủ">Đã thanh toán đủ</SelectItem>
                  <SelectItem value="Còn nợ">Còn nợ</SelectItem>
                  <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/*Chi tiết sản phẩm*/}
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
                          setNewStockEntry({ ...newStockEntry, stockEntryDetails: updatedDetails });
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
                          setNewStockEntry({ ...newStockEntry, stockEntryDetails: updatedDetails });
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
                          setNewStockEntry({ ...newStockEntry, stockEntryDetails: updatedDetails });
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
                {
                  product_id: '',
                  quantity_received: 0,
                  import_price: 0,
                  quantity_ordered: 0,
                  stock_entry_id: '',
                  _id: ''
                }]
              })}
              className="mt-2"
            >
              Thêm sản phẩm
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStockEntry}>Thêm phiếu nhập</Button>
            <Button variant="outline" onClick={() => setIsAddingStockEntry(false)}>Hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*Dialog xem chi tiết phiếu nhập*/}
      <Dialog open={isViewingDetails}
        onOpenChange={(open) => {
          setIsViewingDetails(open);
          if (!open) {
            setStockEntryDetails([]);
          }
        }} >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu nhập</DialogTitle>
            <DialogDescription>Xem và cập nhật thông tin phiếu nhập</DialogDescription>
          </DialogHeader>
          {selectedStockEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Nhà cung cấp</Label>
                  <div className="mt-1">{selectedStockEntry.supplier_id.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Kho</Label>
                  <div className="mt-1">{selectedStockEntry.warehouse_id.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Ngày nhận hàng</Label>
                  <div className="mt-1">{new Date(selectedStockEntry.date_received).toLocaleDateString()}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Tổng giá trị</Label>
                  <div className="mt-1">{selectedStockEntry.total_value.toLocaleString()} VND</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h3>
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
                    {stockEntryDetails.length > 0 ? (
                      stockEntryDetails.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>{detail.product_id.name}</TableCell>
                          <TableCell>{detail.quantity_received}</TableCell>
                          <TableCell>{detail.import_price.toLocaleString()} VND</TableCell>
                          <TableCell>{(detail.quantity_received * detail.import_price).toLocaleString()} VND</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">Đang tải chi tiết sản phẩm...</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Thông tin thanh toán</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Cần thanh toán thêm</Label>
                    <div className="mt-1 text-red-600 font-semibold">
                      {(selectedStockEntry.total_value - selectedStockEntry.payment.amount - (selectedStockEntry.payment.last_amount || 0)).toLocaleString()} VND
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Trạng thái thanh toán</Label>
                    <div className={`mt-1 font-semibold ${selectedStockEntry.payment.status === 'Đã thanh toán đủ' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedStockEntry.payment.status}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Phương thức thanh toán lần đầu</Label>
                    <div className="mt-1">{selectedStockEntry.payment.method}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Phương thức thanh toán lần sau</Label>
                    <div className="mt-1">{selectedStockEntry.payment.last_method || 'Chưa có'}</div>
                  </div>
                </div>
              </div>

              {!isUpdatingPayment && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cập nhật thanh toán</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Đã thanh toán lần đầu</Label>
                      <div className="mt-1 font-semibold">{selectedStockEntry.payment.amount.toLocaleString()} VND</div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Số tiền thanh toán lần sau</Label>
                      <div className="mt-1 font-semibold">{selectedStockEntry.payment.last_amount ? selectedStockEntry.payment.last_amount.toLocaleString() : 0} VND</div>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="additional-payment">Số tiền thanh toán thêm</Label>
                      <Input
                        id="additional-payment"
                        type="number"
                        placeholder="Nhập số tiền"
                        onChange={(e) => {
                          const additionalAmount = parseFloat(e.target.value) || 0;
                          const newAmount = selectedStockEntry.payment.amount + selectedStockEntry.payment.last_amount + additionalAmount;
                          const newStatus = newAmount >= selectedStockEntry.total_value ? 'Đã thanh toán đủ' : 'Còn nợ';

                          setSelectedStockEntry({
                            ...selectedStockEntry,
                            payment: {
                              ...selectedStockEntry.payment,
                              last_amount: additionalAmount,
                              total_amount: newAmount,
                              status: newStatus,
                              last_method: selectedStockEntry.payment.last_method
                            }
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Tổng số tiền sau khi cập nhật</Label>
                      <div className="mt-1 text-green-600 font-semibold">
                        {(selectedStockEntry.payment.amount + (selectedStockEntry.payment.last_amount || 0)).toLocaleString()} VND
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="payment-method">Phương thức thanh toán</Label>
                      <Select
                        value={selectedStockEntry.payment.last_method}
                        onValueChange={(value) => setSelectedStockEntry({
                          ...selectedStockEntry,
                          payment: {
                            ...selectedStockEntry.payment,
                            last_method: value
                          }
                        })}
                      >
                        <SelectTrigger id="payment-method">
                          <SelectValue placeholder="Chọn phương thức thanh toán" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                          <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                          <SelectItem value="Thẻ tín dụng">Thẻ tín dụng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => handleUpdatePayment(selectedStockEntry.payment)}
                >
                  Cập nhật thanh toán
                </Button>
                <Button variant="outline" onClick={() => setIsViewingDetails(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/*Dialog thông báo*/}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className={`text-xl text-center font-semibold mb-2 ${alertType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {alertType === 'success' ? 'Thành công' : 'Thông báo'}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <LottieAnimation 
              animationData={alertType === 'success' ? successAnimation : errorAnimation} 
              loop={false} 
              autoplay={true} 
              width={100} 
              height={100} 
            />
          </div>
          <AlertDialogDescription className="text-gray-800 font-medium mb-6 text-center">
            {alertMessage}
          </AlertDialogDescription>
          <AlertDialogFooter className="flex justify-end">
            <AlertDialogAction
              onClick={() => setOpen(false)}
            >
              Đóng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Modal xác nhận xóa nhà cung cấp*/}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Xác nhận xóa"
        className="p-8" // Thêm bóng và bo góc cho modal
      >
        <div className="flex justify-center mb-4">
          <LottieAnimation animationData={trash} loop={false} autoplay={true} width={100} height={100} />
        </div>
        <Label className="text-gray-800 font-medium mb-6 text-center">
          Bạn có chắc chắn muốn xóa nhà cung cấp này?
        </Label>
        <div className="flex justify-end mt-4">
          <Button variant="destructive" onClick={confirmDeleteSupplier} className="mr-2">
            Xác nhận
          </Button>
          <Button variant="outline" onClick={() => setIsModalOpen(false)} className="mr-2">
            Hủy
          </Button>
        </div>
      </Modal>

      {/* Modal xác nhận xóa phiếu nhập*/}
      <Modal
        isOpen={isModalOpenDeleteStockEntry}
        onClose={() => {
          setIsModalOpenDeleteStockEntry(false);
          setDeleteEntryId('');
        }
        }

        title="Xác nhận xóa"
        className="p-8" // Thêm bóng và bo góc cho modal
      >
        <div className="flex justify-center mb-4">
          <LottieAnimation animationData={trash} loop={false} autoplay={true} width={100} height={100} />
        </div>
        <Label className="text-gray-800 font-medium mb-6 text-center">
          Bạn có chắc chắn muốn xóa phiếu nhập này?
        </Label>
        <div className="flex justify-end mt-4">
          <Button variant="destructive" onClick={() => confirmDeleteStockEntry(deleteEntryId)} className="mr-2">
            Xác nhận
          </Button>
          <Button variant="outline" onClick={() => {
            setIsModalOpenDeleteStockEntry(false);
            setDeleteEntryId('');
          }
          } className="mr-2">
            Hủy
          </Button>
        </div>
      </Modal>

      {/* Modal thông báo */}
      <Modal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={alertType === 'success' ? 'Thành công' : 'Lỗi'}
        className="p-8"
      >
        <div className="flex justify-center mb-4">
          <LottieAnimation 
            animationData={alertType === 'success' ? successAnimation : errorAnimation} 
            loop={false} 
            autoplay={true} 
            width={100} 
            height={100} 
          />
        </div>
        <Label className="text-gray-800 font-medium mb-6 text-center">
          {alertMessage}
        </Label>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setIsAlertModalOpen(false)} className="mr-2">
            Đóng
          </Button>
        </div>
      </Modal>

      

    </div>
  )
}