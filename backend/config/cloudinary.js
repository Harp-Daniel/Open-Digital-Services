const cloudinary = require('cloudinary').v2;

console.log('--- Cloudinary Configuration Check ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'OK' : 'MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'OK' : 'MISSING');
const secret = process.env.CLOUDINARY_API_SECRET;
console.log('API Secret:', secret ? `OK (Length: ${secret.length})` : 'MISSING');
console.log('---------------------------------------');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
