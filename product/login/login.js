function simulateBackendAuth(email, password) {
    return new Promise(resolve => {
        setTimeout(() => {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            const user = registeredUsers.find(u => u.email === email);
            
            if (!user) {
                resolve({ 
                    success: false, 
                    message: '找不到此帳號，請確認您的電子郵件或先進行註冊。',
                    errorCode: 'USER_NOT_FOUND' 
                });
                return;
            }
            
            if (user.password !== password) {
                 resolve({ 
                    success: false, 
                    message: '密碼錯誤，請重新輸入。',
                    errorCode: 'WRONG_PASSWORD' 
                });
                return;
            }

            const atIndex = email.indexOf('@');
            const defaultName = atIndex !== -1 ? email.substring(0, atIndex) : '用戶';
            
            const simulatedUser = {
                name: defaultName, 
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
                window.location.href = 'member.html'; 
            }, 100); 
        } else {
            if (result.errorCode === 'USER_NOT_FOUND') {
                alert('您輸入的電子郵件未註冊！即將為您導向註冊頁面。');
                window.location.href = 'register.html'; 
                return;
            }

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

document.addEventListener('DOMContentLoaded', () => {
    const successMessage = localStorage.getItem('registrationSuccess');
    if (successMessage) {
        alert(successMessage);
        localStorage.removeItem('registrationSuccess'); 
    }

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const forgotPasswordLink = document.getElementById('forgot-password-link'); 

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
        }
    });
});