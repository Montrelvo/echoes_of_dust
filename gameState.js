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