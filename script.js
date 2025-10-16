// --- LOGIN ---
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === 'gerente' && pass === 'admin20') {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard-root').style.display = 'block';
    document.body.style.background = "#F8F8FB";
    renderUsers();
    renderProducts();
    updateDashboardCards();
    renderChart();
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
});
document.getElementById('username').addEventListener('input', function() {
  document.getElementById('loginError').style.display = 'none';
});
document.getElementById('password').addEventListener('input', function() {
  document.getElementById('loginError').style.display = 'none';
});

// --- LOGOUT ---
document.getElementById('logoutBtnSidebar').onclick = function() {
  document.getElementById('dashboard-root').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('username').value = "";
  document.getElementById('password').value = "";
  document.body.style.background = "#6C2BD7";
  document.getElementById('loginError').style.display = 'none';
};

// --- MENU MOBILE ---
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
menuToggle.onclick = () => {
  sidebar.classList.toggle('open');
};
window.addEventListener('click', function(e) {
  if (window.innerWidth <= 800 && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  }
});

// --- LOCALSTORAGE HELPERS ---
function saveUsers() {
  localStorage.setItem('dashboard_users', JSON.stringify(users));
}
function loadUsers() {
  const data = localStorage.getItem('dashboard_users');
  if (data) {
    try {
      users = JSON.parse(data);
    } catch {
      users = [];
    }
  }
}
function saveProducts() {
  localStorage.setItem('dashboard_products', JSON.stringify(products));
}
function loadProducts() {
  const data = localStorage.getItem('dashboard_products');
  if (data) {
    try {
      products = JSON.parse(data);
    } catch {
      products = [];
    }
  }
}

// --- ABAS DASHBOARD ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(this.dataset.tab + '-tab').classList.add('active');
    if (window.innerWidth <= 800) sidebar.classList.remove('open');
    if (this.dataset.tab === 'main') {
      updateDashboardCards();
      renderChart();
    }
  });
});

// --- USUÁRIOS (CRUD + LOCALSTORAGE) ---
let users = [];
loadUsers();
if (users.length === 0) {
  users = [
    { id: Date.now(), name: 'User1', password: 'senha123', cargo: 'Diretor' },
    { id: Date.now() + 1, name: 'User2', password: 'senha456', cargo: 'Analista' }
  ];
  saveUsers();
}

function renderUsers() {
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.name}</td><td>${u.cargo}</td>
      <td><button class="delete-user-btn" data-id="${u.id}">Deletar</button></td>`;
    tbody.appendChild(tr);
  });
  document.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.onclick = function() {
      const id = parseInt(this.dataset.id);
      users = users.filter(u => u.id !== id);
      saveUsers();
      renderUsers();
      updateDashboardCards();
      renderChart();
    };
  });
  updateDashboardCards();
}
document.getElementById('add-user-btn').onclick = () => {
  showUserForm();
};
function showUserForm() {
  const form = document.getElementById('add-user-form');
  form.innerHTML = `
    <div class="modal-content">
      <h3>Novo Usuário</h3>
      <input type="text" id="new-user-name" placeholder="Nome do usuário">
      <input type="password" id="new-user-pass" placeholder="Senha">
      <select id="new-user-cargo">
        <option value="">Selecione o cargo</option>
        <option>Diretor</option>
        <option>Analista</option>
        <option>Desenvolvedor</option>
        <option>Financeiro</option>
        <option>Suporte</option>
        <option>Outro</option>
      </select>
      <div class="modal-actions">
        <button id="save-user-btn" class="action-btn">Salvar</button>
        <button id="cancel-user-btn" class="action-btn danger">Cancelar</button>
      </div>
    </div>
  `;
  form.style.display = 'flex';
  document.getElementById('cancel-user-btn').onclick = () => form.style.display = 'none';
  document.getElementById('save-user-btn').onclick = () => {
    const name = document.getElementById('new-user-name').value.trim();
    const pass = document.getElementById('new-user-pass').value.trim();
    const cargo = document.getElementById('new-user-cargo').value;
    if (name && pass && cargo) {
      users.push({ id: Date.now(), name, password: pass, cargo });
      saveUsers();
      form.style.display = 'none';
      renderUsers();
      updateDashboardCards();
      renderChart();
    } else {
      alert('Preencha todos os campos.');
    }
  };
}

// --- PRODUTOS (CRUD + LOCALSTORAGE) ---
let products = [];
loadProducts();
if (products.length === 0) {
  products = ['Produto 1', 'Produto 2'];
  saveProducts();
}

function renderProducts() {
  const list = document.getElementById('products-list');
  list.innerHTML = '';
  products.forEach((p, i) => {
    const li = document.createElement('li');
    li.textContent = p;
    const del = document.createElement('button');
    del.textContent = 'Deletar';
    del.className = 'delete-product-btn';
    del.onclick = () => {
      products.splice(i, 1);
      saveProducts();
      renderProducts();
      updateDashboardCards();
      renderChart();
    };
    li.appendChild(del);
    list.appendChild(li);
  });
  updateDashboardCards();
}
document.getElementById('add-product-btn').onclick = () => {
  document.getElementById('add-product-form').style.display = 'flex';
  document.getElementById('add-product-form').querySelector('input').value = '';
};
document.getElementById('cancel-product-btn').onclick = () => {
  document.getElementById('add-product-form').style.display = 'none';
};
document.getElementById('save-product-btn').onclick = () => {
  const name = document.getElementById('new-product-name').value.trim();
  if (name) {
    products.push(name);
    saveProducts();
    document.getElementById('add-product-form').style.display = 'none';
    renderProducts();
    updateDashboardCards();
    renderChart();
  } else {
    alert('Digite o nome do produto.');
  }
};

// --- DASHBOARD CARDS ---
function updateDashboardCards() {
  document.getElementById('users-count').textContent = users.length;
  document.getElementById('products-count').textContent = products.length;
}

// --- GRÁFICO (Chart.js) ---
let chartInstance = null;
function renderChart() {
  const ctx = document.getElementById('companyChart').getContext('2d');
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Usuários', 'Produtos', 'Vendas'],
      datasets: [{
        label: 'Indicadores do sistema',
        data: [users.length, products.length, 12],
        backgroundColor: [
          '#6C2BD7', '#f2e5ff', '#2ecc71'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, stepSize: 1 }
      }
    }
  });
}

// --- TEMA (Apenas exemplo visual) ---
document.getElementById('theme-select').onchange = function() {
  if (this.value === 'escuro') {
    document.body.style.background = '#222';
    document.querySelectorAll('.tab-content').forEach(el => el.style.background = '#333');
    document.querySelectorAll('.tab-content').forEach(el => el.style.color = '#fff');
  } else {
    document.body.style.background = '#F8F8FB';
    document.querySelectorAll('.tab-content').forEach(el => el.style.background = '#fff');
    document.querySelectorAll('.tab-content').forEach(el => el.style.color = '#222');
  }
};