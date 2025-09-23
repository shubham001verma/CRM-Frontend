import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash, Search, PlusCircle } from "lucide-react";
import Swal from "sweetalert2";
import API_BASE_URL from "../../components/Config";
import { Link } from "react-router-dom";

const ManageProfession = () => {
  const token = localStorage.getItem("admin_token");
  const [professions, setProfessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profession`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessions(response.data.professions);
    } catch (error) {
      console.error("Error fetching professions:", error);
      Swal.fire("Error", "Failed to fetch professions.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (professionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This profession will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/profession/${professionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfessions(professions.filter((p) => p._id !== professionId));
          Swal.fire("Deleted!", "Profession has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting profession:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const filteredProfessions = professions.filter((p) =>
    (p.occupation || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading professions...</div>;
  }

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold dark:text-white">Manage Professions</h2>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search profession"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
          </div>
          <Link
            to="/addprofession"
            className="border px-4 py-2 rounded-md flex items-center gap-2 
                        hover:bg-gray-100 dark:hover:bg-gray-700 
                        text-gray-800 dark:text-white "
          >
            <PlusCircle size={18} /> Add Profission
          </Link>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="relative h-auto w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">Occupation</th>
                <th className="table-head">Industry</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredProfessions.length > 0 ? (
                filteredProfessions.map((profession, index) => (
                  <tr key={profession._id} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{profession.occupation}</td>
                    <td className="table-cell">{profession.industry || "-"}</td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleDelete(profession._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Profession"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="table-row">
                  <td colSpan="4" className="table-cell text-center text-gray-500">
                    No professions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProfession;
