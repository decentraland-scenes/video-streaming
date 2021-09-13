import { VideoSystem } from "./ecs/VideoSystem";

export class CustomVideoSystem extends VideoSystem {
  constructor(_videoTexture: VideoTexture) {
    super(_videoTexture);
  }

  onChangeStatus(oldStatus: VideoStatus, newStatus: VideoStatus) {
    if (newStatus == VideoStatus.PLAYING) {
      log(
        `VideoTexture ${this.videoTexture.videoClipId} is now playing! Offset ${this.estimatedOffset}`
      );
    } else {
      log(
        `VideoTexture ${this.videoTexture.videoClipId} changed status to '${newStatus}'`
      );
    }
  }

  onOffsetUpdate(estimatedOffset: Number) {}
}
