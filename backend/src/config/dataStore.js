const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const GIFTS_FILE = path.join(DATA_DIR, 'gifts.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

const DEFAULT_GIFTS = [
  { id: 1, name: 'Microondas', link: 'https://www.mercadolibre.com.uy/p/MLU54071660?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU849084590&ua=6KboUzeiAA8MLJYR07UCq0X1LIG49A#origin=share&sid=share&wid=MLU849084590&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 2, name: 'Heladera', link: 'https://www.mercadolibre.com.uy/p/MLU38037142?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU711734450&ua=KUlJ--gDyoZh3M6BXPPNtEmq2lSuYg#origin=share&sid=share&wid=MLU711734450&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 3, name: 'Cocina', link: 'https://www.mercadolibre.com.uy/p/MLU24754451?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU631680581&ua=XA1b5TtijlmBO8O8SLPe-IeKnLD9Uw#origin=share&sid=share&wid=MLU631680581&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 4, name: 'Freidora de Aire', link: 'https://www.mercadolibre.com.uy/p/MLU41853892?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU697001090&ua=5HGwHYDBDJ4k0ZT3q99tSOvmKPehSg#origin=share&sid=share&wid=MLU697001090&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 5, name: 'Aire', link: 'https://www.mercadolibre.com.uy/p/MLU55543794?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU853148016&ua=RjOKWP2E5tiwDV5eZxe2-crFhbdsvA#origin=share&sid=share&wid=MLU853148016&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 6, name: 'Sillón', link: 'https://www.mercadolibre.com.uy/up/MLUU3217022830?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU737819784&ua=1UEZ-Yc1u4r-ihregtEZBb_kZzlGMg#origin=share&sid=share&wid=MLU737819784&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 7, name: 'Lavarropa', link: 'https://www.mercadolibre.com.uy/p/MLU50189590?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU1145821758&ua=Tms4PVCP6uqQ2x0WhIrtVs1FlFzOtg#origin=share&sid=share&wid=MLU1145821758&action=copy', status: 'elegido', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 8, name: 'Mesa', link: 'https://www.mercadolibre.com.uy/up/MLUU3631892287?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU654338843&ua=3fMBDlu-1k8Xba6rgt0Cy1A_LqZ3zw#origin=share&sid=share&wid=MLU654338843&action=copy', status: 'elegido', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 9, name: 'Televisión', link: 'https://www.mercadolibre.com.uy/p/MLU67641158?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU683124731&ua=2uEFCOPdZjCmsqoowAvDPZCYbpxYTQ#origin=share&sid=share&wid=MLU683124731&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 10, name: 'Juego vajilla', link: 'https://www.mercadolibre.com.uy/p/MLU54270065?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU849655644&ua=a9tMOUOcu_0CvNDd_B3KxmMqFPEdog#origin=share&sid=share&wid=MLU849655644&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 11, name: 'Blackout', link: 'https://www.mercadolibre.com.uy/p/MLU53050569?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU801828968&ua=pjGtaRQNMbwRhZKSnkUkjEbddGeQEA#origin=share&sid=share&wid=MLU801828968&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 12, name: 'Cama baúl', link: 'https://www.mercadolibre.com.uy/p/MLU34373347?matt_tool=97158715&offer_type=BEST_PRICE&pdp_filters=item_id:MLU825436712&ua=1wl6CGf47AOiy-BdBpIgOb0mLWQaiA#origin=share&sid=share&wid=MLU825436712&action=copy', status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 13, name: 'Juego ollas', link: null, status: 'elegido', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 14, name: 'Jarra Eléctrica', link: null, status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 15, name: 'Calefón', link: null, status: 'disponible', image_url: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' }
];

let giftsCache = null;
let adminCache = null;

async function ensureDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readGifts() {
  if (giftsCache) return giftsCache;
  try {
    const data = await fs.readFile(GIFTS_FILE, 'utf-8');
    giftsCache = JSON.parse(data);
    return giftsCache;
  } catch {
    return [];
  }
}

async function writeGifts(gifts) {
  giftsCache = gifts;
  await fs.writeFile(GIFTS_FILE, JSON.stringify(gifts, null, 2), 'utf-8');
}

async function readAdmin() {
  if (adminCache) return adminCache;
  try {
    const data = await fs.readFile(ADMIN_FILE, 'utf-8');
    adminCache = JSON.parse(data);
    return adminCache;
  } catch {
    return null;
  }
}

async function init() {
  try {
    await ensureDir();

    const giftsExist = await fs.access(GIFTS_FILE).then(() => true).catch(() => false);
    if (!giftsExist) {
      await writeGifts(DEFAULT_GIFTS);
      console.log(` ${DEFAULT_GIFTS.length} gifts initialized`);
    } else {
      const gifts = await readGifts();
      console.log(` ${gifts.length} gifts loaded from file`);
    }

    const adminExist = await fs.access(ADMIN_FILE).then(() => true).catch(() => false);
    if (!adminExist) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      const adminData = {
        username: process.env.ADMIN_USERNAME || 'admin',
        passwordHash
      };
      await fs.writeFile(ADMIN_FILE, JSON.stringify(adminData, null, 2), 'utf-8');
      console.log(`👤 Admin user created: ${adminData.username}`);
    } else {
      console.log('👤 Admin config loaded');
    }
  } catch (error) {
    console.error('❌ Data store init error:', error.message);
  }
}

async function getAllGifts() {
  return await readGifts();
}

async function getGiftById(id) {
  const gifts = await readGifts();
  return gifts.find(g => g.id === parseInt(id)) || null;
}

async function createGift(data) {
  const gifts = await readGifts();
  const maxId = gifts.length > 0 ? Math.max(...gifts.map(g => g.id)) : 0;
  const now = new Date().toISOString();

  const newGift = {
    id: maxId + 1,
    name: data.name,
    link: data.link || null,
    status: data.status || 'disponible',
    image_url: data.image_url || null,
    created_at: now,
    updated_at: now
  };

  gifts.push(newGift);
  await writeGifts(gifts);
  return newGift;
}

async function updateGift(id, data) {
  const gifts = await readGifts();
  const index = gifts.findIndex(g => g.id === parseInt(id));

  if (index === -1) return null;

  const now = new Date().toISOString();
  gifts[index] = {
    ...gifts[index],
    name: data.name !== undefined ? data.name : gifts[index].name,
    link: data.link !== undefined ? data.link : gifts[index].link,
    status: data.status !== undefined ? data.status : gifts[index].status,
    image_url: data.image_url !== undefined ? data.image_url : gifts[index].image_url,
    updated_at: now
  };

  await writeGifts(gifts);
  return gifts[index];
}

async function deleteGift(id) {
  const gifts = await readGifts();
  const index = gifts.findIndex(g => g.id === parseInt(id));

  if (index === -1) return null;

  const deleted = gifts.splice(index, 1)[0];
  await writeGifts(gifts);
  return deleted;
}

async function verifyAdmin(username, password) {
  const admin = await readAdmin();
  if (!admin || admin.username !== username) return false;
  return await bcrypt.compare(password, admin.passwordHash);
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
