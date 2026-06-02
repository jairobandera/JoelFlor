const API_URL = window.location.origin;

let token = localStorage.getItem('admin_token');
let gifts = [];

const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const giftsTbody = document.getElementById('gifts-tbody');
const loadingEl = document.getElementById('loading');
const modalOverlay = document.getElementById('modal-overlay');
const giftForm = document.getElementById('gift-form');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const addGiftBtn = document.getElementById('add-gift-btn');
const refreshBtn = document.getElementById('refresh-btn');
const fetchImageBtn = document.getElementById('fetch-image-btn');

const totalGiftsEl = document.getElementById('total-gifts');
const availableGiftsEl = document.getElementById('available-gifts');
const chosenGiftsEl = document.getElementById('chosen-gifts');

async function checkAuth() {
  if (!token) {
    showLogin();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (data.valid) {
      showAdmin();
      await loadGifts();
    } else {
      logout();
    }
  } catch (error) {
    logout();
  }
}

function showLogin() {
  loginScreen.style.display = 'flex';
  adminPanel.style.display = 'none';
}

function showAdmin() {
  loginScreen.style.display = 'none';
  adminPanel.style.display = 'block';
}

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  loginError.textContent = '';

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      token = data.token;
      localStorage.setItem('admin_token', token);
      showAdmin();
      await loadGifts();
    } else {
      loginError.textContent = data.error || 'Credenciales inválidas';
    }
  } catch (error) {
    loginError.textContent = 'Error de conexión. Intenta nuevamente.';
  }
}

function logout() {
  token = null;
  localStorage.removeItem('admin_token');
  showLogin();
  loginForm.reset();
}

async function loadGifts() {
  try {
    loadingEl.style.display = 'block';
    giftsTbody.innerHTML = '';

    const response = await fetch(`${API_URL}/api/gifts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Error al cargar regalos');

    gifts = await response.json();
    
    loadingEl.style.display = 'none';
    renderGifts();
    updateStats();

  } catch (error) {
    console.error('Error:', error);
    loadingEl.innerHTML = '<p>Error al cargar. Intenta nuevamente.</p>';
  }
}

function renderGifts() {
  giftsTbody.innerHTML = '';

  gifts.forEach(gift => {
    const tr = document.createElement('tr');
    const isAvailable = gift.status === 'disponible';

    tr.innerHTML = `
      <td>${gift.id}</td>
      <td><strong>${gift.name}</strong></td>
      <td class="link-cell">
        ${gift.link 
          ? `<a href="${gift.link}" target="_blank" rel="noopener noreferrer">${truncateUrl(gift.link)}</a>`
          : '<span style="color: var(--color-text-light)">-</span>'
        }
      </td>
      <td>
        <span class="badge ${gift.status}">
          ${isAvailable ? 'Disponible' : 'Elegido 🎁'}
        </span>
      </td>
      <td class="image-cell">
        ${gift.image_url 
          ? `<img src="${gift.image_url}" alt="${gift.name}" onerror="this.outerHTML='<div class=\\'no-image\\'>🎁</div>'">`
          : '<div class="no-image">🎁</div>'
        }
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon toggle" onclick="toggleStatus(${gift.id})" title="Cambiar estado">
            ${isAvailable ? '🔴' : '🟢'}
          </button>
          <button class="btn-icon edit" onclick="editGift(${gift.id})" title="Editar">
            ✏️
          </button>
          <button class="btn-icon delete" onclick="deleteGift(${gift.id})" title="Eliminar">
            ️
          </button>
        </div>
      </td>
    `;

    giftsTbody.appendChild(tr);
  });
}

function truncateUrl(url) {
  if (!url) return '-';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname.substring(0, 20) + '...';
  } catch {
    return url.substring(0, 30) + '...';
  }
}

function updateStats() {
  const total = gifts.length;
  const available = gifts.filter(g => g.status === 'disponible').length;
  const chosen = gifts.filter(g => g.status === 'elegido').length;

  totalGiftsEl.textContent = total;
  availableGiftsEl.textContent = available;
  chosenGiftsEl.textContent = chosen;
}

function openModal(gift = null) {
  modalOverlay.style.display = 'flex';
  
  if (gift) {
    modalTitle.textContent = 'Editar Regalo';
    document.getElementById('gift-id').value = gift.id;
    document.getElementById('gift-name').value = gift.name;
    document.getElementById('gift-link').value = gift.link || '';
    document.getElementById('gift-image').value = gift.image_url || '';
    document.getElementById('gift-status').value = gift.status;
  } else {
    modalTitle.textContent = 'Agregar Regalo';
    giftForm.reset();
    document.getElementById('gift-id').value = '';
  }
}

function closeModal() {
  modalOverlay.style.display = 'none';
}

async function handleSaveGift(e) {
  e.preventDefault();

  const id = document.getElementById('gift-id').value;
  const name = document.getElementById('gift-name').value;
  const link = document.getElementById('gift-link').value;
  const image_url = document.getElementById('gift-image').value;
  const status = document.getElementById('gift-status').value;

  if (!name) {
    showToast('El nombre es obligatorio', 'error');
    return;
  }

  const giftData = { name, link: link || null, image_url: image_url || null, status };

  try {
    const url = id ? `${API_URL}/api/gifts/${id}` : `${API_URL}/api/gifts`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(giftData)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error al guardar');
    }

    closeModal();
    await loadGifts();
    showToast(id ? 'Regalo actualizado' : 'Regalo agregado', 'success');

  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function toggleStatus(id) {
  const gift = gifts.find(g => g.id === id);
  if (!gift) return;

  const newStatus = gift.status === 'disponible' ? 'elegido' : 'disponible';

  try {
    const response = await fetch(`${API_URL}/api/gifts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) throw new Error('Error al actualizar');

    await loadGifts();
    showToast(`Estado cambiado a "${newStatus}"`, 'success');

  } catch (error) {
    showToast('Error al actualizar el estado', 'error');
  }
}

function editGift(id) {
  const gift = gifts.find(g => g.id === id);
  if (gift) openModal(gift);
}

async function deleteGift(id) {
  if (!confirm('¿Estás seguro de eliminar este regalo?')) return;

  try {
    const response = await fetch(`${API_URL}/api/gifts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Error al eliminar');

    await loadGifts();
    showToast('Regalo eliminado', 'success');

  } catch (error) {
    showToast('Error al eliminar', 'error');
  }
}

async function fetchImageFromLink() {
  const link = document.getElementById('gift-link').value;
  
  if (!link) {
    showToast('Ingresa un link primero', 'error');
    return;
  }

  fetchImageBtn.disabled = true;
  fetchImageBtn.textContent = ' Extrayendo...';

  try {
    const response = await fetch(`${API_URL}/api/gifts/fetch-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url: link })
    });

    const data = await response.json();

    if (data.image_url) {
      document.getElementById('gift-image').value = data.image_url;
      showToast('Imagen extraída correctamente', 'success');
    } else {
      showToast('No se pudo extraer la imagen', 'error');
    }

  } catch (error) {
    showToast('Error al extraer imagen', 'error');
  } finally {
    fetchImageBtn.disabled = false;
    fetchImageBtn.textContent = '🔍 Extraer imagen del link';
  }
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', logout);
addGiftBtn.addEventListener('click', () => openModal());
refreshBtn.addEventListener('click', loadGifts);
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
giftForm.addEventListener('submit', handleSaveGift);
fetchImageBtn.addEventListener('click', fetchImageFromLink);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('DOMContentLoaded', checkAuth);
