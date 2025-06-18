import React, { useEffect, useState, act } from "react";
import { Box, Heading, Text, VStack, Code, Spinner, Divider } from "@chakra-ui/react";

const LogsDashboard = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs")
      .then(res => res.json())
      .then(data => {
        act(() => {
          setLogs(data.logs || []);
          setLoading(false);
        });
      });
  }, []);

  return (
    <Box p={8} bg="gray.50" borderRadius="lg" shadow="md" mt={8}>
      <Heading size="md" mb={4}>Logs du backend</Heading>
      <Divider mb={4} />
      {loading ? <Spinner /> : (
        <VStack align="start" spacing={2} maxH="400px" overflowY="auto">
          {logs.length === 0 && <Text color="gray.400">Aucun log à afficher.</Text>}
          {logs.map((log, i) => (
            <Code key={i} w="full" whiteSpace="pre-wrap" fontSize="sm">{log}</Code>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default LogsDashboard;
