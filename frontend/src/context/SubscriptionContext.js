// Subscription Context - Mock RevenueCat for testing
import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Mock RevenueCat offerings
const MOCK_OFFERINGS = {
  current: {
    identifier: 'premium',
    serverDescription: 'Premium Trading Signals',
    availablePackages: [
      {
        identifier: 'monthly',
        packageType: 'MONTHLY',
        product: {
          title: 'SignalDesk Premium',
          description: 'Access to all AI trading signals',
          priceString: '$49.99',
          price: 49.99,
          currencyCode: 'USD',
        },
      },
    ],
  },
};

export const SubscriptionProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [offerings, setOfferings] = useState(MOCK_OFFERINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    }
  }, [isAuthenticated]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionAPI.get();
      setSubscription(response.data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      // Set mock subscription for testing
      setSubscription({
        is_active: true,
        plan: 'premium_mock',
        price: 49.99,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        mock: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock purchase function (simulates RevenueCat purchase)
  const purchasePackage = async (packageToPurchase) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate purchase delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Activate subscription via backend
      const response = await subscriptionAPI.activate({
        is_active: true,
        plan: 'premium',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      
      setSubscription(response.data.subscription);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Purchase failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Mock restore purchases
  const restorePurchases = async () => {
    try {
      setLoading(true);
      await fetchSubscription();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to restore purchases' };
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await subscriptionAPI.cancel();
      setSubscription(prev => ({ ...prev, is_active: false }));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to cancel subscription' };
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = subscription?.is_active === true;

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        offerings,
        loading,
        error,
        isSubscribed,
        purchasePackage,
        restorePurchases,
        cancelSubscription,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
