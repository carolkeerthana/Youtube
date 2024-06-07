import './UserProfile.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../util/AuthContext';
import { fetchUserDetails } from './UserDetailsApi';

const UserProfile = () => {
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAndSetUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    const fetchedUser = await fetchUserDetails();
                    setUser(fetchedUser);
                    localStorage.setItem('user', JSON.stringify(fetchedUser));
                }
            } catch (error) {
                console.error('Failed to fetch user details', error);
            }
        };

        fetchAndSetUser();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        logout();
        navigate('/signin');
    };

    if (!user) {
        return <p>Loading...</p>; // or render some placeholder UI
    }

    return (
        <div className='user-info'>
            <img src={user.photoUrl} alt='User Avatar' />
            <p>{user.channelName}</p>
            <p>{user.email}</p>
            <Link to='/channel'>Your channel</Link>
            <Link to='/studio'>UTube Studio</Link>
            <button onClick={handleSignOut}>Sign out</button>
        </div>
    );
};

export default UserProfile;
