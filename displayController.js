// --- Display Update ---
function updateDisplay() {
    // Use toFixed(1) for potentially fractional resources
    if (scrapCountSpan) scrapCountSpan.textContent = gameState.resources.scrap.toFixed(1);
    if (foodCountSpan) foodCountSpan.textContent = gameState.resources.food.toFixed(1);
    if (waterCountSpan) waterCountSpan.textContent = gameState.resources.water.toFixed(1);
    if (rpCountSpan) rpCountSpan.textContent = gameState.resources.researchPoints.toFixed(1);

    // Update building counts
    if (shelterCountSpan) shelterCountSpan.textContent = gameState.buildings.shelters;

    // Update population display
    if (populationCountSpan) populationCountSpan.textContent = gameState.population.current;
    if (maxPopulationCountSpan) maxPopulationCountSpan.textContent = gameState.population.max;

    // Update button states
    if (buildShelterButton) buildShelterButton.disabled = gameState.resources.scrap < BUILDING_COSTS.shelter.scrap;
    if (searchSurvivorsButton) searchSurvivorsButton.disabled = gameState.population.current >= gameState.population.max;

    // Update idle production center displays
    const idleProd = gameState.idleProduction;
    const resources = gameState.resources;

    // Scavenging
    if (scavengingCenterDiv) { // Check if the div itself exists
        if (idleProd.scavenging.level > 0) {
            if (scavengingLevelSpan) scavengingLevelSpan.textContent = idleProd.scavenging.level;
            if (scavengingWorkersSpan) scavengingWorkersSpan.textContent = idleProd.scavenging.assignedWorkers;
            if (scavengingRateSpan) scavengingRateSpan.textContent = idleProd.scavenging.currentRate.toFixed(2);
            const scavCost = calculateUpgradeCost(idleProd.scavenging);
            if (scavengingUpgradeCostSpan) scavengingUpgradeCostSpan.textContent = `${scavCost} ${idleProd.scavenging.upgradeCostResource}`;
            if (upgradeScavengingButton) upgradeScavengingButton.disabled = resources[idleProd.scavenging.upgradeCostResource] < scavCost;
            scavengingCenterDiv.style.display = 'block';
        } else {
             scavengingCenterDiv.style.display = 'none'; // Hide if inactive
        }
    }

    // Farming
    if (farmingCenterDiv) {
        if (idleProd.farming.level > 0) {
            if (farmingLevelSpan) farmingLevelSpan.textContent = idleProd.farming.level;
            if (farmingWorkersSpan) farmingWorkersSpan.textContent = idleProd.farming.assignedWorkers;
            if (farmingRateSpan) farmingRateSpan.textContent = idleProd.farming.currentRate.toFixed(2);
            const farmCost = calculateUpgradeCost(idleProd.farming);
            if (farmingUpgradeCostSpan) farmingUpgradeCostSpan.textContent = `${farmCost} ${idleProd.farming.upgradeCostResource}`;
            if (upgradeFarmingButton) upgradeFarmingButton.disabled = resources[idleProd.farming.upgradeCostResource] < farmCost;
             farmingCenterDiv.style.display = 'block';
        } else {
             farmingCenterDiv.style.display = 'none';
        }
    }

    // Water
    if (waterCenterDiv) {
        if (idleProd.water.level > 0) {
            if (waterLevelSpan) waterLevelSpan.textContent = idleProd.water.level;
            if (waterWorkersSpan) waterWorkersSpan.textContent = idleProd.water.assignedWorkers;
            if (waterRateSpan) waterRateSpan.textContent = idleProd.water.currentRate.toFixed(2);
            const waterCost = calculateUpgradeCost(idleProd.water);
            if (waterUpgradeCostSpan) waterUpgradeCostSpan.textContent = `${waterCost} ${idleProd.water.upgradeCostResource}`;
            if (upgradeWaterButton) upgradeWaterButton.disabled = resources[idleProd.water.upgradeCostResource] < waterCost;
            waterCenterDiv.style.display = 'block';
        } else {
            waterCenterDiv.style.display = 'none';
        }
    }

     // Research
    if (researchCenterDiv) {
        if (idleProd.research.level > 0) {
            if (researchLevelSpan) researchLevelSpan.textContent = idleProd.research.level;
            if (researchWorkersSpan) researchWorkersSpan.textContent = idleProd.research.assignedWorkers;
            if (researchRateSpan) researchRateSpan.textContent = idleProd.research.currentRate.toFixed(2);
            const researchCost = calculateUpgradeCost(idleProd.research);
            // researchUpgradeCostSpan.textContent = `${researchCost} ${idleProd.research.upgradeCostResource}`; // If cost span exists
            if (upgradeResearchButton) upgradeResearchButton.disabled = resources[idleProd.research.upgradeCostResource] < researchCost; // Assuming cost resource exists
            researchCenterDiv.style.display = 'block';
        } else {
            researchCenterDiv.style.display = 'none';
        }
    }


    // Update technology display
    const basicToolsTech = gameState.technology.basicTools;
    if (techBasicToolsStatusSpan) techBasicToolsStatusSpan.textContent = basicToolsTech.researched ? "Researched" : "Locked";
    if (researchBasicToolsButton) {
        researchBasicToolsButton.disabled = basicToolsTech.researched || gameState.resources.researchPoints < basicToolsTech.cost.researchPoints;
        researchBasicToolsButton.textContent = basicToolsTech.researched ? "Researched" : `Research (Cost: ${basicToolsTech.cost.researchPoints} RP)`;
    }

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
    if (survivorListUl) renderSurvivorList(); // Check if survivorListUl exists

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


function renderSurvivorList() {
    if (!survivorListUl) return; // Ensure the UL element exists
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