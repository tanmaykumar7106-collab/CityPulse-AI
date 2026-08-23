import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "citypulse",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
};

const getImageUrls = async (files = []) => {
    const uploadedImages = await Promise.all(
        files.map(async (file) => {
            const result = await uploadBufferToCloudinary(file.buffer);

            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        })
    );

    return uploadedImages;
};

export default getImageUrls;