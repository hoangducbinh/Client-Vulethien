'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Search, Filter, Grid, List, Star, ShoppingCart, BarChart2, Truck, ShoppingBag } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
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
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
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
    product.unit_price >= priceRange[0] && product.unit_price <= priceRange[1] &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.category))
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'price') return a.unit_price - b.unit_price
    if (sortBy === 'stock') return b.quantity_in_stock - a.quantity_in_stock
    if (sortBy === 'sales') return b.sales - a.sales
    return 0
  })

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

  const addToCart = useCallback((product: any) => {
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
    toast.success('Sản phẩm đã được thêm vào giỏ hàng')
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <div className="fixed bottom-4 right-4">
        <Button onClick={() => router.push('/shopping')}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Giỏ hàng
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên</SelectItem>
              <SelectItem value="price">Giá</SelectItem>
              <SelectItem value="stock">Tồn kho</SelectItem>
              <SelectItem value="sales">Doanh số</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Lọc</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
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
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Khoảng giá</DropdownMenuLabel>
              <DropdownMenuItem>
                <Slider
                  min={0}
                  max={1000000}
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2">
                  <span>{priceRange[0].toLocaleString()} ₫</span>
                  <span>{priceRange[1].toLocaleString()} ₫</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setViewMode('grid')}>
                  <Grid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-primary' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem dạng lưới</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setViewMode('list')}>
                  <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-primary' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem dạng danh sách</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Đang tải sản phẩm...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.</p>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product._id} className="flex flex-col">
                  <CardHeader>
                    <Image src={`/react.png`} priority={true} alt={product.name} width={200} height={200} className="w-full h-48 object-cover rounded-t-lg" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardTitle className="mb-2">{product.name}</CardTitle>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                    </div>
                    <p className="text-lg font-semibold mb-2">{product.unit_price.toLocaleString()} ₫/{product.unit}</p>
                    <Badge variant={product.quantity_in_stock > 0 ? "secondary" : "destructive"}>
                      {product.quantity_in_stock > 0 ? `Còn ${product.quantity_in_stock} ${product.unit}` : 'Hết hàng'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">{product.category}</p>
                    <p className="text-sm text-muted-foreground">Đơn hàng tối thiểu: {product.min_order} {product.unit}</p>
                    <div className="flex items-center mt-2">
                      <Truck className="h-4 w-4 mr-1" />
                      <span className="text-sm">{product.delivery_time}</span>
                    </div>
                    {product.promotion && (
                      <div className="mt-2 p-2 bg-yellow-100 rounded-md">
                        <p className="text-sm text-yellow-800">{product.promotion}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                      <Button className="flex-grow mr-2" onClick={() => addToCart(product)}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => toggleComparison(product._id)}>
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
                        <Button variant="outline" size="icon" onClick={() => setShowQuickView(product._id)}>
                          <Search className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{product.name}</DialogTitle>
                          <DialogDescription>Chi tiết sản phẩm</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Image src={`/react.png`}  alt={product.name} width={200} height={200} className="w-full h-48 object-cover rounded-lg" />
                          <p><strong>Giá:</strong> {product.unit_price.toLocaleString()} ₫/{product.unit}</p>
                          <p><strong>Tồn kho:</strong> {product.quantity_in_stock} {product.unit}</p>
                          <p><strong>Đơn hàng tối thiểu:</strong> {product.min_order} {product.unit}</p>
                          <p><strong>Thời gian giao hàng:</strong> {product.delivery_time}</p>
                          {product.promotion && <p><strong>Khuyến mãi:</strong> {product.promotion}</p>}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <Card key={product._id}>
                  <div className="flex items-center p-4">
                    <Image src={`/react.png`} alt={product.name} width={96} height={96} className="w-24 h-24 object-cover rounded-lg mr-4" />
                    <div className="flex-grow">
                      <CardTitle className="mb-2">{product.name}</CardTitle>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                      </div>
                      <p className="text-lg font-semibold">{product.unit_price.toLocaleString()} ₫/{product.unit}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant={product.quantity_in_stock > 0 ? "secondary" : "destructive"}>
                        {product.quantity_in_stock > 0 ? `Còn ${product.quantity_in_stock} ${product.unit}` : 'Hết hàng'}
                      </Badge>
                      <p className="text-sm mt-2">Đơn hàng tối thiểu: {product.min_order} {product.unit}</p>
                      <div className="flex items-center mt-2">
                        <Truck className="h-4 w-4 mr-1" />
                        <span className="text-sm">{product.delivery_time}</span>
                      </div>
                      <div className="flex mt-2">
                        <Button className="mr-2">
                          <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => toggleComparison(product._id)}>
                                <BarChart2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>So sánh sản phẩm</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  {product.promotion && (
                    <div className="px-4 pb-4">
                      <div className="p-2 bg-yellow-100 rounded-md">
                        <p className="text-sm text-yellow-800">{product.promotion}</p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      {sortedProducts.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">Không tìm thấy sản phẩm phù hợp.</p>
      )}

      <div className="mt-8 flex items-center justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
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