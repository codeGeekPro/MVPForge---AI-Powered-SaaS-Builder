import { test, expect } from '@playwright/test';

test.describe('Tests E2E MVPForge', () => {
  test('Navigation et génération MVP complète', async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('http://localhost:3000');
    
    // Vérifier que la page se charge
    await expect(page.locator('h1')).toContainText('SaasForge');
    
    // Remplir le formulaire de génération
    await page.fill('textarea[placeholder*="idée"]', 'Plateforme de mise en relation artistes/clients avec IA');
    
    // Cliquer sur le bouton de génération
    await page.click('button:has-text("GÉNÉRER MON MVP")');
    
    // Attendre le résultat
    await page.waitForSelector('[data-testid="mvp-result"]', { timeout: 30000 });
    
    // Vérifier que le résultat s'affiche
    await expect(page.locator('[data-testid="mvp-result"]')).toBeVisible();
  });

  test('Changement de langue', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Vérifier la langue par défaut (FR)
    await expect(page.locator('button:has-text("FR")')).toBeVisible();
    
    // Changer vers l'anglais
    await page.click('button:has-text("EN")');
    
    // Vérifier le changement
    await expect(page.locator('h1')).toContainText('SaasForge');
  });

  test('Navigation vers les pages légales', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Cliquer sur mentions légales
    await page.click('a:has-text("Mentions légales")');
    
    // Vérifier la navigation
    await expect(page.url()).toContain('/mentions-legales');
  });
});
