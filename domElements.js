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
// Note: idleSystemInfo is declared earlier (around line 54 in original script.js)

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