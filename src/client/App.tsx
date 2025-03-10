import {useEffect, useState, useRef} from "react";
import styled from "styled-components";

import {Page, Tile, Button, Container, Header, CreateOrJoinRoom} from "./Components";
import {Message, Messages, MESSAGES, Players, Room, Tiles} from "../shared";

const RestartButton = styled(Button)`
    margin-bottom: 100px;
`

function App() {
    const [player, setPlayer] = useState<Players>("X");
    const [currentPlayer, setCurrentPlayer] = useState<Players>("X");
    const [roomId, setRoomId] = useState<string | null>(null);
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [winner, setWinner] = useState<Players | null>(null);
    const [tiles, setTiles] = useState<Tiles>(
        Array.from({length: 9}, (_, id) => ({id, player: "" as Players}))
    );
    const [retryCount, setRetryCount] = useState(0);
    const roomIdRef = useRef(roomId);

    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const {data: wsData} = event;
            const {data, id, message} = JSON.parse(wsData) as Message;
            if ((message === MESSAGES.receive_room_data) && (id === roomIdRef.current)) {
                const roomData = data as Room;
                setTiles(roomData.tiles);
                setCurrentPlayer(roomData.playerTurn);
                setWinner(roomData.winner ?? null);
            }
        };

        const connectWebSocket = () => {
            if (socket) {
                socket.close();
            }

            const ws = new WebSocket(import.meta.env.VITE_WS_SERVER_URL || "ws://localhost:8080");
            setSocket(ws);

            ws.addEventListener("open", () => {
                setRetryCount(0);
                console.log("WebSocket connection established");
            });

            ws.addEventListener("message", messageHandler);

            ws.addEventListener("error", (error) => {
                console.error("WebSocket error:", error);
            });

            ws.addEventListener("close", () => {
                console.log("WebSocket connection closed");
                if (retryCount < 5) {
                    const timeout = Math.pow(2, retryCount) * 1000;
                    setTimeout(() => {
                        setRetryCount(retryCount + 1);
                        connectWebSocket();
                    }, timeout);
                } else {
                    console.error("Max retry attempts reached. Could not reconnect to WebSocket.");
                }
            });
        };

        if (!socket) {
            connectWebSocket();
        }

        return () => {
            if (socket) {
                socket.removeEventListener("message", messageHandler);
                socket.close();
            }
        };
    }, [roomId]);

    const onTileClick = (id: number) => {
        if (winner || tiles[id].player || !socket || !roomId || player !== currentPlayer) return;

        if (socket.readyState === WebSocket.OPEN) {
            const updatedTiles = tiles.map(tile =>
                tile.id === id ? {...tile, player} : tile
            );

            const roomData: Room = {
                playerTurn: player === "X" ? "O" : "X",
                tiles: updatedTiles,
                winner: null
            };

            const message: Message = {
                id: roomId,
                message: MESSAGES.set_room_data as Messages,
                data: roomData
            };

            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open. ReadyState: ", socket.readyState);
        }
    };

    const restart = () => {
        if (!socket) return;

        const message: Message = {
            id: roomId!,
            message: MESSAGES.restart as Messages,
            winner: winner === "X" ? "O" : "X" as Players,
        };

        socket.send(JSON.stringify(message));
    }

    const setId = (roomId: string) => setRoomId(roomId);
    const setClientPlayer = (player: Players) => setPlayer(player);

    const draw = (tiles.length === 9) && tiles.every(tile => tile.player !== "") && !winner

    return (
        <Page>
            {roomId && <Header draw={draw} winner={winner} player={currentPlayer}/>}
            <Container>
                {tiles.map(({player, id}) => (
                    <Tile onClick={() => onTileClick(id)} key={id}>
                        {player}
                    </Tile>
                ))}
            </Container>
            {!roomId &&
                <CreateOrJoinRoom
                    roomId={roomId}
                    socket={socket}
                    setRoomId={setId}
                    setClientPlayer={setClientPlayer}
                />
            }
            {(winner || draw) && (
                <RestartButton initial={{y: 500}} animate={{y: 0}} onClick={restart}>
                    Restart
                </RestartButton>
            )}
        </Page>
    );
}

export default App;