// --- Upgrade Cost Calculation ---
function calculateUpgradeCost(center) {
    // Cost scales exponentially based on level
    return Math.floor(center.baseUpgradeCost * Math.pow(center.upgradeCostMultiplier, center.level));
}

// --- Calculations ---
function calculateIdleProduction() {
    const centers = gameState.idleProduction;
    const globalBonusPerWorker = centers.bonusPerWorker; // Includes tech bonus

    // Calculate for each center (Scavenging, Farming, Water, Research)
    for (const centerKey in centers) {
        // Check if it's a production center object (has a 'level' property)
        // and also ensure it's not the 'bonusPerWorker' property itself
        if (typeof centers[centerKey] === 'object' && 
            centers[centerKey] !== null && // Ensure it's not null
            centers[centerKey].hasOwnProperty('level')) {
            const center = centers[centerKey];
            if (center.level > 0) {
                // New base rate calculation based on max population
                // This was an existing complex calculation, keeping it as is.
                // Consider if this baseRate should be per-center or global.
                // For now, it's calculated per active center.
                const maxPop = gameState.population.max > 0 ? gameState.population.max : 1; // Avoid division by zero or negative multipliers if maxPop is 0
                const popBonus = Math.floor(maxPop / 5) * 0.2; // Original logic
                const baseRate = (0.2 * maxPop) + popBonus; // Original logic

                // Calculate worker bonus specifically for this center's assigned workers
                const workerBonus = center.assignedWorkers * globalBonusPerWorker;
                center.currentRate = baseRate + workerBonus;
            } else {
                center.currentRate = 0; // Inactive center produces nothing
            }
        }
    }
}