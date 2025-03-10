export const MESSAGES = {
    create_room: "create_room",
    set_room_data: "set_room_data",
    get_room_data: "get_room_data",
    receive_room_data: "receive_room_data",
    restart: "restart"
}

export type Players = "X" | "O" | ""

export type Tile = { id: number, player: Players }

export type Tiles = Tile[]

export type Room = {
    winner?: Players | null
    tiles: Tiles
    playerTurn: Players
}

export type Rooms = Record<string, Room>

export type Messages = keyof typeof MESSAGES

export type Message = {
    message: Messages
    data?: Room
    id: string
    winner?: Players
}