// =================================
// ELEMENTS
// =================================

const registerView = document.getElementById("registerView");
const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");

const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");

const logoutBtn = document.getElementById("logoutBtn");

const dashboardUser = document.getElementById("dashboardUser");


// =================================
// STORAGE KEYS
// =================================

const USERS_KEY = "secureGateUsers";
const SESSION_KEY = "secureGateSession";


// =================================
// GET USERS
// =================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];
}


// =================================
// SAVE USERS
// =================================

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


// =================================
// SHA-256 PASSWORD HASH
// =================================

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// =================================
// VALIDATE PASSWORD
// =================================

function isValidPassword(password) {

    return (
        password.length >= 8 &&
        /\d/.test(password)
    );
}


// =================================
// VALIDATE USERNAME / EMAIL
// =================================

function isValidIdentifier(value) {

    return value.trim().length > 0;
}


// =================================
// MESSAGE HELPER
// =================================

function showMessage(element, message, type) {

    element.textContent = message;

    element.className = `message ${type}`;
}


function clearMessage(element) {

    element.textContent = "";

    element.className = "message";
}


// =================================
// SWITCH TO LOGIN
// =================================

showLoginBtn.addEventListener("click", function () {

    registerView.classList.add("hidden");

    dashboardView.classList.add("hidden");

    loginView.classList.remove("hidden");

    clearMessage(registerMessage);

    loginUsername.focus();
});


// =================================
// SWITCH TO REGISTER
// =================================

showRegisterBtn.addEventListener("click", function () {

    loginView.classList.add("hidden");

    dashboardView.classList.add("hidden");

    registerView.classList.remove("hidden");

    clearMessage(loginMessage);

    registerUsername.focus();
});


// =================================
// REGISTRATION
// =================================

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearMessage(registerMessage);

    const identifier =
        registerUsername.value.trim();

    const password =
        registerPassword.value;


    // Empty validation

    if (!identifier || !password) {

        showMessage(
            registerMessage,
            "Please complete all fields.",
            "error"
        );

        return;
    }


    // Password validation

    if (!isValidPassword(password)) {

        showMessage(
            registerMessage,
            "Password must contain at least 8 characters and 1 number.",
            "error"
        );

        return;
    }


    // Get existing users

    const users = getUsers();


    // Duplicate check

    const duplicateUser = users.some(
        user =>
            user.identifier.toLowerCase() ===
            identifier.toLowerCase()
    );


    if (duplicateUser) {

        showMessage(
            registerMessage,
            "An account with this username or email already exists.",
            "error"
        );

        return;
    }


    // Hash password

    const passwordHash =
        await hashPassword(password);


    // Create user

    const newUser = {

        id: Date.now(),

        identifier: identifier,

        passwordHash: passwordHash,

        createdAt: Date.now()
    };


    users.push(newUser);

    saveUsers(users);


    // Clear form

    registerForm.reset();


    // Success message

    showMessage(
        registerMessage,
        "Account created successfully. You can now login.",
        "success"
    );


    // Move to login after short delay

    setTimeout(function () {

        registerView.classList.add("hidden");

        loginView.classList.remove("hidden");

        loginUsername.value = identifier;

        loginUsername.focus();

        clearMessage(registerMessage);

    }, 1000);
});


// =================================
// LOGIN
// =================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearMessage(loginMessage);

    const identifier =
        loginUsername.value.trim();

    const password =
        loginPassword.value;


    // Empty validation

    if (!identifier || !password) {

        showMessage(
            loginMessage,
            "Please enter your username/email and password.",
            "error"
        );

        return;
    }


    // Get users

    const users = getUsers();


    // Hash entered password

    const passwordHash =
        await hashPassword(password);


    // Find matching credentials

    const user = users.find(
        currentUser =>
            currentUser.identifier.toLowerCase() ===
                identifier.toLowerCase() &&
            currentUser.passwordHash ===
                passwordHash
    );


    // Incorrect credentials

    if (!user) {

        showMessage(
            loginMessage,
            "Invalid username/email or password.",
            "error"
        );

        return;
    }


    // Create session

    const session = {

        userId: user.id,

        identifier: user.identifier,

        loginAt: Date.now()
    };


    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );


    // Clear form

    loginForm.reset();

    clearMessage(loginMessage);


    // Open dashboard

    showDashboard(session);
});


// =================================
// SHOW DASHBOARD
// =================================

function showDashboard(session) {

    registerView.classList.add("hidden");

    loginView.classList.add("hidden");

    dashboardView.classList.remove("hidden");

    dashboardUser.textContent =
        session.identifier;
}


// =================================
// CHECK SESSION
// =================================

function checkSession() {

    const session =
        JSON.parse(
            localStorage.getItem(SESSION_KEY)
        );


    if (session) {

        const users = getUsers();

        const userExists = users.some(
            user => user.id === session.userId
        );


        if (userExists) {

            showDashboard(session);

            return;
        }


        // Remove invalid session

        localStorage.removeItem(SESSION_KEY);
    }


    // No active session

    loginView.classList.remove("hidden");

    registerView.classList.add("hidden");

    dashboardView.classList.add("hidden");
}


// =================================
// LOGOUT
// =================================

logoutBtn.addEventListener("click", function () {

    localStorage.removeItem(SESSION_KEY);

    dashboardView.classList.add("hidden");

    loginView.classList.remove("hidden");

    loginForm.reset();

    clearMessage(loginMessage);

    loginUsername.focus();
});


// =================================
// INITIALIZE APP
// =================================

checkSession();