
import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'Cyber Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
    duration: 372
  },
  {
    id: '2',
    title: 'Digital Pulse',
    artist: 'Rhythm Engine',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
    duration: 425
  },
  {
    id: '3',
    title: 'Matrix Crawler',
    artist: 'The Architect',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
    duration: 312
  }
];

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 2,
  MIN_SPEED: 60,
};
