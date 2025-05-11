// --- Idle Center Upgrade Actions ---
function upgradeCenter(centerKey) {
    const center = gameState.idleProduction[centerKey];
    if (!center || typeof center !== 'object' || !center.hasOwnProperty('level')) {
        console.log(`Invalid or non-upgradable center key: ${centerKey}`);
        return;
    }
    
    if (center.level === 0 && centerKey !== 'research') { // Allow research to be upgraded from level 0 if it was the initial choice or unlocked
        // This logic might need adjustment based on how centers are "activated" vs "upgraded"
        // For now, assuming initial choice sets level to 1, so this mainly prevents upgrading truly inactive centers.
        // If a center can be "discovered" and then upgraded from level 0, this check needs refinement.
        // The original `makeInitialChoice` sets level to 1 for the chosen center.
        // Other centers might be intended to be upgradable from level 0 if they become available through other means.
        // For now, let's assume only centers with level > 0 can be upgraded, unless it's research (which might start at 0 then get chosen).
        // A more robust way would be to have an 'unlocked' or 'active' flag separate from 'level'.
        // The original code had `if (!center || center.level === 0)`
        // Let's stick to that for now to maintain original behavior, but add a log for clarity.
        if (center.level === 0) {
             console.log(`Cannot upgrade inactive center (level 0): ${centerKey}. It might need to be activated first.`);
             // return; // Re-enable this return if level 0 centers (except chosen research) are strictly not upgradable.
        }
    }


    const cost = calculateUpgradeCost(center);
    const resourceNeeded = center.upgradeCostResource;

    if (!resourceNeeded || typeof gameState.resources[resourceNeeded] === 'undefined') {
        console.log(`Upgrade cost resource '${resourceNeeded}' is not defined for center ${centerKey} or in gameState.resources.`);
        return;
    }

    if (gameState.resources[resourceNeeded] >= cost) {
        gameState.resources[resourceNeeded] -= cost;
        center.level++;
        console.log(`Upgraded ${centerKey} to level ${center.level}.`);
        updateDisplay(); // Update UI immediately
    } else {
        console.log(`Not enough ${resourceNeeded} to upgrade ${centerKey}. Needed: ${cost}, Have: ${gameState.resources[resourceNeeded]}`);
    }
}