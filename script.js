// ==================== CONFIGURAÇÃO PADRÃO ====================
const defaultConfig = {
    brand_name: "SUA LOGO AQUI!",
    hero_title: "Eternize momentos com brilho e sofisticação.",
    hero_subtitle: "Peças únicas criadas para celebrar histórias extraordinárias",
    hero_cta: "Conhecer a Coleção",
    collection_title: "Arte em cada detalhe",
    collection_subtitle: "Descubra peças cuidadosamente cuidadas para riquezas inesquecíveis",
    contact_title: "Deseja uma peça sob medida?",
    contact_subtitle: "Nossa equipe de consultores está pronta para criar algo verdadeiramente único",
    footer_text: "© 2024 Alta Joalheria. Todos os direitos reservados. | Por Luciano Ferreira - Impulso Digital"
};

// =================== DADOS DOS PRODUTOS ====================
const products = [
    {
        id: 1,
        category: "Anéis & Alianças",
        name: "Solitário Eternité",
        price: "R$ 12.800",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85"
    },
    {
        id: 2,
        category: "Colares",
        name: "Colar Celestial",
        price: "R$ 8.450",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=85"
    },
    {
        id: 3,
        category: "Brincos",
        name: "Brincos Cascade",
        price: "R$ 6.200",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=85"
    },
    {
        id: 4,
        category: "Relógios",
        name: "Chrono Nobre",
        price: "R$ 24.900",
        image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=85"
    },
    {
        id: 5,
        category: "Pulseiras",
        name: "Pulseira Lumière",
        price: "R$ 5.750",
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=85"
    },
    {
        id: 6,
        category: "Coleção Premium",
        name: "Édition Signature",
        price: "R$ 38.500",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=85"
    }
];

// ==================== ESTADO ====================
let cart = [];

// ==================== RENDERIZAR PRODUTOS ====================
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = products.map(product => `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.background='#f5f3ee'; this.alt='Imagem indisponível';">
                <div class="product-overlay"></div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price"><span>${product.price}</span></div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})" data-btn-id="${product.id}">
                    <i data-lucide="plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        </article>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

// ==================== FUNÇÕES DO CARRINHO ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    cart.push({
        ...product,
        cartId: Date.now() + Math.random()
    });
    updateCartUI();
    showToast(`${product.name} adicionado`);
    
    // Feedback do botão
    const btn = document.querySelector(`[data-btn-id="${productId}"]`);
    if (btn) {
        btn.classList.add('added');
        btn.innerHTML = '<i data-lucide="check"></i> Adicionado';
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i data-lucide="plus"></i> Adicionar ao Carrinho';
            if (window.lucide) lucide.createIcons();
        }, 1800);
    }
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const cartBody = document.getElementById('cart-body');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotal = document.getElementById('cart-total');

    // Atualiza o badge
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }

    // Atualizar conteúdo do carrinho
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartFooter.style.display = 'none';
        const existingItems = cartBody.querySelectorAll('.cart-item');
        existingItems.forEach(el => el.remove());
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        
        // Limpa e reconstrói os itens
        const existingItems = cartBody.querySelectorAll('.cart-item');
        existingItems.forEach(el => el.remove());
        
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
                <div class="cart-item-details">
                    <div>
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.cartId})">Remover</button>
                </div>
            `;
            cartBody.appendChild(itemEl);
        });

        // Calcular o total
        const total = cart.reduce((sum, item) => {
            const num = parseFloat(item.price.replace(/[^\d,]/g, '').replace(',', '.'));
            return sum + (isNaN(num) ? 0 : num);
        }, 0);
        cartTotal.textContent = 'R$ ' + total.toLocaleString('pt-BR', {
            minimumFractionDigits: 2
        });
    }
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
}

function checkoutCart() {
    if (cart.length === 0) return;
    showToast('Redirecionando para atendimento VIP...');
    setTimeout(() => {
        window.open('https://wa.me/?text=Olá!%20Gostaria%20de%20finalizar%20minha%20compra%20na%20joalheria.', '_blank', 'noopener,noreferrer');
    }, 800);
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = '✦ ' + message + ' ✦';
    toast.classList.add('show');
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==================== FORMATAR TÍTULO COM ÊNFASE ====================
function formatTitleWithEmphasis(text, palavraEnfatiza) {
    if (!text) return '';
    if (palavraEnfatiza && text.toLowerCase().includes(palavraEnfatiza.toLowerCase())) {
        const regex = new RegExp(`(${palavraEnfatiza})`, 'gi');
        return text.replace(regex, '<em>$1</em>');
    }
    // Enfatizar a última palavra
    const words = text.split(' ');
    if (words.length > 1) {
        const lastWord = words[words.length - 1].replace(/[.?!]/g, '');
        const punctuation = text.match(/[.?!]$/) ? text.slice(-1) : '';
        return text.replace(new RegExp(lastWord + '[.?!]?$'), `<em>${lastWord}</em>${punctuation}`);
    }
    return text;
}

// ==================== OUVINTES DE EVENTO ====================
document.addEventListener('DOMContentLoaded', () => {
    // Alternar carrinho
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Efeito de rolagem do cabeçalho
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const success = document.getElementById('form-success');
            
            // Validação básica
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) valid = false;
            });

            if (!valid) {
                showToast('Preencha todos os campos');
                return;
            }

            success.classList.add('show');
            form.reset();
            setTimeout(() => success.classList.remove('show'), 5000);
        });
    }

    // Renderizar produtos
    renderProducts();

    // Inicializar ícones
    if (window.lucide) lucide.createIcons();
});

// ==================== SDK ELEMENT ====================
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig: defaultConfig,
        onConfigChange: async (config) => {
            const brandName = config.brand_name || defaultConfig.brand_name;
            const heroTitle = config.hero_title || defaultConfig.hero_title;
            const heroSubtitle = config.hero_subtitle || defaultConfig.hero_subtitle;
            const heroCta = config.hero_cta || defaultConfig.hero_cta;
            const collectionTitle = config.collection_title || defaultConfig.collection_title;
            const collectionSubtitle = config.collection_subtitle || defaultConfig.collection_subtitle;
            const contactTitle = config.contact_title || defaultConfig.contact_title;
            const contactSubtitle = config.contact_subtitle || defaultConfig.contact_subtitle;
            const footerText = config.footer_text || defaultConfig.footer_text;

            // Atualizar nome da marca
            document.getElementById('brand-logo').textContent = brandName;
            document.getElementById('footer-logo').textContent = brandName;

            // Atualizar o título principal
            document.getElementById('hero-title').innerHTML = formatTitleWithEmphasis(heroTitle, 'brilho');
            document.getElementById('hero-subtitle').textContent = heroSubtitle;

            const ctaBtn = document.getElementById('hero-cta');
            if (ctaBtn) {
                ctaBtn.innerHTML = heroCta;
                const newIcon = document.createElement('i');
                newIcon.setAttribute('data-lucide', 'arrow-right');
                newIcon.style.cssText = 'width:14px;height:14px;stroke-width:1.5;';
                ctaBtn.appendChild(newIcon);
            }

            // Atualizar coleção
            document.getElementById('collection-title').innerHTML = formatTitleWithEmphasis(collectionTitle, 'detalhe');
            document.getElementById('collection-subtitle').textContent = collectionSubtitle;

            // Atualizar contato
            document.getElementById('contact-title').innerHTML = formatTitleWithEmphasis(contactTitle, 'sob medida');
            document.getElementById('contact-subtitle').textContent = contactSubtitle;

            // Atualizar rodapé
            document.getElementById('footer-copyright').textContent = footerText;

            // Reinicializa os ícones
            if (window.lucide) lucide.createIcons();
        },
        mapToCapabilities: (config) => ({
            recolorables: [],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ["brand_name", config.brand_name || defaultConfig.brand_name],
            ["hero_title", config.hero_title || defaultConfig.hero_title],
            ["hero_subtitle", config.hero_subtitle || defaultConfig.hero_subtitle],
            ["hero_cta", config.hero_cta || defaultConfig.hero_cta],
            ["collection_title", config.collection_title || defaultConfig.collection_title],
            ["collection_subtitle", config.collection_subtitle || defaultConfig.collection_subtitle],
            ["contact_title", config.contact_title || defaultConfig.contact_title],
            ["contact_subtitle", config.contact_subtitle || defaultConfig.contact_subtitle],
            ["footer_text", config.footer_text || defaultConfig.footer_text]
        ])
    });
}



// Cloudflare helper
(function() {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement('script');
            d.innerHTML = "window.__CF$cv$params={r:'9f416d76b2de19cb',t:'MTc3NzQ5ODQzMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d);
        }
    }
    if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
            var e = document.onreadystatechange || function() {};
            document.onreadystatechange = function(b) {
                e(b);
                'loading' !== document.readyState && (document.onreadystatechange = e, c());
            };
        }
    }
})();

