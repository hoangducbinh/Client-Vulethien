'use client';

import React, { useState, useEffect } from 'react';
import handleAPI, { mutateAPI } from '@/services/handleAPI';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated, setToken } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    setToken: state.setToken
  }));

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home'); // Redirect to home if already authenticated
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await mutateAPI('/auth/login', { email, password }, 'post');
      
      if (response && response.token) {
        setToken(response.token);
        router.push('/home');
      } else {
        setError('Đăng nhập thất bại, vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Đăng nhập</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
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
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white rounded-lg focus:ring-2 focus:ring-offset-2"
          >
            Đăng nhập
          </Button>
        </form>
        <div className="flex justify-between mt-6">
          <a href="#" className="text-sm hover:underline">
            Quên mật khẩu?
          </a>
          <Link href={'/register'} className="text-sm hover:underline"> Đăng ký tài khoản mới </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
