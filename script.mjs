var socket = io();
import {dom} from '../libs/concise.mjs';
dom.idGet('kill').addEventListener('click', () => socket.emit('kill'));
