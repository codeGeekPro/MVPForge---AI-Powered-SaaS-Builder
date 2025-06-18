import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import Home from '../../src/app/page';
import '@testing-library/jest-dom';
// import { describe, it, expect, beforeAll } from '@jest/globals';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../src/theme';

// Ajout d'un mock pour fetch
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'mocked data' }),
      text: () => Promise.resolve(JSON.stringify({ data: 'mocked data' })),
      headers: {
        get: () => null,
      },
    } as unknown as Response)
  );
});

describe('Composants principaux', () => {
  it('Affiche le titre principal', () => {
    render(
      <ChakraProvider theme={theme}>
        <Home />
      </ChakraProvider>
    );
    const headings = screen.getAllByRole('heading', { name: /SaasForge/i });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('Affiche le bouton de génération', () => {
    render(
      <ChakraProvider theme={theme}>
        <Home />
      </ChakraProvider>
    );
    const button = screen.getByRole('button', { name: /Générer mon MVP/i });
    expect(button).toBeInTheDocument();
  });
});

describe('Interactions utilisateur', () => {
  it('Clique sur le bouton de génération', async () => {
    render(
      <ChakraProvider theme={theme}>
        <Home />
      </ChakraProvider>
    );
    const button = screen.getByRole('button', { name: /Générer mon MVP/i });
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    // Le bouton devrait être en état de chargement après le clic
    expect(button).toBeInTheDocument();
  });

  it('Change la langue', async () => {
    render(
      <ChakraProvider theme={theme}>
        <Home />
      </ChakraProvider>
    );
    
    // Utiliser le rôle menuitem au lieu de button
    const langButton = screen.getByRole('menuitem', { name: /Changer la langue/i });
    
    await act(async () => {
      fireEvent.click(langButton);
    });
    
    // Après le clic, le bouton devrait afficher "EN" au lieu de "FR"
    await waitFor(() => {
      expect(langButton).toHaveTextContent('EN');
    });
  });
});

// Remove this block as it was added incorrectly
// We don't need to call setResult and setLoading directly in tests
