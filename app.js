// Global state
let classesData = [];
let currentClass = null;

// DOM Elements
const loadingEl = document.getElementById('loading');
const gridEl = document.getElementById('classes-grid');
const emptyStateEl = document.getElementById('empty-state');
const modalEl = document.getElementById('modal');
const modalContentEl = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');

// Modal Elements
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalBook = document.getElementById('modal-book');
const modalBenefit = document.getElementById('modal-benefit');
const modalSummary = document.getElementById('modal-summary');
const modalSkills = document.getElementById('modal-skills');
const modalExtraSection = document.getElementById('modal-extra-section');
const modalExtra = document.getElementById('modal-extra');

// Load classes from JSON
async function loadClasses() {
    try {
        const response = await fetch('json/classes.json');
        const data = await response.json();
        
        // Check if data.classes is an array or single object
        if (Array.isArray(data.classes)) {
            classesData = data.classes;
        } else if (data.classes && typeof data.classes === 'object') {
            // If it's a single object, wrap it in an array
            classesData = [data.classes];
        } else {
            classesData = [];
        }
        
        renderClasses();
    } catch (error) {
        console.error('Erro ao carregar classes:', error);
        showEmptyState();
    }
}

// Render classes grid
function renderClasses() {
    loadingEl.classList.add('hidden');
    
    if (classesData.length === 0) {
        showEmptyState();
        return;
    }
    
    gridEl.classList.remove('hidden');
    gridEl.innerHTML = '';
    
    classesData.forEach((classData, index) => {
        const card = createClassCard(classData, index);
        gridEl.appendChild(card);
    });
}

// Create class card
function createClassCard(classData, index) {
    const card = document.createElement('div');
    card.className = 'class-card relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-xl border border-purple-500/20 fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="relative h-48 overflow-hidden">
            <img src="${classData.imagem}" alt="${classData.nome}" class="card-image w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            <div class="absolute top-3 right-3">
                <img src="${classData.icon}" alt="${classData.nome} icon" class="w-12 h-12 rounded-full border-2 border-purple-400/50 bg-slate-900/80 p-1">
            </div>
        </div>
        <div class="p-5">
            <h3 class="text-2xl font-bold text-white mb-2 font-cinzel">${classData.nome}</h3>
            <p class="text-purple-200/70 text-sm line-clamp-3 font-inter">${classData.resumo}</p>
            <div class="mt-4 flex items-center justify-between">
                <span class="text-xs text-purple-300/80 font-inter capitalize">${classData.livro}</span>
                <span class="text-xs text-purple-400 font-semibold font-inter">${classData.skills.length} habilidades</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => openModal(classData));
    
    return card;
}

// Open modal with class details
function openModal(classData) {
    currentClass = classData;
    
    // Populate modal
    modalImage.src = classData.imagem;
    modalImage.alt = classData.nome;
    modalTitle.textContent = classData.nome;
    modalBook.textContent = `Livro: ${classData.livro.charAt(0).toUpperCase() + classData.livro.slice(1)}`;
    modalBenefit.textContent = classData.beneficio_gratis;
    modalSummary.textContent = classData.resumo;
    
    // Render skills
    modalSkills.innerHTML = '';
    classData.skills.forEach((skill, index) => {
        const skillCard = createSkillCard(skill, index);
        modalSkills.appendChild(skillCard);
    });

    // Render extra (if present)
    renderExtra(classData.extra);
    
    // Show modal with animation
    modalEl.classList.remove('hidden');
    setTimeout(() => {
        modalEl.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Render `extra` content. Supports:
// - string (interpreted as trusted HTML)
// - object with { tables: [ { caption, headers: [], rows: [[], ...] } ], notes }
function renderExtra(extra) {
    // Hide by default
    modalExtraSection.classList.add('hidden');
    modalExtra.innerHTML = '';

    if (!extra) return;

    // If extra is a string, treat as trusted HTML (user-provided HTML in JSON)
    if (typeof extra === 'string') {
        // NOTE: This inserts raw HTML. Only use if JSON is trusted.
        modalExtra.innerHTML = extra;
        modalExtraSection.classList.remove('hidden');
        return;
    }

    // If extra is an array, render each item
    if (Array.isArray(extra)) {
        extra.forEach(item => renderExtra(item));
        modalExtraSection.classList.remove('hidden');
        return;
    }

    // If extra is an object with structured tables
    if (typeof extra === 'object') {
        // Render free-form notes first
        if (extra.notes) {
            const p = document.createElement('p');
            p.className = 'text-gray-300';
            p.textContent = extra.notes;
            modalExtra.appendChild(p);
        }

        if (Array.isArray(extra.tables)) {
            extra.tables.forEach(tbl => {
                const tableEl = createTableElement(tbl);
                modalExtra.appendChild(tableEl);
            });
        }

        // Render any raw HTML if provided (trusted)
        if (extra.html) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = extra.html; // trusted
            modalExtra.appendChild(wrapper);
        }

        modalExtraSection.classList.remove('hidden');
        return;
    }
}

// Create a DOM table from a structured table object
function createTableElement(tbl) {
    const container = document.createElement('div');
    container.className = 'overflow-x-auto bg-slate-800/30 p-3 rounded-lg border border-purple-500/20';

    if (tbl.caption) {
        const cap = document.createElement('div');
        cap.className = 'text-sm text-purple-200 font-semibold mb-2';
        cap.textContent = tbl.caption;
        container.appendChild(cap);
    }

    const table = document.createElement('table');
    table.className = 'table-auto w-full text-sm text-left border-collapse';

    if (Array.isArray(tbl.headers) && tbl.headers.length > 0) {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        tbl.headers.forEach(h => {
            const th = document.createElement('th');
            th.className = 'px-3 py-2 text-purple-300 border-b border-slate-700';
            th.textContent = h;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
    }

    const tbody = document.createElement('tbody');
    if (Array.isArray(tbl.rows)) {
        tbl.rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.className = 'px-3 py-2 border-b border-slate-800 text-gray-300';
                // allow strings or numbers
                td.textContent = (cell === null || cell === undefined) ? '' : String(cell);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }
    table.appendChild(tbody);

    container.appendChild(table);
    return container;
}

// Create skill card
function createSkillCard(skill, index) {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card p-4 bg-slate-800/50 border border-purple-500/20 rounded-lg fade-in';
    skillCard.style.animationDelay = `${index * 0.05}s`;
    
    skillCard.innerHTML = `
        <div class="flex items-start justify-between mb-2">
            <h4 class="text-lg font-semibold text-purple-300 font-inter">${skill.nome}</h4>
            <span class="skill-level-badge px-3 py-1 rounded-full text-xs font-bold text-purple-200 font-inter ml-2 flex-shrink-0">
                SL ${skill.sl}
            </span>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed font-inter">${skill.descricao}</p>
    `;
    
    return skillCard;
}

// Close modal
function closeModal() {
    modalEl.classList.remove('show');
    setTimeout(() => {
        modalEl.classList.add('hidden');
        currentClass = null;
    }, 300);
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Show empty state
function showEmptyState() {
    loadingEl.classList.add('hidden');
    emptyStateEl.classList.remove('hidden');
}

// Event Listeners
closeModalBtn.addEventListener('click', closeModal);

modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) {
        closeModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadClasses();
});
