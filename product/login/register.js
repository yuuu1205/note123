document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');

    errorMessage.style.display = 'none';

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

        registerNewUser(registrationData, registerForm);
    });
});

function registerNewUser(data, formElement) {
    const errorMessage = document.getElementById('error-message');

    simulateRegistrationBackend(data)
    .then(result => {
        if (result.success) {
            alert('註冊成功！您現在可以登入了。');
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