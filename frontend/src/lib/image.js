import api from "./api";

// Downscale a photo in the browser (max 1600px, JPEG) so uploads are quick on hostel Wi-Fi
const shrink = (file, max = 1600) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file isn't a photo we can read"));
    };
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't process that photo"))), "image/jpeg", 0.85);
    };
    img.src = url;
  });

export const uploadPhoto = async (file, kind = "listing") => {
  const blob = await shrink(file, kind === "avatar" ? 512 : 1600);
  const body = new FormData();
  body.append("image", blob, "photo.jpg");
  const { data } = await api.post(`/uploads?kind=${kind}`, body, { timeout: 60000 });
  return data.image;
};
