import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/openBtn.css";

// Import CSS for modal/popup
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
        birthdate: ''
    });

    // Function to open the popup and fetch the employee's data
    const openPopup = async () => {
        setIsPopupOpen(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/employer/getEmployerByEmail/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            setEmployeeData({
                name: data.name,
                password: data.password,
                role: data.role,
                salary: data.salary,
                income: data.income,
                description: '',
                birthdate: data.birthdate
            });
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    // Function to handle changes in the input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to submit the updated data
    const submitEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://dreamsdeluxeapi.azurewebsites.net/employer/editemployer/${id}/${employeeData.userId}`, employeeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsPopupOpen(false); // Close the popup after submission
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
    };

    return (
        <div>
            <button className="emplEdit" onClick={openPopup}>Edit</button>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Edit Employee</h2>
                        <form>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={employeeData.name}
                                onChange={handleChange}
                                disabled
                            />
                            <label>Email:</label>
                            <input
                                type="text"
                                name="email"
                                value={employeeData.email}
                                disabled
                            />
                            <label>Password:</label>
                            <input
                                type="text"
                                name="password"
                                value={employeeData.password}
                                onChange={handleChange}
                            />
                            <label>Role:</label>
                            <input
                                type="text"
                                name="role"
                                value={employeeData.role}
                                onChange={handleChange}
                            />
                            <label>Salary:</label>
                            <input
                                type="number"
                                name="salary"
                                value={employeeData.salary}
                                onChange={handleChange}
                            />
                            <label>Income:</label>
                            <input
                                type="number"
                                name="income"
                                value={employeeData.income}
                                onChange={handleChange}
                            />
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={employeeData.description}
                                onChange={handleChange}
                            />
                            <label>Birthdate:</label>
                            <input
                                type="text"
                                name="birthdate"
                                value={employeeData.birthdate}
                                onChange={handleChange}
                            />
                        </form>
                        <button onClick={submitEdit}>Submit</button>
                        <button onClick={() => setIsPopupOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
