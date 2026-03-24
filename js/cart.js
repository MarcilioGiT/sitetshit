// Panda T-ShiT - Funcionalidade do Carrinho

// Configurações
const WHATSAPP_NUMBER = '5585985544951'; // Altere para o número do WhatsApp da loja
const FRETE_ORIGEM = 'Fortaleza/CE';

document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartBadge = document.querySelector('.cart-badge');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const cepInput = document.getElementById('cep');
    const calcularFreteBtn = document.getElementById('calcular-frete');
    const freteValor = document.getElementById('frete-valor');

    let freteCalculado = 0;

    // Carregar carrinho
    function carregarCarrinho() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            if (cartItems) {
                cartItems.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #666;">
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">Seu carrinho está vazio</p>
                        <a href="index.html" style="color: #bfa77a; text-decoration: none; font-weight: 600;">
                            Continuar comprando →
                        </a>
                    </div>
                `;
            }
            atualizarTotal(0);
            return;
        }

        if (cartItems) {
            cartItems.innerHTML = '';
            cart.forEach((item, index) => {
                const cartItem = criarItemCarrinho(item, index);
                cartItems.appendChild(cartItem);
            });
        }

        calcularTotal();
        atualizarCartBadge();
    }

    // Criar elemento do item do carrinho
    function criarItemCarrinho(item, index) {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <div class="cart-item-info">
                <h4>${item.nome}</h4>
                <div class="cart-item-price">R$${item.preco.toFixed(2).replace('.', ',')}</div>
                <div class="cart-item-qtd">
                    <button onclick="alterarQuantidade(${index}, -1)">-</button>
                    <input type="number" min="1" value="${item.quantidade}" onchange="alterarQuantidadeInput(${index}, this.value)">
                    <button onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
                <div style="margin-top: 0.5rem;">
                    <strong>Subtotal: R$${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong>
                </div>
            </div>
            <button class="remover-item" onclick="removerItem(${index})">Remover</button>
        `;
        return div;
    }

    // Alterar quantidade
    window.alterarQuantidade = function(index, delta) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index]) {
            cart[index].quantidade += delta;
            if (cart[index].quantidade <= 0) {
                cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            carregarCarrinho();
        }
    };

    // Alterar quantidade via input
    window.alterarQuantidadeInput = function(index, novaQuantidade) {
        const quantidade = parseInt(novaQuantidade);
        if (quantidade > 0) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart[index]) {
                cart[index].quantidade = quantidade;
                localStorage.setItem('cart', JSON.stringify(cart));
                carregarCarrinho();
            }
        }
    };

    // Remover item
    window.removerItem = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        carregarCarrinho();
    };

    // Calcular total
    function calcularTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const totalComFrete = subtotal + freteCalculado;
        atualizarTotal(totalComFrete, subtotal);
    }

    // Atualizar total na tela
    function atualizarTotal(total, subtotal = null) {
        if (cartTotal) {
            let html = '';
            if (subtotal !== null && freteCalculado > 0) {
                html = `
                    <div style="margin-bottom: 0.5rem;">Subtotal: R$${subtotal.toFixed(2).replace('.', ',')}</div>
                    <div style="margin-bottom: 0.5rem;">Frete: R$${freteCalculado.toFixed(2).replace('.', ',')}</div>
                    <div style="font-size: 1.6rem; border-top: 1px solid #ddd; padding-top: 0.5rem;">
                        Total: R$${total.toFixed(2).replace('.', ',')}
                    </div>
                `;
            } else {
                html = `Total: R$${total.toFixed(2).replace('.', ',')}`;
            }
            cartTotal.innerHTML = html;
        }
    }

    // Atualizar badge do carrinho
    function atualizarCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantidade, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    // Máscara para CEP
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Calcular frete (simulação)
    if (calcularFreteBtn) {
        calcularFreteBtn.addEventListener('click', function() {
            const cep = cepInput.value.replace(/\D/g, '');

            if (cep.length !== 8) {
                freteValor.textContent = 'CEP inválido';
                freteValor.style.color = '#d32f2f';
                return;
            }

            // Simulação de cálculo de frete
            // Em uma implementação real, você integraria com APIs dos Correios ou transportadoras
            const freteSimulado = calcularFreteSimulado(cep);
            freteCalculado = freteSimulado;

            freteValor.innerHTML = `
                <div style="margin-top: 0.5rem; color: #388e3c;">
                    <strong>Frete calculado: R$${freteSimulado.toFixed(2).replace('.', ',')}</strong>
                    <br><small>Prazo: 5-10 dias úteis</small>
                </div>
            `;

            calcularTotal();
        });
    }

    // Calcular frete simulado (valores fictícios)
    function calcularFreteSimulado(cep) {
        // Lógica simplificada baseada na região do CEP
        const primeirosDigitos = parseInt(cep.substring(0, 2));

        // Ceará (60000-63999) - frete local
        if (primeirosDigitos >= 60 && primeirosDigitos <= 63) {
            return 15.00;
        }
        // Nordeste
        else if (primeirosDigitos >= 40 && primeirosDigitos <= 65) {
            return 25.00;
        }
        // Sudeste
        else if (primeirosDigitos >= 1 && primeirosDigitos <= 39) {
            return 35.00;
        }
        // Sul
        else if (primeirosDigitos >= 80 && primeirosDigitos <= 99) {
            return 40.00;
        }
        // Centro-oeste e Norte
        else {
            return 45.00;
        }
    }

    // Finalizar compra no WhatsApp
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            const mensagem = criarMensagemWhatsApp(cart);
            const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
            window.open(urlWhatsApp, '_blank');
        });
    }

    // Criar mensagem para WhatsApp
    function criarMensagemWhatsApp(cart) {
        let mensagem = '🌿 *Pedido Panda T-ShoT* 🌿\n\n';

        let subtotal = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.preco * item.quantidade;
            subtotal += itemTotal;
            mensagem += `${index + 1}. *${item.nome}*\n`;
            mensagem += `   Quantidade: ${item.quantidade}\n`;
            mensagem += `   Preço unit.: R$${item.preco.toFixed(2).replace('.', ',')}\n`;
            mensagem += `   Subtotal: R$${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
        });

        mensagem += `💰 *Subtotal: R$${subtotal.toFixed(2).replace('.', ',')}*\n`;

        if (freteCalculado > 0) {
            const total = subtotal + freteCalculado;
            mensagem += `🚚 *Frete: R$${freteCalculado.toFixed(2).replace('.', ',')}*\n`;
            mensagem += `🎯 *TOTAL: R$${total.toFixed(2).replace('.', ',')}*\n\n`;
        } else {
            mensagem += '\n';
        }

        mensagem += '📍 *Origem do frete:* ' + FRETE_ORIGEM + '\n\n';
        mensagem += 'Gostaria de finalizar este pedido! 😊';

        return mensagem;
    }

    // Inicializar carrinho
    carregarCarrinho();
    atualizarCartBadge();
});
