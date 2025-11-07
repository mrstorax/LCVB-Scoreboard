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
    savedConfigs: {} // Configurations sauvegardées : { "Nom config": { customColors: {...}, template: 'custom' }, ... }
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

// Fonction pour mettre à jour le score d'une équipe
function updateScore(team, delta) {
    const data = getScoreData();
    const newScore = Math.max(0, data[team].score + delta);
    data[team].score = newScore;
    saveScoreData(data);
    return data;
}

// Fonction pour mettre à jour le set d'une équipe
function updateSet(team, setIndex, delta) {
    const data = getScoreData();
    const currentSetIndex = data.currentSet - 1;
    const newSetScore = Math.max(0, data[team].sets[setIndex] + delta);
    data[team].sets[setIndex] = newSetScore;
    saveScoreData(data);
    return data;
}

// Fonction pour changer le set actuel
function changeSet(setNumber) {
    const data = getScoreData();
    if (setNumber >= 1 && setNumber <= data.maxSets) {
        data.currentSet = setNumber;
        saveScoreData(data);
    }
    return data;
}

// Fonction pour passer au set suivant
function nextSet() {
    const data = getScoreData();
    const currentSetIndex = data.currentSet - 1;
    
    // Sauvegarder les scores finaux du set actuel
    data.team1.sets[currentSetIndex] = data.team1.score;
    data.team2.sets[currentSetIndex] = data.team2.score;
    
    // Passer au set suivant si possible
    if (data.currentSet < data.maxSets) {
        data.currentSet += 1;
        // Réinitialiser les scores du nouveau set
        data.team1.score = 0;
        data.team2.score = 0;
    }
    
    saveScoreData(data);
    return data;
}

// Fonction pour réinitialiser le set actuel
function resetCurrentSet() {
    const data = getScoreData();
    data.team1.score = 0;
    data.team2.score = 0;
    saveScoreData(data);
    return data;
}

// Fonction pour réinitialiser complètement (match entier)
function resetAll() {
    localStorage.setItem('lcvb_score', JSON.stringify(DEFAULT_SCORE_DATA));
    return DEFAULT_SCORE_DATA;
}

// Fonction pour mettre à jour le nom d'une équipe
function updateTeamName(team, name) {
    const data = getScoreData();
    data[team].name = name;
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
        downloadScoreData: function() {
            const data = getScoreData();
            window.shouldDownloadScoreData = true;
            saveScoreData(data);
        }
    };
}

