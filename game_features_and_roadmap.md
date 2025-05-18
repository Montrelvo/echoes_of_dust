# Echoes of Dust: Current Features & Development Roadmap

This document provides an overview of the currently implemented features in "Echoes of Dust" and outlines the roadmap for planned future features.

## I. Current Implemented Features (as of 2025-05-11)

### A. Core Gameplay Loop

1. **Resource Management:**
    * Scrap, Food, Water, Research Points.
    * Initial resources defined in `gameState.js`.
2. **Population System:**
    * Current and maximum population tracking.
    * Shelters increase maximum population (`config.js`, `settlementController.js`).
    * Ability to search for new survivors (`settlementController.js`).
    * Basic survivor list display (`displayController.js`).
3. **Idle Production Centers:**
    * Scavenging (Scrap), Farming (Food), Water Collection, Research Hub (RP).
    * Centers have levels, assigned workers, and production rates.
    * Production calculated based on center level, assigned workers, global worker bonus, and max population factors (`productionController.js`).
    * Ability to upgrade centers (`idleCenters.js`).
    * Worker assignment to centers (`settlementController.js`, `displayController.js`).
4. **Population-Based Resource Production:**
    * Survivors passively generate small amounts of Food, Water, and Scrap.
    * Groups of survivors generate Research Points.
    * Rates defined in `gameState.js` (`populationProductionRates`).
    * Production added during `gameTick()` in `gameLoop.js`.
    * (Details in `population_production_plan.md`)
5. **Technology System:**
    * Basic Tools: Researched via RP, provides a bonus to worker efficiency.
    * Writing, Map Making, Trade: Researched via RP (currently no gameplay effect beyond being "researched").
    * Technology definitions and costs in `gameState.js`.
    * Research functions in `technologyController.js`.
6. **Game Tick & Loop:**
    * Game progresses in ticks, managed by `gameLoop.js`.
    * Game speed configurable in `gameState.js`.

### B. User Interface (UI)

1. **Initial Game Setup:**
    * Choice screen for starting focus (`main.js`).
2. **Main Game Display (`index.html`, `displayController.js`):**
    * Resource counts.
    * Building counts (Shelters).
    * Population counts (current/max).
    * Idle Production Center status (level, workers, rate, upgrade buttons).
    * Technology status and research buttons.
    * Survivor list with assignment controls.
    * UI elements organized into collapsible dropdowns (`<details>`/`<summary>`).
3. **Map Selection UI:**
    * "World Map" and "Sector Map" buttons below the main title.
    * Buttons update `gameState.ui.currentMapView` and visual active state.
    * (Actual map display not yet implemented).
    * (Details in `new_features_plan.md`, section 1.1.1)

### C. Code Structure

1. **Modular JavaScript Files:**
    * The original `script.js` has been refactored into multiple topic-specific files (e.g., `gameState.js`, `gameLoop.js`, `displayController.js`, etc.) for better organization and maintainability.
    * (Details in `refactor_log_script_js.md`)

## II. Development Roadmap: Planned Future Features

This roadmap is based on features outlined in `new_features_plan.md`.

### A. Map System Enhancements

1. **Procedurally Generated Tile-Based Map UI (High Priority - Core Visual)**
    * **Goal:** Implement the actual visual display for the selected map (World/Sector).
    * **Tasks:**
        * Define tile types and their visual representation (could start simple, e.g., colored squares, then add icons/graphics).
        * Develop procedural generation logic for map layouts (for one map type first, e.g., Sector Map).
        * Create JavaScript functions to render the map grid in `index.html` (e.g., in a dedicated `div`).
        * Integrate with `selectMapView()` in `mapController.js` to re-render the map when view changes.
        * Consider basic interaction (e.g., displaying tile info on hover/click).
    * **Reference:** `new_features_plan.md` (Section 1.2)

### B. Bestiary (Medium Priority - Enhances World Building)

1. **Data Structure & Storage:**
    * Finalize JSON structure for `bestiary_data.json`.
    * Create initial `bestiary_data.json` file with a few sample creatures.
2. **Data Loading:**
    * Implement JavaScript function to fetch and parse `bestiary_data.json` (e.g., using `fetch` API). Store in `gameState`.
3. **UI Implementation:**
    * Add a new section/tab in `index.html` for the Bestiary.
    * Implement UI (e.g., List & Detail View as per `new_features_plan.md`).
    * Display creature images, descriptions, stats.
4. **Unlocking Mechanism:**
    * Add logic to `gameState` to track discovered creatures.
    * Update discovery status when creatures are encountered/defeated (this requires an encounter/combat system, which is a prerequisite or parallel development).
    * **Reference:** `new_features_plan.md` (Section 2)

### C. Journal / Quest Log / Lorebook System (Medium Priority - Enhances Narrative & Progression)

1. **Data Structures in `gameState.js`:**
    * Implement the conceptual `gameState.journal` structure (activeQuests, completedQuests, lore, playerNotes) as detailed in `new_features_plan.md`.
2. **UI Implementation (Tabbed Interface):**
    * Add a new section/tab in `index.html` for the Journal.
    * Create HTML structure for tabs (`Active Quests`, `Completed Quests`, `Lore Entries`, `Player Notes`).
    * Develop JavaScript functions in a new `journalController.js` to:
        * Render quest lists and details.
        * Render lore entry lists (with categories) and content.
        * Provide functionality for player notes (view, add, possibly edit/delete).
        * Handle tab switching logic.
3. **Quest Management (Basic):**
    * Functions to add new active quests to `gameState`.
    * Functions to mark quest objectives as complete.
    * Functions to move quests from active to completed.
4. **Lore Management (Basic):**
    * Functions to add new lore entries to `gameState`.
5. **Key Considerations from Plan:**
    * Visual distinction for active quests.
    * New entry notifications.
    * (Search and advanced sorting can be future enhancements to this system).
    * **Reference:** `new_features_plan.md` (Section 3.1, 3.2)

## III. General Future Considerations (Beyond Current Detailed Plans)

* Combat System.
* Event System.
* More detailed survivor traits/needs.
* Expansion of building types and their effects.
* More complex technology effects and tree.
* Saving and Loading game state.

This roadmap will be updated as features are implemented and new plans are developed.
