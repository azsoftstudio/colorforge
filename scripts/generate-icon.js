const fs = require('fs');
const path = require('path');

console.log('Script started.');
const source = path.join(__dirname, '../icon.png');
const dest = path.join(__dirname, '../build/icon.ico');
console.log(`Source: ${source}`);
console.log(`Dest: ${dest}`);

if (!fs.existsSync(source)) {
    console.error('ERROR: Source icon.png not found!');
    process.exit(1);
}
console.log('Source found.');

// Ensure build directory exists
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
    console.log('Creating build directory...');
    fs.mkdirSync(buildDir);
}

try {
    console.log('Requiring png-to-ico...');
    const pngToIco = require('png-to-ico');
    console.log('png-to-ico loaded.');

    console.log('Starting conversion...');
    pngToIco(source)
        .then(buf => {
            console.log('Conversion result obtained (buffer).');
            fs.writeFileSync(dest, buf);
            console.log('Icon generated successfully!');
        })
        .catch(err => {
            console.error('CRITICAL ERROR in pngToIco promise:', err);
            process.exit(1);
        });
} catch (e) {
    console.error('CRITICAL SYNC ERROR:', e);
    process.exit(1);
}
