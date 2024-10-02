'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart, Star, Filter, Search, ChevronLeft, ChevronRight, Grid, List, Truck, Clock, BarChart2, TrendingUp, Package, AlertTriangle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { Progress } from "@/components/ui/progress"

export default function AdvancedProductListing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonList, setComparisonList] = useState<number[]>([])
  const [showQuickView, setShowQuickView] = useState<number | null>(null)

  // Giả lập danh sách sản phẩm
  const products = [
    { id: 1, name: "Nước giải khát ABC", price: 120000, stock: 500, category: "Đồ uống", rating: 4.5, image: "/react.png", unit: "Thùng", minOrder: 10, sales: 1200, trend: 'up', deliveryTime: '2-3 ngày', promotion: 'Giảm 10% cho đơn hàng trên 50 thùng' },
    { id: 2, name: "Bánh kẹo XYZ", price: 85000, stock: 300, category: "Bánh kẹo", rating: 4.2, image: "/react.png", unit: "Hộp", minOrder: 20, sales: 800, trend: 'down', deliveryTime: '1-2 ngày', promotion: 'Tặng 1 hộp cho mỗi 10 hộp mua' },
    { id: 3, name: "Dầu ăn DEF", price: 210000, stock: 200, category: "Dầu ăn", rating: 4.7, image: "/react.png", unit: "Thùng", minOrder: 5, sales: 600, trend: 'stable', deliveryTime: '3-4 ngày', promotion: null },
    { id: 4, name: "Mì ăn liền GHI", price: 95000, stock: 1000, category: "Thực phẩm khô", rating: 4.0, image: "/react.png", unit: "Thùng", minOrder: 15, sales: 2000, trend: 'up', deliveryTime: '1-2 ngày', promotion: 'Mua 3 tặng 1' },
    { id: 5, name: "Sữa tươi JKL", price: 320000, stock: 400, category: "Sữa", rating: 4.8, image: "/react.png", unit: "Thùng", minOrder: 8, sales: 1500, trend: 'up', deliveryTime: '2-3 ngày', promotion: 'Giảm giá 5% cho đơn hàng trước 10h sáng' },
    { id: 6, name: "Gia vị MNO", price: 150000, stock: 600, category: "Gia vị", rating: 4.3, image: "/react.png", unit: "Hộp", minOrder: 12, sales: 900, trend: 'stable', deliveryTime: '2-3 ngày', promotion: null },
  ]

  const categories = ["Đồ uống", "Bánh kẹo", "Dầu ăn", "Thực phẩm khô", "Sữa", "Gia vị"]

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    product.price >= priceRange[0] && product.price <= priceRange[1] &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.category))
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'stock') return b.stock - a.stock
    if (sortBy === 'sales') return b.sales - a.sales
    return 0
  })

  const toggleComparison = (productId: number) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
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
              {categories.map((category) => (
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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover rounded-t-lg" />
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                </div>
                <p className="text-lg font-semibold mb-2">{product.price.toLocaleString()} ₫/{product.unit}</p>
                <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                  {product.stock > 0 ? `Còn ${product.stock} ${product.unit}` : 'Hết hàng'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">{product.category}</p>
                <p className="text-sm text-muted-foreground">Đơn hàng tối thiểu: {product.minOrder} {product.unit}</p>
                <div className="flex items-center mt-2">
                  <Truck className="h-4 w-4 mr-1" />
                  <span className="text-sm">{product.deliveryTime}</span>
                </div>
                {product.promotion && (
                  <div className="mt-2 p-2 bg-yellow-100 rounded-md">
                    <p className="text-sm text-yellow-800">{product.promotion}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button className="flex-grow mr-2">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => toggleComparison(product.id)}>
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
                    <Button variant="outline" size="icon" onClick={() => setShowQuickView(product.id)}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                      <DialogDescription>Chi tiết sản phẩm</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover rounded-lg" />
                      <p><strong>Giá:</strong> {product.price.toLocaleString()} ₫/{product.unit}</p>
                      <p><strong>Tồn kho:</strong> {product.stock} {product.unit}</p>
                      <p><strong>Đơn hàng tối thiểu:</strong> {product.minOrder} {product.unit}</p>
                      <p><strong>Thời gian giao hàng:</strong> {product.deliveryTime}</p>
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
            <Card key={product.id}>
              <div className="flex items-center p-4">
                <Image src={product.image} alt={product.name} width={96} height={96} className="w-24 h-24 object-cover rounded-lg mr-4" />
                <div className="flex-grow">
                  <CardTitle className="mb-2">{product.name}</CardTitle>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <p className="text-lg font-semibold">{product.price.toLocaleString()} ₫/{product.unit}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                    {product.stock > 0 ? `Còn ${product.stock} ${product.unit}` : 'Hết hàng'}
                  </Badge>
                  <p className="text-sm mt-2">Đơn hàng tối thiểu: {product.minOrder} {product.unit}</p>
                  <div className="flex items-center mt-2">
                    <Truck className="h-4 w-4 mr-1" />
                    <span className="text-sm">{product.deliveryTime}</span>
                  </div>
                  <div className="flex mt-2">
                    <Button className="mr-2">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => toggleComparison(product.id)}>
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
              const product = products.find(p => p.id === id)
              if (!product) return null
              return (
                <Card key={product.id} className="flex-shrink-0 w-64">
                  <CardHeader>
                    <CardTitle className="text-sm">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm"><strong>Giá:</strong> {product.price.toLocaleString()} ₫/{product.unit}</p>
                    <p className="text-sm"><strong>Tồn kho:</strong> {product.stock} {product.unit}</p>
                    <p className="text-sm"><strong>Đánh giá:</strong> {product.rating}/5</p>
                    <p className="text-sm"><strong>Thời gian giao hàng:</strong> {product.deliveryTime}</p>
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