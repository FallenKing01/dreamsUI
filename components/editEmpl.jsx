import axios from 'axios';
import "../css/openBtn.css"

export default function EditEmpl({ id }){
    const deleteTable = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/tables/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <button className="emplEdit" onClick={deleteTable}>Edit</button>
    );
};