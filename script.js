// LCVB Scoreboard - Script de gestion localStorage
// Communication entre index.html et control.html via localStorage

// Structure des données stockées dans localStorage
const DEFAULT_SCORE_DATA = {
    team1: {
        name: "Le Crès Volley-Ball",
        logo: "logos/logo-lcvb.png",
        niveau: "",
        score: 0,
        sets: [0, 0, 0, 0, 0] // Scores pour les 5 sets possibles
    },
    team2: {
        name: "Équipe 2",
        logo: "logos/logo-equipe2.png",
        niveau: "",
        score: 0,
        sets: [0, 0, 0, 0, 0]
    },
    currentSet: 1,
    maxSets: 5,
    showLogos: true, // Afficher les logos par défaut
    matchAmical: false, // Match amical commun aux deux équipes
    template: 'actuel', // Template par défaut : 'actuel', 'neutre', 'sobre', 'pro', 'custom'
    customColors: {
        primary: '#E91E63',           // Scores, bordures, accents principaux
        secondary: '#FF69B4',          // Niveaux, accents clairs
        background: '#000000',         // Fond principal
        backgroundSecondary: '#0f0f0f', // Fond secondaire (pour gradients)
        text: '#FFFFFF',               // Texte principal
        setActive: '#E91E63'           // Couleur des sets actifs/gagnés
    },
    savedConfigs: {}, // Configurations sauvegardées : { "Nom config": { customColors: {...}, template: 'custom' }, ... }
    history: [], // Historique des actions pour undo : [{ action: 'updateScore', team: 'team1', oldValue: {...}, newValue: {...}, timestamp: ... }, ...]
    historyIndex: -1, // Index actuel dans l'historique (-1 = pas d'historique)
    matchInfo: {
        date: '', // Date du match (format: YYYY-MM-DD)
        time: '', // Heure du match (format: HH:MM)
        location: '', // Lieu du match
        competition: '', // Compétition (ex: "Championnat", "Coupe", etc.)
        referee: '', // Nom de l'arbitre
        notes: '' // Notes supplémentaires
    },
    timers: {
        match: {
            startTime: null, // Timestamp de démarrage
            pausedTime: 0, // Temps accumulé en pause (en ms)
            isRunning: false, // État du chronomètre
            isPaused: false // Si le chronomètre est en pause
        },
        sets: [
            // Un chronomètre par set (5 sets max)
            { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            { startTime: null, pausedTime: 0, isRunning: false, isPaused: false }
        ]
    }
};

// Fonction pour initialiser les données si elles n'existent pas
function initScoreData() {
    if (!localStorage.getItem('lcvb_score')) {
        localStorage.setItem('lcvb_score', JSON.stringify(DEFAULT_SCORE_DATA));
    }
}

// Fonction pour récupérer les données du score
function getScoreData() {
    initScoreData();
    
    // Essayer de lire depuis le fichier JSON d'abord (pour OBS)
    try {
        // Cette fonction sera appelée depuis index.html qui lit le fichier JSON
        if (window.scoreDataFromFile && window.scoreDataFromFile.lastUpdate) {
            const fileData = window.scoreDataFromFile;
            const localStorageData = JSON.parse(localStorage.getItem('lcvb_score') || '{}');
            // Si le fichier est plus récent, utiliser le fichier
            if (fileData.lastUpdate > (localStorageData.lastUpdate || 0)) {
                return fileData;
            }
        }
    } catch(e) {
        // Ignore si la lecture du fichier échoue
    }
    
    // Fallback sur localStorage
    return JSON.parse(localStorage.getItem('lcvb_score'));
}

// Fonction pour sauvegarder les données du score
function saveScoreData(data) {
    // Ajouter un timestamp pour forcer la détection des changements
    data.lastUpdate = Date.now();
    // Incrémenter un compteur de version si pas déjà fait
    if (!data.version) {
        data.version = 0;
    }
    if (!data._saveCount) {
        data._saveCount = 0;
    }
    data._saveCount = (data._saveCount || 0) + 1;
    // Ajouter un identifiant unique pour forcer la détection dans OBS
    data._uniqueId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('lcvb_score', JSON.stringify(data));
    
    // NOUVELLE MÉTHODE : Si on est sur un serveur local, envoyer au serveur
    try {
        // Détecter si on est sur localhost (serveur local)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            fetch('/update-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).catch(e => {
                // Ignore si le serveur n'est pas disponible
            });
        }
    } catch(e) {
        // Ignore les erreurs
    }
    
    // TÉLÉCHARGEMENT AUTOMATIQUE : Pour usage sans serveur (fichier local)
    // Télécharge automatiquement dans le dossier data/
    if (window.location.protocol === 'file:' || 
        (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
        // Utiliser un throttle pour éviter trop de téléchargements
        if (!window.lastDownloadTime) {
            window.lastDownloadTime = 0;
        }
        const now = Date.now();
        // Limiter à 1 téléchargement par seconde maximum
        if (now - window.lastDownloadTime > 1000) {
            try {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data/score-data.json'; // Télécharge directement dans data/
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                window.lastDownloadTime = now;
            } catch(e) {
                // Ignore si le téléchargement échoue
            }
        }
    }
    
    // Fallback : Télécharger le fichier si explicitement demandé (bouton manuel)
    if (window.shouldDownloadScoreData) {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data/score-data.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            window.shouldDownloadScoreData = false;
        } catch(e) {
            // Ignore si le téléchargement échoue
        }
    }
    
    // Déclencher un événement personnalisé pour forcer la mise à jour
    try {
        window.dispatchEvent(new CustomEvent('lcvb_score_update', { detail: data }));
    } catch(e) {
        // Ignore si l'événement ne peut pas être déclenché
    }
}

// Fonction pour ajouter une action à l'historique
function addToHistory(action, oldValue, newValue, metadata = {}) {
    const data = getScoreData();
    if (!data.history) {
        data.history = [];
        data.historyIndex = -1;
    }
    
    // Supprimer les actions après l'index actuel si on fait une nouvelle action après un undo
    if (data.historyIndex < data.history.length - 1) {
        data.history = data.history.slice(0, data.historyIndex + 1);
    }
    
    // Ajouter la nouvelle action
    const historyEntry = {
        action: action,
        oldValue: JSON.parse(JSON.stringify(oldValue)), // Deep copy
        newValue: JSON.parse(JSON.stringify(newValue)), // Deep copy
        timestamp: Date.now(),
        ...metadata
    };
    
    data.history.push(historyEntry);
    data.historyIndex = data.history.length - 1;
    
    // Limiter l'historique à 50 actions maximum
    if (data.history.length > 50) {
        data.history.shift();
        data.historyIndex = data.history.length - 1;
    }
    
    // Ne pas sauvegarder ici, sera fait par la fonction appelante
    return data;
}

// Fonction pour annuler la dernière action
function undoLastAction() {
    const data = getScoreData();
    if (!data.history || data.history.length === 0 || data.historyIndex < 0) {
        return null; // Pas d'historique ou déjà au début
    }
    
    const lastAction = data.history[data.historyIndex];
    
    // Restaurer l'ancienne valeur
    const restoredData = JSON.parse(JSON.stringify(lastAction.oldValue));
    
    // Mettre à jour les données avec l'ancienne valeur
    Object.assign(data, restoredData);
    
    // Décrémenter l'index
    data.historyIndex--;
    
    // Sauvegarder
    saveScoreData(data);
    
    return data;
}

// Fonction pour mettre à jour le score d'une équipe
function updateScore(team, delta) {
    const data = getScoreData();
    const oldData = JSON.parse(JSON.stringify(data)); // Sauvegarder l'état avant
    const newScore = Math.max(0, data[team].score + delta);
    
    // Vérifier si c'est le premier point du match (les deux équipes étaient à 0)
    const wasFirstPointOfMatch = data.team1.score === 0 && data.team2.score === 0 && newScore > 0 && delta > 0;
    
    // Vérifier si c'est le premier point du set actuel
    // (les scores du set actuel dans l'historique sont à 0 ET les scores actuels étaient à 0)
    const currentSetIndex = data.currentSet - 1;
    const setScore1 = data.team1.sets[currentSetIndex] || 0;
    const setScore2 = data.team2.sets[currentSetIndex] || 0;
    const wasFirstPointOfSet = (setScore1 === 0 && setScore2 === 0 && 
                                 data.team1.score === 0 && data.team2.score === 0 && 
                                 newScore > 0 && delta > 0);
    
    data[team].score = newScore;
    
    // Initialiser les timers si nécessaire
    if (!data.timers) {
        data.timers = {
            match: { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            sets: Array(5).fill(null).map(() => ({ startTime: null, pausedTime: 0, isRunning: false, isPaused: false }))
        };
    }
    
    // Démarrer automatiquement le chronomètre du match au premier point du match
    if (wasFirstPointOfMatch && !data.timers.match.isRunning) {
        data.timers.match.startTime = Date.now();
        data.timers.match.isRunning = true;
        data.timers.match.isPaused = false;
        data.timers.match.pausedTime = 0;
    }
    
    // Démarrer automatiquement le chronomètre du set au premier point du set
    if (wasFirstPointOfSet && currentSetIndex >= 0 && currentSetIndex < 5) {
        const timer = data.timers.sets[currentSetIndex];
        if (!timer.isRunning) {
            timer.startTime = Date.now();
            timer.isRunning = true;
            timer.isPaused = false;
            timer.pausedTime = 0;
        }
    }
    
    // Ajouter à l'historique
    addToHistory('updateScore', oldData, data, { team: team, delta: delta });
    
    saveScoreData(data);
    return data;
}

// Fonction pour mettre à jour le set d'une équipe
function updateSet(team, setIndex, delta) {
    const data = getScoreData();
    const oldData = JSON.parse(JSON.stringify(data)); // Sauvegarder l'état avant
    const currentSetIndex = data.currentSet - 1;
    const newSetScore = Math.max(0, data[team].sets[setIndex] + delta);
    data[team].sets[setIndex] = newSetScore;
    
    // Ajouter à l'historique
    addToHistory('updateSet', oldData, data, { team: team, setIndex: setIndex, delta: delta });
    
    saveScoreData(data);
    return data;
}

// Fonction pour changer le set actuel
function changeSet(setNumber) {
    const data = getScoreData();
    if (setNumber >= 1 && setNumber <= data.maxSets) {
        const oldData = JSON.parse(JSON.stringify(data)); // Sauvegarder l'état avant
        data.currentSet = setNumber;
        
        // Ajouter à l'historique
        addToHistory('changeSet', oldData, data, { setNumber: setNumber });
        
        saveScoreData(data);
    }
    return data;
}

// Fonction pour passer au set suivant
function nextSet() {
    const data = getScoreData();
    const oldData = JSON.parse(JSON.stringify(data)); // Sauvegarder l'état avant
    const currentSetIndex = data.currentSet - 1;
    
    // Arrêter le chronomètre du set actuel
    if (data.timers && data.timers.sets[currentSetIndex]) {
        stopSetTimer(currentSetIndex);
    }
    
    // Sauvegarder les scores finaux du set actuel
    data.team1.sets[currentSetIndex] = data.team1.score;
    data.team2.sets[currentSetIndex] = data.team2.score;
    
    // Passer au set suivant si possible
    if (data.currentSet < data.maxSets) {
        data.currentSet += 1;
        // Réinitialiser les scores du nouveau set
        data.team1.score = 0;
        data.team2.score = 0;
        
        // Réinitialiser le chronomètre du nouveau set (il démarrera automatiquement au premier point)
        resetSetTimer(data.currentSet - 1);
    }
    
    // Ajouter à l'historique
    addToHistory('nextSet', oldData, data);
    
    saveScoreData(data);
    return data;
}

// Fonction pour réinitialiser le set actuel
function resetCurrentSet() {
    const data = getScoreData();
    data.team1.score = 0;
    data.team2.score = 0;
    
    // Réinitialiser le chronomètre du set actuel
    const currentSetIndex = data.currentSet - 1;
    resetSetTimer(currentSetIndex);
    
    saveScoreData(data);
    return data;
}

// Fonction pour réinitialiser complètement (match entier)
function resetAll() {
    // Réinitialiser les chronomètres avant de réinitialiser tout
    const data = getScoreData();
    if (data.timers) {
        resetMatchTimer();
        for (let i = 0; i < 5; i++) {
            resetSetTimer(i);
        }
    }
    
    localStorage.setItem('lcvb_score', JSON.stringify(DEFAULT_SCORE_DATA));
    return DEFAULT_SCORE_DATA;
}

// Fonction pour mettre à jour le nom d'une équipe
function updateTeamName(team, name) {
    const data = getScoreData();
    const oldData = JSON.parse(JSON.stringify(data)); // Sauvegarder l'état avant
    data[team].name = name;
    
    // Ajouter à l'historique
    addToHistory('updateTeamName', oldData, data, { team: team, name: name });
    
    saveScoreData(data);
    return data;
}

// Fonction pour mettre à jour le logo d'une équipe
function updateTeamLogo(team, logoPath) {
    const data = getScoreData();
    data[team].logo = logoPath;
    saveScoreData(data);
    return data;
}

// Fonction pour mettre à jour le niveau d'une équipe
function updateTeamNiveau(team, niveau) {
    const data = getScoreData();
    data[team].niveau = niveau;
    saveScoreData(data);
    return data;
}

// Fonction pour mettre à jour le flag "Match amical" (commun aux deux équipes)
function updateMatchAmicalCommon(isAmical) {
    const data = getScoreData();
    data.matchAmical = isAmical;
    saveScoreData(data);
    return data;
}

// Fonction pour toggle l'affichage des logos
function toggleShowLogos() {
    const data = getScoreData();
    data.showLogos = !data.showLogos;
    saveScoreData(data);
    return data;
}

// Fonction pour mettre à jour les informations du match
function updateMatchInfo(field, value) {
    const data = getScoreData();
    if (!data.matchInfo) {
        data.matchInfo = {
            date: '',
            time: '',
            location: '',
            competition: '',
            referee: '',
            notes: ''
        };
    }
    data.matchInfo[field] = value;
    saveScoreData(data);
    return data;
}

// ========== FONCTIONS CHRONOMÈTRES ==========

// Fonction pour démarrer le chronomètre du match
function startMatchTimer(dataToUse = null) {
    const data = dataToUse || getScoreData();
    if (!data.timers) {
        data.timers = {
            match: { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            sets: Array(5).fill(null).map(() => ({ startTime: null, pausedTime: 0, isRunning: false, isPaused: false }))
        };
    }
    if (!data.timers.match.isRunning && !data.timers.match.isPaused) {
        // Nouveau démarrage
        data.timers.match.startTime = Date.now();
        data.timers.match.isRunning = true;
        data.timers.match.isPaused = false;
        data.timers.match.pausedTime = 0;
        if (!dataToUse) {
            saveScoreData(data);
        }
    } else if (data.timers.match.isPaused) {
        // Reprendre après une pause
        const elapsedBeforePause = data.timers.match.pausedTime - data.timers.match.startTime;
        data.timers.match.startTime = Date.now() - elapsedBeforePause;
        data.timers.match.isRunning = true;
        data.timers.match.isPaused = false;
        if (!dataToUse) {
            saveScoreData(data);
        }
    }
    return data;
}

// Fonction pour arrêter/pause le chronomètre du match
function stopMatchTimer() {
    const data = getScoreData();
    if (data.timers && data.timers.match && data.timers.match.isRunning) {
        // Sauvegarder le temps écoulé jusqu'à maintenant
        const elapsed = Date.now() - data.timers.match.startTime;
        data.timers.match.pausedTime = data.timers.match.startTime + elapsed;
        data.timers.match.isRunning = false;
        data.timers.match.isPaused = true;
        saveScoreData(data);
    }
    return data;
}

// Fonction pour réinitialiser le chronomètre du match
function resetMatchTimer() {
    const data = getScoreData();
    if (!data.timers) {
        data.timers = {
            match: { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            sets: Array(5).fill(null).map(() => ({ startTime: null, pausedTime: 0, isRunning: false, isPaused: false }))
        };
    }
    data.timers.match = { startTime: null, pausedTime: 0, isRunning: false, isPaused: false };
    saveScoreData(data);
    return data;
}

// Fonction pour obtenir le temps écoulé du match (en millisecondes)
function getMatchElapsedTime() {
    const data = getScoreData();
    if (!data.timers || !data.timers.match) {
        return 0;
    }
    const timer = data.timers.match;
    if (!timer.startTime) {
        return 0;
    }
    if (timer.isRunning) {
        return Date.now() - timer.startTime;
    } else if (timer.isPaused && timer.pausedTime) {
        // Temps écoulé jusqu'à la pause
        return timer.pausedTime - timer.startTime;
    }
    return 0;
}

// Fonction pour formater le temps du match (HH:MM:SS)
function formatMatchTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Fonction pour démarrer le chronomètre d'un set
function startSetTimer(setIndex, dataToUse = null) {
    const data = dataToUse || getScoreData();
    if (!data.timers) {
        data.timers = {
            match: { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            sets: Array(5).fill(null).map(() => ({ startTime: null, pausedTime: 0, isRunning: false, isPaused: false }))
        };
    }
    if (setIndex >= 0 && setIndex < 5) {
        const timer = data.timers.sets[setIndex];
        if (!timer.isRunning && !timer.isPaused) {
            // Nouveau démarrage
            timer.startTime = Date.now();
            timer.isRunning = true;
            timer.isPaused = false;
            timer.pausedTime = 0;
            if (!dataToUse) {
                saveScoreData(data);
            }
        } else if (timer.isPaused) {
            // Reprendre après une pause
            const elapsedBeforePause = timer.pausedTime - timer.startTime;
            timer.startTime = Date.now() - elapsedBeforePause;
            timer.isRunning = true;
            timer.isPaused = false;
            if (!dataToUse) {
                saveScoreData(data);
            }
        }
    }
    return data;
}

// Fonction pour arrêter/pause le chronomètre d'un set
function stopSetTimer(setIndex) {
    const data = getScoreData();
    if (data.timers && setIndex >= 0 && setIndex < 5) {
        const timer = data.timers.sets[setIndex];
        if (timer && timer.isRunning) {
            // Sauvegarder le temps écoulé jusqu'à maintenant
            const elapsed = Date.now() - timer.startTime;
            timer.pausedTime = timer.startTime + elapsed;
            timer.isRunning = false;
            timer.isPaused = true;
            saveScoreData(data);
        }
    }
    return data;
}

// Fonction pour réinitialiser le chronomètre d'un set
function resetSetTimer(setIndex) {
    const data = getScoreData();
    if (!data.timers) {
        data.timers = {
            match: { startTime: null, pausedTime: 0, isRunning: false, isPaused: false },
            sets: Array(5).fill(null).map(() => ({ startTime: null, pausedTime: 0, isRunning: false, isPaused: false }))
        };
    }
    if (setIndex >= 0 && setIndex < 5) {
        data.timers.sets[setIndex] = { startTime: null, pausedTime: 0, isRunning: false, isPaused: false };
        saveScoreData(data);
    }
    return data;
}

// Fonction pour obtenir le temps écoulé d'un set (en millisecondes)
function getSetElapsedTime(setIndex) {
    const data = getScoreData();
    if (!data.timers || setIndex < 0 || setIndex >= 5) {
        return 0;
    }
    const timer = data.timers.sets[setIndex];
    if (!timer || !timer.startTime) {
        return 0;
    }
    if (timer.isRunning) {
        return Date.now() - timer.startTime;
    } else if (timer.isPaused && timer.pausedTime) {
        // Temps écoulé jusqu'à la pause
        return timer.pausedTime - timer.startTime;
    }
    return 0;
}

// Fonction pour formater le temps d'un set (MM:SS)
function formatSetTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Fonction pour écouter les changements de localStorage (pour index.html)
// Note: Cette fonction est dépréciée, utilisez directement setInterval dans index.html
function watchScoreChanges(callback) {
    // Écouter les événements storage (seulement pour les changements depuis d'autres fenêtres/onglets)
    window.addEventListener('storage', (e) => {
        if (e.key === 'lcvb_score') {
            callback();
        }
    });
}

// Export pour utilisation dans les deux pages HTML
if (typeof window !== 'undefined') {
    window.LCVBScoreboard = {
        initScoreData,
        getScoreData,
        saveScoreData,
        updateScore,
        updateSet,
        changeSet,
        nextSet,
        resetCurrentSet,
        resetAll,
        updateTeamName,
        updateTeamLogo,
        updateTeamNiveau,
        updateMatchAmicalCommon,
        toggleShowLogos,
        watchScoreChanges,
        addToHistory,
        undoLastAction,
        updateMatchInfo,
        startMatchTimer,
        stopMatchTimer,
        resetMatchTimer,
        getMatchElapsedTime,
        formatMatchTime,
        startSetTimer,
        stopSetTimer,
        resetSetTimer,
        getSetElapsedTime,
        formatSetTime,
        downloadScoreData: function() {
            const data = getScoreData();
            window.shouldDownloadScoreData = true;
            saveScoreData(data);
        }
    };
}

