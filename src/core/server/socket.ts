import { io, type Socket } from 'socket.io-client';
import type {
  RecommendationPush,
  EventUpdate,
} from '../../types/hamel';
import type {
  Snapshot,
  AircraftBatch,
  Zone,
  DispatchLive,
} from '../../types/aircraft';

const TOKEN_STORAGE_KEY = 'token';
const LIVE_NAMESPACE = '/live';

export interface ServerToClientEvents {
  'recommendation:new': (recommendation: RecommendationPush) => void;
  'event:update': (event: EventUpdate) => void;
  'snapshot': (snapshot: Snapshot) => void;
  'aircraft:batch': (batch: AircraftBatch) => void;
  'dispatch:update': (dispatch: DispatchLive) => void;
  'zone:add': (zone: Zone) => void;
  'zone:remove': (payload: { zone_id: string }) => void;
}

export interface ClientToServerEvents {
  'alert:ack': (payload: { event_id: string }) => void;
}

export type LiveSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const getSocketBaseUrl = (): string => {
  return import.meta.env.VITE_SOCKET_URL ?? '';
};

export const socket: LiveSocket = io(`${getSocketBaseUrl()}${LIVE_NAMESPACE}`, {
  auth: {
    token: localStorage.getItem(TOKEN_STORAGE_KEY),
  },
  autoConnect: false,
  transports: ['websocket'],
});

export const initializeLiveSocket = (): LiveSocket => {
  socket.auth = {
    token: localStorage.getItem(TOKEN_STORAGE_KEY),
  };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectLiveSocket = (): void => {
  socket.disconnect();
};
