import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import API_BASE_URL from "../components/Config";
function EditTeamProfile() {
  const [teamData, setTeamData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const[image,setImage]=useState(null)
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/team/singleteam/${id}`
        ); 
        console.log(response)
        setTeamData(response.data.teamMember
        );
        setImage(response.data.teamMember.image)
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeamData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', teamData.name);
    formData.append('phone', teamData.phone);
    
    formData.append('address', teamData.address);
    if (image) {
      formData.append('image', image);
    }
    try {
      const response = await axios.put(
        `${API_BASE_URL}/team/updateteammemberprofile/${id}`,
        formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        }
      ); 
      console.log(response);
     
    
      alert('Profile updated successfully');
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleUpdate}> 
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={teamData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={teamData.email}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <ReactPhoneInput
              country={"us"} 
              value={teamData.phone}
              onChange={(phone) => setTeamData({ ...teamData, phone })}
              inputProps={{
                name: "phone",
                required: true,
              }}
              className="form-control"
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
              value={teamData.address}
              onChange={handleChange}
              required
            />
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
                  : `http://localhost:5000/${image}`
              }
              alt="teammember"
              className="mt-2"
              style={{ width: "130px",height: "90px" }}
            />
          )}
          </div>
        </div>
        <button type="submit" className="submitbtn">
          Update Team
        </button>
      </form>
    </div>
  );
}

export default EditTeamProfile;
