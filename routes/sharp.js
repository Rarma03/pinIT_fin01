const sharp = require('sharp');

async function processImage(inputPath, outputPath) {
    try {
        // Process the image
        await sharp(inputPath)
            .resize(320, 240)
            .toFile(outputPath);
        console.log('Image processed successfully.');
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Error processing image.');
    }
}

module.exports = processImage;
