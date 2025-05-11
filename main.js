// --- Game Setup ---
function makeInitialChoice(choiceType) {
    if (gameState.flags.initialChoiceMade) return; // Prevent choosing again

    gameState.flags.initialChoiceMade = true;
    // No longer need a single 'type'. Activate the chosen center.

    let infoText = "Initial focus chosen: ";
    switch (choiceType) {
        case 'scavenging':
            gameState.idleProduction.scavenging.level = 1;
            if (scavengingCenterDiv) scavengingCenterDiv.style.display = 'block'; // Ensure it's visible
            infoText += "Scavenging";
            break;
        case 'farming': // Changed from 'labor'
            gameState.idleProduction.farming.level = 1;
            if (farmingCenterDiv) farmingCenterDiv.style.display = 'block'; // Ensure it's visible
            infoText += "Farming";
            break;
        case 'water': // Added water choice
             gameState.idleProduction.water.level = 1;
             if (waterCenterDiv) waterCenterDiv.style.display = 'block'; // Ensure it's visible
             infoText += "Water Collection";
             break;
        case 'research':
            gameState.idleProduction.research.level = 1;
            if (researchCenterDiv) researchCenterDiv.style.display = 'block'; // Show research div
            infoText += "Research";
            break;
        default:
            console.error("Unknown initial choice type:", choiceType);
            // Potentially revert initialChoiceMade flag or handle error
            return;
    }
    // Also ensure the other core centers (Scavenging, Farming, Water) are visible even if not chosen (level 0)
    // This logic might need review if centers are not always present in HTML or if their display is managed differently
    if (scavengingCenterDiv && gameState.idleProduction.scavenging.level === 0) scavengingCenterDiv.style.display = 'block';
    if (farmingCenterDiv && gameState.idleProduction.farming.level === 0) farmingCenterDiv.style.display = 'block';
    if (waterCenterDiv && gameState.idleProduction.water.level === 0) waterCenterDiv.style.display = 'block';
    // Research center remains hidden unless chosen or unlocked later (handled by its own display logic in updateDisplay)


    if (idleSystemInfo) idleSystemInfo.textContent = infoText; // Update initial info message
    if (idleSystemInfo) idleSystemInfo.style.display = 'none'; // Hide the generic info message after choice

    // Hide choice screen, show game container
    if (initialChoiceScreen) initialChoiceScreen.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'grid'; // Use grid as defined in CSS

    // Start the game loop ONLY after choice is made
    if (gameLoopInterval === null) {
         gameLoopInterval = setInterval(gameTick, gameState.settings.gameSpeed);
         console.log("Game loop started after initial choice.");
    }
}


// --- Initialization ---
function init() {
    console.log("Initializing Echoes of Dust - Awaiting initial choice...");
    
    // Ensure critical DOM elements are available before proceeding with logic that uses them
    // This is a basic check; more robust DOM ready solutions exist but might be overkill here.
    if (!initialChoiceScreen || !gameContainer || !buildShelterButton /* add other critical elements if needed */) {
        console.error("Critical DOM elements not found. Initialization aborted. Ensure HTML is correct and script is loaded after DOM.");
        return;
    }

    updateDerivedStats(); // Calculate initial max population
    updateDisplay(); // Initial display update

    // Event listeners for choice buttons
    if (choiceScavengingButton) choiceScavengingButton.addEventListener('click', () => makeInitialChoice('scavenging'));
    if (choiceLaborButton) choiceLaborButton.addEventListener('click', () => makeInitialChoice('farming')); // Corrected from 'labor' to 'farming' to match case
    if (choiceExplorationButton) choiceExplorationButton.addEventListener('click', () => makeInitialChoice('exploration')); // 'exploration' was removed from switch, will log error
    if (choiceResearchButton) choiceResearchButton.addEventListener('click', () => makeInitialChoice('research'));

    // Event listeners for action buttons
    if (buildShelterButton) buildShelterButton.addEventListener('click', buildShelter);
    if (searchSurvivorsButton) searchSurvivorsButton.addEventListener('click', searchForSurvivors);
    
    if (researchBasicToolsButton) researchBasicToolsButton.addEventListener('click', researchBasicTools);
    if (researchWritingButton) researchWritingButton.addEventListener('click', researchWriting);
    if (researchMapMakingButton) researchMapMakingButton.addEventListener('click', researchMapMaking);
    if (researchTradeButton) researchTradeButton.addEventListener('click', researchTrade);

    // Event listeners for map buttons
    if (buttonMapWorld) buttonMapWorld.addEventListener('click', () => selectMapView('world'));
    if (buttonMapSector) buttonMapSector.addEventListener('click', () => selectMapView('sector'));

    // Add event listeners for upgrade buttons
    if (upgradeScavengingButton) upgradeScavengingButton.addEventListener('click', () => upgradeCenter('scavenging'));
    if (upgradeFarmingButton) upgradeFarmingButton.addEventListener('click', () => upgradeCenter('farming'));
    if (upgradeWaterButton) upgradeWaterButton.addEventListener('click', () => upgradeCenter('water'));
    if (upgradeResearchButton) upgradeResearchButton.addEventListener('click', () => upgradeCenter('research'));


    // Initialize starting survivor
    const startingSurvivor = createSurvivor("Leader");
    gameState.population.list.push(startingSurvivor);
    // gameState.population.current is already 1

    console.log("Initialization complete. Ready for player choice.");
}

// Run initialization when the script loads
// It's generally better to run init on DOMContentLoaded or window.onload
// For simplicity here, direct call, assuming script is at end of body.
if (document.readyState === 'loading') {  //DOMContentLoaded alternative
    document.addEventListener('DOMContentLoaded', init);
} else {
    init(); // Or call it directly if already loaded
}