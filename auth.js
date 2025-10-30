// Simple authentication system using localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in on the login page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Redirect to weather page if already logged in
            window.location.href = 'weather.html';
        }
    }
    
    // Handle logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear the current user from localStorage
            localStorage.removeItem('currentUser');
            // Redirect to sign-in page
            window.location.href = 'index.html';
        });
    }
    
    // Check if login form exists on the page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user exists
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store logged in user
                localStorage.setItem('currentUser', JSON.stringify(user));
                // Redirect to weather page
                window.location.href = 'weather.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }
    
    // Check if signup form exists on the page
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate password match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            if (users.find(u => u.email === email)) {
                alert('User with this email already exists');
                return;
            }
            
            // Create new user
            const newUser = {
                name,
                email,
                password
            };
            
            // Add user to array
            users.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Redirect to login page
            alert('Account created successfully! Please log in.');
            window.location.href = 'login.html';
        });
    }
});