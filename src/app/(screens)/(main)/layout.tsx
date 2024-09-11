
import Header from "@/app/components/Header"
import Sidebar from "@/app/components/Sidebar"
import React from "react"


const MainLayout =({children}:{children:React.ReactNode})=>{
    return(
        <>
        <Header/>
        <div className="h-screen  bg-gradient-to-r from-blue-50 to-blue-100">
        {children}
        </div>
        </>
    )
}

export default MainLayout