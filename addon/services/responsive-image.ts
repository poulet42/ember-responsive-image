import Service from '@ember/service';
import { assert } from '@ember/debug';

const screenWidth = typeof screen !== 'undefined' ? screen.width : 320;

const extentionTypeMapping = new Map<string, ImageType>([['jpg', 'jpeg']]);

export type ImageType = 'png' | 'jpeg' | 'webp' | 'avif';

export interface LqipBase {
  type: string;
}

export interface LqipInline extends LqipBase {
  type: 'inline';
  image: string;
  width: number;
  height: number;
}

export interface LqipColor extends LqipBase {
  type: 'color';
  color: string;
}

export interface ImageMeta {
  image: string;
  width: number;
  height: number;
  type: ImageType;
}

export interface Meta {
  images: ImageMeta[];
  lqip?: LqipInline | LqipColor;
}

/**
 * Service class to provides images generated by the responsive images package
 */
export default class ResponsiveImageService extends Service {
  /**
   * the screen's width
   * This is the base value to calculate the image size.
   * That means the {{#crossLink "Services/ResponsiveImage:getImageBySize"}}getImageBySize{{/crossLink}} will return
   * an image that's close to `screenWidth *  window.devicePixelRatio * size / 100`
   */
  screenWidth = screenWidth;

  /**
   * the physical width
   */
  physicalWidth = this.screenWidth * ((window && window.devicePixelRatio) || 1);

  /**
   * return the images with the different widths
   */
  getImages(imageName: string, type?: ImageType): ImageMeta[] {
    let images = this.getMeta(imageName).images;
    if (type) {
      images = images.filter((image) => image.type === type);
    }

    return images;
  }

  getMeta(imageName: string): Meta {
    assert(
      `There is no data for image ${imageName}: ${this.meta}`,
      Object.prototype.hasOwnProperty.call(this.meta, imageName)
    );

    return this.meta[imageName];
  }

  private getType(imageName: string): ImageType {
    const extension = imageName.split('.').pop();
    assert(`No extension found for ${imageName}`, extension);
    return extentionTypeMapping.get(extension) ?? (extension as ImageType);
  }

  getAvailableTypes(imageName: string): ImageType[] {
    return (
      this.getImages(imageName)
        .map((image) => image.type)
        // unique
        .filter((value, index, self) => self.indexOf(value) === index)
    );
  }

  /**
   * returns the image data which fits for given size (in vw)
   */
  getImageMetaBySize(
    imageName: string,
    size?: number,
    type: ImageType = this.getType(imageName)
  ): ImageMeta | undefined {
    const width = this.getDestinationWidthBySize(size ?? 0);
    return this.getImageMetaByWidth(imageName, width, type);
  }

  /**
   * returns the image data which fits for given width (in px)
   */
  getImageMetaByWidth(
    imageName: string,
    width: number,
    type: ImageType = this.getType(imageName)
  ): ImageMeta | undefined {
    return this.getImages(imageName)
      .filter((img) => img.type === type)
      .reduce((prevValue: ImageMeta | undefined, imageMeta: ImageMeta) => {
        if (prevValue === undefined) {
          return imageMeta;
        }

        if (imageMeta.width >= width && prevValue.width >= width) {
          return imageMeta.width >= prevValue.width ? prevValue : imageMeta;
        } else {
          return imageMeta.width >= prevValue.width ? imageMeta : prevValue;
        }
      }, undefined);
  }

  getAspectRatio(imageName: string): number | undefined {
    const meta = this.getImages(imageName)[0];

    return meta ? meta.width / meta.height : undefined;
  }

  private getDestinationWidthBySize(size: number): number {
    const physicalWidth = this.physicalWidth;
    const factor = (size || 100) / 100;

    return physicalWidth * factor;
  }

  private _meta?: Record<string, Meta>;

  /**
   * the meta values from build time
   */
  get meta(): Record<string, Meta> {
    if (this._meta) {
      return this._meta;
    }
    const script = document.getElementById('ember_responsive_image_meta');
    assert(
      'No script tag found containing meta data for ember-responsive-image',
      script?.textContent
    );
    const meta = JSON.parse(script.textContent);
    // eslint-disable-next-line ember/no-side-effects
    this._meta = meta;
    return meta;
  }
  set meta(meta: Record<string, Meta>) {
    this._meta = meta;
  }
}
