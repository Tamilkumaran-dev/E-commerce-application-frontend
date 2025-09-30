import axios from "axios";
import { useState } from "react";

function SignUp({betSwitch}){

    const[userData, setUserData] = useState({
     name: "",
     email: "",
     password: ""});

    const addUser = (e)=>{
            setUserData((pre)=>{
                return {...pre,[e.target.name]:e.target.value}
            })
    }

    const submitEvent =async (e)=>{
        e.preventDefault();
        try{
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/signup`,userData,{withCredentials: true});
           if(res.data.status){
            alert(res.data.message);
            betSwitch((pre)=>!pre)
         
           }
           else{
            alert("error",res.data.message)
           }
        }catch(err){
            if(err.response){
                 console.log("error data:", err.response.data);
                alert(err.response.data.message);
            }
        }
    
    }

    console.log(userData)
    return(
        <>
            <h2>Sign up</h2>
            <div>
                <form action="" method="post" onSubmit={(e)=>submitEvent(e)}>
                    <label htmlFor="nameId">name</label>
                    <input type="text" name="name" id="nameId" value={userData.name} onChange={(e)=>addUser(e)}/>
                     <label htmlFor="emailId">email</label>
                    <input type="text" name="email" id="emailId"  value={userData.email} onChange={(e)=>addUser(e)}/>
                     <label htmlFor="passwordId">password</label>
                    <input type="password" name="password" id="passwordId"  value={userData.password} onChange={(e)=>addUser(e)}/>
                       <label htmlFor="conformPasswordId">conform password</label>
                    <input type="password" name="conformPassword" id="conformPasswordId"/>
                    <input type="submit" value="Sign Up"/>
                </form>
            </div>
                 Sign Up
        </>
    )
}

export default SignUp;