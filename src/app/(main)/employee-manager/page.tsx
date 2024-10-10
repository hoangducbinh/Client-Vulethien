"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit2, Trash2, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface Employee {
  id: number
  name: string
  email: string
  role: string
  permissions: string
  phone?: string
  department?: string
  hireDate?: string
  avatar?: string
}

import useAPI, { mutateAPI } from "@/services/handleAPI"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "@/services/firebaseConfig"

// ... existing imports ...

interface Employee {
  _id: string; // Thay đổi từ 'id' sang '_id' để phù hợp với MongoDB
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  address?: string;
  cccd?: string;
  gender?: string;
  hometown?: string;
  position?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  password?: string;
  birthday?: string;
  newAvatar?: any;
}

export default function EmployeeManagement() {
  const { data: employeesData, isLoading, isError, mutate } = useAPI('/auth/user', 'get')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ 
    name: "", 
    email: "", 
    role: "", 
    phone: "",
    department: "",
    address: "",
    cccd: "",
    gender: "",
    hometown: "",
    position: "",
    password: "",
    birthday: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const employeesPerPage = 5
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (employeesData) {
      const employeeArray = Array.isArray(employeesData.users) ? employeesData.users : [employeesData.users]
      setEmployees(employeeArray)
    }
  }, [employeesData])

  const filteredEmployees = employees.filter(employee =>
    (employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (employee.role?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  const indexOfLastEmployee = currentPage * employeesPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage)

  const handleAddEmployee = async () => {
    if (newEmployee.name && newEmployee.email) {
      try {
        await mutateAPI('/auth/register', newEmployee, 'post')
        setNewEmployee({ 
          name: "", 
          email: "",
          password: "macdinh",
          role: "", 
          phone: "",
          department: "",
          address: "",
          cccd: "",
          gender: "",
          hometown: "",
          position: "",
          avatar: "",
          birthday: "",
        })
        setIsAddDialogOpen(false)
        mutate() // Refresh the employees data
      } catch (error) {
        console.error("Failed to add employee:", error)
        // Handle error (e.g., show an error message to the user)
      }
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await mutateAPI(`/auth/user/${employeeId}`, null, 'delete')
      mutate() // Refresh the employees data
    } catch (error) {
      console.error("Failed to delete employee:", error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailDialogOpen(true)
  }

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleUpdateEmployee = async () => {
    if (editingEmployee && editingEmployee._id) {
      try {
        let updatedEmployee = { ...editingEmployee };
        // Xử lý tải lên hình ảnh nếu có
        if (editingEmployee.newAvatar && typeof editingEmployee.newAvatar === 'object' && 'name' in editingEmployee.newAvatar) {
          const imageUrl = await handleImageUpload(editingEmployee.newAvatar as File);
          updatedEmployee.avatar = imageUrl;
        }

        await mutateAPI(`/auth/user/${editingEmployee._id}`, updatedEmployee, 'put')
        setIsEditDialogOpen(false)
        setEditingEmployee(null)
        mutate() // Refresh the employees data
      } catch (error) {
        console.error("Failed to update employee:", error)
        // Handle error (e.g., show an error message to the user)
      }
    }
  } 

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading employees. Please try again later.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quản lý nhân viên</CardTitle>
            <CardDescription>Xem và quản lý thông tin nhân viên của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Tìm kiếm nhân viên..."
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
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Thêm nhân viên</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm nhân viên mới</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Tên</Label>
                      <Input
                        id="name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Chức vụ</Label>
                      <Input
                        id="role"
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddEmployee}>Thêm nhân viên</Button>
                </DialogContent>
              </Dialog>
            </div>

            {employees.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">Chưa có nhân viên nào được thêm vào.</p>
                <p className="mt-2">Hãy thêm nhân viên mới bằng cách nhấn nút <span className="font-bold">Thêm nhân viên</span> ở trên.</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhân viên</TableHead>
                      <TableHead>Chức vụ</TableHead>
                      <TableHead>Phòng ban</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEmployees.map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position || 'Đang cập nhật'}</TableCell>
                        <TableCell>{employee.department || 'Đang cập nhật'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(employee)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(employee)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee._id)}>
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
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết nhân viên</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="permissions">Quyền hạn</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                      <AvatarFallback>{selectedEmployee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{selectedEmployee.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-bold">Chức vụ</Label>
                      <p>{selectedEmployee.position || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Phòng ban</Label>
                      <p>{selectedEmployee.department || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Số điện thoại</Label>
                      <p>{selectedEmployee.phone || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Địa chỉ</Label>
                      <p>{selectedEmployee.address || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label className="font-bold">CCCD</Label>
                      <p>{selectedEmployee.cccd || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Giới tính</Label>
                      <p>{selectedEmployee.gender || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Quê quán</Label>
                      <p>{selectedEmployee.hometown || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Ngày sinh</Label>
                      <p>{selectedEmployee.birthday || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="permissions">
                <div className="space-y-4 py-4">
                  <div>
                    <Label className="font-bold">Quyền hiện tại</Label>
                    <Badge className="mt-2" variant={selectedEmployee.role === "Admin" ? "destructive" : selectedEmployee.role === "Nhân viên" ? "default" : "secondary"}>
                      {selectedEmployee.role}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-left">Tên</Label>
                <Input
                  id="edit-name"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-left">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-left">Chức vụ</Label>
                <Input
                  id="edit-role"
                  value={editingEmployee.position}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-department" className="text-left">Phòng ban</Label>
                <Input
                  id="edit-department"
                  value={editingEmployee.department || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-left">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  value={editingEmployee.phone || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-left">Địa chỉ</Label>
                <Input
                  id="edit-address"
                  value={editingEmployee.address || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cccd" className="text-left">CCCD</Label>
                <Input
                  id="edit-cccd"
                  value={editingEmployee.cccd || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, cccd: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-gender" className="text-left">Giới tính</Label>
                <Input
                  id="edit-gender"
                  value={editingEmployee.gender || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, gender: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-hometown" className="text-left">Quê quán</Label>
                <Input
                  id="edit-hometown"
                  value={editingEmployee.hometown || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, hometown: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-avatar" className="text-right">Ảnh đại diện</Label>
                <Input
                  id="edit-avatar"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditingEmployee({ ...editingEmployee, newAvatar: file });
                    }
                  }}
                  className="col-span-3"
                />
              </div>
              {editingEmployee.avatar && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right">Ảnh hiện tại:</span>
                  <img src={editingEmployee.avatar} alt="Current avatar" className="w-20 h-20 object-cover col-span-3" />
                </div>
              )}
              {/* Thêm các trường khác tương tự */}
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateEmployee}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}