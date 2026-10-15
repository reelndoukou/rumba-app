// src/data.js
export const catalogues = ['Tout', 'Rumba', 'Ndombolo', 'Hip-hop', 'Gospel', 'Afrobeat', 'Traditionnel'];

export const topVideos = [
  { id: 'v1', title: 'Titre vidéo 1', subtitle: 'Artiste A', color: '#6D28D9' },
  { id: 'v2', title: 'Titre vidéo 2', subtitle: 'Artiste B', color: '#7C3AED' },
  { id: 'v3', title: 'Titre vidéo 3', subtitle: 'Artiste C', color: '#5B21B6' },
];

export const topArtists = [
  { id: 'a1', title: 'Artiste A', subtitle: '120 K écoutes', color: '#4C1D95' },
  { id: 'a2', title: 'Artiste B', subtitle: '98 K écoutes', color: '#6D28D9' },
  { id: 'a3', title: 'Artiste C', subtitle: '75 K écoutes', color: '#7C3AED' },
  { id: 'a4', title: 'Artiste D', subtitle: '60 K écoutes', color: '#5B21B6' },
];

export const topPlaylists = [
  { id: 'p1', title: 'Rumba du moment', subtitle: '25 titres', color: '#581C87' },
  { id: 'p2', title: 'Ndombolo party', subtitle: '30 titres', color: '#6B21A8' },
  { id: 'p3', title: 'Gospel du dimanche', subtitle: '18 titres', color: '#4C1D95' },
];

export const topAlbums = [
  { id: 'al1', title: 'Album 1', subtitle: 'Artiste A', color: '#7C3AED' },
  { id: 'al2', title: 'Album 2', subtitle: 'Artiste B', color: '#5B21B6' },
  { id: 'al3', title: 'Album 3', subtitle: 'Artiste C', color: '#6D28D9' },
];

export const initialPlaylists = {
  downloaded: [
    { id: 'd1', title: 'Mes favoris hors ligne', count: 12, color: '#6D28D9' },
    { id: 'd2', title: 'Rumba du soir', count: 20, color: '#5B21B6' },
  ],
  streaming: [
    { id: 's1', title: 'Découvertes de la semaine', count: 30, color: '#7C3AED' },
    { id: 's2', title: 'Ndombolo party', count: 25, color: '#4C1D95' },
    { id: 's3', title: 'Gospel du dimanche', count: 18, color: '#581C87' },
  ],
};

// Couleurs utilisées pour les nouvelles playlists
export const playlistColors = ['#6D28D9', '#7C3AED', '#5B21B6', '#4C1D95', '#581C87', '#6B21A8'];

// Les liens audio sont des morceaux de démonstration (le temps du développement)
export const tracks = [
  {
    id: 't1',
    title: 'Titre de test 1',
    artist: 'Artiste A',
    streams: '120 K',
    color: '#6D28D9',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 't2',
    title: 'Titre de test 2',
    artist: 'Artiste B',
    streams: '98 K',
    color: '#BE185D',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 't3',
    title: 'Titre de test 3',
    artist: 'Artiste C',
    streams: '75 K',
    color: '#0F766E',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];