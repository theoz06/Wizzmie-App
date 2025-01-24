import { Client} from "@stomp/stompjs"
import SockJS from "sockjs-client";

class WebSocketClient {
    constructor(baseUrl) {
        const socket = new SockJS(baseUrl);
        this.client = new Client({
           webSocketFactory: ()=> socket,
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 100,
            heartbeatIncoming: 2000,
            heartbeatOutgoing: 2000
        });
    }

    connect(type, onConnect, onError) {
        this.client.onConnect = () => {
            console.log(`${type} WebSocket connected`);
            if(onConnect) onConnect();
        };
        this.client.onStompError = (frame) => {
            console.error(`${type} WebSocket Error:`, frame.headers["message"]);
            if (onError) onError(frame);
        }
        this.client.activate();
    }

    disconnect() {
        this.client.deactivate();
    }

    subscribe(destination, callback) {
        this.client.subscribe(destination, callback);
    }
}

export default WebSocketClient;