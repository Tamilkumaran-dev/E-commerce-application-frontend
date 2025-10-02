// import axios from "axios";
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom";

// export default function Profile(){

//   const navigate = useNavigate();

//     const [profileData,setProfileData] = useState({});
//     const [editSwitch, setEditSwitch] = useState(false);

//      const getProfile = async()=>{
//             try{
//                 const res = await axios.get(`${import.meta.env.VITE_BASE_URL}profile`,{withCredentials:true});
//                 if(res.data.status === true){
//                     if(res.data.data.personalDetail === null){
                      
//                       const {id,name,email} = res.data.data;
//                       const personalDetail = {
//                         mobileNo : 1,
//                         address : ""
//                       }
//                       setEditSwitch({
//                         id,name,email,personalDetail
//                       })
//                       console.log("consoled the data",{
//                         id,name,email,personalDetail
//                       })
//                     }
//                     else{
//                     setProfileData(res.data.data);
//                     console.log("data part",res.data.data);
//                     }
                    
                   
//                 }
//                 else{
//                        console.log("we can't get the data", res.data.data);
//                 }
//             }catch(err){

//                 if (err.response && err.response.status === 409) {
//                 alert(" from profile Session expired. Please login again.");
//                 navigate("/auth"); 
//                 }

//                 else{
//                   console.log("thrown a error while fetching profile", err);
//                 }
//             }
//         }

//     useEffect(()=>{
    
//         getProfile();

//     },[])


//     const submitUpdate = async(e)=>{
//       e.preventDefault();
//       try{
//         const res = await axios.put(`${import.meta.env.VITE_BASE_URL}profile/UpdateProfile`,profileData,{withCredentials:true});
//         if(res.data){
//                getProfile();
//               setEditSwitch(false);
//         }
//         else{
//           console.log("error occurs in the submit the update")
//         }
        
        
//       }
//       catch(err){
//         alert(err.response.message);
//       }

//     }

    
//     const updateUser = (e)=>{
//         setProfileData({...profileData,[e.target.name]:e.target.value});
//     }


//     return(<>
//         <div>
            
//              <h2>Profile</h2>
//                <div>
//                 <button onClick={()=>setEditSwitch(!editSwitch)}>{editSwitch ? "edit" : "X" }</button>
//               </div>
//               {editSwitch ? 
          
//               <div>
//                 {profileData.personalDetail ? 
//                 (
//                   <form action="" onSubmit={(e)=>submitUpdate(e)}>
//                     <input type="text" name="name" id="name" value={profileData.name} onChange={(e)=>{updateUser(e)}} required/>
//                     <input type="email" name="email" id="email" value={profileData.email} onChange={(e)=>{updateUser(e)}} required/>
//                     <input type="tel" name="mobileNo" id="mobileNo" value={profileData.personalDetail.mobileNo} onChange={(e)=>{updateUser(e)}} required/>
//                     <textarea name="address" id="address" cols="30" rows="10" value={profileData.personalDetail.address} onChange={(e)=>{updateUser(e)}} required></textarea>
//                     <input type="submit" value="update"/>
//                   </form>
//                 )
//                 :
//                 (<div>
//                   login
//                   </div>
//                   )
//                 }
//               </div>
//               :
//               <div>
//                   { profileData.personalDetail ?  (
//                     <div>
//                       <p><strong>Name:</strong> {profileData.name}</p>
//                       <p><strong>Email:</strong> {profileData.email}</p>
//                       <p><strong>MobileNo : </strong> {profileData.personalDetail.mobileNo}</p>
//                       <p><strong>address: </strong> {profileData.personalDetail.address}</p>
//                     </div>
//                   ) : (
//                     <p>Loading profile...</p>
//                   )}
//               </div>
//               }    
//         </div>
//     </>)


// }

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // ✅ initialize with empty personalDetail to avoid undefined
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    personalDetail: {
      mobileNo: "",
      address: "",
    },
  });
  const [editSwitch, setEditSwitch] = useState(false);
  const [loading, setLoading] = useState(true); // show loading while fetching

  const getProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}profile`,
        { withCredentials: true }
      );

      if (res.data.status === true) {
        if (res.data.data.personalDetail === null) {
          const { id, name, email } = res.data.data;
          const personalDetail = { mobileNo: "", address: "" };
          setProfileData({ id, name, email, personalDetail });
          setEditSwitch(true); // auto-open form if details are missing
        } else {
          setProfileData(res.data.data);
        }
      } else {
        console.log("we can't get the data", res.data.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Session expired. Please login again.");
        navigate("/auth");
      } else {
        console.log("error fetching profile", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}profile/UpdateProfile`,
        profileData,
        { withCredentials: true }
      );
      if (res.data) {
        getProfile();
        setEditSwitch(false);
      } else {
        console.log("error occurs in submitting update");
      }
    } catch (err) {
      alert(err.response?.message || "Update failed");
    }
  };

  const updateUser = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNo" || name === "address") {
      setProfileData((prev) => ({
        ...prev,
        personalDetail: {
          ...prev.personalDetail,
          [name]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading) return <p>Loading profile...</p>; // ⏳ show while fetching

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <button onClick={() => setEditSwitch(!editSwitch)}>
          {editSwitch ? "X" : "Edit"}
        </button>
      </div>

      {editSwitch ? (
        <form onSubmit={submitUpdate}>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={updateUser}
            required
          />
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={updateUser}
            required
          />
          <input
            type="tel"
            name="mobileNo"
            placeholder="fill the mobile number"
            value={profileData.personalDetail.mobileNo}
            onChange={updateUser}
            required
          />
          <textarea
            name="address"
            cols="30"
            rows="10"
            placeholder="fill the address"
            value={profileData.personalDetail.address}
            onChange={updateUser}
            required
          ></textarea>
          <input type="submit" value="Update" />
        </form>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>MobileNo:</strong> {profileData.personalDetail.mobileNo}
          </p>
          <p>
            <strong>Address:</strong> {profileData.personalDetail.address}
          </p>
        </div>
      )}
    </div>
  );
}
