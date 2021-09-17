import { MAX_IMAGES_CNT } from "../components/constants";
import { ImgBlobs, ImgBlobStatus } from "../types";

function generateImageUrl(idx: number) {
  return `${IMAGE_URL}${idx}`;
}

const IMAGE_URL = `https://picsum.photos/1400/700?grayscale&random=`;
const allImageUrls = Array(MAX_IMAGES_CNT)
  .fill("")
  .map((_, idx) => generateImageUrl(idx));

class ImageStorage {
  private imageBlobUrls: ImgBlobs = {};

  private async _loadImage(url: string, cb?: (res: ImgBlobStatus) => void) {
    this.imageBlobUrls[url] = { loading: true, error: false, url: "" };
    try {
      const response = await fetch(url);
      const blobUrl = URL.createObjectURL(await response.blob());
      const blobStatus: ImgBlobStatus = {
        url: blobUrl,
        loading: false,
        error: false,
      };
      this.imageBlobUrls[url] = blobStatus;
      cb?.(blobStatus);
    } catch (err) {
      const blobStatus: ImgBlobStatus = {
        url: "",
        loading: false,
        error: true,
      };
      this.imageBlobUrls[url] = blobStatus;
      cb?.(blobStatus);
    }
  }

  private async _loadImages(
    urls: string[],
    cb?: (status: ImgBlobStatus, ind: number) => void
  ) {
    return await Promise.allSettled(
      urls.map((url, ind) =>
        this._loadImage(url, cb ? (status) => cb(status, ind) : undefined)
      )
    );
  }

  private _findNotLoadedUrls(urls: string[]): string[] {
    const { imageBlobUrls } = this;
    return urls.filter(
      (url) => !imageBlobUrls[url] || imageBlobUrls[url].error
    );
  }

  async loadImagesByIndex(
    startIndex: number,
    step: number,
    count: number,
    cb?: (status: ImgBlobStatus, idx: number) => void
  ) {
    return await this._loadImages(
      this._findNotLoadedUrls(
        Array(count)
          .fill("")
          .map((_, ind) => allImageUrls[startIndex + ind * step])
      ),
      cb ? (status, idx) => cb(status, startIndex + idx * step) : undefined
    );
  }

  getImageAtIndex(index: number): ImgBlobStatus | null {
    const imageUrl = allImageUrls[index];
    return (imageUrl && this.imageBlobUrls[imageUrl]) || null;
  }

  imageNeedsLoading(startIndex: number) {
    if (startIndex >= allImageUrls.length) return false;
    const imageStatus = this.getImageAtIndex(startIndex);
    return (
      !imageStatus ||
      (!imageStatus.url && !imageStatus.loading && !imageStatus.error)
    );
  }
}

export default new ImageStorage();
