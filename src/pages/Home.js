import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid'; 
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => { 
        e.preventDefault();  // e.preventDefault() prevents the default action of an element from happening.
        const id = uuidV4(); // uuidV4() is used to generate a random id.
        setRoomId(id);
        toast.success('Created a new room'); // toast is a notification
    };

    const joinRoom = () => {   
        if (!roomId || !username) {  // if roomId or username is not present then it will show error
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect   if both roomId and username is present then it will redirect to editor page
        navigate(`/editor/${roomId}`, {  
            state: {
                username,  
            },
        });
    };

    const handleInputEnter = (e) => {   // if user press enter key then it will call joinRoom function
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
  return (
    <div className="homePageWrapper">
    <div className="formWrapper">
        <img
            className="homePageLogo"
            src="/code-sync.png"
            alt="code-sync-logo"
        />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
            <input
                type="text"
                className="inputBox"
                placeholder="ROOM ID"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}
            />
            <input
                type="text"
                className="inputBox"
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyUp={handleInputEnter}
            />
            <button className="btn joinBtn" onClick={joinRoom}> 
                Join
            </button>
            <span className="createInfo"> 
                If you don't have an invite then create &nbsp;
                <a
                    onClick={createNewRoom} // listen for click event
                    href=""
                    className="createNewBtn"
                >
                    new room 
                </a>
            </span>
        </div>
    </div>
    <footer>
        <h4>
            Built with 💛&nbsp; by &nbsp;
            <a href="https://github.com/dheeru2110">Dheeraj</a>
        </h4>
    </footer>
</div>
  )
}

export default Home
