import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(){

   const navigate =  useNavigate()
    const[login,setLogin] = useState({
        email : "",
        password : ""
    });

    const addUser = (e)=>{
            setLogin((pre)=>{
                return {...pre,[e.target.name]:e.target.value}
            })
    }


    const submitEvent =async (e)=>{
        e.preventDefault();
        try{
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/login`,login,{withCredentials: true});
           if(res.data.status == true){
            alert(res.data.message);
            navigate("/");
            
           }
           else{
            alert("error rice from the login try block else part",res.data.message)
           }
        }catch(err){
            if(err.response){ 
            console.log("error data:", err.response.data);
            alert(err.response.data.message);
         }
        }
    
    }


    return(
        <>
        <div>
            <h2>Login</h2>
            <form action="" onSubmit={(e)=>submitEvent(e)}>
                <label htmlFor="emailId">email</label>
                    <input type="text" name="email" id="emailId"  value={login.email} onChange={(e)=>addUser(e)}/>
                     <label htmlFor="passwordId">password</label>
                    <input type="password" name="password" id="passwordId"  value={login.password} onChange={(e)=>addUser(e)}/>
                    <input type="submit" value="Sign Up"/>
            </form>
        </div>
            

        </>
    )
}

export default Login;