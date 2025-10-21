// ==========================================
// STATE MANAGEMENT
// ==========================================

const appState = {
  currentUser: null,
  reports: [
    {
      id: 0,
      type: "Crime",
      address: "Rua Clarentino, 312",
      date: "2010 - 16:12",
      description:
        "Hoje, por volta das 19h00, vi dois homens entrarem no mercadinho da São Féres. Um deles sacou uma arma e levou todo o caixa, enquanto o outro pegava o dinheiro. Saí correndo logo depois. Todo eu estava armado, mas não tenho certeza porque foi tudo muito rápido.",
      verifications: 0,
      verified: false,
    },
    {
      id: 1,
      type: "Acidente",
      address: "Av. Paulista, 1578",
      date: "2010 - 14:30",
      description:
        "Colisão entre dois carros na esquina. Trânsito interrompido. Ambulância já foi chamada.",
      verifications: 3,
      verified: false,
    },
  ],
  currentReport: null,
  selectedCategory: "crime",
  settings: {
    alerts: true,
    accidents: true,
    theme: "claro",
    language: "português",
  },
};

let map;
let googleMapsLoaded = false;

// ==========================================
// GOOGLE MAPS CALLBACK
// ==========================================

// Essa função é chamada automaticamente quando a API do Google Maps carrega
function initMap() {
  googleMapsLoaded = true;

  // Cria o mapa imediatamente se o usuário já estiver logado
  if (appState.currentUser) {
    renderMap();
  }
}


// Função real que cria o mapa e adiciona marcadores
function renderMap() {
  const initialLocation = { lat: -23.55052, lng: -46.633308 };

  map = new google.maps.Map(document.getElementById("gmap"), {
    center: initialLocation,
    zoom: 14,
    disableDefaultUI: true,
  });

  // Adiciona marcadores existentes
  appState.reports.forEach((report) => {
    const lat = initialLocation.lat + (Math.random() - 0.5) * 0.02;
    const lng = initialLocation.lng + (Math.random() - 0.5) * 0.02;

    // ======================================================
    // NOVO: Lógica para escolher o ícone
    // ======================================================
    let markerIcon = null;

    if (report.type === "Crime") {
      // URL para o pino vermelho do Google
      markerIcon = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
    } else if (report.type === "Acidente") {
      // URL para o pino amarelo do Google
      markerIcon = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    } else {
      // Para a categoria "Outro", usamos um pino azul
      markerIcon = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
    // ======================================================

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: report.type,
      icon: markerIcon // <-- NOVO: Propriedade do ícone adicionada
    });

    marker.addListener("click", () => handleOpenReportDetail(report.id));
  });
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function navigateTo(pageId) {
  // Impede voltar ao login se já estiver logado
  if (pageId === "login-page" && appState.currentUser) return;

  document.querySelector(".screen").scrollTop = 0;

  document.querySelectorAll(".page").forEach((page) =>
    page.classList.remove("active")
  );
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add("active");

  updateActiveNav(pageId);

  if (pageId === "map-page" && googleMapsLoaded) {
    renderMap();
  }

  const bottomNav = document.querySelector(".bottom-nav");
  bottomNav.style.display = pageId === "login-page" ? "none" : "flex";
}

function updateActiveNav(pageId) {
  document
    .querySelectorAll(".nav-item")
    .forEach((item) => item.classList.remove("active"));
  const activeNavItem = document.querySelector(`[data-page="${pageId}"]`);
  if (activeNavItem) activeNavItem.classList.add("active");
}

// ==========================================
// LOGIN FUNCTIONALITY
// ==========================================

function handleLogin() {
  const username = document.getElementById("login-input").value;
  const password = document.getElementById("password-input").value;

  if (username && password) {
    appState.currentUser = {
      name: username,
      memberSince: "22/05/2010",
      neighborhood: "Tatuapé",
      phone: "(11) 94723-8293",
      rating: 4,
    };

    updateProfileInfo();
    navigateTo("map-page");

    // Espera o Google Maps carregar antes de renderizar
    if (googleMapsLoaded) {
      renderMap();
    } else {
      const interval = setInterval(() => {
        if (googleMapsLoaded) {
          clearInterval(interval);
          renderMap();
        }
      }, 500);
    }
  } else {
    alert("Por favor, preencha todos os campos");
  }
}

function handleSocialLogin() {
  appState.currentUser = {
    name: "Usuário Social",
    memberSince: "22/05/2010",
    neighborhood: "Tatuapé",
    phone: "(11) 94723-8293",
    rating: 4,
  };

  updateProfileInfo();
  navigateTo("map-page");

  if (googleMapsLoaded) {
    renderMap();
  } else {
    const interval = setInterval(() => {
      if (googleMapsLoaded) {
        clearInterval(interval);
        renderMap();
      }
    }, 500);
  }
}

function handleLogout() {
  appState.currentUser = null;
  document.getElementById("login-input").value = "";
  document.getElementById("password-input").value = "";
  navigateTo("login-page");
}

// ==========================================
// PROFILE FUNCTIONS
// ==========================================

function updateProfileInfo() {
  if (!appState.currentUser) return;

  document.getElementById("profile-name").textContent =
    appState.currentUser.name;
  document.getElementById("member-since").textContent =
    appState.currentUser.memberSince;
  document.getElementById("neighborhood").textContent =
    appState.currentUser.neighborhood;
  document.getElementById("phone-number").textContent =
    appState.currentUser.phone;

  const ratingStars =
    "★".repeat(appState.currentUser.rating) +
    "☆".repeat(5 - appState.currentUser.rating);
  document.getElementById("user-rating").textContent = ratingStars;
}

// ==========================================
// REPORT DETAIL FUNCTIONS
// ==========================================

function handleOpenReportDetail(reportId) {
  const report = appState.reports.find((r) => r.id == reportId);
  if (!report) return;

  appState.currentReport = report;
  populateReportDetail();
  navigateTo("detail-page");
}

function populateReportDetail() {
  const report = appState.currentReport;
  if (!report) return;

  document.getElementById("detail-type").textContent = `Tipo: ${report.type}`;
  document.getElementById(
    "detail-address"
  ).textContent = `Endereço: ${report.address}`;
  document.getElementById("detail-date").textContent = `Data: ${report.date}`;
  document.getElementById("detail-description").textContent = report.description;
  updateReportStatus();

  // Garante que os botões de verificação estejam sempre ativos ao abrir a página
  document.getElementById("verify-yes").disabled = false;
  document.getElementById("verify-no").disabled = false;
}

function handleVerification(isVerified) {
  const report = appState.currentReport;
  if (!report) return;

  if (isVerified) {
    report.verifications++;
    report.verified = true;
  }

  updateReportStatus();
  document.getElementById("verify-yes").disabled = true;
  document.getElementById("verify-no").disabled = true;

  // ======================================================
  // Adiciona a mensagem de confirmação
  // ======================================================
  alert("Obrigado pela sua verificação!");
  // ======================================================

  // Volta para o mapa logo após a verificação
  navigateTo("map-page");
}
function updateReportStatus() {
  const report = appState.currentReport;
  const statusEl = document.getElementById("detail-status");

  statusEl.textContent = `${report.verifications} relato(s) autenticado(s)`;
  statusEl.style.background = report.verifications > 0 ? "#4caf50" : "#ffc107";
  statusEl.style.color = report.verifications > 0 ? "white" : "#333";
}

// ==========================================
// CREATE REPORT FUNCTIONS
// ==========================================

function handleSelectCategory(event) {
  document
    .querySelectorAll(".category-tabs .tab")
    .forEach((tab) => tab.classList.remove("active"));
  const clickedTab = event.currentTarget;
  clickedTab.classList.add("active");
  appState.selectedCategory = clickedTab.dataset.category;
}

function handleCreateReport() {
  const address = document.getElementById("report-address").value;
  const when = document.getElementById("report-when").value;
  const description = document.getElementById("report-description").value;

  // Pega o input do arquivo e o arquivo selecionado
  const fileInput = document.getElementById("file-upload");
  const file = fileInput.files[0]; // Este é o objeto do arquivo

  if (!address || !when || !description) {
    alert("Por favor, preencha todos os campos da denúncia.");
    return;
  }

  // --- Simulação de "Envio" ---
  if (file) {
    console.log("Enviando arquivo para o servidor:", file.name);
  }
  // -----------------------------

  const newReport = {
    id: appState.reports.length,
    type:
      appState.selectedCategory.charAt(0).toUpperCase() +
      appState.selectedCategory.slice(1),
    address,
    date: when,
    description,
    media: file ? file.name : null,
    verifications: 0,
    verified: false,
  };

  appState.reports.push(newReport);
  // Mensagem de confirmação
  alert("Ocorrência enviada com sucesso!");

  document.getElementById("report-address").value = "";

  // Limpa os campos do formulário
  document.getElementById("report-address").value = "";
  document.getElementById("report-when").value = "";
  document.getElementById("report-description").value = "";

  // Limpa o input de arquivo e o nome do arquivo
  fileInput.value = "";
  document.getElementById("file-name").textContent = "";

  navigateTo("map-page");
}

function addNewMapMarker(report) {
  const lat = map.getCenter().lat() + (Math.random() - 0.5) * 0.01;
  const lng = map.getCenter().lng() + (Math.random() - 0.5) * 0.01;

  const marker = new google.maps.Marker({
    position: { lat, lng },
    map,
    title: report.type,
  });

  marker.addListener("click", () => handleOpenReportDetail(report.id));
}

// ==========================================
// APP INITIALIZATION
// ==========================================

function initApp() {
  document.getElementById("login-btn").addEventListener("click", handleLogin);
  document
    .getElementById("google-login")
    .addEventListener("click", handleSocialLogin);
  document
    .getElementById("facebook-login")
    .addEventListener("click", handleSocialLogin);

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => navigateTo(item.dataset.page));
  });

  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.page));
  });

  document
    .querySelectorAll(".category-tabs .tab")
    .forEach((tab) => tab.addEventListener("click", handleSelectCategory));

  document
    .getElementById("submit-report")
    .addEventListener("click", handleCreateReport);
  document
    .getElementById("verify-yes")
    .addEventListener("click", () => handleVerification(true));
  document
    .getElementById("verify-no")
    .addEventListener("click", () => handleVerification(false));
  document
    .getElementById("logout-btn")
    .addEventListener("click", handleLogout);
  document
    .getElementById("notifications-btn")
    .addEventListener("click", () => navigateTo("settings-page"));
  // Novo listener para mostrar o nome do arquivo selecionado
  document.getElementById("file-upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      document.getElementById("file-name").textContent = file.name;
    } else {
      document.getElementById("file-name").textContent = "";
    }
  });

  navigateTo("login-page");
}

document.addEventListener("DOMContentLoaded", initApp);
