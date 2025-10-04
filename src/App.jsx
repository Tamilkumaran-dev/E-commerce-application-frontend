import './App.css'
import Nav from './layouts/Nav'
import Auth from './page/Auth'
import Home from './page/Home'
import{BrowserRouter, Route, Router, Routes} from 'react-router-dom'
import Profile from './page/Profile'
import { useState ,createContext, useEffect} from 'react'
import Product from './page/Product'
import Cart from './page/Cart'
import Order from './page/Order'
import AddProduct from './page/adminPages/AddProduct'
import EditProduct from './page/adminPages/EditProduct'
import EditProductList from './page/adminPages/EditProductList'
import UserOrder from './page/adminPages/UserOrders'
import Footer from './layouts/Footer'

export const LoginContext = createContext();  

function App() {
 
   const[sendLoginStatus, setSendLoginStatus] = useState(true);

  return (
    <>
    <LoginContext.Provider value={sendLoginStatus}>
    <BrowserRouter>
    <Nav logginStatus = {setSendLoginStatus}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/orders' element={<Order/>}/>
        <Route path='/addProduct' element={<AddProduct/>}/>
        <Route path='/editProduct' element={<EditProductList/>}/>
        <Route path='/editProduct/:productId' element={<EditProduct/>}/>
        <Route path='/userOrders' element={<UserOrder/>}/>
      </Routes>
      <Footer/>    
      </BrowserRouter>
    </LoginContext.Provider>
    </>
  )
}

export default App
