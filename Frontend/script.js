const API_BASE = 'http://localhost:3000/api';

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Check authentication status on load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        showPage('dashboard-page');
        document.getElementById('user-greeting').textContent = `Hello, ${JSON.parse(user).name}!`;
    } else {
        showPage('login-page');
    }
});

// Login form handler
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showPage('welcome-page');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error connecting to server');
    }
});

// Register form handler
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            showPage('login-page');
            document.getElementById('register-form').reset();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Error connecting to server');
    }
});

// Navigation functions
function goToDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('user-greeting').textContent = `Hello, ${user.name}!`;
    showPage('dashboard-page');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showPage('login-page');
    document.getElementById('login-form').reset();
}