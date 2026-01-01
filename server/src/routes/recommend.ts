import { Router } from 'express';
import { getGameInfo } from '../services/rawg.js';
import { analyzeGameWithGemini } from '../services/gemini.js';
import { getSpotifyPlaylists } from '../services/spotify.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { gameName } = req.body;

    const game = await getGameInfo(gameName);
    const musicProfile = await analyzeGameWithGemini(game);
    const playlists = await getSpotifyPlaylists(musicProfile.style);

    res.json({
      game,
      musicProfile,
      playlists
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Napaka pri priporočanju glasbe' });
  }
});

export default router;
