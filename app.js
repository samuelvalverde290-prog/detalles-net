const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Ramo Hot Wheels Pro Colección', category: 'Ramos Hot Wheels', price: 89.90, image: 'https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=500', desc: 'Ramo estilo coreano con 8 carritos Hot Wheels en empaque original.' },
  { id: '2', name: 'Ramo Hello Kitty & Sanrio Friends', category: 'Ramos Hello Kitty', price: 95.00, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500', desc: 'Peluche original Hello Kitty con envoltura rosa y finos chocolates.' },
  { id: '3', name: 'Ramo Flores Amarillas (Girasoles Tela & Choco)', category: 'Flores Amarillas', price: 75.00, image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500', desc: 'Ramo radiante duradero para el día de las flores amarillas.' },
  { id: '4', name: 'Box Romántico 14 de Febrero Especial', category: '14 de Febrero', price: 110.00, image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500', desc: 'Box con chocolates Ferrero Rocher, globo de helio y dedicatoria.' },
  { id: '5', name: 'Ramo Mega Chocolatero Ferrero & Princesa', category: 'Ramos de Chocolates', price: 85.00, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', desc: 'Gran surtido de golosinas y chocolates preparados en ramo.' }
];

let products = JSON.parse(localStorage.getItem('nat_products')) || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem('nat_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('nat_user')) || null;
let settings = JSON.parse(localStorage.getItem('nat_settings')) || {
  whatsapp: '51945770472',
  yapePhone: '945 770 472',
  qr: 'qr_yape.jpeg'
};

let activeCategory = 'todos';

const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const categoryButtons = document.querySelectorAll('.filter-btn');

const cartDrawer = document.getElementById('cart-drawer');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

const customModal = document.getElementById('custom-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCustomForm = document.getElementById('modal-custom-form');

const userAccountBtn = document.getElementById('user-account-btn');
const userBtnText = document.getElementById('user-btn-text');
const userModal = document.getElementById('user-modal');
const userModalClose = document.getElementById('user-modal-close');
const userProfileForm = document.getElementById('user-profile-form');
const userFormContainer = document.getElementById('user-form-container');
const userLoggedInfo = document.getElementById('user-logged-info');
const loggedName = document.getElementById('logged-name');
const loggedDetails = document.getElementById('logged-details');
const userLogoutBtn = document.getElementById('user-logout-btn');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutCloseBtn = document.getElementById('checkout-close-btn');
const finalCheckoutForm = document.getElementById('final-checkout-form');
const payTabBtns = document.querySelectorAll('.pay-tab-btn');
const payContents = document.querySelectorAll('.pay-content');

const builderForm = document.getElementById('builder-form');
const builderWrap = document.getElementById('builder-wrap');
const builderMain = document.getElementById('builder-main');
const builderTotalPrice = document.getElementById('builder-total-price');

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  updateUserUI();
  setupEventListeners();
  loadPaymentSettingsUI();
});

function loadPaymentSettingsUI() {
  document.getElementById('admin-yape-phone').textContent = settings.yapePhone;
  document.getElementById('admin-qr-img').src = settings.qr;
  document.getElementById('admin-bcp-acc').textContent = settings.bcp;
}

function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.desc.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-12">No hay ramos disponibles en esta categoría.</p>`;
    return;
  }

  productsGrid.innerHTML = filtered.map(p => `
    <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-all group">
      <div class="relative overflow-hidden h-52">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-rose-600 font-bold text-xs px-3 py-1 rounded-full shadow-sm">${p.category}</span>
      </div>
      <div class="p-5 flex-1 flex flex-col">
        <h3 class="font-bold text-slate-900 text-base mb-1">${p.name}</h3>
        <p class="text-slate-500 text-xs flex-1 mb-4 leading-relaxed">${p.desc}</p>
        <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <span class="text-lg font-black text-slate-900">S/ ${parseFloat(p.price).toFixed(2)}</span>
          <button onclick="openCustomModal('${p.id}')" class="px-4 py-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-2xl text-sm font-bold transition-colors">
            <i class="fa-solid fa-plus mr-1"></i> Personalizar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterByCampaign(campaignName) {
  activeCategory = campaignName;
  categoryButtons.forEach(b => {
    if (b.dataset.category === campaignName) {
      b.classList.add('bg-rose-500', 'text-white', 'border-rose-500');
      b.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
    } else {
      b.classList.remove('bg-rose-500', 'text-white', 'border-rose-500');
      b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
    }
  });
  renderProducts();
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

function setupEventListeners() {
  searchInput.addEventListener('input', renderProducts);

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => {
        b.classList.remove('bg-rose-500', 'text-white', 'border-rose-500');
        b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
      btn.classList.add('bg-rose-500', 'text-white', 'border-rose-500');
      
      activeCategory = btn.dataset.category;
      renderProducts();
    });
  });

  cartToggleBtn.addEventListener('click', () => cartDrawer.classList.remove('hidden'));
  cartCloseBtn.addEventListener('click', () => cartDrawer.classList.add('hidden'));
  cartOverlay.addEventListener('click', () => cartDrawer.classList.add('hidden'));

  modalCloseBtn.addEventListener('click', () => customModal.classList.add('hidden'));
  modalCustomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('modal-product-id').value;
    const product = products.find(p => p.id === id);
    const sender = document.getElementById('modal-sender').value;
    const recipient = document.getElementById('modal-recipient').value;
    const note = document.getElementById('modal-note').value;

    addToCart({
      cartItemId: Date.now().toString(),
      name: product.name,
      price: parseFloat(product.price),
      details: `De: ${sender} | Para: ${recipient} | Tarjeta: "${note}"`
    });

    customModal.classList.add('hidden');
    modalCustomForm.reset();
  });

  userAccountBtn.addEventListener('click', () => userModal.classList.remove('hidden'));
  userModalClose.addEventListener('click', () => userModal.classList.add('hidden'));

  userProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser = {
      fullname: document.getElementById('user-fullname').value,
      phone: document.getElementById('user-phone').value,
      address: document.getElementById('user-address').value
    };
    localStorage.setItem('nat_user', JSON.stringify(currentUser));
    updateUserUI();
    userModal.classList.add('hidden');
  });

  userLogoutBtn.addEventListener('click', () => {
    localStorage.removeItem('nat_user');
    currentUser = null;
    updateUserUI();
    userModal.classList.add('hidden');
  });

  builderForm.addEventListener('change', calculateBuilderTotal);
  builderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const wrap = builderWrap.value.split('|');
    const main = builderMain.value.split('|');
    const note = document.getElementById('builder-note').value;
    
    let selectedAddons = [];
    document.querySelectorAll('input[name="builder-addon"]:checked').forEach(chk => {
      selectedAddons.push(chk.value.split('|')[0]);
    });

    const total = calculateBuilderTotal();

    addToCart({
      cartItemId: Date.now().toString(),
      name: `Ramo Personalizado Nat`,
      price: total,
      details: `Envoltura: ${wrap[0]} | Principal: ${main[0]} | Extras: ${selectedAddons.join(', ') || 'Ninguno'} | Tarjeta: "${note}"`
    });

    builderForm.reset();
    calculateBuilderTotal();
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    cartDrawer.classList.add('hidden');
    checkoutModal.classList.remove('hidden');
  });

  checkoutCloseBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));

  payTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payTabBtns.forEach(b => {
        b.classList.remove('border-rose-500', 'bg-rose-50/50', 'text-rose-700');
        b.classList.add('border-slate-200', 'bg-white', 'text-slate-700');
      });
      btn.classList.add('border-rose-500', 'bg-rose-50/50', 'text-rose-700');
      btn.classList.remove('border-slate-200', 'bg-white', 'text-slate-700');

      payContents.forEach(c => c.classList.add('hidden'));
      document.getElementById(btn.dataset.target).classList.remove('hidden');
    });
  });

  finalCheckoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendWhatsAppOrderWithPayment();
  });
}

function calculateBuilderTotal() {
  const wrapPrice = parseFloat(builderWrap.value.split('|')[1]) || 0;
  const mainPrice = parseFloat(builderMain.value.split('|')[1]) || 0;
  let addonsPrice = 0;

  document.querySelectorAll('input[name="builder-addon"]:checked').forEach(chk => {
    addonsPrice += parseFloat(chk.value.split('|')[1]) || 0;
  });

  const grandTotal = wrapPrice + mainPrice + addonsPrice;
  builderTotalPrice.textContent = `S/ ${grandTotal.toFixed(2)}`;
  return grandTotal;
}

function openCustomModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modal-product-id').value = product.id;
  document.getElementById('modal-product-title').textContent = product.name;
  document.getElementById('modal-product-price').textContent = `S/ ${parseFloat(product.price).toFixed(2)}`;
  
  if (currentUser) {
    document.getElementById('modal-sender').value = currentUser.fullname;
  }

  customModal.classList.remove('hidden');
}

function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCartUI();
  cartDrawer.classList.remove('hidden');
}

function removeFromCart(cartItemId) {
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('nat_cart', JSON.stringify(cart));
}

function updateCartUI() {
  cartCount.textContent = cart.length;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="text-center text-slate-400 py-12 text-sm">Tu carrito está vacío.</p>`;
    cartTotalPrice.textContent = 'S/ 0.00';
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map(item => {
    total += item.price;
    return `
      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl relative">
        <button onclick="removeFromCart('${item.cartItemId}')" class="absolute top-3 right-3 text-slate-400 hover:text-rose-500">
          <i class="fa-solid fa-trash text-xs"></i>
        </button>
        <h4 class="font-bold text-slate-800 text-sm pr-6">${item.name}</h4>
        <p class="text-xs text-slate-500 my-1 leading-relaxed">${item.details}</p>
        <span class="text-sm font-black text-rose-600">S/ ${item.price.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  cartTotalPrice.textContent = `S/ ${total.toFixed(2)}`;
}

function updateUserUI() {
  if (currentUser) {
    userBtnText.textContent = currentUser.fullname.split(' ')[0];
    userFormContainer.classList.add('hidden');
    userLoggedInfo.classList.remove('hidden');
    loggedName.textContent = currentUser.fullname;
    loggedDetails.textContent = `Tel: ${currentUser.phone} | Dir: ${currentUser.address}`;
  } else {
    userBtnText.textContent = 'Mi Cuenta';
    userFormContainer.classList.remove('hidden');
    userLoggedInfo.classList.add('hidden');
  }
}

function sendWhatsAppOrderWithPayment() {
  const operationCode = document.getElementById('order-operation-code').value;
  const deliveryTime = document.getElementById('order-delivery-time').value;

  let text = `*¡Hola Detalles Nat! He realizado el siguiente pedido:* \n\n`;
  if (currentUser) {
    text += `*Cliente Frecuente:* ${currentUser.fullname}\n`;
    text += `*Teléfono:* ${currentUser.phone}\n`;
    text += `*Dirección:* ${currentUser.address}\n\n`;
  }
  text += `*Nº de Operación / Voucher:* ${operationCode}\n`;
  text += `*Fecha/Hora de Entrega:* ${deliveryTime}\n\n`;
  text += `*Detalle del Pedido:* \n`;

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    text += `${index + 1}. *${item.name}* - S/ ${item.price.toFixed(2)}\n`;
    text += `   _${item.details}_\n\n`;
  });

  text += `*Total Pagado: S/ ${total.toFixed(2)}*\n\n`;
  text += `Adjunto la captura del voucher para su verificación.`;

  const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}