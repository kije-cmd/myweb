document.getElementById("logoutBtn").addEventListener("click", function() {
    // Hapus status login dari localStorage
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html"; // Alihkan ke halaman login
});

// Cek status login saat halaman utama dibuka
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html"; // Arahkan ke login jika belum login
}
