const PERMANENT_USER_EMAIL = '111@gmail.com';
const PERMANENT_USER_PASSWORD = '111111';

function simulateBackendAuth(email, password, isFirstAttempt) {
    return new Promise(resolve => {
        setTimeout(() => {
            const isPermanentUser = (email === PERMANENT_USER_EMAIL && password === PERMANENT_USER_PASSWORD);
            const registeredUser = JSON.parse(sessionStorage.getItem('registeredUser'));
            
            const isRegistered = isPermanentUser || (registeredUser && registeredUser.email === email && registeredUser.password === password);

            if (isRegistered) {
                const user = isPermanentUser ? 
                    { username: '會員', email: PERMANENT_USER_EMAIL } : 
                    registeredUser;

                resolve({ 
                    success: true, 
                    token: 'fake-test-token-' + Date.now(), 
                    message: '登入成功',
                    user: user 
                });
            } else if (isFirstAttempt) {
                resolve({ 
                    success: false, 
                    message: '查無此帳號！請先前往註冊新帳號。',
                    errorCode: 'NOT_REGISTERED' 
                });
            } else {
                 resolve({ 
                    success: false, 
                    message: '登入失敗，電子郵件或密碼錯誤。',
                    errorCode: 'AUTH_FAILED' 
                });
            }
        }, 500); 
    });
}

function authenticateUser(data, formElement) {
    const errorMessage = document.getElementById('error-message');
    const isFirstAttempt = !sessionStorage.getItem('loginAttempt');

    sessionStorage.setItem('loginAttempt', 'true');

    simulateBackendAuth(data.email, data.password, isFirstAttempt)
    .then(result => {
        if (result.success) {
            alert('登入成功！歡迎回來。');
            formElement.reset(); 
            
            const userToStore = result.user;
            localStorage.setItem('userToken', result.token); 
            localStorage.setItem('userName', userToStore.username || userToStore.name);
            localStorage.setItem('userEmail', userToStore.email); 

            sessionStorage.removeItem('loginAttempt');
            sessionStorage.removeItem('registeredUser');
            localStorage.removeItem('registrationSuccess'); 
            sessionStorage.removeItem('prefillEmail');
            sessionStorage.removeItem('prefillPassword');

            setTimeout(() => {
                window.location.href = 'member.html'; 
            }, 100); 
            
        } else {
            errorMessage.textContent = result.message || '登入失敗，請檢查帳號和密碼。';
            errorMessage.style.display = 'block';

            if (result.errorCode === 'NOT_REGISTERED') {
                setTimeout(() => {
                    alert(result.message);
                    sessionStorage.setItem('prefillEmail', data.email);
                    sessionStorage.setItem('prefillPassword', data.password); 
                    window.location.href = 'register.html'; 
                }, 100);
            }
        }
    })
    .catch(error => {
        console.error('登入處理錯誤:', error);
        errorMessage.textContent = '連線伺服器或處理請求失敗，請稍後再試。';
        errorMessage.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const forgotPasswordLink = document.getElementById('forgot-password-link'); 
    
    errorMessage.style.display = 'none'; 

    const successMessage = localStorage.getItem('registrationSuccess');
    if (successMessage) {
        alert(successMessage);
        
        const registeredUser = JSON.parse(sessionStorage.getItem('registeredUser'));
        if (registeredUser) {
            authenticateUser({
                email: registeredUser.email,
                password: registeredUser.password
            }, loginForm);
            return; 
        }
    }

    const prefillEmail = sessionStorage.getItem('prefillEmail');
    if (prefillEmail) {
        emailInput.value = prefillEmail;
    }
    
    if (!successMessage) {
        sessionStorage.removeItem('loginAttempt');
        sessionStorage.removeItem('registeredUser');
        sessionStorage.removeItem('prefillEmail');
        sessionStorage.removeItem('prefillPassword');
    }

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