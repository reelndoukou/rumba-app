// src/screens/PlayerScreen.js
import { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { colors, fonts } from '../theme';
import { tracks } from '../data';

// Transforme 83 secondes en "1:23"
function formatTime(seconds) {
  const s = Math.floor(seconds || 0);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function PlayerScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [pageHeight, setPageHeight] = useState(0); // hauteur d'une "page" de chanson
  const [index, setIndex] = useState(0);           // chanson actuelle
  const [barWidth, setBarWidth] = useState(1);     // largeur de la barre de progression
  const firstRender = useRef(true);

  const player = useAudioPlayer(tracks[0].url);
  const status = useAudioPlayerStatus(player);

  // Pour que le son marche aussi quand l'iPhone est en mode silencieux
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // Quand on change de chanson : on charge le nouveau fichier et on le lance
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    player.replace(tracks[index].url);
    player.play();
  }, [index]);

  function togglePlay() {
    if (status.playing) player.pause();
    else player.play();
  }

  // Quand l'utilisateur touche la barre, on saute à cet endroit du morceau
  function seek(event) {
    if (!status.duration) return;
    const ratio = event.nativeEvent.locationX / barWidth;
    player.seekTo(ratio * status.duration);
  }

  // Quand le défilement s'arrête, on calcule quelle chanson est affichée
  function onScrollEnd(event) {
    const newIndex = Math.round(event.nativeEvent.contentOffset.y / pageHeight);
    if (newIndex !== index) setIndex(newIndex);
  }

  const progress = status.duration ? status.currentTime / status.duration : 0;

  return (
    <View style={styles.container} onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}>
      {pageHeight > 0 && (
        <FlatList
          data={tracks}
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

      {/* Bouton retour en haut à gauche */}
      <Pressable
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.navigate('Playlists')}
      >
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </Pressable>

      {/* Contrôles en bas : play/pause + barre de progression */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable style={styles.playButton} onPress={togglePlay}>
          <Ionicons name={status.playing ? 'pause' : 'play'} size={34} color={colors.background} />
        </Pressable>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cover: {
    width: 280,
    height: 280,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 26,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  artist: { color: colors.text, fontFamily: fonts.regular, fontSize: 17, marginTop: 6, opacity: 0.85 },
  streamsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  streams: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14 },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  barTouch: { width: '100%', height: 24, justifyContent: 'center' },
  barTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' },
  barFill: { height: 4, borderRadius: 2, backgroundColor: colors.text },
  times: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  time: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 12 },
});