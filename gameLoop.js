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