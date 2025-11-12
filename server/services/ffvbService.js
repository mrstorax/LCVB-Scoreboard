const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const { query } = require('../config/database');
const fetch = require('node-fetch');

const BASE_URL = 'https://www.ffvbbeach.org';

const decodeBuffer = (buffer, contentType = '') => {
    if (/charset\s*=\s*utf-?8/i.test(contentType)) {
        return iconv.decode(buffer, 'utf8');
    }
    return iconv.decode(buffer, 'latin1');
};

const fetchText = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`FFVB request failed (${response.status})`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || '';
    return decodeBuffer(buffer, contentType);
};

const clean = (text = '') => text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

const padTeamCode = value => (value ? value.toString().padStart(2, '0') : '');

const stripAccents = (text = '') => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const uppercaseClean = (text = '') => stripAccents(text).toUpperCase();

const deriveClubPrefix = (clubName = '') => {
    const words = stripAccents(clubName)
        .toUpperCase()
        .match(/[A-Z0-9]+/g) || [];

    if (words.length === 0) return 'LCVB';

    const initials = words.map(word => word[0]).join('');
    if (initials.length >= 2 && initials.length <= 6) return initials;

    if (words.length === 1) {
        return words[0].slice(0, 4);
    }

    return (words[0][0] + (words[1]?.[0] || '') + (words[2]?.[0] || '') + (words[3]?.[0] || '')).toUpperCase();
};

const deriveLevelGenderFromPoule = (poule = '', label = '') => {
    const code = (poule || '').toUpperCase();
    const normalized = uppercaseClean(label);
    let level = null;
    let gender = null;

    const setGenderFromText = (text) => {
        if (!gender && /FEM/.test(text)) gender = 'Féminine';
        if (!gender && /MASC|M$/.test(text)) gender = 'Masculine';
    };

    const setLevel = (value) => {
        if (!level) level = value;
    };

    if (/^3F/.test(code)) {
        setLevel('Nationale 3');
        gender = 'Féminine';
    } else if (/^3M/.test(code)) {
        setLevel('Nationale 3');
        gender = 'Masculine';
    } else if (/^PFA/.test(code)) {
        setLevel('Prénationale');
        gender = 'Féminine';
    } else if (/^PMA/.test(code)) {
        setLevel('Prénationale');
        gender = 'Masculine';
    } else if (/^RF(\d)/.test(code)) {
        const match = code.match(/^RF(\d)/);
        setLevel(`Régionale ${match[1]}`);
        gender = 'Féminine';
    } else if (/^RM(\d)/.test(code)) {
        const match = code.match(/^RM(\d)/);
        setLevel(`Régionale ${match[1]}`);
        gender = 'Masculine';
    } else if (/^CFA/.test(code)) {
        setLevel('U18');
        gender = 'Féminine';
    } else if (/^CMA/.test(code)) {
        setLevel('U18');
        gender = 'Masculine';
    } else if (/^BFA/.test(code)) {
        setLevel('U15');
        gender = 'Féminine';
    } else if (/^BMA/.test(code)) {
        setLevel('U15');
        gender = 'Masculine';
    } else if (/^MFD/.test(code)) {
        setLevel('U13');
        gender = 'Féminine';
    } else if (/^MMD/.test(code)) {
        setLevel('U13');
        gender = 'Masculine';
    }

    if (!level) {
        if (normalized.includes('NATIONALE 3')) setLevel('Nationale 3');
        else if (normalized.includes('PRENATION')) setLevel('Prénationale');
        else if (normalized.includes('REGIONALE 1')) setLevel('Régionale 1');
        else if (normalized.includes('REGIONALE 2')) setLevel('Régionale 2');
        else if (normalized.includes('REGIONALE 3')) setLevel('Régionale 3');
    }

    if (!level) {
        const ageMatch = normalized.match(/U(\d{2})/);
        if (ageMatch) {
            setLevel(`U${ageMatch[1]}`);
        }
    }

    setGenderFromText(normalized);

    return { level, gender };
};

const buildTeamNaming = (team, clubPrefix = 'LCVB') => {
    const label = clean(team.competitionLabel || team.name || '');
    const normalized = uppercaseClean(label);
    const { level, gender } = deriveLevelGenderFromPoule(team.poule, normalized);

    const displayParts = [clubPrefix];
    if (level) displayParts.push(level.toUpperCase());
    if (gender) displayParts.push(gender.toUpperCase());

    const displayName = displayParts.join(' - ') || `${clubPrefix} - ${(team.name || 'Équipe').toUpperCase()}`;
    const categoryLabel = [
        level || label || 'Équipe FFVB',
        gender || ''
    ].filter(Boolean).join(' • ').trim();

    return {
        displayName,
        categoryLabel,
        level,
        gender
    };
};

const DEFAULT_TEAM_COLORS = [
    { primary: '#E91E63', secondary: '#FF8FB4' },
    { primary: '#2563eb', secondary: '#60a5fa' },
    { primary: '#0ea5e9', secondary: '#67e8f9' },
    { primary: '#10b981', secondary: '#6ee7b7' },
    { primary: '#f97316', secondary: '#fdba74' },
    { primary: '#8b5cf6', secondary: '#c4b5fd' }
];

const pickColorsFromKey = (key = '') => {
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DEFAULT_TEAM_COLORS[hash % DEFAULT_TEAM_COLORS.length];
};

const getSeasonLabel = (season) => {
    if (season) return season;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = month >= 7 ? year : year - 1;
    return `${start}/${start + 1}`;
};

const resolveClubUrl = (input) => {
    if (!input) throw new Error('URL ou code club FFVB requis');
    try {
        if (/^https?:\/\//i.test(input)) {
            const url = new URL(input);
            const clubCode = url.searchParams.get('cnclub');
            if (!clubCode) throw new Error('Impossible de détecter cnclub dans l’URL');
            return { clubCode, clubUrl: input };
        }
        return {
            clubCode: input,
            clubUrl: `${BASE_URL}/ffvbapp/resu/planning_club_class.php?cnclub=${encodeURIComponent(input)}`
        };
    } catch (error) {
        throw new Error('Lien FFVB invalide');
    }
};

const parseClubTeams = (html, clubCode) => {
    const $ = cheerio.load(html, { decodeEntities: false });
    const headingCells = $('td.titreblanc');
    const clubName = clean($(headingCells).first().text()) || `Club ${clubCode}`;
    const clubNameUpper = clubName.toUpperCase();

    const teams = [];
    $('form[action*="vbspo_calendrier.php"]').each((_, form) => {
        const $form = $(form);
        const row = $form.closest('tr');
        if (!row.length) return;

        const teamNameCell = row.find('td').eq(1);
        const teamName = clean(teamNameCell.text());
        if (!teamName || !teamName.toUpperCase().includes(clubNameUpper)) return;

        const hidden = {};
        row.find('input[name]').each((__, inputElem) => {
            const name = $(inputElem).attr('name');
            const value = $(inputElem).attr('value');
            if (name) hidden[name] = value;
        });

        const codent = hidden.codent || hidden.cal_codent;
        const poule = hidden.poule || hidden.cal_codpoule;
        const teamCode = hidden.equipe || hidden.rech_equipe;
        if (!codent || !poule || !teamCode) return;

        const season = hidden.saison || hidden.cal_saison;
        const division = hidden.division || hidden.cal_coddiv || '';
        const tour = hidden.tour || hidden.cal_codtour || '';
        const calend = hidden.calend || hidden.calendrier || 'COMPLET';

        let competitionLabel = '';
        const scoreboardTable = row.closest('table');
        if (scoreboardTable.length) {
            const holderTd = scoreboardTable.parent();
            const blockRow = holderTd && holderTd.parent ? holderTd.parent() : null;
            const headerRow = blockRow && blockRow.prev ? blockRow.prev() : null;
            if (headerRow && headerRow.length) {
                competitionLabel = clean(headerRow.find('td.titrepoule').first().text());
            }
        }

        const key = `${codent}-${poule}-${teamCode}`;
        if (teams.find(t => t.key === key)) return;

        teams.push({
            key,
            name: teamName,
            competitionLabel,
            season,
            codent,
            poule,
            division,
            tour,
            calend,
            teamCode
        });
    });

    return { clubName, teams };
};

const buildCalendarUrl = (team, fallbackSeason) => {
    const params = new URLSearchParams({
        saison: team.season || fallbackSeason,
        codent: team.codent,
        poule: team.poule,
        calend: team.calend || 'COMPLET',
        equipe: padTeamCode(team.teamCode)
    });
    return `${BASE_URL}/ffvbapp/resu/vbspo_calendrier.php?${params.toString()}`;
};

const parseCalendarExport = (csvText) => {
    const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (lines.length <= 1) return [];
    const [, ...rows] = lines;

    return rows.map(line => {
        const cells = line.split(';');
        return {
            entity: cells[0] || '',
            journee: cells[1] || '',
            matchCode: cells[2] || '',
            date: cells[3] || '',
            time: cells[4] || '',
            home: {
                clubCode: cells[5] || '',
                name: cells[6] || ''
            },
            away: {
                clubCode: cells[7] || '',
                name: cells[8] || ''
            },
            sets: cells[9] || '',
            scoreDetail: cells[10] || '',
            totalPoints: cells[11] || '',
            venue: cells[12] || '',
            referee1: cells[13] || '',
            referee2: cells[14] || ''
        };
    });
};

const fetchTeamCalendar = async (team, seasonLabel) => {
    const body = new URLSearchParams({
        cal_saison: team.season || seasonLabel,
        cal_codent: team.codent,
        cal_codpoule: team.poule,
        cal_coddiv: team.division || '',
        cal_codtour: team.tour || '',
        typ_edition: 'E',
        type: 'RES',
        rech_equipe: padTeamCode(team.teamCode)
    });

    const csv = await fetchText(`${BASE_URL}/ffvbapp/resu/vbspo_calendrier_export.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    });

    return parseCalendarExport(csv);
};

const importClubFromFFVB = async ({ clubCode, clubUrl, season }) => {
    const resolved = resolveClubUrl(clubUrl || clubCode);
    const seasonLabel = getSeasonLabel(season);
    const html = await fetchText(resolved.clubUrl);
    const { clubName, teams } = parseClubTeams(html, resolved.clubCode);

    if (teams.length === 0) {
        throw new Error('Aucune équipe du club trouvée sur FFVB');
    }

    const enrichedTeams = [];
    for (const team of teams) {
        const teamWithSeason = { ...team, season: team.season || seasonLabel };
        const calendar = await fetchTeamCalendar(teamWithSeason, seasonLabel);
        const calendarUrl = buildCalendarUrl(teamWithSeason, seasonLabel);
        enrichedTeams.push({ ...teamWithSeason, calendarUrl, calendar });
    }

    const clubPrefix = deriveClubPrefix(clubName);
    const normalizedTeams = enrichedTeams.map(team => {
        const naming = buildTeamNaming(team, clubPrefix);
        return {
            ...team,
            sourceName: team.name,
            name: naming.displayName,
            categoryLabel: naming.categoryLabel,
            level: naming.level,
            gender: naming.gender
        };
    });

    const syncedDbTeams = await syncTeamsWithDatabase(normalizedTeams);
    const teamIdMap = syncedDbTeams.reduce((acc, entry) => {
        acc[entry.key] = entry.dbTeam.id;
        return acc;
    }, {});

    const enrichedWithIds = normalizedTeams.map(team => ({
        ...team,
        teamId: teamIdMap[team.key] || null
    }));

    const payload = {
        club: {
            code: resolved.clubCode,
            url: resolved.clubUrl,
            name: clubName,
            prefix: clubPrefix,
            season: seasonLabel,
            importedAt: new Date().toISOString()
        },
        teams: enrichedWithIds
    };

    const inserted = await query(
        'INSERT INTO ffvb_imports (club_code, season, payload) VALUES ($1, $2, $3) RETURNING id, created_at',
        [resolved.clubCode, seasonLabel, payload]
    );

    await query(
        'INSERT INTO settings (key, value, description, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description, updated_at = NOW()',
        ['ffvb.club_code', { code: resolved.clubCode, season: seasonLabel }, 'Dernier club FFVB synchronisé']
    );
    await query(
        'INSERT INTO settings (key, value, description, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description, updated_at = NOW()',
        ['ffvb.last_sync_at', { at: new Date().toISOString() }, 'Date de dernière synchro FFVB']
    );

    return {
        importId: inserted.rows[0].id,
        createdAt: inserted.rows[0].created_at,
        payload
    };
};

const getLatestImport = async (clubCode) => {
    const result = await query(
        'SELECT * FROM ffvb_imports WHERE club_code = $1 ORDER BY created_at DESC LIMIT 1',
        [clubCode]
    );
    return result.rows[0] || null;
};

const syncTeamsWithDatabase = async (teams) => {
    const synced = [];
    for (const team of teams) {
        const colors = pickColorsFromKey(team.key);
        const targetName = team.name || team.sourceName || clean(team.competitionLabel) || 'Équipe FFVB';
        const categoryLabel = (team.categoryLabel || clean(team.competitionLabel) || 'Équipe FFVB').slice(0, 50);

        const existing = await query(
            'SELECT id FROM teams WHERE LOWER(name) = LOWER($1) LIMIT 1',
            [targetName]
        );

        let dbTeam;

        if (existing.rows.length > 0) {
            dbTeam = (await query(
                `UPDATE teams
                 SET name = $1,
                     category = $2,
                     primary_color = COALESCE(primary_color, $3),
                     secondary_color = COALESCE(secondary_color, $4)
                 WHERE id = $5
                 RETURNING *`,
                [targetName, categoryLabel, colors.primary, colors.secondary, existing.rows[0].id]
            )).rows[0];
        } else {
            dbTeam = (await query(
                `INSERT INTO teams (name, category, logo_url, primary_color, secondary_color)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [targetName, categoryLabel, 'logos/logo-lcvb.png', colors.primary, colors.secondary]
            )).rows[0];
        }

        synced.push({ key: team.key, dbTeam });
    }
    return synced;
};

const parseFfvbDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split(/[\/\-]/).map(part => parseInt(part, 10));
    if (parts.length < 3 || parts.some(isNaN)) return null;

    let day;
    let month;
    let year;

    if (parts[0] > 1900) {
        [year, month, day] = parts;
    } else if (parts[2] > 1900) {
        [day, month, year] = parts;
    } else {
        [day, month, year] = parts;
    }

    let hours = 12;
    let minutes = 0;
    if (timeStr) {
        const normalized = timeStr.replace('H', ':').replace('h', ':');
        const timeParts = normalized.split(':').map(part => parseInt(part, 10)).filter(n => !isNaN(n));
        if (timeParts.length >= 2) {
            [hours, minutes] = timeParts;
        }
    }
    return new Date(year, month - 1, day, hours, minutes, 0);
};

const extractUpcomingMatches = (payload, { rangeDays = 7, limit = null } = {}) => {
    if (!payload?.teams?.length) return [];
    const clubName = payload.club?.name || '';
    const clubUpper = clubName.toUpperCase();
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + rangeDays);

    const matches = [];
    payload.teams.forEach(team => {
        (team.calendar || []).forEach(match => {
            const matchDate = parseFfvbDateTime(match.date, match.time);
            if (!matchDate || matchDate < now || matchDate > end) return;

            const homeName = (match.home?.name || '').toUpperCase();
            const awayName = (match.away?.name || '').toUpperCase();
            const isHome = homeName.includes(clubUpper);
            const opponent = isHome ? (match.away?.name || 'Adversaire à confirmer') : (match.home?.name || 'Adversaire à confirmer');

            matches.push({
                teamName: team.name,
                teamId: team.teamId || null,
                competition: team.competitionLabel || match.entity || 'Compétition FFVB',
                date: matchDate.toISOString(),
                opponent,
                isHome,
                location: match.venue || 'Lieu à confirmer',
                sourceLink: team.calendarUrl || payload.club?.url || null,
                raw: match
            });
        });
    });

    matches.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (limit && limit > 0) {
        return matches.slice(0, limit);
    }
    return matches;
};

const getUpcomingMatches = async ({ clubCode, rangeDays = 7, limit = null }) => {
    let targetClubCode = clubCode;
    if (!targetClubCode) {
        const latestClub = await query('SELECT club_code FROM ffvb_imports ORDER BY created_at DESC LIMIT 1');
        if (latestClub.rows.length === 0) return [];
        targetClubCode = latestClub.rows[0].club_code;
    }

    const latest = await getLatestImport(targetClubCode);
    if (!latest?.payload) return [];
    return extractUpcomingMatches(latest.payload, { rangeDays, limit });
};

module.exports = {
    importClubFromFFVB,
    getLatestImport,
    getUpcomingMatches,
};
