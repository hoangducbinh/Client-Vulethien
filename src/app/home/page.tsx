'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const HomePage = () => {
    const [count, setCount] = useState(0)
    const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">HomePage</h1>
        <p className="text-lg mb-4">{count}</p>
        <div className="space-x-4">
            <button
                className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                onClick={() => setCount(count + 1)}
            >
                Click me
            </button>
            <button
                className="px-6 py-2 text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                onClick={() => router.push('/login')}
            >
                Go to login page
            </button>
        </div>
    </div>
  )
}

export default HomePage
