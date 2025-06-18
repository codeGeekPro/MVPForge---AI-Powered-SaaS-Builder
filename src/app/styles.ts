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
    size: "lg" as const,
    colorScheme: "purple" as const,
    fontWeight: "bold" as const,
    px: 8,
    py: 6,
    borderRadius: "xl" as const,
    boxShadow: "lg" as const,
    _hover: {
      transform: "translateY(-2px)",
      boxShadow: "xl" as const,
    },
    transition: "all 0.2s",
  },

  secondaryButton: {
    size: "md" as const,
    variant: "outline" as const,
    colorScheme: "purple" as const,
    px: 6,
    py: 4,
    borderRadius: "lg" as const,
  },

  sectionHeading: {
    size: "2xl" as const,
    color: "purple.700",
    mb: 8,
    textAlign: "center" as const,
    fontWeight: "extrabold" as const,
    letterSpacing: "tight" as const,
  },

  card: cardStyle,

  metricCard: {
    bg: "whiteAlpha.900",
    p: 4,
    borderRadius: "lg" as const,
    shadow: "md" as const,
    textAlign: "center" as const,
  },

  badge: {
    px: 3,
    py: 1,
    borderRadius: "full" as const,
    fontWeight: "bold" as const,
    fontSize: "sm" as const,
  },

  header: {
    bgGradient: "linear(to-r, purple.600, blue.500)" as const,
    py: 6,
    px: 8,
    boxShadow: "lg" as const,
  },

  mainContainer: {
    maxW: "1400px",
    mx: "auto",
    px: 8,
  },

  heroSection: {
    spacing: 8,
    py: 16,
    textAlign: "center" as const,
  },

  heroTitle: {
    size: "3xl" as const,
    bgGradient: "linear(to-r, purple.600, blue.500)" as const,
    bgClip: "text" as const,
    fontWeight: "extrabold" as const,
  },

  heroSubtitle: {
    fontSize: "2xl" as const,
    color: "gray.600",
    maxW: "800px",
  },

  heroDescription: {
    fontSize: "xl" as const,
    color: "gray.500",
    maxW: "600px",
  },

  featureGrid: {
    columns: [1, 3],
    spacing: 8,
  },

  pricingCard: {
    ...cardStyle,
    align: "center" as const,
  },

  popularPricingCard: {
    ...cardStyle,
    align: "center" as const,
    border: "2px solid",
    borderColor: "purple.200",
    bg: "purple.50",
  },
};