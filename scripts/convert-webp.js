const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const imagesDir = 'assets/images';

// Find all PNG and JPG images
glob(`${imagesDir}/**/*.{png,jpg,jpeg}`, (err, files) => {
    if (err) {
        console.error('Error finding files:', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file);
        const output = file.replace(ext, '.webp');

        if (fs.existsSync(output)) {
            console.log(`Skipping ${file} - WebP already exists`);
            return;
        }

        console.log(`Converting ${file} to ${output}...`);

        sharp(file)
            .webp({ quality: 80 })
            .toFile(output)
            .then(() => console.log(`Converted: ${output}`))
            .catch(err => console.error(`Error converting ${file}:`, err));
    });
});
