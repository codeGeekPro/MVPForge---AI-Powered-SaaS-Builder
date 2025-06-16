"use client";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  List,
  ListItem,
} from "@chakra-ui/react";

export default function PolitiqueConfidentialite() {
  return (
    <Container maxW="4xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" color="purple.700">
          Politique de Confidentialité
        </Heading>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Collecte des données
          </Heading>
          <Text>
            Nous collectons les informations suivantes :
          </Text>
          <List spacing={2} mt={2}>
            <ListItem>• Nom et prénom</ListItem>
            <ListItem>• Adresse email</ListItem>
            <ListItem>• Informations de paiement (via Stripe)</ListItem>
            <ListItem>• Données d'utilisation du service</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Utilisation des données
          </Heading>
          <Text>
            Les données collectées sont utilisées pour :
          </Text>
          <List spacing={2} mt={2}>
            <ListItem>• Fournir et améliorer nos services</ListItem>
            <ListItem>• Personnaliser votre expérience</ListItem>
            <ListItem>• Communiquer avec vous</ListItem>
            <ListItem>• Analyser l'utilisation du service</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Protection des données
          </Heading>
          <Text>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisés.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Vos droits
          </Heading>
          <Text>
            Conformément au RGPD, vous disposez des droits suivants :
          </Text>
          <List spacing={2} mt={2}>
            <ListItem>• Droit d'accès à vos données</ListItem>
            <ListItem>• Droit de rectification</ListItem>
            <ListItem>• Droit à l'effacement</ListItem>
            <ListItem>• Droit à la portabilité</ListItem>
            <ListItem>• Droit d'opposition</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Cookies
          </Heading>
          <Text>
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez les gérer via les paramètres de votre navigateur.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Contact
          </Heading>
          <Text>
            Pour toute question concernant cette politique de confidentialité, contactez-nous à :<br />
            Email : privacy@saasforge.com
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Liens utiles
          </Heading>
          <List spacing={2}>
            <ListItem>
              <Link href="/mentions-legales" color="purple.600">
                Mentions légales
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/conditions-utilisation" color="purple.600">
                Conditions d'utilisation
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/" color="purple.600">
                Retour à l'accueil
              </Link>
            </ListItem>
          </List>
        </Box>
      </VStack>
    </Container>
  );
} 