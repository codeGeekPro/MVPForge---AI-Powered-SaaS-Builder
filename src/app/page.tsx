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
  Flex,
  Grid,
  GridItem,
  Textarea,
  Card,
  CardBody,
  Image,
  SimpleGrid,
  Badge,
  Divider,
  Link,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useColorMode } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import LogsDashboard from "./logs-dashboard";
import Head from 'next/head';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';
import { styles } from './styles';

export default function Home() {
  // Gestion de la langue
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  
  const translations = {
    fr: {
      tagline: "De l'idée au prototype en 60 secondes. Sans coder. Sans attendre.",
      title: "SaasForge 🚀",
      subtitle: "L'IA qui transforme vos idées en MVP révolutionnaires",
      examples: "Exemples de SaaS créés avec SaasForge",
      describe: "Décrivez votre vision SaaS",
      randomIdea: "Idée aléatoire",
      generateMvp: "GÉNÉRER MON MVP",
      multiAgents: "Analyse IA avancée",
      codeZip: "Télécharger le code ZIP",
      experiments: "Expérimentations A/B",
      howItWorks: "Comment ça marche ?",
      step1: "1. Décrivez votre idée",
      step1Desc: "Expliquez simplement votre concept SaaS",
      step2: "2. L'IA construit votre MVP",
      step2Desc: "Notre équipe d'agents IA bâtit votre MVP de A à Z",
      step3: "3. Téléchargez et testez",
      step3Desc: "Code prêt à déployer en un clic",
      plans: "Plans et Tarifs",
      preview: "Aperçu interactif du MVP",
      analytics: "Tableau de bord analytique"
    },
    en: {
      tagline: "From idea to prototype in 60 seconds. No coding. No waiting.",
      title: "SaasForge 🚀",
      subtitle: "AI that transforms your ideas into revolutionary MVPs",
      examples: "SaaS examples created with MVPForge",
      describe: "Describe your SaaS vision",
      randomIdea: "Random idea",
      generateMvp: "GENERATE MY MVP",
      multiAgents: "Advanced AI Analysis",
      codeZip: "Download ZIP code",
      experiments: "A/B Experiments",
      howItWorks: "How it works?",
      step1: "1. Describe your idea",
      step1Desc: "Simply explain your SaaS concept",
      step2: "2. The AI builds your MVP",
      step2Desc: "Our squad of AI agents builds your MVP from A to Z",
      step3: "3. Download and test",
      step3Desc: "Production-ready code in one click",
      plans: "Plans & Pricing",
      analytics: "Analytics dashboard"
    }
  };

  const t = translations[language];

  // Idées SaaS aléatoires
  const randomIdeas = [
    "Créer une marketplace pour coachs sportifs indépendants",
    "Plateforme de mise en relation artistes/clients avec IA",
    "SaaS de gestion automatisée des freelances et facturation",
    "Application de suivi nutritionnel personnalisé par IA",
    "Outil de création de formations en ligne avec avatars IA",
    "Plateforme de covoiturage pour animaux de compagnie",
    "SaaS de gestion d'inventaire pour petits commerces",
    "Application de méditation personnalisée par données biométriques",
    "Marketplace de services juridiques en ligne",
    "Outil de planification automatique de jardins urbains"
  ];

  // Idée démo pré-remplie
  const [prompt, setPrompt] = useState(randomIdeas[0]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [multiAgents, setMultiAgents] = useState<any>(null);
  const [experiments, setExperiments] = useState<any>(null);

  // Métriques simulées pour affichage
  const [metrics] = useState({
    users: 1245,
    mrr: 890,
    uptime: "99.99%",
    builds: 312,
  });

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("http://localhost:4000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setResult("Erreur lors de la génération IA");
    }
    setLoading(false);
  };

  const handleMultiAgents = async () => {
    setLoading(true);
    setMultiAgents(null);
    try {
      const res = await fetch("http://localhost:4000/api/ai/multi-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: prompt }),
      });
      const data = await res.json();
      setMultiAgents(data);
    } catch (e) {
      setMultiAgents({ error: "Erreur multi-agents" });
    }
    setLoading(false);
  };

  const handleExperiments = async () => {
    setLoading(true);
    setExperiments(null);
    try {
      const res = await fetch("http://localhost:4000/api/ai/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: prompt }),
      });
      const data = await res.json();
      setExperiments(data);
    } catch (e) {
      setExperiments({ error: "Erreur expérimentations" });
    }
    setLoading(false);
  };

  const handleDownloadCode = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/ai/generate-code-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: prompt }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mvp-code.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erreur téléchargement:", e);
    }
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

  // Fonction pour générer une idée aléatoire
  const handleRandomIdea = () => {
    const randomIndex = Math.floor(Math.random() * randomIdeas.length);
    setPrompt(randomIdeas[randomIndex]);
  };

  // Gestion du mode clair/sombre Chakra UI
  const { colorMode, toggleColorMode } = useColorMode();
  // Dashboard de résultats
  return (
    <>
      <Head>
        <title>SaasForge – Générateur de MVP IA</title>
        <meta name="description" content="Créez un MVP SaaS complet en 60 secondes grâce à l'IA. Sans coder. Sans attendre. Essayez SaasForge gratuitement !" />
        <meta name="keywords" content="SaaS, MVP, IA, générateur, startup, no-code, prototype, hackathon" />
      </Head>
      <Box as="header" {...styles.header} role="banner">
        <Flex align="center" justify="space-between" {...styles.mainContainer}>
          <HStack spacing={4}>
            <Image 
              src="/logo.svg" 
              alt="Logo SaasForge - Une fusée stylisée représentant l'innovation et la rapidité" 
              boxSize="48px" 
            />
            <Heading as="h1" size="xl" color="white" fontWeight="extrabold">SaasForge</Heading>
          </HStack>
          <nav aria-label="Navigation principale">
            <HStack spacing={8} as="ul" role="menubar">
              <li role="none"><Button variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} role="menuitem" aria-label="Accueil">Accueil</Button></li>
              <li role="none"><Button variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} role="menuitem" aria-label="Fonctionnalités">Fonctionnalités</Button></li>
              <li role="none"><Button variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} role="menuitem" aria-label="Tarifs">Tarifs</Button></li>
              <li role="none"><Button variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} role="menuitem" aria-label="Contact">Contact</Button></li>
              <li role="none"><Button colorScheme="orange" size="lg" fontWeight="bold" px={6} role="menuitem" aria-label="Essayez gratuitement">Essayez gratuitement</Button></li>
              <li role="none"><Button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} variant="outline" color="white" _hover={{ bg: "whiteAlpha.200" }} role="menuitem" aria-label="Changer la langue">{language === 'fr' ? 'FR' : 'EN'}</Button></li>
            </HStack>
          </nav>
        </Flex>
      </Box>
      <Box as="main" role="main" tabIndex={-1} aria-label="Contenu principal" {...styles.mainContainer}>
        {/* Hero Section */}
        <VStack {...styles.heroSection} role="banner" aria-label="Section principale">
          <Heading as="h1" {...styles.heroTitle}>
            {t.title}
          </Heading>
          <Text {...styles.heroSubtitle}>
            {t.tagline}
          </Text>
          <Text {...styles.heroDescription}>
            {t.subtitle}
          </Text>
        </VStack>

        {/* Section Comment ça marche */}
        <Box mb={16} role="region" aria-label="Comment ça marche">
          <Heading {...styles.sectionHeading}>
            {t.howItWorks}
          </Heading>
          <SimpleGrid {...styles.featureGrid}>
            <VStack {...styles.card} role="article" aria-label="Étape 1">
              <Badge {...styles.badge} colorScheme="purple">1</Badge>
              <Text fontSize="xl" fontWeight="bold">{t.step1}</Text>
              <Text fontSize="md" color="gray.600">{t.step1Desc}</Text>
            </VStack>
            <VStack {...styles.card} role="article" aria-label="Étape 2">
              <Badge {...styles.badge} colorScheme="blue">2</Badge>
              <Text fontSize="xl" fontWeight="bold">{t.step2}</Text>
              <Text fontSize="md" color="gray.600">{t.step2Desc}</Text>
            </VStack>
            <VStack {...styles.card} role="article" aria-label="Étape 3">
              <Badge {...styles.badge} colorScheme="green">3</Badge>
              <Text fontSize="xl" fontWeight="bold">{t.step3}</Text>
              <Text fontSize="md" color="gray.600">{t.step3Desc}</Text>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Section Génération */}
        <Box mb={16} role="region" aria-label="Générateur de MVP">
          <VStack spacing={8} {...styles.card}>
            <Heading size="xl" color="purple.700" textAlign="center">
              {t.describe}
            </Heading>
            <Textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              size="lg"
              h="120px"
              resize="none"
              borderRadius="lg"
              shadow="md"
              _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)" }}
              aria-label="Description de votre idée SaaS"
              placeholder="Décrivez votre idée de SaaS ici..."
            />
            <HStack spacing={4} w="full">
              <Button 
                {...styles.primaryButton} 
                onClick={handleGenerate} 
                isLoading={loading} 
                flex={1}
                aria-label="Générer mon MVP"
              >
                {t.generateMvp}
              </Button>
              <Button 
                {...styles.secondaryButton} 
                onClick={handleRandomIdea}
                aria-label="Obtenir une idée aléatoire"
              >
                {t.randomIdea}
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Section Métriques */}
        <Box mb={16} role="region" aria-label="Tableau de bord analytique">
          <Heading {...styles.sectionHeading}>
            {t.analytics}
          </Heading>
          <SimpleGrid columns={[2, 4]} spacing={6}>
            <VStack {...styles.metricCard} role="article" aria-label="Nombre d'utilisateurs">
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">{metrics.users}</Text>
              <Text fontSize="sm" color="gray.500">Utilisateurs</Text>
            </VStack>
            <VStack {...styles.metricCard} role="article" aria-label="Revenu mensuel récurrent">
              <Text fontSize="3xl" fontWeight="bold" color="green.600">{metrics.mrr} €</Text>
              <Text fontSize="sm" color="gray.500">MRR simulé</Text>
            </VStack>
            <VStack {...styles.metricCard} role="article" aria-label="Taux de disponibilité">
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">{metrics.uptime}</Text>
              <Text fontSize="sm" color="gray.500">Disponibilité</Text>
            </VStack>
            <VStack {...styles.metricCard} role="article" aria-label="Nombre de builds">
              <Text fontSize="3xl" fontWeight="bold" color="orange.600">{metrics.builds}</Text>
              <Text fontSize="sm" color="gray.500">Builds générés</Text>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Section Plans et Tarifs */}
        <Box mb={16} role="region" aria-label="Plans et tarifs">
          <Heading {...styles.sectionHeading}>
            {t.plans}
          </Heading>
          <SimpleGrid {...styles.featureGrid}>
            <VStack {...styles.pricingCard} role="article" aria-label="Plan Découverte">
              <Badge {...styles.badge} colorScheme="gray">Gratuit</Badge>
              <Heading size="lg">Découverte</Heading>
              <Text fontSize="md" color="gray.600">Générez 3 MVP par mois</Text>
              <Text fontSize="3xl" fontWeight="bold">0€</Text>
              <Button {...styles.secondaryButton} aria-label="Commencer avec le plan Découverte">Commencer</Button>
            </VStack>
            <VStack {...styles.popularPricingCard} role="article" aria-label="Plan Pro">
              <Badge {...styles.badge} colorScheme="purple">Populaire</Badge>
              <Heading size="lg">Pro</Heading>
              <Text fontSize="md" color="gray.600">MVP illimités, support prioritaire</Text>
              <Text fontSize="3xl" fontWeight="bold">19€/mois</Text>
              <Button {...styles.primaryButton} aria-label="S'abonner au plan Pro">S'abonner</Button>
            </VStack>
            <VStack {...styles.pricingCard} role="article" aria-label="Plan Business">
              <Badge {...styles.badge} colorScheme="orange">Entreprise</Badge>
              <Heading size="lg">Business</Heading>
              <Text fontSize="md" color="gray.600">API, intégrations avancées, équipe</Text>
              <Text fontSize="3xl" fontWeight="bold">49€/mois</Text>
              <Button {...styles.secondaryButton} aria-label="Contactez-nous pour le plan Business">Contactez-nous</Button>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Section monitoring/logs */}
        <Box mt={16}>
          <LogsDashboard />
        </Box>
      </Box>
      <Box as="footer" role="contentinfo" bg="gray.900" color="gray.100" py={8} mt={16}>
        <Container maxW="1400px">
          <VStack spacing={4}>
            <Text>SaasForge – L'IA au service de votre startup</Text>
            <HStack spacing={8}>
              <Link href="/mentions-legales" color="gray.300" _hover={{ color: "white" }}>Mentions légales</Link>
              <Link href="/politique-confidentialite" color="gray.300" _hover={{ color: "white" }}>Politique de confidentialité</Link>
              <Link href="/conditions-utilisation" color="gray.300" _hover={{ color: "white" }}>Conditions d'utilisation</Link>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </>
  );
}