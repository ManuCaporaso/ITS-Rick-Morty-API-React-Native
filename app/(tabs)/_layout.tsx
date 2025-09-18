import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabScreensLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'teal',
      headerShown: false, // We hide this header because the main stack provides one
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Personajes',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}