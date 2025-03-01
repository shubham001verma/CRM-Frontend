import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeamDashboard() {
  const userId=sessionStorage.getItem('useridsrmapp');
  const [dataCounts, setDataCounts] = useState({
    
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks:0,
    
  });

  useEffect(() => {
   
    const fetchTotalTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/task/countgetassignedtask/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          totalTasks: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total tasks:', error.message);
      }
    };
  
    const fetchTotalCompletedTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/task/countcompletedgetassignedtask/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          completedTasks: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total tasks:', error.message);
      }
    };
    const fetchTotalPendingTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/task/countpendinggetassignedtask/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          pendingTasks: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total tasks:', error.message);
      }
    };
    // Call all fetch functions
   
   
    fetchTotalTasks();
    fetchTotalCompletedTasks();
    fetchTotalPendingTasks();
   
  }, []);
  

  const { totalTasks, completedTasks,pendingTasks } = dataCounts;

  return (
    <div className="container my-4">
    
      <div className="row g-4">
       
        <Card title="Total Tasks" count={totalTasks} />
        <Card title="Pending Tasks" count={pendingTasks} />
        <Card title="Completed Tasks" count={completedTasks} />
        
      </div>
    </div>
  );
}

const Card = ({ title, count, color }) => (
  <div className="col-6 col-lg-3">
    <div className={`card text-white bg-${color} shadow-sm`}>
      <div className="card-body text-center">
        <h5 className="card-title text-dark mb-3">{title}</h5>
        <h3 className=" fs-2" style={{color:'#33485c',fontWeight:'bold'}}>{count}</h3>
      </div>
    </div>
  </div>
);

export default TeamDashboard;
