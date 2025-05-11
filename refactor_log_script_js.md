# Refactoring of script.js

**Date of Refactor:** 2025-05-11

**Reason for Refactor:**
To improve code organization, modularity, readability, and maintainability as the game's complexity grows. Splitting the monolithic `script.js` into multiple, feature-focused files makes it easier to manage, debug, and scale the codebase.

**Summary of Changes:**

The single `script.js` file was broken down into the following more specific JavaScript files:

1.  **`gameState.js`**: Contains the main `gameState` object, holding all dynamic game data.
2.  **`config.js`**: Stores global constants for the game (e.g., `BUILDING_COSTS`, `POPULATION_PER_SHELTER`).
3.  **`domElements.js`**: Centralizes all DOM element references obtained via `document.getElementById()`.
4.  **`gameLoop.js`**: Manages the main `gameTick()` function and the `gameLoopInterval`.
5.  **`displayController.js`**: Handles all updates to the HTML display, including `updateDisplay()` and `renderSurvivorList()`.
6.  **`productionController.js`**: Contains logic for resource production calculations, such as `calculateIdleProduction()` and `calculateUpgradeCost()`.
7.  **`settlementController.js`**: Manages building actions (`buildShelter`), population mechanics (`createSurvivor`, `searchForSurvivors`), survivor assignment (`assignSurvivor`, `unassignSurvivor`), and derived stats updates (`updateDerivedStats`).
8.  **`idleCenters.js`**: Contains the logic for upgrading idle production centers (`upgradeCenter()`).
9.  **`technologyController.js`**: Manages all technology research functions (e.g., `researchBasicTools()`, `researchWriting()`).
10. **`mapController.js`**: Handles map view selection logic (`selectMapView()`).
11. **`main.js`**: Contains the initial game setup functions `makeInitialChoice()` and `init()`, which also sets up event listeners.

**`index.html` Update:**
The `index.html` file was updated to remove the single script tag for `script.js` and replace it with individual script tags for each of the new JavaScript files, loaded in the correct dependency order.

**Status of Original `script.js`:**
The original `script.js` file is no longer referenced by `index.html` and is now redundant. It is recommended to archive or delete this file.