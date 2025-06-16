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

export default function MentionsLegales() {
  return (
    <Container maxW="4xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" color="purple.700">
          Mentions Légales
        </Heading>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Éditeur du site
          </Heading>
          <Text>
            SaasForge<br />
            [Adresse]<br />
            Email : contact@saasforge.com<br />
            SIRET : [Numéro SIRET]
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Hébergement
          </Heading>
          <Text>
            Vercel Inc.<br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789<br />
            États-Unis
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Propriété intellectuelle
          </Heading>
          <Text>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Protection des données personnelles
          </Heading>
          <Text>
            Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Cookies
          </Heading>
          <Text>
            Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez à tout moment désactiver l'utilisation de cookies en sélectionnant les paramètres appropriés de votre navigateur.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Liens utiles
          </Heading>
          <List spacing={2}>
            <ListItem>
              <Link href="/politique-confidentialite" color="purple.600">
                Politique de confidentialité
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