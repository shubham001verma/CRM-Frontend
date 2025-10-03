import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash, CheckCircle, Search,PlusCircle } from "lucide-react";
import Swal from "sweetalert2";
import API_BASE_URL from "../../components/Config";

// Import your placeholder images
import img1 from '../../assets/user-1.jpg';
import img2 from '../../assets/user-2.jpg';
import img3 from '../../assets/user-3.jpg';
import img4 from '../../assets/user-4.jpg';
import { Link, NavLink } from "react-router-dom";

const ManageProfile = () => {
    const token = localStorage.getItem('admin_token');
    const [profiles, setProfiles] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({
        name: "",
        gender: "",
        religion: "",
        maritalStatus: "",
    });
    const [loading, setLoading] = useState(true);

    const placeholderImages = [img1, img2, img3, img4];

    const getRandomPlaceholder = () => {
        const randomIndex = Math.floor(Math.random() * placeholderImages.length);
        return placeholderImages[randomIndex];
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            setProfiles(response.data.profiles);
        } catch (error) {
            console.error("Error fetching profiles:", error);
            Swal.fire("Error", "Failed to fetch profiles.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (profileId) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to approve this profile.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, approve it!`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.patch(`${API_BASE_URL}/api/profile/approve/${profileId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setProfiles(prevProfiles =>
                        prevProfiles.map(profile =>
                            profile._id === profileId ? { ...profile, isApproved: true } : profile
                        )
                    );
                    Swal.fire(`Approved!`, `Profile has been approved.`, "success");
                } catch (error) {
                    console.error(`Error approving profile:`, error);
                    Swal.fire("Error!", "Something went wrong.", "error");
                }
            }
        });
    };

    const handleDelete = async (profileId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_BASE_URL}/api/admin/delete/${profileId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setProfiles(profiles.filter((profile) => profile._id !== profileId));
                    Swal.fire("Deleted!", "Profile has been deleted.", "success");
                } catch (error) {
                    console.error("Error deleting profile:", error);
                    Swal.fire("Error!", "Something went wrong.", "error");
                }
            }
        });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({
            ...searchCriteria,
            [name]: value,
        });
    };

    const filteredProfiles = profiles.filter(profile => {
        const { name, gender, religion, maritalStatus } = searchCriteria;
        return (
            (profile.fullName || '').toLowerCase().includes(name.toLowerCase()) &&
            (gender === '' || (profile.gender && profile.gender.toLowerCase() === gender.toLowerCase())) &&
            (religion === '' || (profile.religion && profile.religion.name && profile.religion.name.toLowerCase().includes(religion.toLowerCase()))) &&
            (maritalStatus === '' || (profile.maritalStatus && profile.maritalStatus.toLowerCase() === maritalStatus.toLowerCase()))
        );
    });

    if (loading) {
        return <div>Loading profiles...</div>;
    }

    return (
        <div className="card">
            <div className="card-header flex justify-between items-center p-4">
                <h2 className="text-lg font-semibold dark:text-white">All Profiles</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            placeholder="Search by name"
                            value={searchCriteria.fullName}
                            onChange={handleSearchChange}
                            className="px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
                    </div>
                    <div className="relative">
                        <select
                            name="gender"
                            value={searchCriteria.gender}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="religion"
                            placeholder="Search by religion"
                            value={searchCriteria.religion}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div className="relative">
                        <select
                            name="maritalStatus"
                            value={searchCriteria.maritalStatus}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">All Marital Statuses</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="relative h-auto w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                    <table className="table">
                        <thead className="table-header">
                            <tr className="table-row">
                                <th className="table-head">#</th>
                                <th className="table-head">Photo</th>
                                <th className="table-head">Full Name</th>
                                <th className="table-head">Gender</th>
                                <th className="table-head">Religion</th>
                                <th className="table-head">Marital Status</th>
                                <th className="table-head">IsPrimum</th>
                                <th className="table-head">Status</th>
                                <th className="table-head">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {filteredProfiles.length > 0 ? (
                                filteredProfiles.map((profile, index) => (
                                    <tr key={profile._id} className="table-row">
                                        <td className="table-cell">{index + 1}</td>
                                        <td className="table-cell">
                                            <div className="flex gap-x-1 w-14 h-14 overflow-hidden rounded-full border">
                                                {profile.photos && profile.photos.length > 0 ? (
                                                    <img
                                                        src={profile.photos}
                                                        alt={profile.fullName}
                                                        className="size-full rounded-sm object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={getRandomPlaceholder()}
                                                        alt="Placeholder"
                                                        className="size-full rounded-sm object-cover"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="table-cell">{profile.fullName}</td>
                                        <td className="table-cell">{profile.gender}</td>
                                        <td className="table-cell">{profile.religion?.name}</td>
                                        <td className="table-cell">{profile.maritalStatus}</td>
                                        <td className="table-cell">
  {profile.isPremium === true ? (
    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
      Premium
    </span>
  ) : (
    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
      Free
    </span>
  )}
</td>

                                        <td className="table-cell">
                                            {profile.isApproved === true ? (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-500 rounded-full">Approved</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-500 rounded-full">Not Approved</span>
                                            )}
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                {profile.isApproved !== true && (
                                                    <button
                                                        onClick={() => handleApprove(profile._id)}
                                                        className="text-green-500 hover:text-green-700"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={22} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(profile._id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                    title="Delete Profile"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-row">
                                    <td colSpan="8" className="table-cell text-center text-gray-500">No profiles found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageProfile;
