import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Profile(){

  const navigate = useNavigate();

    const [profileData,setProfileData] = useState({});


     const getProfile = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}profile`,{withCredentials:true});
                if(res.data.status == true){
                    setProfileData(res.data.data);
                    console.log("data part",res.data.data);
                   
                }
                else{
                       console.log("we can't get the data", res.data.data);
                }
            }catch(err){
                if (err.response && err.response.status === 409) {
                alert(" from profile Session expired. Please login again.");
                navigate("/auth"); 
                }
            }
        }

    useEffect(()=>{
    
        getProfile();

    },[])



    return(<>
        <div>
             <h2>Profile</h2>
      {profileData ? (
        <div>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
        </div>
    </>)


}