import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserOrder(){

    const [orderList, setOrderList] = useState([]);
    const [editSwitch, setEditSwitch] = useState(false);
    const navigate = useNavigate();

    const getAllOrder = async()=>{
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}order/allOrders/1/10`,{withCredentials : true});
            if(res.data){
                setOrderList(res.data);
            }
        }
        catch(err){
            console.log("error in getting the all the order list",err);
        }
    } 

    useEffect(()=>{
        getAllOrder();
    },[])

    const orderStatusUpdate =async(e,id)=>{
        e.preventDefault();
        const status = e.target.status.value;
        try{
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}order/updateOrder/${id}/${status}`,{},{withCredentials : true});
        alert(res.data.message);
        getAllOrder();
    }
        catch(err){
            console.log("error in updating status", err);
            if(err.response.status === 403){
                navigate("/auth");
            }
        }
    }


    return(
        <>
            <div>
                {
                    (orderList.length > 0) ?
                     (<div style={{display : "flex",backgroundColor : "red"}}>
                        <ul  style={{display : "inline"}}>
                            {orderList.map((order)=>{
                                return(
                                    <li>
                                        <div style={{display : "inline"}}>
                                            <p>{order.date.split("T")[0]}</p>
                                            <p>{order.buyerName}</p>
                                            <p>{order.buyer?.mobileNo}</p>
                                            <p>{order.buyer?.address}</p>
                                            <div>{order.product.map(product=>{
                                                return(
                                                    <div>
                                                        <img src={product.image} alt="img" width={50} height={50}/>
                                                        <p>{product.productName}</p>
                                                        <p>{product.description}</p>
                                                        <p>{product.price}</p>
                                                    </div>
                                                )
                                            })}</div>
                                            <p>{order.status}</p>
                                            {
                                                editSwitch &&
                                                (
                                                    <form action="" onSubmit={(e)=>orderStatusUpdate(e,order.id)}>
                                                        <select id="status" name="status" defaultValue={order.status}>
                                                            <option value="Order-placed">Order placed</option>
                                                            <option value="out-for-delivery">Out for Delivery</option>
                                                            <option value="delivered">delivered</option>
                                                        </select>
                                                        <input type="submit" value="submit"/>
                                                    </form>
                                                )
                                            }
                                            <button onClick={()=>{setEditSwitch((pre)=>!pre)}}>edit</button>

                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                     </div>) 
                     :
                    (<div>No orders</div>)
                }
            </div>
        </>
    )
}