import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userData');
        navigate('/signin');
    };

    return (//ฝากแก้ CSS
        <button
            onClick={handleLogout}
            className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${className}`}
        >
            ออกจากระบบ
        </button>
    );
};

export default LogoutButton;
