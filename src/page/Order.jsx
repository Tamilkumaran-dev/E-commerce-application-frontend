import axios from "axios"
import { useEffect, useState } from "react"

export default function Order(){

    const[orderList, setOrderList] = useState([]);

    useEffect(()=>{
        getOrderList();
    },[])

    const getOrderList = async()=>{
      try{
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}order/getOrderList`,{withCredentials : true});
        if(res.data.status&& !res.data.isException){
            setOrderList(res.data.data);
        }
        console.log(res.data.data)
      }
      catch(err){
            console.log("error while getting the order list",err)
      }
    } 

    const cancelOrder = async(userId, orderId, productId)=>{
        try{
            const res = await axios.put(`${import.meta.env.VITE_BASE_URL}order/cancelProduct/${userId}/${orderId}/${productId}`,{},{withCredentials : true});
            getOrderList();
            alert(res.data.message);
            
        }
        catch(Err){
            console.log("error thrown while cancel the order",Err.response);
        }
        

    }

    return(
        <>
            <div>
                <div>
                    {orderList.length > 0 ? 
                    <div>
                        <ul>
                            {orderList.map((order,index)=>{
                                var totalPrice = 0;
                                return(
                                    
                                    <li>
                                        <h2>{index + 1}</h2>
                                        <h2>{order.id}</h2>
                                        <h2>{order.date.split("T")[0]}</h2>
                                        <ul>{
                                            order.product.map(product=>{

                                                totalPrice += product.price;

                                                return(<>
                                                    <li>
                                                        <div>
                                                            <img src={product.image} alt="img" width={50}/>
                                                            <h3>{product.productName}</h3>
                                                            <h3>{product.price}</h3>
                                                            <div>
                                                                {
                                                                    (order.status === "order-placed") ? 
                                                                    (<button onClick={()=>{cancelOrder(order.buyerId,order.id,product.id)}}>cancel this order</button>)
                                                                    :
                                                                    (<p>product is out for delivery you can't cancel the order</p>)

                                                                }
                                                                
                                                            </div>
                                                            
                                                        </div>
                                                    </li>
                                                </>)
                                            })
                                            }</ul>
                                            <h2>{"Rs " + totalPrice}</h2>
                                            <h2>{order.status}</h2>
                                    </li>
                                    
                                )
                            })}
                        </ul>
                    </div>
                    :
                    <div>
                        No orders
                    </div> }
                </div>     
            </div>
        </>
    )
}