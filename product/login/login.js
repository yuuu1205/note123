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
            
            const userNameForDisplay = user.username || '用戶'; 
            
            const simulatedUser = {
                name: userNameForDisplay, 
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
    errorMessage.textContent = '登入中...';
    errorMessage.style.display = 'block';

    simulateBackendAuth(data.email, data.password)
        .then(result => {
            if (result.success) {
                handleSuccessfulLogin(result.user, formElement);
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            errorMessage.textContent = '登入發生錯誤，請稍後再試。';
            errorMessage.style.display = 'block';
            console.error('Login error:', error);
        });
}

function handleSuccessfulLogin(user, formElement) {
    localStorage.setItem('userToken', user.token); 
    localStorage.setItem('userName', user.name); 
    localStorage.setItem('isLoggedIn', 'true');

    formElement.reset(); 

    alert(`歡迎回來，${user.name}！您已成功登入。`);

    setTimeout(() => {
        window.location.href = '../../index.html'; 
    }, 100); 
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
            alert(`已向 ${userEmail} 發送密碼重設連結，請檢查您的電子郵件。`);
        }
    });

});