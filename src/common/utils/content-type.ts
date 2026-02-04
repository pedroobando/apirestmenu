export const contentType = (extension: string) => {
  let contentType = 'application/octet-stream';

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      contentType = 'image/jpeg';
      break;
    case 'png':
      contentType = 'image/png';
      break;
    case 'gif':
      contentType = 'image/gif';
      break;
    case 'webp':
      contentType = 'image/webp';
      break;
    case 'mp4':
      contentType = 'video/mp4';
      break;
    case 'svg':
      contentType = 'image/svg+xml';
      break;
  }

  return contentType;
};
