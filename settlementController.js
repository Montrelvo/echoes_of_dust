// --- Building Actions ---
function buildShelter() {
    const cost = BUILDING_COSTS.shelter;
    if (gameState.resources.scrap >= cost.scrap) {
        gameState.resources.scrap -= cost.scrap;
        gameState.buildings.shelters++;
        console.log("Built Shelter. Total:", gameState.buildings.shelters);
        updateDerivedStats(); // Recalculate max population
        updateDisplay(); // Update display immediately after building
    } else {
        console.log("Not enough scrap to build shelter.");
        // Optionally provide user feedback (e.g., flash button red)
    }
}

// --- Survivor Actions ---
let nextSurvivorId = 1; // Simple ID counter

function createSurvivor(name) {
    return {
        id: nextSurvivorId++,
        name: name,
        assignedCenter: null // e.g., 'scavenging', 'farming', 'water', 'research', or null if idle
    };
}

function searchForSurvivors() {
    if (gameState.population.current < gameState.population.max) {
        // Simple random name generation for now
        const names = ["Alex", "Sam", "Morgan", "Chris", "Jordan", "Taylor", "Riley"];
        const newName = names[Math.floor(Math.random() * names.length)] + " #" + nextSurvivorId;
        const newSurvivor = createSurvivor(newName);

        gameState.population.list.push(newSurvivor);
        gameState.population.current++;
        console.log(`Found survivor: ${newName}. Population: ${gameState.population.current}/${gameState.population.max}`);
        updateDisplay(); // Update UI immediately
    } else {
        console.log("Cannot search for survivors, population capacity reached.");
        // Optionally provide user feedback
    }
}

// --- Survivor Assignment ---
function assignSurvivor(survivorId, centerKey) {
    const survivor = gameState.population.list.find(s => s.id === survivorId);
    if (!survivor) {
        console.log(`Survivor with ID ${survivorId} not found.`);
        return;
    }
    
    const center = gameState.idleProduction[centerKey];
    if (!center) {
        console.log(`Production center ${centerKey} not found.`);
        return;
    }

    // Check if survivor exists, is unassigned, and the target center is active
    if (survivor.assignedCenter === null && center.level > 0) {
        survivor.assignedCenter = centerKey;
        center.assignedWorkers++;
        console.log(`${survivor.name} assigned to ${centerKey}.`);
        updateDisplay();
    } else {
        if (survivor.assignedCenter !== null) {
            console.log(`${survivor.name} is already assigned to ${survivor.assignedCenter}.`);
        } else if (center.level === 0) {
            console.log(`Cannot assign to inactive center: ${centerKey}.`);
        } else {
            console.log(`Cannot assign ${survivor.name} to ${centerKey}. Unknown reason.`);
        }
    }
}

function unassignSurvivor(survivorId) {
    const survivor = gameState.population.list.find(s => s.id === survivorId);
    if (!survivor) {
        console.log(`Survivor with ID ${survivorId} not found for unassignment.`);
        return;
    }

    if (survivor.assignedCenter !== null) {
        const oldCenterKey = survivor.assignedCenter;
        const oldCenter = gameState.idleProduction[oldCenterKey];
        if (oldCenter && typeof oldCenter.assignedWorkers === 'number') { // Check if oldCenter and assignedWorkers exist
            oldCenter.assignedWorkers--;
            if (oldCenter.assignedWorkers < 0) oldCenter.assignedWorkers = 0; // Prevent negative workers
        }
        survivor.assignedCenter = null;
        console.log(`${survivor.name} unassigned from ${oldCenterKey}.`);
        updateDisplay();
    } else {
        console.log(`${survivor.name} is not currently assigned.`);
    }
}

// --- Derived Stats Update ---
function updateDerivedStats() {
    // Calculate max population based on shelters
    gameState.population.max = gameState.buildings.shelters * POPULATION_PER_SHELTER;

    // Potentially calculate other derived stats here later
}