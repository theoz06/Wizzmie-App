import WebSocketClient from "@/dal/webSocketClient";


class WebsocketService {
    constructor() {
        this.client = new WebSocketClient(NEXT_PUBLIC_API_WS_URL);
    }

    connect (onMessageReceived, onError) {
        this.client.connect(()=>{
            console.log("connect to websocket");
            this.client.subscribe("/admin/active-orders", (message)=> {
                if(message.body){
                    try {
                        const data = JSON.parse(message.body);
                        console.log("Parsed order data:", data);
                        onMessageReceived(data);
                    } catch (error) {
                        console.error("Error parsing message:", error);
                    }
                }
            });

            this.client.subscribe("/pelayan/active-orders", (message) => {
                if (message.body) {
                    try {
                        const data = JSON.parse(message.body);
                        console.log("Parsed order data:", data);
                        onMessageReceived(data);
                    } catch (error) {
                        console.log("Error parsing message:", error);
                    }
                }
            });
        },
        onError
        );
    }

    disconnect(){
        this.client.disconnect();
    }
}

export default new WebsocketService();