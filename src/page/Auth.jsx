import { useState } from "react"
import Login from "../component/Login";
import SignUp from "../component/SignUp";

export default function Auth(){

    const[betSwitch,setBetSwitch] = useState(false);

    return(<>

        {betSwitch ?  <Login/> :  <SignUp betSwitch={setBetSwitch}/>}
        <button onClick={()=>{setBetSwitch(!betSwitch)}}>{betSwitch ? " Sign Up " : " Login" }</button>
                   
    </>)

}