/**
 * NutriTrack — Main Application
 * FIX (C3): Не используем window.* — вместо этого Module Pattern
 */

import storage from './modules/storage.js';
import { buildCalories } from './modules/calorie-builder.js';

// --- Helpers ---
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
import { getMealTiming, getGeneralTips, getPreWorkoutNutrition, getHydrationRecommendation } from './modules/recommendations.js';
import { searchProducts, findProduct, calculateNutrients, sumNutrients, products, categories } from './db/products-db.js';
import { resolveAlias } from './db/product-aliases.js';

// --- State ---
const state = {
  currentPage: 'dashboard',
  profile: storage.lsGet('nt_profile', {}),
  dailyLog: storage.lsGet('nt_daily_log', {}),
  activeMeal: 'breakfast',
};

// --- DOM Helpers ---
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// --- Navigation ---
function navigate(page, updateHash = true) {
  // Hide all sections
  $$('.app-section').forEach(s => s.classList.remove('active'));
  // Show target
  const target = $(`.app-section[data-page="${page}"]`);
  if (target) {
    target.classList.add('active');
    state.currentPage = page;
    if (updateHash) history.pushState({ page }, '', `#${page}`);
    // Update nav active state
    $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
    // Call page-specific init
    if (page === 'dashboard') initDashboard();
    else if (page === 'calculator') initCalculator();
    else if (page === 'food-log') initFoodLog();
    else if (page === 'bmi') initBMI();
    else if (page === 'recommendations') initRecommendations();
    else if (page === 'nutrition-facts') initNutritionFacts();
    else if (page === 'profile') initProfile();
  }
}

// --- Toast Notifications (instead of alert) ---
const TOAST_COLORS = { info: '#2196F3', success: '#4CAF50', warning: '#FF9800', error: '#F44336' };
const TOAST_ICONS = { info: 'fa-info-circle', success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle' };

function showToast(message, type = 'info') {
  const colors = TOAST_COLORS;
  const icons = TOAST_ICONS;

  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = `
      position: fixed; top: 80px; right: 20px; z-index: 10000;
      display: flex; flex-direction: column; gap: 8px;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  toast.style.cssText = `
    display: flex; align-items: center; gap: 10px; padding: 12px 20px;
    background: #fff; color: #333; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-left: 4px solid ${colors[type] || colors.info};
    animation: slideIn 0.3s ease; min-width: 280px;
    font-size: 0.9rem;
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      toast.remove();
      if (!container.children.length) container.remove();
    }, 300);
  }, 3000);
}

// --- Dashboard ---
function initDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = state.dailyLog[today] || {};
  let totalCal = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;

  for (const meal of ['breakfast', 'lunch', 'dinner', 'snack']) {
    const items = todayLog[meal] || [];
    for (const item of items) {
      const nutrients = item.nutrients || {};
      totalCal += nutrients.calories || 0;
      totalProtein += nutrients.protein || 0;
      totalFat += nutrients.fat || 0;
      totalCarbs += nutrients.carbs || 0;
    }
  }

  const targets = { cal: 2000, protein: 150, fat: 67, carbs: 250 };
  const pct = (val, max) => Math.min(100, Math.round((val / max) * 100));

  // Update dashboard cards
  const calEl = $('#dash-calories');
  if (calEl) {
    calEl.textContent = `${totalCal}/${targets.cal}`;
    const bar = $('#dash-cal-bar');
    if (bar) bar.style.width = `${pct(totalCal, targets.cal)}%`;
  }
  const protEl = $('#dash-protein');
  if (protEl) {
    protEl.textContent = `${totalProtein.toFixed(1)}/${targets.protein}г`;
    const bar = $('#dash-prot-bar');
    if (bar) bar.style.width = `${pct(totalProtein, targets.protein)}%`;
  }
  const fatEl = $('#dash-fat');
  if (fatEl) {
    fatEl.textContent = `${totalFat.toFixed(1)}/${targets.fat}г`;
    const bar = $('#dash-fat-bar');
    if (bar) bar.style.width = `${pct(totalFat, targets.fat)}%`;
  }
  const carbEl = $('#dash-carbs');
  if (carbEl) {
    carbEl.textContent = `${totalCarbs.toFixed(1)}/${targets.carbs}г`;
    const bar = $('#dash-carbs-bar');
    if (bar) bar.style.width = `${pct(totalCarbs, targets.carbs)}%`;
  }
}

// --- Calculator ---
function initCalculator() {
  const form = $('#bmi-calculator-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const weight = parseFloat($('#cal-weight').value);
    const height = parseFloat($('#cal-height').value);
    const age = parseInt($('#cal-age').value);
    const sex = $('#cal-sex').value;
    const activity = $('#cal-activity').value;
    const goal = $('#cal-goal').value;

    if (!weight || !height || !age) {
      showToast('Заполните все обязательные поля', 'warning');
      return;
    }

    const result = buildCalories(weight, height, age, sex, activity, goal);

    // Display results
    $('#result-bmr').textContent = result.bmr;
    $('#result-tdee').textContent = result.tdee;
    $('#result-calories').textContent = result.calories;
    $('#result-protein').textContent = `${result.protein}г`;
    $('#result-fat').textContent = `${result.fat}г`;
    $('#result-carbs').textContent = `${result.carbs}г`;

    // Show results section
    const results = $('#cal-results');
    if (results) results.style.display = 'block';
  });
}

// --- Food Log ---
function initFoodLog() {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = state.dailyLog[today] || {};
  state.dailyLog[today] = todayLog;
  storage.lsSet('nt_daily_log', state.dailyLog);
  renderMealTab();
}

function renderMealTab() {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = state.dailyLog[today] || {};
  const mealItems = (todayLog[state.activeMeal] || []).map((item, i) => ({
    index: i,
    name: item.name,
    grams: item.grams,
    ...item.nutrients,
  }));

  const container = $('#meal-items-list');
  if (!container) return;

  if (mealItems.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-utensils"></i>Добавьте продукты</div>';
  } else {
    container.innerHTML = mealItems.map(item => `
      <div class="meal-item" data-index="${item.index}">
        <div class="meal-item-info">
          <div class="meal-item-name">${item.name}</div>
          <div class="meal-item-detail">${item.grams}г</div>
        </div>
        <div class="meal-item-macros">
          <span><strong>${item.calories}</strong> ккал</span>
          <span>Б ${item.protein}г</span>
          <span>Ж ${item.fat}г</span>
          <span>У ${item.carbs}г</span>
        </div>
        <button class="remove-item-btn" data-index="${item.index}" title="Удалить">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');
  }

  // Calculate totals
  const totals = sumNutrients(mealItems);
  const totalEl = $('#meal-totals');
  if (totalEl) {
    totalEl.innerHTML = `
      <div class="total-row">
        <span>Всего за приём:</span>
        <span><strong>${totals.calories}</strong> ккал</span>
      </div>
      <div class="total-row macros">
        <span>Белки: <strong>${totals.protein}г</strong></span>
        <span>Жиры: <strong>${totals.fat}г</strong></span>
        <span>Углеводы: <strong>${totals.carbs}г</strong></span>
      </div>
    `;
  }

  // Add event listeners
  container.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      removeFromMeal(idx);
    });
  });
}

function removeFromMeal(index) {
  const today = new Date().toISOString().split('T')[0];
  if (!state.dailyLog[today]) return;
  const mealItems = state.dailyLog[today][state.activeMeal];
  if (!mealItems || index < 0 || index >= mealItems.length) return;
  mealItems.splice(index, 1);
  storage.lsSet('nt_daily_log', state.dailyLog);
  renderMealTab();
}

function switchMeal(meal) {
  const validMeals = ['breakfast', 'lunch', 'dinner', 'snack'];
  if (!validMeals.includes(meal)) return;
  state.activeMeal = meal;
  $$('.meal-tab').forEach(t => t.classList.toggle('active', t.dataset.meal === meal));
  renderMealTab();
}

function openProductModal(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const overlay = document.createElement('div');
  overlay.className = 'product-detail-overlay';
  const catLabel = categories.find(c => c.key === product.category)?.label || product.category;
  overlay.innerHTML = `
    <div class="product-detail-card">
      <button class="product-detail-close"><i class="fas fa-times"></i></button>
      <div class="product-detail-name">${escapeHTML(product.name)}</div>
      <div class="product-detail-cat">${escapeHTML(catLabel)}</div>
      <div class="product-detail-grid">
        <div class="product-detail-item">
          <div class="label">Калории</div>
          <div class="value">${product.calories}</div>
        </div>
        <div class="product-detail-item">
          <div class="label">Белки</div>
          <div class="value">${product.protein}г</div>
        </div>
        <div class="product-detail-item">
          <div class="label">Жиры</div>
          <div class="value">${product.fat}г</div>
        </div>
        <div class="product-detail-item">
          <div class="label">Углеводы</div>
          <div class="value">${product.carbs}г</div>
        </div>
      </div>
      <button class="product-add-btn" id="add-${product.id}">
        <i class="fas fa-plus"></i> Добавить
      </button>
    </div>
  `;

  overlay.querySelector('.product-detail-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  const addBtn = overlay.querySelector(`#add-${product.id}`);
  addBtn.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    if (!state.dailyLog[today]) state.dailyLog[today] = {};
    if (!state.dailyLog[today][state.activeMeal]) state.dailyLog[today][state.activeMeal] = [];

    const grams = 100;
    const nutrients = calculateNutrients(product, grams);
    state.dailyLog[today][state.activeMeal].push({
      productId: product.id,
      name: product.name,
      grams,
      nutrients,
    });
    storage.lsSet('nt_daily_log', state.dailyLog);
    overlay.remove();
    renderMealTab();
    showToast(`${escapeHTML(product.name)} добавлен в ${getMealTypeName(state.activeMeal)}`, 'success');
  });

  document.body.appendChild(overlay);
}

function getMealTypeName(meal) {
  const names = { breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин', snack: 'Перекус' };
  return names[meal] || meal;
}

// --- Shared Search Dropdown ---
function createSearchDropdown(inputEl, dropdownEl, { maxResults = 20, showCategory = true } = {}) {
  if (!inputEl || !dropdownEl) return;

  let debounceTimer;
  inputEl.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = inputEl.value.trim();
      if (query.length < 2) {
        dropdownEl.classList.remove('open');
        return;
      }
      const results = searchProducts(query).slice(0, maxResults);
      if (results.length === 0) {
        dropdownEl.innerHTML = '<div class="search-result-item text-muted">Ничего не найдено</div>';
      } else {
        dropdownEl.innerHTML = results.map(p => `
          <div class="search-result-item" data-product-id="${p.id}">
            <span class="search-result-name">${escapeHTML(p.name)}</span>
            ${showCategory ? `<span class="search-result-cat">${escapeHTML(categories.find(c => c.key === p.category)?.label || '')}</span>` : ''}
            <span class="search-result-cal">${p.calories} ккал</span>
          </div>
        `).join('');
      }
      dropdownEl.classList.add('open');

      dropdownEl.querySelectorAll('.search-result-item[data-product-id]').forEach(item => {
        item.addEventListener('click', () => {
          const pid = parseInt(item.dataset.productId);
          openProductModal(pid);
          inputEl.value = '';
          dropdownEl.classList.remove('open');
        });
      });
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.classList.remove('open');
    }
  });
}

function initSearch() {
  createSearchDropdown($('#product-search'), $('#search-results'), { maxResults: 20, showCategory: true });
}

function initFoodSearch() {
  createSearchDropdown($('#food-search-input'), $('#food-search-results'), { maxResults: 10, showCategory: false });
}

// --- BMI ---
function initBMI() {
  const form = $('#bmi-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const weight = parseFloat($('#bmi-weight').value);
    const height = parseFloat($('#bmi-height').value);

    if (!weight || !height) {
      showToast('Заполните вес и рост', 'warning');
      return;
    }

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const category = getBMICategory(parseFloat(bmi));
    const ideal = getIdealWeightRange(height);
    const diff = getWeightDifference(weight, height);

    const resultSection = $('#bmi-result');
    if (resultSection) {
      resultSection.innerHTML = `
        <div class="bmi-result-card" style="border-left-color: ${category.color};">
          <div class="bmi-value" style="color: ${category.color}">${bmi}</div>
          <div class="bmi-category" style="color: ${category.color}">${category.label}</div>
          <div class="bmi-advice">${category.advice}</div>
        </div>
        <div class="grid-2 mt-2">
          <div class="stat-card">
            <div class="stat-label">Идеальный вес</div>
            <div class="stat-value">${ideal.min}–${ideal.max} кг</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Разница</div>
            <div class="stat-value" style="color: ${diff > 0 ? '#f44336' : diff < 0 ? '#2196f3' : '#4caf50'}">
              ${diff > 0 ? '+' : ''}${diff} кг
            </div>
          </div>
        </div>
      `;
    }
  });
}

// --- Recommendations ---
function initRecommendations() {
  // Meal timing
  const timingContainer = $('#meal-timing-list');
  if (timingContainer) {
    const timing = getMealTiming();
    timingContainer.innerHTML = timing.map(t => `
      <div class="timing-item">
        <div class="timing-time">${t.time}</div>
        <div>
          <div class="timing-meal">${t.meal} (${t.calories})</div>
          <div class="timing-desc">${t.desc}</div>
        </div>
      </div>
    `).join('');
  }

  // General tips
  const tipsContainer = $('#general-tips-list');
  if (tipsContainer) {
    const tips = getGeneralTips();
    tipsContainer.innerHTML = tips.map(t => `
      <div class="tip-item">
        <i class="fas ${t.icon}"></i>
        <div>
          <strong>${t.title}</strong>
          <p>${t.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Pre/post workout
  const pw = getPreWorkoutNutrition();
  const pwSection = $('#pre-workout-section');
  if (pwSection) {
    pwSection.innerHTML = `
      <div class="timing-item">
        <div class="timing-time">${pw.timing}</div>
        <div>
          <div class="timing-meal">${pw.recommendation}</div>
          ${pw.examples.map(e => `<div class="timing-desc">• ${e}</div>`).join('')}
        </div>
      </div>
      <div class="mt-2">
        <div class="timing-meal">После тренировки: ${pw.postWorkout}</div>
        ${pw.postExamples.map(e => `<div class="timing-desc">• ${e}</div>`).join('')}
      </div>
    `;
  }

  // Hydration
  const hydrateContainer = $('#hydration-info');
  if (hydrateContainer) {
    const weight = state.profile?.weight || 70;
    const hydrate = getHydrationRecommendation(weight);
    hydrateContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${hydrate.amount}</div>
        <div class="stat-label">${hydrate.unit}</div>
      </div>
      <p class="mt-1 text-center">${hydrate.note}</p>
      <p class="text-center mt-1"><small>${hydrate.tip}</small></p>
    `;
  }
}

// --- Nutrition Facts ---
function initNutritionFacts() {
  const container = $('#nutrition-list');
  if (!container) return;

  const nutrients = getNutrientsList();
  container.innerHTML = nutrients.map(n => `
    <div class="nutrient-item">
      <div class="nutrient-header" data-nutrient-id="${n.id}">
        <h4><i class="fas fa-leaf"></i> ${n.name}</h4>
        <span class="nutrient-norm">${n.dailyNorm}</span>
      </div>
      <div class="nutrient-brief">
        <p>${n.brief}</p>
      </div>
      <div class="nutrient-detail" style="display: none;">
        <p>${n.detail}</p>
        <div class="mt-1">
          <strong>Источники:</strong> ${n.sources}
        </div>
        <div class="mt-1">
          <strong>Дефицит:</strong> ${n.deficiency}
        </div>
        <div class="mt-1">
          <strong>Избыток:</strong> ${n.excess}
        </div>
      </div>
    </div>
  `).join('');

  // Toggle expand/collapse
  container.querySelectorAll('.nutrient-header').forEach(header => {
    header.addEventListener('click', () => {
      const detail = header.nextElementSibling.nextElementSibling;
      const isExpanded = header.dataset.expanded === 'true';
      header.dataset.expanded = !isExpanded;
      detail.style.display = isExpanded ? 'none' : 'block';
    });
  });
}

// --- Profile ---
function initProfile() {
  const form = $('#profile-form');
  if (!form) return;

  // Fill current profile
  if (state.profile) {
    $('#prof-name').value = state.profile.name || '';
    $('#prof-weight').value = state.profile.weight || '';
    $('#prof-height').value = state.profile.height || '';
    $('#prof-age').value = state.profile.age || '';
    $('#prof-sex').value = state.profile.sex || 'male';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.profile = {
      name: $('#prof-name').value,
      weight: parseFloat($('#prof-weight').value),
      height: parseFloat($('#prof-height').value),
      age: parseInt($('#prof-age').value),
      sex: $('#prof-sex').value,
    };
    storage.lsSet('nt_profile', state.profile);
    showToast('Профиль сохранён', 'success');
  });
}

// --- Cookie Banner ---
function initCookieBanner() {
  const banner = $('.cookie-banner');
  if (!banner || storage.lsGet('nt_cookies_accepted')) return;

  const acceptBtn = banner.querySelector('.btn-accept-cookies');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      storage.lsSet('nt_cookies_accepted', true);
      banner.style.display = 'none';
    });
  }
}

// --- Mobile Menu ---
function initMobileMenu() {
  const toggle = $('.menu-toggle');
  const nav = $('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
}

// --- CSS Animations (injected) ---
function injectAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes toastSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// --- Init ---
function init() {
  injectAnimations();
  initMobileMenu();
  initSearch();
  initFoodSearch();
  initProfile();
  initCookieBanner();

  // Handle hash navigation
  const hash = window.location.hash?.slice(1);
  if (hash && ['dashboard', 'calculator', 'food-log', 'bmi', 'recommendations', 'nutrition-facts'].includes(hash)) {
    navigate(hash, false);
  } else {
    navigate('dashboard');
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const page = window.location.hash?.slice(1);
    if (page) navigate(page);
  });

  // Nav links
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) {
        navigate(page);
        // Close mobile menu
        const nav = $('.nav');
        if (nav) nav.classList.remove('open');
      }
    });
  });

  // Meal tabs
  $$('.meal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchMeal(tab.dataset.meal);
    });
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}