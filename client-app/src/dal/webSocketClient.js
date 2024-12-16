import { Client} from "@stomp/stompjs"

class WebSocketClient {
    constructor(baseUrl) {
        this.client = new Client({
            brokerURL: baseUrl,
            debug: function (str) {
                console.log(str);
            },
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