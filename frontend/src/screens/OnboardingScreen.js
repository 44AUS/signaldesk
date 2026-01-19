// Onboarding Screen - Premium intro for SignalDesk AI
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    icon: 'pulse',
    title: 'AI-Powered Signals',
    description: 'Advanced GPT-5.2 technology analyzes markets 24/7 to deliver precise trading signals with entry, take-profit, and stop-loss levels.',
    gradient: [colors.buyGlow, 'transparent'],
  },
  {
    id: 2,
    icon: 'analytics',
    title: 'Institutional Grade',
    description: 'Built for serious traders. Real-time signals across crypto, stocks, forex, and commodities with confidence scores.',
    gradient: [colors.electricGlow, 'transparent'],
  },
  {
    id: 3,
    icon: 'shield-checkmark',
    title: 'Risk Management',
    description: 'Every signal includes risk-to-reward ratios and AI reasoning. Trade smarter with professional-grade analysis.',
    gradient: [colors.goldGlow, 'transparent'],
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== activeSlide) {
      setActiveSlide(slideIndex);
    }
  };

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Register');
    });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="trending-up" size={32} color={colors.buy} />
            </View>
            <Text style={styles.logoText}>SignalDesk</Text>
            <Text style={styles.logoSubtext}>AI</Text>
          </View>

          {/* Slides */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.slideContainer}
          >
            {SLIDES.map((slide) => (
              <View key={slide.id} style={styles.slide}>
                <LinearGradient
                  colors={slide.gradient}
                  style={styles.iconGradient}
                >
                  <View style={styles.slideIconContainer}>
                    <Ionicons name={slide.icon} size={48} color={colors.text} />
                  </View>
                </LinearGradient>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Pagination */}
          <View style={styles.pagination}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeSlide === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          {/* Pricing Info */}
          <View style={styles.pricingContainer}>
            <View style={styles.pricingBadge}>
              <Text style={styles.pricingLabel}>PREMIUM ACCESS</Text>
            </View>
            <Text style={styles.pricingAmount}>$49.99</Text>
            <Text style={styles.pricingPeriod}>/month</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
            testID="get-started-btn"
          >
            <LinearGradient
              colors={[colors.buy, colors.buyDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.text} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogin}
            activeOpacity={0.7}
            testID="login-link-btn"
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account? <Text style={styles.loginLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            Not financial advice. Trading involves risk.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.buyGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.buy,
    marginLeft: 4,
  },
  slideContainer: {
    flex: 1,
    maxHeight: 320,
  },
  slide: {
    width: width - spacing.lg * 2,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  slideIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cardHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  slideTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginVertical: spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.buy,
    width: 24,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  pricingBadge: {
    backgroundColor: colors.goldGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  pricingLabel: {
    ...typography.label,
    color: colors.gold,
    fontSize: 10,
  },
  pricingAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  pricingPeriod: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  primaryButton: {
    width: '100%',
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.buy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: {
    ...typography.h4,
    color: colors.text,
    marginRight: spacing.sm,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    color: colors.buy,
    fontWeight: '600',
  },
  disclaimer: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: spacing.md,
  },
});

export default OnboardingScreen;
