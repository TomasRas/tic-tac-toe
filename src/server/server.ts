import {WebSocketServer, WebSocket} from 'ws';
import {Message, MESSAGES, Players, Rooms} from "../shared";
import {checkWinner, RoomBoard} from "./common";

const wss = new WebSocketServer({port: 8080});

const rooms: Rooms = {}
const roomClients: Record<string, Set<WebSocket>> = {};

wss.on('connection', function connection(socket: WebSocket) {
    socket.on('error', console.error);

    socket.on('message', function message(wsMsg: string) {
        const {data, message, id, winner} = JSON.parse(wsMsg) as Message

        if (MESSAGES.create_room === message) {
            rooms[id] = new RoomBoard(id);
            roomClients[id] = new Set();
            roomClients[id].add(socket);
        }

        if (MESSAGES.set_room_data === message) {
            if (!data) return
            rooms[id] = {
                ...rooms[id],
                ...data,
                tiles: data.tiles,
                winner: checkWinner(data.tiles),
                playerTurn: data.playerTurn
            };
            broadcastRoomData(id);
        }

        if (MESSAGES.get_room_data === message) {
            roomClients[id]?.add(socket);
            socket.send(JSON.stringify({message: MESSAGES.receive_room_data, id, data: rooms[id]}));
        }

        if (MESSAGES.restart === message) {
            const room = new RoomBoard(id)
            rooms[id] = {
                ...room,
                playerTurn: winner as unknown as Players
            };
            broadcastRoomData(id);
        }
    });

    socket.send(JSON.stringify({message: 'ws connected'}));

    function broadcastRoomData(roomId: string) {
        const roomData = rooms[roomId];
        roomClients[roomId]?.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({message: MESSAGES.receive_room_data, id: roomId, data: roomData}));
            }
        });
    }
});