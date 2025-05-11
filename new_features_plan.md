# New Features Plan for Echoes of Dust

This document outlines the design and implementation considerations for several new features proposed for the game "Echoes of Dust".

## 1. Map System

### 1.1. Map Selection UI

*   **Location:** Buttons will be placed adjacent to the main game title "Echoes of Dust" at the top of the page.
*   **Functionality:** These buttons will allow the player to switch between different map views or select specific maps/regions.
*   **Potential Button Labels:**
    *   "World Map"
    *   "Local Sector"
    *   Region-specific names (e.g., "The Dust Wastes," "Abandoned City Core") - to be defined as game world expands.
*   **Interaction:** Clicking a button would update the main map display area (to be developed).

#### 1.1.1. Implementation Plan for UI Buttons

*   **HTML Structure (`index.html`):**
    *   A new `div` container (e.g., `<div id="map-selection-controls">`) will be placed immediately after the main `<h1>Echoes of Dust</h1>` title.
    *   Buttons:
        *   `<button id="button-map-world">World Map</button>`
        *   `<button id="button-map-sector">Sector Map</button>`
*   **CSS Styling (`style.css`):**
    *   Style `#map-selection-controls` for layout (e.g., `display: flex; justify-content: center; margin-bottom: 10px;`).
    *   Style the map buttons (e.g., `padding: 5px 10px; margin: 0 5px; border: 1px solid #ffa500; background-color: #555; color: #eee; cursor: pointer;`).
    *   Add a class for active map button (e.g., `.active-map-button { background-color: #ffa500; color: #222; }`).
*   **JavaScript Logic (`script.js`):**
    *   **`gameState` Update:**
        *   Add `gameState.ui.currentMapView = 'sector';` (defaulting to sector map).
    *   **DOM References:**
        *   `const mapSelectionControls = document.getElementById('map-selection-controls');`
        *   `const buttonMapWorld = document.getElementById('button-map-world');`
        *   `const buttonMapSector = document.getElementById('button-map-sector');`
    *   **Event Handler Functions:**
        *   `function selectMapView(mapType)`:
            *   Updates `gameState.ui.currentMapView = mapType;`
            *   Logs selection: `console.log("Selected map view:", mapType);`
            *   Manages `.active-map-button` class on buttons.
            *   (Future) Calls function to render the selected map.
    *   **Event Listeners (in `init()`):**
        *   `buttonMapWorld.addEventListener('click', () => selectMapView('world'));`
        *   `buttonMapSector.addEventListener('click', () => selectMapView('sector'));`
    *   **Initial Active State (in `init()` or `updateDisplay()`):**
        *   Ensure the button corresponding to `gameState.ui.currentMapView` has the active class on game load.

### 1.2. Future Feature: Procedurally Generated Tile-Based Map UI

*   **Concept:** A dynamic map displayed as a grid of tiles.
*   **Generation:** The map layout will be procedurally generated, offering replayability and discovery.
*   **Visuals:** Each tile will have a visual representation (e.g., desert, ruins, oasis, hazard).
*   **Interaction:**
    *   Players might be able to click on tiles for more information or to interact with elements on that tile.
    *   The map could reveal itself as players explore ("fog of war").

## 2. Bestiary

*   **Purpose:** To provide players with information about creatures encountered in the game.
*   **Visuals:** Each creature entry will feature a tile-based image or sprite.
*   **Data Storage:**
    *   Creature data (name, description, stats, abilities, habitat, loot drops, image file path) will be stored in an external structured document (e.g., a JSON file like `bestiary_data.json`).
    *   Example JSON structure for a creature:
        ```json
        {
          "id": "mutant_rat",
          "name": "Mutant Rat",
          "image": "images/bestiary/mutant_rat.png",
          "description": "A common pest, mutated by the harsh environment. Surprisingly aggressive.",
          "stats": {
            "health": 10,
            "attack": 2
          },
          "habitat": "Ruins, Tunnels",
          "loot": ["scrap_bits", "tainted_meat"]
        }
        ```
*   **Data Loading:** A JavaScript function will be responsible for fetching and parsing this external document when the bestiary is accessed or when the game loads.
*   **UI Suggestions:**
    *   **List & Detail View:** A scrollable list of discovered creature names. Clicking a name reveals a detailed view with the image, description, and other stats.
    *   **Grid View:** A grid of creature images/tiles. Clicking a tile opens the detailed view. Undiscovered creatures could be shown as silhouettes or question marks.
    *   Entries are unlocked/revealed as players encounter or defeat creatures.

## 3. Journal / Quest Log / Lorebook Section

*   **Purpose:** A centralized hub for players to track their progress, objectives, and discovered information about the game world.
*   **Core Components:**
    *   **Quest Log:** Track active and completed quests, including objectives and rewards.
    *   **Lorebook:** Store discovered notes, historical accounts, character backstories, and world-building details.
    *   **Journal/Notes:** A section for player-authored notes or significant events.

### 3.1. Chosen Design: Tabbed Interface

*   **Structure:** A main panel with tabs across the top or side. This provides a clear and familiar way for players to navigate different types of information.
*   **Tabs:**
    *   **`Active Quests`**:
        *   Displays a list of all currently active quests.
        *   Selecting a quest shows its detailed description, objectives (with checkboxes or visual indicators for completion), and potential rewards.
        *   Quests could be visually prioritized or ordered by importance/recency.
    *   **`Completed Quests`**:
        *   An archive of all quests the player has finished.
        *   Allows players to review past accomplishments and story points.
        *   May include a summary of outcomes if quests have branching paths.
    *   **`Lore Entries`**:
        *   This tab could potentially have sub-categories or a filterable list for different types of lore.
        *   **Categories:** "Locations," "Characters," "History," "Factions," "Creatures" (could link to Bestiary or have brief summaries), "Technology," "Found Notes."
        *   Selecting an entry displays its full text content.
        *   New entries are marked until viewed.
    *   **`Player Notes`**:
        *   A simple, free-form text area or a list of editable notes.
        *   Allows players to jot down reminders, theories, or custom information.
        *   Could support multiple notes with titles.
*   **Data Structure (Conceptual for `script.js`):**
    ```javascript
    gameState.journal = {
        activeQuests: [
            { id: "q1", title: "Find Water Purifier", objectives: [{text: "Search Old Bunker", complete: false}], reward: "Clean Water Schematics" },
        ],
        completedQuests: [
            { id: "q0", title: "Survive the First Night", outcome: "Gained basic shelter."}
        ],
        lore: {
            locations: [ {id: "loc1", title: "Old Bunker", content: "A pre-war military installation..." } ],
            characters: [],
            // ... other categories
        },
        playerNotes: [
            { id: "note1", title: "Suspicious Trader", content: "Met a trader near the oasis, seemed shady." }
        ]
    };
    ```
*   **Pros:**
    *   Familiar and intuitive for most players.
    *   Provides a clear separation of different types of information, reducing cognitive load.
    *   Relatively straightforward to implement the basic structure.
*   **Cons:**
    *   If the number of lore categories or player notes becomes very large, navigation within those specific tabs might require further organization (e.g., sub-folders, better sorting/filtering within the tab).

### 3.2. Key Considerations for Tabbed Interface:

*   **Clear Visual Distinction:** Active quests should stand out.
*   **Search Functionality:** Allow players to search for keywords across all entries.
*   **Timestamping/Ordering:** Entries should ideally be sortable or displayed in the order they were discovered or updated.
*   **New Entry Notification:** A subtle indicator when new journal/lore entries are added.

## 4. Conclusion

These features aim to significantly enhance player engagement by providing clear objectives, a richer world to explore and understand, and a convenient way to track discoveries. Implementation will require careful consideration of UI/UX and data management.