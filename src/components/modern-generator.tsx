import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const ModernGenerator: React.FC = () => (
  <Box p={8} bg="gray.50" borderRadius="lg" boxShadow="md">
    <Heading size="lg" mb={4} color="blue.600">
      Générateur Moderne
    </Heading>
    <Text>
      Ce composant est prêt pour intégrer des fonctionnalités de génération assistée par IA.
    </Text>
  </Box>
);

export default ModernGenerator;