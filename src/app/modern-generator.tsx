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
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Avatar,
  Progress,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
  Flex,
  Center,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { generateFullMvp } from "../lib/api";
import {
  FiPocket,
  FiZap,
  FiTrendingUp,
  FiCode,
  FiDatabase,
  FiCloud,
  FiUsers,
  FiDollarSign,
  FiShield,
  FiGlobe,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface GenerationResult {
  ui?: any;
  backend?: any;
  architecture?: any;
  business?: any;
  progress: number;
  currentStep: string;
}

function ModernMVPGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, pink.50)",
    "linear(to-br, gray.900, purple.900, blue.900)"
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const features = [
    {
      icon: FiPocket,
      title: "Génération Ultra-Rapide",
      desc: "MVP complet en 60 secondes",
    },
    {
      icon: FiCode,
      title: "Code Production-Ready",
      desc: "TypeScript, React, API complète",
    },
    {
      icon: FiZap,
      title: "IA Multi-Agents",
      desc: "4 agents spécialisés en parallèle",
    },
    {
      icon: FiCloud,
      title: "Déploiement Automatique",
      desc: "Vercel + Railway en un clic",
    },
    {
      icon: FiUsers,
      title: "Analyse Utilisateur",
      desc: "Personas et user journeys",
    },
    {
      icon: FiDollarSign,
      title: "Modèle Économique",
      desc: "Pricing et stratégie revenue",
    },
  ];

  const handleGenerateComplete = async () => {
    setLoading(true);
    setResult({ progress: 0, currentStep: "Initialisation..." });

    // Simulation d'une génération progressive
    const steps = [
      { step: "Analyse de l'idée...", progress: 20 },
      { step: "Génération UI/UX...", progress: 40 },
      { step: "Architecture backend...", progress: 60 },
      { step: "Plan business...", progress: 80 },
      { step: "Finalisation...", progress: 100 },
    ];

    for (const { step, progress } of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResult((prev) => ({ ...prev!, progress, currentStep: step }));
    }

    // Appel API réel (via client typé)
    try {
      const data = await generateFullMvp(prompt);
      setResult((prev) => ({ ...prev!, ...data }));
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={20}>
      <Container maxW="7xl">
        <MotionVStack
          spacing={20}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <VStack spacing={8} textAlign="center">
            <MotionBox
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Heading
                size="3xl"
                bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
                bgClip="text"
                fontWeight="bold"
              >
                MVPForge Pro
              </Heading>
            </MotionBox>

            <Text fontSize="xl" color={textColor} maxW="2xl">
              Transformez votre idée en startup complète avec notre IA
              multi-agents. Code, design, business plan - tout généré
              automatiquement.
            </Text>

            <HStack spacing={4}>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                🤖 IA GPT-4
              </Badge>
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                ⚡ 60s génération
              </Badge>
              <Badge colorScheme="pink" px={3} py={1} borderRadius="full">
                🚀 Production-ready
              </Badge>
            </HStack>
          </VStack>

          {/* Features Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  bg={cardBg}
                  shadow="xl"
                  border="1px"
                  borderColor="gray.100"
                >
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Icon as={feature.icon} size="2xl" color="blue.500" />
                      <Heading size="md">{feature.title}</Heading>
                      <Text color={textColor}>{feature.desc}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Generator Interface */}
          <Card
            w="full"
            bg={cardBg}
            shadow="2xl"
            border="2px"
            borderColor="blue.100"
          >
            <CardBody p={8}>
              <VStack spacing={6}>
                <Heading size="lg" color="blue.600">
                  Décrivez votre idée SaaS
                </Heading>

                <Input
                  placeholder="Ex: Une plateforme pour connecter freelancers et startups avec matching IA..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  size="lg"
                  focusBorderColor="blue.400"
                  bg="gray.50"
                />

                <Button
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<FiPocket />}
                  onClick={handleGenerateComplete}
                  isLoading={loading}
                  loadingText="Génération en cours..."
                  w={{ base: "full", md: "auto" }}
                  px={12}
                >
                  Générer mon MVP complet
                </Button>

                {/* Progress Bar */}
                <AnimatePresence>
                  {loading && result && (
                    <MotionBox
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      w="full"
                    >
                      <VStack spacing={4} w="full">
                        <Text fontWeight="medium" color="blue.600">
                          {result.currentStep}
                        </Text>
                        <Progress
                          value={result.progress}
                          colorScheme="blue"
                          size="lg"
                          w="full"
                          borderRadius="full"
                        />
                        <Text fontSize="sm" color="gray.500">
                          {result.progress}% terminé
                        </Text>
                      </VStack>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </VStack>
            </CardBody>
          </Card>

          {/* Results Section */}
          <AnimatePresence>
            {result && !loading && result.progress === 100 && (
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                w="full"
              >
                <Card bg={cardBg} shadow="2xl">
                  <CardBody p={8}>
                    <VStack spacing={6}>
                      <Heading size="lg" color="green.600">
                        🎉 Votre MVP est prêt !
                      </Heading>

                      <Tabs variant="enclosed" w="full" onChange={setActiveTab}>
                        <TabList>
                          <Tab>🎨 Interface UI</Tab>
                          <Tab>⚙️ Backend API</Tab>
                          <Tab>🏗️ Architecture</Tab>
                          <Tab>💼 Business Plan</Tab>
                        </TabList>

                        <TabPanels>
                          <TabPanel>
                            <ResultCard
                              title="Composants React générés"
                              icon={FiCode}
                              content={result.ui}
                            />
                          </TabPanel>
                          <TabPanel>
                            <ResultCard
                              title="API REST complète"
                              icon={FiDatabase}
                              content={result.backend}
                            />
                          </TabPanel>
                          <TabPanel>
                            <ResultCard
                              title="Plan technique"
                              icon={FiCloud}
                              content={result.architecture}
                            />
                          </TabPanel>
                          <TabPanel>
                            <ResultCard
                              title="Stratégie business"
                              icon={FiTrendingUp}
                              content={result.business}
                            />
                          </TabPanel>
                        </TabPanels>
                      </Tabs>

                      <HStack spacing={4}>
                        <Button colorScheme="green" leftIcon={<FiGlobe />}>
                          Déployer maintenant
                        </Button>
                        <Button variant="outline" leftIcon={<FiCode />}>
                          Télécharger le code
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            )}
          </AnimatePresence>
        </MotionVStack>
      </Container>
    </Box>
  );
}

function ResultCard({ title, icon, content }: any) {
  return (
    <Card>
      <CardBody>
        <VStack align="start" spacing={4}>
          <HStack>
            <Icon as={icon} color="blue.500" />
            <Heading size="md">{title}</Heading>
          </HStack>
          <Box
            p={4}
            bg="gray.50"
            borderRadius="md"
            w="full"
            maxH="400px"
            overflowY="auto"
          >
            <Text fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
              {JSON.stringify(content, null, 2)}
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}

import React from "react";

const ModernGenerator: React.FC = () => (
  <Box
    p={8}
    borderRadius="md"
    boxShadow="md"
    bg="white"
    position="relative"
    overflow="hidden"
  >
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgGradient="linear(to-br, blue.100, purple.100)"
      zIndex={0}
    />
    <VStack
      p={8}
      spacing={4}
      borderRadius="md"
      boxShadow="md"
      bg="white"
      position="relative"
      zIndex={1}
    >
      <Heading size="lg" mb={4} color="blue.600">
        Générateur Moderne
      </Heading>
      <Text>
        Ce composant est prêt pour intégrer des fonctionnalités de génération
        assistée par IA.
      </Text>
    </VStack>
  </Box>
);

export default ModernMVPGenerator;
