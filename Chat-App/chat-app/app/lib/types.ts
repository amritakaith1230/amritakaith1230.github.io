export interface User {
  id: string;
  username: string;
  joinedAt: Date;
  socketId?: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  timestamp: Date;
  roomId: string;
  formatted?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  users: User[];
  messages: Message[];
  createdAt: Date;
  isPrivate?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface SocketEvents {
  connect: () => void;
  disconnect: () => void;
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  send_message: (data: { roomId: string; content: string }) => void;
  create_room: (data: { name: string; description?: string }) => void;
  get_rooms: () => void;
  room_joined: (data: {
    roomId: string;
    messages: Message[];
    users: User[];
  }) => void;
  new_message: (message: Message) => void;
  user_joined: (data: { user: User; users: User[] }) => void;
  user_left: (data: { userId: string; users: User[] }) => void;
  rooms_list: (rooms: ChatRoom[]) => void;
  error: (error: string) => void;
}
