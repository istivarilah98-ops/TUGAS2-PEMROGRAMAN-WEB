import dataBA from './dataBahanAjar.js';

const app = Vue.createApp({
    data() {
        return {
            tracking: dataBA.tracking,
            pengirimanList: dataBA.pengirimanList,
            paket: dataBA.paket,
            
            inputBilling: "",
            hasilTracking: null,
            pesan: "",

            // Di-set false agar modal tidak muncul otomatis saat halaman dimuat
            openFormTambah: false,

            input: {
                nomorDO: "",
                nim: "",
                nama: "",
                ekspedisi: "",
                indexPaket: "", 
                tanggalKirim: "",
                harga: 0
            }
        }
    },

    computed: {
        jumlahPerjalanan() {
            if (this.hasilTracking && this.hasilTracking.perjalanan) {
                return this.hasilTracking.perjalanan.length;
            }
            return 0;
        },

        detailPaketPilihan() {
            if (this.input.indexPaket !== "" && this.paket[this.input.indexPaket]) {
                return this.paket[this.input.indexPaket].isi || [];
            }
            return [];
        }
    },

    watch: {
        inputBilling(newValue) {
            this.hasilTracking = null;
            this.pesan = "";
        },

        'input.indexPaket'(newIndex) {
            if (newIndex !== "" && this.paket[newIndex]) {
                this.input.harga = this.paket[newIndex].harga;
            } else {
                this.input.harga = 0;
            }
        }
    },

    methods: {
        formBilling() {
            if (this.inputBilling.trim() === "") {
                this.pesan = "Masukkan nomor DO terlebih dahulu!";
                this.hasilTracking = null;
                return;
            }

            let cari = this.tracking[this.inputBilling.trim()];

            if (cari) {
                this.hasilTracking = cari;
                this.pesan = "";
            } else {
                this.hasilTracking = null;
                this.pesan = "Nomor DO tidak ditemukan!";
            }
        },

        generateNomorDO() {
            const tahun = new Date().getFullYear();
            const keys = Object.keys(this.tracking);
            
            let count = 0;
            keys.forEach(key => {
                if (key.startsWith(`DO${tahun}`)) {
                    count++;
                }
            });

            const sequence = String(count + 1).padStart(4, '0');
            return `DO${tahun}-${sequence}`;
        },

        bukaModalTambah() {
            this.input.nomorDO = this.generateNomorDO();
            this.input.nim = "";
            this.input.nama = "";
            this.input.ekspedisi = "";
            this.input.indexPaket = "";
            this.input.tanggalKirim = new Date().toISOString().slice(0, 10);
            this.input.harga = 0;
            
            this.openFormTambah = true;
        },

        tambahDO() {
            if (!this.input.nim || !this.input.nama || !this.input.ekspedisi || this.input.indexPaket === "") {
                alert("Semua field wajib diisi!");
                return;
            }

            const paketTerpilih = this.paket[this.input.indexPaket];

            this.tracking[this.input.nomorDO] = {
                nim: this.input.nim,
                nama: this.input.nama,
                status: "Diproses",
                ekspedisi: this.input.ekspedisi,
                tanggalKirim: this.input.tanggalKirim,
                paket: paketTerpilih.nama,
                total: this.input.harga,
                perjalanan: [
                    { waktu: this.input.tanggalKirim + " 08:00:00", keterangan: "DO dibuat dan diproses" }
                ]
            };

            this.openFormTambah = false;
            alert(`Delivery Order ${this.input.nomorDO} berhasil ditambahkan!`);
        },

        formatRupiah(angka) {
            return angka ? angka.toLocaleString("id-ID") : "0";
        }
    }
});

app.mount('#app');