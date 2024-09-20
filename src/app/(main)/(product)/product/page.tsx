'use client'

import React, { useEffect, useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCategory from '../category/create';
import handleAPI from '@/services/handleAPI';
import CreateProduct from './create';
import UpdateProduct from "./update";

const ProductPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpenModalCategory, setIsOpenModalCategory] = useState<boolean>(false);
  const [isOpenModalProduct, setIsOpenModalProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    handleGetCategory();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0]._id);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory !== null) {
      handleGetProductbyCategory();
    }
  }, [selectedCategory]);

  const handleGetCategory = async () => {
    try {
      const response = await handleAPI('/category/getAll', 'get');
      setCategories(response.data.data || []);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleGetProductbyCategory = async () => {
    try {
      const response = await handleAPI(`/product/getbyCategory/${selectedCategory}`, 'get');
      setProducts(response.data.data);
    } catch (error) {
      console.log('Error', error);
    }
  }

  const handleCategoryClick = (category_Id: number) => {
    setSelectedCategory(category_Id);
  };

  const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '');

  const filteredProducts = (products || [])
    .filter(product => normalizeString(product.name).includes(normalizeString(searchTerm)));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  const handleProductUpdate = () => {
    handleGetProductbyCategory();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex space-x-4">
          <Dialog open={isOpenModalCategory} onOpenChange={setIsOpenModalCategory}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
              </DialogHeader>
              <CreateCategory />
            </DialogContent>
          </Dialog>
          <Dialog open={isOpenModalProduct} onOpenChange={setIsOpenModalProduct}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              </DialogHeader>
              <CreateProduct />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category._id}>
                  <Button
                    variant={category._id === selectedCategory ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {category.name}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Sản phẩm</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sắp xếp <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Tên A-Z</DropdownMenuItem>
                  <DropdownMenuItem>Tên Z-A</DropdownMenuItem>
                  <DropdownMenuItem>Giá tăng dần</DropdownMenuItem>
                  <DropdownMenuItem>Giá giảm dần</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Giá nhập</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn vị tính</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map(product => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.import_price)}</TableCell>
                    <TableCell>{formatCurrency(product.unit_price)}</TableCell>
                    <TableCell>{product.quantity_in_stock}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Thông tin chi tiết sản phẩm</DialogTitle>
                          </DialogHeader>
                          {selectedProduct && (
                            <UpdateProduct 
                              product={selectedProduct} 
                              onUpdate={handleProductUpdate} 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {paginatedProducts.length === 0 && (
              <p className="text-center text-gray-500 my-4">Không có sản phẩm nào.</p>
            )}
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductPage;