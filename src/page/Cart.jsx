import { useContext, useEffect, useState } from "react";
import {LoginContext} from "../App"
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Cart(){

    const isLoggedIn = useContext(LoginContext);
    const [cart,setCart] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

const getCart = async ()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}cart/userCart`,{withCredentials : true});
                if(res.data.status == true || res.data.isException == true){
                    setUserId(res.data.data.userId)
                    setCart(res.data.data.cart);
                }    
            }
            catch(err){
                console.log("getcart method throwing error",err);
                setUserId(null);
            }
        }

    useEffect(() => {
  
        if(isLoggedIn){
            getCart();
        }
        else{
            alert("to access cart you have to login first");
            navigate("/auth")
        }
     
    },[isLoggedIn,navigate]);

    const removeProduct = async(productId)=>{
        try{
            const res = await axios.put(`${import.meta.env.VITE_BASE_URL}cart/removeProduct/${userId}/${productId}`,{},{withCredentials:true});
            console.log("Run in removeing method")
            if(res.data.statusBoolean){
                alert(res.data.message);
                getCart();
            }
        }    
        catch(err){
            console.log("Error while removing product",err)
        }    
    };

    const placeOrder = async()=>{
        try{
            const res = await axios.put(`${import.meta.env.VITE_BASE_URL}order/orderPlaced/${userId}`,{},{withCredentials:true});
            alert(res.data.message);
             getCart();
        }
        catch(err){
            if(err.response.status === 401){
                    console.log("error thrown while placeing the order",err.response.message);
                    alert("session expaired");
                    navigate("/auth");
            }
            console.log("error thrown while placeing the order",err.response.message);
            alert(err.response.message);
        }
    }

    return(
        <>
        <div>
            <div>
                <ul>
                    {
                    cart.length > 0 ? 
                    cart.map((product)=>{
                        return(
                        <li>
                            <div>
                                <img src={product.image} alt="image" width={100} height={100}/>
                                <h2>{product.productName}</h2>
                                <p>{product.description}</p>
                                <h2>{product.price}</h2>
                                <button onClick={()=>removeProduct(product.id)}>remove</button>
                            </div>
                        </li>)
                    })
                    :
                    <div>
                        <h2>Cart is empty please add products to place the order</h2>
                    </div>
                    
                    }
                </ul>
            </div>
            <div>
                {
                    cart.length > 0 &&
                    <button onClick={placeOrder}>Order Now</button>
                }
                
            </div>
        </div>
        </>
    )

}