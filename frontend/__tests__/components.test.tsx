import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../src/app/page';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';

describe('Composants principaux', () => {
  it('Affiche le titre principal', () => {
    render(<Home />);
    const title = screen.getByRole('heading', { name: /SaasForge/i });
    expect(title).toBeInTheDocument();
  });

  it('Affiche le bouton de génération', () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: /GÉNÉRER MON MVP/i });
    expect(button).toBeInTheDocument();
  });
});

describe('Interactions utilisateur', () => {
  it('Clique sur le bouton de génération', async () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: /GÉNÉRER MON MVP/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('Change la langue', async () => {
    render(<Home />);
    const langButton = screen.getByRole('button', { name: /FR/i });
    fireEvent.click(langButton);
    expect(langButton).toHaveTextContent('EN');
  });
});
