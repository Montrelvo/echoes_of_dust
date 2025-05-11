document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const ATLAS_IMAGE_PATH = 'Complete File for All Tiles.png'; // Assumes it's in the same folder as the HTML
    const TILE_WIDTH = 32;
    const TILE_HEIGHT = 32;

    // DOM Elements
    const jsonFileInput = document.getElementById('json-file-input');
    const atlasCanvas = document.getElementById('atlas-canvas');
    const canvasCtx = atlasCanvas.getContext('2d');
    const tileZoomCanvas = document.getElementById('tile-zoom-canvas');
    const tileZoomCtx = tileZoomCanvas.getContext('2d');
    const selectedTileInfoDiv = document.getElementById('selected-tile-info');
    const entryListUl = document.getElementById('entry-list');
    
    const metadataForm = document.getElementById('metadata-form');
    const entryIdInput = document.getElementById('entry-id');
    const entryNameInput = document.getElementById('entry-name');
    const entryTypeSelect = document.getElementById('entry-type');
    const entryXInput = document.getElementById('entry-x');
    const entryYInput = document.getElementById('entry-y');
    const creatureIdGroupDiv = document.getElementById('creature-id-group');
    const entryCreatureIdInput = document.getElementById('entry-creature-id');
    const entryTagsInput = document.getElementById('entry-tags-input');
    const addTagButton = document.getElementById('add-tag-button');
    const tagsContainerDiv = document.getElementById('tags-container');
    const entryNotesTextarea = document.getElementById('entry-notes');
    
    const updateEntryButton = document.getElementById('update-entry-button');
    const exportJsonButton = document.getElementById('export-json-button');

    // State Variables
    let loadedAtlasMetadata = null;
    let atlasImage = new Image();
    let selectedEntryIndex = -1; // Index in loadedAtlasMetadata.definitions
    let currentTags = [];

    // --- Initialization ---
    function init() {
        console.log("Atlas Editor Initializing...");
        atlasImage.onload = () => {
            // Set canvas dimensions to match image if desired, or keep fixed
            // For now, assume canvas size is fixed in HTML, image might be scaled or clipped
            // A better approach might be to set canvas size dynamically:
            // atlasCanvas.width = atlasImage.width;
            // atlasCanvas.height = atlasImage.height;
            console.log("Atlas image loaded:", ATLAS_IMAGE_PATH);
            drawAtlasImage();
            if (loadedAtlasMetadata) { // If JSON was loaded before image
                drawGrid();
                populateEntryList();
            }
        };
        atlasImage.onerror = () => {
            console.error("Error loading atlas image:", ATLAS_IMAGE_PATH);
            selectedTileInfoDiv.textContent = `Error: Could not load atlas image "${ATLAS_IMAGE_PATH}". Make sure it's in the same folder as atlas_editor.html.`;
        };
        atlasImage.src = ATLAS_IMAGE_PATH;

        jsonFileInput.addEventListener('change', handleJsonFileLoad);
        atlasCanvas.addEventListener('click', handleCanvasClick);
        updateEntryButton.addEventListener('click', handleUpdateEntry);
        exportJsonButton.addEventListener('click', handleExportJson);
        addTagButton.addEventListener('click', handleAddTag);
        entryTypeSelect.addEventListener('change', toggleCreatureIdField);
        entryListUl.addEventListener('click', handleEntryListClick);

        // Initial state for creatureId field
        toggleCreatureIdField();
    }

    // --- File Handling ---
    function handleJsonFileLoad(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    loadedAtlasMetadata = JSON.parse(e.target.result);
                    console.log("Atlas metadata loaded:", loadedAtlasMetadata);
                    selectedEntryIndex = -1; // Reset selection
                    clearEditingPanel();
                    selectedTileInfoDiv.textContent = "Metadata loaded. Click a tile on the atlas or an entry in the list.";
                    if (atlasImage.complete && atlasImage.naturalWidth > 0) { // Image already loaded
                        drawAtlasImage(); // Redraw image
                        drawGrid();
                        populateEntryList();
                    } else {
                        // Image might still be loading, it will draw grid when its onload triggers
                        console.log("Metadata loaded, waiting for image to draw grid.");
                    }
                } catch (err) {
                    console.error("Error parsing JSON file:", err);
                    selectedTileInfoDiv.textContent = "Error: Could not parse JSON file. Ensure it's valid.";
                    loadedAtlasMetadata = null;
                }
            };
            reader.readAsText(file);
        }
    }

    // --- Canvas Drawing ---
    function drawAtlasImage() {
        if (!atlasImage.complete || atlasImage.naturalWidth === 0) {
            console.log("Atlas image not ready to draw.");
            return;
        }
        // Scale image to fit canvas while maintaining aspect ratio, or draw at 1:1 if canvas is large enough
        // For simplicity, let's draw it at 1:1 for now, assuming canvas is sized appropriately
        canvasCtx.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height); // Clear canvas
        canvasCtx.drawImage(atlasImage, 0, 0, atlasCanvas.width, atlasCanvas.height); // Or this.width, this.height if canvas matches image
        console.log("Atlas image drawn on canvas.");
    }

    function drawGrid() {
        if (!loadedAtlasMetadata || !atlasImage.complete || atlasImage.naturalWidth === 0) return;
        
        const imgDisplayWidth = atlasCanvas.width; // Use canvas display size
        const imgDisplayHeight = atlasCanvas.height;
        const actualImgWidth = atlasImage.naturalWidth;
        const actualImgHeight = atlasImage.naturalHeight;

        // Calculate scale factor if image is scaled to fit canvas
        const scaleX = imgDisplayWidth / actualImgWidth;
        const scaleY = imgDisplayHeight / actualImgHeight;
        
        // Assuming uniform scaling, pick one (or handle non-uniform if necessary)
        // For this tool, it's best if the canvas is sized to the image or image scaled 1:1
        // For now, let's assume the canvas is displaying the image at a certain scale.
        // The coordinates in metadata are for the *original* image.
        // When drawing the grid, we need to scale the grid lines if the image is scaled on canvas.

        canvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        canvasCtx.lineWidth = 1;

        const numCols = Math.floor(actualImgWidth / TILE_WIDTH);
        const numRows = Math.floor(actualImgHeight / TILE_HEIGHT);

        for (let i = 0; i <= numCols; i++) {
            const x = i * TILE_WIDTH * scaleX;
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, 0);
            canvasCtx.lineTo(x, imgDisplayHeight);
            canvasCtx.stroke();
        }
        for (let i = 0; i <= numRows; i++) {
            const y = i * TILE_HEIGHT * scaleY;
            canvasCtx.beginPath();
            canvasCtx.moveTo(0, y);
            canvasCtx.lineTo(imgDisplayWidth, y);
            canvasCtx.stroke();
        }
        console.log("Grid drawn.");
    }

    function highlightSelectedTile() {
        if (selectedEntryIndex === -1 || !loadedAtlasMetadata) return;
        drawAtlasImage(); // Redraw base image
        drawGrid();       // Redraw grid

        const entry = loadedAtlasMetadata.definitions[selectedEntryIndex];
        if (!entry) return;

        const imgDisplayWidth = atlasCanvas.width;
        const imgDisplayHeight = atlasCanvas.height;
        const actualImgWidth = atlasImage.naturalWidth;
        const actualImgHeight = atlasImage.naturalHeight;
        const scaleX = imgDisplayWidth / actualImgWidth;
        const scaleY = imgDisplayHeight / actualImgHeight;

        canvasCtx.strokeStyle = 'red';
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(
            entry.x * scaleX, 
            entry.y * scaleY, 
            TILE_WIDTH * scaleX, 
            TILE_HEIGHT * scaleY
        );
        console.log("Highlighted tile:", entry.id);
        drawZoomedTile(entry); // Draw the zoomed view
    }

    // --- UI Interaction & Data Handling ---
    function handleCanvasClick(event) {
        if (!loadedAtlasMetadata || !atlasImage.complete || atlasImage.naturalWidth === 0) {
            selectedTileInfoDiv.textContent = "Please load metadata and ensure atlas image is visible.";
            return;
        }

        const rect = atlasCanvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Convert click coordinates to original image coordinates if scaled
        const actualImgWidth = atlasImage.naturalWidth;
        const actualImgHeight = atlasImage.naturalHeight;
        const scaleX = actualImgWidth / atlasCanvas.width;
        const scaleY = actualImgHeight / atlasCanvas.height;
        
        const originalClickX = clickX * scaleX;
        const originalClickY = clickY * scaleY;

        const col = Math.floor(originalClickX / TILE_WIDTH);
        const row = Math.floor(originalClickY / TILE_HEIGHT);

        const clickedEntryIndex = loadedAtlasMetadata.definitions.findIndex(
            def => def.x === col * TILE_WIDTH && def.y === row * TILE_HEIGHT
        );

        if (clickedEntryIndex !== -1) {
            selectEntry(clickedEntryIndex);
        } else {
            selectedTileInfoDiv.textContent = `No defined tile at clicked coordinates (Col: ${col}, Row: ${row}). This shouldn't happen if template was generated correctly.`;
            clearEditingPanel();
        }
    }
    
    function handleEntryListClick(event) {
        if (event.target.tagName === 'LI') {
            const entryIndex = parseInt(event.target.dataset.index, 10);
            if (!isNaN(entryIndex) && entryIndex >= 0 && entryIndex < loadedAtlasMetadata.definitions.length) {
                selectEntry(entryIndex);
            }
        }
    }

    function selectEntry(entryIndex) {
        selectedEntryIndex = entryIndex;
        const entry = loadedAtlasMetadata.definitions[selectedEntryIndex];
        selectedTileInfoDiv.textContent = `Selected: ${entry.id || 'Unnamed'} (X: ${entry.x}, Y: ${entry.y})`;
        populateEditingPanel(entry);
        highlightSelectedTile(); // This will also call drawZoomedTile
        updateEntryListSelection();
    }
    
    function populateEntryList() {
        if (!loadedAtlasMetadata) return;
        entryListUl.innerHTML = ''; // Clear existing
        loadedAtlasMetadata.definitions.forEach((entry, index) => {
            const li = document.createElement('li');
            
            const textSpan = document.createElement('span');
            textSpan.textContent = `${entry.id || `Entry ${index}`} (X:${entry.x}, Y:${entry.y}) - ${entry.type || 'No Type'}`;
            
            const statusSpan = document.createElement('span');
            statusSpan.classList.add('status-indicator');
            if (isEntryCompleted(entry)) {
                statusSpan.classList.add('completed');
                statusSpan.textContent = '✓ Done';
            } else {
                statusSpan.classList.add('incomplete');
                statusSpan.textContent = '✎ Edit';
            }
            
            li.appendChild(textSpan);
            li.appendChild(statusSpan);
            li.dataset.index = index;
            entryListUl.appendChild(li);
        });
        updateEntryListSelection();
    }

    function updateEntryListSelection() {
        const items = entryListUl.getElementsByTagName('li');
        for (let i = 0; i < items.length; i++) {
            if (parseInt(items[i].dataset.index, 10) === selectedEntryIndex) {
                items[i].classList.add('selected');
            } else {
                items[i].classList.remove('selected');
            }
        }
    }

    function populateEditingPanel(entry) {
        if (!entry) {
            clearEditingPanel();
            return;
        }
        entryIdInput.value = entry.id || '';
        entryNameInput.value = entry.name || '';
        entryTypeSelect.value = entry.type || '';
        entryXInput.value = entry.x !== undefined ? entry.x : '';
        entryYInput.value = entry.y !== undefined ? entry.y : '';
        entryCreatureIdInput.value = entry.creatureId || '';
        entryNotesTextarea.value = entry.notes_for_user || '';
        
        currentTags = Array.isArray(entry.tags) ? [...entry.tags] : [];
        renderTags();
        toggleCreatureIdField();
    }

    function clearEditingPanel() {
        metadataForm.reset(); // Resets form fields
        currentTags = [];
        renderTags();
        selectedTileInfoDiv.textContent = "No tile selected or data cleared.";
        toggleCreatureIdField(); // Ensure creatureId field visibility is correct
    }
    
    function toggleCreatureIdField() {
        if (entryTypeSelect.value === 'creatureSprite') {
            creatureIdGroupDiv.style.display = 'block';
        } else {
            creatureIdGroupDiv.style.display = 'none';
        }
    }

    function handleAddTag() {
        const tagValue = entryTagsInput.value.trim();
        if (tagValue && !currentTags.includes(tagValue)) {
            currentTags.push(tagValue);
            renderTags();
        }
        entryTagsInput.value = ''; // Clear input
    }

    function renderTags() {
        tagsContainerDiv.innerHTML = ''; // Clear existing tags
        currentTags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'x';
            removeBtn.onclick = () => {
                currentTags = currentTags.filter(t => t !== tag);
                renderTags();
            };
            tagSpan.appendChild(removeBtn);
            tagsContainerDiv.appendChild(tagSpan);
        });
    }

    function handleUpdateEntry() {
        if (selectedEntryIndex === -1 || !loadedAtlasMetadata) {
            alert("No entry selected to update, or metadata not loaded.");
            return;
        }
        const entry = loadedAtlasMetadata.definitions[selectedEntryIndex];
        if (!entry) {
            alert("Selected entry data is missing.");
            return;
        }

        entry.id = entryIdInput.value.trim();
        entry.name = entryNameInput.value.trim();
        entry.type = entryTypeSelect.value;
        // X and Y are read-only, derived from selection
        entry.creatureId = entryTypeSelect.value === 'creatureSprite' ? entryCreatureIdInput.value.trim() : "";
        entry.tags = [...currentTags]; // Save the current tags
        entry.notes_for_user = entryNotesTextarea.value.trim();

        console.log("Updated entry in memory:", entry);
        alert(`Entry "${entry.id}" updated in memory. Export to save changes to a file.`);
        populateEntryList(); // Refresh list to show updated ID/type
        updateEntryListSelection(); // Re-highlight
    }

    function handleExportJson() {
        if (!loadedAtlasMetadata) {
            alert("No metadata loaded to export.");
            return;
        }
        try {
            // Ensure all definitions have the core properties, even if empty, for consistency
            const cleanedDefinitions = loadedAtlasMetadata.definitions.map(def => ({
                id: def.id || "",
                type: def.type || "",
                x: def.x !== undefined ? def.x : -1,
                y: def.y !== undefined ? def.y : -1,
                name: def.name || "",
                creatureId: def.creatureId || "",
                tags: Array.isArray(def.tags) ? def.tags : [],
                notes_for_user: def.notes_for_user || ""
            }));
            
            const exportData = {
                ...loadedAtlasMetadata, // Spread other top-level properties like atlasImage, tileWidth, tileHeight
                definitions: cleanedDefinitions
            };

            const jsonString = JSON.stringify(exportData, null, 4);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'atlas_metadata.json'; // Suggested filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Exported atlas_metadata.json");
        } catch (err) {
            console.error("Error exporting JSON:", err);
            alert("Error exporting JSON. Check console for details.");
        }
    }

    // --- Helper: Check if entry is considered "completed" ---
    function isEntryCompleted(entry) {
        if (!entry) return false;
        const hasCustomId = entry.id && !entry.id.startsWith('tile_col');
        const hasType = entry.type && entry.type !== 'PLEASE_DEFINE_TYPE';
        const hasName = entry.name && entry.name.trim() !== '';
        // Add more checks if needed, e.g., creatureId if type is creatureSprite
        return hasCustomId && hasType && hasName;
    }

    // --- Helper: Draw Zoomed Tile ---
    function drawZoomedTile(entry) {
        if (!entry || !atlasImage.complete || atlasImage.naturalWidth === 0) {
            tileZoomCtx.clearRect(0, 0, tileZoomCanvas.width, tileZoomCanvas.height);
            tileZoomCtx.fillStyle = '#f0f0f0';
            tileZoomCtx.fillRect(0, 0, tileZoomCanvas.width, tileZoomCanvas.height);
            tileZoomCtx.fillStyle = '#777';
            tileZoomCtx.textAlign = 'center';
            tileZoomCtx.fillText("No tile", tileZoomCanvas.width / 2, tileZoomCanvas.height / 2);
            return;
        }

        tileZoomCtx.imageSmoothingEnabled = false; // For pixel art
        tileZoomCtx.clearRect(0, 0, tileZoomCanvas.width, tileZoomCanvas.height);
        tileZoomCtx.drawImage(
            atlasImage,
            entry.x, // source X from atlas
            entry.y, // source Y from atlas
            TILE_WIDTH,  // source width
            TILE_HEIGHT, // source height
            0, 0,        // destination X, Y on zoom canvas
            tileZoomCanvas.width,  // destination width (scaled)
            tileZoomCanvas.height  // destination height (scaled)
        );
    }

    // --- Start the editor ---
    init();
});