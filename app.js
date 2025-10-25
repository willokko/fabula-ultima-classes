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
    
    // Show modal with animation
    modalEl.classList.remove('hidden');
    setTimeout(() => {
        modalEl.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
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
