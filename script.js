let totalPrice = 0; // Variabel untuk menyimpan total harga keseluruhan
const expenditures = {}; // Menyimpan pengeluaran bulanan

document.getElementById('belanjaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const namaBahan = document.getElementById('namaBahan').value;
    const jumlahBahan = document.getElementById('jumlahBahan').value;
    const hargaBahan = document.getElementById('hargaBahan').value;
    const tanggal = new Date().toLocaleDateString();
    const bulan = new Date().toLocaleString('default', { month: 'long' });

    const totalHarga = jumlahBahan * hargaBahan;
    totalPrice += totalHarga; // Tambahkan total harga baru ke total keseluruhan
    document.getElementById('totalHargaKeseluruhan').innerText = parseInt(totalPrice).toLocaleString(); // Tampilkan total harga keseluruhan

    // Hitung pengeluaran bulanan
    expenditures[bulan] = (expenditures[bulan] || 0) + totalHarga;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${tanggal}</td>
        <td>${namaBahan}</td>
        <td>${jumlahBahan}</td>
        <td>Rp ${parseInt(hargaBahan).toLocaleString()}</td>
        <td>Rp ${parseInt(totalHarga).toLocaleString()}</td>
        <td><button onclick="editRow(this)">🖉</button> <button onclick="deleteRow(this)">🗑️</button></td>
    `;

    document.querySelector('#belanjaList tbody').appendChild(newRow);
    this.reset();

    // Simpan data ke localStorage
    saveToLocalStorage();
    loadChart(); // Update grafik
});

function editRow(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');
    document.getElementById('namaBahan').value = cells[1].innerText;
    document.getElementById('jumlahBahan').value = cells[2].innerText;
    document.getElementById('hargaBahan').value = cells[3].innerText.replace('Rp ', '').replace('.', '').replace(',', '');
    row.remove();

    // Hitung ulang total harga keseluruhan
    const totalHarga = parseInt(cells[4].innerText.replace('Rp ', '').replace('.', '').replace(',', ''));
    totalPrice -= totalHarga; // Kurangi total harga yang dihapus
    document.getElementById('totalHargaKeseluruhan').innerText = parseInt(totalPrice).toLocaleString(); // Tampilkan total harga keseluruhan

    // Hitung ulang pengeluaran bulanan
    const bulan = new Date().toLocaleString('default', { month: 'long' });
    expenditures[bulan] -= totalHarga;

    // Simpan data ke localStorage
    saveToLocalStorage();
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');
    const totalHarga = parseInt(cells[4].innerText.replace('Rp ', '').replace('.', '').replace(',', ''));
    totalPrice -= totalHarga; // Kurangi total harga yang dihapus
    document.getElementById('totalHargaKeseluruhan').innerText = parseInt(totalPrice).toLocaleString(); // Tampilkan total harga keseluruhan

    // Hitung ulang pengeluaran bulanan
    const bulan = new Date().toLocaleString('default', { month: 'long' });
    expenditures[bulan] -= totalHarga;

    row.remove();

    // Simpan data ke localStorage
    saveToLocalStorage();
    loadChart(); // Update grafik
}

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
    const rows = Array.from(document.querySelectorAll('#belanjaList tbody tr'));
    const data = rows.map(row => {
        const cells = row.getElementsByTagName('td');
        return {
            tanggal: cells[0].innerText,
            namaBahan: cells[1].innerText,
            jumlah: cells[2].innerText,
            harga: cells[3].innerText,
            total: cells[4].innerText
        };
    });
    localStorage.setItem('belanjaData', JSON.stringify(data));
    localStorage.setItem('expenditures', JSON.stringify(expenditures)); // Simpan pengeluaran bulanan
}

// Fungsi untuk memuat data dari localStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem('belanjaData')) || [];
    data.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.namaBahan}</td>
            <td>${item.jumlah}</td>
            <td>${item.harga}</td>
            <td>${item.total}</td>
            <td><button onclick="editRow(this)">🖉</button> <button onclick="deleteRow(this)">🗑️</button></td>
        `;
        document.querySelector('#belanjaList tbody').appendChild(newRow);
    });

    // Tambahkan total harga dari data yang dimuat
    data.forEach(item => {
        const totalHarga = parseInt(item.total.replace('Rp ', '').replace('.', '').replace(',', ''));
        totalPrice += totalHarga; // Tambahkan ke total keseluruhan
    });
    document.getElementById('totalHargaKeseluruhan').innerText = parseInt(totalPrice).toLocaleString(); // Tampilkan total harga keseluruhan

    // Muat pengeluaran bulanan
    const storedExpenditures = JSON.parse(localStorage.getItem('expenditures')) || {};
    for (const [bulan, total] of Object.entries(storedExpenditures)) {
        expenditures[bulan] = total;
    }
    loadChart(); // Tampilkan grafik
}

// Fungsi untuk mendownload data sebagai PDF
function downloadData() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Menambahkan judul
    doc.setFontSize(18);
    doc.text('Daftar Belanja', 14, 10);

    // Menambahkan tabel
    doc.setFontSize(12);
    const tableColumn = ["Tanggal", "Nama Bahan", "Jumlah", "Harga per Unit", "Total Harga"];
    const tableRows = [];

    // Ambil data dari tabel
    const rows = document.querySelectorAll("#belanjaList tbody tr");
    rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        const rowData = [
            cols[0].innerText,  // Tanggal
            cols[1].innerText,  // Nama Bahan
            cols[2].innerText,  // Jumlah
            cols[3].innerText,  // Harga per Unit
            cols[4].innerText   // Total Harga
        ];
        tableRows.push(rowData);
    });

    // Mengatur posisi tabel
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    // Menyimpan file PDF
    doc.save('daftar-belanja.pdf');
}

function sendToWhatsApp() {
    const rows = Array.from(document.querySelectorAll('#belanjaList tbody tr'));
    let message = 'Daftar Belanja:\n\n';

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const tanggal = cells[0].innerText;
        const namaBahan = cells[1].innerText;
        const jumlah = cells[2].innerText;
        const harga = cells[3].innerText;
        const total = cells[4].innerText;

        message += `Tanggal: ${tanggal}, Nama Bahan: ${namaBahan}, Jumlah: ${jumlah}, Harga: ${harga}, Total: ${total}\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}


function searchIngredients() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#belanjaList tbody tr");

    rows.forEach(row => {
        const cells = row.getElementsByTagName("td");
        const namaBahan = cells[1].innerText.toLowerCase();
        row.style.display = namaBahan.includes(input) ? "" : "none";
    });
}

// Fungsi untuk mengubah antara mode gelap dan terang
function toggleDarkLightMode() {
    document.body.classList.toggle("dark-mode");
}

// Memuat data saat halaman dimuat
window.onload = function() {
    loadData();
    loadChart(); // Tampilkan grafik saat halaman dimuat
};