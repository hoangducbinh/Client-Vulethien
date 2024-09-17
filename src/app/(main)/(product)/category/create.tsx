'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import handleAPI from '@/services/handleAPI'
import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea'

const CreateCategory = () => {
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [open, setOpen] = useState(false)
    const [alertType, setAlertType] = useState('') // 'success' or 'error'
    const [alertMessage, setAlertMessage] = useState('')

    const handleCreateCategory = async () => {
        try {
            const response = await handleAPI('/category/create', { name: category, description: description }, 'post')
            if (response.status === 201) {
                setAlertType('success')
                setAlertMessage('Tạo danh mục thành công')
            } else {
                setAlertType('error')
                setAlertMessage('Tạo danh mục thất bại')
            }
            setOpen(true)
            console.log('Response', response)
        } catch (error: any) {
            setAlertType('error')
            setAlertMessage(error.message || 'Có lỗi xảy ra khi tạo danh mục.')
            setOpen(true)
            console.log('Error', error)
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tạo Danh Mục Mới</h2>
            
            <div className="space-y-6">
                <div>
                    <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</Label>
                    <Input
                        id="category"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        placeholder="Nhập tên danh mục"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                
                <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</Label>
                    <Textarea
                        id="description"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        placeholder="Nhập mô tả cho danh mục"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>
                
                <Button
                    className="w-full "
                    onClick={handleCreateCategory}
                >
                    Tạo danh mục
                </Button>
            </div>
    
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className={`text-xl font-semibold mb-2 ${alertType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {alertType === 'success' ? 'Thành công' : 'Lỗi'}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="text-sm text-gray-600 mb-4">
                        {alertMessage}
                    </AlertDialogDescription>
                    <AlertDialogFooter className="flex justify-end">
                        <AlertDialogAction
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out"
                            onClick={() => setOpen(false)}
                        >
                            Đóng
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default CreateCategory
