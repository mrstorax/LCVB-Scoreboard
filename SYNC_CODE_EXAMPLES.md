# Code Examples for Synchronization

This document provides code snippets that need to be added to `control_mobile.html` to synchronize with `control.html`.

---

## 1. CARD SYSTEM IMPLEMENTATION

### Add Global Variables (near top of script)

```javascript
let timeoutsCount = { team1: 0, team2: 0 };

// Card system globals
window.selectedCardTeam = null;
window.selectedCardColor = null;
```

### Add directCard() Function

```javascript
function directCard() {
    const existingModal = document.getElementById('card-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'card-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #0f172a;
        z-index: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    `;

    modal.innerHTML = `
        <div style="background: #1e293b; border-radius: 16px; padding: 2rem; max-width: 400px; width: 100%;">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; text-align: center;">🟨🟥 Carton</h2>
            
            <div style="margin-bottom: 1.5rem;">
                <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.75rem; opacity: 0.8;">Équipe :</div>
                <button onclick="window.selectedCardTeam='us'; updateCardTeamSelection()" id="card-team-us" class="card-team-btn" style="width: 100%; padding: 1rem; background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-bottom: 0.5rem; color: #000;">
                    ✅ Notre équipe
                </button>
                <button onclick="window.selectedCardTeam='them'; updateCardTeamSelection()" id="card-team-them" class="card-team-btn" style="width: 100%; padding: 1rem; background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #000;">
                    ❌ Équipe adverse
                </button>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.75rem; opacity: 0.8;">Couleur :</div>
                <button onclick="window.selectedCardColor='jaune'; updateCardColorSelection()" id="card-color-jaune" class="card-color-btn" style="width: 100%; padding: 1rem; background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-bottom: 0.5rem; color: #000;">
                    🟨 Carton Jaune
                </button>
                <button onclick="window.selectedCardColor='rouge'; updateCardColorSelection()" id="card-color-rouge" class="card-color-btn" style="width: 100%; padding: 1rem; background: #fee2e2; border: 2px solid #ef4444; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #000;">
                    🟥 Carton Rouge
                </button>
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <button onclick="closeCardModal()" style="flex: 1; padding: 0.75rem; background: #64748b; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    ✕ Annuler
                </button>
                <button id="btn-validate-card" onclick="validateCard()" disabled style="flex: 1; padding: 0.75rem; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; opacity: 0.5;">
                    ✓ Valider
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    window.selectedCardTeam = null;
    window.selectedCardColor = null;
}
```

### Add Card Helper Functions

```javascript
function updateCardTeamSelection() {
    document.querySelectorAll('.card-team-btn').forEach(btn => {
        btn.style.background = '#f3f4f6';
        btn.style.opacity = '0.7';
    });

    if (window.selectedCardTeam) {
        const btn = document.getElementById(`card-team-${window.selectedCardTeam}`);
        if (btn) {
            btn.style.background = '#10b981';
            btn.style.color = 'white';
            btn.style.opacity = '1';
        }
    }

    checkCardValidation();
}

function updateCardColorSelection() {
    document.querySelectorAll('.card-color-btn').forEach(btn => {
        btn.style.opacity = '0.7';
    });

    if (window.selectedCardColor) {
        const btn = document.getElementById(`card-color-${window.selectedCardColor}`);
        if (btn) {
            btn.style.opacity = '1';
        }
    }

    checkCardValidation();
}

function checkCardValidation() {
    const validateBtn = document.getElementById('btn-validate-card');
    if (validateBtn && window.selectedCardTeam && window.selectedCardColor) {
        validateBtn.disabled = false;
        validateBtn.style.opacity = '1';
    } else if (validateBtn) {
        validateBtn.disabled = true;
        validateBtn.style.opacity = '0.5';
    }
}

function validateCard() {
    if (!window.selectedCardTeam || !window.selectedCardColor) return;

    const team = window.selectedCardTeam;
    const color = window.selectedCardColor;

    const data = LCVBScoreboard.getScoreData();

    // Record in matchStats
    const rally = {
        actions: [{
            type: 'card',
            team: team,
            color: color
        }],
        rallyResult: { winner: null, reason: 'card' },
        setNumber: data.currentSet,
        metadata: {
            serviceBefore: serviceTeam,
            serviceAfter: serviceTeam,
            rotationBefore: rotationTracker.currentIndex,
            rotationAfter: rotationTracker.currentIndex
        }
    };

    matchStats.rallies.push(rally);
    localStorage.setItem('lcvb_match_stats', JSON.stringify(matchStats));

    closeCardModal();
    updateRecentActions();
    showNotification(`${color === 'jaune' ? '🟨 Carton jaune' : '🟥 Carton rouge'} pour ${team === 'us' ? 'nous' : 'eux'}`);
}

function closeCardModal() {
    const modal = document.getElementById('card-modal');
    if (modal) modal.remove();
    window.selectedCardTeam = null;
    window.selectedCardColor = null;
}
```

---

## 2. TIMEOUT SYSTEM IMPLEMENTATION

### Update addTimeout() to enforce limits

```javascript
function addTimeout(team) {
    const data = LCVBScoreboard.getScoreData();

    // Check if team has timeouts left
    if (timeoutsCount[team === 'us' ? 'team1' : 'team2'] >= 2) {
        const teamName = team === 'us' ? 'Notre équipe' : 'Équipe adverse';
        showNotification(`❌ ${teamName} a déjà utilisé ses 2 timeouts !`);
        return;
    }

    // Increment timeout count
    const teamKey = team === 'us' ? 'team1' : 'team2';
    timeoutsCount[teamKey]++;

    const teamName = matchSetup.homeTeam?.name || (team === 'us' ? 'NOTRE ÉQUIPE' : 'ADVERSAIRES');
    showTimeoutTimer(team, teamName);

    // Record timeout
    const rally = {
        actions: [{
            type: 'timeout',
            team: team
        }],
        rallyResult: { winner: null, reason: 'timeout' },
        setNumber: data.currentSet,
        metadata: {
            serviceBefore: serviceTeam,
            serviceAfter: serviceTeam,
            rotationBefore: rotationTracker.currentIndex,
            rotationAfter: rotationTracker.currentIndex
        }
    };

    matchStats.rallies.push(rally);
    localStorage.setItem('lcvb_match_stats', JSON.stringify(matchStats));

    updateRecentActions();
}
```

### Add directTimeout() Function

```javascript
function directTimeout() {
    const existingModal = document.getElementById('timeout-selection-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'timeout-selection-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #0f172a;
        z-index: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    `;

    const ourTimeouts = timeoutsCount.team1 || 0;
    const theirTimeouts = timeoutsCount.team2 || 0;

    modal.innerHTML = `
        <div style="background: #1e293b; border-radius: 16px; padding: 2rem; max-width: 400px; width: 100%;">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; text-align: center;">⏸️ Temps mort</h2>
            
            <button onclick="selectTimeoutTeam('us')" class="timeout-team-btn" style="padding: 1.25rem; background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.5rem; color: #000;">
                <span>✅ Notre équipe</span>
                <span>${ourTimeouts}/2</span>
            </button>
            
            <button onclick="selectTimeoutTeam('them')" class="timeout-team-btn" style="padding: 1.25rem; background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 1rem; color: #000;">
                <span>❌ Équipe adverse</span>
                <span>${theirTimeouts}/2</span>
            </button>

            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 0.75rem; background: #64748b; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                ✕ Annuler
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

function selectTimeoutTeam(team) {
    const modal = document.getElementById('timeout-selection-modal');
    if (modal) modal.remove();
    addTimeout(team);
}
```

### Add showTimeoutTimer() Function

```javascript
function showTimeoutTimer(team, teamName) {
    const existingModal = document.getElementById('timeout-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'timeout-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 700;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 2rem; margin-bottom: 1rem; font-weight: 700;">${team === 'us' ? '✅' : '❌'} ${teamName}</div>
            <div style="font-size: 5rem; font-weight: 800; color: #EC4899; margin-bottom: 2rem;" id="timeout-seconds">30</div>
            <div style="font-size: 1.1rem; margin-bottom: 2rem;">Timeouts restants : ${2 - timeoutsCount[team === 'us' ? 'team1' : 'team2']}</div>
            <button onclick="endTimeout()" style="padding: 0.75rem 2rem; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
                ✓ Terminer le timeout
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    let seconds = 30;
    const interval = setInterval(() => {
        seconds--;
        const display = document.getElementById('timeout-seconds');
        if (display) {
            display.textContent = seconds;
        }

        if (seconds <= 0) {
            clearInterval(interval);
            endTimeout();
        }
    }, 1000);

    window.endTimeout = function() {
        clearInterval(interval);
        const timeoutModal = document.getElementById('timeout-modal');
        if (timeoutModal) timeoutModal.remove();
    };
}
```

### Add resetTimeoutsForNewSet() Function

```javascript
function resetTimeoutsForNewSet() {
    timeoutsCount = {
        team1: 0,
        team2: 0
    };
    console.log('⏸️ Compteurs de timeouts réinitialisés pour le nouveau set');
}
```

---

## 3. HISTORY DELETION IMPLEMENTATION

### Update showHistory() to include delete buttons

Add delete buttons to each history item:

```javascript
function showHistory() {
    if (matchStats.rallies.length === 0) {
        showNotification('📋 Aucun historique');
        return;
    }

    const historyHtml = matchStats.rallies.slice().reverse().slice(0, 30).map((rally, idx) => {
        const realIdx = matchStats.rallies.length - idx - 1;
        const isPoint = rally.rallyResult.winner !== null;
        const winner = rally.rallyResult.winner === 'us' ? '✅' : (rally.rallyResult.winner === 'them' ? '❌' : '⚪');
        
        return `
            <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid #10b981; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="font-weight: 700; margin-bottom: 0.25rem;">
                        ${winner} ${isPoint ? `Point #${realIdx + 1}` : rally.rallyResult.reason}
                    </div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">Set ${rally.setNumber}</div>
                </div>
                <button onclick="deleteHistoryEntry(${realIdx})" style="padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-weight: 600;">
                    🗑️ Supprimer
                </button>
            </div>
        `;
    }).join('');

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #0f172a;
        z-index: 600;
        overflow-y: auto;
        padding: 1rem;
    `;

    modal.innerHTML = `
        <div style="position: sticky; top: 0; background: #0f172a; padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 2px solid rgba(255,255,255,0.1); z-index: 10;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-size: 1.5rem; font-weight: 800;">📋 Historique</h2>
                <button onclick="this.closest('div').parentElement.remove()" style="background: #ef4444; border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; cursor: pointer;">
                    ✕ Fermer
                </button>
            </div>
            <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">
                ${matchStats.rallies.length} point${matchStats.rallies.length > 1 ? 's' : ''} au total
            </div>
        </div>
        <div>
            ${historyHtml}
        </div>
    `;

    document.body.appendChild(modal);
}
```

### Add deleteHistoryEntry() Function

```javascript
function deleteHistoryEntry(index) {
    if (index < 0 || index >= matchStats.rallies.length) return;

    const rally = matchStats.rallies[index];
    
    // Determine message based on type
    let message = '';
    if (rally.type === 'timeout') {
        message = 'Supprimer ce timeout ?';
    } else if (rally.type === 'card') {
        message = 'Supprimer ce carton ?';
    } else if (rally.type === 'substitution') {
        message = 'Supprimer ce changement ?';
    } else {
        message = 'Supprimer ce point ?';
    }

    if (!confirm(message)) return;

    // Remove rally
    const removedRally = matchStats.rallies.splice(index, 1)[0];

    // Revert score changes
    const data = LCVBScoreboard.getScoreData();
    if (removedRally.rallyResult.winner === 'us') {
        data.team1.score = Math.max(0, data.team1.score - 1);
    } else if (removedRally.rallyResult.winner === 'them') {
        data.team2.score = Math.max(0, data.team2.score - 1);
    }
    localStorage.setItem('lcvb_score', JSON.stringify(data));

    // Restore timeouts if timeout was deleted
    if (removedRally.type === 'timeout' || removedRally.rallyResult.reason === 'timeout') {
        const team = removedRally.actions?.[0]?.team || 'team1';
        const teamKey = team === 'us' ? 'team1' : 'team2';
        if (timeoutsCount[teamKey] > 0) {
            timeoutsCount[teamKey]--;
        }
    }

    // Update stats
    updatePlayerStats();
    localStorage.setItem('lcvb_match_stats', JSON.stringify(matchStats));

    updateDisplay();
    loadCourtComposition();
    showNotification('✅ Action supprimée');
}
```

---

## 4. DIRECT ACTIONS BUTTONS

Add these buttons to the quick actions section in the HTML (inside the action grid):

```html
<!-- Add this in the appropriate section of the HTML -->
<button class="action-btn warning" style="padding: 0.75rem; font-size: 0.85rem;" onclick="directCard()">
    🟨🟥 Carton<br><span style="font-size: 0.7rem; opacity: 0.8;">Jaune ou Rouge</span>
</button>

<button class="action-btn neutral" style="padding: 0.75rem; font-size: 0.85rem;" onclick="directTimeout()">
    ⏸️ Temps mort<br><span style="font-size: 0.7rem; opacity: 0.8;">Notre équipe</span>
</button>

<button class="action-btn neutral" style="padding: 0.75rem; font-size: 0.85rem;" onclick="directSubstitution()">
    🔄 Changement<br><span style="font-size: 0.7rem; opacity: 0.8;">Joueur</span>
</button>
```

---

## 5. TIMEOUT COUNTER DISPLAY

Add timeout counter to mobile header:

```html
<!-- Add this to the mobile-header section -->
<div style="font-size: 0.75rem; opacity: 0.8; text-align: center; margin-top: 0.5rem;">
    <span id="timeout-team1-display">Équipe 1: 0/2</span> | <span id="timeout-team2-display">Équipe 2: 0/2</span>
</div>
```

Update the displayupdate function to refresh this:

```javascript
function updateDisplay() {
    // ... existing code ...
    
    // Update timeout counters
    const team1Name = matchSetup?.homeTeam?.name || 'Équipe 1';
    const team2Name = matchSetup?.awayTeam?.name || 'Équipe 2';
    document.getElementById('timeout-team1-display').textContent = 
        `${team1Name}: ${timeoutsCount.team1}/2`;
    document.getElementById('timeout-team2-display').textContent = 
        `${team2Name}: ${timeoutsCount.team2}/2`;
}
```

---

## 6. SET MANAGEMENT

Add nextSet() function:

```javascript
function nextSet() {
    const data = LCVBScoreboard.getScoreData();
    
    // Save current set scores
    const currentSetIndex = data.currentSet - 1;
    if (currentSetIndex >= 0 && currentSetIndex < 5) {
        data.team1.sets[currentSetIndex] = data.team1.score;
        data.team2.sets[currentSetIndex] = data.team2.score;
    }

    // Move to next set
    const newSet = data.currentSet + 1;
    data.currentSet = newSet;

    // Reset scores
    data.team1.score = 0;
    data.team2.score = 0;

    // Save
    localStorage.setItem('lcvb_score', JSON.stringify(data));

    // Reset timeouts
    resetTimeoutsForNewSet();

    // Reset service
    serviceTeam = null;

    // Show positioning modal
    if (matchSetup && matchSetup.homeTeam) {
        showPositioningModal();
    }

    updateDisplay();
    showNotification(`🏐 Manche ${newSet} - Positionnez vos joueurs`);
}
```

---

## Integration Notes

1. Insert the global variable declarations at the top of the script section (after existing globals)
2. Add all function definitions in their logical sections (cards together, timeouts together, etc.)
3. Update existing functions like `addTimeout()` and `updateDisplay()` as shown
4. Add the new UI buttons in the appropriate HTML section
5. Test each feature independently before moving to the next
6. Ensure all functions have access to required globals (matchStats, courtComposition, serviceTeam, etc.)

