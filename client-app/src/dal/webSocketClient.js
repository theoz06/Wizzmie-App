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
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });
    }

    connect(onConnect, onError) {
        this.client.onConnect = onConnect;
        this.client.onStompError = (frame) => {
            console.log("Websocket Error : " + frame.headers["message"]);
            if (onError) {
                onError(frame);
            }
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