// Turns an uploaded image file into a compressed data URL that can be kept in localStorage
// (there is no backend to host the files). Large photos are scaled down so a few listings
// don't exhaust the ~5 MB localStorage quota; at card/detail size they look the same.
const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.8;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read the image file."));
    image.src = src;
  });
}

export async function fileToDataUrl(file: File): Promise<string> {
  const original = await readAsDataUrl(file);

  try {
    const image = await loadImage(original);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return original;

    // JPEG has no transparency, so paint white first instead of letting PNG transparency go black.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } catch {
    return original;
  }
}
