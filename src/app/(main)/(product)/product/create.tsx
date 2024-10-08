'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import useAPI, { mutateAPI } from '@/services/handleAPI';
import { Category } from '@/app/types';
import { storage } from '@/services/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  
const CreateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [unit_price, setUnitPrice] = useState('');
    const [import_price, setImportPrice] = useState('');
    const [quantity_in_stock, setQuantityInStock] = useState('');
    const [reorder_level, setReorderLevel] = useState('');
    const [unit, setUnit] = useState('');
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [importPriceDisplay, setImportPriceDisplay] = useState('');
    const [unitPriceDisplay, setUnitPriceDisplay] = useState('');

    // Use SWR hook to fetch categories
    const { data: categoriesData, isError: categoriesError } = useAPI('/category/getAll');
    const { mutate: mutateProducts } = useAPI('/product/getAll');
    const categories: Category[] = categoriesData?.data || [];

    // Function to handle formatting the price fields
    const formatCurrency = (value: string) => {
        const numberValue = value.replace(/[^0-9]/g, '');
        return numberValue ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(numberValue)) : '';
    };

    // Function to handle price input changes
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>, displaySetter: React.Dispatch<React.SetStateAction<string>>) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9]/g, '');
        
        setter(numericValue);
        displaySetter(inputValue);
    };

    // Function to handle price input blur
    const handlePriceBlur = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, displaySetter: React.Dispatch<React.SetStateAction<string>>) => {
        const formattedValue = formatCurrency(value);
        displaySetter(formattedValue);
        setter(value.replace(/[^0-9]/g, '')); // Keep only numeric values
    };
    const handleImageUpload = async (file: File) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      };

    const handleCreateProduct = async () => {
        setAlertType('info');
        setAlertMessage('Đang xử lý...');
        setOpen(true);
        try {
            const fileInput = document.getElementById('imageInput') as HTMLInputElement;
            const file = fileInput?.files?.[0];
            let imageUrl = '';
      
            if (file) {
              imageUrl = await handleImageUpload(file);
            }
          const data = {
            name,
            description,
            category_id,
            unit,
            unit_price: Number(unit_price),
            import_price: Number(import_price),
            quantity_in_stock: Number(quantity_in_stock),
            reorder_level: reorder_level ? Number(reorder_level) : undefined,
            image: imageUrl,
          };
    
         await mutateAPI('/product/create', data, 'post');
         
            setAlertType('success');
            setAlertMessage('Tạo sản phẩm thành công');
            // Clear form fields after successful creation
            setName('');
            setDescription('');
            setCategoryId('');
            setUnit('');
            setUnitPrice('');
            setImportPrice('');
            setQuantityInStock('');
            setReorderLevel('');
            setImportPriceDisplay('');
            setUnitPriceDisplay('');
            // Revalidate the product list
            mutateProducts();

        } catch (error) {
          console.error('Error creating product:', error);
          setAlertType('error');
          setAlertMessage('Có lỗi xảy ra khi tạo sản phẩm');
        } finally {
          setOpen(true);
        }
      };

    if (categoriesError) {
        return <div>Error loading categories</div>;
    }

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Nhập thông tin sản phẩm</h1>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-600">Tên sản phẩm</Label>
                    <Input
                        id="name"
                        placeholder="Tên sản phẩm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-600">Mô tả</Label>
                    <Textarea
                        id="description"
                        placeholder="Mô tả sản phẩm"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="category_id" className="block text-sm font-medium text-gray-600">Danh mục</Label>
                        <Select onValueChange={(value) => setCategoryId(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category._id} value={category._id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="unit" className="block text-sm font-medium text-gray-600">Đơn vị tính</Label>
                        <Select onValueChange={(value) => setUnit(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn đơn vị tính" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">Kg</SelectItem>
                                <SelectItem value="Chai">Chai</SelectItem>
                                <SelectItem value="Bành">Bành</SelectItem>
                                <SelectItem value="Hộp">Hộp</SelectItem>
                                <SelectItem value="Lọ">Lọ</SelectItem>
                                <SelectItem value="Thùng">Thùng</SelectItem>
                                <SelectItem value="Gói">Gói</SelectItem>
                                <SelectItem value="Cái">Cái</SelectItem>
                                <SelectItem value="Bộ">Bộ</SelectItem>
                                <SelectItem value="Dây">Dây</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   

                    <div>
                        <Label htmlFor="import_price" className="block text-sm font-medium text-gray-600">Giá nhập</Label>
                        <Input
                            id="import_price"
                            placeholder="Giá nhập"
                            
                            value={importPriceDisplay}
                            onChange={(e) => handlePriceChange(e, setImportPrice, setImportPriceDisplay)}
                            onBlur={() => handlePriceBlur(importPriceDisplay, setImportPrice, setImportPriceDisplay)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="unit_price" className="block text-sm font-medium text-gray-600">Giá bán</Label>
                        <Input
                            id="unit_price"
                            placeholder="Giá bán"
                          
                            value={unitPriceDisplay}
                            onChange={(e) => handlePriceChange(e, setUnitPrice, setUnitPriceDisplay)}
                            onBlur={() => handlePriceBlur(unitPriceDisplay, setUnitPrice, setUnitPriceDisplay)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="quantity_in_stock" className="block text-sm font-medium text-gray-600">Số lượng trong kho</Label>
                        <Input
                            id="quantity_in_stock"
                            type="number"
                            placeholder="Số lượng"
                            value={quantity_in_stock}
                            onChange={(e) => setQuantityInStock(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <Label htmlFor="reorder_level" className="block text-sm font-medium text-gray-600">Mức tối thiểu</Label>
                        <Input
                            id="reorder_level"
                            type="number"
                            placeholder="Mức tối thiểu"
                            value={reorder_level}
                            onChange={(e) => setReorderLevel(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="imageInput" className="block text-sm font-medium text-gray-600">Hình ảnh sản phẩm</Label>
                        <Input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Button
                    onClick={handleCreateProduct}
                    className="w-full py-2 px-4"
                >
                    Tạo sản phẩm
                </Button>
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertType === 'success' ? 'Thành công' : 'Thông báo'}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setOpen(false)}>Đóng</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CreateProduct;
