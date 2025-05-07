import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/openBtn.css";
import "../css/editEmployeePopup.css";

export default function EditEmpl({ id, email }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        name: '',
        password: '',
        role: '',
        salary: 0,
        income: 0,
        description: '',
        birthdate: '',
        userId: '',
    });

    const openPopup = async () => {
        setIsPopupOpen(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `https://dreamsdeluxeapi.azurewebsites.net/employer/getEmployerByEmail/${email}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = response.data;
            setEmployeeData({
                name: data.name || '',
                password: data.password || '',
                role: data.role || '',
                salary: data.salary ?? 0,
                income: data.income ?? 0,
                description: '',
                birthdate: data.birthdate || '',
                userId: data.id || '',
            });
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `https://dreamsdeluxeapi.azurewebsites.net/employer/editemployer/${localStorage.getItem("adminId")}/${employeeData.userId}`,
                employeeData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsPopupOpen(false);
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
    };

    return (
        <div>
            <button className="emplEdit" onClick={openPopup}>Edit</button>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>Edit Employee</h2>
                        <form>
                            <label>Name:</label>
                            <input type="text" name="name" className="textinput-editemployee" value={employeeData.name} onChange={handleChange} />

                            <label>Email:</label>
                            <input type="text" name="email" className="textinput-editemployee" value={email} disabled />

                            <label>Role:</label>
                            <input type="text" name="role" className="textinput-editemployee" value={employeeData.role} onChange={handleChange} />

                            <label>Salary :</label>
                            <input type="number" name="salary" step="0.01" className="textinput-editemployee" value={employeeData.salary} onChange={handleChange} />

                            <label>Income :</label>
                            <input type="number" name="income" step="0.01" className="textinput-editemployee" value={employeeData.income} onChange={handleChange} />

                            <label>Description:</label>
                            <textarea name="description" className="textinput-editemployee" value={employeeData.description} onChange={handleChange} placeholder="Insert new description" />

                            <label>Birthdate:</label>
                            <input type="text" name="birthdate" className="textinput-editemployee" value={employeeData.birthdate} onChange={handleChange} />
                        </form>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={submitEdit}>Submit</button>
                            <button onClick={() => setIsPopupOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 