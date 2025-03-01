import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash,FaUser, FaPlus, FaGoogle, FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaLinkedin,FaEye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUserPlus , FaUserTie } from "react-icons/fa6";
import API_BASE_URL from "../components/Config";

function ManageLeadbyTeam() {

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

const userId=sessionStorage.getItem('useridsrmapp');
  const labelOptions = [
    '90% probability',
    '50% probability',
    'call this week',
    'corporate',
    'potential',
    'referral',
    'satisfied',
    'unsatisfied',
    'inactive',
  ];
  const statusOptions = [
    'New',
    'Discussion',
    'Qualified',
    'Negotiation',
    'Lost',
    'Won',
    'Pending',
    'On Hold',
    'Closed',
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return '#1e90ff';
      case 'Discussion':
        return '#20c997'; 
      case 'Qualified':
        return '#28a745';
      case 'Negotiation':
        return '#ffc107'; 
      case 'Lost':
        return '#dc3545';
      case 'Won':
        return '#6f42c1'; 
      default:
        return '#6c757d'; 
    }
  };
  
  const getConnectionTypeColor = (connectionType) => {
    switch (connectionType) {
      case 'Manager':
        return '#007bff'; 
      case 'Sales Executive':
        return '#ffc107'; 
      case 'Support':
        return '#17a2b8'; 
      case 'Developer':
        return '#324659';
      case 'Editor':
        return '#6c757d'; 
      case 'Graphic Designer':
        return '#28a745'; 
      case 'Other':
        return '#6c757d'; 
    }
  };
  
  const getLabelColor = (label) => {
    switch (label) {
      case '90% probability':
        return '#28a745'; 
      case '50% probability':
        return '#ffc107'; 
      case 'call this week':
        return '#17a2b8'; 
      case 'corporate':
        return '#9c27b0'; 
      case 'potential':
        return '#ff5722'; 
      case 'referral':
        return '#8bc34a'; 
      case 'satisfied':
        return '#4caf50'; 
      case 'unsatisfied':
        return '#f44336'; 
      case 'inactive':
        return '#9e9e9e';
      default:
        return '#6c757d'; 
    }
  };
  const renderSourceIcon = (source) => {
    switch (source) {
      case 'google':
        return <FaGoogle style={{ color: '#4285F4' }} />; 
      case 'youtube':
        return <FaYoutube style={{ color: '#FF0000' }} />; 
      case 'instagram':
        return <FaInstagram style={{ color: '#C13584' }} />; 
      case 'facebook':
        return <FaFacebook style={{ color: '#1877F2' }} />; 
      case 'twitter':
        return <FaTwitter style={{ color: '#1DA1F2' }} />; 
      case 'linkedin':
        return <FaLinkedin style={{ color: '#0077B5' }} />; 
      default:
        return null;
    }
  };
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lead/getledsbyuserid/${userId}`); 
        console.log(response)
        setLeads(response.data.data);
        setFilteredLeads(response.data.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, []);

 

 
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_BASE_URL}/lead/deleteleads/${id}`); 
        const updatedLeads = leads.filter((lead) => lead._id !== id);
        setLeads(updatedLeads);
        setFilteredLeads(updatedLeads);
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = leads.filter(
        (lead) =>
            lead.name.toLowerCase().includes(value) 
    );
    setFilteredLeads(filtered);
};
  
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
  };
  
  const handleLabelFilterChange = (e) => {
    const value = e.target.value;
    setSelectedLabel(value);
  };
  
 
  const handleFilterByDate = () => {
    applyFilters(); 
  };
  
  const applyFilters = () => {
    let filtered = leads;
  
  
    if (search) {
      filtered = filtered.filter((lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  
  
    if (startDate) {
      filtered = filtered.filter((lead) => new Date(lead.createdAt) >= new Date(startDate));
    }
  
    if (endDate) {
      filtered = filtered.filter((lead) => new Date(lead.createdAt) <= new Date(endDate));
    }
  
  
    if (selectedLabel) {
      filtered = filtered.filter((lead) => lead.lables === selectedLabel);
    }
  
   
    if (selectedStatus) {
      filtered = filtered.filter((lead) => lead.status === selectedStatus);
    }
  
  
    setFilteredLeads(filtered);
  };
  

  return (
    <div className="container mt-4">
     <div className="d-flex align-items-center mb-4">
        <div className="input-group" style={{ maxWidth: '100%' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name "
            value={search}
            onChange={handleSearch}
          />
          <span className="input-group-text">
            <Link to="/addleads" style={{ cursor: 'pointer' }}>
              <FaPlus color="#2e343a" />
            </Link>
          </span>
        </div>
      </div>

      <div className="d-flex  align-items-center flex-wrap mb-3 gap-3">
        <div>
          <label htmlFor="startDate" className="me-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control d-inline-block w-auto me-3"
          />
          <label htmlFor="endDate" className="me-2">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control d-inline-block w-auto me-3"
          />
        </div>
        <div>
          <label htmlFor="labelFilter" className="me-2">
            Filter by Label:
          </label>
          <select
            id="labelFilter"
            value={selectedLabel}
            onChange={handleLabelFilterChange}
            className="form-select w-auto d-inline-block me-3"
          >
            <option value="">All Labels</option>
            {labelOptions.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Status: </label> <select
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            className="form-select w-auto d-inline-block me-3"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleFilterByDate} className="submitbtn">
          Apply Filters
        </button>
      </div>


 
      <div className="d-none d-sm-block">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>SNo.</th>
              <th>Name</th>
              <th>Primary Connection</th>
              <th>Source</th>
              <th>Phone</th>
              <th>Owner</th>
              <th>lables</th>
              <th>Address</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            
  {filteredLeads.length > 0 ? (
    filteredLeads.map((lead, index) => (
    
      <tr key={lead.id}>
       
        <td>{index + 1}</td>
        <td>{lead.name}</td>
        <td className="">
          <span style={{ display: 'flex', alignItems: 'center',gap:'5px' }}>
          
            {lead.primeryConection} <span className='badge'
                style={{
                  backgroundColor: getConnectionTypeColor(lead.primeryConectiontype),
                  color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.67rem',
              fontWeight: 'bold',
                }}
              >
                {lead.primeryConectiontype}
              </span>
          </span>
        </td>
        <td>{renderSourceIcon(lead.source)} {lead.source}</td>
        <td>+{lead.phone}</td>
        <td>
          <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaUserTie style={{ marginRight: '10px', color: '#32475c' }} size={20}/>
            {lead.owner}
          </span>
        </td>
        <td>
          <span
            className="badge"
            style={{
              backgroundColor: getLabelColor(lead.lables),
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.67rem',
              fontWeight: 'bold',
            }}
          >
            {lead.lables}
          </span>
        </td>
        <td>{lead.address}</td>
        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
       
        <td>
          <span
            className="badge"
            style={{
              backgroundColor: getStatusColor(lead.status),
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.67rem',
              fontWeight: 'bold',
            }}
          >
            {lead.status}
          </span>
        </td>
        <td>
          <Link to={`/editleads/${lead._id}`} className="me-2">
            <FaEdit color="#2e343a" />
          </Link>
          <Link to={`/leaddetails/${lead._id}`} className="me-2">
          < FaEye color="#2e343a" />
          </Link>
          <FaTrash onClick={() => handleDelete(lead._id)} color="#2e343a"  />
        </td>
      
      </tr>
     
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center">
        No leads found.
      </td>
    </tr>
  )}
 
</tbody>

        </table>
      </div>

      {/* Leads Card Format - For Small Screens */}
      <div className="d-block d-sm-none">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead, index) => (
            <div key={lead.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{lead.name}</h5>
                <p className="card-text">Primary Connection: {lead.primeryConection} <span className='badge'
                style={{
                  backgroundColor: getConnectionTypeColor(lead.primeryConectiontype),
                  color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.67rem',
              fontWeight: 'bold',
                }}
              >
                {lead.primeryConectiontype}
              </span>
         </p>
                <p className="card-text">Email: {renderSourceIcon(lead.source)} {lead.source}</p>
                <p className="card-text">Phone:+{lead.phone}</p>
                <p className="card-text">Owner: {lead.owner}</p>
                <p className="card-text">Lables:  <span
                  className="badge"
                  style={{
                    backgroundColor: getLabelColor(lead.lables),
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '0.67rem',

                  }}
                >
                  {lead.lables}
                </span>
                </p>
                <p className="card-text">Date: {new Date(lead.createdAt).toLocaleDateString()}</p>
                <p className="card-text">Status: <span
                    className="badge"
                    style={{
                      backgroundColor: getStatusColor(lead.status),
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '0.67rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {lead.status}
                  </span>
                  <p className="card-text">Address: {lead.address}</p>
                </p>
                <div className="d-flex justify-content-end align-items-center gap-3">
                  <Link to={`/editleads/${lead._id}`} className="me-2">
                    <FaEdit color="#2e343a" />
                  </Link>
                  <Link to={`/leaddetails/${lead._id}`} className="me-2">
          < FaEye color="#2e343a" />
          </Link>
                  <FaTrash onClick={() => handleDelete(lead._id)} color="#2e343a" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No leads found.</p>
        )}
      </div>
    </div>
  );
}

export default ManageLeadbyTeam;
