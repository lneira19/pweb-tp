export class CustomSelector {
    constructor(containerId, optionsData, config = {}) {
        this.containerId = containerId;
        this.optionsData = optionsData;
        this.currentSelection = null;
        this.isDropdownOpen = false;
        this.onSelectionChange = config.onSelectionChange || null;
        
        // Configuración personalizable
        this.config = {
            placeholder: config.placeholder || 'Haz click para ver las opciones',
            placeholderSelected: config.placeholderSelected || 'Haz click para cambiar la selección',
            label: config.label || 'Selecciona una opción:',
            width: config.width || '100%',
            ...config
        };

        // Referencias a elementos DOM
        this.container = null;
        this.selector = null;
        this.dropdown = null;
        this.dropdownArrow = null;

        this.init();
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`CustomSelector: No se encontró el contenedor con ID "${this.containerId}"`);
            return;
        }

        this.createHTML();
        this.createCSS();
        this.bindEvents();
        this.generateDropdownOptions();
    }

    createHTML() {
        const html = `
            <div class="custom-selector-group">
                <label for="${this.containerId}-selector" class="custom-selector-label">
                    ${this.config.label}
                </label>
                <div class="custom-select-wrapper">
                    <input 
                        type="text" 
                        id="${this.containerId}-selector" 
                        class="custom-selector-input"
                        placeholder="${this.config.placeholder}"
                        readonly
                        style="width: ${this.config.width}"
                    >
                    <span class="custom-dropdown-arrow">▼</span>
                    <div class="custom-options-dropdown">
                        <!-- Las opciones se generarán dinámicamente -->
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Obtener referencias a los elementos
        this.selector = this.container.querySelector('.custom-selector-input');
        this.dropdown = this.container.querySelector('.custom-options-dropdown');
        this.dropdownArrow = this.container.querySelector('.custom-dropdown-arrow');
    }

    createCSS() {
        // Verificar si los estilos ya fueron inyectados
        if (document.getElementById('custom-selector-styles')) {
            return;
        }

        const styles = `
            <style id="custom-selector-styles">
                .custom-selector-group {
                    margin-bottom: 20px;
                    position: relative;
                    font-family: Arial, sans-serif;
                }

                .custom-selector-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: #555;
                    font-size: 14px;
                }

                .custom-select-wrapper {
                    position: relative;
                    display: inline-block;
                    width: 100%;
                }

                .custom-selector-input {
                    padding: 12px 40px 12px 12px;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                    background-color: white;
                    cursor: pointer;
                    transition: border-color 0.3s ease;
                    box-sizing: border-box;
                    min-width: 200px;
                }

                .custom-selector-input:focus {
                    outline: none;
                    border-color: #4CAF50;
                }

                .custom-selector-input:hover {
                    border-color: #999;
                }

                .custom-dropdown-arrow {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    font-size: 12px;
                    color: #666;
                    transition: transform 0.3s ease;
                }

                .custom-dropdown-arrow.open {
                    transform: translateY(-50%) rotate(180deg);
                }

                .custom-options-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 2px solid #ddd;
                    border-top: none;
                    border-radius: 0 0 5px 5px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 1000;
                    display: none;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .custom-options-dropdown.show {
                    display: block;
                    animation: customSlideDown 0.2s ease;
                }

                @keyframes customSlideDown {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .custom-option-item {
                    padding: 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                    transition: background-color 0.2s ease;
                }

                .custom-option-item:last-child {
                    border-bottom: none;
                }

                .custom-option-item:hover {
                    background-color: #f5f5f5;
                }

                .custom-option-item.selected {
                    background-color: #e8f5e8;
                    color: #4CAF50;
                    font-weight: bold;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        this.selector.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.isDropdownOpen) {
                this.closeDropdown();
            } else {
                this.openDropdown();
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.selector.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        this.selector.addEventListener('keydown', (e) => {
            const allowedKeys = ['Tab', 'ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
            
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault();
                this.openDropdown();
            } else if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });

        this.selector.addEventListener('blur', () => {
            setTimeout(() => {
                if (!this.dropdown.matches(':hover')) {
                    this.closeDropdown();
                }
            }, 150);
        });
    }

    generateDropdownOptions() {
        this.dropdown.innerHTML = '';
        
        this.optionsData.forEach(option => {
            if (option.value !== this.currentSelection) {
                const optionElement = document.createElement('div');
                optionElement.className = 'custom-option-item';
                optionElement.textContent = option.text;
                optionElement.dataset.value = option.value;
                
                optionElement.addEventListener('click', () => {
                    this.selectOption(option.value);
                });
                
                this.dropdown.appendChild(optionElement);
            }
        });
    }

    selectOption(value) {
        const selectedOption = this.optionsData.find(option => option.value === value);
        if (selectedOption) {
            this.currentSelection = value;
            this.selector.value = selectedOption.text;
            this.selector.placeholder = this.config.placeholderSelected;
            
            this.closeDropdown();
            this.generateDropdownOptions();

            if (this.onSelectionChange && typeof this.onSelectionChange === 'function') {
                this.onSelectionChange(selectedOption);
            }
        }
    }

    openDropdown() {
        if (!this.isDropdownOpen) {
            this.generateDropdownOptions();
            this.dropdown.classList.add('show');
            this.dropdownArrow.classList.add('open');
            this.selector.style.borderRadius = '5px 5px 0 0';
            this.isDropdownOpen = true;
        }
    }

    closeDropdown() {
        this.dropdown.classList.remove('show');
        this.dropdownArrow.classList.remove('open');
        this.selector.style.borderRadius = '5px';
        this.isDropdownOpen = false;
    }

    getCurrentSelection() {
        if (this.currentSelection) {
            return this.optionsData.find(option => option.value === this.currentSelection);
        }
        return null;
    }

    setSelection(value) {
        const option = this.optionsData.find(opt => opt.value === value);
        if (option) {
            this.selectOption(value);
        }
    }

    clearSelection() {
        this.currentSelection = null;
        this.selector.value = '';
        this.selector.placeholder = this.config.placeholder;
        this.generateDropdownOptions();
        
        if (this.onSelectionChange && typeof this.onSelectionChange === 'function') {
            this.onSelectionChange(null);
        }
    }

    updateOptions(newOptionsData) {
        this.optionsData = newOptionsData;
        this.clearSelection();
        this.generateDropdownOptions();
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Hacer disponible globalmente
window.CustomSelector = CustomSelector;