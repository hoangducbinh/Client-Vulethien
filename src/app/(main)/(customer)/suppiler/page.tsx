'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import handleAPI from "@/services/handleAPI";
import { useState } from "react";

const SupplierPage = () => {
    const [supplierName, setSupplierName] = useState<string>('');
    const [supplierContactInfo, setSupplierContactInfo] = useState<string>('');
    const [supplierAddress, setSupplierAddress] = useState<string>('');

    const handleCreateSupplier = async () => {
        try {
            const response = await handleAPI('/supplier/create', {
                name: supplierName,
                contact_info: supplierContactInfo,
                address: supplierAddress,
            }, 'post');
            console.log(response.data)
        } catch (error) {
            console.error('Error creating supplier:', error);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Create New Supplier</h1>
            
            <div className="space-y-4 w-full max-w-md">
                <Input 
                    type="text" 
                    placeholder="Supplier Name" 
                    value={supplierName} 
                    onChange={(e) => setSupplierName(e.target.value)} 
                    className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                <Input 
                    type="text" 
                    placeholder="Contact Info" 
                    value={supplierContactInfo} 
                    onChange={(e) => setSupplierContactInfo(e.target.value)} 
                    className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                <Input 
                    type="text" 
                    placeholder="Address" 
                    value={supplierAddress} 
                    onChange={(e) => setSupplierAddress(e.target.value)} 
                    className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                <Button 
                    onClick={handleCreateSupplier} 
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition"
                >
                    Create Supplier
                </Button>
            </div>
        </div>
    )
}

export default SupplierPage;
