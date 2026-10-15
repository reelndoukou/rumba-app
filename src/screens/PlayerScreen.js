// src/screens/PlayerScreen.js
import { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Modal, Share, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { colors, fonts } from '../theme';
import { tracks as initialTracks, initialPlaylists } from '../data';

function formatTime(seconds) {
  const s = Math.floor(seconds || 0);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

// Fenêtre qui monte depuis le bas de l'écran
function BottomSheet({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetOverlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHandle} />
          {title ? <Text style={styles.sheetTitle}>{title}</Text> : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function PlayerScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const firstRender = useRef(true);
  const sleepTimer = useRef(null);

  const [list, setList] = useState(initialTracks);
  const [pageHeight, setPageHeight] = useState(0);
  const [index, setIndex] = useState(0);
  const [barWidth, setBarWidth] = useState(1);

  const [panelOpen, setPanelOpen] = useState(false); // panneau flèche vers le bas
  const [favorites, setFavorites] = useState([]);    // ids des titres favoris
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState(0); // 0 = minuteur éteint
  const [sheet, setSheet] = useState(null);            // null | 'menu' | 'playlists' | 'artist'

  const current = list[index];
  const player = useAudioPlayer(initialTracks[0].url);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // Charge et lance la nouvelle chanson dès que la chanson affichée change
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!current) return;
    player.replace(current.url);
    player.play();
  }, [current?.id]);

  // Répéter = relire la même chanson en boucle
  useEffect(() => {
    player.loop = repeat;
  }, [repeat]);

  // Quand une chanson se termine, on passe à la suivante
  useEffect(() => {
    if (status.didJustFinish && !repeat) goNext();
  }, [status.didJustFinish]);

  // Nettoyage du minuteur si on quitte l'écran
  useEffect(() => () => clearTimeout(sleepTimer.current), []);

  function goTo(newIndex) {
    setIndex(newIndex);
    listRef.current?.scrollToIndex({ index: newIndex, animated: true });
  }

  function goNext() {
    if (list.length < 2) return;
    let next;
    if (shuffle) {
      do {
        next = Math.floor(Math.random() * list.length);
      } while (next === index);
    } else {
      next = (index + 1) % list.length;
    }
    goTo(next);
  }

  function togglePlay() {
    if (status.playing) player.pause();
    else player.play();
  }

  function seek(event) {
    if (!status.duration) return;
    const ratio = event.nativeEvent.locationX / barWidth;
    player.seekTo(ratio * status.duration);
  }

  function onScrollEnd(event) {
    const newIndex = Math.round(event.nativeEvent.contentOffset.y / pageHeight);
    if (newIndex !== index) setIndex(newIndex);
  }

  function toggleFavorite() {
    setFavorites((f) => (f.includes(current.id) ? f.filter((id) => id !== current.id) : [...f, current.id]));
  }

  // Minuteur : éteint -> 15 -> 30 -> 60 -> éteint
  function cycleSleep() {
    const steps = [0, 15, 30, 60];
    const next = steps[(steps.indexOf(sleepMinutes) + 1) % steps.length];
    setSleepMinutes(next);
    clearTimeout(sleepTimer.current);
    if (next > 0) {
      sleepTimer.current = setTimeout(() => {
        player.pause();
        setSleepMinutes(0);
      }, next * 60 * 1000);
    }
  }

  async function shareTrack() {
    setSheet(null);
    try {
      await Share.share({
        message: `Écoute "${current.title}" de ${current.artist} sur Rumba App !`,
      });
    } catch (e) {
      // l'utilisateur a fermé la fenêtre de partage : rien à faire
    }
  }

  function soon(message) {
    setSheet(null);
    setTimeout(() => Alert.alert('Bientôt disponible', message), 300);
  }

  function addToPlaylist(playlistTitle) {
    setSheet(null);
    setTimeout(() => Alert.alert('Ajouté', `"${current.title}" ajouté à "${playlistTitle}".`), 300);
  }

  function confirmDelete() {
    setSheet(null);
    setTimeout(() => {
      Alert.alert('Supprimer', `Retirer "${current.title}" de la liste ?`, [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            if (list.length < 2) {
              Alert.alert('Impossible', 'Il doit rester au moins un titre.');
              return;
            }
            const newList = list.filter((t) => t.id !== current.id);
            const newIndex = Math.min(index, newList.length - 1);
            setList(newList);
            setIndex(newIndex);
            setTimeout(() => listRef.current?.scrollToIndex({ index: newIndex, animated: false }), 50);
          },
        },
      ]);
    }, 300);
  }

  const progress = status.duration ? status.currentTime / status.duration : 0;
  const isFavorite = current && favorites.includes(current.id);
  const allPlaylists = [...initialPlaylists.downloaded, ...initialPlaylists.streaming];

  // Boutons du panneau
  const panelButtons = [
    { key: 'fav', icon: isFavorite ? 'heart' : 'heart-outline', active: isFavorite, onPress: toggleFavorite, label: 'Favori' },
    { key: 'repeat', icon: 'repeat', active: repeat, onPress: () => setRepeat(!repeat), label: 'Répéter' },
    { key: 'shuffle', icon: 'shuffle', active: shuffle, onPress: () => setShuffle(!shuffle), label: 'Aléatoire' },
    { key: 'timer', icon: 'time-outline', active: sleepMinutes > 0, onPress: cycleSleep, label: sleepMinutes ? `${sleepMinutes} min` : 'Minuteur' },
    { key: 'more', icon: 'ellipsis-horizontal', active: false, onPress: () => setSheet('menu'), label: 'Plus' },
  ];

  return (
    <View style={styles.container} onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}>
      {pageHeight > 0 && (
        <FlatList
          ref={listRef}
          data={list}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={pageHeight}
          onMomentumScrollEnd={onScrollEnd}
          getItemLayout={(_, i) => ({ length: pageHeight, offset: pageHeight * i, index: i })}
          renderItem={({ item }) => (
            <LinearGradient
              colors={[item.color, colors.background]}
              style={{ height: pageHeight, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={[styles.cover, { backgroundColor: item.color }]}>
                <Ionicons name="musical-notes" size={90} color="rgba(255,255,255,0.5)" />
              </View>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
              <View style={styles.streamsRow}>
                <Ionicons name="headset-outline" size={16} color={colors.textMuted} />
                <Text style={styles.streams}>{item.streams} écoutes</Text>
              </View>
            </LinearGradient>
          )}
        />
      )}

      <Pressable
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.navigate('Playlists')}
      >
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </Pressable>

      {/* Contrôles en bas */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
        {/* Panneau déroulant : favori, répéter, aléatoire, minuteur, plus */}
        {panelOpen && (
          <View style={styles.panel}>
            {panelButtons.map((b) => (
              <Pressable key={b.key} style={styles.panelButton} onPress={b.onPress}>
                <Ionicons name={b.icon} size={26} color={b.active ? colors.primary : colors.text} />
                <Text style={[styles.panelLabel, b.active && { color: colors.primary }]}>{b.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Play/pause au centre + flèche à côté */}
        <View style={styles.playRow}>
          <Pressable style={styles.playButton} onPress={togglePlay}>
            <Ionicons name={status.playing ? 'pause' : 'play'} size={34} color={colors.background} />
          </Pressable>
          <Pressable style={styles.arrowButton} onPress={() => setPanelOpen(!panelOpen)}>
            <Ionicons name={panelOpen ? 'chevron-up' : 'chevron-down'} size={26} color={colors.text} />
          </Pressable>
        </View>

        <Pressable
          style={styles.barTouch}
          onPress={seek}
          onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        >
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
        </Pressable>
        <View style={styles.times}>
          <Text style={styles.time}>{formatTime(status.currentTime)}</Text>
          <Text style={styles.time}>{formatTime(status.duration)}</Text>
        </View>
      </View>

      {/* Menu des trois points */}
      <BottomSheet visible={sheet === 'menu'} onClose={() => setSheet(null)} title={current?.title}>
        <MenuItem icon="share-social-outline" label="Partager" onPress={shareTrack} />
        <MenuItem icon="add-circle-outline" label="Ajouter à une playlist" onPress={() => setSheet('playlists')} />
        <MenuItem
          icon="create-outline"
          label="Modifier la playlist"
          onPress={() => soon("La modification d'une playlist sera disponible quand les playlists seront reliées au lecteur.")}
        />
        {current?.isVideo && (
          <MenuItem
            icon="musical-note-outline"
            label="Convertir en audio"
            onPress={() => soon("La conversion d'un clip en audio sera disponible avec le serveur.")}
          />
        )}
        <MenuItem icon="person-outline" label="À propos de l'artiste" onPress={() => setSheet('artist')} />
        <MenuItem icon="trash-outline" label="Supprimer" danger onPress={confirmDelete} />
      </BottomSheet>

      {/* Choix de la playlist */}
      <BottomSheet visible={sheet === 'playlists'} onClose={() => setSheet(null)} title="Ajouter à une playlist">
        {allPlaylists.map((p) => (
          <MenuItem key={p.id} icon="list-outline" label={p.title} onPress={() => addToPlaylist(p.title)} />
        ))}
      </BottomSheet>

      {/* À propos de l'artiste */}
      <BottomSheet visible={sheet === 'artist'} onClose={() => setSheet(null)}>
        <View style={styles.artistBox}>
          <View style={[styles.artistAvatar, { backgroundColor: current?.color }]}>
            <Ionicons name="person" size={40} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={styles.artistName}>{current?.artist}</Text>
          <Text style={styles.artistBio}>{current?.bio}</Text>
          <Pressable
            style={styles.profileButton}
            onPress={() => soon("Le profil de l'artiste sera disponible avec les comptes artistes.")}
          >
            <Text style={styles.profileButtonText}>Voir le profil</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}

function MenuItem({ icon, label, onPress, danger }) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={danger ? '#F87171' : colors.text} />
      <Text style={[styles.menuLabel, danger && { color: '#F87171' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cover: {
    width: 280, height: 280, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }, elevation: 12,
  },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: 26, paddingHorizontal: 24, textAlign: 'center' },
  artist: { color: colors.text, fontFamily: fonts.regular, fontSize: 17, marginTop: 6, opacity: 0.85 },
  streamsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  streams: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14 },
  backButton: {
    position: 'absolute', left: 12, width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center',
  },
  controls: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, alignItems: 'center' },
  panel: {
    flexDirection: 'row', justifyContent: 'space-around', width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 16, paddingVertical: 12, marginBottom: 16,
  },
  panelButton: { alignItems: 'center', minWidth: 56 },
  panelLabel: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 },
  playRow: { width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  playButton: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: colors.text,
    alignItems: 'center', justifyContent: 'center',
  },
  arrowButton: {
    position: 'absolute', right: 8, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center',
  },
  barTouch: { width: '100%', height: 24, justifyContent: 'center' },
  barTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' },
  barFill: { height: 4, borderRadius: 2, backgroundColor: colors.text },
  times: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  time: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 12 },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 10,
    borderTopWidth: 1, borderColor: colors.border,
  },
  sheetHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 12 },
  sheetTitle: { color: colors.text, fontFamily: fonts.bold, fontSize: 18, marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  menuLabel: { color: colors.text, fontFamily: fonts.semibold, fontSize: 16 },
  artistBox: { alignItems: 'center', paddingVertical: 8 },
  artistAvatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  artistName: { color: colors.text, fontFamily: fonts.bold, fontSize: 22 },
  artistBio: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10 },
  profileButton: { marginTop: 18, backgroundColor: colors.primary, borderRadius: 24, paddingVertical: 12, paddingHorizontal: 28 },
  profileButtonText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 15 },
});