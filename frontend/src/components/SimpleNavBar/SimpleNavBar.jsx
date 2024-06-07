import { useLocation, Link } from 'react-router-dom';
import './SimpleNavBar.css';

export const SimpleNavBar= () => {
    const location = useLocation();

    return (
        <div className="simple-navbar">
            <div className="heading-banner">
                <h1>Acebook</h1>
                <h3>Brought to you by the Agile Avengers</h3>
            </div>
            <div className='signup-login'>
                {location.pathname === '/signup' && (
                    <h3>
                        <button className="signup-login-btn"><Link to="/login">Signup</Link></button>
                    </h3> 
                )}
                {location.pathname === '/login' &&(
                    <h3>
                        <button className="signup-login-btn"><Link to="/signup">Login</Link></button>
                    </h3>
                )}
            </div>
        </div>
    )
}