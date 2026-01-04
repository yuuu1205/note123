function simulateRegistrationBackend(data) {
    return new Promise(resolve => {
        setTimeout(() => {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const emailExists = registeredUsers.some(user => user.email === data.email);

            if (emailExists) {
                resolve({ 
                    success: false, 
                    message: '此電子郵件已被註冊。'
                });
                return;
            }
            registeredUsers.push({ 
                email: data.email, 
                password: data.password,
                username: data.username
            });
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            localStorage.setItem('registrationSuccess', `恭喜！帳號 ${data.email} 註冊成功，請登入。`);

            resolve({ 
                success: true, 
                message: '帳號創建成功'
            });
        }, 800); 
    });
}

function registerNewUser(data, formElement) {
    const errorMessage = document.getElementById('error-message');

    return simulateRegistrationBackend(data)
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

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');

    errorMessage.style.display = 'none';
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