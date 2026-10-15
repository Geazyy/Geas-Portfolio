'use client';

import { ThemeProvider } from '../src/context/ThemeContext';
import { EffectsProvider } from '../src/context/EffectsContext';

const Providers = ({ children }) => (
  <ThemeProvider><EffectsProvider>{children}</EffectsProvider></ThemeProvider>
);

export default Providers;
