export interface GameInfo {
  name: string;
  genres: string[];
  description: string;
}

export interface MusicStyleResult {
  style: string;
  mood: string;
  tempo: string;
}

export interface SpotifyPlaylist {
  name: string;
  url: string;
}
