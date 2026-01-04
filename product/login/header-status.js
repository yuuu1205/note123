document.addEventListener('DOMContentLoaded', () => {
    const memberLinks = document.querySelectorAll('.member-link');

    const isUserLoggedIn = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');

    memberLinks.forEach(link => {
        if (isUserLoggedIn) {
            
            link.textContent = '會員中心'; 
            
            let targetPath = 'product/login/member.html';

            const currentPath = window.location.pathname;

            if (currentPath.includes('/product/')) {      
                if (currentPath.includes('/login/')) {
                    targetPath = 'member.html';
                } else {
                    targetPath = '../login/member.html';
                }
            } else {
                targetPath = 'product/login/member.html';
            }

            link.href = targetPath;

        } else {
            let targetPath = 'product/login/login.html';

            const currentPath = window.location.pathname;
            if (currentPath.includes('/product/')) {
                if (currentPath.includes('/login/')) {
                    targetPath = 'login.html';
                } else {
                    targetPath = '../login/login.html';
                }
            } else {
                targetPath = 'product/login/login.html';
            }

            link.textContent = '會員登入';
            link.href = targetPath;
        }
    });
});