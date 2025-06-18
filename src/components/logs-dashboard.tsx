import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const LogsDashboard = () => (
  <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
    <Heading size="md" mb={4}>Logs Dashboard</Heading>
    <Text>Bienvenue sur le tableau de bord des logs générés par l’IA.</Text>
  </Box>
);

export default LogsDashboard;
