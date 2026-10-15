// src/screens/NewsScreen.js
import { useState } from 'react';
import { View, Text, ScrollView, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { catalogues, events, latestReleases, mostListened } from '../data';

// Barre de filtres par catalogue (réutilisée par deux sections)
function CatalogueFilter({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chips}
    >
      {catalogues.map((c) => (
        <Pressable
          key={c}
          onPress={() => onSelect(c)}
          style={[styles.chip, selected === c && styles.chipActive]}
        >
          <Text style={[styles.chipText, selected === c && styles.chipTextActive]}>{c}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// Garde seulement les éléments du catalogue choisi ("Tout" = pas de filtre)
function filterBy(items, catalogue) {
  return catalogue === 'Tout' ? items : items.filter((i) => i.catalogue === catalogue);
}

export default function NewsScreen() {
  const [releaseFilter, setReleaseFilter] = useState('Tout');
  const [listenedFilter, setListenedFilter] = useState('Tout');

  const releases = filterBy(latestReleases, releaseFilter).slice(0, 10);
  const listened = filterBy(mostListened, listenedFilter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>News</Text>

        {/* 1. Événements et concerts */}
        <Text style={styles.sectionTitle}>Événements et concerts</Text>
        <FlatList
          data={events}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable style={[styles.eventCard, { backgroundColor: item.color }]}>
              <Ionicons name="calendar" size={22} color="rgba(255,255,255,0.8)" />
              <View>
                <Text style={styles.eventDate}>{item.date}</Text>
                <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.placeRow}>
                  <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.eventPlace}>{item.place}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />

        {/* 2. Dernières sorties */}
        <Text style={styles.sectionTitle}>Dernières sorties</Text>
        <CatalogueFilter selected={releaseFilter} onSelect={setReleaseFilter} />
        <View style={styles.list}>
          {releases.length === 0 && <Text style={styles.empty}>Aucune sortie dans ce catalogue.</Text>}
          {releases.map((item) => (
            <Pressable key={item.id} style={styles.row}>
              <View style={[styles.cover, { backgroundColor: item.color }]}>
                <Ionicons name="musical-notes" size={22} color="rgba(255,255,255,0.6)" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.rowSubtitle} numberOfLines={1}>
                  {item.artist} · {item.catalogue}
                </Text>
              </View>
              <Text style={styles.rowDate}>{item.date}</Text>
            </Pressable>
          ))}
        </View>

        {/* 3. Les plus écoutés */}
        <Text style={styles.sectionTitle}>Les plus écoutés</Text>
        <CatalogueFilter selected={listenedFilter} onSelect={setListenedFilter} />
        <View style={styles.list}>
          {listened.length === 0 && <Text style={styles.empty}>Aucun artiste dans ce catalogue.</Text>}
          {listened.map((item, i) => (
            <Pressable key={item.id} style={styles.row}>
              <Text style={styles.rank}>{i + 1}</Text>
              <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Ionicons name="person" size={22} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.rowSubtitle}>{item.catalogue}</Text>
              </View>
              <Text style={styles.streams}>{item.streams} écoutes</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  screenTitle: { color: colors.text, fontFamily: fonts.bold, fontSize: 28, marginHorizontal: 16, marginTop: 12 },
  sectionTitle: { color: colors.text, fontFamily: fonts.bold, fontSize: 20, marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  eventCard: { width: 230, height: 150, borderRadius: 14, padding: 14, marginRight: 12, justifyContent: 'space-between' },
  eventDate: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.semibold, fontSize: 13 },
  eventTitle: { color: colors.text, fontFamily: fonts.bold, fontSize: 18, marginTop: 2 },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  eventPlace: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.regular, fontSize: 13 },
  chips: { paddingHorizontal: 16, paddingBottom: 12 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface,
    marginRight: 8, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 14 },
  chipTextActive: { color: colors.text },
  list: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  cover: { width: 52, height: 52, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rank: { color: colors.primary, fontFamily: fonts.bold, fontSize: 18, width: 28 },
  rowTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 16 },
  rowSubtitle: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
  rowDate: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 12 },
  streams: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13 },
  empty: { color: colors.textMuted, fontFamily: fonts.regular, textAlign: 'center', paddingVertical: 20 },
});