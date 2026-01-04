function simulateBackendAuth(email, password) {
    return new Promise(resolve => {
        setTimeout(() => {
            const simulatedUser = {
                name: '測試用戶', 
                email: email
            };

            resolve({ 
                success: true, 
                token: 'fake-test-token-' + Date.now(), 
                message: '登入成功',
                user: simulatedUser 
            });
        }, 500); 
    });
}

function authenticateUser(data, formElement) {
    const errorMessage = document.getElementById('error-message');

    simulateBackendAuth(data.email, data.password)
    .then(result => {
        if (result.success) {
            alert('登入成功！歡迎回來。');
            formElement.reset(); 
            
            localStorage.setItem('userToken', result.token); 
            localStorage.setItem('userName', result.user.name); 
            localStorage.setItem('userEmail', result.user.email); 

            setTimeout(() => {
                window.location.href = '../../index.html'; 
            }, 100); 
        } else {
            errorMessage.textContent = result.message || '登入失敗，請檢查帳號和密碼。';
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('登入處理錯誤:', error);
        errorMessage.textContent = '連線伺服器或處理請求失敗，請稍後再試。';
        errorMessage.style.display = 'block';
    });
}

function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    alert('您已成功登出。');
    window.location.reload(); 
}

function hideAllSections() {
    document.getElementById('status-display').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('change-password-section').style.display = 'none';
    document.getElementById('order-history-section').style.display = 'none';
}

function showStatusDisplay() {
    hideAllSections();
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    const welcomeMessage = document.getElementById('welcome-message');
    const userInfoDisplay = document.getElementById('user-info-display');
    const logoutButton = document.getElementById('logout-button');

    document.getElementById('status-display').style.display = 'block';

    welcomeMessage.textContent = `嗨，用戶！歡迎回來。`;
    userInfoDisplay.innerHTML = `
        您的登入資訊：<br>
        電子郵件: <strong>${email}</strong>
    `;

    logoutButton.onclick = handleLogout;
}

function showChangePassword() {
    hideAllSections();
    document.getElementById('change-password-section').style.display = 'block';
    document.getElementById('changePasswordForm').reset();
    document.getElementById('password-error-message').style.display = 'none';
}

function populateOrderHistory() {
    const orderListDiv = document.getElementById('order-list');
    const message = document.getElementById('order-history-message');
    const mockOrders = [
        { id: '20240101-001', date: '2024/01/01', total: 1280, status: '已完成' },
        { id: '20240115-002', date: '2024/01/15', total: 2990, status: '運送中' },
        { id: '20240203-003', date: '2024/02/03', total: 550, status: '待付款' }
    ];
    
    if (mockOrders.length > 0) {
        let html = '<table><thead><tr><th>訂單編號</th><th>日期</th><th>總金額</th><th>狀態</th></tr></thead><tbody>';
        mockOrders.forEach(order => {
            html += `<tr><td>${order.id}</td><td>${order.date}</td><td>$${order.total}</td><td>${order.status}</td></tr>`;
        });
        html += '</tbody></table>';
        orderListDiv.innerHTML = html;
        message.textContent = '點擊訂單編號可查看詳情 (模擬訂單)。';
    } else {
        orderListDiv.innerHTML = '<p>您目前沒有任何購物紀錄。</p>';
        message.textContent = '';
    }
}

function showOrderHistory() {
    hideAllSections();
    document.getElementById('order-history-section').style.display = 'block';
    populateOrderHistory(); 
}

function handleChangePassword(event) {
    event.preventDefault();
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-new-password').value;
    const errorMsg = document.getElementById('password-error-message');
    
    errorMsg.style.display = 'none';
    
    if (newPass.length < 6) {
        errorMsg.textContent = '新密碼長度至少需要 6 個字元。';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (newPass !== confirmPass) {
        errorMsg.textContent = '新密碼與確認新密碼不一致。';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (oldPass === newPass) {
        errorMsg.textContent = '新密碼不能與舊密碼相同。';
        errorMsg.style.display = 'block';
        return;
    }

    setTimeout(() => {
        alert('密碼修改成功！基於安全考量，請重新登入。');
        handleLogout(); 
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {

    const userToken = localStorage.getItem('userToken');
    
    if (userToken) {
        showStatusDisplay(); 
        
        document.getElementById('change-password-link').addEventListener('click', (e) => {
            e.preventDefault();
            showChangePassword();
        });

        document.getElementById('order-history-link').addEventListener('click', (e) => {
            e.preventDefault();
            showOrderHistory();
        });
        
        document.getElementById('back-to-status-1').addEventListener('click', showStatusDisplay);
        document.getElementById('back-to-status-2').addEventListener('click', showStatusDisplay);
        document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);

        return; 
    }

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const forgotPasswordLink = document.getElementById('forgot-password-link'); 

    hideAllSections();
    loginForm.style.display = 'block';

    errorMessage.style.display = 'none';

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        errorMessage.textContent = ''; 
        errorMessage.style.display = 'none';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            errorMessage.textContent = '請輸入電子郵件/帳號和密碼。';
            errorMessage.style.display = 'block';
            return;
        }
        
        const loginData = {
            email: email,
            password: password
        };

        authenticateUser(loginData, loginForm);
    });

    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        
        const userEmail = prompt('請輸入您的註冊電子郵件地址：');
        
        if (userEmail) {
            alert(`已向 ${userEmail} 發送密碼重設郵件，請檢查您的信箱。`);
        } else if (userEmail === '') {
             alert('電子郵件地址不能為空。');
        } else {
            alert('已取消密碼重設請求。');
        }
    });
});