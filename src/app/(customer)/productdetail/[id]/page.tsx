'use client'

import { useEffect, useState } from 'react';
import useAPI from '@/services/handleAPI';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const { data, isLoading, isError } = useAPI(`/product/get/${id}`, 'get');

  useEffect(() => {
    if (data) {
      setProduct(data.data);
    }
  }, [data]);

  if (isLoading) return <p>Đang tải thông tin sản phẩm...</p>;
  if (isError) return <p>Có lỗi xảy ra khi tải thông tin sản phẩm.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h1>
      {product && (
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Image loading="lazy" placeholder="blur" blurDataURL={product.image} src={product.image} alt={product.name} width={200} height={200} className="rounded-lg shadow-md object-contain w-auto h-auto" />
              </div>
              <div>
                <p className="text-lg font-semibold">Giá: <span className="text-red-500">{product.unit_price.toLocaleString()} ₫/{product.unit}</span></p>
                <p className="text-lg">Tồn kho: {product.quantity_in_stock} {product.unit}</p>
                <p className="text-lg">Đánh giá: <span className="text-yellow-500">{product.rating}/5</span></p>
                <p className="text-lg">Thời gian giao hàng: <span className="text-green-500">{product.delivery_time}</span></p>
                <p className="text-lg">Chi tiết: {product.description}</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Thêm vào giỏ hàng</button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductDetail;