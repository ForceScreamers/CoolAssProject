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
export const socket = io(`http://192.168.40.213:${PORT}`, {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
});


// ? Check if works
// window.RTCPeerConnection = window.RTCPeerConnection ||
//     window.mozRTCPeerConnection ||
//     window.webkitRTCPeerConnection;

// function getMyIP(cb) {
//     // Calls the cb function with the local host IP address found
//     // using RTC functions. We cannot just return the IP address
//     // because the RTC functions are asynchronous.

//     var pc = new RTCPeerConnection({ iceServers: [] }),
//         noop = () => { };

//     pc.onicecandidate = ice =>
//         cb = cb((ice = ice && ice.candidate && ice.candidate.candidate)
//             ? ice.match(/(\d{1,3}(\.\d{1,3}){3}|[a-f\d]{1,4}(:[a-f\d]{1,4}){7})/)[1]
//             : 'unavailable') || noop;
//     pc.createDataChannel("");
//     pc.createOffer(pc.setLocalDescription.bind(pc), noop);
// };

// getMyIP(addr => { document.querySelector('.ipAdd').innerHTML += addr; });