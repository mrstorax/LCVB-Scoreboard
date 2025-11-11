# Feature Comparison: control.html vs control_mobile.html

## EXECUTIVE SUMMARY
`control.html` is a comprehensive desktop/tablet scoreboard with advanced features, while `control_mobile.html` is a simplified mobile version. Significant synchronization is needed to achieve feature parity.

---

## 1. TIMEOUT SYSTEM

### control.html Features
- **Per-team timeout counter**: Tracks up to 2 timeouts per team per set
- **Global variable**: `timeoutsCount = { team1: 0, team2: 0 }`
- **Functions**:
  - `directTimeout()` - Quick timeout button in direct actions
  - `selectTimeoutTeam(team)` - Allows choosing which team takes timeout
  - `showTimeoutTimer(team, teamName)` - Displays 30-second timer
  - `updateCompactDisplay()` - Updates timeout counter display
  - `resetTimeoutsForNewSet()` - Resets counters when set changes
- **Display**: Shows "Équipe 1: 0/2" format
- **Timer**: 30-second countdown before returning to normal play
- **Restrictions**: Prevents teams from using more than 2 timeouts per set

### control_mobile.html Features
- **Basic timeout**: `addTimeout(team)` function exists
- **No counter tracking**: Does not track remaining timeouts per team
- **No 2-timeout limit**: No enforcement of maximum timeouts
- **No timer**: Simply logs timeout to matchStats without visual timer
- **Missing**: 
  - Timeout counter display
  - Visual 30-second timer
  - Per-set timeout limit enforcement
  - Direct timeout button (`directTimeout()`)

### SYNC NEEDED
**Mobile needs to add**:
1. Global `timeoutsCount` variable initialization
2. `directTimeout()` function for quick access
3. `showTimeoutTimer(team, teamName)` function with 30-second display
4. `selectTimeoutTeam(team)` function to choose team
5. `resetTimeoutsForNewSet()` function
6. Update mobile header to display timeout counter
7. Add timeout counter display to UI

---

## 2. CARD SYSTEM (Yellow/Red Cards)

### control.html Features
- **Complete card system**:
  - Yellow cards (🟨 Carton Jaune)
  - Red cards (🟥 Carton Rouge)
- **Functions**:
  - `directCard()` - Quick access button for cards
  - `validateCard()` - Records selected team and card color
  - `updateCardTeamSelection()` - Select team for card
  - `updateCardColorSelection()` - Select yellow or red
  - `closeCardModal()` - Close card selection dialog
  - `checkCardValidation()` - Validate selections
- **Team-specific cards**: Shows which team received the card
- **History tracking**: Cards appear in match history with deletion capability
- **Data structure**: Records as `{ type: 'card', team, color: 'jaune'|'rouge' }`

### control_mobile.html Features
- **No card system**: Completely absent
- **Missing**:
  - No `directCard()` function
  - No card selection modal
  - No yellow/red card distinction
  - No card tracking in matchStats
  - No card UI buttons

### SYNC NEEDED
**Mobile needs to add**:
1. `directCard()` function
2. Card selection modal with team and color options
3. `validateCard()` function
4. `updateCardTeamSelection()` helper
5. `updateCardColorSelection()` helper
6. `closeCardModal()` helper
7. `checkCardValidation()` helper
8. Add "🟨🟥 Carton" button to action grid
9. Update matchStats data structure to include card actions
10. Update history display to show cards

---

## 3. CLEAR COURT / NEW SET FUNCTIONALITY

### control.html Features
- **Complete set management**:
  - `nextSet()` function handles set transitions
  - Automatic court repositioning prompt when new set starts
  - Resets timeouts for new set
  - Resets service selection
  - Updates set display
  - Shows positioning modal for new set configuration
- **Data handling**: 
  - Updates `data.currentSet`
  - Stores set scores in `data.team1.sets[]` and `data.team2.sets[]`
  - Resets individual set scores to 0

### control_mobile.html Features
- **Minimal set handling**: 
  - No dedicated `nextSet()` function
  - Relies on script.js (external) for set management
  - Does show positioning modal but doesn't explicitly manage set transitions
  - Missing explicit set reset logic

### SYNC NEEDED
**Mobile needs to add**:
1. Complete `nextSet()` function
2. `resetTimeoutsForNewSet()` function
3. Logic to reset service selection
4. Logic to reset court composition for new set
5. Proper set number management
6. Display update for set transitions
7. Modal trigger for repositioning players

---

## 4. HISTORY MANAGEMENT & DELETION

### control.html Features
- **Delete individual entries**: `deleteHistoryEntry(index)` function
- **Delete confirmation**: Shows context-specific confirmation messages
- **Undo actions**:
  - `undoLastRally()` - Undo last point
  - `undoLastAction()` - Undo last action
  - `undoAction()` - Wrapper function
- **History display**: Detailed modal showing all rallies with delete buttons
- **Different deletion messages** based on rally type:
  - Points: "Supprimer ce point?"
  - Timeouts: "Supprimer ce timeout?"
  - Cards: "Supprimer ce carton?"
  - Substitutions: "Supprimer ce changement?"
- **Data restoration** on delete:
  - Reverts score changes
  - Returns timeouts to teams
  - Removes cards from records
  - Restores player composition

### control_mobile.html Features
- **Simple undo**: `undoLast()` function exists
- **Basic score reversion**: Decrements team scores by 1
- **No history deletion**: No individual entry deletion
- **No detailed undo**: Simply removes last rally without full restoration
- **Limitations**:
  - Doesn't restore timeouts used
  - Doesn't restore cards issued
  - Doesn't handle all action types
  - No history modal view

### SYNC NEEDED
**Mobile needs to add**:
1. Full `deleteHistoryEntry(index)` function
2. History modal with delete buttons for each entry
3. Proper data restoration logic:
   - Restore timeouts when timeout deleted
   - Remove cards when card deleted
   - Restore player composition when substitution deleted
4. Context-specific deletion confirmation messages
5. Update `undoLast()` to call `deleteHistoryEntry()` for last entry
6. Full history display modal
7. Better `undoLastRally()` implementation

---

## 5. DIRECT ACTIONS (Quick Buttons)

### control.html Features
- **Quick action buttons**:
  - `directPoint('us')` - Direct point for our team
  - `directPoint('them')` - Direct point for their team
  - `directCard()` - Give card
  - `directTimeout()` - Take timeout
  - `directSubstitution()` - Make substitution
- **All in one dedicated section** with clear labels
- **Service change handling** included

### control_mobile.html Features
- **Limited direct actions**:
  - `directPoint('us')` - Our direct point
  - `directPoint('them')` - Their direct point
  - `addTimeout('us')` - Only our team timeout
- **Missing**:
  - `directCard()` - Not implemented
  - `directTimeout()` - Not as direct action
  - `directSubstitution()` - Not directly accessible
  - No direct `addTimeout('them')` option

### SYNC NEEDED
**Mobile needs to add**:
1. `directCard()` function
2. `directTimeout()` function (with team selection)
3. `directSubstitution()` function
4. Update action grid to show all direct actions
5. Add "🟨🟥 Carton" button
6. Add "⏸️ Timeout" button for teams selection
7. Add "🔄 Changement" button for substitutions

---

## 6. SUBSTITUTION HANDLING

### control.html Features
- **Advanced substitution**:
  - `directSubstitution()` - Quick substitution button
  - Full modal dialog for player selection
  - Shows players on court vs. substitutes
  - Records who came out and who came in
  - Tracks position changes
  - Updates court composition

### control_mobile.html Features
- **Basic substitution**:
  - `showSubstitutionModal()` function exists
  - Modal UI for selecting player to replace and replacement
  - Updates court composition
  - Records substitution in matchStats
- **Missing**:
  - `directSubstitution()` quick action
  - No direct access button in quick actions

### SYNC NEEDED
**Mobile needs to add**:
1. `directSubstitution()` wrapper function
2. Add substitution to quick actions section
3. Possibly enhance UI to match control.html

---

## 7. POSITION MANAGEMENT & LIBERO

### control.html Features
- **Positioning modal** (external in script.js)
- **Libero management** support
- **Player rotation** tracking

### control_mobile.html Features
- **Full positioning modal** with:
  - Step 1: 6-player positioning
  - Step 2: Optional libero selection
  - Player list with selection UI
  - Validation before start
- **Libero options**: Can choose no libero or select available libero

### SYNC ASSESSMENT
Both have complete positioning. Desktop's external implementation appears sufficient.

---

## 8. WORKFLOW/RALLY MANAGEMENT

### control.html Features
- **Complete rally workflow** (in external script.js):
  - Service
  - Reception
  - Attack
  - Block
  - Defense
  - Full action chain

### control_mobile.html Features
- **Complete rally workflow** with all actions:
  - Service result
  - Reception quality
  - Attack options
  - Block selection
  - Defense
  - Full action tracking

### SYNC ASSESSMENT
Both have equivalent functionality. Mobile appears complete for rally workflow.

---

## 9. STATISTICS & PLAYER CARDS

### control.html Features
- **Detailed player statistics**:
  - Services (total, aces, faults)
  - Receptions (perfect, average, failed)
  - Attacks (points, blocked, out, net)
  - Blocks (points, touched)
  - Digs (recoveries)
  - Assists
- **Team summary statistics**
- **Player stat cards** displayed
- **Historical stats** with deletion capability

### control_mobile.html Features
- **Basic player stats**:
  - `updatePlayerStats()` function with core stats
  - Services, receptions, attacks, blocks, digs, assists
- **Missing**: 
  - Detailed stat display UI
  - Player stat cards

### SYNC ASSESSMENT
Both have equivalent underlying stats logic. Mobile lacks display UI but data structure is there.

---

## 10. DISPLAY & UI COMPONENTS

### control.html Features
- **Compact display**: Timeout and set history counters
- **Status indicators**: Service selection, set progress
- **Team name headers**
- **Score display with team info**

### control_mobile.html Features
- **Mobile header** with:
  - Team names and scores
  - Sets display
  - Quick action buttons (History, Undo, Menu)
  - Serving indicator (lightning bolt)
- **Court display** with player positions
- **Quick actions section** with buttons
- **Recent actions list**

### SYNC ASSESSMENT
Both have good UI. Mobile is better designed for touch.

---

## SUMMARY TABLE

| Feature | control.html | control_mobile.html | Sync Priority |
|---------|-------------|-------------------|----------------|
| Timeout System | Complete (2 per team) | Basic | **HIGH** |
| Timeout Counter | Yes (0/2) | No | HIGH |
| Timeout Timer | 30-second | No | HIGH |
| Card System | Complete (Y/R) | Missing | **CRITICAL** |
| Direct Card | Yes | No | CRITICAL |
| Set Management | Complete | Minimal | **HIGH** |
| History Deletion | Full | Basic | **HIGH** |
| Undo Last Action | Multiple types | Simple | HIGH |
| Direct Actions | 5 buttons | 2 buttons | **HIGH** |
| Substitution | Complete | Good | MEDIUM |
| Positioning | Complete | Complete | OK |
| Rally Workflow | Complete | Complete | OK |
| Player Stats | Full display | Data only | LOW |

---

## RECOMMENDED SYNC ORDER

1. **Phase 1 (Critical)**: Card System
   - Add card modal
   - Add directCard() function
   - Update history to show cards

2. **Phase 2 (High)**: Timeout System
   - Add timeout counter
   - Add timer display
   - Add per-team enforcement

3. **Phase 3 (High)**: History Management
   - Full deleteHistoryEntry() implementation
   - Complete data restoration
   - History modal view

4. **Phase 4 (High)**: Direct Actions
   - Add missing direct action buttons
   - Complete action section

5. **Phase 5 (Medium)**: Set Management
   - Add nextSet() function
   - Proper set transitions

6. **Phase 6 (Low)**: Player Stats Display
   - Add stat cards UI (if needed for mobile)

