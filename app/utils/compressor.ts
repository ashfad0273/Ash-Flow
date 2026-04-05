import imageCompression from 'browser-image-compression';

export async function ashCompressEngine(file: File, format: string, quality: number = 0.9) {
  const options = {
    maxSizeMB: 10, // High limit to avoid forced compression
    useWebWorker: true,
    fileType: `image/${format}` as any,
    initialQuality: quality,
    alwaysKeepResolution: true, // This fixes your resolution issue!
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const newName = file.name.replace(/\.[^/.]+$/, "") + `.${format}`;
    return new File([compressedBlob], newName, { type: `image/${format}` });
  } catch (error) {
    return file;
  }
}