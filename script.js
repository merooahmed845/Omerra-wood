// ============================================
// سعر الشحن
// ============================================
const SHIPPING_COST = 70.00;

// ============================================
// رابط Google Sheets API (غيّره لرابطك)
// ============================================
// ⚠️ ضع رابطك هنا
const API_URL = 'https://script.google.com/macros/s/AKfycbziDNWMRmiHYvm6vIG2FQTnwKi4r-jNtWmFxOE1s53LkS2-QR4KoxX15mZxLADQEFxZ3w/exec';

// ============================================
// 1. بيانات المنتجات (تتحمّل من Google Sheets)
// ============================================
let products = [];

// ============================================
// جلب المنتجات من Google Sheets
// ============================================
async function loadProducts() {
    try {
        showNotification('🔄 جاري تحميل المنتجات...');
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        console.log('📦 Response from API:', result);
        
        if (result.success && result.data && result.data.length > 0) {
            products = result.data;
            renderProducts();
            renderFeaturedProducts();
            updateCategoryCounts();
            showNotification('✅ تم تحميل ' + products.length + ' منتج من Google Sheets!');
            console.log('✅ تم تحميل المنتجات من Google Sheets:', products.length);
        } else {
            throw new Error(result.error || 'لا توجد منتجات في قاعدة البيانات');
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
        showNotification('⚠️ حدث خطأ في تحميل المنتجات. جارٍ استخدام البيانات المحلية.');
        // استخدام البيانات المحلية كـ Backup
        products = getLocalProducts();
        renderProducts();
        renderFeaturedProducts();
        updateCategoryCounts();
        console.log('📦 استخدام البيانات المحلية:', products.length);
    }
}

// ============================================
// البيانات المحلية (Backup)
// ============================================
function getLocalProducts() {
    return [
        {
            id: 1,
            name: 'شمعدان خشبي فاخر',
            description: 'شمعدان من خشب الزان الطبيعي بتصميم أنيق، ارتفاع 25 سم',
            price: 45.00,
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop'
        },
        {
            id: 2,
            name: 'صينية تقديم خشبية',
            description: 'صينية تقديم مستديرة من خشب الجوز، قطر 40 سم',
            price: 65.00,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            name: 'ديكور حائط خشبي 3D',
            description: 'لوحة حائط خشبية بتصميم هندسي ثلاثي الأبعاد، 60x60 سم',
            price: 85.00,
            image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&h=300&fit=crop'
        },
        {
            id: 4,
            name: 'صندوق مجوهرات خشبي',
            description: 'صندوق خشبي منحوت يدوياً مع مرآة داخلية، 20x15x10 سم',
            price: 55.00,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
            id: 5,
            name: 'شمعدان ثلاثي خشبي',
            description: 'شمعدان ثلاثي الأذرع من خشب البلوط، ارتفاع 35 سم',
            price: 75.00,
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop'
        },
        {
            id: 6,
            name: 'طبق تقديم خشبي كبير',
            description: 'طبق تقديم بيضاوي من خشب الزان، طول 50 سم',
            price: 70.00,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
            id: 7,
            name: 'طقم أدوات مائدة خشبي',
            description: 'طقم كامل من خشب الزان يتضمن 6 قطع (شوكة، سكين، ملعقة)',
            price: 120.00,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
            id: 8,
            name: 'مرآة خشبية مزخرفة',
            description: 'مرآة حائط بإطار خشبي منحوت يدوياً، قطر 50 سم',
            price: 95.00,
            image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&h=300&fit=crop'
        },
        {
            id: 9,
            name: 'علبة مناديل خشبية فاخرة',
            description: 'علبة مناديل من خشب الجوز بتصميم أنيق، مقاس 25x15 سم',
            price: 40.00,
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop'
        }
    ];
}

// ============================================
// تحديث أعداد المنتجات في كل فئة
// ============================================
function updateCategoryCounts() {
    const categories = ['شمعدان', 'صينية', 'ديكور', 'طقم'];
    
    categories.forEach(category => {
        const count = products.filter(p => {
            const searchText = (p.name + ' ' + (p.description || '') + ' ' + (p.category || '')).toLowerCase();
            return searchText.includes(category.toLowerCase());
        }).length;
        const element = document.getElementById(`count-${category}`);
        if (element) element.textContent = count;
    });
    
    const totalCount = document.getElementById('count-all');
    if (totalCount) totalCount.textContent = products.length;
}

// ============================================
// نظام الكوبونات
// ============================================
const coupons = {
    'WELCOME10': { discount: 10, message: '🎉 خصم 10% على أول طلب!' },
    'SUMMER20': { discount: 20, message: '☀️ خصم 20% على الطلبات الصيفية!' },
    'WOOD15': { discount: 15, message: '🌳 خصم 15% على المنتجات الخشبية!' },
    'FREESHIP': { discount: 0, message: '🚚 شحن مجاني!' }
};

let appliedCoupon = null;

function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    
    if (!code) {
        showNotification('⚠️ يرجى إدخال كود الخصم');
        return;
    }
    
    if (coupons[code]) {
        appliedCoupon = coupons[code];
        document.getElementById('couponMessage').textContent = appliedCoupon.message;
        document.getElementById('couponMessage').style.color = '#27ae60';
        updateOrderSummary();
        showNotification('✅ تم تطبيق الخصم بنجاح!');
    } else {
        showNotification('❌ كود خصم غير صحيح');
        document.getElementById('couponMessage').textContent = '❌ كود غير صحيح';
        document.getElementById('couponMessage').style.color = '#e74c3c';
    }
}

function getShippingCost() {
    if (appliedCoupon && appliedCoupon.message.includes('شحن مجاني')) {
        return 0;
    }
    return SHIPPING_COST;
}

// ============================================
// 3. إدارة عربة التسوق
// ============================================
let cart = [];

function loadCart() {
    const saved = localStorage.getItem('woodenCart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
            updateCartUI();
        } catch(e) {
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem('woodenCart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification('✅ تم إضافة المنتج للعربة!');
    
    document.querySelector('.cart-icon').classList.add('pop');
    setTimeout(() => {
        document.querySelector('.cart-icon').classList.remove('pop');
    }, 300);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    if (cart.length === 0) {
        document.getElementById('cartItems').innerHTML = '<p class="empty-cart">🛒 العربة فارغة</p>';
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('⚠️ العربة فارغة بالفعل!');
        return;
    }
    
    if (confirm('⚠️ هل أنت متأكد من رغبتك في مسح جميع المنتجات من العربة؟')) {
        cart = [];
        saveCart();
        showNotification('🗑️ تم مسح العربة بنجاح');
    }
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id == productId);
    if (!item) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
}

function getTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return subtotal + getShippingCost();
}

function getSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ============================================
// 4. عرض المنتجات
// ============================================
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 50px; color: #8B5E3C;"></i>
                <h3 style="color: #999; margin-top: 20px;">جاري تحميل المنتجات...</h3>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-price">${parseFloat(product.price).toFixed(2)} <span>ج.م</span></div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-plus-circle"></i> أضف للعربة
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// عرض المنتجات المميزة
// ============================================
function renderFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    if (products.length === 0) return;
    
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 4);
    
    grid.innerHTML = featured.map(product => `
        <div class="product-card" style="animation-delay: 0s;">
            <img src="${product.image}" alt="${product.name}" class="product-image" style="height: 180px;">
            <div class="product-info" style="padding: 12px;">
                <h3 class="product-name" style="font-size: 14px;">${product.name}</h3>
                <div class="product-price" style="font-size: 18px;">${parseFloat(product.price).toFixed(2)} <span>ج.م</span></div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" style="font-size: 13px; padding: 8px;">
                    <i class="fas fa-plus-circle"></i> أضف للعربة
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// تصفية المنتجات
// ============================================
let currentFilter = 'all';

function filterProducts(category) {
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = '#8B5E3C';
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent.includes(getCategoryLabel(category))) {
            btn.style.background = '#8B5E3C';
            btn.style.color = 'white';
        } else if (category === 'all' && btn.textContent.includes('الكل')) {
            btn.style.background = '#8B5E3C';
            btn.style.color = 'white';
        }
    });
    
    const grid = document.getElementById('productGrid');
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => {
            const searchText = (product.name + ' ' + (product.description || '') + ' ' + (product.category || '')).toLowerCase();
            return searchText.includes(category.toLowerCase());
        });
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search" style="font-size: 50px; color: #ccc;"></i>
                <h3 style="color: #999; margin-top: 20px;">لا توجد منتجات في هذا القسم</h3>
            </div>
        `;
    } else {
        grid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-price">${parseFloat(product.price).toFixed(2)} <span>ج.م</span></div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus-circle"></i> أضف للعربة
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function getCategoryLabel(category) {
    const labels = {
        'all': 'الكل',
        'شمعدان': 'شمعدانات',
        'صينية': 'صواني',
        'ديكور': 'ديكورات',
        'طقم': 'طواقم'
    };
    return labels[category] || category;
}

// ============================================
// البحث عن المنتجات
// ============================================
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const grid = document.getElementById('productGrid');
    
    if (searchTerm === '') {
        renderProducts();
        return;
    }
    
    const filtered = products.filter(product => 
        (product.name || '').toLowerCase().includes(searchTerm) || 
        (product.description || '').toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search" style="font-size: 50px; color: #ccc;"></i>
                <h3 style="color: #999; margin-top: 20px;">لا توجد نتائج لـ "${searchTerm}"</h3>
                <p style="color: #bbb;">جرب كلمات بحث أخرى</p>
            </div>
        `;
    } else {
        grid.innerHTML = filtered.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-price">${parseFloat(product.price).toFixed(2)} <span>ج.م</span></div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus-circle"></i> أضف للعربة
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// ============================================
// 5. تحديث واجهة العربة
// ============================================
function updateCartUI() {
    document.getElementById('cartCount').textContent = getTotalItems();
    
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">🛒 العربة فارغة</p>';
        cartTotal.textContent = '0.00 ج.م';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)} ج.م</div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <span class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</span>
                </div>
            </div>
        </div>
    `).join('');
    
    const subtotal = getSubtotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;
    
    cartTotal.innerHTML = `
        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">
            المجموع الفرعي: ${subtotal.toFixed(2)} ج.م
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">
            الشحن: ${shipping.toFixed(2)} ج.م
        </div>
        <div style="border-top: 2px solid #8B5E3C; padding-top: 10px; margin-top: 5px;">
            الإجمالي: ${total.toFixed(2)} ج.م
        </div>
    `;
}

// ============================================
// 6. التحكم في العربة والمودالات
// ============================================
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function showCheckoutForm() {
    if (cart.length === 0) {
        alert('⚠️ عربة التسوق فارغة! أضف بعض المنتجات أولاً.');
        return;
    }
    toggleCart();
    document.getElementById('checkoutModal').classList.add('active');
    updateOrderSummary();
}

function closeCheckoutForm() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    cart = [];
    saveCart();
}

// ============================================
// 7. عرض ملخص الطلب
// ============================================
function updateOrderSummary() {
    const summary = document.getElementById('orderSummary');
    const itemsHtml = cart.map(item => `
        <div class="order-summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)} ج.م</span>
        </div>
    `).join('');
    
    const subtotal = getSubtotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;
    
    let discountHtml = '';
    let discountAmount = 0;
    
    if (appliedCoupon && appliedCoupon.discount > 0) {
        discountAmount = subtotal * appliedCoupon.discount / 100;
        discountHtml = `
            <div class="order-summary-item" style="border-bottom: 1px dashed #ddd; padding: 8px 0; color: #27ae60;">
                <span>🎉 خصم (${appliedCoupon.discount}%)</span>
                <span>- ${discountAmount.toFixed(2)} ج.م</span>
            </div>
        `;
    }
    
    const finalTotal = subtotal + shipping - discountAmount;
    
    summary.innerHTML = `
        <h4>📋 ملخص الطلب</h4>
        ${itemsHtml}
        <div class="order-summary-item" style="border-bottom: 1px dashed #ddd; padding: 8px 0;">
            <span>المجموع الفرعي</span>
            <span>${subtotal.toFixed(2)} ج.م</span>
        </div>
        <div class="order-summary-item" style="border-bottom: 1px dashed #ddd; padding: 8px 0;">
            <span>🚚 رسوم الشحن</span>
            <span>${shipping.toFixed(2)} ج.م</span>
        </div>
        ${discountHtml}
        <div class="order-summary-total">
            <span>💰 الإجمالي الكلي</span>
            <span>${finalTotal.toFixed(2)} ج.م</span>
        </div>
        <div class="coupon-section" style="margin-top: 15px; padding: 15px; background: #f0ebe6; border-radius: 8px;">
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <input type="text" id="couponInput" placeholder="أدخل كود الخصم" 
                       style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; min-width: 150px;">
                <button onclick="applyCoupon()" style="padding: 10px 20px; background: #8B5E3C; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-ticket"></i> تطبيق
                </button>
            </div>
            <div id="couponMessage" style="margin-top: 10px; font-size: 14px; font-weight: 600;"></div>
        </div>
    `;
}

// ============================================
// 8. إرسال الطلب إلى Google Sheets
// ============================================
async function submitOrder(event) {
    event.preventDefault();
    
    const submitBtn = document.querySelector('.submit-order-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    
    try {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        const notes = document.getElementById('customerNotes').value.trim() || 'لا يوجد';
        
        if (!name || !phone || !address) {
            alert('⚠️ يرجى تعبئة جميع الحقول المطلوبة');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
            return;
        }
        
        // حساب المجاميع
        const subtotal = getSubtotal();
        const shipping = getShippingCost();
        let total = subtotal + shipping;
        let discountAmount = 0;
        let couponCode = null;
        
        if (appliedCoupon) {
            if (appliedCoupon.discount > 0) {
                discountAmount = subtotal * appliedCoupon.discount / 100;
                total = total - discountAmount;
            }
            couponCode = Object.keys(coupons).find(key => coupons[key] === appliedCoupon);
        }
        
        // إرسال الطلب إلى Google Sheets
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                address: address,
                notes: notes,
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal: subtotal,
                shipping: shipping,
                discount: discountAmount,
                total: total,
                coupon: couponCode || 'لا يوجد',
                orderDate: new Date().toLocaleString('ar-EG', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            })
        });
        
        const result = await response.json();
        console.log('📥 رد الخادم:', result);
        
        if (result.success) {
            closeCheckoutForm();
            document.getElementById('successModal').classList.add('active');
            document.getElementById('checkoutForm').reset();
            cart = [];
            saveCart();
            appliedCoupon = null;
            showNotification('✅ تم إرسال طلبك بنجاح!');
        } else {
            throw new Error(result.error || 'فشل حفظ الطلب');
        }
        
    } catch (error) {
        console.error('❌ خطأ:', error);
        alert(`⚠️ حدث خطأ أثناء إرسال الطلب:\n${error.message}\n\nيرجى المحاولة مرة أخرى.`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
    }
}

// ============================================
// 9. إشعارات منبثقة
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2C1810;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideUp 0.3s ease;
        direction: rtl;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// 10. أزرار المشاركة الاجتماعية
// ============================================
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('🛍️ اكتشف منتجات خشبية فاخرة في متجر Omera Wood!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('🛍️ اكتشف منتجات خشبية فاخرة في متجر Omera Wood!');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('🛍️ اكتشف منتجات خشبية فاخرة في متجر Omera Wood!');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnInstagram() {
    const instagramUsername = 'marwanaelsayed';
    window.open(`https://www.instagram.com/${instagramUsername}/`, '_blank');
    showNotification('📱 تابعنا على إنستغرام!');
}

// ============================================
// 11. سياسة الخصوصية وشروط الاستخدام
// ============================================
function showPrivacyPolicy() {
    alert(`🔒 سياسة الخصوصية

نحن في Omera Wood نلتزم بحماية خصوصية عملائنا.

📌 المعلومات التي نجمعها:
- الاسم
- رقم الهاتف
- العنوان

📌 كيف نستخدمها:
- لتأكيد الطلبات
- لتوصيل المنتجات
- للتواصل معك

📌 نحن لا نشارك بياناتك مع أي طرف ثالث.

للتواصل: merooahmed845@gmail.com`);
}

function showTerms() {
    alert(`📋 شروط الاستخدام

1️⃣ جميع المنتجات مصنوعة يدوياً وقد تختلف التفاصيل البسيطة
2️⃣ يتم تأكيد الطلب بعد التواصل مع العميل
3️⃣ الدفع عند الاستلام
4️⃣ يمكن إلغاء الطلب خلال 24 ساعة
5️⃣ سياسة الاستبدال خلال 7 أيام من الاستلام

للتواصل: merooahmed845@gmail.com`);
}

function showContact() {
    alert(`📞 اتصل بنا

📧 البريد الإلكتروني: merooahmed845@gmail.com
📱 واتساب: 01050240321

ساعات العمل:
🕐 من 10 صباحاً إلى 10 مساءً
📅 طوال أيام الأسبوع`);
}

// ============================================
// 12. زر العودة للأعلى
// ============================================
window.addEventListener('scroll', function() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// 13. تحميل الصفحة (معدل)
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 بدء تحميل الموقع...');
    
    // 1. تحميل المنتجات من Google Sheets
    await loadProducts();
    
    // 2. تحميل العربة من localStorage
    loadCart();
    
    // 3. عرض المنتجات المميزة
    renderFeaturedProducts();
    
    // 4. إغلاق المودال عند الضغط خارج المحتوى
    document.getElementById('checkoutModal').addEventListener('click', function(e) {
        if (e.target === this) closeCheckoutForm();
    });
    
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) closeSuccessModal();
    });
    
    console.log('✅ موقع Omera Wood جاهز للعمل!');
    console.log('📦 عدد المنتجات:', products.length);
});

// جعل الدوال متاحة في Console
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.showCheckoutForm = showCheckoutForm;
window.submitOrder = submitOrder;
window.clearCart = clearCart;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.applyCoupon = applyCoupon;
window.shareOnFacebook = shareOnFacebook;
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareOnTwitter = shareOnTwitter;
window.shareOnInstagram = shareOnInstagram;
window.showPrivacyPolicy = showPrivacyPolicy;
window.showTerms = showTerms;
window.showContact = showContact;
window.scrollToTop = scrollToTop;