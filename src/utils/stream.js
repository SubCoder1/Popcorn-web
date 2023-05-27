import { Room } from "livekit-client";

const room = new Room();

async function connectWithLivekitRoom(hostUrl, token) {
  await room.connect(hostUrl, token);
  console.log("connected to room", room.name, room.state);
}

async function disconnectFromLivekitRoom() {
  if (room.state() == "connected") {
    await room.disconnect();
  }
}

export default { connectWithLivekitRoom, disconnectFromLivekitRoom };
