import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {  // username is a prop here which is passed from EditorPage.js file 
    return (
        <div className="client">
            <Avatar name={username} size={50} round="14px" />
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;
