document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');

    errorMessage.style.display = 'none';

    const prefillEmail = sessionStorage.getItem('prefillEmail');
    const prefillPassword = sessionStorage.getItem('prefillPassword');
    
    if (prefillEmail) {
        emailInput.value = prefillEmail;
    }
    if (prefillPassword) {
        passwordInput.value = prefillPassword;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        errorMessage.textContent = ''; 
        errorMessage.style.display = 'none';

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!username || !email || !password || !confirmPassword) {
            errorMessage.textContent = '所有欄位都必須填寫。';
            errorMessage.style.display = 'block';
            return;
        }

        if (!isValidEmail(email)) {
            errorMessage.textContent = '電子郵件格式不正確。';
            errorMessage.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = '密碼長度至少為 6 個字元。';
            errorMessage.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = '兩次輸入的密碼不一致。';
            errorMessage.style.display = 'block';
            return;
        }

        const registrationData = {
            username: username,
            email: email,
            password: password
        };

        const registerButton = document.getElementById('register-button');
        registerButton.disabled = true;
        registerButton.textContent = '註冊中...';

        registerNewUser(registrationData, registerForm)
        .finally(() => {
            registerButton.disabled = false;
            registerButton.textContent = '立即註冊';
        });
    });
});

function registerNewUser(data, formElement) {
    const errorMessage = document.getElementById('error-message');

    return simulateRegistrationBackend(data)
    .then(result => {
        if (result.success) {
            sessionStorage.setItem('registeredUser', JSON.stringify(data));
            localStorage.setItem('registrationSuccess', '註冊成功！系統將為您自動登入。'); 

            formElement.reset(); 
            setTimeout(() => {
                window.location.href = '../login/login.html'; 
            }, 100); 
        } else {
            errorMessage.textContent = result.message || '註冊失敗，請稍後再試。';
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('註冊處理錯誤:', error);
        errorMessage.textContent = '連線伺服器或處理請求失敗，請稍後再試。';
        errorMessage.style.display = 'block';
    });
}

function simulateRegistrationBackend(data) {
  
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                success: true, 
                message: '帳號創建成功'
            });
        }, 800); 
    });
}