# Synchronization Checklist: control_mobile.html needs to match control.html

## CRITICAL ISSUES (Must Fix)

### 1. CARD SYSTEM - COMPLETELY MISSING
- [ ] Add `directCard()` function
- [ ] Create card selection modal with:
  - [ ] Team selection (Us / Them)
  - [ ] Card color selection (Yellow / Red)
  - [ ] Validation button
- [ ] Implement `validateCard()` function
- [ ] Implement `updateCardTeamSelection()` helper
- [ ] Implement `updateCardColorSelection()` helper
- [ ] Implement `closeCardModal()` helper
- [ ] Implement `checkCardValidation()` helper
- [ ] Add global variables:
  - [ ] `window.selectedCardTeam`
  - [ ] `window.selectedCardColor`
- [ ] Update matchStats data structure to handle `type: 'card'` with `color: 'jaune'|'rouge'`
- [ ] Update showHistory() to display card actions
- [ ] Update deleteHistoryEntry() to handle card deletion
- [ ] Add "🟨🟥 Carton" button to action grid

### 2. TIMEOUT SYSTEM - INCOMPLETE
- [ ] Add global variable: `let timeoutsCount = { team1: 0, team2: 0 };`
- [ ] Add `directTimeout()` function
- [ ] Add `selectTimeoutTeam(team)` function
- [ ] Implement `showTimeoutTimer(team, teamName)` with:
  - [ ] 30-second countdown display
  - [ ] Remaining timeouts display
  - [ ] Visual timer (large number)
  - [ ] End timer button
- [ ] Add `resetTimeoutsForNewSet()` function
- [ ] Update addTimeout() to enforce 2-timeout limit per set per team
- [ ] Add timeout counter display to mobile header (Équipe: X/2)
- [ ] Update showHistory() to show timeout count before deletion
- [ ] Update deleteHistoryEntry() to restore timeout count when timeout is deleted
- [ ] Add "⏸️ Temps mort" button to action grid with team selection

### 3. HISTORY MANAGEMENT - INCOMPLETE
- [ ] Implement full `deleteHistoryEntry(index)` function with:
  - [ ] Context-specific confirmation messages:
    - "Supprimer ce point ?" for rallies
    - "Supprimer ce timeout ?" for timeouts
    - "Supprimer ce carton ?" for cards
    - "Supprimer ce changement ?" for substitutions
  - [ ] Score restoration logic
  - [ ] Timeout restoration logic
  - [ ] Card removal logic
  - [ ] Player composition restoration for substitutions
- [ ] Enhance `undoLast()` to use `deleteHistoryEntry()` for last entry
- [ ] Create history modal view showing all entries with delete buttons
- [ ] Ensure matchStats.rallies array supports all action types
- [ ] Update history display to include deletion capability

---

## HIGH PRIORITY ISSUES

### 4. DIRECT ACTIONS - INCOMPLETE
- [ ] Add `directCard()` function (see Card System above)
- [ ] Add `directTimeout()` function (see Timeout System above)
- [ ] Add `directSubstitution()` wrapper function
- [ ] Update action grid section in UI with missing buttons:
  - [ ] Add "🟨🟥 Carton" button
  - [ ] Add "⏸️ Temps mort" button with team selection modal
  - [ ] Add "🔄 Changement" button

### 5. SET MANAGEMENT - INCOMPLETE
- [ ] Implement complete `nextSet()` function with:
  - [ ] Save current set score
  - [ ] Reset scores to 0
  - [ ] Update currentSet number
  - [ ] Reset service selection (prompt for new service team)
  - [ ] Call `resetTimeoutsForNewSet()`
  - [ ] Show positioning modal for new set
  - [ ] Clear court selection highlighting
  - [ ] Update all displays
- [ ] Ensure set transitions trigger court repositioning
- [ ] Add "Next Set" button to UI or menu
- [ ] Handle set completion logic (best of 3, best of 5, etc.)

### 6. SUBSTITUTION - MEDIUM PRIORITY
- [ ] Add `directSubstitution()` wrapper function
- [ ] Enhance UI to add substitution to quick actions
- [ ] Ensure player composition restoration on deletion

---

## MEDIUM PRIORITY ISSUES

### 7. SET TRANSITIONS & COURT MANAGEMENT
- [ ] Verify court composition resets properly between sets
- [ ] Ensure service selection resets between sets
- [ ] Add "Prochaine manche" button or menu option

### 8. DATA CONSISTENCY
- [ ] Ensure all rally types are properly recorded:
  - [ ] `type: 'service'` with result
  - [ ] `type: 'reception'` with quality
  - [ ] `type: 'our_attack'` with result
  - [ ] `type: 'our_block'` with result
  - [ ] `type: 'our_dig'` with result
  - [ ] `type: 'their_attack'` with result
  - [ ] `type: 'direct_point'` with result
  - [ ] `type: 'timeout'` with team
  - [ ] `type: 'substitution'` with playerOut, playerIn, position
  - [ ] `type: 'card'` with team, color

---

## LOW PRIORITY ISSUES (Can wait)

### 9. PLAYER STATISTICS DISPLAY
- [ ] Add player stat cards display (if needed for mobile)
- [ ] Create detailed statistics view
- [ ] Add player-specific stat modal
- Note: Data structure already exists, just need UI

### 10. ADVANCED FEATURES
- [ ] Set history compact display
- [ ] Detailed rally breakdown
- [ ] Advanced analytics

---

## FUNCTION REFERENCE

### Functions needed from control.html

#### Timeout Functions
```javascript
let timeoutsCount = { team1: 0, team2: 0 };

function directTimeout() { }
function selectTimeoutTeam(team) { }
function showTimeoutTimer(team, teamName) { }
function resetTimeoutsForNewSet() { }
```

#### Card Functions
```javascript
function directCard() { }
function validateCard() { }
function updateCardTeamSelection() { }
function updateCardColorSelection() { }
function closeCardModal() { }
function checkCardValidation() { }
```

#### History Functions
```javascript
function deleteHistoryEntry(index) { }
function undoLastRally() { }
function undoLastAction() { }
```

#### Set Management
```javascript
function nextSet() { }
```

#### Direct Actions
```javascript
function directPoint(team) { } // Already exists but may need enhancement
function directSubstitution() { }
```

---

## TESTING CHECKLIST

After implementing each phase:

### Phase 1: Card System
- [ ] Card modal opens when button clicked
- [ ] Can select team (Us/Them)
- [ ] Can select card color (Yellow/Red)
- [ ] Can't validate without both selections
- [ ] Cards appear in history
- [ ] Cards can be deleted
- [ ] Correct team/color displays in history

### Phase 2: Timeout System
- [ ] Timeout counter displays correctly (0/2)
- [ ] Can add timeout for own team
- [ ] Timer shows 30-second countdown
- [ ] Timer disappears after 30 seconds
- [ ] Can't add more than 2 timeouts per set
- [ ] Timeouts reset when new set starts
- [ ] Can undo timeout (counter increments back)

### Phase 3: History Management
- [ ] Delete button appears for each history entry
- [ ] Correct confirmation message shows
- [ ] Deleting point reverts score
- [ ] Deleting timeout restores timeout count
- [ ] Deleting card removes it from history
- [ ] Deleting substitution restores player positions

### Phase 4: Direct Actions
- [ ] All 5 direct action buttons visible
- [ ] Each button opens correct modal/dialog
- [ ] Cards can be recorded from card button
- [ ] Timeouts can be recorded from timeout button
- [ ] Substitutions can be recorded from substitution button

### Phase 5: Set Management
- [ ] New set button works
- [ ] Scores reset to 0
- [ ] Set number increments
- [ ] Positioning modal shows
- [ ] Service is reset (re-prompted)
- [ ] Timeouts reset (0/2)

---

## ESTIMATED EFFORT

| Phase | Feature | Effort | Priority |
|-------|---------|--------|----------|
| 1 | Card System | 3-4 hours | CRITICAL |
| 2 | Timeout System | 2-3 hours | HIGH |
| 3 | History Management | 2-3 hours | HIGH |
| 4 | Direct Actions | 1 hour | HIGH |
| 5 | Set Management | 2 hours | MEDIUM |
| 6 | Player Stats UI | 2-3 hours | LOW |

**Total estimated effort: 12-18 hours**

---

## FILES TO MODIFY

1. `/Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard/control_mobile.html`
   - Add all missing functions
   - Add missing modal structures
   - Add missing UI buttons
   - Update matchStats data handling
   - Update history display logic

2. `/Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard/script.js`
   - May need updates if set management is shared
   - Verify timeout reset logic if shared

---

## NOTES

- Mobile already has good basic structure
- Positioning modal is complete
- Rally workflow is complete
- Timeout and card systems are the biggest gaps
- History management needs enhancement for all action types
- Consider creating helper functions for code reuse
