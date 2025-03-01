import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import API_BASE_URL from "../components/Config";
function EditClientProfile() {
  const navigate = useNavigate();
 const {id}=useParams()

  const [clientData, setClientData] = useState({
    phone: "",
    company: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/client/singleclient/${id}`
        );
        const client = response.data.client;
        setClientData({
          clientname: client.clientname || "",
          phone: client.phone || "",
          company: client.company || "",
          address: client.address || "",
        });
        setImage(client.image || null);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchClientData();
  }, [id]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("phone", clientData.phone);
    formData.append("company", clientData.company);
    formData.append("address", clientData.address);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response=  await axios.put(`${API_BASE_URL}/client/updateclientprofile/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    console.log(response)
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="clientname" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="clientname"
              name="clientname"
              value={clientData.clientname?.owner}
              placeholder="Enter Client Name"
              disabled 
            />
          </div>
    
 
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Phone No.
            </label>
            <div style={{width:'200px'}}>
            <ReactPhoneInput
              country={"us"}
              value={clientData.phone}
              onChange={(phone) =>
                setClientData({ ...clientData, phone })
              }
              inputProps={{
                name: "phone",
                required: true,
               
              }}
            />
            </div>
          </div>
          </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="company" className="form-label">
             My Company
            </label>
            <input
              type="text"
              className="form-control"
              id="company"
              name="company"
              value={clientData.company}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={clientData.address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="image" className="form-label">Profile Picture</label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <img
              src={
                image instanceof File
                  ? URL.createObjectURL(image)
                  : `${API_BASE_URL}/${image}`
              }
              alt="Client"
              className="mt-2"
              style={{ width: "130px", height: "90px" }}
            />
          )}
        </div>
        <button type="submit" className="submitbtn">
          Edit Profile
        </button>
      </form>
    </div>
  );
}

export default EditClientProfile;
