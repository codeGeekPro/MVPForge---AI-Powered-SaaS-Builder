import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Spinner, Box } from '@chakra-ui/react';

// Lazy loading des composants lourds
export const LazyLogsDashboard = dynamic(() => import('./logs-dashboard'), {
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
      <Spinner size="lg" color="purple.500" />
    </Box>
  ),
});

export const LazyModernGenerator = dynamic(() => import('./modern-generator'), {
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center" minH="300px">
      <Spinner size="xl" color="blue.500" />
    </Box>
  ),
});

// Composant wrapper pour le lazy loading avec Suspense
export function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="lg" color="purple.500" />
      </Box>
    }>
      {children}
    </Suspense>
  );
}
