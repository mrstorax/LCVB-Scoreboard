const { test, expect } = require('@playwright/test');

test.describe('Étape 1 : Chronomètre du match (démarrage automatique)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/control.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Attendre que LCVBScoreboard soit chargé
    await page.waitForFunction(() => 
      typeof window.LCVBScoreboard !== 'undefined' && 
      typeof window.LCVBScoreboard.getMatchElapsedTime === 'function'
    );
  });

  test('Les fonctions du chronomètre doivent être disponibles', async ({ page }) => {
    const functions = await page.evaluate(() => {
      const lcvb = window.LCVBScoreboard;
      return {
        startMatchTimer: typeof lcvb?.startMatchTimer === 'function',
        stopMatchTimer: typeof lcvb?.stopMatchTimer === 'function',
        resetMatchTimer: typeof lcvb?.resetMatchTimer === 'function',
        getMatchElapsedTime: typeof lcvb?.getMatchElapsedTime === 'function',
        formatMatchTime: typeof lcvb?.formatMatchTime === 'function',
      };
    });

    expect(functions.startMatchTimer).toBe(true);
    expect(functions.stopMatchTimer).toBe(true);
    expect(functions.resetMatchTimer).toBe(true);
    expect(functions.getMatchElapsedTime).toBe(true);
    expect(functions.formatMatchTime).toBe(true);
  });

  test('Le chronomètre doit démarrer automatiquement au premier point', async ({ page }) => {
    // Ajouter le premier point (équipe 1)
    await page.locator('button:has-text("+")').first().click();
    
    // Attendre 1.1 secondes pour que le chronomètre s'incrémente
    await page.waitForTimeout(1100);
    
    // Vérifier que le chronomètre a démarré et s'est incrémenté
    const timerText = await page.textContent('#match-timer-display');
    expect(timerText).not.toBe('00:00:00');
    expect(timerText).toMatch(/00:00:0[1-9]/); // Au moins 1 seconde écoulée
  });

  test('Le chronomètre doit se réinitialiser', async ({ page }) => {
    // Ajouter un point pour démarrer le chronomètre
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(500);
    
    // Réinitialiser
    await page.locator('button:has-text("Réinitialiser")').first().click();
    
    // Vérifier que le temps est à 00:00:00
    const timerText = await page.textContent('#match-timer-display');
    expect(timerText).toBe('00:00:00');
  });

  test('Le chronomètre NE doit PAS être visible dans index.html (page de diffusion)', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(500);
    
    // Le chronomètre ne doit PAS être présent sur la page de diffusion
    const timerExists = await page.locator('#match-timer-display').count();
    expect(timerExists).toBe(0);
  });

  test('Pas d\'erreurs JavaScript dans la console', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignorer les erreurs d'images manquantes
        if (!text.includes('Failed to load resource') && 
            !text.includes('404') &&
            !text.includes('favicon')) {
          errors.push(text);
        }
      }
    });
    
    await page.goto('/control.html');
    await page.waitForTimeout(1000);
    
    // Ajouter un point pour tester le démarrage automatique
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(500);
    
    expect(errors.length).toBe(0);
  });
});
