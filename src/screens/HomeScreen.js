// src/screens/HomeScreen.js
import { useState } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { catalogues, topVideos, topArtists, topPlaylists, topAlbums } from '../data';

// Une carte (pochette + titre + sous-titre). round = true pour les artistes.
function Card({ item, round, wide }) {
  return (
    <Pressable style={[styles.card, wide && styles.cardWide]}>
      <View
        style={[
          styles.cover,
          wide && styles.coverWide,
          round && styles.coverRound,
          { backgroundColor: item.color },
        ]}
      >
        <Ionicons name="musical-note" size={30} color="rgba(255,255,255,0.6)" />
      </View>
      <Text style={[styles.cardTitle, round && styles.centered]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.cardSubtitle, round && styles.centered]} numberOfLines={1}>
        {item.subtitle}
      </Text>
    </Pressable>
  );
}

// Un titre de section + une liste qui défile horizontalement
function Section({ title, data, round, wide }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <Card item={item} round={round} wide={wide} />}
      />
    </View>
  );
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [catalogue, setCatalogue] = useState('Tout');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Barre de recherche en haut */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une chanson, un artiste..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filtre par catalogue */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {catalogues.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCatalogue(c)}
              style={[styles.chip, catalogue === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, catalogue === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Section title="Top clips vidéo" data={topVideos} wide />
        <Section title="Top artistes" data={topArtists} round />
        <Section title="Top playlists" data={topPlaylists} />
        <Section title="Top albums" data={topAlbums} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.text, marginLeft: 8, fontFamily: fonts.regular, fontSize: 15 },
  chips: { paddingHorizontal: 16, paddingVertical: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 14 },
  chipTextActive: { color: colors.text },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 20,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: { width: 130, marginRight: 14 },
  cardWide: { width: 240 },
  cover: {
    width: 130,
    height: 130,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coverWide: { width: 240, height: 135 },
  coverRound: { borderRadius: 65 },
  cardTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 14 },
  cardSubtitle: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  centered: { textAlign: 'center' },
});