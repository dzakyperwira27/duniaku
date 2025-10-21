// Theme functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'dark';

    // Theme toggle event
    themeToggle.addEventListener('change', function () {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

async function loadCountries() {
    const response = await fetch('data/negara.json');
    const countries = await response.json();
    const container = document.getElementById('country-container');
    const searchInput = document.getElementById('search');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');

    // Initialize theme
    initializeTheme();

    // Add loading animation
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <div style="display: inline-block; width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 15px; color: var(--text-secondary);">Memuat data negara...</p>
        </div>
    `;

    // Add CSS for spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Delay untuk menunjukkan loading (opsional)
    await new Promise(resolve => setTimeout(resolve, 800));

    // render awal
    renderCountries(countries);

    // pencarian
    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.toLowerCase();
        const filtered = countries.filter(country =>
            country.nama.toLowerCase().includes(keyword)
        );
        renderCountries(filtered);
    });

    // tampilkan negara
    function renderCountries(data) {
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; color: #cbd5e0; margin-bottom: 15px;">🔍</div>
                    <h3 style="color: var(--text-secondary); margin-bottom: 10px;">Tidak ada hasil</h3>
                    <p style="color: #a0aec0;">Coba kata kunci pencarian lain</p>
                </div>
            `;
            return;
        }

        data.forEach((country, index) => {
            const card = document.createElement('div');
            card.className = 'country-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <img src="${country.bendera}" alt="${country.nama}" loading="lazy">
                <h3>${country.nama}</h3>
            `;
            card.addEventListener('click', () => showModal(country));
            container.appendChild(card);
        });
    }

    // modal detail
    function showModal(country) {
        document.getElementById('modal-flag').src = country.bendera;
        document.getElementById('modal-name').textContent = country.nama;
        document.getElementById('modal-continent').textContent = `Benua: ${country.benua}`;
        document.getElementById('modal-currency').textContent = `Mata Uang: ${country.mata_uang}`;
        document.getElementById('modal-language').textContent = `Bahasa: ${country.bahasa}`;
        document.getElementById('modal-area').textContent = `Luas: ${country.luas} km²`;
        modal.style.display = 'block';

        // Add animation to modal content
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.animation = 'none';
        setTimeout(() => {
            modalContent.style.animation = 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 10);
    }

    closeModal.onclick = () => {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.animation = '';
        }, 300);
    };

    window.onclick = event => {
        if (event.target == modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.animation = '';
            }, 300);
        }
    };

    // Add fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);
}

loadCountries();