import WebSocketClient from "@/dal/webSocketClient";
import { env } from "process";


class WebSocketService {
    
    constructor() {
        this.client = new WebSocketClient(process.env.NEXT_PUBLIC_API_WS_URL);
    }
    
    connect(type, onMessageReceived, onError) {
        this.client.connect(type, () => {
            console.log("Type received:", type);
            switch(type) {
                case 'kitchen':
                    this.client.subscribe("/kitchen/prepared-orders", this.handleMessage(onMessageReceived));
                    break;
                case 'admin':
                    this.client.subscribe("/admin/active-orders", this.handleMessage(onMessageReceived));
                    break;
                case 'pelayan':
                    this.client.subscribe("/pelayan/ready-orders", this.handleMessage(onMessageReceived));
                    break;
            }
        }, onError);
    }

    handleMessage(callback) {
        return (message) => {
            if(message.body) {
                try {
                    callback(JSON.parse(message.body));
                } catch (error) {
                    console.error("Parse error:", error);
                }
            }
        };
    }

    disconnect() {
        this.client.disconnect();
    }
}

export default new WebSocketService();