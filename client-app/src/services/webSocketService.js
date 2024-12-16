import WebSocketClient from "@/dal/webSocketClient";


class WebsocketService {
    constructor() {
        this.client = new WebSocketClient("ws://localhost:8000/api/ws");
        headers: { Authorization: `Bearer ${yourToken}` }
    }

    connect (onMessageReceived, onError) {
        this.client.connect(()=>{
            console.log("connect to websocket");
            this.client.subscribe("/admin/active-orders", (message)=> {
                if(message.body){
                    const data = JSON.parse(message.body);
                    onMessageReceived(data);
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