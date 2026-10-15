// src/screens/PlaylistsScreen.js
import { useState } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, Modal,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { initialPlaylists, playlistColors } from '../data';

export default function PlaylistsScreen() {
  const [tab, setTab] = useState('downloaded'); // 'downloaded' ou 'streaming'
  const [query, setQuery] = useState('');
  const [lists, setLists] = useState(initialPlaylists);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  // Playlists de l'onglet actif, filtrées par la recherche
  const visible = lists[tab].filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  function createPlaylist() {
    const name = newName.trim();
    if (!name) return; // on n'accepte pas un nom vide
    const playlist = {
      id: Date.now().toString(),
      title: name,
      count: 0,
      color: playlistColors[Math.floor(Math.random() * playlistColors.length)],
    };
    // La nouvelle playlist est ajoutée en premier dans l'onglet actif
    setLists({ ...lists, [tab]: [playlist, ...lists[tab]] });
    setNewName('');
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher dans mes playlists..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Onglets Téléchargées / Streaming */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === 'downloaded' && styles.tabActive]}
          onPress={() => setTab('downloaded')}
        >
          <Ionicons
            name="download-outline"
            size={16}
            color={tab === 'downloaded' ? colors.text : colors.textMuted}
          />
          <Text style={[styles.tabText, tab === 'downloaded' && styles.tabTextActive]}>
            Téléchargées
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'streaming' && styles.tabActive]}
          onPress={() => setTab('streaming')}
        >
          <Ionicons
            name="cloud-outline"
            size={16}
            color={tab === 'streaming' ? colors.text : colors.textMuted}
          />
          <Text style={[styles.tabText, tab === 'streaming' && styles.tabTextActive]}>
            Streaming
          </Text>
        </Pressable>
      </View>

      {/* Bouton nouvelle playlist */}
      <Pressable style={styles.newButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={22} color={colors.text} />
        <Text style={styles.newButtonText}>Nouvelle playlist</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Récentes</Text>

      {/* Liste des playlists */}
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query ? 'Aucune playlist trouvée.' : 'Aucune playlist ici pour le moment.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.row}>
            <View style={[styles.cover, { backgroundColor: item.color }]}>
              <Ionicons name="musical-notes" size={24} color="rgba(255,255,255,0.6)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.rowSubtitle}>{item.count} titres</Text>
            </View>
            <Ionicons
              name={tab === 'downloaded' ? 'arrow-down-circle' : 'cloud-outline'}
              size={22}
              color={tab === 'downloaded' ? colors.primary : colors.textMuted}
            />
          </Pressable>
        )}
      />

      {/* Fenêtre de création */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nouvelle playlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nom de la playlist"
              placeholderTextColor={colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => { setModalVisible(false); setNewName(''); }}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.modalCreate} onPress={createPlaylist}>
                <Text style={styles.modalCreateText}>Créer</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 14 },
  tabTextActive: { color: colors.text },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  newButtonText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 14 },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 20,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 16 },
  rowSubtitle: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
  empty: { color: colors.textMuted, fontFamily: fonts.regular, textAlign: 'center', marginTop: 32 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { color: colors.text, fontFamily: fonts.bold, fontSize: 18, marginBottom: 16 },
  modalInput: {
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 16 },
  modalCancelText: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 15 },
  modalCreate: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  modalCreateText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 15 },
});