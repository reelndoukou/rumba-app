// App.js
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme';
import Placeholder from './src/Placeholder';
import { useFonts, Figtree_400Regular, Figtree_600SemiBold, Figtree_700Bold } from '@expo-google-fonts/figtree';
import HomeScreen from './src/screens/HomeScreen';
import PlaylistsScreen from './src/screens/PlaylistsScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import NewsScreen from './src/screens/NewsScreen';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background },
};

// Une icône pour chaque onglet (version pleine quand actif, contour sinon)
const icons = {
  Accueil: ['home', 'home-outline'],
  Playlists: ['musical-notes', 'musical-notes-outline'],
  Lecteur: ['disc', 'disc-outline'],
  News: ['newspaper', 'newspaper-outline'],
  Profil: ['person-circle', 'person-circle-outline'],
};

export default function App() {
  const [fontsLoaded] = useFonts({ Figtree_400Regular, Figtree_600SemiBold, Figtree_700Bold });
  if (!fontsLoaded) return null; // on attend que la police soit chargée
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarIcon: ({ focused, color }) => {
            const [active, inactive] = icons[route.name];
            return <Ionicons name={focused ? active : inactive} size={26} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Playlists" component={PlaylistsScreen} />
        <Tab.Screen name="Lecteur" component={PlayerScreen} options={{ tabBarStyle: { display: 'none' } }}/>
        <Tab.Screen name="News" component={NewsScreen} />
        <Tab.Screen name="Profil">{() => <Placeholder title="Profil" />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
