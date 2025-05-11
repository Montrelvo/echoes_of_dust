// --- Technology Actions ---
function researchBasicTools() {
    const tech = gameState.technology.basicTools;
    if (!tech) { console.error("Basic Tools technology not found in gameState."); return; }
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        gameState.idleProduction.bonusPerWorker += 0.02; // Apply bonus
        console.log(`Researched Basic Tools! Worker bonus increased to ${gameState.idleProduction.bonusPerWorker.toFixed(3)}.`);
        updateDisplay(); // Update UI immediately
    } else {
        if (tech.researched) {
            console.log("Basic Tools already researched.");
        } else {
            console.log(`Cannot research Basic Tools - insufficient RP. Needed: ${tech.cost.researchPoints}, Have: ${gameState.resources.researchPoints}`);
        }
    }
}

// --- New Technology Actions ---
function researchWriting() {
    const tech = gameState.technology.writing;
    if (!tech) { console.error("Writing technology not found in gameState."); return; }
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        // Add any specific bonus for Writing here if needed in the future
        console.log("Researched Writing!");
        updateDisplay();
    } else {
        if (tech.researched) {
            console.log("Writing already researched.");
        } else {
            console.log(`Cannot research Writing - insufficient RP. Needed: ${tech.cost.researchPoints}, Have: ${gameState.resources.researchPoints}`);
        }
    }
}

function researchMapMaking() {
    const tech = gameState.technology.mapMaking;
    if (!tech) { console.error("Map Making technology not found in gameState."); return; }
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        // Add any specific bonus for Map Making here if needed in the future
        console.log("Researched Map Making!");
        updateDisplay();
    } else {
        if (tech.researched) {
            console.log("Map Making already researched.");
        } else {
            console.log(`Cannot research Map Making - insufficient RP. Needed: ${tech.cost.researchPoints}, Have: ${gameState.resources.researchPoints}`);
        }
    }
}

function researchTrade() {
    const tech = gameState.technology.trade;
    if (!tech) { console.error("Trade technology not found in gameState."); return; }
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        // Add any specific bonus for Trade here if needed in the future
        console.log("Researched Trade!");
        updateDisplay();
    } else {
        if (tech.researched) {
            console.log("Trade already researched.");
        } else {
            console.log(`Cannot research Trade - insufficient RP. Needed: ${tech.cost.researchPoints}, Have: ${gameState.resources.researchPoints}`);
        }
    }
}