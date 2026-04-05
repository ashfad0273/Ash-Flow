import imageCompression from 'browser-image-compression';

type CompressionLevel = 'balanced' | 'aggressive' | 'maximum';

const COMPRESSION_PROFILES: Record<CompressionLevel, object> = {
  balanced: {
    maxSizeMB: 2,
    initialQuality: 0.85,
    maxWidthOrHeight: 4096,
  },
  aggressive: {
    maxSizeMB: 0.8,
    initialQuality: 0.7,
    maxWidthOrHeight: 2560,
  },
  maximum: {
    maxSizeMB: 0.3,
    initialQuality: 0.5,
    maxWidthOrHeight: 1920,
  },
};

export async function ashCompressEngine(
  file: File,
  format: string,
  quality: number = 0.85,
  level: CompressionLevel = 'aggressive'
) {
  // AVIF is not supported by Canvas API — skip it
  if (format === 'avif') {
    console.warn('AVIF encoding not supported in browser, skipping.');
    return file;
  }

  const profile = COMPRESSION_PROFILES[level];

  const options = {
    ...profile,
    useWebWorker: true,
    fileType: `image/${format}` as any,
    initialQuality: quality,
    alwaysKeepResolution: false, // allow downscale for maximum compression
    exifOrientation: 1,          // strip EXIF data — saves extra bytes
  };

  try {
    const compressedBlob = await imageCompression(file, options);

    // Safety check: never return a file LARGER than the original
    if (compressedBlob.size >= file.size) {
      console.warn(`Compressed ${format} is larger than original, returning original.`);
      return file;
    }

    const newName = file.name.replace(/\.[^/.]+$/, '') + `.${format}`;
    return new File([compressedBlob], newName, { type: `image/${format}` });
  } catch (error) {
    console.error('Compression failed:', error);
    return file;
  }
}