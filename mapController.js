// --- Map View Functions ---
function selectMapView(mapType) {
    if (typeof mapType !== 'string') {
        console.error("Invalid mapType provided to selectMapView. Expected a string.");
        return;
    }
    gameState.ui.currentMapView = mapType;
    console.log("Selected map view:", mapType);
    // Future: Call function to render the selected map display
    updateDisplay(); // Re-render to update active button
}