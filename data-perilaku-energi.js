async function muatDataEnergi() {
    const status = document.getElementById("status-data");

    try {
        const response = await fetch("./data-perilaku-energi.json");

        if (!response.ok) {
            throw new Error(`JSON gagal dimuat: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById("jumlah-responden").textContent =
            data.meta.jumlah_responden.toLocaleString("id-ID");

        document.getElementById("persen-partisipasi").textContent =
            `${data.meta.persen_partisipasi}%`;

        document.getElementById("rata-rata-skor").textContent =
            data.ringkasan.rata_rata_skor.toFixed(2);

        new Chart(document.getElementById("chart-perilaku"), {
            type: "bar",
            data: {
                labels: data.per_butir.map((butir) => butir.label),
                datasets: [{
                    label: "Rata-rata skor",
                    data: data.per_butir.map((butir) => butir.rata_rata),
                    backgroundColor: "#15803d"
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        min: 0,
                        max: 4,
                        title: {
                            display: true,
                            text: "Rata-rata skor (skala 1–4)"
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        const kategori = data.ringkasan.kategori_persen;

        new Chart(document.getElementById("chart-kategori"), {
            type: "doughnut",
            data: {
                labels: Object.keys(kategori),
                datasets: [{
                    data: Object.values(kategori),
                    backgroundColor: ["#15803d", "#84cc16", "#facc15", "#ef4444"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}%`
                        }
                    }
                }
            }
        });

        status.textContent =
            `Data dimuat: ${data.meta.jumlah_responden} responden.`;
    } catch (error) {
        console.error("Gagal memuat data energi:", error);
        status.textContent =
            "Data gagal dimuat. Pastikan Live Server berjalan dan file JSON berada di folder yang sama.";
    }
}

muatDataEnergi();