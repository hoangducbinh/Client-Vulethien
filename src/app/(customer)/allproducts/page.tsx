'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Search, Filter, Grid, List, Star, ShoppingCart, BarChart2, Truck, ShoppingBag } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import useAPI from '@/services/handleAPI';
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdvancedProductListing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid'>('grid')
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonList, setComparisonList] = useState<string[]>([])
  const [showQuickView, setShowQuickView] = useState<string | null>(null)

  // Fetch products from API
  const { data: productsData, isLoading, isError } = useAPI('/product/getAll', 'get');
  const products = productsData?.data || [];

  // Fetch categories from API
  const { data: categoriesData } = useAPI('/category/getAll', 'get');
  const categories = categoriesData?.data?.map((category: any) => category.name) || [];

  const filteredProducts = products.filter((product: any) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.category))
  )

  const sortedProducts = [...filteredProducts]

  const productsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleComparison = (productId: string) => {
    setComparisonList(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  useEffect(() => {
    if (comparisonList.length > 0) {
      setShowComparison(true)
    } else {
      setShowComparison(false)
    }
  }, [comparisonList])

  const router = useRouter()
  

  const addToCart = useCallback((event: React.MouseEvent, product: any) => {
    event.stopPropagation(); // Prevent event from bubbling up
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.unit_price,
      quantity: 1,
      stock: product.quantity_in_stock,
      unit: product.unit,
      image: product.image
    }
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === cartItem.id)
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    toast.success('Sản phẩm đã được thêm vào giỏ hàng', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }, [])

  const truncateName = (name: string, maxLength: number = 30) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden w-full">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex w-full md:w-1/3 gap-4 ">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0"><Filter className="mr-2 h-4 w-4" /> Lọc</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full md:w-56">
              <DropdownMenuLabel>Danh mục</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category: any) => (
                <DropdownMenuItem key={category}>
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      setSelectedCategories(
                        checked
                          ? [...selectedCategories, category]
                          : selectedCategories.filter((c) => c !== category)
                      )
                    }}
                  />
                  <span className="ml-2">{category}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Đang tải sản phẩm...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product, index) => (
            <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => router.push(`/productdetail/${product._id}`)}
          >
            <Card key={product._id} className="flex flex-col">
              <CardHeader>
                <Image loading="lazy" placeholder="blur" blurDataURL={product.image} src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-contain rounded-t-lg" />
              </CardHeader>
              <CardContent className="flex-grow">
              <CardTitle className="mb-2">{truncateName(product.name)}</CardTitle>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  
                </div>
                <p className="text-lg font-semibold mb-2">{product.unit_price.toLocaleString()} ₫/{product.unit}</p>
                <Badge variant={product.quantity_in_stock > 0 ? "secondary" : "destructive"}>
                  {product.quantity_in_stock > 0 ? `Còn ${product.quantity_in_stock} ${product.unit}` : 'Hết hàng'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">{product.category}</p>
                <p className="text-sm text-muted-foreground">Đơn hàng tối thiểu: <span className="text-green-500"> 10 {product.min_order} {product.unit}</span></p>
                <div className="flex items-center mt-2">
                  <Truck className="h-4 w-4 mr-1" />
                  <span className="text-sm"> <span className="text-green-500">3 đến 5 ngày</span> {product.delivery_time}</span>
                </div>
                {product.promotion && (
                  <div className="mt-2 p-2 bg-yellow-100 rounded-md">
                    <p className="text-sm text-yellow-800">{product.promotion}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                  <Button 
                    className="flex-grow mr-2" 
                    onClick={(e) => addToCart(e, product)}
                  >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComparison(product._id);
                        }}
                      >
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>So sánh sản phẩm</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuickView(product._id);
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                      <DialogDescription>Chi tiết sản phẩm</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Image loading="lazy" placeholder="blur" blurDataURL={product.image} src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-contain rounded-lg" />
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Giá:</strong> {product.unit_price.toLocaleString()} ₫/{product.unit}</li>
                        <li><strong>Tồn kho:</strong> {product.quantity_in_stock} {product.unit}</li>
                        <li><strong>Đơn hàng tối thiểu:</strong> {product.min_order} {product.unit}</li>
                        <li><strong>Thời gian giao hàng:</strong> 3 đến 5 ngày{product.delivery_time}</li>
                        {product.promotion && <li><strong>Khuyến mãi:</strong> {product.promotion}</li>}
                      </ul>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {sortedProducts.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">Không tìm thấy sản phẩm phù hợp.</p>
      )}

      <div className="mt-8 flex items-center justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {showComparison && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-2">So sánh sản phẩm</h3>
          <div className="flex overflow-x-auto space-x-4">
            {comparisonList.map(id => {
              const product = products.find((p: any) => p._id === id)
              if (!product) return null
              return (
                <Card key={product._id} className="flex-shrink-0 w-64">
                  <CardHeader>
                    <CardTitle className="text-sm">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm"><strong>Giá:</strong> {product.unit_price.toLocaleString()} ₫/{product.unit}</p>
                    <p className="text-sm"><strong>Tồn kho:</strong> {product.quantity_in_stock} {product.unit}</p>
                    <p className="text-sm"><strong>Đánh giá:</strong> {product.rating}/5</p>
                    <p className="text-sm"><strong>Thời gian giao hàng:</strong> {product.delivery_time}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <Button className="mt-2" onClick={() => setComparisonList([])}>Đóng so sánh</Button>
        </div>
      )}
    </div>
  )
}