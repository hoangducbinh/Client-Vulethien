'use client'
import React, { useState } from 'react';
import handleAPI, { mutateAPI } from '@/services/handleAPI';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';



const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Mật khẩu và mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await mutateAPI('/auth/register', { email, password, name }, 'post');
      
      if (response.status === 201) {
        console.log('Đăng ký thành công:', response.data);
        router.push('/login');
      } else {
        setError('Đăng ký thất bại, vui lòng thử lại.');
      }
    } catch (err: any) {
      if (err.response) {
        setError(`Đã có lỗi xảy ra: ${err.response.data.message}`);
      } else if (err.request) {
        setError('Không nhận được phản hồi từ máy chủ.');
      } else {
        setError('Đã xảy ra lỗi khi đăng ký.');
      }
      console.error('Lỗi đăng ký:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Đăng ký</h2>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Tên
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              onChange={(e) => setEmail(e.target.value)}
              required
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
              onChange={(e) => setPassword(e.target.value)}
              required
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white rounded-lg focus:ring-2 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
        <div className="flex justify-end mt-6">
          <Link href={'/login'} className="text-sm hover:underline">Đăng nhập ở đây</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


