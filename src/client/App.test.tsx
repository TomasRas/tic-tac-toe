import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';
import { server } from '../mocks/server';

class WebSocketMock {
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  send = vi.fn();
  close = vi.fn();
  readyState = WebSocket.OPEN;
}

const mockWebSocket = vi.fn(() => new WebSocketMock());

beforeAll(() => {
  server.listen();
  vi.stubGlobal('WebSocket', mockWebSocket);
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('renders CreateOrJoinRoom component when roomId is null', () => {
    render(<App />);
    expect(screen.getByText(/create new room/i)).toBeInTheDocument();
    expect(screen.getByText(/join room/i)).toBeInTheDocument();
  });

  it('renders Header and Container when room is joined', () => {
    render(<App />);
    const ws = new WebSocketMock();
    mockWebSocket.mockImplementation(() => ws);

    // Click Join Room
    fireEvent.click(screen.getByText(/join room/i));

    // Fill in room ID
    const input = screen.getByPlaceholderText(/enter room code here/i);
    fireEvent.change(input, { target: { value: 'test-room' } });

    // Submit form
    fireEvent.click(screen.getByText(/click to join/i));

    // Simulate WebSocket message
    const messageHandler = ws.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )?.[1];

    if (messageHandler) {
      messageHandler(new MessageEvent('message', {
        data: JSON.stringify({
          data: {
            playerTurn: 'X',
            tiles: Array.from({length: 9}, (_, id) => ({id, player: ''})),
            winner: null
          },
          id: 'test-room',
          message: 'RECEIVE_ROOM_DATA'
        })
      }));
    }

    expect(screen.getByText(/current player/i)).toBeInTheDocument();
  });

  it('handles game restart', () => {
    render(<App />);
    const ws = new WebSocketMock();
    mockWebSocket.mockImplementation(() => ws);

    // Click Join Room
    fireEvent.click(screen.getByText(/join room/i));

    // Fill in room ID
    const input = screen.getByPlaceholderText(/enter room code here/i);
    fireEvent.change(input, { target: { value: 'test-room' } });

    // Submit form
    fireEvent.click(screen.getByText(/click to join/i));

    const messageHandler = ws.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )?.[1];

    if (messageHandler) {
      messageHandler(new MessageEvent('message', {
        data: JSON.stringify({
          data: {
            playerTurn: 'X',
            tiles: Array.from({length: 9}, (_, id) => ({id, player: 'X'})),
            winner: 'X'
          },
          id: 'test-room',
          message: 'RECEIVE_ROOM_DATA'
        })
      }));
    }

    const restartButton = screen.getByText(/Restart/i);
    fireEvent.click(restartButton);

    expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('RESTART'));
  });

  it('handles WebSocket connection', () => {
    render(<App />);
    expect(mockWebSocket).toHaveBeenCalledWith('ws://localhost:8080');
  });
});