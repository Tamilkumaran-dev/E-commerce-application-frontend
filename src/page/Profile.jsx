import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    personalDetail: { mobileNo: "", address: "" },
  });
  const [editSwitch, setEditSwitch] = useState(false);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}profile`, {
        withCredentials: true,
      });

      if (res.data.status === true) {
        if (res.data.data.personalDetail === null) {
          const { id, name, email } = res.data.data;
          const personalDetail = { mobileNo: "", address: "" };
          setProfileData({ id, name, email, personalDetail });
          setEditSwitch(true);
        } else {
          setProfileData(res.data.data);
        }
      } else {
        console.log("Failed to get profile data", res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Session expired. Please login again.");
        navigate("/auth");
      } else {
        console.log("Error fetching profile", err);
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
        { headers: { "Content-Type": "application/json" },withCredentials: true }
      );
      if (res.data) {
        getProfile();
        setEditSwitch(false);
      } else {
        console.log("Error updating profile");
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
        personalDetail: { ...prev.personalDetail, [name]: value },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-10">Loading profile...</p>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Profile Info</h2>
          <button
            onClick={() => setEditSwitch(!editSwitch)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {editSwitch ? "Cancel" : "Edit"}
          </button>
        </div>

        {editSwitch ? (
          <form onSubmit={submitUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={updateUser}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={updateUser}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                name="mobileNo"
                placeholder="Enter mobile number"
                value={profileData.personalDetail.mobileNo}
                onChange={updateUser}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                rows="4"
                placeholder="Enter address"
                value={profileData.personalDetail.address}
                onChange={updateUser}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Update Profile
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Name:</strong> {profileData.name}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {profileData.email}
            </p>
            <p className="text-gray-700">
              <strong>Mobile No:</strong> {profileData.personalDetail.mobileNo}
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> {profileData.personalDetail.address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
