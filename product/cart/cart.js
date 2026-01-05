const BASE_SHIPPING_FEES = { 
    'home-delivery': 59,
    'convenience-store': 39
};
const FREE_SHIPPING_THRESHOLD = 499;

const PAYMENT_DETAILS_MAP = {
    'bank-transfer': '🏦 **銀行/ATM 轉帳:** 訂單送出後，將提供轉帳帳號，請於 6 小時內 完成轉帳。',
    'cash-on-delivery': '💰 **貨到/超商取貨付款:** 選擇宅配則收貨時付現，選擇超商則取貨時付現。',
    'default': '請選擇付款方式以查看詳細說明。'
};

function setupOrderNote() {
    const toggleButton = document.getElementById('toggle-note-btn');
    const noteSection = document.getElementById('note-section');
    const noteTextarea = document.getElementById('order-note');

    const savedNote = localStorage.getItem('orderNote') || '';
    noteTextarea.value = savedNote;

    if (savedNote.trim().length > 0) {
        noteSection.style.display = 'block';
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const isHidden = noteSection.style.display === 'none';
            noteSection.style.display = isHidden ? 'block' : 'none';
            if (isHidden && noteTextarea.value.trim() === '') {
                 noteTextarea.focus();
            }
        });
    }

    noteTextarea.addEventListener('input', () => {
        localStorage.setItem('orderNote', noteTextarea.value.trim());
    });
}

function setupPaymentMethod(selectedShipping) {
    const paymentSelect = document.getElementById('payment-method');
    const paymentDetails = document.getElementById('payment-details');

    let selectedPayment = localStorage.getItem('paymentMethod') || 'bank-transfer';
    
    if (paymentSelect) {
        paymentSelect.value = selectedPayment;
        paymentSelect.disabled = false;
    }

    function updatePaymentDisplay(method) {
        const detailText = PAYMENT_DETAILS_MAP[method] || PAYMENT_DETAILS_MAP['default'];
        if (paymentDetails) {
            paymentDetails.innerHTML = detailText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            localStorage.setItem('paymentMethod', method);
        }
    }

    if (paymentSelect) {
        paymentSelect.addEventListener('change', (e) => {
            const newMethod = e.target.value;
            selectedPayment = newMethod;
            updatePaymentDisplay(newMethod);
        });
    }

    updatePaymentDisplay(paymentSelect ? paymentSelect.value : selectedPayment);
}

function toggleRecipientDetails(method) {
    const addressGroup = document.getElementById('address-group');
    const storeInfo = document.getElementById('store-pickup-info');
    const addressInput = document.getElementById('recipient-address');

    if (!addressInput) return;

    if (method === 'home-delivery') {
        addressGroup.style.display = 'flex'; 
        storeInfo.style.display = 'none';
        addressInput.setAttribute('required', 'required');
    } else if (method === 'convenience-store') {
        addressGroup.style.display = 'none'; 
        storeInfo.style.display = 'block';
        addressInput.removeAttribute('required');
    }
}

function calculateTotal(cart, shippingMethod) {
    let subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let shippingFee = 0;
    
    const baseFee = BASE_SHIPPING_FEES[shippingMethod] || 0;
    shippingFee = subtotal < FREE_SHIPPING_THRESHOLD ? baseFee : 0;
    
    const total = subtotal + shippingFee;

    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        let shippingInfo = shippingFee === 0 ? "免運費" : `運費 $${shippingFee}`;
        cartTotalElement.innerHTML = `
            小計金額：$${subtotal}
            <br>
            ${shippingInfo}
            <hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">
            <strong>總金額：$${total}</strong>
        `;
    }
}

function updateShippingFeeDisplay(cart, method) {
    const shippingFeeDisplay = document.getElementById('shipping-fee-display');
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (shippingFeeDisplay) {
        const baseFee = BASE_SHIPPING_FEES[method] || 0;
        const fee = subtotal < FREE_SHIPPING_THRESHOLD ? baseFee : 0;
        shippingFeeDisplay.textContent = fee === 0 ? "🎉 本單享免運費" : `運費：$${fee}`;
    }
}

function renderCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    const isMobile = window.innerWidth <= 768;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        const row = document.createElement('tr');

        if (isMobile) {
            row.style.display = 'block';
            row.style.marginBottom = '15px';
            row.innerHTML = `
                <td style="display:block"><strong>商品名稱:</strong> ${item.name}</td>
                <td style="display:block"><strong>單價:</strong> $${item.price}</td>
                <td style="display:block"><strong>數量:</strong>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="current-quantity" onchange="updateQuantity(${index}, this.value - ${item.quantity})" style="width: 50px; text-align: center;" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </td>
                <td style="display:block"><strong>小計:</strong> $${subtotal}</td>
                <td style="display:block"><strong>操作:</strong> <button class="remove-item-btn" onclick="removeItem(${index})">刪除</button></td>
            `;
        } else {
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="current-quantity" onchange="updateQuantity(${index}, this.value - ${item.quantity})" style="width: 50px; text-align: center;" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </td>
                <td>$${subtotal}</td>
                <td><button class="remove-item-btn" onclick="removeItem(${index})">刪除</button></td>
            `;
        }

        cartItemsContainer.appendChild(row);
    });
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        const currentQuantity = cart[index].quantity;
        let newQuantity = typeof change === 'number' ? currentQuantity + change : parseInt(change, 10);

        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems(cart);
            calculateTotal(cart, localStorage.getItem('shippingMethod') || 'home-delivery');
            updateShippingFeeDisplay(cart, localStorage.getItem('shippingMethod') || 'home-delivery');
        } else if (newQuantity === 0) {
            removeItem(index);
        }
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems(cart);
    calculateTotal(cart, localStorage.getItem('shippingMethod') || 'home-delivery');
    updateShippingFeeDisplay(cart, localStorage.getItem('shippingMethod') || 'home-delivery');
}

document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCartItems(cart);

    const shippingMethodSelect = document.getElementById('shipping-method');
    let selectedShipping = localStorage.getItem('shippingMethod') || 'home-delivery';
    if (shippingMethodSelect) shippingMethodSelect.value = selectedShipping;

    setupOrderNote();
    setupPaymentMethod(selectedShipping);
    toggleRecipientDetails(selectedShipping);
    calculateTotal(cart, selectedShipping);
    updateShippingFeeDisplay(cart, selectedShipping);

    if (shippingMethodSelect) {
        shippingMethodSelect.addEventListener('change', (e) => {
            const newMethod = e.target.value;
            localStorage.setItem('shippingMethod', newMethod);
            toggleRecipientDetails(newMethod);
            setupPaymentMethod(newMethod);
            calculateTotal(cart, newMethod);
            updateShippingFeeDisplay(cart, newMethod);
        });
    }

    window.addEventListener('resize', () => renderCartItems(cart));

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                const currentUrl = window.location.pathname;
                window.location.href = "../login/login.html?returnUrl=" + encodeURIComponent(currentUrl);
                return;
            }

            if (cart.length === 0) {
                alert('您的購物車是空的，快去挑選商品吧～');
                window.location.href = '../../index.html';
                return;
            }

            const selectedPayment = localStorage.getItem('paymentMethod');
            if (!selectedPayment || selectedPayment === 'default') {
                alert('請先選擇您的付款方式！');
                document.getElementById('payment-method').focus();
                return;
            }

            const name = document.getElementById('recipient-name').value.trim();
            const phone = document.getElementById('recipient-phone').value.trim();
            if (!name || !phone) {
                alert('請填寫完整的收件人姓名和連絡電話！');
                document.getElementById('recipient-name').focus();
                return;
            }

            if (localStorage.getItem('shippingMethod') === 'home-delivery') {
                const address = document.getElementById('recipient-address').value.trim();
                if (!address) {
                    alert('您選擇了宅配，請填寫完整的收件地址！');
                    document.getElementById('recipient-address').focus();
                    return;
                }
            }
           
            const userConfirmed = confirm('確認送出訂單嗎？'); 

            if (userConfirmed) { 
                localStorage.removeItem('cart');
                localStorage.removeItem('orderNote');
                localStorage.removeItem('shippingMethod');
                localStorage.removeItem('paymentMethod');

                alert('訂單已送出，感謝您的購買！');
                window.location.href = '../../index.html';
             }
         });
    }
});