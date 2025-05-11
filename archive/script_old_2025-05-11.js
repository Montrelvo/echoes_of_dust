// --- Game State ---
let gameState = {
    resources: {
        scrap: 0,
        food: 10,
        water: 10,
        researchPoints: 0,
    },
    buildings: {
        shelters: 0
    },
    population: {
        current: 1, // Start with 1 survivor (the player/leader)
        max: 0, // Calculated based on shelters
        list: [] // Array to hold survivor objects
    },
    settings: {
        gameSpeed: 1000 // milliseconds per game tick (1 second)
    },
    populationProductionRates: {
        foodPerSurvivor: 0.05,
        waterPerSurvivor: 0.05,
        scrapPerSurvivor: 0.05,
        researchPointsPer5Survivors: 0.05
    },
    // Refactored Idle Production Centers
    idleProduction: {
        // Global worker bonus, potentially modified by tech
        bonusPerWorker: 0.05, // Start at base, tech will increase it
        scavenging: {
            level: 1, // 0 means inactive/not chosen initially
            baseRatePerLevel: 0.1,
            assignedWorkers: 0,
            currentRate: 0,
            upgradeCostResource: 'food',
            baseUpgradeCost: 15,
            upgradeCostMultiplier: 1.5
        },
        farming: { // Renamed from 'labor' for clarity
            level: 1,
            baseRatePerLevel: 0.08, // Food base rate
            assignedWorkers: 0,
            currentRate: 0,
            upgradeCostResource: 'water',
            baseUpgradeCost: 15,
            upgradeCostMultiplier: 1.5
        },
        water: { // New center for water
            level: 1,
            baseRatePerLevel: 0.08, // Water base rate
            assignedWorkers: 0,
            currentRate: 0,
            upgradeCostResource: 'scrap',
            baseUpgradeCost: 15,
            upgradeCostMultiplier: 1.5
        },
        research: { // Kept separate
            level: 1,
            baseRatePerLevel: 0.02,
            assignedWorkers: 0,
            currentRate: 0,
            upgradeCostResource: 'scrap', // Example cost
            baseUpgradeCost: 25,
            upgradeCostMultiplier: 1.8
        }
        // Exploration removed for now to focus on resource triangle
    },
    flags: {
        initialChoiceMade: false // This flag might become less relevant or change meaning
    },
    technology: {
        basicTools: {
            researched: false,
            cost: { researchPoints: 5 }
        },
        writing: {
            researched: false,
            cost: { researchPoints: 5 }
        },
        mapMaking: {
            researched: false,
            cost: { researchPoints: 5 }
        },
        trade: {
            researched: false,
            cost: { researchPoints: 5 }
        }
    },
    ui: {
        currentMapView: 'sector' // Default to sector map
    }
};

// --- DOM References ---
const scrapCountSpan = document.getElementById('scrap-count');
const foodCountSpan = document.getElementById('food-count');
const waterCountSpan = document.getElementById('water-count');
const rpCountSpan = document.getElementById('rp-count');

const initialChoiceScreen = document.getElementById('initial-choice-screen');
const gameContainer = document.getElementById('game-container');
const idleSystemInfo = document.getElementById('idle-system-info');

// Building elements
const shelterCountSpan = document.getElementById('shelter-count');
const buildShelterButton = document.getElementById('build-shelter-button');

// Population elements
const populationCountSpan = document.getElementById('population-count');
const maxPopulationCountSpan = document.getElementById('max-population-count');
const searchSurvivorsButton = document.getElementById('search-survivors-button');
const survivorListUl = document.getElementById('survivor-list');

// Idle system display elements (New Structure)
// Note: idleSystemInfo is declared earlier (around line 54)

// Scavenging Center Elements
const scavengingCenterDiv = document.getElementById('scavenging-center');
const scavengingLevelSpan = document.getElementById('scavenging-level');
const scavengingWorkersSpan = document.getElementById('scavenging-workers');
const scavengingRateSpan = document.getElementById('scavenging-rate');
const upgradeScavengingButton = document.getElementById('upgrade-scavenging-button');
const scavengingUpgradeCostSpan = document.getElementById('scavenging-upgrade-cost');

// Farming Center Elements
const farmingCenterDiv = document.getElementById('farming-center');
const farmingLevelSpan = document.getElementById('farming-level');
const farmingWorkersSpan = document.getElementById('farming-workers');
const farmingRateSpan = document.getElementById('farming-rate');
const upgradeFarmingButton = document.getElementById('upgrade-farming-button');
const farmingUpgradeCostSpan = document.getElementById('farming-upgrade-cost');

// Water Center Elements
const waterCenterDiv = document.getElementById('water-center');
const waterLevelSpan = document.getElementById('water-level');
const waterWorkersSpan = document.getElementById('water-workers');
const waterRateSpan = document.getElementById('water-rate');
const upgradeWaterButton = document.getElementById('upgrade-water-button');
const waterUpgradeCostSpan = document.getElementById('water-upgrade-cost');

// Research Center Elements (Separate for now)
const researchCenterDiv = document.getElementById('research-center');
const researchLevelSpan = document.getElementById('research-level');
const researchWorkersSpan = document.getElementById('research-workers');
const researchRateSpan = document.getElementById('research-rate');
const upgradeResearchButton = document.getElementById('upgrade-research-button');
// const researchUpgradeCostSpan = document.getElementById('research-upgrade-cost'); // Add if needed

// Technology elements
const techBasicToolsStatusSpan = document.getElementById('tech-basic-tools-status');
const researchBasicToolsButton = document.getElementById('research-basic-tools-button');
const techWritingStatusSpan = document.getElementById('tech-writing-status');
const researchWritingButton = document.getElementById('research-writing-button');
const techMapMakingStatusSpan = document.getElementById('tech-map-making-status');
const researchMapMakingButton = document.getElementById('research-map-making-button');
const techTradeStatusSpan = document.getElementById('tech-trade-status');
const researchTradeButton = document.getElementById('research-trade-button');

// Map selection buttons
const buttonMapWorld = document.getElementById('button-map-world');
const buttonMapSector = document.getElementById('button-map-sector');

// Initial choice buttons
const choiceScavengingButton = document.getElementById('choice-scavenging');
const choiceLaborButton = document.getElementById('choice-labor');
const choiceExplorationButton = document.getElementById('choice-exploration');
const choiceResearchButton = document.getElementById('choice-research');


// --- Constants ---
const BUILDING_COSTS = {
    shelter: { scrap: 10 }
};
const POPULATION_PER_SHELTER = 2;
// Idle production constants are now within gameState.idleProduction objects

// --- Game Loop ---
let gameLoopInterval = null; // To store the interval ID

function gameTick() {
    if (!gameState.flags.initialChoiceMade) return; // Don't run if choice not made

    // 1. Calculate Production (moved to separate function for clarity)
    calculateIdleProduction();

    // 2. Add Resources based on individual center rates
    gameState.resources.scrap += gameState.idleProduction.scavenging.currentRate;
    gameState.resources.food += gameState.idleProduction.farming.currentRate;
    gameState.resources.water += gameState.idleProduction.water.currentRate;
    gameState.resources.researchPoints += gameState.idleProduction.research.currentRate;

    // Add population-based production
    gameState.resources.food += gameState.population.current * gameState.populationProductionRates.foodPerSurvivor;
    gameState.resources.water += gameState.population.current * gameState.populationProductionRates.waterPerSurvivor;
    gameState.resources.scrap += gameState.population.current * gameState.populationProductionRates.scrapPerSurvivor;
    gameState.resources.researchPoints += Math.floor(gameState.population.current / 5) * gameState.populationProductionRates.researchPointsPer5Survivors;
    // Exploration removed for now

    // 3. Update Resource Display
    updateDisplay();

    // 3. (Future) Check for events, update survivor needs, etc.
}

// --- Display Update ---
function updateDisplay() {
    // Use toFixed(1) for potentially fractional resources
    scrapCountSpan.textContent = gameState.resources.scrap.toFixed(1);
    foodCountSpan.textContent = gameState.resources.food.toFixed(1);
    waterCountSpan.textContent = gameState.resources.water.toFixed(1);
    rpCountSpan.textContent = gameState.resources.researchPoints.toFixed(1);

    // Update building counts
    shelterCountSpan.textContent = gameState.buildings.shelters;

    // Update population display
    populationCountSpan.textContent = gameState.population.current;
    maxPopulationCountSpan.textContent = gameState.population.max;

    // Update button states
    buildShelterButton.disabled = gameState.resources.scrap < BUILDING_COSTS.shelter.scrap;
    searchSurvivorsButton.disabled = gameState.population.current >= gameState.population.max;

    // Update idle production center displays
    const idleProd = gameState.idleProduction;
    const resources = gameState.resources;

    // Scavenging
    if (idleProd.scavenging.level > 0) {
        scavengingLevelSpan.textContent = idleProd.scavenging.level;
        scavengingWorkersSpan.textContent = idleProd.scavenging.assignedWorkers;
        scavengingRateSpan.textContent = idleProd.scavenging.currentRate.toFixed(2);
        const scavCost = calculateUpgradeCost(idleProd.scavenging);
        scavengingUpgradeCostSpan.textContent = `${scavCost} ${idleProd.scavenging.upgradeCostResource}`;
        upgradeScavengingButton.disabled = resources[idleProd.scavenging.upgradeCostResource] < scavCost;
        scavengingCenterDiv.style.display = 'block';
    } else {
         scavengingCenterDiv.style.display = 'none'; // Hide if inactive
    }

    // Farming
    if (idleProd.farming.level > 0) {
        farmingLevelSpan.textContent = idleProd.farming.level;
        farmingWorkersSpan.textContent = idleProd.farming.assignedWorkers;
        farmingRateSpan.textContent = idleProd.farming.currentRate.toFixed(2);
        const farmCost = calculateUpgradeCost(idleProd.farming);
        farmingUpgradeCostSpan.textContent = `${farmCost} ${idleProd.farming.upgradeCostResource}`;
        upgradeFarmingButton.disabled = resources[idleProd.farming.upgradeCostResource] < farmCost;
         farmingCenterDiv.style.display = 'block';
    } else {
         farmingCenterDiv.style.display = 'none';
    }

    // Water
    if (idleProd.water.level > 0) {
        waterLevelSpan.textContent = idleProd.water.level;
        waterWorkersSpan.textContent = idleProd.water.assignedWorkers;
        waterRateSpan.textContent = idleProd.water.currentRate.toFixed(2);
        const waterCost = calculateUpgradeCost(idleProd.water);
        waterUpgradeCostSpan.textContent = `${waterCost} ${idleProd.water.upgradeCostResource}`;
        upgradeWaterButton.disabled = resources[idleProd.water.upgradeCostResource] < waterCost;
        waterCenterDiv.style.display = 'block';
    } else {
        waterCenterDiv.style.display = 'none';
    }

     // Research
    if (idleProd.research.level > 0) {
        researchLevelSpan.textContent = idleProd.research.level;
        researchWorkersSpan.textContent = idleProd.research.assignedWorkers;
        researchRateSpan.textContent = idleProd.research.currentRate.toFixed(2);
        const researchCost = calculateUpgradeCost(idleProd.research);
        // researchUpgradeCostSpan.textContent = `${researchCost} ${idleProd.research.upgradeCostResource}`; // If cost span exists
        upgradeResearchButton.disabled = resources[idleProd.research.upgradeCostResource] < researchCost; // Assuming cost resource exists
        researchCenterDiv.style.display = 'block';
    } else {
        researchCenterDiv.style.display = 'none';
    }


    // Update technology display
    const basicToolsTech = gameState.technology.basicTools;
    techBasicToolsStatusSpan.textContent = basicToolsTech.researched ? "Researched" : "Locked";
    researchBasicToolsButton.disabled = basicToolsTech.researched || gameState.resources.researchPoints < basicToolsTech.cost.researchPoints;
    researchBasicToolsButton.textContent = basicToolsTech.researched ? "Researched" : `Research (Cost: ${basicToolsTech.cost.researchPoints} RP)`;

    const writingTech = gameState.technology.writing;
    if (techWritingStatusSpan) techWritingStatusSpan.textContent = writingTech.researched ? "Researched" : "Locked";
    if (researchWritingButton) {
        researchWritingButton.disabled = writingTech.researched || gameState.resources.researchPoints < writingTech.cost.researchPoints;
        researchWritingButton.textContent = writingTech.researched ? "Researched" : `Research (Cost: ${writingTech.cost.researchPoints} RP)`;
    }

    const mapMakingTech = gameState.technology.mapMaking;
    if (techMapMakingStatusSpan) techMapMakingStatusSpan.textContent = mapMakingTech.researched ? "Researched" : "Locked";
    if (researchMapMakingButton) {
        researchMapMakingButton.disabled = mapMakingTech.researched || gameState.resources.researchPoints < mapMakingTech.cost.researchPoints;
        researchMapMakingButton.textContent = mapMakingTech.researched ? "Researched" : `Research (Cost: ${mapMakingTech.cost.researchPoints} RP)`;
    }

    const tradeTech = gameState.technology.trade;
    if (techTradeStatusSpan) techTradeStatusSpan.textContent = tradeTech.researched ? "Researched" : "Locked";
    if (researchTradeButton) {
        researchTradeButton.disabled = tradeTech.researched || gameState.resources.researchPoints < tradeTech.cost.researchPoints;
        researchTradeButton.textContent = tradeTech.researched ? "Researched" : `Research (Cost: ${tradeTech.cost.researchPoints} RP)`;
    }

    // Update survivor list display
    renderSurvivorList();

    // Update active map button
    if (buttonMapWorld && buttonMapSector) {
        buttonMapWorld.classList.remove('active-map-button');
        buttonMapSector.classList.remove('active-map-button');
        if (gameState.ui.currentMapView === 'world') {
            buttonMapWorld.classList.add('active-map-button');
        } else if (gameState.ui.currentMapView === 'sector') {
            buttonMapSector.classList.add('active-map-button');
        }
    }
}

// --- Upgrade Cost Calculation ---
function calculateUpgradeCost(center) {
    // Cost scales exponentially based on level
    return Math.floor(center.baseUpgradeCost * Math.pow(center.upgradeCostMultiplier, center.level));
}

// --- Idle Center Upgrade Actions ---
function upgradeCenter(centerKey) {
    const center = gameState.idleProduction[centerKey];
    if (!center || center.level === 0) {
        console.log(`Cannot upgrade inactive center: ${centerKey}`);
        return;
    }

    const cost = calculateUpgradeCost(center);
    const resourceNeeded = center.upgradeCostResource;

    if (gameState.resources[resourceNeeded] >= cost) {
        gameState.resources[resourceNeeded] -= cost;
        center.level++;
        console.log(`Upgraded ${centerKey} to level ${center.level}.`);
        updateDisplay(); // Update UI immediately
    } else {
        console.log(`Not enough ${resourceNeeded} to upgrade ${centerKey}. Needed: ${cost}`);
    }
}


// --- Calculations ---
function calculateIdleProduction() {
    const centers = gameState.idleProduction;
    const globalBonusPerWorker = centers.bonusPerWorker; // Includes tech bonus

    // Calculate for each center (Scavenging, Farming, Water, Research)
    for (const centerKey in centers) {
        // Check if it's a production center object (has a 'level' property)
        if (typeof centers[centerKey] === 'object' && centers[centerKey].hasOwnProperty('level')) {
            const center = centers[centerKey];
            if (center.level > 0) {
                // New base rate calculation based on max population
                const maxPop = gameState.population.max;
                const popBonus = Math.floor(maxPop / 5) * 0.2;
                const baseRate = (0.2 * maxPop) + popBonus;

                // Calculate worker bonus specifically for this center's assigned workers
                const workerBonus = center.assignedWorkers * globalBonusPerWorker;
                center.currentRate = baseRate + workerBonus;
            } else {
                center.currentRate = 0; // Inactive center produces nothing
            }
        }
    }
}

function updateDerivedStats() {
    // Calculate max population based on shelters
    gameState.population.max = gameState.buildings.shelters * POPULATION_PER_SHELTER;

    // Potentially calculate other derived stats here later
}

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
    const center = gameState.idleProduction[centerKey];

    // Check if survivor exists, is unassigned, and the target center is active
    if (survivor && survivor.assignedCenter === null && center && center.level > 0) {
        survivor.assignedCenter = centerKey;
        center.assignedWorkers++;
        console.log(`${survivor.name} assigned to ${centerKey}.`);
        updateDisplay();
    } else {
        console.log(`Cannot assign ${survivor?.name} to ${centerKey}.`);
    }
}

function unassignSurvivor(survivorId) {
    const survivor = gameState.population.list.find(s => s.id === survivorId);
    if (survivor && survivor.assignedCenter !== null) {
        const oldCenterKey = survivor.assignedCenter;
        const oldCenter = gameState.idleProduction[oldCenterKey];
        if (oldCenter) {
            oldCenter.assignedWorkers--;
        }
        survivor.assignedCenter = null;
        console.log(`${survivor.name} unassigned from ${oldCenterKey}.`);
        updateDisplay();
    }
}


function renderSurvivorList() {
    survivorListUl.innerHTML = ''; // Clear existing list
    const idleProd = gameState.idleProduction;

    gameState.population.list.forEach(survivor => {
        const li = document.createElement('li');
        li.textContent = `${survivor.name} (${survivor.assignedCenter === null ? 'Idle' : `Working: ${survivor.assignedCenter}`}) `;

        if (survivor.assignedCenter === null) {
            // Add buttons to assign to each ACTIVE center
            if (idleProd.scavenging.level > 0) {
                const btn = document.createElement('button');
                btn.textContent = 'Assign Scavenging';
                btn.onclick = () => assignSurvivor(survivor.id, 'scavenging');
                li.appendChild(btn);
            }
            if (idleProd.farming.level > 0) {
                const btn = document.createElement('button');
                btn.textContent = 'Assign Farming';
                btn.onclick = () => assignSurvivor(survivor.id, 'farming');
                li.appendChild(btn);
            }
             if (idleProd.water.level > 0) {
                const btn = document.createElement('button');
                btn.textContent = 'Assign Water';
                btn.onclick = () => assignSurvivor(survivor.id, 'water');
                li.appendChild(btn);
            }
             if (idleProd.research.level > 0) {
                const btn = document.createElement('button');
                btn.textContent = 'Assign Research';
                btn.onclick = () => assignSurvivor(survivor.id, 'research');
                li.appendChild(btn);
            }
        } else {
            // Add button to unassign
            const unassignButton = document.createElement('button');
            unassignButton.textContent = 'Unassign';
            unassignButton.onclick = () => unassignSurvivor(survivor.id);
            li.appendChild(unassignButton);
        }

        survivorListUl.appendChild(li);
    });
}

// --- Technology Actions ---
function researchBasicTools() {
    const tech = gameState.technology.basicTools;
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        gameState.idleProduction.bonusPerWorker += 0.02; // Apply bonus
        console.log(`Researched Basic Tools! Worker bonus increased to ${gameState.idleProduction.bonusPerWorker.toFixed(3)}.`);
        updateDisplay(); // Update UI immediately
    } else {
        console.log("Cannot research Basic Tools - already researched or insufficient RP.");
    }
}

// --- Map View Functions ---
function selectMapView(mapType) {
    gameState.ui.currentMapView = mapType;
    console.log("Selected map view:", mapType);
    // Future: Call function to render the selected map display
    updateDisplay(); // Re-render to update active button
}

// --- New Technology Actions ---
function researchWriting() {
    const tech = gameState.technology.writing;
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        // Add any specific bonus for Writing here if needed in the future
        console.log("Researched Writing!");
        updateDisplay();
    } else {
        console.log("Cannot research Writing - already researched or insufficient RP.");
    }
}

function researchMapMaking() {
    const tech = gameState.technology.mapMaking;
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        // Add any specific bonus for Map Making here if needed in the future
        console.log("Researched Map Making!");
        updateDisplay();
    } else {
        console.log("Cannot research Map Making - already researched or insufficient RP.");
    }
}

function researchTrade() {
    const tech = gameState.technology.trade;
    if (!tech.researched && gameState.resources.researchPoints >= tech.cost.researchPoints) {
        gameState.resources.researchPoints -= tech.cost.researchPoints;
        tech.researched = true;
        // Add any specific bonus for Trade here if needed in the future
        console.log("Researched Trade!");
        updateDisplay();
    } else {
        console.log("Cannot research Trade - already researched or insufficient RP.");
    }
}

// --- Game Setup ---
function makeInitialChoice(choiceType) {
    if (gameState.flags.initialChoiceMade) return; // Prevent choosing again

    gameState.flags.initialChoiceMade = true;
    // No longer need a single 'type'. Activate the chosen center.

    let infoText = "Initial focus chosen: ";
    switch (choiceType) {
        case 'scavenging':
            gameState.idleProduction.scavenging.level = 1;
            scavengingCenterDiv.style.display = 'block'; // Ensure it's visible
            infoText += "Scavenging";
            break;
        case 'farming': // Changed from 'labor'
            gameState.idleProduction.farming.level = 1;
            farmingCenterDiv.style.display = 'block'; // Ensure it's visible
            infoText += "Farming";
            break;
        case 'water': // Added water choice
             gameState.idleProduction.water.level = 1;
             waterCenterDiv.style.display = 'block'; // Ensure it's visible
             infoText += "Water Collection";
             break;
        case 'research':
            gameState.idleProduction.research.level = 1;
            researchCenterDiv.style.display = 'block'; // Show research div
            infoText += "Research";
            break;
    }
    // Also ensure the other core centers (Scavenging, Farming, Water) are visible even if not chosen (level 0)
    if (gameState.idleProduction.scavenging.level === 0) scavengingCenterDiv.style.display = 'block';
    if (gameState.idleProduction.farming.level === 0) farmingCenterDiv.style.display = 'block';
    if (gameState.idleProduction.water.level === 0) waterCenterDiv.style.display = 'block';
    // Research center remains hidden unless chosen or unlocked later


    idleSystemInfo.textContent = infoText; // Update initial info message
    idleSystemInfo.style.display = 'none'; // Hide the generic info message after choice

    // Hide choice screen, show game container
    initialChoiceScreen.style.display = 'none';
    gameContainer.style.display = 'grid'; // Use grid as defined in CSS

    // Start the game loop ONLY after choice is made
    if (gameLoopInterval === null) {
         gameLoopInterval = setInterval(gameTick, gameState.settings.gameSpeed);
         console.log("Game loop started after initial choice.");
    }
}


// --- Initialization ---
function init() {
    console.log("Initializing Echoes of Dust - Awaiting initial choice...");
    updateDerivedStats(); // Calculate initial max population
    updateDisplay(); // Initial display update

    // Event listeners for choice buttons
    choiceScavengingButton.addEventListener('click', () => makeInitialChoice('scavenging'));
    choiceLaborButton.addEventListener('click', () => makeInitialChoice('labor'));
    choiceExplorationButton.addEventListener('click', () => makeInitialChoice('exploration'));
    choiceResearchButton.addEventListener('click', () => makeInitialChoice('research'));

    // Event listeners for action buttons
    buildShelterButton.addEventListener('click', buildShelter);
    searchSurvivorsButton.addEventListener('click', searchForSurvivors);
    researchBasicToolsButton.addEventListener('click', researchBasicTools);
    if (researchWritingButton) researchWritingButton.addEventListener('click', researchWriting);
    if (researchMapMakingButton) researchMapMakingButton.addEventListener('click', researchMapMaking);
    if (researchTradeButton) researchTradeButton.addEventListener('click', researchTrade);

    // Event listeners for map buttons
    if (buttonMapWorld) buttonMapWorld.addEventListener('click', () => selectMapView('world'));
    if (buttonMapSector) buttonMapSector.addEventListener('click', () => selectMapView('sector'));

    // Add event listeners for upgrade buttons
    upgradeScavengingButton.addEventListener('click', () => upgradeCenter('scavenging'));
    upgradeFarmingButton.addEventListener('click', () => upgradeCenter('farming'));
    upgradeWaterButton.addEventListener('click', () => upgradeCenter('water'));
    upgradeResearchButton.addEventListener('click', () => upgradeCenter('research'));


    // Initialize starting survivor
    const startingSurvivor = createSurvivor("Leader");
    gameState.population.list.push(startingSurvivor);
    // gameState.population.current is already 1

    console.log("Initialization complete. Ready for player choice.");
}

// Run initialization when the script loads
init();