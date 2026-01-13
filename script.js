function setViewportHeight() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        // Data produk aplikasi premium dengan varian
        const products = [
            {
                id: 1,
                name: "Alight Motion Pro",
                description: "Aplikasi edit video premium dengan efek profesional untuk content creator.",
                baseImage: "alight.png",
                category: "Video Editing",
                variants: [
                    {
                        id: "alight-ios",
                        name: "Alight Motion iOS",
                        description: "Versi untuk iPhone dan iPad",
                        price: 3000,
                        image: "alight.png"
                    },
                    {
                        id: "alight-android",
                        name: "Alight Motion Android",
                        description: "Versi untuk Android",
                        price: 3000,
                        image: "alight.png"
                    },
                ]
            },
            {
                id: 2,
                name: "CapCut Pro",
                description: "Editor video dengan template eksklusif dan efek premium tanpa watermark.",
                baseImage: "capcut.png",
                category: "Video Editing",
                variants: [
                    {
                        id: "capcut-01",
                        name: "CapCut 1 Week",
                        description: "Capcut 1 Week",
                        price: 6000,
                        image: "capcut.png"
                    },
                    {
                        id: "capcut-02",
                        name: "CapCut 1 Month",
                        description: "Versi untuk smartphone Android",
                        price: 10000,
                        image: "capcut.png"
                    }
                ]
            },
            {
                id: 3,
                name: "Canva",
                description: "Template premium, elemen desain lengkap, download transparan & animasi.",
                baseImage: "canva.png",
                category: "Design Grafis",
                variants: [
                    {
                        id: "canva-01",
                        name: "Canva 1 Month Admin",
                        description: "Akses penuh Canva Pro selama 1 bulan dengan kontrol admin.",
                        price: 4000,
                        image: "canva.png"
                    },
                    {
                        id: "canva-02",
                        name: "Canva 1 Month Owner",
                        description: "Akses penuh Canva Pro selama 1 bulan dengan kontrol Owner.",
                        price: 6000,
                        image: "canva.png"
                    }
                ]
            },
            {
                id: 4,
                name: "Wink",
                description: "Meningkatkan kualitas foto dan video ke HD, Ultra HD, atau 4K",
                baseImage: "wink.png",
                category: "AI Enchancer",
                variants: [
                    {
                        id: "wink-01",
                        name: "Wink 1 Week",
                        description: "Nikmati akses penuh Wink Pro selama 1 minggu.",
                        price: 4000,
                        image: "wink.png"
                    },
                    {
                        id: "wink-02",
                        name: "Wink 2 Week",
                        description: "Nikmati akses penuh Wink Pro selama 2 minggu.",
                        price: 6000,
                        image: "wink.png"
                    },
                    {
                        id: "wink-03",
                        name: "Wink 3 Week",
                        description: "Nikmati akses penuh Wink Pro selama 3 minggu.",
                        price: 8000,
                        image: "inshot-pro.png"
                    }
                ]
            },
            {
                id: 6,
                name: "Spotify Premium",
                description: "Streaming musik tanpa iklan dengan kualitas tinggi dan download offline.",
                baseImage: "spotify.png",
                category: "Music",
                variants: [
                    {
                        id: "spotify-01",
                        name: "Spotify 1 Month Family Plan",
                        description: "Akses premium Spotify untuk seluruh anggota keluarga",
                        price: 16000,
                        image: "spotify.png"
                    },
                    {
                        id: "spotify-02",
                        name: "Spotify 1 Month Individu Plan",
                        description: "Akses premium Spotify untuk 1 pengguna.",
                        price: 14000,
                        image: "spotify.png"
                    },
                    {
                        id: "spotify-03",
                        name: "Spotify 3 Month Individu Plan",
                        description: "Paket individu dengan durasi 3 bulan.",
                        price: 20000,
                        image: "spotify.png"
                    }
                ]
            }
        ];

        // Data keranjang dari localStorage
        let cart = JSON.parse(localStorage.getItem('takistore_cart')) || [];
        
        // Variabel untuk metode pembayaran dan varian
        let selectedPaymentMethod = null;
        let currentProduct = null;
        let selectedVariant = null;
        let variantQuantity = 1;
        
        // DOM Elements
        const productsGrid = document.getElementById('productsGrid');
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartCount = document.getElementById('cartCount');
        const totalPrice = document.getElementById('totalPrice');
        const confirmBtn = document.getElementById('confirmBtn');
        const openCartBtn = document.getElementById('openCart');
        const closeCartBtn = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        const orderModal = document.getElementById('orderModal');
        const orderSummary = document.getElementById('orderSummary');
        const closeModal = document.getElementById('closeModal');
        const paymentSection = document.getElementById('paymentSection');
        const paymentError = document.getElementById('paymentError');
        
        // Variant Modal Elements
        const variantModal = document.getElementById('variantModal');
        const variantModalTitle = document.getElementById('variantModalTitle');
        const variantList = document.getElementById('variantList');
        const closeVariant = document.getElementById('closeVariant');
        const variantQty = document.getElementById('variantQty');
        const decreaseQty = document.getElementById('decreaseQty');
        const increaseQty = document.getElementById('increaseQty');
        const addVariantToCart = document.getElementById('addVariantToCart');
        
        // Format harga ke Rupiah
        function formatRupiah(amount) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(amount);
        }
        
        // Render produk ke halaman
        function renderProducts() {
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                // Ambil harga terendah dari varian
                const minPrice = Math.min(...product.variants.map(v => v.price));
                const maxPrice = Math.max(...product.variants.map(v => v.price));
                let priceText = formatRupiah(minPrice);
                if (minPrice !== maxPrice) {
                    priceText = `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`;
                }
                
                productCard.innerHTML = `
                    <div class="product-image-container">
                        <img src="${product.baseImage}" alt="${product.name}" class="product-image">
                        <div class="product-badge">${product.category}</div>
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <div class="product-price">${priceText}</div>
                            <button class="add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i> Pilih Varian
                            </button>
                        </div>
                    </div>
                `;
                
                productsGrid.appendChild(productCard);
            });
            
            // Tambahkan event listener ke tombol pilih varian
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', openVariantModal);
            });
        }
        
        // Buka modal pilihan varian
        function openVariantModal(event) {
            const productId = parseInt(event.currentTarget.getAttribute('data-id'));
            currentProduct = products.find(p => p.id === productId);
            
            if (!currentProduct) return;
            
            // Reset pilihan varian dan quantity
            selectedVariant = null;
            variantQuantity = 1;
            variantQty.textContent = '1';
            addVariantToCart.disabled = true;
            
            // Set judul modal
            variantModalTitle.textContent = `Pilih Varian - ${currentProduct.name}`;
            
            // Render daftar varian
            renderVariants();
            
            // Buka modal
            variantModal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Render daftar varian
        function renderVariants() {
            variantList.innerHTML = '';
            
            currentProduct.variants.forEach(variant => {
                const variantItem = document.createElement('div');
                variantItem.className = 'variant-item';
                variantItem.setAttribute('data-id', variant.id);
                
                variantItem.innerHTML = `
                    <div>
                        <div class="variant-name">${variant.name}</div>
                        <div class="variant-description">${variant.description}</div>
                    </div>
                    <div class="variant-price">${formatRupiah(variant.price)}</div>
                `;
                
                // Event listener untuk memilih varian
                variantItem.addEventListener('click', () => {
                    // Hapus seleksi dari semua varian
                    document.querySelectorAll('.variant-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // Tambah seleksi ke varian yang dipilih
                    variantItem.classList.add('selected');
                    selectedVariant = variant;
                    addVariantToCart.disabled = false;
                });
                
                variantList.appendChild(variantItem);
            });
        }
        
        // Tutup modal varian
        function closeVariantModal() {
            variantModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Tambah varian ke keranjang
        function addVariantToCartFunc() {
            if (!currentProduct || !selectedVariant) return;
            
            // Cek apakah varian sudah ada di keranjang
            const existingItem = cart.find(item => item.variantId === selectedVariant.id);
            
            if (existingItem) {
                existingItem.quantity += variantQuantity;
            } else {
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    variantId: selectedVariant.id,
                    variantName: selectedVariant.name,
                    price: selectedVariant.price,
                    image: selectedVariant.image,
                    quantity: variantQuantity
                });
            }
            
            // Simpan ke localStorage
            localStorage.setItem('takistore_cart', JSON.stringify(cart));
            
            // Update tampilan keranjang
            updateCart();
            
            // Tutup modal varian
            closeVariantModal();
            
            // Buka keranjang
            openCart();
            
            // Tampilkan notifikasi sukses
            showNotification(`${selectedVariant.name} ditambahkan ke keranjang!`);
        }
        
        // Tampilkan notifikasi
        function showNotification(message) {
            // Hapus notifikasi sebelumnya jika ada
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Buat elemen notifikasi
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--secondary);
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideIn 0.3s ease-out;
                ">
                    <i class="fas fa-check-circle"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Hapus notifikasi setelah 3 detik
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
            
            // Tambahkan animasi CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            if (!document.querySelector('#notification-style')) {
                style.id = 'notification-style';
                document.head.appendChild(style);
            }
        }
        
        // Update tampilan keranjang
        function updateCart() {
            // Update jumlah item di ikon keranjang
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Tampilkan atau sembunyikan keranjang kosong
            if (cart.length === 0) {
                emptyCart.style.display = 'flex';
                paymentSection.style.display = 'none';
                confirmBtn.disabled = true;
            } else {
                emptyCart.style.display = 'none';
                paymentSection.style.display = 'block';
                
                // Reset metode pembayaran jika keranjang kosong
                selectedPaymentMethod = null;
                document.querySelectorAll('.payment-method').forEach(method => {
                    method.classList.remove('selected');
                });
                
                // Enable/disable tombol konfirmasi berdasarkan pemilihan metode
                updateConfirmButtonState();
                
                // Render item di keranjang
                renderCartItems();
            }
            
            // Update total harga
            updateTotalPrice();
        }
        
        // Render item di keranjang
        function renderCartItems() {
            // Hapus semua item cart-item yang ada
            const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
            existingItems.forEach(item => {
                item.remove();
            });
            
            // Jika keranjang kosong, keluar dari fungsi
            if (cart.length === 0) {
                return;
            }
            
            // Tambahkan item baru
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.setAttribute('data-id', item.variantId);
                
                cartItem.innerHTML = `
                    <img src="${item.image || item.baseImage || 'default.png'}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-variant">${item.variantName}</div>
                        <div class="cart-item-price">${formatRupiah(item.price)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Tambahkan event listener untuk kontrol kuantitas
            attachCartEventListeners();
        }
        
        // Fungsi untuk menambahkan event listener ke item keranjang
        function attachCartEventListeners() {
            // Event listener untuk tombol tambah
            document.querySelectorAll('.increase').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const cartItem = this.closest('.cart-item');
                    const variantId = cartItem.getAttribute('data-id');
                    increaseQuantity(variantId);
                });
            });
            
            // Event listener untuk tombol kurang
            document.querySelectorAll('.decrease').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const cartItem = this.closest('.cart-item');
                    const variantId = cartItem.getAttribute('data-id');
                    decreaseQuantity(variantId);
                });
            });
            
            // Event listener untuk tombol hapus
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const cartItem = this.closest('.cart-item');
                    const variantId = cartItem.getAttribute('data-id');
                    removeItem(variantId);
                });
            });
        }
        
        // Update total harga
        function updateTotalPrice() {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalPrice.textContent = formatRupiah(total);
        }
        
        // Tambah jumlah item
        function increaseQuantity(variantId) {
            const item = cart.find(item => item.variantId === variantId);
            if (item) {
                item.quantity += 1;
                localStorage.setItem('takistore_cart', JSON.stringify(cart));
                updateCart();
            }
        }
        
        // Kurangi jumlah item
        function decreaseQuantity(variantId) {
            const item = cart.find(item => item.variantId === variantId);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    // Jika jumlah menjadi 0, hapus item dari keranjang
                    cart = cart.filter(cartItem => cartItem.variantId !== variantId);
                }
                localStorage.setItem('takistore_cart', JSON.stringify(cart));
                updateCart();
            }
        }
        
        // Hapus item dari keranjang
        function removeItem(variantId) {
            cart = cart.filter(item => item.variantId !== variantId);
            localStorage.setItem('takistore_cart', JSON.stringify(cart));
            updateCart();
        }
        
        // Fungsi untuk memilih metode pembayaran
        function selectPaymentMethod(method) {
            // Hapus seleksi dari semua metode
            document.querySelectorAll('.payment-method').forEach(method => {
                method.classList.remove('selected');
            });
            
            // Tambah seleksi ke metode yang dipilih
            const selectedElement = document.querySelector(`[data-method="${method}"]`);
            selectedElement.classList.add('selected');
            
            // Simpan metode yang dipilih
            selectedPaymentMethod = method;
            
            // Sembunyikan pesan error
            paymentError.style.display = 'none';
            
            // Update state tombol konfirmasi
            updateConfirmButtonState();
        }
        
        // Update state tombol konfirmasi berdasarkan kondisi
        function updateConfirmButtonState() {
            if (cart.length === 0) {
                confirmBtn.disabled = true;
            } else if (selectedPaymentMethod) {
                confirmBtn.disabled = false;
            } else {
                confirmBtn.disabled = true;
            }
        }
        
        // Generate pesan untuk WhatsApp sesuai format yang diminta
        function generateWhatsAppMessage() {
            let message = `Halo, saya ingin membeli aplikasi premium dari TakiStore:\n\n`;
            
            cart.forEach(item => {
                message += `Barang: ${item.name} - ${item.variantName}\n`;
                message += `Jumlah: ${item.quantity}\n`;
                message += `Subtotal: ${formatRupiah(item.price * item.quantity)}\n\n`;
            });
            
            // Hitung total semua barang
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            message += `Total: ${formatRupiah(total)}\n`;
            message += `Metode Pembayaran: ${selectedPaymentMethod === 'dana' ? 'DANA' : 'QRIS'}`;
            
            return encodeURIComponent(message);
        }
        
        // Generate ringkasan pesanan untuk modal
        function generateOrderSummary() {
            let summary = '';
            
            cart.forEach(item => {
                summary += `
                    <div class="order-item">
                        <div>
                            <div><strong>${item.name}</strong></div>
                            <div style="font-size: 0.85rem; color: var(--gray);">${item.variantName}</div>
                            <div style="font-size: 0.9rem; color: var(--gray);">${item.quantity} x ${formatRupiah(item.price)}</div>
                        </div>
                        <div>${formatRupiah(item.price * item.quantity)}</div>
                    </div>
                `;
            });
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Tambahkan metode pembayaran di ringkasan
            let paymentMethodText = '';
            if (selectedPaymentMethod === 'dana') {
                paymentMethodText = 'DANA';
            } else if (selectedPaymentMethod === 'qris') {
                paymentMethodText = 'QRIS';
            }
            
            summary += `
                <div class="order-item">
                    <div><strong>Metode Pembayaran</strong></div>
                    <div>${paymentMethodText}</div>
                </div>
                <div class="order-total">
                    <span>Total</span>
                    <span>${formatRupiah(total)}</span>
                </div>
            `;
            
            return summary;
        }
        
        // Buka keranjang
        function openCart() {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Tutup keranjang
        function closeCart() {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Buka modal
        function openModal() {
            orderModal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Tutup modal
        function closeModalFunc() {
            orderModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Validasi sebelum konfirmasi
        function validateBeforeConfirm() {
            if (cart.length === 0) {
                alert('Keranjang belanja kosong! Tambahkan produk terlebih dahulu.');
                return false;
            }
            
            if (!selectedPaymentMethod) {
                // Tampilkan pesan error
                paymentError.style.display = 'block';
                
                // Scroll ke bagian pembayaran
                paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Animasi error
                paymentSection.style.animation = 'none';
                setTimeout(() => {
                    paymentSection.style.animation = 'shake 0.5s ease-in-out';
                }, 10);
                
                return false;
            }
            
            return true;
        }
        
        // Inisialisasi aplikasi
        function init() {
            // Set viewport height untuk mobile
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', setViewportHeight);
            
            renderProducts();
            updateCart();
            
            // Event listener untuk metode pembayaran
            document.querySelectorAll('.payment-method').forEach(method => {
                method.addEventListener('click', function() {
                    const methodName = this.getAttribute('data-method');
                    selectPaymentMethod(methodName);
                });
            });
            
            // Event listener untuk kontrol quantity di modal varian
            decreaseQty.addEventListener('click', () => {
                if (variantQuantity > 1) {
                    variantQuantity--;
                    variantQty.textContent = variantQuantity;
                }
            });
            
            increaseQty.addEventListener('click', () => {
                variantQuantity++;
                variantQty.textContent = variantQuantity;
            });
            
            // Event listener untuk tombol tambah ke keranjang di modal varian
            addVariantToCart.addEventListener('click', addVariantToCartFunc);
            
            // Event listener untuk tutup modal varian
            closeVariant.addEventListener('click', closeVariantModal);
            
            // Event listener untuk overlay
            overlay.addEventListener('click', () => {
                closeCart();
                closeModalFunc();
                closeVariantModal();
            });
            
            // Event listener untuk keranjang
            openCartBtn.addEventListener('click', openCart);
            closeCartBtn.addEventListener('click', closeCart);
            
            // Event listener untuk tombol konfirmasi
            confirmBtn.addEventListener('click', () => {
                // Validasi sebelum konfirmasi
                if (!validateBeforeConfirm()) {
                    return;
                }
                
                // Nomor WhatsApp Anda
                const phoneNumber = "6287716817586";
                const message = generateWhatsAppMessage();
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                
                // Buka WhatsApp di tab baru
                window.open(whatsappUrl, '_blank');
                
                // Tampilkan modal konfirmasi
                orderSummary.innerHTML = generateOrderSummary();
                openModal();
                
                // Kosongkan keranjang
                cart = [];
                localStorage.setItem('takistore_cart', JSON.stringify(cart));
                updateCart();
                
                // Reset metode pembayaran
                selectedPaymentMethod = null;
                document.querySelectorAll('.payment-method').forEach(method => {
                    method.classList.remove('selected');
                });
                
                // Tutup keranjang
                setTimeout(() => {
                    closeCart();
                }, 1000);
            });
            
            // Event listener untuk tutup modal
            closeModal.addEventListener('click', closeModalFunc);
            
            // Tambahkan animasi shake untuk error
            const style = document.createElement('style');
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Jalankan aplikasi saat halaman dimuat
        document.addEventListener('DOMContentLoaded', init);
