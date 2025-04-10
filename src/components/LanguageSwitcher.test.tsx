import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  const renderLanguageSwitcher = (isScrolled = false) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher isScrolled={isScrolled} />
      </I18nextProvider>
    );
  };

  it('renders language button', () => {
    renderLanguageSwitcher();
    expect(screen.getByText('Language')).toBeInTheDocument();
  });

  it('shows dropdown on hover', () => {
    renderLanguageSwitcher();
    const button = screen.getByText('Language');
    fireEvent.mouseEnter(button);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Vietnamese')).toBeInTheDocument();
  });

  it('hides dropdown on mouse leave', () => {
    renderLanguageSwitcher();
    const button = screen.getByText('Language');
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    expect(screen.queryByText('English')).not.toBeInTheDocument();
    expect(screen.queryByText('Vietnamese')).not.toBeInTheDocument();
  });

  it('changes language when clicking on language option', () => {
    renderLanguageSwitcher();
    const button = screen.getByText('Language');
    fireEvent.mouseEnter(button);
    const vietnameseOption = screen.getByText('Vietnamese');
    fireEvent.click(vietnameseOption);
    expect(i18n.language).toBe('vi');
  });

  it('applies correct styles when scrolled', () => {
    renderLanguageSwitcher(true);
    const button = screen.getByText('Language');
    expect(button).toHaveClass('text-gray-500');
  });

  it('applies correct styles when not scrolled', () => {
    renderLanguageSwitcher(false);
    const button = screen.getByText('Language');
    expect(button).toHaveClass('text-gray-300');
  });
});
