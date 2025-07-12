export function base64ToFile(base64: string, filename: string): File {
  const [metadata, data] = base64.split(',');
  if (!metadata || !data) {
    throw new Error('Invalid base64 string');
  }
  const mimeMatch = metadata.match(/:(.*?);/);
  const mime = mimeMatch?.[1] || 'application/octet-stream';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], filename, { type: mime });
}
