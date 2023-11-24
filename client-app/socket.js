import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';


console.warn("DEBUG: USING PC LOCAL IP");
export const socket = io('http://192.168.14.187:3000', {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
});