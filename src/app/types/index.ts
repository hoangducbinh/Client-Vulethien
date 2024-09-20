
export interface Supplier {
  _id: string
  name: string
  contact_info: string
  address: string
}
 export interface NewSupplier {
  name: string
  contact_info: string
  address: string
 }

 export interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  supplier: Supplier
 }
 
 export interface NewProduct {
  name: string
  description: string
  price: number
  stock: number
  supplier: Supplier
 }
 
 export interface Order {
  _id: string
  customer: string
  products: Product[]
  total_price: number
  status: string
  order_date: Date
 }
 
 
