import axios from "axios";

export default async function UploadFile(image) {
  if (!image) {
    console.error("No image provided");
    return "";
  }

  const CLOUD_NAME = "dexlsqpbv"; // Ensure this is correctly set
  const UPLOAD_PRESET = "eventapp"; // Ensure this preset exists in Cloudinary

  const form = new FormData();
  form.append("file", image);
  form.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?upload_preset=${UPLOAD_PRESET}`,
      form
    );

    console.log("Uploaded Image URL:", response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
    return "";
  }
}
