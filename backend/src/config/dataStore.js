const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DEFAULT_GIFTS = [
  { name: 'Microondas', link: 'https://www.mercadolibre.com.uy/p/MLU54071660?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU849084590&ua=6KboUzeiAA8MLJYR07UCq0X1LIG49A#origin=share&sid=share&wid=MLU849084590&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_659363-MLA99911172899_112025-O.jpg' },
  { name: 'Heladera', link: 'https://www.mercadolibre.com.uy/p/MLU38037142?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU711734450&ua=KUlJ--gDyoZh3M6BXPPNtEmq2lSuYg#origin=share&sid=share&wid=MLU711734450&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_847049-MLA99924936485_112025-O.jpg' },
  { name: 'Cocina', link: 'https://www.mercadolibre.com.uy/p/MLU24754451?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU631680581&ua=XA1b5TtijlmBO8O8SLPe-IeKnLD9Uw#origin=share&sid=share&wid=MLU631680581&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_709989-MLA99988094821_112025-O.jpg' },
  { name: 'Freidora de Aire', link: 'https://www.mercadolibre.com.uy/p/MLU41853892?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU697001090&ua=5HGwHYDBDJ4k0ZT3q99tSOvmKPehSg#origin=share&sid=share&wid=MLU697001090&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_725554-MLA96420560623_102025-O.jpg' },
  { name: 'Aire', link: 'https://www.mercadolibre.com.uy/p/MLU55543794?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU853148016&ua=RjOKWP2E5tiwDV5eZxe2-crFhbdsvA#origin=share&sid=share&wid=MLU853148016&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_723352-MLA99943821109_112025-O.jpg' },
  { name: 'Sillón', link: 'https://www.mercadolibre.com.uy/up/MLUU3217022830?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU737819784&ua=1UEZ-Yc1u4r-ihregtEZBb_kZzlGMg#origin=share&sid=share&wid=MLU737819784&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_825684-MLU106808439190_022026-O.jpg' },
  { name: 'Lavarropa', link: null, status: 'elegido', image_url: null },
  { name: 'Mesa', link: null, status: 'elegido', image_url: null },
  { name: 'Televisión', link: 'https://www.mercadolibre.com.uy/p/MLU50189590?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU1145821758&ua=Tms4PVCP6uqQ2x0WhIrtVs1FlFzOtg#origin=share&sid=share&wid=MLU1145821758&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_755930-MLA99938063209_112025-O.jpg' },
  { name: 'Juego vajilla', link: 'https://www.mercadolibre.com.uy/up/MLUU3631892287?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU654338843&ua=3fMBDlu-1k8Xba6rgt0Cy1A_LqZ3zw#origin=share&sid=share&wid=MLU654338843&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_663944-MLU100382837772_122025-O.jpg' },
  { name: 'Blackout', link: 'https://www.mercadolibre.com.uy/p/MLU67641158?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU683124731&ua=2uEFCOPdZjCmsqoowAvDPZCYbpxYTQ#origin=share&sid=share&wid=MLU683124731&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_639588-MLA110085386259_042026-O.jpg' },
  { name: 'Cama baúl', link: 'https://www.mercadolibre.com.uy/p/MLU54270065?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU849655644&ua=a9tMOUOcu_0CvNDd_B3KxmMqFPEdog#origin=share&sid=share&wid=MLU849655644&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_648158-MLA112631894743_062026-O.jpg' },
  { name: 'Juego ollas', link: null, status: 'elegido', image_url: null },
  { name: 'Jarra Eléctrica', link: 'https://www.mercadolibre.com.uy/p/MLU53050569?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU801828968&ua=pjGtaRQNMbwRhZKSnkUkjEbddGeQEA#origin=share&sid=share&wid=MLU801828968&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_750674-MLA99987368935_112025-O.jpg' },
  { name: 'Calefón', link: 'https://www.mercadolibre.com.uy/p/MLU34373347?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU825436712&ua=1wl6CGf47AOiy-BdBpIgOb0mLWQaiA#origin=share&sid=share&wid=MLU825436712&action=copy', status: 'disponible', image_url: 'https://http2.mlstatic.com/D_NQ_NP_793080-MLA99511197676_112025-O.jpg' }
];

let pool;

async function init() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined
  });

  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL (Neon)');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    throw err;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS gifts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      link TEXT,
      status VARCHAR(50) DEFAULT 'disponible',
      image_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      username VARCHAR(100) PRIMARY KEY,
      password_hash VARCHAR(255) NOT NULL
    )
  `);

  const giftsResult = await pool.query('SELECT COUNT(*) FROM gifts');
  if (parseInt(giftsResult.rows[0].count) === 0) {
    const now = new Date().toISOString();
    for (const gift of DEFAULT_GIFTS) {
      await pool.query(
        `INSERT INTO gifts (name, link, status, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)`,
        [gift.name, gift.link, gift.status, gift.image_url, now, now]
      );
    }
    console.log(`✅ ${DEFAULT_GIFTS.length} gifts seeded`);
  } else {
    const count = giftsResult.rows[0].count;
    console.log(`✅ ${count} gifts loaded from database`);
  }

  const adminResult = await pool.query('SELECT COUNT(*) FROM admins');
  if (parseInt(adminResult.rows[0].count) === 0) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await pool.query(
      `INSERT INTO admins (username, password_hash) VALUES ($1, $2)`,
      [process.env.ADMIN_USERNAME || 'admin', passwordHash]
    );
    console.log(`✅ Admin user created: ${process.env.ADMIN_USERNAME || 'admin'}`);
  } else {
    console.log('✅ Admin config loaded');
  }
}

async function getAllGifts() {
  const result = await pool.query('SELECT * FROM gifts ORDER BY id');
  return result.rows;
}

async function getGiftById(id) {
  const result = await pool.query('SELECT * FROM gifts WHERE id = $1', [parseInt(id)]);
  return result.rows[0] || null;
}

async function createGift(data) {
  const now = new Date().toISOString();
  const result = await pool.query(
    `INSERT INTO gifts (name, link, status, image_url, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [data.name, data.link || null, data.status || 'disponible', data.image_url || null, now, now]
  );
  return result.rows[0];
}

async function updateGift(id, data) {
  const existing = await getGiftById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const result = await pool.query(
    `UPDATE gifts SET
       name = $1,
       link = $2,
       status = $3,
       image_url = $4,
       updated_at = $5
     WHERE id = $6 RETURNING *`,
    [
      data.name !== undefined ? data.name : existing.name,
      data.link !== undefined ? data.link : existing.link,
      data.status !== undefined ? data.status : existing.status,
      data.image_url !== undefined ? data.image_url : existing.image_url,
      now,
      parseInt(id)
    ]
  );
  return result.rows[0];
}

async function deleteGift(id) {
  const result = await pool.query('DELETE FROM gifts WHERE id = $1 RETURNING *', [parseInt(id)]);
  return result.rows[0] || null;
}

async function verifyAdmin(username, password) {
  const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
  const admin = result.rows[0];
  if (!admin) return false;
  return await bcrypt.compare(password, admin.password_hash);
}

module.exports = {
  init,
  getAllGifts,
  getGiftById,
  createGift,
  updateGift,
  deleteGift,
  verifyAdmin
};
