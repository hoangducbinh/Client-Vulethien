'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import handleAPI, { mutateAPI, useAPI } from '@/services/handleAPI';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from '@/services/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

interface UpdateProductProps {
  product: any;
  onUpdate: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ product, onUpdate }) => {
  const [formData, setFormData] = useState(product);
  const [isEditing, setIsEditing] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [importPriceDisplay, setImportPriceDisplay] = useState('');
  const [unitPriceDisplay, setUnitPriceDisplay] = useState('');

  const { data: categoriesData, isError: categoriesError } = useAPI('/category/getAll');
  const categories = categoriesData?.data || [];

  useEffect(() => {
    setFormData(product);
    setImportPriceDisplay(formatCurrency(product.import_price.toString()));
    setUnitPriceDisplay(formatCurrency(product.unit_price.toString()));
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof product) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fileInput = document.getElementById('imageInput') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      let imageUrl = formData.image; // Giữ URL cũ nếu không có hinh ảnh mới
  
      if (file) {
        imageUrl = await handleImageUpload(file);
      }
  
      const updatedData = {
        ...formData,
        image: imageUrl, // Cập nhật URL hình ảnh
      };
  
      const response = await mutateAPI(`/product/update/${product._id}`, updatedData, 'put');
      onUpdate();
      setIsEditing(false);
        setAlertType('success');
        setAlertMessage('Cập nhật sản phẩm thành công');
    } catch (error) {
      console.error('Error updating product:', error);
      setAlertType('error');
      setAlertMessage('Đã xảy ra lỗi khi cập nhật sản phẩm');
    } finally {
      setOpen(true);
    }
  };

  const formatCurrency = (value: string) => {
    const numberValue = value.replace(/[^0-9]/g, '');
    return numberValue ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(numberValue)) : '';
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'import_price' | 'unit_price') => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev: typeof product) => ({ ...prev, [field]: inputValue }));
    const displayValue = formatCurrency(inputValue);
    field === 'import_price' ? setImportPriceDisplay(displayValue) : setUnitPriceDisplay(displayValue);
  };

  if (categoriesError) {
    return <div>Error loading categories</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thông tin sản phẩm'}</span>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertType === 'success' ? 'Thành công' : 'Lỗi'}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setOpen(false)}>Đóng</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {isEditing ? (
          <form onSubmit={handleUpdateProduct} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="import_price">Giá nhập</Label>
                <Input
                  id="import_price"
                  name="import_price"
                  value={importPriceDisplay}
                  onChange={(e) => handlePriceChange(e, 'import_price')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_price">Giá bán</Label>
                <Input
                  id="unit_price"
                  name="unit_price"
                  value={unitPriceDisplay}
                  onChange={(e) => handlePriceChange(e, 'unit_price')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity_in_stock">Số lượng</Label>
                <Input id="quantity_in_stock" name="quantity_in_stock" type="number" value={formData.quantity_in_stock} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Đơn vị tính</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Ký', 'Chai', 'Bành', 'Hộp', 'Lọ', 'Thùng', 'Gói', 'Cái', 'Bộ', 'Dây, Bịch, Bọc, Lon, Lạng'].map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorder_level">Mức đặt hàng</Label>
                <Input id="reorder_level" name="reorder_level" type="number" value={formData.reorder_level} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Danh mục</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea rows={3} id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageInput">Ảnh sản phẩm</Label>
              <Input id="imageInput" name="image" type="file" accept="image/*" />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="submit" variant="default" className="flex items-center">
                <Save className="mr-2 h-4 w-4" /> Cập nhật
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex items-center">
                <X className="mr-2 h-4 w-4" /> Hủy
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label className="font-medium">Tên sản phẩm</Label>
                <p>{product.name}</p>
              </div>
              <div>
                <Label className="font-medium">Giá nhập</Label>
                <p>{formatCurrency(product.import_price.toString())}</p>
              </div>
              <div>
                <Label className="font-medium">Giá bán</Label>
                <p>{formatCurrency(product.unit_price.toString())}</p>
              </div>
              <div>
                <Label className="font-medium">Số lượng</Label>
                <p>{product.quantity_in_stock}</p>
              </div>
              <div>
                <Label className="font-medium">Đơn vị tính</Label>
                <p>{product.unit}</p>
              </div>
              <div>
                <Label className="font-medium">Mức đặt hàng</Label>
                <p>{product.reorder_level}</p>
              </div>
              <div>
                <Label className="font-medium">Danh mục</Label>
                <p>{categories.find((category: any) => category._id === product.category_id)?.name}</p>
              </div>
            </div>
            <div>
              <Label className="font-medium">Mô tả</Label>
              <p className="mt-1 text-sm text-gray-600">{product.description}</p>
            </div>
            <div>
              <Label className="font-medium">Ảnh sản phẩm</Label>
              <div className="mt-2 w-full h-64 relative">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  className=" object-contain rounded-lg w-full h-48"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateProduct;