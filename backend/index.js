const cloudinary = require('./config/cloudinary');

(async function () {
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            {
                public_id: 'shoes',
            }
        );

        console.log('--- Resultat de l\'upload ---');
        console.log(uploadResult);

        // URL Optimisée
        const optimizeUrl = cloudinary.url('shoes', {
            fetch_format: 'auto',
            quality: 'auto'
        });

        console.log('\n--- URL Optimisée ---');
        console.log(optimizeUrl);

        // URL Recadrée (Square)
        const autoCropUrl = cloudinary.url('shoes', {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });

        console.log('\n--- URL Recadrée (500x500) ---');
        console.log(autoCropUrl);
    } catch (error) {
        console.error('Erreur Cloudinary:', error);
    }
})();
