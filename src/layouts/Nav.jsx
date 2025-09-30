import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Nav(props){
    const[sfsl,setSfsl] = useState(true);

useEffect(() => {
  // Run on mount
  isLoggedIn();

  // Setup axios interceptor
  const interceptor = axios.interceptors.response.use(
    (response) => {
      if (!response.config.url.includes("profile/isLoggedIn")) {
        isLoggedIn(); // ✅ re-check login after every request
      }
      return response;
    },
    (error) => {
      if (
        error.config &&
        error.config.url &&
        !error.config.url.includes("profile/isLoggedIn")
      ) {
        isLoggedIn(); // ✅ also re-check on errors like 401
      }
      return Promise.reject(error);
    }
  );

  // Cleanup interceptor on unmount
  return () => {
    axios.interceptors.response.eject(interceptor);
  };
}, []);



    
    const isLoggedIn = async()=>{
        try{
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}profile/isLoggedIn`,{},{withCredentials : true});
            if(res.data.statusBoolean){
                console.log("everything is find");
                setSfsl(true);
                props.logginStatus(true);
            }
            else{
              setSfsl(false)
            }
        }
        catch(err){
           console.log("error thrown for the nav isLoggedIn method :: ",err);
           setSfsl(false);
           props.logginStatus(false);
        }


    }

    const signout = async()=>{
        try{
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/logout`,{},{withCredentials : true});
            if(res.data.message){
                alert(res.data.message);
                console.log(res.data.message)
            }
        }
        catch(err){
            alert(err.message);
            console.log(err);
        }
        
    }


    return(<>
        <div>
            <Link to={"/"}>home</Link>
            {!(sfsl) && <Link to={"/auth"}>Sign up</Link>}
            {sfsl && <div><Link to={"/cart"}>Cart</Link>
                          <Link to={"/profile"}>profile</Link>
                          <Link to={"/orders"}>Orders</Link>
                          </div>}
            {sfsl && <button onClick={signout}>logout</button>}

        </div>
    </>)

}