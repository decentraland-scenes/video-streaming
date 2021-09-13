export const DefaultVideoEvent: IEvents["videoEvent"] = {
  videoClipId: "",
  componentId: "",
  currentOffset: -1,
  totalVideoLength: -1,
  videoStatus: VideoStatus.NONE,
};

export class VideoSystem implements ISystem {
  videoTexture: VideoTexture;
  elapsedTime: number;
  lastVideoEventTick: number;
  lastVideoEventData: IEvents["videoEvent"] = DefaultVideoEvent;
  estimatedOffset: number;

  constructor(_videoTexture: VideoTexture) {
    this.videoTexture = _videoTexture;
    this.elapsedTime = 0;
    this.lastVideoEventTick = 0;
    this.estimatedOffset = -1;

    onVideoEvent.add((data) => {
      if (data.videoClipId == this.videoTexture.videoClipId) {
        this.updateEvent(data);
      }
    });
  }

  update(dt: number) {
    this.elapsedTime += dt;
    if (this.lastVideoEventData.videoStatus === VideoStatus.PLAYING) {
      this.estimatedOffset += dt;
      this.onOffsetUpdate(this.estimatedOffset);
      // log('Playing video - currentOffset: ', this.offsetPosition)
    }
  }

  /**
   * Triggered when renderer send an event with status different that previous
   * @param oldStatus 
   * @param newStatus 
   */
  protected onChangeStatus(oldStatus: VideoStatus, newStatus: VideoStatus) {}

  /**
   *  Triggered every frame while the video is playing
   * @param estimatedOffset offset position in seconds. Can be -1 (invalid offset)
   */
  protected onOffsetUpdate(estimatedOffset: Number) {}

  private updateEvent(event: IEvents["videoEvent"]) {
    // log('VideoEvent in VideoSystem:', event)
    if (this.lastVideoEventTick != 0.0) {
      if (
        this.lastVideoEventData.videoStatus === undefined ||
        this.lastVideoEventData.videoStatus !== event.videoStatus
      ) {
        if (event.videoStatus === VideoStatus.PLAYING) {
          this.estimatedOffset = event.currentOffset;
        }

        this.onChangeStatus(
          this.lastVideoEventData.videoStatus || VideoStatus.NONE,
          event.videoStatus as VideoStatus
        );
      }
    }

    this.lastVideoEventData = event;
    this.lastVideoEventTick = this.elapsedTime;
  }
}
