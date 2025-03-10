import styled from "styled-components"
import {motion} from "framer-motion"

export const Page = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #FAFAFA; 
    position: relative;
    overflow: hidden;
`

export const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 500px;
    margin: auto;
    aspect-ratio: 1;
    background: #FFFFFF;
    padding: 0 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    border-radius: 8px; 
`;

export const Tile = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    cursor: pointer;
    aspect-ratio: 1;
    color: #212121; 
    background: #E0E0E0; 
    border: 1px solid #BDBDBD; 
    border-radius: 4px; 
    
      &:hover {
        background: #BDBDBD; 
    }
`;

export const Button = styled(motion.button)`
    background: #6200EA;
    height: 50px;
    width: 180px;
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background: #3700B3;
    }

    @media (max-width: 600px) {
        width: 90%;
        font-size: 16px;
    }

    @media (max-width: 400px) {
        width: 50%;
        font-size: 14px;
    }
`;

export const Winner = styled(motion.h1)`
    color: #212121;
    margin: 30px 0 0;
`

export const Input = styled.input`
    width: 100%;
    max-width: 300px;
    height: 50px;
    border: 1px solid #BDBDBD;
    background: #FFFFFF;
    color: #212121;
    top: 50px;
    position: absolute;
    font-size: 16px;
    padding: 0 10px;
    text-align: center;
    border-radius: 10px;
    
      &:focus {
        border: 1px solid #6200EA; 
    }
`;