const db = require('../config/database');
const cheerio = require('cheerio');

const getAllGifts = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM gifts ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getGiftById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM gifts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    res.json(result.rows[0]);
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

    const result = await db.query(
      'INSERT INTO gifts (name, link, status, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, link || null, status || 'disponible', image_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating gift:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const updateGift = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, status, image_url } = req.body;

    const existing = await db.query('SELECT * FROM gifts WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    const result = await db.query(
      'UPDATE gifts SET name = COALESCE($1, name), link = COALESCE($2, link), status = COALESCE($3, status), image_url = COALESCE($4, image_url), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, link, status, image_url, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating gift:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteGift = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM gifts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    res.json({ message: 'Gift deleted successfully.', gift: result.rows[0] });
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
    if (ogImage) {
      imageUrl = ogImage;
    }

    if (!imageUrl) {
      const twitterImage = $('meta[name="twitter:image"]').attr('content');
      if (twitterImage) {
        imageUrl = twitterImage;
      }
    }

    if (!imageUrl) {
      const mainImage = $('img.andes-carousel__slide-image').first().attr('src');
      if (mainImage) {
        imageUrl = mainImage;
      }
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
