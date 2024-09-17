const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUploads, {
            resource_type: 'auto',
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                });
            }
        });
    });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(fileToDelete, {
            resource_type: 'image',
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                });
            }
        });
    });
};

module.exports = {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
};

