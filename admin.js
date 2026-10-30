// CONFIGURA AQUÍ TU USUARIO Y CONTRASEÑA ÚNICOS
const ADMIN_CREDENTIALS = {
  user: 'admin',
  pass: 'detallesnat2026'
};

const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Ramo Hot Wheels Pro Colección', category: 'Ramos Hot Wheels', price: 89.90, image: 'https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=500', desc: 'Ramo estilo coreano con 8 carritos Hot Wheels en empaque original.' },
  { id: '2', name: 'Ramo Hello Kitty & Sanrio Friends', category: 'Ramos Hello Kitty', price: 95.00, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500', desc: 'Peluche original Hello Kitty con envoltura rosa y finos chocolates.' },
  { id: '3', name: 'Ramo Flores Amarillas (Girasoles Tela & Choco)', category: 'Flores Amarillas', price: 75.00, image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500', desc: 'Ramo radiante duradero para el día de las flores amarillas.' },
  { id: '4', name: 'Box Romántico 14 de Febrero Especial', category: '14 de Febrero', price: 110.00, image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500', desc: 'Box con chocolates Ferrero Rocher, globo de helio y dedicatoria.' },
  { id: '5', name: 'Ramo Mega Chocolatero Ferrero & Princesa', category: 'Ramos de Chocolates', price: 85.00, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', desc: 'Gran surtido de golosinas y chocolates preparados en ramo.' }
];

let products = JSON.parse(localStorage.getItem('nat_products')) || DEFAULT_PRODUCTS;
let settings = JSON.parse(localStorage.getItem('nat_settings')) || {
  whatsapp: '51945770472',
  yapePhone: '945 770 472',
  qr: 'qr_yape.jpeg'
};

const loginScreen = document.getElementById('login-screen');
const loginForm = document.getElementById('login-form');
const adminMainContent = document.getElementById('admin-main-content');
const loginError = document.getElementById('login-error');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

const productForm = document.getElementById('admin-product-form');
const productsTable = document.getElementById('admin-products-table');
const cancelBtn = document.getElementById('admin-cancel-btn');
const formTitle = document.getElementById('form-title');
const resetDefaultBtn = document.getElementById('reset-default-btn');
const settingsForm = document.getElementById('settings-form');

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si ya inició sesión previamente en este navegador
  if (sessionStorage.getItem('nat_admin_logged') === 'true') {
    unlockAdmin();
  }

  // Manejar el formulario de login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = document.getElementById('admin-user').value.trim();
    const passInput = document.getElementById('admin-pass').value.trim();

    if (userInput === ADMIN_CREDENTIALS.user && passInput === ADMIN_CREDENTIALS.pass) {
      sessionStorage.setItem('nat_admin_logged', 'true');
      unlockAdmin();
    } else {
      loginError.classList.remove('hidden');
    }
  });

  adminLogoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('nat_admin_logged');
    location.reload();
  });

  renderTable();
  loadSettingsToForm();

  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    settings.whatsapp = document.getElementById('set-whatsapp').value;
    settings.yapePhone = document.getElementById('set-yape-phone').value;
    settings.bcp = document.getElementById('set-bcp').value;
    settings.qr = document.getElementById('set-qr').value;

    localStorage.setItem('nat_settings', JSON.stringify(settings));
    alert('Información de cuentas guardada correctamente.');
  });

  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('admin-product-id').value;
    const name = document.getElementById('admin-product-name').value;
    const category = document.getElementById('admin-product-category').value;
    const price = parseFloat(document.getElementById('admin-product-price').value);
    const image = document.getElementById('admin-product-image').value;
    const desc = document.getElementById('admin-product-desc').value;

    if (id) {
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { id, name, category, price, image, desc };
      }
    } else {
      const newProduct = {
        id: Date.now().toString(),
        name, category, price, image, desc
      };
      products.push(newProduct);
    }

    saveAndRefresh();
    resetForm();
  });

  cancelBtn.addEventListener('click', resetForm);

  resetDefaultBtn.addEventListener('click', () => {
    if (confirm('¿Deseas restaurar la lista por defecto de Detalles Nat?')) {
      products = [...DEFAULT_PRODUCTS];
      saveAndRefresh();
    }
  });
});

function unlockAdmin() {
  loginScreen.classList.add('hidden');
  adminMainContent.classList.remove('hidden');
}

function loadSettingsToForm() {
  document.getElementById('set-whatsapp').value = settings.whatsapp;
  document.getElementById('set-yape-phone').value = settings.yapePhone;
  document.getElementById('set-bcp').value = settings.bcp;
  document.getElementById('set-qr').value = settings.qr;
}

function renderTable() {
  if (products.length === 0) {
    productsTable.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">No hay productos en el catálogo.</td></tr>`;
    return;
  }

  productsTable.innerHTML = products.map(p => `
    <tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="p-3">
        <img src="${p.image}" class="w-12 h-12 object-cover rounded-xl shadow-sm">
      </td>
      <td class="p-3 font-bold text-slate-800">${p.name}</td>
      <td class="p-3 text-xs text-rose-600 font-bold">${p.category}</td>
      <td class="p-3 font-extrabold text-slate-900">S/ ${parseFloat(p.price).toFixed(2)}</td>
      <td class="p-3 text-right space-x-2">
        <button onclick="editProduct('${p.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button onclick="deleteProduct('${p.id}')" class="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function editProduct(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  document.getElementById('admin-product-id').value = p.id;
  document.getElementById('admin-product-name').value = p.name;
  document.getElementById('admin-product-category').value = p.category;
  document.getElementById('admin-product-price').value = p.price;
  document.getElementById('admin-product-image').value = p.image;
  document.getElementById('admin-product-desc').value = p.desc;

  formTitle.textContent = 'Editar Producto';
  cancelBtn.classList.remove('hidden');
}

function deleteProduct(id) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    products = products.filter(p => p.id !== id);
    saveAndRefresh();
  }
}

function resetForm() {
  productForm.reset();
  document.getElementById('admin-product-id').value = '';
  formTitle.textContent = 'Agregar Nuevo Producto';
  cancelBtn.classList.add('hidden');
}

function saveAndRefresh() {
  localStorage.setItem('nat_products', JSON.stringify(products));
  renderTable();
}