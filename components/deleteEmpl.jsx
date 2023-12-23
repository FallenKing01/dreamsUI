import axios from 'axios';
import "../css/openBtn.css"

export default function DeleteEmpl({ id }){
    const deleteEmployer = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/employer/delemployer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <button className="emplDelete" onClick={deleteEmployer}>Delete</button>
    );
};