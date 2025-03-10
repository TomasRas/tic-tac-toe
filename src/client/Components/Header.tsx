import {Winner} from "./Components";

type HeaderProps = {
    winner: string | null
    player: string
    draw: boolean
}

const variants = {
    initial: {x: -100, y: -100},
    animate: {x: 1, y: 1}
};

export default function Header({winner, player, draw}: HeaderProps) {

    return <>
        <Winner>
            {!winner && !draw && `Player ${player}'s turn`}
        </Winner>
        {
            winner && <Winner variants={variants} initial="initial" animate="animate">
                Winner is {winner}!
            </Winner>
        }
        <Winner variants={variants} initial="initial" animate="animate">
            {draw && "Draw"}
        </Winner>
    </>
}