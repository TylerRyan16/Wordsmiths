import './topbar.scss';
import {useNavigate} from 'react-router-dom';

const Topbar = () => {
    const navigate = useNavigate();

    return (
        <div className ='bar-area'>
            <h1 id = "game-title" onClick={() => navigate("/")}>Word Battle</h1>
        </div>
    );
};

export default Topbar;