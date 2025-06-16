import { SystemStyleObject } from "@chakra-ui/styled-system";

const cardStyle: SystemStyleObject = {
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

export const styles = {
  primaryButton: {
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
  },

  secondaryButton: {
    size: "md",
    variant: "outline",
    colorScheme: "purple",
    px: 6,
    py: 4,
    borderRadius: "lg",
  },

  sectionHeading: {
    size: "2xl",
    color: "purple.700",
    mb: 8,
    textAlign: "center",
    fontWeight: "extrabold",
    letterSpacing: "tight",
  },

  card: cardStyle,

  metricCard: {
    bg: "whiteAlpha.900",
    p: 4,
    borderRadius: "lg",
    shadow: "md",
    textAlign: "center",
  },

  badge: {
    px: 3,
    py: 1,
    borderRadius: "full",
    fontWeight: "bold",
    fontSize: "sm",
  },

  header: {
    bgGradient: "linear(to-r, purple.600, blue.500)",
    py: 6,
    px: 8,
    boxShadow: "lg",
  },

  mainContainer: {
    maxW: "1400px",
    mx: "auto",
    px: 8,
  },

  heroSection: {
    spacing: 8,
    py: 16,
    textAlign: "center",
  },

  heroTitle: {
    size: "3xl",
    bgGradient: "linear(to-r, purple.600, blue.500)",
    bgClip: "text",
    fontWeight: "extrabold",
  },

  heroSubtitle: {
    fontSize: "2xl",
    color: "gray.600",
    maxW: "800px",
  },

  heroDescription: {
    fontSize: "xl",
    color: "gray.500",
    maxW: "600px",
  },

  featureGrid: {
    columns: [1, 3],
    spacing: 8,
  },

  pricingCard: {
    ...cardStyle,
    align: "center",
  },

  popularPricingCard: {
    ...cardStyle,
    align: "center",
    border: "2px solid",
    borderColor: "purple.200",
    bg: "purple.50",
  },
};