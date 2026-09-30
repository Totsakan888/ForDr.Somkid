/**
 * app.js - Main Flashcard & Quiz Application Logic
 * Implements 3D card flipping, keyboard controls, API syncing, and gamification.
 */

// ==========================================
// Application State
// ==========================================
const state = {
  cards: [],
  filteredCards: [],
  currentIndex: 0,
  isFlipped: false,
  selectedCategory: 'All',
  searchQuery: '',
  statusFilter: 'All',
  streak: parseInt(localStorage.getItem('flashdr_streak') || '0', 10),
  activeTab: 'study',
};

// ==========================================
// DOM Elements
// ==========================================
const DOM = {
  // Navigation & Tabs
  tabs: document.querySelectorAll('.nav-tab'),
  views: document.querySelectorAll('.view-section'),
  totalBadge: document.getElementById('total-count-badge'),
  streakCounter: document.getElementById('streak-counter'),
  masteryPercent: document.getElementById('mastery-percent'),
  soundBtn: document.getElementById('sound-toggle-btn'),
  soundIcon: document.getElementById('sound-icon'),

  // Flashcard View
  studyCategories: document.getElementById('study-categories'),
  cardIndexIndicator: document.getElementById('card-index-indicator'),
  progressFill: document.getElementById('study-progress-fill'),
  mainCard: document.getElementById('main-flashcard'),
  
  // Card Faces
  frontCategory: document.getElementById('card-front-category'),
  frontDifficulty: document.getElementById('card-front-difficulty'),
  frontQuestion: document.getElementById('card-front-question'),
  hintWrapper: document.getElementById('hint-wrapper'),
  frontHint: document.getElementById('card-front-hint'),
  btnToggleHint: document.getElementById('btn-toggle-hint'),

  backCategory: document.getElementById('card-back-category'),
  backMasteredTag: document.getElementById('card-back-mastered-tag'),
  backAnswer: document.getElementById('card-back-answer'),

  btnPrev: document.getElementById('btn-prev-card'),
  btnFlip: document.getElementById('btn-flip-card'),
  btnNext: document.getElementById('btn-next-card'),
  btnShuffle: document.getElementById('btn-shuffle-deck'),
  btnGradeFail: document.getElementById('btn-grade-fail'),
  btnGradePass: document.getElementById('btn-grade-pass'),

  // Manage View
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  filterCatSelect: document.getElementById('filter-category-select'),
  filterStatusSelect: document.getElementById('filter-status-select'),
  cardsTableBody: document.getElementById('cards-table-body'),
  btnExport: document.getElementById('btn-export-json'),
  btnReset: document.getElementById('btn-reset-db'),

  // Modal
  modal: document.getElementById('card-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  btnCancelModal: document.getElementById('btn-cancel-modal'),
  cardForm: document.getElementById('card-form'),
  btnAddModal: document.getElementById('btn-add-modal'),
  formId: document.getElementById('form-card-id'),
  formCategory: document.getElementById('form-category'),
  formDifficulty: document.getElementById('form-difficulty'),
  formQuestion: document.getElementById('form-question'),
  formAnswer: document.getElementById('form-answer'),
  formHint: document.getElementById('form-hint'),
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  updateStreakUI();
  updateSoundUI();
  fetchCardsAndInit();
});

// ==========================================
// Event Listeners Setup
// ==========================================
function initEventListeners() {
  // Tabs switching
  DOM.tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      switchTab(target);
    });
  });

  // Sound Toggle
  DOM.soundBtn.addEventListener('click', () => {
    const isEnabled = window.soundCtrl.toggleSound();
    updateSoundUI();
  });

  // Flashcard Flip & Navigation
  DOM.mainCard.addEventListener('click', (e) => {
    // Don't flip if clicking self-grade buttons or hint toggle
    if (e.target.closest('.self-grade-buttons') || e.target.closest('.btn-hint')) return;
    toggleCardFlip();
  });

  DOM.btnFlip.addEventListener('click', toggleCardFlip);
  DOM.btnPrev.addEventListener('click', showPrevCard);
  DOM.btnNext.addEventListener('click', showNextCard);
  DOM.btnShuffle.addEventListener('click', shuffleDeck);

  DOM.btnToggleHint.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = DOM.hintWrapper.style.display !== 'none';
    DOM.hintWrapper.style.display = isVisible ? 'none' : 'block';
  });

  // Self Grading Buttons
  DOM.btnGradePass.addEventListener('click', (e) => {
    e.stopPropagation();
    handleSelfGrade(true);
  });

  DOM.btnGradeFail.addEventListener('click', (e) => {
    e.stopPropagation();
    handleSelfGrade(false);
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', handleGlobalKeydown);

  // Manage View Filters & Search
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    DOM.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
    applyFilters();
  });

  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.searchQuery = '';
    DOM.searchClearBtn.style.display = 'none';
    applyFilters();
  });

  DOM.filterCatSelect.addEventListener('change', (e) => {
    state.selectedCategory = e.target.value;
    applyFilters();
    updateCategoryChipsUI();
  });

  DOM.filterStatusSelect.addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    applyFilters();
  });

  // Export & Reset
  DOM.btnExport.addEventListener('click', () => {
    window.location.href = '/api/export';
  });

  DOM.btnReset.addEventListener('click', handleResetDB);

  // Modal handlers
  DOM.btnAddModal.addEventListener('click', () => openCardModal());
  DOM.modalCloseBtn.addEventListener('click', closeCardModal);
  DOM.btnCancelModal.addEventListener('click', closeCardModal);
  DOM.modal.addEventListener('click', (e) => {
    if (e.target === DOM.modal) closeCardModal();
  });
  DOM.cardForm.addEventListener('submit', handleFormSubmit);
}

// ==========================================
// Keyboard Controls
// ==========================================
function handleGlobalKeydown(e) {
  // If typing inside input or textarea, ignore shortcuts
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
    if (e.key === 'Escape') closeCardModal();
    return;
  }

  if (state.activeTab !== 'study' || state.filteredCards.length === 0) return;

  if (e.code === 'Space') {
    e.preventDefault();
    toggleCardFlip();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    if (state.isFlipped) {
      handleSelfGrade(false);
    } else {
      showPrevCard();
    }
  } else if (e.code === 'ArrowRight') {
    e.preventDefault();
    if (state.isFlipped) {
      handleSelfGrade(true);
    } else {
      showNextCard();
    }
  }
}

// ==========================================
// API Operations & Data Sync
// ==========================================
async function fetchCardsAndInit() {
  try {
    const res = await fetch('/api/cards');
    const data = await res.json();
    if (data.success) {
      state.cards = data.cards;
      refreshCategoriesList();
      applyFilters();
      fetchStats();
    }
  } catch (err) {
    console.error('Error fetching cards:', err);
  }
}

async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      DOM.masteryPercent.textContent = `${data.stats.mastery_rate}%`;
      DOM.totalBadge.textContent = data.stats.total_cards;
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

// ==========================================
// Flashcard Navigation & Interaction
// ==========================================
function toggleCardFlip() {
  state.isFlipped = !state.isFlipped;
  DOM.mainCard.classList.toggle('is-flipped', state.isFlipped);
  window.soundCtrl.playFlip();
}

function resetFlip() {
  state.isFlipped = false;
  DOM.mainCard.classList.remove('is-flipped');
}

function renderCurrentCard() {
  resetFlip();
  DOM.hintWrapper.style.display = 'none';

  if (state.filteredCards.length === 0) {
    DOM.frontCategory.textContent = 'Empty';
    DOM.frontDifficulty.textContent = '-';
    DOM.frontQuestion.textContent = 'ไม่มีการ์ดในหมวดหมู่นี้ — กด "+ เพิ่มการ์ดใหม่" ได้เลย!';
    DOM.btnToggleHint.style.display = 'none';
    DOM.cardIndexIndicator.textContent = '0 / 0';
    DOM.progressFill.style.width = '0%';
    return;
  }

  // Bound index
  if (state.currentIndex >= state.filteredCards.length) {
    state.currentIndex = 0;
  } else if (state.currentIndex < 0) {
    state.currentIndex = state.filteredCards.length - 1;
  }

  const card = state.filteredCards[state.currentIndex];

  // Front Face
  DOM.frontCategory.textContent = card.category;
  DOM.frontDifficulty.textContent = card.difficulty;
  DOM.frontQuestion.textContent = card.question;

  if (card.hint && card.hint.trim() !== '') {
    DOM.frontHint.textContent = card.hint;
    DOM.btnToggleHint.style.display = 'inline-block';
  } else {
    DOM.btnToggleHint.style.display = 'none';
  }

  // Back Face
  DOM.backCategory.textContent = card.category;
  DOM.backMasteredTag.textContent = card.mastered ? '⭐ จำได้แล้ว' : '📖 กำลังเรียนรู้';
  DOM.backMasteredTag.style.color = card.mastered ? '#34d399' : '#fbbf24';

  // Format code blocks or command outputs
  DOM.backAnswer.innerHTML = formatAnswerContent(card.answer);

  // Indicators & Progress bar
  DOM.cardIndexIndicator.textContent = `การ์ดที่ ${state.currentIndex + 1} จาก ${state.filteredCards.length}`;
  const progressPercent = ((state.currentIndex + 1) / state.filteredCards.length) * 100;
  DOM.progressFill.style.width = `${progressPercent}%`;
}

function formatAnswerContent(text) {
  if (!text) return '';
  // Highlight Cisco commands or terminal prefixes
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const formatted = escaped.replace(
    /(^(?:#|\(config[^\)]*\)#|>)\s*.*$)/gm,
    '<div class="command-block"><code>$1</code></div>'
  );

  return formatted;
}

function showNextCard() {
  if (state.filteredCards.length <= 1) return;
  state.currentIndex = (state.currentIndex + 1) % state.filteredCards.length;
  renderCurrentCard();
}

function showPrevCard() {
  if (state.filteredCards.length <= 1) return;
  state.currentIndex = (state.currentIndex - 1 + state.filteredCards.length) % state.filteredCards.length;
  renderCurrentCard();
}

function shuffleDeck() {
  if (state.filteredCards.length <= 1) return;
  // Fisher-Yates shuffle
  for (let i = state.filteredCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.filteredCards[i], state.filteredCards[j]] = [state.filteredCards[j], state.filteredCards[i]];
  }
  state.currentIndex = 0;
  renderCurrentCard();
  window.soundCtrl.playFlip();
}

// Self-Grading Review (Pass / Fail)
async function handleSelfGrade(remembered) {
  if (state.filteredCards.length === 0) return;
  const currentCard = state.filteredCards[state.currentIndex];

  if (remembered) {
    window.soundCtrl.playSuccess();
    state.streak += 1;
  } else {
    window.soundCtrl.playFail();
    state.streak = Math.max(0, state.streak - 1);
  }

  saveStreak();
  updateStreakUI();

  try {
    const res = await fetch(`/api/cards/${currentCard.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remembered }),
    });
    const data = await res.json();
    if (data.success) {
      // Update local object
      currentCard.mastered = data.card.mastered;
      currentCard.review_count = data.card.review_count;
      fetchStats();
      renderManageTable();
    }
  } catch (err) {
    console.error('Error submitting review:', err);
  }

  // Check if reached deck completion
  if (state.currentIndex === state.filteredCards.length - 1 && state.streak >= 3) {
    triggerConfetti();
    window.soundCtrl.playVictory();
  }

  // Advance smoothly to next card
  setTimeout(() => {
    showNextCard();
  }, 220);
}

// ==========================================
// Filtering & Categories
// ==========================================
function applyFilters() {
  state.filteredCards = state.cards.filter((card) => {
    // Category filter
    const matchesCat = state.selectedCategory === 'All' || card.category === state.selectedCategory;

    // Status filter
    let matchesStatus = true;
    if (state.statusFilter === '1') matchesStatus = card.mastered === 1;
    if (state.statusFilter === '0') matchesStatus = card.mastered === 0;

    // Search query
    let matchesSearch = true;
    if (state.searchQuery) {
      const q = state.searchQuery;
      matchesSearch =
        card.question.toLowerCase().includes(q) ||
        card.answer.toLowerCase().includes(q) ||
        (card.hint && card.hint.toLowerCase().includes(q));
    }

    return matchesCat && matchesStatus && matchesSearch;
  });

  state.currentIndex = 0;
  renderCurrentCard();
  renderManageTable();
}

function refreshCategoriesList() {
  const categories = Array.from(new Set(state.cards.map((c) => c.category))).sort();

  // Populate Study Category Chips
  DOM.studyCategories.innerHTML = '';
  const allChip = document.createElement('button');
  allChip.className = `category-chip ${state.selectedCategory === 'All' ? 'active' : ''}`;
  allChip.dataset.category = 'All';
  allChip.textContent = 'ทั้งหมด';
  allChip.onclick = () => selectCategory('All');
  DOM.studyCategories.appendChild(allChip);

  // Populate Select in Manage View
  DOM.filterCatSelect.innerHTML = '<option value="All">ทุกหมวดหมู่</option>';

  categories.forEach((cat) => {
    // Chip
    const chip = document.createElement('button');
    chip.className = `category-chip ${state.selectedCategory === cat ? 'active' : ''}`;
    chip.dataset.category = cat;
    chip.textContent = cat;
    chip.onclick = () => selectCategory(cat);
    DOM.studyCategories.appendChild(chip);

    // Option
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (state.selectedCategory === cat) opt.selected = true;
    DOM.filterCatSelect.appendChild(opt);
  });
}

function selectCategory(category) {
  state.selectedCategory = category;
  updateCategoryChipsUI();
  DOM.filterCatSelect.value = category;
  applyFilters();
}

function updateCategoryChipsUI() {
  document.querySelectorAll('.category-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.category === state.selectedCategory);
  });
}

// ==========================
// To-Do Style Manage Table
// ==========================
function renderManageTable() {
  DOM.cardsTableBody.innerHTML = '';

  if (state.filteredCards.length === 0) {
    DOM.cardsTableBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>ไม่พบ Flashcard ที่ตรงตามเงื่อนไข</p>
      </div>
    `;
    return;
  }

  state.filteredCards.forEach((card) => {
    const row = document.createElement('div');
    row.className = 'card-list-row';

    const diffClass =
      card.difficulty === 'Easy'
        ? 'diff-easy'
        : card.difficulty === 'Hard'
        ? 'diff-hard'
        : 'diff-medium';

    row.innerHTML = `
      <div class="col-status">
        <button class="toggle-status-btn" title="คลิกเพื่อสลับสถานะ (เหมือนทำ To-Do เสร็จแล้ว)" onclick="toggleMasteredStatus(${card.id})">
          ${card.mastered ? '⭐' : '⚪'}
        </button>
      </div>
      <div class="col-category">
        <span class="category-tag">${card.category}</span>
      </div>
      <div class="col-question">
        <div class="q-text">${card.question}</div>
        <div class="a-preview">${card.answer.replace(/\n/g, ' ')}</div>
      </div>
      <div class="col-difficulty">
        <span class="difficulty-tag ${diffClass}">${card.difficulty}</span>
      </div>
      <div class="col-reviews" style="color: var(--text-dim); font-size: 13px;">
        ${card.review_count} ครั้ง
      </div>
      <div class="col-actions">
        <button class="action-icon-btn btn-edit" title="แก้ไขการ์ด" onclick="editCard(${card.id})">✏️</button>
        <button class="action-icon-btn btn-delete" title="ลบการ์ด" onclick="confirmDeleteCard(${card.id})">🗑️</button>
      </div>
    `;

    DOM.cardsTableBody.appendChild(row);
  });
}

// Global functions for inline table onclick
window.toggleMasteredStatus = async function (id) {
  try {
    const res = await fetch(`/api/cards/${id}/toggle`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      window.soundCtrl.playFlip();
      const targetCard = state.cards.find((c) => c.id === id);
      if (targetCard) targetCard.mastered = data.card.mastered;
      applyFilters();
      fetchStats();
    }
  } catch (err) {
    console.error('Error toggling card status:', err);
  }
};

window.editCard = function (id) {
  const card = state.cards.find((c) => c.id === id);
  if (!card) return;
  openCardModal(card);
};

window.confirmDeleteCard = async function (id) {
  if (confirm('คุณต้องการลบ Flashcard ใบนี้ใช่หรือไม่?')) {
    try {
      const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        state.cards = state.cards.filter((c) => c.id !== id);
        applyFilters();
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  }
};

// ==========================
// Modal & Form Handling
// ==========================
function openCardModal(card = null) {
  DOM.cardForm.reset();
  if (card) {
    DOM.modalTitle.textContent = '✏️ แก้ไข Flashcard';
    DOM.formId.value = card.id;
    DOM.formCategory.value = card.category;
    DOM.formDifficulty.value = card.difficulty;
    DOM.formQuestion.value = card.question;
    DOM.formAnswer.value = card.answer;
    DOM.formHint.value = card.hint || '';
  } else {
    DOM.modalTitle.textContent = '✨ เพิ่ม Flashcard ใหม่';
    DOM.formId.value = '';
    DOM.formCategory.value = state.selectedCategory !== 'All' ? state.selectedCategory : '';
    DOM.formDifficulty.value = 'Medium';
  }
  DOM.modal.classList.add('open');
  DOM.formQuestion.focus();
}

function closeCardModal() {
  DOM.modal.classList.remove('open');
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = DOM.formId.value;
  const payload = {
    category: DOM.formCategory.value.trim() || 'General',
    difficulty: DOM.formDifficulty.value,
    question: DOM.formQuestion.value.trim(),
    answer: DOM.formAnswer.value.trim(),
    hint: DOM.formHint.value.trim(),
  };

  const isEdit = Boolean(id);
  const url = isEdit ? `/api/cards/${id}` : '/api/cards';
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      closeCardModal();
      window.soundCtrl.playSuccess();
      await fetchCardsAndInit();
    } else {
      alert(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  } catch (err) {
    console.error('Error saving card:', err);
  }
}

async function handleResetDB() {
  if (confirm('คุณต้องการรีเซ็ตข้อมูลเป็นชุดตัวอย่างเริ่มต้น (Locality of Reference & Network Config) หรือไม่?')) {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        state.streak = 0;
        saveStreak();
        updateStreakUI();
        await fetchCardsAndInit();
      }
    } catch (err) {
      console.error('Error resetting database:', err);
    }
  }
}

// ==========================
// Gamification & Helpers
// ==========================
function switchTab(tabName) {
  state.activeTab = tabName;
  DOM.tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tabName));
  DOM.views.forEach((v) => v.classList.toggle('active', v.id === `${tabName}-view`));

  if (tabName === 'study') {
    renderCurrentCard();
  } else {
    renderManageTable();
  }
}

function saveStreak() {
  localStorage.setItem('flashdr_streak', state.streak.toString());
}

function updateStreakUI() {
  DOM.streakCounter.textContent = state.streak;
}

function updateSoundUI() {
  DOM.soundIcon.textContent = window.soundCtrl.enabled ? '🔊' : '🔇';
}

// Procedural Zero-Dependency Confetti
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 120;
  const particles = [];
  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ffffff'];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      tilt: Math.random() * 10,
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // air drag
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        alive = true;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  updateConfetti();
}
