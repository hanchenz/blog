import React from "react";
import { googleLogout } from '@react-oauth/google';
import { Button } from 'react-bootstrap';

function Logout({ setUser }) {
    const onSuccess = () => {
        googleLogout();
        setUser(null);
        localStorage.setItem("login", null);
        console.log('Logout made successfully');
    };

    return (
        <div>
            <Button variant='danger' onClick={onSuccess}>Logout</Button>
        </div>
    );
}

export default Logout;