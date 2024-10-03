'use client'
import React, { useState } from 'react';
import { mutateAPI } from '@/services/handleAPI';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu và mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...customerData } = formData;
      const response = await mutateAPI('/customer/create', customerData, 'post');
      
      if (response.message === "Tạo tài khoản khách hàng thành công") {
        toast.success('Đăng ký thành công!');
        router.push('/signin');
      } else {
        toast.error('Đăng ký thất bại, vui lòng thử lại.');
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(`Đã có lỗi xảy ra: ${err.response.data.message}`);
      } else if (err.request) {
        toast.error('Không nhận được phản hồi từ máy chủ.');
      } else {
        toast.error('Đã xảy ra lỗi khi đăng ký.');
      }
      console.error('Lỗi đăng ký:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <ToastContainer />
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Đăng ký</h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <Label htmlFor="name">Tên</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Nhập tên của bạn"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Nhập số điện thoại của bạn"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              type="text"
              name="address"
              id="address"
              placeholder="Nhập địa chỉ của bạn"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu của bạn"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
        <div className="flex justify-end mt-6">
          <Link href={'/signin'} className="text-sm hover:underline">Đã có tài khoản? Đăng nhập ở đây</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;