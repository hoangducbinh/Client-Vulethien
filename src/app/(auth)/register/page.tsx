'use client'
import React, { useState } from 'react';
import handleAPI from '@/services/handleAPI';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('')
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setError(''); // Clear previous errors
  
    // Validate password matching
    if (password !== confirmPassword) {
      setError('Mật khẩu và mật khẩu xác nhận không khớp.');
      return;
    }
  
    try {
      const response = await handleAPI('/auth/register', { email, password, name }, 'post');
      
      // Handle different HTTP response statuses
      switch (response.status) {
        case 201:
          console.log('Đăng ký thành công:', response.data);
          // Optionally, store token or navigate to login page
          // localStorage.setItem('token', response.data.token);
          break;
        case 400:
          setError('Tài khoản đã tồn tại hoặc dữ liệu không hợp lệ.');
          break;
        case 500:
          setError('Có lỗi từ máy chủ. Vui lòng thử lại sau.');
          break;
        default:
          setError('Đăng ký thất bại, vui lòng thử lại.');
      }
    } catch (err: any) {
      // Check if error is an AxiosError or not
      if (err.response) {
        // Server responded with a status other than 200 range
        setError(`Đã có lỗi xảy ra: ${err.response.data.message}`);
      } else if (err.request) {
        // Request was made but no response was received
        setError('Không nhận được phản hồi từ máy chủ.');
      } else {
        // Something happened in setting up the request
        setError(err.message);
      }
      console.error('Lỗi nè:', err);
    }
  };
  
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Đăng ký</h2>
        <form className="space-y-6" onSubmit={handleRegister}>
        <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update email value
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email value
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Mật khẩu
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password value
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Nhập lại mật khẩu
            </Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập lại mật khẩu của bạn"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password value
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white rounded-lg focus:ring-2 focus:ring-offset-2"
          >
            Đăng ký
          </Button>
        </form>
        <div className="flex justify-end mt-6">
          <Link href={'/login'} className="text-sm hover:underline"> Đăng nhập ở đây </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
