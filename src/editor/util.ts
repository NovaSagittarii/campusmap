/**
 * This is used convert a file (Blob) from event.target.files into
 * a base64 data-url which can then be used to import into PIXI.
 *
 * https://stackoverflow.com/a/18650249
 */
export function blobToBase64(blob: Blob) {
  return new Promise<string | ArrayBuffer | null>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
