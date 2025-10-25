// Global state
let skills = [];
let skillIdCounter = 0;

// DOM Elements
const form = document.getElementById('class-form');
const skillsContainer = document.getElementById('skills-container');
const addSkillBtn = document.getElementById('add-skill');
const jsonOutput = document.getElementById('json-output');
const copyJsonBtn = document.getElementById('copy-json');
const resetFormBtn = document.getElementById('reset-form');
const toast = document.getElementById('toast');

// Form inputs
const nomeInput = document.getElementById('nome');
const iconInput = document.getElementById('icon');
const imagemInput = document.getElementById('imagem');
const livroInput = document.getElementById('livro');
const resumoInput = document.getElementById('resumo');
const beneficioInput = document.getElementById('beneficio_gratis');

// Add skill to the form
function addSkill() {
    const skillId = skillIdCounter++;
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill-item p-4 bg-slate-900/50 border border-purple-500/20 rounded-lg space-y-3';
    skillDiv.dataset.skillId = skillId;
    
    skillDiv.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <h4 class="text-purple-300 font-semibold font-inter">Habilidade #${skillId + 1}</h4>
            <button type="button" class="remove-skill text-red-400 hover:text-red-300 transition-colors" data-skill-id="${skillId}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div>
            <label class="block text-purple-200 text-sm mb-1 font-inter">Nome da Habilidade *</label>
            <input type="text" class="skill-nome w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500 font-inter" 
                placeholder="Ex: ARCANE CIRCLE" required>
        </div>
        <div>
            <label class="block text-purple-200 text-sm mb-1 font-inter">Skill Level (SL) *</label>
            <input type="number" class="skill-sl w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500 font-inter" 
                placeholder="Ex: 0" min="0" required>
        </div>
        <div>
            <label class="block text-purple-200 text-sm mb-1 font-inter">Descrição *</label>
            <textarea class="skill-descricao w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500 font-inter resize-none" 
                rows="3" placeholder="Descrição da habilidade..." required></textarea>
        </div>
    `;
    
    skillsContainer.appendChild(skillDiv);
    
    // Add remove event listener
    const removeBtn = skillDiv.querySelector('.remove-skill');
    removeBtn.addEventListener('click', () => removeSkill(skillId));
    
    // Update JSON preview on input
    const inputs = skillDiv.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateJsonPreview);
    });
}

// Remove skill from the form
function removeSkill(skillId) {
    const skillDiv = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (skillDiv) {
        skillDiv.remove();
        updateJsonPreview();
    }
}

// Collect skills data from form
function collectSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    const skillsData = [];
    
    skillItems.forEach(item => {
        const nome = item.querySelector('.skill-nome').value.trim();
        const sl = parseInt(item.querySelector('.skill-sl').value) || 0;
        const descricao = item.querySelector('.skill-descricao').value.trim();
        
        if (nome && descricao) {
            skillsData.push({
                nome: nome,
                sl: sl,
                descricao: descricao
            });
        }
    });
    
    return skillsData;
}

// Generate class JSON
function generateClassJson() {
    const classData = {
        nome: nomeInput.value.trim(),
        icon: iconInput.value.trim(),
        imagem: imagemInput.value.trim(),
        livro: livroInput.value.trim(),
        resumo: resumoInput.value.trim(),
        beneficio_gratis: beneficioInput.value.trim(),
        skills: collectSkills()
    };
    
    return classData;
}

// Update JSON preview
function updateJsonPreview() {
    const classData = generateClassJson();
    jsonOutput.textContent = JSON.stringify(classData, null, 4);
}

// Copy JSON to clipboard
async function copyJson() {
    const jsonText = jsonOutput.textContent;
    
    try {
        await navigator.clipboard.writeText(jsonText);
        showToast();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jsonText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            alert('Erro ao copiar. Por favor, copie manualmente.');
        }
        
        document.body.removeChild(textArea);
    }
}

// Show success toast
function showToast() {
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
        toast.style.transform = 'translateY(8rem)';
    }, 3000);
}

// Reset form
function resetForm() {
    form.reset();
    skillsContainer.innerHTML = '';
    skillIdCounter = 0;
    updateJsonPreview();
}

// Form submit handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate that at least one skill is added
    const skillsData = collectSkills();
    if (skillsData.length === 0) {
        alert('Por favor, adicione pelo menos uma habilidade!');
        return;
    }
    
    updateJsonPreview();
    
    // Scroll to JSON preview on mobile
    if (window.innerWidth < 1024) {
        jsonOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show success message
    showToast();
});

// Event listeners
addSkillBtn.addEventListener('click', addSkill);
copyJsonBtn.addEventListener('click', copyJson);
resetFormBtn.addEventListener('click', resetForm);

// Update JSON preview on input changes
[nomeInput, iconInput, imagemInput, livroInput, resumoInput, beneficioInput].forEach(input => {
    input.addEventListener('input', updateJsonPreview);
});

// Initialize with one skill
document.addEventListener('DOMContentLoaded', () => {
    addSkill();
    updateJsonPreview();
});
