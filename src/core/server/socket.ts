import { io, type Socket } from 'socket.io-client';
import type {
  RecommendationPush,
} from '../../types/hamel';
import type {
  Snapshot,
  AircraftBatch,
  Zone,
  DispatchLive,
} from '../../types/aircraft';

const AUTH_TOKEN_STORAGE_KEY = 'auth_token';
const LIVE_NAMESPACE = '/live';
const DISCONNECT_DELAY_MS = 250;
let activeSocketConsumers = 0;
let disconnectTimeoutId: number | null = null;

export interface ServerToClientEvents {
  'recommendation:new': (recommendation: RecommendationPush) => void;
  'event:update': (event: unknown) => void;
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
  return import.meta.env.VITE_SOCKET_URL ?? 'https://live-data-1015949672422.europe-west1.run.app';
};

const getAuthToken = (): string | null => {
  const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!storedToken) {
    return null;
  }

  try {
    const parsedToken: unknown = JSON.parse(storedToken);
    return typeof parsedToken === 'string' ? parsedToken : null;
  } catch {
    return storedToken;
  }
};

export const socket: LiveSocket = io(`${getSocketBaseUrl()}${LIVE_NAMESPACE}`, {
  auth: {
    token: getAuthToken(),
  },
  autoConnect: false,
  transports: ['websocket'],
});

export const initializeLiveSocket = (): LiveSocket => {
  activeSocketConsumers += 1;

  if (disconnectTimeoutId !== null) {
    window.clearTimeout(disconnectTimeoutId);
    disconnectTimeoutId = null;
  }

  socket.auth = {
    token: getAuthToken(),
  };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectLiveSocket = (): void => {
  activeSocketConsumers = Math.max(0, activeSocketConsumers - 1);

  if (activeSocketConsumers > 0) {
    return;
  }

  disconnectTimeoutId = window.setTimeout(() => {
    if (activeSocketConsumers === 0) {
      socket.disconnect();
    }

    disconnectTimeoutId = null;
  }, DISCONNECT_DELAY_MS);
};
