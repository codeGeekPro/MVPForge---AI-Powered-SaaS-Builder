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
import { generateMVP as apiGenerateMVP, multiAgents as apiMultiAgents, generateExperiments as apiGenerateExperiments, generateCodeZip as apiGenerateCodeZip, classifyIdea as apiClassify } from '@/lib/api';

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

  // Métriques simulées
  const metrics = {
    users: "2,847",
    mrr: "€12,450",
    uptime: "99.9%",
    builds: "156"
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    try {
      const data = await apiGenerateMVP(prompt);
      setResult((data as any).mvp || (data as any).result || "MVP généré avec succès !");
    } catch (e) {
      setResult("Erreur lors de la génération IA");
    }
    setLoading(false);
  };

  const handleMultiAgents = async () => {
    setLoading(true);
    setMultiAgents(null);
    try {
      const data = await apiMultiAgents(prompt);
      setMultiAgents(data);
    } catch (e) {
      setMultiAgents({ error: "Erreur lors de l'analyse multi-agents" });
    }
    setLoading(false);
  };

  const handleExperiments = async () => {
    setLoading(true);
    setExperiments(null);
    try {
      const data = await apiGenerateExperiments(prompt);
      setExperiments(data);
    } catch (e) {
      setExperiments({ error: "Erreur lors des expérimentations" });
    }
    setLoading(false);
  };

  const handleDownloadCode = async () => {
    try {
      const blob = await apiGenerateCodeZip(prompt);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mvp-code.zip';
      a.click();
    } catch (e) {
      console.error("Erreur téléchargement:", e);
    }
  };

  const handleClassify = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const data = await apiClassify(prompt);
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
  
  // Sécurisation des styles - isolation des propriétés problématiques
  const safeCardStyle = {
    bg: "whiteAlpha.900",
    p: 6,
    borderRadius: "xl",
    shadow: "lg",
    transition: "all 0.2s",
    _hover: {
      transform: "translateY(-2px)",
      shadow: "xl",
    },
  };

  const safeHeaderStyle = {
    bgGradient: "linear(to-r, purple.600, blue.500)",
    py: 6,
    px: 8,
    boxShadow: "lg",
  };

  const safeMainContainerStyle = {
    maxW: "1400px",
    mx: "auto",
    px: 8,
  };

  const safeHeroSectionStyle = {
    spacing: 8,
    py: 16,
    textAlign: "center" as const,
  };

  const safeSectionHeadingStyle = {
    size: "2xl",
    color: "purple.700",
    mb: 8,
    textAlign: "center" as const,
    fontWeight: "extrabold",
    letterSpacing: "tight",
  };

  const safeFeatureGridStyle = {
    columns: [1, 3],
    spacing: 8,
  };

  const safeMetricCardStyle = {
    bg: "whiteAlpha.900",
    p: 4,
    borderRadius: "lg",
    shadow: "md",
    textAlign: "center" as const,
  };

  const safeBadgeStyle = {
    px: 3,
    py: 1,
    borderRadius: "full",
    fontWeight: "bold",
    fontSize: "sm",
  };

  const safePricingCardStyle = {
    ...safeCardStyle,
    align: "center" as const,
  };

  const safePopularPricingCardStyle = {
    ...safeCardStyle,
    align: "center" as const,
    border: "2px solid",
    borderColor: "purple.200",
    bg: "purple.50",
  };

  const safePrimaryButtonStyle = {
    size: "lg",
    colorScheme: "purple",
    fontWeight: "bold",
    px: 8,
    py: 6,
    borderRadius: "xl",
    boxShadow: "lg",
    _hover: {
      transform: "translateY(-2px)",
      boxShadow: "xl",
    },
    transition: "all 0.2s",
  };

  const safeSecondaryButtonStyle = {
    size: "md",
    variant: "outline",
    colorScheme: "purple",
    px: 6,
    py: 4,
    borderRadius: "lg",
  };

  // Dashboard de résultats
  return (
    <>
      <Head>
        <title>SaasForge – Générateur de MVP IA</title>
        <meta name="description" content="Créez un MVP SaaS complet en 60 secondes grâce à l'IA. Sans coder. Sans attendre. Essayez SaasForge gratuitement !" />
        <meta name="keywords" content="SaaS, MVP, IA, générateur, startup, no-code, prototype, hackathon" />
      </Head>
      <Box as="header" {...safeHeaderStyle} role="banner">
        <Flex align="center" justify="space-between" {...safeMainContainerStyle}>
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
      <Box as="main" role="main" tabIndex={-1} aria-label="Contenu principal" {...safeMainContainerStyle}>
        {/* Hero Section */}
        <VStack {...safeHeroSectionStyle} role="banner" aria-label="Section principale">
          <Heading as="h1" size={styles.heroTitle.size} bgGradient={styles.heroTitle.bgGradient} bgClip={styles.heroTitle.bgClip} fontWeight={styles.heroTitle.fontWeight}>
            {t.title}
          </Heading>
          <Text fontSize={styles.heroSubtitle.fontSize} color={styles.heroSubtitle.color} maxW={styles.heroSubtitle.maxW}>
            {t.tagline}
          </Text>
          <Text fontSize={styles.heroDescription.fontSize} color={styles.heroDescription.color} maxW={styles.heroDescription.maxW}>
            {t.subtitle}
          </Text>
        </VStack>

        {/* Section Comment ça marche */}
        <Box mb={16} role="region" aria-label="Comment ça marche">
          <Heading {...safeSectionHeadingStyle}>
            {t.howItWorks}
          </Heading>
          <SimpleGrid {...safeFeatureGridStyle}>
            <VStack {...safeCardStyle} role="article" aria-label="Étape 1">
              <Badge {...safeBadgeStyle} colorScheme="purple">1</Badge>
              <Text fontSize="xl" fontWeight="bold">{t.step1}</Text>
              <Text fontSize="md" color="gray.600">{t.step1Desc}</Text>
            </VStack>
            <VStack {...safeCardStyle} role="article" aria-label="Étape 2">
              <Badge {...safeBadgeStyle} colorScheme="blue">2</Badge>
              <Text fontSize="xl" fontWeight="bold">{t.step2}</Text>
              <Text fontSize="md" color="gray.600">{t.step2Desc}</Text>
            </VStack>
            <VStack {...safeCardStyle} role="article" aria-label="Étape 3">
              <Badge {...safeBadgeStyle} colorScheme="green">3</Badge>
              <Text fontSize="xl" fontWeight="bold">{t.step3}</Text>
              <Text fontSize="md" color="gray.600">{t.step3Desc}</Text>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Section Génération */}
        <Box mb={16} role="region" aria-label="Générateur de MVP">
          <VStack spacing={8} {...safeCardStyle}>
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
                {...safePrimaryButtonStyle} 
                onClick={handleGenerate} 
                isLoading={loading} 
                flex={1}
                aria-label="Générer mon MVP"
              >
                {t.generateMvp}
              </Button>
              <Button 
                {...safeSecondaryButtonStyle} 
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
          <Heading {...safeSectionHeadingStyle}>
            {t.analytics}
          </Heading>
          <SimpleGrid columns={[2, 4]} spacing={6}>
            <VStack {...safeMetricCardStyle} role="article" aria-label="Nombre d'utilisateurs">
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">{metrics.users}</Text>
              <Text fontSize="sm" color="gray.500">Utilisateurs</Text>
            </VStack>
            <VStack {...safeMetricCardStyle} role="article" aria-label="Revenu mensuel récurrent">
              <Text fontSize="3xl" fontWeight="bold" color="green.600">{metrics.mrr} €</Text>
              <Text fontSize="sm" color="gray.500">MRR simulé</Text>
            </VStack>
            <VStack {...safeMetricCardStyle} role="article" aria-label="Taux de disponibilité">
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">{metrics.uptime}</Text>
              <Text fontSize="sm" color="gray.500">Disponibilité</Text>
            </VStack>
            <VStack {...safeMetricCardStyle} role="article" aria-label="Nombre de builds">
              <Text fontSize="3xl" fontWeight="bold" color="orange.600">{metrics.builds}</Text>
              <Text fontSize="sm" color="gray.500">Builds générés</Text>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Section Plans et Tarifs */}
        <Box mb={16} role="region" aria-label="Plans et tarifs">
          <Heading {...safeSectionHeadingStyle}>
            {t.plans}
          </Heading>
          <SimpleGrid {...safeFeatureGridStyle}>
            <VStack {...safePricingCardStyle} role="article" aria-label="Plan Découverte">
              <Badge {...safeBadgeStyle} colorScheme="gray">Gratuit</Badge>
              <Heading size="lg">Découverte</Heading>
              <Text fontSize="md" color="gray.600">Générez 3 MVP par mois</Text>
              <Text fontSize="3xl" fontWeight="bold">0€</Text>
              <Button {...safeSecondaryButtonStyle} aria-label="Commencer avec le plan Découverte">Commencer</Button>
            </VStack>
            <VStack {...safePopularPricingCardStyle} role="article" aria-label="Plan Pro">
              <Badge {...safeBadgeStyle} colorScheme="purple">Populaire</Badge>
              <Heading size="lg">Pro</Heading>
              <Text fontSize="md" color="gray.600">MVP illimités, support prioritaire</Text>
              <Text fontSize="3xl" fontWeight="bold">19€/mois</Text>
              <Button {...safePrimaryButtonStyle} aria-label="S'abonner au plan Pro">S'abonner</Button>
            </VStack>
            <VStack {...safePricingCardStyle} role="article" aria-label="Plan Business">
              <Badge {...safeBadgeStyle} colorScheme="orange">Entreprise</Badge>
              <Heading size="lg">Business</Heading>
              <Text fontSize="md" color="gray.600">API, intégrations avancées, équipe</Text>
              <Text fontSize="3xl" fontWeight="bold">49€/mois</Text>
              <Button {...safeSecondaryButtonStyle} aria-label="Contactez-nous pour le plan Business">Contactez-nous</Button>
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