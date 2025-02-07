// Handle User Signup
function handleSignup(event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Simple validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Create user object
    const user = {
        name: name,
        email: email,
        password: password
    };

    // Save user data to localStorage (you can replace this with an API call)
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to login page after signup
    window.location.href = "login.html";
}

// Handle User Login
function handleLogin(event) {
    event.preventDefault();

    // Get login credentials
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Retrieve stored user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Validate the credentials
    if (storedUser && storedUser.email === email && storedUser.password === password) {
        // If valid, redirect to index.html
        window.location.href = "index.html";
    } else {
        // If invalid, show error message
        alert("Invalid credentials. Please try again.");
    }
}

// Attach event listeners to the forms
window.onload = function () {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // Signup functionality
    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
    }

    // Login functionality
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
};
