import {io} from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

// create a single instance of the socket
const socket = io(SOCKET_URL, { autoConnect: false });

export const connectSocket = () => {
    if (!socket.connected){
        socket.connect();
        console.log("Socket connected");
    }
};

export default socket;

