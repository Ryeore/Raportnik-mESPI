import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeedScreen from './features/feed/FeedScreen';
import ReportDetailScreen from './features/feed/ReportDetailScreen';
import { refreshFeed } from './api/reports';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  React.useEffect(() => {
    refreshFeed().catch(() => {});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Raportnik' }} />
          <Stack.Screen name="ReportDetail" component={ReportDetailScreen} options={{ title: 'Raport' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
