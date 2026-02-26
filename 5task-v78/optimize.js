import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

const assetsDir = path.resolve('assets');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

async function optimize() {
    for (const file of files) {
        if (file === '5task-logo-192x192.png' || file === '5task-logo.png') {
            continue;
        }
        const filePath = path.join(assetsDir, file);
        const tempPath = path.join(assetsDir, 'temp-' + file);

        // Resize down to 512x512 max and optimize compression
        await sharp(filePath)
            .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
            .png({ quality: 80, compressionLevel: 9, adaptiveFiltering: true })
            .toFile(tempPath);

        fs.renameSync(tempPath, filePath);
        console.log(`Optimized ${file}`);
    }
}

optimize().catch(console.error);
