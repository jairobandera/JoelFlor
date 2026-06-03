const dataStore = require('../config/dataStore');
const cheerio = require('cheerio');

const getAllGifts = async (req, res) => {
  try {
    const gifts = await dataStore.getAllGifts();
    res.json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getGiftById = async (req, res) => {
  try {
    const { id } = req.params;
    const gift = await dataStore.getGiftById(id);

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    res.json(gift);
  } catch (error) {
    console.error('Error fetching gift:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const createGift = async (req, res) => {
  try {
    const { name, link, status, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Gift name is required.' });
    }

    const gift = await dataStore.createGift({ name, link, status, image_url });
    res.status(201).json(gift);
  } catch (error) {
    console.error('Error creating gift:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const updateGift = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, status, image_url } = req.body;

    const existing = await dataStore.getGiftById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    const updated = await dataStore.updateGift(id, { name, link, status, image_url });
    res.json(updated);
  } catch (error) {
    console.error('Error updating gift:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteGift = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await dataStore.deleteGift(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    res.json({ message: 'Gift deleted successfully.', gift: deleted });
  } catch (error) {
    console.error('Error deleting gift:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const fetchProductImage = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    let imageUrl = null;

    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) imageUrl = ogImage;

    if (!imageUrl) {
      const twitterImage = $('meta[name="twitter:image"]').attr('content');
      if (twitterImage) imageUrl = twitterImage;
    }

    if (!imageUrl) {
      const mainImage = $('img.andes-carousel__slide-image').first().attr('src');
      if (mainImage) imageUrl = mainImage;
    }

    if (!imageUrl) {
      const allImages = $('img');
      for (let i = 0; i < allImages.length; i++) {
        const src = $(allImages[i]).attr('src');
        if (src && src.includes('http') && (src.includes('.jpg') || src.includes('.png') || src.includes('.webp'))) {
          imageUrl = src;
          break;
        }
      }
    }

    res.json({ image_url: imageUrl });
  } catch (error) {
    console.error('Error fetching product image:', error);
    res.status(500).json({ error: 'Failed to fetch product image.' });
  }
};

module.exports = {
  getAllGifts,
  getGiftById,
  createGift,
  updateGift,
  deleteGift,
  fetchProductImage
};
