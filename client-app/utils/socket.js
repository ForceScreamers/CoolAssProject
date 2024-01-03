import { io } from 'socket.io-client';

// TODO: Uninstall and remove networkinfo lib when in production
import { NetworkInfo } from 'react-native-network-info';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';
const PORT = '3000';

// export const socketWithIp = async () => {
//     let ipv4Address = await NetworkInfo.getIPV4Address()
//     socket = io(`http://${ipv4Address}:${PORT}`, {
//         'reconnection': true,
//         'reconnectionDelay': 500,
//         'reconnectionAttempts': 10
//     });
//     return socket;
// }

console.warn("DEBUG: Remember to check IP address!!!!");
export const socket = io(`http://192.168.152.213:${PORT}`, {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
});

