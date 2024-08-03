import React from 'react';
import { UPLOAD_IMG_MAX_HEIGHT } from '../../const/SystemAttrConst';

export async function uploadImgUtil(
  e: React.ChangeEvent<HTMLInputElement>,
  setUploadImgFile: React.Dispatch<React.SetStateAction<File | null>>,
  setUploadImgUrl: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> {
  if (!e.target.files) {
    return;
  }
  try {
    const file = e.target.files[0];
    const resizedImage = await resizeImage(
      file,
      UPLOAD_IMG_MAX_HEIGHT,
      UPLOAD_IMG_MAX_HEIGHT,
    );
    const uploadFile = new File([resizedImage], file.name);

    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setImageUrls([...imageUrls, reader.result as string]);
    // };
    // reader.readAsDataURL(file);
    setUploadImgFile(uploadFile);
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
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

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
          resolve(blob);
        } else {
          reject(new Error('Failed to resize image'));
        }
      }, file.type);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
