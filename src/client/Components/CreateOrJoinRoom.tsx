import styled from "styled-components"
import {useRef, useState, ChangeEvent} from "react";
import {v1} from "uuid";

import {Button, Input} from "./Components";
import {Players, MESSAGES} from "../../shared";

const Buttons = styled.div`
    margin-bottom: 100px;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 320px;
    justify-content: space-between;
    outline: none;
     * {
         flex-grow: 0;
         width: 155px;
     }
`

type CreateOrJoinRoomProps = {
    roomId: string | null
    socket?: WebSocket | null | undefined
    setRoomId: (roomId: string) => void
    setClientPlayer: (player: Players) => void
}

function CreateOrJoinRoom({roomId, socket, setRoomId, setClientPlayer}: CreateOrJoinRoomProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isJoining, setIsJoining] = useState<boolean>(false)
    const [showNewRoomId, setShowNewRoomId] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>("")

    const enterRoomId = () => {
        setIsJoining(true)
    }

    const createRoom = async () => {
        if (!socket) return
        await navigator.clipboard.writeText(inputValue)
        setRoomId(inputValue)
        socket.send(JSON.stringify({message: MESSAGES.create_room, id: inputValue}))
        setClientPlayer("X")
    }

    const copyNewRoomId = () => {
        const id = v1()
        setInputValue(id)
        setShowNewRoomId(true)
    }

    const joinRoom = () => {
        if (!socket) return
        socket.send(JSON.stringify({message: MESSAGES.get_room_data, id: inputValue}))
        setRoomId(inputValue)
        setClientPlayer("O")
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.currentTarget.value);

    return (
        <>
            {(isJoining || showNewRoomId) &&
                <Input
                    onChange={onChange}
                    readOnly={showNewRoomId}
                    value={inputValue}
                    ref={inputRef}
                    placeholder="Enter room code here"/>}
            <Buttons>
                {!roomId && <>
                    {!isJoining &&
                        <Button onClick={showNewRoomId ? createRoom : copyNewRoomId}>
                            {showNewRoomId ? "Copy and join" : "Create new room"}
                        </Button>}

                    {!showNewRoomId &&
                        <Button onClick={() => isJoining ? joinRoom() : enterRoomId()}>
                            {isJoining ? "Click to join" : "Join room"}
                        </Button>}
                </>
                }
            </Buttons>
        </>
    );
}

export default CreateOrJoinRoom;