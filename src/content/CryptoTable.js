import React from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useContext } from 'react';

const CryptoTable = () => {
    const { authState } = useContext(AuthContext);

    if (authState.token == null) {
        return (
            <div>
                <p>You must login</p>
            </div>
        );
    }
    return (
        <div>
            <p>Hello, {authState.username}</p>
        </div>
    );
};

export default CryptoTable;
