// Panda T-ShiT - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do modal
    const modalBg = document.getElementById('modal-bg');
    const modalProduto = document.getElementById('modal-produto');
    const fecharModal = document.getElementById('fechar-modal');
    const modalImg = document.getElementById('modal-img');
    const modalNome = document.getElementById('modal-nome');
    const modalPreco = document.getElementById('modal-preco');
    const modalQtd = document.getElementById('modal-qtd');
    const modalMenor = document.getElementById('modal-menor');
    const modalMaior = document.getElementById('modal-maior');
    const modalAdicionar = document.getElementById('modal-adicionar');
    const modalFeedback = document.getElementById('modal-feedback');

    // Elementos do carrinho
    const cartBadge = document.querySelector('.cart-badge');

    // Dados do produto atual no modal
    let produtoAtual = {};

    // Atualizar badge do carrinho
    function atualizarCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantidade, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    // Inicializar badge do carrinho
    atualizarCartBadge();

    // Abrir modal ao clicar em "Opções"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-opcoes')) {
            const card = e.target.closest('.produto-card');
            if (card) {
                produtoAtual = {
                    nome: card.dataset.nome,
                    img: card.dataset.img,
                    preco: parseFloat(card.dataset.preco)
                };

                // Preencher modal
                modalImg.src = produtoAtual.img;
                modalImg.alt = produtoAtual.nome;
                modalNome.textContent = produtoAtual.nome;
                modalPreco.textContent = `R$${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
                modalQtd.value = 1;
                modalFeedback.textContent = '';

                // Mostrar modal
                modalBg.classList.add('ativo');
            }
        }
    });

    // Fechar modal
    function fecharModalFunc() {
        modalBg.classList.remove('ativo');
        modalFeedback.textContent = '';
    }

    if (fecharModal) {
        fecharModal.addEventListener('click', fecharModalFunc);
    }

    // Fechar modal clicando no fundo
    if (modalBg) {
        modalBg.addEventListener('click', function(e) {
            if (e.target === modalBg) {
                fecharModalFunc();
            }
        });
    }

    // Controles de quantidade
    if (modalMenor) {
        modalMenor.addEventListener('click', function() {
            const atual = parseInt(modalQtd.value);
            if (atual > 1) {
                modalQtd.value = atual - 1;
            }
        });
    }

    if (modalMaior) {
        modalMaior.addEventListener('click', function() {
            const atual = parseInt(modalQtd.value);
            modalQtd.value = atual + 1;
        });
    }

    // Validar quantidade digitada
    if (modalQtd) {
        modalQtd.addEventListener('input', function() {
            const valor = parseInt(this.value);
            if (isNaN(valor) || valor < 1) {
                this.value = 1;
            }
        });
    }

    // Adicionar ao carrinho
    if (modalAdicionar) {
        modalAdicionar.addEventListener('click', function() {
            const quantidade = parseInt(modalQtd.value);

            // Recuperar carrinho atual
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Verificar se produto já existe no carrinho
            const existeIndex = cart.findIndex(item => item.nome === produtoAtual.nome);

            if (existeIndex !== -1) {
                // Produto já existe, atualizar quantidade
                cart[existeIndex].quantidade += quantidade;
            } else {
                // Novo produto
                cart.push({
                    nome: produtoAtual.nome,
                    img: produtoAtual.img,
                    preco: produtoAtual.preco,
                    quantidade: quantidade
                });
            }

            // Salvar carrinho
            localStorage.setItem('cart', JSON.stringify(cart));

            // Atualizar badge
            atualizarCartBadge();

            // Feedback
            modalFeedback.textContent = `${quantidade} item(s) adicionado(s) ao carrinho!`;
            modalFeedback.style.color = '#388e3c';

            // Fechar modal após 1.5 segundos
            setTimeout(fecharModalFunc, 1500);
        });
    }

    // Dropdown "Mais" para mobile
    const maisBtn = document.querySelector('.mais-btn');
    const maisMenu = document.querySelector('.mais-menu');

    if (maisBtn && maisMenu) {
        maisBtn.addEventListener('click', function(e) {
            e.preventDefault();
            maisMenu.style.display = maisMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.mais-dropdown')) {
                maisMenu.style.display = 'none';
            }
        });
    }

    // Smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lazy loading para imagens
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
