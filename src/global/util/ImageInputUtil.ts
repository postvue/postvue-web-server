import React from 'react';
import { UPLOAD_IMG_MAX_HEIGHT } from '../../const/SystemAttrConst';

export async function uploadImgUtil(
  imgFile: File,
  setUploadImgFile: React.Dispatch<React.SetStateAction<Blob | null>>,
  setUploadImgUrl: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> {
  try {
    const resizedImage = await resizeImage(
      imgFile,
      UPLOAD_IMG_MAX_HEIGHT,
      UPLOAD_IMG_MAX_HEIGHT,
    );

    const uploadFile = new File([resizedImage], imgFile.name);

    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setImageUrls([...imageUrls, reader.result as string]);
    // };
    // reader.readAsDataURL(file);
    setUploadImgFile(resizedImage);
    setUploadImgUrl(URL.createObjectURL(uploadFile));
  } catch (error) {
    /* empty */
  }
}

export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // 원본이 maxWidth, maxHeight보다 작으면 그대로 반환
      if (width <= maxWidth && height <= maxHeight) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        } else {
          reject(new Error('Failed to resize image'));
        }
      }, file.type);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

export interface PixelCropType {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: PixelCropType,
): Promise<Blob | null> => {
  return new Promise<Blob | null>((resolve, reject) => {
    createImage(imageSrc)
      .then((image) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
        );

        // Blob으로 이미지를 가져옴
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas is empty'));
          }
        }, 'image/jpeg');
      })
      .catch((error) => {
        reject(error);
      });
  });
};
