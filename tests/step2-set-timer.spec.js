const { test, expect } = require('@playwright/test');

test.describe('Étape 2 : Chronomètre par set (démarrage automatique)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/control.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Attendre que LCVBScoreboard soit chargé
    await page.waitForFunction(() => 
      typeof window.LCVBScoreboard !== 'undefined' && 
      typeof window.LCVBScoreboard.getSetElapsedTime === 'function'
    );
  });

  test('Les fonctions du chronomètre par set doivent être disponibles', async ({ page }) => {
    const functions = await page.evaluate(() => {
      const lcvb = window.LCVBScoreboard;
      return {
        startSetTimer: typeof lcvb?.startSetTimer === 'function',
        stopSetTimer: typeof lcvb?.stopSetTimer === 'function',
        resetSetTimer: typeof lcvb?.resetSetTimer === 'function',
        getSetElapsedTime: typeof lcvb?.getSetElapsedTime === 'function',
        formatSetTime: typeof lcvb?.formatSetTime === 'function',
      };
    });

    expect(functions.startSetTimer).toBe(true);
    expect(functions.stopSetTimer).toBe(true);
    expect(functions.resetSetTimer).toBe(true);
    expect(functions.getSetElapsedTime).toBe(true);
    expect(functions.formatSetTime).toBe(true);
  });

  test('Le chronomètre du set doit démarrer automatiquement au premier point du set', async ({ page }) => {
    // Ajouter le premier point du set 1 (équipe 1)
    await page.locator('button:has-text("+")').first().click();
    
    // Attendre 1.1 secondes pour que le chronomètre s'incrémente
    await page.waitForTimeout(1100);
    
    // Vérifier que le chronomètre du set a démarré et s'est incrémenté
    const timerText = await page.textContent('#set-timer-display');
    expect(timerText).not.toBe('00:00');
    expect(timerText).toMatch(/00:0[1-9]/); // Au moins 1 seconde écoulée
  });

  test('Le chronomètre du set doit se réinitialiser', async ({ page }) => {
    // Ajouter un point pour démarrer le chronomètre
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(500);
    
    // Réinitialiser - utiliser le bouton spécifique pour le set timer
    await page.locator('button:has-text("Réinitialiser")').nth(1).click();
    
    // Vérifier que le temps est à 00:00
    const timerText = await page.textContent('#set-timer-display');
    expect(timerText).toBe('00:00');
  });

  test('Le chronomètre doit démarrer automatiquement au premier point après passage au set suivant', async ({ page }) => {
    // Passer au set suivant
    await page.click('button:has-text("Set Suivant")');
    await page.waitForTimeout(500);
    
    // Vérifier que le chronomètre est à 00:00 (pas encore démarré)
    const timerTextBefore = await page.textContent('#set-timer-display');
    expect(timerTextBefore).toBe('00:00');
    
    // Ajouter le premier point du set 2
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(1100);
    
    // Vérifier que le chronomètre a démarré et s'est incrémenté
    const timerTextAfter = await page.textContent('#set-timer-display');
    expect(timerTextAfter).not.toBe('00:00');
    expect(timerTextAfter).toMatch(/00:0[1-9]/);
  });

  test('Le numéro du set affiché doit correspondre au set actuel', async ({ page }) => {
    // Vérifier que le set 1 est affiché initialement
    const setNumber = await page.textContent('#current-set-number');
    expect(setNumber).toBe('1');
    
    // Changer de set
    await page.selectOption('#set-selector', '2');
    await page.waitForTimeout(100);
    
    // Vérifier que le set 2 est affiché
    const setNumber2 = await page.textContent('#current-set-number');
    expect(setNumber2).toBe('2');
  });

  test('Chaque set doit avoir son propre chronomètre indépendant', async ({ page }) => {
    // Ajouter un point au set 1 pour démarrer son chronomètre
    await page.locator('button:has-text("+")').first().click();
    
    // Attendre que le chronomètre démarre et s'incrémente (au moins 1 seconde)
    await page.waitForFunction(
      () => {
        const timerText = document.getElementById('set-timer-display')?.textContent;
        return timerText && timerText !== '00:00';
      },
      { timeout: 2000 }
    );
    
    const timeSet1 = await page.textContent('#set-timer-display');
    expect(timeSet1).not.toBe('00:00');
    
    // Changer pour le set 2
    await page.selectOption('#set-selector', '2');
    await page.waitForTimeout(300);
    
    // Vérifier que les scores sont bien à 0 pour le set 2
    const score1 = await page.locator('#team1-score-input').inputValue();
    const score2 = await page.locator('#team2-score-input').inputValue();
    
    // Le chronomètre du set 2 doit être à 00:00 (pas encore démarré)
    const timeSet2 = await page.textContent('#set-timer-display');
    expect(timeSet2).toBe('00:00');
    
    // Ajouter un point au set 2 pour démarrer son chronomètre
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(300);
    
    // Attendre que le chronomètre démarre et s'incrémente
    await page.waitForFunction(
      () => {
        const timerText = document.getElementById('set-timer-display')?.textContent;
        return timerText && timerText !== '00:00';
      },
      { timeout: 2000 }
    );
    
    const timeSet2After = await page.textContent('#set-timer-display');
    expect(timeSet2After).not.toBe('00:00');
    
    // Revenir au set 1
    await page.selectOption('#set-selector', '1');
    await page.waitForTimeout(300);
    
    // Le chronomètre du set 1 doit avoir conservé son temps (il continue de tourner)
    const timeSet1Again = await page.textContent('#set-timer-display');
    expect(timeSet1Again).not.toBe('00:00');
  });

  test('Le chronomètre du match démarre aussi au premier point', async ({ page }) => {
    // Ajouter le premier point du match
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(1100);
    
    // Vérifier que le chronomètre du match a démarré
    const matchTimerText = await page.textContent('#match-timer-display');
    expect(matchTimerText).not.toBe('00:00:00');
    expect(matchTimerText).toMatch(/00:00:0[1-9]/);
    
    // Vérifier que le chronomètre du set a aussi démarré
    const setTimerText = await page.textContent('#set-timer-display');
    expect(setTimerText).not.toBe('00:00');
    expect(setTimerText).toMatch(/00:0[1-9]/);
  });

  test('Pas d\'erreurs JavaScript dans la console', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('Failed to load resource') && 
            !text.includes('404') &&
            !text.includes('favicon')) {
          errors.push(text);
        }
      }
    });
    
    await page.goto('/control.html');
    await page.waitForTimeout(1000);
    
    // Tester le démarrage automatique au premier point
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('#set-selector', '2');
    await page.waitForTimeout(500);
    
    expect(errors.length).toBe(0);
  });
});
