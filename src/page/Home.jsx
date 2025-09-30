import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../App";


export default function Home(){

    const isLoggedIn = useContext(LoginContext);

    const[products,setProduct] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{

        getData();

    },[])


    const getData = async()=>{
            try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}home/1/10`,{ withCredentials: true});
            setProduct(res.data.content);
            console.log(res.data);
            }
             catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/"); 
        }
      }
    }


    return(<>
        <div>
            <h1>Home 1{`${isLoggedIn}`}</h1>
            <ul>
                {products.map((product)=>{
                    return(
                    <li>
                        <Link to={`/product/${product.id}`}>
                        <div>
                            <img src={product.image} alt="img" width={100} height={100}/>
                            <h2>{product.productName}</h2>
                            <p>{product.description}</p>
                            <p>{product.price}</p>
                        </div>
                        </Link>
                    </li>
                    )
                })}
            </ul>
        </div>
    </>)

}