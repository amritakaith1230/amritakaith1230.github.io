import { io, type Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(username: string): Socket {
    if (!this.socket || this.socket.disconnected) {
      const serverUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_SOCKET_URL || ""
          : "http://localhost:3001";

      this.socket = io(serverUrl, {
        auth: { username },
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      });

      this.socket.on("connect", () => {
        console.log("Connected to server:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from server:", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });
    }

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default SocketManager;
