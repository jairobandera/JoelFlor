const API_URL = window.location.origin;

const giftsGrid = document.getElementById('gifts-grid');
const loadingEl = document.getElementById('loading');
const noGiftsEl = document.getElementById('no-gifts');

async function fetchGifts() {
  try {
    loadingEl.style.display = 'block';
    giftsGrid.innerHTML = '';
    noGiftsEl.style.display = 'none';

    const response = await fetch(`${API_URL}/api/gifts`);
    
    if (!response.ok) throw new Error('Error al cargar los regalos');

    const gifts = await response.json();
    
    loadingEl.style.display = 'none';

    if (gifts.length === 0) {
      noGiftsEl.style.display = 'block';
      return;
    }

    gifts.forEach((gift, index) => {
      const card = createGiftCard(gift, index);
      giftsGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error:', error);
    loadingEl.innerHTML = '<p>Error al cargar los regalos. Intenta nuevamente.</p>';
  }
}

function createGiftCard(gift, index) {
  const card = document.createElement('div');
  card.className = `gift-card ${gift.status}`;
  card.style.animationDelay = `${index * 0.1}s`;

  const isAvailable = gift.status === 'disponible';

  card.innerHTML = `
    <div class="gift-image">
      ${gift.image_url 
        ? `<img src="${gift.image_url}" alt="${gift.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'gift-image-placeholder\\'>🎁</div>'">`
        : '<div class="gift-image-placeholder">🎁</div>'
      }
      <div class="gift-status-badge">
        <span class="badge ${gift.status}">
          ${gift.status === 'disponible' ? 'Disponible' : 'Elegido 🎁'}
        </span>
      </div>
    </div>
    <div class="gift-content">
      <h3 class="gift-name">${gift.name}</h3>
      <div class="gift-actions">
        ${isAvailable && gift.link 
          ? `<a href="${gift.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
               Ver en MercadoLibre
             </a>`
          : isAvailable && !gift.link
            ? `<span class="badge disponible">Consultar por WhatsApp</span>`
            : `<span class="badge elegido">Ya fue regalado</span>`
        }
      </div>
    </div>
  `;

  return card;
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.addEventListener('DOMContentLoaded', fetchGifts);
