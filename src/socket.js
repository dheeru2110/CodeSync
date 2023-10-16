import { io } from 'socket.io-client';  // import io from socket.io-client module  
// io is a function which returns a socket object 
// socket object is used to join a room, leave a room, emit an event, listen to an event, etc.

export const initSocket = async () => {  // initSocket is a function which returns a socket object 
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL, options); // io function takes two parameters, first is the url of the server and second is the options object 
}; 
