import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

const cloudinaryUpload = multer({ storage: cloudinaryStorage });

const uploadSingle = upload.single("image");
const uploadFile = upload.single("file");

const uploadMultipleImage = upload.fields([{ name: "images", maxCount: 15 }]);

const updateProfile = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<{ Location: string; public_id: string }> => {
  if (!file) {
    throw new Error("File is required for uploading.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          Location: result?.secure_url || "",
          public_id: result?.public_id || "",
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const fileUploader = {
  upload,
  uploadSingle,
  uploadMultipleImage,
  updateProfile,
  uploadFile,
  cloudinaryUpload,
  uploadToCloudinary,
};
