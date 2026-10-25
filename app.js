// ===== DEMO CREDENTIALS (replace with real auth later) =====
const DEMO_USERS = [
    { email: 'admin@survey.vn', password: 'Admin@123' },
    { email: 'testuser@survey.vn', password: '123456' },
];

// ===== MODAL CONTROL =====
function openLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.getElementById('emailInput').focus();
    }, 350);
    clearForm();
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearForm();
}

function handleOverlayClick(event) {
    if (event.target === document.getElementById('loginModal')) {
        closeLogin();
    }
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLogin();
});

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function setFieldError(fieldId, groupId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId === 'emailInput' ? 'emailError' : 'passwordError');
    input.classList.add('error-input');
    error.textContent = message;
}

function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId === 'emailInput' ? 'emailError' : 'passwordError');
    input.classList.remove('error-input');
    error.textContent = '';
}

function clearForm() {
    document.getElementById('loginForm').reset();
    clearFieldError('emailInput');
    clearFieldError('passwordInput');
    hideAlert();
}

// Realtime validation
document.getElementById('emailInput').addEventListener('input', () => clearFieldError('emailInput'));
document.getElementById('passwordInput').addEventListener('input', () => clearFieldError('passwordInput'));

// ===== TOGGLE PASSWORD =====
let passwordVisible = false;
function togglePassword() {
    const input = document.getElementById('passwordInput');
    const eyeShow = document.getElementById('eyeShow');
    const eyeHide = document.getElementById('eyeHide');
    passwordVisible = !passwordVisible;
    input.type = passwordVisible ? 'text' : 'password';
    eyeShow.classList.toggle('hidden', passwordVisible);
    eyeHide.classList.toggle('hidden', !passwordVisible);
}

// ===== ALERT =====
function showAlert(message, type = 'error') {
    const box = document.getElementById('alertBox');
    const msg = document.getElementById('alertMsg');
    box.classList.remove('hidden', 'error', 'success');
    box.classList.add(type);
    msg.textContent = message;
}

function hideAlert() {
    document.getElementById('alertBox').classList.add('hidden');
}

// ===== LOADING STATE =====
function setLoading(isLoading) {
    const btn = document.getElementById('loginBtn');
    const text = document.getElementById('loginBtnText');
    const spinner = document.getElementById('loginSpinner');
    btn.disabled = isLoading;
    text.classList.toggle('hidden', isLoading);
    spinner.classList.toggle('hidden', !isLoading);
}

// ===== HANDLE LOGIN =====
async function handleLogin(event) {
    event.preventDefault();
    hideAlert();

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    let hasError = false;

    // Validate email
    if (!email) {
        setFieldError('emailInput', 'group-email', 'Vui lòng nhập địa chỉ email.');
        hasError = true;
    } else if (!validateEmail(email)) {
        setFieldError('emailInput', 'group-email', 'Địa chỉ email không hợp lệ.');
        hasError = true;
    }

    // Validate password
    if (!password) {
        setFieldError('passwordInput', 'group-password', 'Vui lòng nhập mật khẩu.');
        hasError = true;
    } else if (password.length < 6) {
        setFieldError('passwordInput', 'group-password', 'Mật khẩu phải có ít nhất 6 ký tự.');
        hasError = true;
    }

    if (hasError) return;

    // Simulate API call
    setLoading(true);
    await sleep(1200);
    setLoading(false);

    // Check credentials
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (user) {
        // Save session
        const remember = document.getElementById('rememberMe').checked;
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('survey_user', email);

        showAlert('✅ Đăng nhập thành công! Đang chuyển trang...', 'success');

        setTimeout(() => {
            closeLogin();
            showDashboard(email);
        }, 1000);
    } else {
        showAlert('❌ Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
        shakeModal();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shakeModal() {
    const card = document.getElementById('modalCard');
    card.style.animation = 'none';
    card.offsetHeight; // reflow
    card.style.animation = 'shake 0.5s ease';
}

// Inject shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15%       { transform: translateX(-8px); }
    30%       { transform: translateX(8px); }
    45%       { transform: translateX(-6px); }
    60%       { transform: translateX(6px); }
    75%       { transform: translateX(-3px); }
    90%       { transform: translateX(3px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== DASHBOARD =====
function showDashboard(email) {
    document.getElementById('landingPage').classList.add('hidden');
    const dash = document.getElementById('dashboardPage');
    dash.classList.remove('hidden');
    document.getElementById('userEmailDisplay').textContent = email;
    document.getElementById('userAvatar').textContent = email.charAt(0).toUpperCase();
}

function handleLogout() {
    localStorage.removeItem('survey_user');
    sessionStorage.removeItem('survey_user');
    document.getElementById('dashboardPage').classList.add('hidden');
    document.getElementById('landingPage').classList.remove('hidden');
}

// ===== FORGOT PASSWORD =====
function showForgotMsg(event) {
    event.preventDefault();
    showAlert('📧 Vui lòng liên hệ quản trị viên để đặt lại mật khẩu.', 'success');
}

// ===== SCROLL TO INFO =====
function scrollToInfo() {
    document.getElementById('infoSection').scrollIntoView({ behavior: 'smooth' });
}

// ===== AUTO LOGIN IF SESSION EXISTS =====
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('survey_user') || sessionStorage.getItem('survey_user');
    if (savedUser) {
        showDashboard(savedUser);
    }
});
