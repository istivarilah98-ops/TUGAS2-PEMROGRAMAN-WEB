import dataBA from './dataBahanAjar.js';
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            stok: dataBA.stok,
            openFormTambah: false,
            openEdit: false,
            indexEdit: null,

            // State Filter & Sort
            sortStok: "",
            selectedUpbjj: "",
            selectedKategori: "",
            reorderFilter: false,

            edit: {
                kode: "", 
                judul: "", 
                kategori: "", 
                harga: 0, 
                upbjj: "", 
                lokasiRak: "", 
                qty: 0, 
                safety: 0, 
                catatanHTML: ""
            },
            input: {
                kode: "", judul: "", kategori: "", harga: 0, upbjj: "", 
                lokasiRak: "", qty: 0, safety: 0, catatanHTML: ""
            }
        }
    },

    //COMPUTED UNTUK FILTER
    computed: {
        upbjjList() {
            return [...new Set(this.stok.map(item => item.upbjj))];
        },

        kategoriList() {
            if (!this.selectedUpbjj) return [];
            const filteredByUpbjj = this.stok.filter(item => item.upbjj === this.selectedUpbjj);
            return [...new Set(filteredByUpbjj.map(item => item.kategori))];
        },

        filterSortStok() {
            let result = [...this.stok];

            // FILTER UT DAERAH
            if (this.selectedUpbjj) {
                result = result.filter(item => item.upbjj === this.selectedUpbjj);
            }

            // FILTER KATEGORI + DEPENDENCY
            if (this.selectedKategori) {
                result = result.filter(item => item.kategori === this.selectedKategori);
            }

            // FILTER STOK KOSONG ATAU YANG MENIPIS
            if (this.reorderFilter) {
                result = result.filter(item => item.qty === 0 || item.qty < item.safety);
            }

            // SORT JUDUL, QTY, HAGRGA
            if (this.sortStok === "judul") {
                result.sort((a, b) => a.judul.localeCompare(b.judul));
            } else if (this.sortStok === "harga") {
                result.sort((a, b) => a.harga - b.harga);
            } else if (this.sortStok === "stok") {
                result.sort((a, b) => b.qty - a.qty);
            }

            return result;
        }
    },

    watch: {
        selectedUpbjj(newVal) {
            if (!newVal) {
                this.selectedKategori = "";
            }
        }
    },

    methods: {
        tambahBA() {
            this.stok.push({ ...this.input });
            this.input = {
                kode: "", 
                judul: "", 
                kategori: "", 
                harga: 0, 
                upbjj: "", 
                lokasiRak: "", 
                qty: 0, 
                safety: 0, 
                catatanHTML: ""
            };
            this.openFormTambah = false;
        },

        editBA(index) {
            const itemToEdit = this.filterSortStok[index];
            const originalIndex = this.stok.findIndex(item => item.kode === itemToEdit.kode);
            
            this.indexEdit = originalIndex;
            this.edit = { ...itemToEdit };
            this.openEdit = true;
        },

        updateBA() {
            if (this.indexEdit !== null) {
                this.stok[this.indexEdit] = { ...this.edit };
            }
            this.indexEdit = null;
            this.edit = {
                kode: "", judul: "", kategori: "", harga: 0, upbjj: "", 
                lokasiRak: "", qty: 0, safety: 0, catatanHTML: ""
            };
            this.openEdit = false;
        },

        resetFilter() {
            this.sortStok = "";
            this.selectedUpbjj = "";
            this.selectedKategori = "";
            this.reorderFilter = false;
        }
    }
});

app.mount('#app');