# Plan: Add Population-Based Resource Production

This document outlines the plan to add resource production based on the current population in [`script.js`](script.js), without altering existing production mechanisms.

**User-Defined Rates:**
*   Each survivor produces 0.05 Food per tick.
*   Each survivor produces 0.05 Water per tick.
*   Each survivor produces 0.05 Scrap per tick.
*   Every 5 survivors produce 0.05 Research Points per tick.

**Detailed Plan:**

1.  **Update `gameState` Object ([`script.js:2`](script.js:2)):**
    *   Introduce a new key, `populationProductionRates`, within the `gameState` object.
    *   This new section will be:
        ```javascript
        populationProductionRates: {
            foodPerSurvivor: 0.05,
            waterPerSurvivor: 0.05,
            scrapPerSurvivor: 0.05,
            researchPointsPer5Survivors: 0.05
        }
        ```

2.  **Modify `gameTick()` Function ([`script.js:150`](script.js:150)):**
    *   After the existing lines that add resources from `idleProduction` ([`script.js:157-160`](script.js:157-160)), insert new logic:
        *   `gameState.resources.food += gameState.population.current * gameState.populationProductionRates.foodPerSurvivor;`
        *   `gameState.resources.water += gameState.population.current * gameState.populationProductionRates.waterPerSurvivor;`
        *   `gameState.resources.scrap += gameState.population.current * gameState.populationProductionRates.scrapPerSurvivor;`
        *   `gameState.resources.researchPoints += Math.floor(gameState.population.current / 5) * gameState.populationProductionRates.researchPointsPer5Survivors;`

**Mermaid Diagram of `gameTick()` Flow Change:**

```mermaid
graph TD
    A[gameTick() Starts] --> B{Initial Choice Made?};
    B -- No --> X[Return];
    B -- Yes --> C[calculateIdleProduction()];
    C --> D[Add Idle Production Resources];
    D --> E[NEW: Calculate Population-Based Food];
    E --> F[NEW: Add Population-Based Food to gameState.resources.food];
    F --> G[NEW: Calculate Population-Based Water];
    G --> H[NEW: Add Population-Based Water to gameState.resources.water];
    H --> I[NEW: Calculate Population-Based Scrap];
    I --> J[NEW: Add Population-Based Scrap to gameState.resources.scrap];
    J --> K[NEW: Calculate Population-Based Research Points];
    K --> L[NEW: Add Population-Based Research Points to gameState.resources.researchPoints];
    L --> M[updateDisplay()];
    M --> N[Future: Events, Needs, etc.];
    N --> Z[gameTick() Ends];