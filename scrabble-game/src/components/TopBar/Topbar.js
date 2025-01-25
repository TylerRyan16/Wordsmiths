import './topbar.scss';
import {Link} from 'react-router-dom';

const Topbar = () => {

    return (
        <div className ='bar-area'>
            <h1 id = "game-title">Word Battle</h1>
           {/* <Link to = {`user/${userId}`}></Link> */}
        </div>
    );
};

export default Topbar;