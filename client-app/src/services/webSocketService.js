import WebSocketClient from "@/dal/webSocketClient";
import Cookies from "js-cookie";



class WebsocketService {
    constructor() {
        this.client = new WebSocketClient("http://localhost:8000/ws");
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
            })
        },
        onError
        );
    }

    disconnect(){
        this.client.disconnect();
    }
}

export default new WebsocketService();