const correctUsername = "pondoksalero"; // Ganti dengan username yang Anda tentukan
const correctPassword = "nasikgorengsoto"; // Ganti dengan password yang Anda tentukan

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === correctUsername && password === correctPassword) {
        // Set login status di localStorage
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html"; // Alihkan ke halaman utama
    } else {
        document.getElementById("errorMessage").innerText = "Username atau password salah.";
    }
});

// Periksa apakah sudah login saat halaman login dibuka
if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
}
