'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import Modal from '@/app/components/Modal';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import CreateCategory from '../category/create';
import handleAPI from '@/services/handleAPI';
import CreateProduct from './create';

const ProductPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpenModalCategory, setIsOpenModalCategory] = useState<boolean>(false);
  const [isOpenModalProduct, setIsOpenModalProduct] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

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
      console.log('Response', response.data);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleGetProductbyCategory = async () => {
    try {
      const response = await handleAPI(`/product/getbyCategory/${selectedCategory}`, 'get');
      setProducts(response.data.data);
      console.log('Response', response.data);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Modal
        isOpen={isOpenModalCategory}
        onClose={() => setIsOpenModalCategory(false)}
        style={{ width: '30%' }}
      >
        <CreateCategory />
      </Modal>
      <Modal
        style={{ width: '40%' }}
        isOpen={isOpenModalProduct}
        onClose={() => setIsOpenModalProduct(false)}
      >
        <CreateProduct />
      </Modal>

      <div className="flex flex-col h-auto">
        <div className="flex flex-1">
          {/* Danh sách danh mục */}
          <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Danh mục</h2>
              <button
                onClick={() => setIsOpenModalCategory(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" /> Tạo danh mục
              </button>
            </div>
            <ul>
              {categories.map(category => (
                <li
                  key={category._id}
                  className={`cursor-pointer p-2 rounded-lg mb-2 hover:bg-gray-200 ${category._id === selectedCategory ? 'bg-gray-300' : ''
                    }`}
                  onClick={() => handleCategoryClick(category._id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="ml-1 w-3/4 p-4 overflow-y-auto bg-gray-100 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sản phẩm</h2>
              {/* Thanh tìm kiếm */}
              
              <div className="relative">
              <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-1 pl-10 pr-4 outline-none rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
         

              </div>
       
              <button
                onClick={() => setIsOpenModalProduct(true)}
                className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center">
                <FaPlus className="mr-2" /> Tạo sản phẩm
              </button>
            </div>
            {selectedCategory === null ? (
              <p className="text-gray-600">Vui lòng chọn danh mục để xem sản phẩm.</p>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-4">
                <table className="w-full table-auto border-collapse ">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-2 border-b rounded-tl-lg ">ID</th>
                      <th className="p-2 border-b">Tên sản phẩm</th>
                      <th className="p-2 border-b">Giá bán</th>
                      <th className="p-2 border-b">Giá nhập</th>
                      <th className="p-2 border-b rounded-tr-lg">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map(product => (
                        <tr key={product._id} className="justify-center">
                          <td className="p-2 border-b">{product._id}</td>
                          <td className="p-2 border-b">{product.name}</td>
                          <td className="p-2 border-b">{product.unit_price}</td>
                          <td className="p-2 border-b">{product.import_price}</td>
                          <td className="p-2 border-b">{product.quantity_in_stock}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-2 text-center text-gray-600">Không có sản phẩm nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              handlePageChange(currentPage - 1);
                            }
                          }}
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(index + 1);
                            }}
                            isActive={index + 1 === currentPage}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      {totalPages > 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              handlePageChange(currentPage + 1);
                            }
                          }}
                          aria-disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

};

export default ProductPage;
