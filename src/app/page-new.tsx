"use client";
import {
  Button,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  Input,
  Spinner,
  Card,
  CardBody,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Container,
  Grid,
  GridItem,
  Flex,
  useColorMode,
  Textarea
} from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const { colorMode, toggleColorMode } = useColorMode();

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    setStep(1);
    
    try {
      // Simulation progressive pour effet "wow"
      setTimeout(() => setStep(2), 1000);
      setTimeout(() => setStep(3), 2000);
      
      const res = await fetch("http://localhost:4000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.result);
      setStep(4);
      
      // Score simulation
      const randomScore = Math.floor(Math.random() * 30) + 70;
      setScore(randomScore);
    } catch (e) {
      setResult("Erreur lors de la génération IA");
    }
    setLoading(false);
  };

  const handleClassify = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch("http://localhost:4000/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: prompt }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      setAnalysis({ error: "Erreur lors de l'analyse IA" });
    }
    setLoading(false);
  };

  return (
    <Container maxW="8xl" p={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Heading 
            size="2xl" 
            bgGradient="linear(to-r, purple.400, pink.400, orange.400)"
            bgClip="text"
          >
            SaasForge 🚀
          </Heading>
          <Text fontSize="lg" color="gray.500">
            L'IA qui transforme vos idées en MVP révolutionnaires
          </Text>
        </VStack>
        <Button onClick={toggleColorMode} size="lg">
          {colorMode === "light" ? "🌙" : "☀️"}
        </Button>
      </Flex>

      <Grid templateColumns="1fr 1fr" gap={8} h="70vh">
        {/* Panel gauche - Input */}
        <GridItem>
          <Card h="full" shadow="2xl">
            <CardBody>
              <VStack spacing={6} h="full">
                <Text fontSize="xl" fontWeight="bold">
                  💡 Décrivez votre vision SaaS
                </Text>
                <Textarea
                  placeholder="Ex: Une plateforme qui connecte les freelances avec des projets IA..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  size="lg"
                  h="120px"
                  resize="none"
                />
                
                <HStack spacing={4} w="full">
                  <Button 
                    colorScheme="purple" 
                    size="lg" 
                    onClick={handleGenerate} 
                    isLoading={loading}
                    flex={1}
                  >
                    ⭐ Générer MVP Complet
                  </Button>
                  <Button 
                    colorScheme="teal" 
                    variant="outline"
                    size="lg" 
                    onClick={handleClassify} 
                    isLoading={loading}
                  >
                    📊 Analyser
                  </Button>
                </HStack>

                {loading && (
                  <VStack w="full" spacing={4}>
                    <Text>Étape {step}/4 : {
                      step === 1 ? "Analyse de l'idée..." :
                      step === 2 ? "Génération de l'architecture..." :
                      step === 3 ? "Création des fonctionnalités..." :
                      "Finalisation du MVP..."
                    }</Text>
                    <Progress value={step * 25} w="full" colorScheme="purple" hasStripe isAnimated />
                  </VStack>
                )}

                {score > 0 && (
                  <Card w="full" bg="green.50">
                    <CardBody>
                      <Text fontSize="lg" fontWeight="bold">
                        🎯 Score de Viabilité: {score}/100
                      </Text>
                      <Progress value={score} colorScheme="green" mt={2} />
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Panel droite - Résultats */}
        <GridItem>
          <Card h="full" shadow="2xl">
            <CardBody>
              <Tabs variant="enclosed" h="full" display="flex" flexDirection="column">
                <TabList>
                  <Tab>📋 MVP Généré</Tab>
                  <Tab>📊 Analyse</Tab>
                  <Tab>🚀 Actions</Tab>
                </TabList>

                <TabPanels flex={1} overflow="auto">
                  <TabPanel>
                    {result ? (
                      <VStack align="start" spacing={4}>
                        <Badge colorScheme="green" p={2}>Généré avec succès!</Badge>
                        <Text whiteSpace="pre-wrap">{result}</Text>
                        <HStack>
                          <Button size="sm" colorScheme="blue">
                            📄 Export PDF
                          </Button>
                          <Button size="sm" colorScheme="purple">
                            🚀 Déployer
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <Text color="gray.500" textAlign="center" mt={8}>
                        Votre MVP apparaîtra ici...
                      </Text>
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    {analysis ? (
                      <VStack align="start" spacing={4}>
                        <HStack>
                          <Badge colorScheme="purple">Secteur</Badge>
                          <Text fontWeight="bold">{analysis.secteur}</Text>
                        </HStack>
                        <HStack>
                          <Badge colorScheme="orange">Viabilité</Badge>
                          <Text fontWeight="bold">{analysis.viabilite}</Text>
                        </HStack>
                        <Text fontStyle="italic">{analysis.explication}</Text>
                        <Text fontWeight="bold">💡 Suggestions :</Text>
                        <VStack align="start" pl={4}>
                          {analysis.suggestions?.map((s: string, i: number) => (
                            <Text key={i}>• {s}</Text>
                          ))}
                        </VStack>
                      </VStack>
                    ) : (
                      <Text color="gray.500" textAlign="center" mt={8}>
                        L'analyse de votre idée apparaîtra ici...
                      </Text>
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    <VStack spacing={4}>
                      <Button colorScheme="gray" w="full">
                        🔄 Créer Repo GitHub
                      </Button>
                      <Button colorScheme="blue" w="full">
                        ☁️ Déployer sur Vercel
                      </Button>
                      <Button colorScheme="green" w="full">
                        📄 Télécharger Code Complet
                      </Button>
                      <Button colorScheme="orange" w="full">
                        💰 Générer Plan Business
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
}
