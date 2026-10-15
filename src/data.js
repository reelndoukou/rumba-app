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
    bio: "Artiste de rumba originaire de Pointe-Noire, il mêle guitares traditionnelles et sons modernes. Auteur de plusieurs titres écoutés dans tout le pays.",
    streams: '120 K',
    color: '#6D28D9',
    isVideo: false,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 't2',
    title: 'Titre de test 2',
    artist: 'Artiste B',
    bio: "Jeune chanteuse de Brazzaville, elle compose et écrit ses propres textes en lingala et en français.",
    streams: '98 K',
    color: '#BE185D',
    isVideo: true,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 't3',
    title: 'Titre de test 3',
    artist: 'Artiste C',
    bio: "Rappeur indépendant, il raconte la vie quotidienne de sa ville avec des rythmes afrobeat.",
    streams: '75 K',
    color: '#0F766E',
    isVideo: false,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

// Événements saisis par les administrateurs
export const events = [
  { id: 'e1', title: 'Festival de la Rumba', date: 'Sam 14 Nov', place: 'Pointe-Noire', color: '#6D28D9' },
  { id: 'e2', title: 'Concert Hip-hop Night', date: 'Ven 27 Nov', place: 'Brazzaville', color: '#BE185D' },
  { id: 'e3', title: 'Soirée Gospel', date: 'Dim 6 Déc', place: 'Dolisie', color: '#0F766E' },
];

// Les 10 dernières chansons publiées (la plus récente en premier)
export const latestReleases = [
  { id: 'r1', title: 'Nouvelle étoile', artist: 'Artiste A', catalogue: 'Rumba', date: "Aujourd'hui", color: '#6D28D9' },
  { id: 'r2', title: 'Ambiance', artist: 'Artiste B', catalogue: 'Ndombolo', date: "Aujourd'hui", color: '#BE185D' },
  { id: 'r3', title: 'Mon quartier', artist: 'Artiste C', catalogue: 'Hip-hop', date: 'Hier', color: '#0F766E' },
  { id: 'r4', title: 'Louange', artist: 'Artiste D', catalogue: 'Gospel', date: 'Hier', color: '#4C1D95' },
  { id: 'r5', title: 'Soleil', artist: 'Artiste E', catalogue: 'Afrobeat', date: 'Il y a 2 j', color: '#7C3AED' },
  { id: 'r6', title: 'Les anciens', artist: 'Artiste F', catalogue: 'Traditionnel', date: 'Il y a 2 j', color: '#B45309' },
  { id: 'r7', title: 'Nuit de Brazza', artist: 'Artiste A', catalogue: 'Rumba', date: 'Il y a 3 j', color: '#5B21B6' },
  { id: 'r8', title: 'Danse', artist: 'Artiste G', catalogue: 'Ndombolo', date: 'Il y a 3 j', color: '#9D174D' },
  { id: 'r9', title: 'Rue 12', artist: 'Artiste H', catalogue: 'Hip-hop', date: 'Il y a 4 j', color: '#115E59' },
  { id: 'r10', title: 'Prière', artist: 'Artiste I', catalogue: 'Gospel', date: 'Il y a 5 j', color: '#6B21A8' },
];

// Artistes les plus écoutés (classés du plus au moins écouté)
export const mostListened = [
  { id: 'm1', name: 'Artiste A', catalogue: 'Rumba', streams: '1,2 M', color: '#6D28D9' },
  { id: 'm2', name: 'Artiste B', catalogue: 'Ndombolo', streams: '980 K', color: '#BE185D' },
  { id: 'm3', name: 'Artiste C', catalogue: 'Hip-hop', streams: '850 K', color: '#0F766E' },
  { id: 'm4', name: 'Artiste G', catalogue: 'Ndombolo', streams: '720 K', color: '#9D174D' },
  { id: 'm5', name: 'Artiste D', catalogue: 'Gospel', streams: '640 K', color: '#4C1D95' },
  { id: 'm6', name: 'Artiste E', catalogue: 'Afrobeat', streams: '510 K', color: '#7C3AED' },
  { id: 'm7', name: 'Artiste F', catalogue: 'Traditionnel', streams: '300 K', color: '#B45309' },
];