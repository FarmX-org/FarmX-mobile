import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    if (rootNavigation?.key) {
      router.replace('/login');
    }
  }, [rootNavigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting...</Text>
    </View>
  );
}
