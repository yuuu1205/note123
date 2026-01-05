const simulatedOrders = [
    { id: '20240101-001', date: '2024-01-01', amount: 194, status: 'completed', statusText: '已完成', items: ['速乾水性筆 (x2)', '自動鉛筆 (x1)', '超商取貨-運費：39'] },
    { id: '20241007-002', date: '2024-10-07', amount: 457, status: 'processing', statusText: '已完成', items: ['LED檯燈 (x1)', '質感筆筒 (x1)', '超商取貨-運費：39'] },
    { id: '20241231-003', date: '2024-12-21', amount: 379, status: 'cancelled', statusText: '已完成', items: ['筆記本 (x5)', '超商取貨-運費：39'] },
    { id: '20250102-004', date: '2025-01-01', amount: 188, status: 'completed', statusText: '配送中', items: ['多肉植物 (x1)', '宅配-運費：59'] }
];

function renderOrderHistory() {
    const ordersListContainer = document.getElementById('orders-list');

    if (simulatedOrders.length === 0) {
        ordersListContainer.innerHTML = '<p>您目前沒有任何歷史訂單紀錄。</p>';
        return;
    }

    let tableHTML = `
        <table class="order-table">
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>日期</th>
                    <th>總金額</th>
                    <th>狀態</th>
                    <th>訂單明細</th>
                </tr>
            </thead>
            <tbody>
    `;

    simulatedOrders.forEach(order => {

        const formattedAmount = `$${order.amount.toLocaleString()}`; 
        const statusClass = `status-${order.status}`;
        const itemDetailsForData = order.items.join('|');
        
        tableHTML += `
            <tr>
                <td>#${order.id}</td>
                <td>${order.date}</td>
                <td>${formattedAmount}</td>
                <td class="order-status ${statusClass}">${order.statusText}</td>
                <td class="order-detail-link" data-items="${itemDetailsForData}">查看明細</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    ordersListContainer.innerHTML = tableHTML;
    
    setupOrderDetailsModalListeners(); 
}

function setupOrderDetailsModalListeners() {
    const modal = document.getElementById('orderDetailsModal');
    const closeButton = modal.querySelector('.close-button');
    const orderItemsContainer = document.getElementById('modal-order-items');
    const detailLinks = document.querySelectorAll('.order-detail-link');

    detailLinks.forEach(link => {
        link.addEventListener('click', function() {
            const itemsString = this.getAttribute('data-items');
            const itemsArray = itemsString.split('|'); 

            let itemsHTML = '<ul>';
            itemsArray.forEach(item => {
                itemsHTML += `<li>${item}</li>`;
            });
            itemsHTML += '</ul>';

            orderItemsContainer.innerHTML = itemsHTML;
            modal.style.display = 'block'; 
        });
    });

    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const userToken = localStorage.getItem('userToken');

    if (!userToken) {
        alert('您尚未登入，請先登入！');
        window.location.href = 'login.html'; 
        return; 
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const logoutButton = document.getElementById('logout-button');
    const memberInfoForm = document.getElementById('memberInfoForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const infoStatusMessage = document.getElementById('info-status-message');
    const passwordStatusMessage = document.getElementById('password-status-message');

    function loadMemberInfo() {
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const defaultAddress = '桃園市中壢區中北路200號'; 
        document.getElementById('username').value = userName || '用戶';
        document.getElementById('email').value = userEmail || '未提供';

        const addressInput = document.getElementById('address');
        if (addressInput) {
            addressInput.value = localStorage.getItem('userAddress') || defaultAddress;
        }
    }
    loadMemberInfo();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSectionId = link.getAttribute('data-section') + '-section';

            navLinks.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            link.classList.add('active');
            const targetSection = document.getElementById(targetSectionId);
            targetSection.classList.add('active');

            if (link.getAttribute('data-section') === 'orders') {
                renderOrderHistory();
            }
        });
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        const confirmLogout = confirm('確定要登出帳號嗎？');
        if (confirmLogout) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userAddress');
            alert('您已成功登出。');
            window.location.href = '../../index.html'; 
        }
    });

    memberInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const newAddress = document.getElementById('address').value.trim(); 

        const currentUserName = localStorage.getItem('userName');
        const currentAddress = localStorage.getItem('userAddress') || '桃園市中壢區中北路200號';
        
        let isDataChanged = false;

        if (newUsername !== currentUserName) {
            localStorage.setItem('userName', newUsername);
            isDataChanged = true;
        }
        if (newAddress !== currentAddress) {
            localStorage.setItem('userAddress', newAddress);
            isDataChanged = true;
        }
        
        if (phone !== '0912-345678') { 
            if (!isDataChanged) { 
                isDataChanged = true; 
            }
        }

        if (isDataChanged) {
            infoStatusMessage.textContent = '會員資訊更新成功！';
        } else {
            infoStatusMessage.textContent = '您的資料已經是最新的。';
        }
        
        infoStatusMessage.style.display = 'block';
        setTimeout(() => { infoStatusMessage.style.display = 'none'; }, 3000);
    });

    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        passwordStatusMessage.style.color = 'red';
        passwordStatusMessage.style.display = 'block';

        if (newPassword !== confirmNewPassword) {
            passwordStatusMessage.textContent = '新密碼與確認密碼不一致，請重新輸入。';
        } 
        else if (newPassword.length < 6) {
            passwordStatusMessage.textContent = '新密碼長度至少為 6 個字元。';
        }
        else {
            passwordStatusMessage.style.color = 'green';
            passwordStatusMessage.textContent = '密碼修改成功！下次登入請使用新密碼。';
            changePasswordForm.reset(); 
        }

        setTimeout(() => { passwordStatusMessage.style.display = 'none'; }, 4000);
    });

});