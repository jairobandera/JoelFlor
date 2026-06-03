const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const gifts = [
  { name: 'Microondas', link: 'https://www.mercadolibre.com.uy/p/MLU54071660?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU849084590&ua=6KboUzeiAA8MLJYR07UCq0X1LIG49A#origin=share&sid=share&wid=MLU849084590&action=copy', status: 'disponible' },
  { name: 'Heladera', link: 'https://www.mercadolibre.com.uy/p/MLU38037142?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU711734450&ua=KUlJ--gDyoZh3M6BXPPNtEmq2lSuYg#origin=share&sid=share&wid=MLU711734450&action=copy', status: 'disponible' },
  { name: 'Cocina', link: 'https://www.mercadolibre.com.uy/p/MLU24754451?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU631680581&ua=XA1b5TtijlmBO8O8SLPe-IeKnLD9Uw#origin=share&sid=share&wid=MLU631680581&action=copy', status: 'disponible' },
  { name: 'Freidora de Aire', link: 'https://www.mercadolibre.com.uy/p/MLU41853892?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU697001090&ua=5HGwHYDBDJ4k0ZT3q99tSOvmKPehSg#origin=share&sid=share&wid=MLU697001090&action=copy', status: 'disponible' },
  { name: 'Aire', link: 'https://www.mercadolibre.com.uy/p/MLU55543794?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU853148016&ua=RjOKWP2E5tiwDV5eZxe2-crFhbdsvA#origin=share&sid=share&wid=MLU853148016&action=copy', status: 'disponible' },
  { name: 'Sillón', link: 'https://www.mercadolibre.com.uy/up/MLUU3217022830?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU737819784&ua=1UEZ-Yc1u4r-ihregtEZBb_kZzlGMg#origin=share&sid=share&wid=MLU737819784&action=copy', status: 'disponible' },
  { name: 'Lavarropa', link: 'https://www.mercadolibre.com.uy/p/MLU50189590?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU1145821758&ua=Tms4PVCP6uqQ2x0WhIrtVs1FlFzOtg#origin=share&sid=share&wid=MLU1145821758&action=copy', status: 'elegido' },
  { name: 'Mesa', link: 'https://www.mercadolibre.com.uy/up/MLUU3631892287?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU654338843&ua=3fMBDlu-1k8Xba6rgt0Cy1A_LqZ3zw#origin=share&sid=share&wid=MLU654338843&action=copy', status: 'elegido' },
  { name: 'Televisión', link: 'https://www.mercadolibre.com.uy/p/MLU67641158?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU683124731&ua=2uEFCOPdZjCmsqoowAvDPZCYbpxYTQ#origin=share&sid=share&wid=MLU683124731&action=copy', status: 'disponible' },
  { name: 'Juego vajilla', link: 'https://www.mercadolibre.com.uy/p/MLU54270065?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU849655644&ua=a9tMOUOcu_0CvNDd_B3KxmMqFPEdog#origin=share&sid=share&wid=MLU849655644&action=copy', status: 'disponible' },
  { name: 'Blackout', link: 'https://www.mercadolibre.com.uy/p/MLU53050569?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU801828968&ua=pjGtaRQNMbwRhZKSnkUkjEbddGeQEA#origin=share&sid=share&wid=MLU801828968&action=copy', status: 'disponible' },
  { name: 'Cama baúl', link: 'https://www.mercadolibre.com.uy/p/MLU34373347?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU825436712&ua=1wl6CGf47AOiy-BdBpIgOb0mLWQaiA#origin=share&sid=share&wid=MLU825436712&action=copy', status: 'disponible' },
  { name: 'Juego ollas', link: null, status: 'elegido' },
  { name: 'Jarra Eléctrica', link: null, status: 'disponible' },
  { name: 'Calefón', link: null, status: 'disponible' }
];

async function seed() {
  try {
    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        link TEXT,
        status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'elegido')),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const giftsCheck = await client.query('SELECT COUNT(*) FROM gifts');
    const giftsCount = parseInt(giftsCheck.rows[0].count);

    if (giftsCount === 0) {
      for (const gift of gifts) {
        await client.query(
          'INSERT INTO gifts (name, link, status) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
          [gift.name, gift.link, gift.status]
        );
      }
      console.log(` ${gifts.length} gifts seeded`);
    } else {
      console.log(`📦 ${giftsCount} gifts already exist, skipping seed`);
    }

    const adminCheck = await client.query('SELECT COUNT(*) FROM admin_users');
    const adminCount = parseInt(adminCheck.rows[0].count);

    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await client.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        [process.env.ADMIN_USERNAME || 'admin', passwordHash]
      );
      console.log(`👤 Admin user created: ${process.env.ADMIN_USERNAME || 'admin'}`);
    } else {
      console.log('👤 Admin user already exists, skipping');
    }

    client.release();
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
}

if (require.main === module) {
  seed().then(() => {
    console.log('✅ Seed completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Fatal seed error:', error);
    process.exit(1);
  });
}

module.exports = seed;
