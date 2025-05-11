const fs = require('fs');
const PNG = require('pngjs').PNG;
const path = require('path');

// Configuration
const atlasImageFileName = 'Complete File for All Tiles.png';
const atlasImagePath = path.join(__dirname, atlasImageFileName); // Assumes image is in the same directory as the script
const outputTemplatePath = path.join(__dirname, 'atlas_metadata_template.json');
const tileWidth = 32;
const tileHeight = 32;

console.log(`Attempting to read atlas image from: ${atlasImagePath}`);

fs.createReadStream(atlasImagePath)
    .on('error', (err) => {
        console.error(`Error reading atlas image file: ${atlasImageFileName}`, err);
        console.error(`Please ensure the file "${atlasImageFileName}" exists at: ${atlasImagePath}`);
        console.error("Also, ensure you have run 'npm install pngjs' in your project directory.");
    })
    .pipe(new PNG())
    .on('parsed', function() {
        console.log(`Successfully parsed atlas image: ${atlasImageFileName}`);
        console.log(`Image Dimensions: ${this.width}x${this.height}`);

        if (this.width % tileWidth !== 0 || this.height % tileHeight !== 0) {
            console.warn(`Warning: Image dimensions (${this.width}x${this.height}) are not perfectly divisible by tile dimensions (${tileWidth}x${tileHeight}). Some tiles at the edges might be partial.`);
        }

        const cols = Math.floor(this.width / tileWidth);
        const rows = Math.floor(this.height / tileHeight);

        console.log(`Calculated grid: ${cols} columns x ${rows} rows of ${tileWidth}x${tileHeight}px tiles.`);

        const atlasMetadata = {
            atlasImage: atlasImageFileName,
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            definitions: []
        };

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const pixelX = c * tileWidth;
                const pixelY = r * tileHeight;

                atlasMetadata.definitions.push({
                    id: `tile_col${c}_row${r}`, // Default ID, e.g., tile_col0_row0
                    type: "PLEASE_DEFINE_TYPE", // User should change this to: mapTile, creatureSprite, itemSprite, etc.
                    x: pixelX,
                    y: pixelY,
                    creatureId: "", // Placeholder: relevant if type is creatureSprite
                    tags: [],       // Placeholder: relevant for mapTile properties like 'passable', 'terrain_type'
                    name: "",       // Placeholder: user-friendly name for the tile/sprite
                    notes_for_user: "Define id, type, name, and other relevant properties (e.g., creatureId, tags)."
                });
            }
        }

        try {
            fs.writeFileSync(outputTemplatePath, JSON.stringify(atlasMetadata, null, 4));
            console.log(`Successfully wrote atlas metadata template to: ${outputTemplatePath}`);
            console.log(`Found ${atlasMetadata.definitions.length} tile entries.`);
            console.log("Next step: Manually edit this template file to define each tile's 'id', 'type', 'name', 'creatureId' (if applicable), and 'tags' (if applicable).");
        } catch (writeErr) {
            console.error(`Error writing template file to: ${outputTemplatePath}`, writeErr);
        }
    })
    .on('error', (err) => { // Catch errors during parsing itself
        console.error('Error parsing PNG:', err);
    });