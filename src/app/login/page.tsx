'use client'
import React from 'react';
import { Button, Input, Label } from '@/components/export/shadcn';

const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Đăng nhập</h2>
        <form className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-2  focus:outline-none"
              placeholder="Nhập email của bạn"
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
            />
          </div>
          <Button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white rounded-lg focus:ring-2 focus:ring-offset-2"
          >
            Đăng nhập
          </Button>
        </form>
        <div className="flex justify-between mt-6">
          <a href="#" className="text-sm  hover:underline">
            Quên mật khẩu?
          </a>
          <a href="#" className="text-sm  hover:underline">
            Đăng ký tài khoản mới
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
