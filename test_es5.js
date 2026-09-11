// ============================================
// FoodX POS PRO - Multiple Client Rows System
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // App State
    var state = {
        currentPage: 'new-order',
        serviceType: 'salon',
        selectedCategory: 'all',
        searchQuery: '',
        cart: [],
        clients: [],
        activeClient: null,
        orderTotal: 0,
        categoryData: {},
        rowCounter: 0,
        isAdminAuthenticated: false,
        pendingAdminAction: null,
        pendingAdminPage: null,
        appendingOrderId: null,
        selectedPaymentMethod: 'efectivo',
        editingNoteItemId: null
    };

    // Listen for config loaded from cloud
    window.addEventListener('configLoadedFromCloud', function() {
        console.log('???? Config loaded from cloud, refreshing UI...');
        renderPosCategories();
        renderPosProducts();
        renderPosCart();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    function initializeCategories() {
        renderPosCategories();
        renderPosProducts();
        renderPosCart();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // DOM Elements
    var elements = {
        menuBtn: document.getElementById('menuBtn'),
        navDrawer: document.getElementById('navDrawer'),
        drawerOverlay: document.getElementById('drawerOverlay'),
        closeDrawer: document.getElementById('closeDrawer'),
        drawerItems: document.querySelectorAll('.drawer-item'),
        pages: document.querySelectorAll('.page'),
        serviceTabs: document.querySelectorAll('.service-tab'),
        categorySections: document.querySelectorAll('.category-section'),
        totalAmount: document.getElementById('totalAmount'),
        sendToKitchenBtn: document.getElementById('sendToKitchenBtn'),
        btnAddClient: document.getElementById('btnAddClient'),
        posClientsTabs: document.getElementById('posClientsTabs'),
        posProductSearch: document.getElementById('posProductSearch'),
        posClearSearch: document.getElementById('posClearSearch'),
        posCategoriesBar: document.getElementById('posCategoriesBar'),
        posProductsGrid: document.getElementById('posProductsGrid'),
        posClearCartBtn: document.getElementById('posClearCartBtn'),
        posSubmitOrderBtn: document.getElementById('posSubmitOrderBtn'),
        itemNoteModal: document.getElementById('itemNoteModal'),
        closeItemNoteModal: document.getElementById('closeItemNoteModal'),
        closeItemNoteOverlay: document.getElementById('closeItemNoteOverlay'),
        cancelItemNoteModal: document.getElementById('cancelItemNoteModal'),
        saveItemNoteModal: document.getElementById('saveItemNoteModal'),
        // Checkout / Payment
        toPrintCount: document.getElementById('toPrintCount'),
        pendingPaymentCount: document.getElementById('pendingPaymentCount'),
        paidOrdersCount: document.getElementById('paidOrdersCount'),
        toPrintList: document.getElementById('toPrintList'),
        pendingPaymentList: document.getElementById('pendingPaymentList'),
        paidOrdersList: document.getElementById('paidOrdersList'),
        paymentModal: document.getElementById('paymentModal'),
        paymentModalOverlay: document.getElementById('paymentModalOverlay'),
        paymentOrderNum: document.getElementById('paymentOrderNum'),
        paymentTicketContent: document.getElementById('paymentTicketContent'),
        paymentTotal: document.getElementById('paymentTotal'),
        printPaymentTicket: document.getElementById('printPaymentTicket'),
        cancelPayment: document.getElementById('cancelPayment'),
        confirmPayment: document.getElementById('confirmPayment'),
        invoicePaymentTicket: document.getElementById('invoicePaymentTicket'),
        deleteOrderBtn: document.getElementById('deleteOrderBtn'),
        // Ticket Modal
        ticketModal: document.getElementById('ticketModal'),
        ticketContent: document.getElementById('ticketContent'),
        cancelTicket: document.getElementById('cancelTicket'),
        cancelTicketFooter: document.getElementById('cancelTicketFooter'),
        closeTicketModal: document.getElementById('closeTicketModal'),
        printTicket: document.getElementById('printTicket'),
        confirmTicket: document.getElementById('confirmTicket'),
        // Admin
        adminTabs: document.querySelectorAll('.admin-tab'),
        adminPanels: document.querySelectorAll('.admin-panel'),
        adminCategoriesList: document.getElementById('adminCategoriesList'),
        adminCategorySelectFlavors: document.getElementById('adminCategorySelectFlavors'),
        adminCategorySelectExtras: document.getElementById('adminCategorySelectExtras'),
        adminCategorySelectObs: document.getElementById('adminCategorySelectObs'),
        adminFlavorsList: document.getElementById('adminFlavorsList'),
        adminExtrasList: document.getElementById('adminExtrasList'),
        adminObsList: document.getElementById('adminObsList'),
        adminModal: document.getElementById('adminModal'),
        adminModalTitle: document.getElementById('adminModalTitle'),
        adminModalBody: document.getElementById('adminModalBody'),
        cancelAdminModal: document.getElementById('cancelAdminModal'),
        confirmAdminModal: document.getElementById('confirmAdminModal'),
        addCategoryBtn: document.getElementById('addCategoryBtn'),
        addFlavorBtn: document.getElementById('addFlavorBtn'),
        addExtraBtn: document.getElementById('addExtraBtn'),
        addObsBtn: document.getElementById('addObsBtn'),
        // History
        historyTabs: document.querySelectorAll('.history-tab'),
        datePickerContainer: document.getElementById('datePickerContainer'),
        historyDatePicker: document.getElementById('historyDatePicker'),
        searchDateBtn: document.getElementById('searchDateBtn'),
        historyOrdersList: document.getElementById('historyOrdersList'),
        historyOrderModal: document.getElementById('historyOrderModal'),
        historyModalOverlay: document.getElementById('historyModalOverlay'),
        historyOrderDetail: document.getElementById('historyOrderDetail'),
        historyTicketContent: document.getElementById('historyTicketContent'),
        backToHistoryBtn: document.getElementById('backToHistoryBtn'),
        reprintOrderBtn: document.getElementById('reprintOrderBtn'),
        invoiceOrderBtn: document.getElementById('invoiceOrderBtn'),
        deleteOrderBtnHistory: document.getElementById('deleteOrderBtnHistory'),
        // Reports
        reportDatePicker: document.getElementById('reportDatePicker'),
        reportPeriodSelect: document.getElementById('reportPeriodSelect'),
        reportDatePickerGroup: document.getElementById('reportDatePickerGroup'),
        reportMonthPicker: document.getElementById('reportMonthPicker'),
        reportMonthPickerGroup: document.getElementById('reportMonthPickerGroup'),
        searchReportBtn: document.getElementById('searchReportBtn'),
        reportDailySales: document.getElementById('reportDailySales'),
        reportFoodSales: document.getElementById('reportFoodSales'),
        reportBebidasSales: document.getElementById('reportBebidasSales'),
        reportDesechablesSales: document.getElementById('reportDesechablesSales'),
        reportEfectivoSales: document.getElementById('reportEfectivoSales'),
        reportNequiSales: document.getElementById('reportNequiSales'),
        reportDaviplataSales: document.getElementById('reportDaviplataSales'),
        // Admin Security
        adminLoginModal: document.getElementById('adminLoginModal'),
        adminPasswordInput: document.getElementById('adminPasswordInput'),
        confirmAdminLogin: document.getElementById('confirmAdminLogin'),
        closeAdminLoginModal: document.getElementById('closeAdminLoginModal'),
        newAdminPassword: document.getElementById('newAdminPassword'),
        confirmAdminPassword: document.getElementById('confirmAdminPassword'),
        saveAdminPasswordBtn: document.getElementById('saveAdminPasswordBtn'),
        // History Summary
        historyTotalSales: document.getElementById('historyTotalSales'),
        historyTotalEfectivo: document.getElementById('historyTotalEfectivo'),
        historyTotalNequi: document.getElementById('historyTotalNequi'),
        historyTotalDaviplata: document.getElementById('historyTotalDaviplata'),
        historyTotalFood: document.getElementById('historyTotalFood'),
        historyTotalBebidas: document.getElementById('historyTotalBebidas'),
        historyTotalDesechables: document.getElementById('historyTotalDesechables'),
        // Detailed Reports
        categorySalesList: document.getElementById('categorySalesList'),
        extrasSalesList: document.getElementById('extrasSalesList'),
        flavorSalesList: document.getElementById('flavorSalesList'),
        sizeSalesList: document.getElementById('sizeSalesList'),
        categoryQtyList: document.getElementById('categoryQtyList'),
        // Report Detail Modal
        reportDetailModal: document.getElementById('reportDetailModal'),
        reportDetailList: document.getElementById('reportDetailList'),
        reportDetailTitle: document.getElementById('reportDetailTitle'),
        closeReportDetailModal: document.getElementById('closeReportDetailModal'),
        closeReportDetailModalOverlay: document.getElementById('closeReportDetailModalOverlay'),
        downloadReportBtn: document.getElementById('downloadReportBtn'),
        expenseSearchInput: document.getElementById('expenseSearchInput'),
    };

    var currentReportOrders = [];
    var lastSalesBreakdown = {};

    // ============================================
    // Navigation Drawer
    // ============================================

    if (elements.menuBtn) {
        elements.menuBtn.addEventListener('click', function() {
            elements.navDrawer.classList.add('open');
        });
    }

    if (elements.closeDrawer) {
        elements.closeDrawer.addEventListener('click', function() {
            elements.navDrawer.classList.remove('open');
        });
    }

    if (elements.drawerOverlay) {
        elements.drawerOverlay.addEventListener('click', function() {
            elements.navDrawer.classList.remove('open');
        });
    }

    elements.drawerItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            var page = item.dataset.page;

            // Protection for Admin, History, and Reports pages
            var protectedPages = ['admin', 'history', 'reports', 'expenses'];
            if (protectedPages.includes(page) && !state.isAdminAuthenticated) {
                if (elements.adminLoginModal) {
                    elements.adminLoginModal.classList.add('open');
                    elements.adminPasswordInput.value = '';
                    elements.adminPasswordInput.focus();
                    elements.navDrawer.classList.remove('open');
                    // Store the intended page for after login
                    state.pendingAdminPage = page;
                }
                return;
            }

            elements.drawerItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            elements.pages.forEach(p => p.classList.remove('active'));
            var targetPage = document.getElementById(`page-${page}`);
            if (targetPage) targetPage.classList.add('active');

            state.currentPage = page;
            elements.navDrawer.classList.remove('open');

            // Show/Hide footer based on page
            var appFooter = document.getElementById('appFooter');
            if (appFooter) {
                appFooter.style.display = (page === 'new-order') ? 'flex' : 'none';
            }

            if (page === 'kitchen') {
                renderKitchenPage();
            } else if (page === 'checkout') {
                renderCheckoutPage();
            } else if (page === 'orders') {
                renderOrdersPage();
            } else if (page === 'history') {
                renderHistoryPage();
            } else if (page === 'reports') {
                // Initialize report date to today
                if (elements.reportDatePicker && !elements.reportDatePicker.value) {
                    elements.reportDatePicker.value = new Date().toISOString().split('T')[0];
                }
                renderReportsPage();
            } else if (page === 'expenses') {
                renderExpensesPage();
            } else if (page === 'admin') {
                renderAdminPage();
            } else if (page === 'new-order') {
                state.appendingOrderId = null; // Clear if navigating manually to new order
                initializeCategories();
                refreshOrderPageUI();
            }

            // Remove flag if already redirected
            if (page === 'admin') state.pendingAdminRedirect = false;

            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    });

    function refreshOrderPageUI() {
        renderPosCategories();
        renderPosProducts();
        renderPosCart();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================
    // Multi-Sector POS Order Taking Engine
    // ============================================

    // Service Tabs Setup
    function setupServiceTabs() {
        document.querySelectorAll('.service-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
                var service = tab.dataset.service;
                state.serviceType = service;
                document.querySelectorAll(`.service-tab[data-service="${service}"]`).forEach(t => t.classList.add('active'));
            });
        });
    }
    setupServiceTabs();

    // Search Input Setup
    if (elements.posProductSearch) {
        elements.posProductSearch.addEventListener('input', function(e) {
            state.searchQuery = e.target.value.trim();
            if (elements.posClearSearch) {
                elements.posClearSearch.classList.toggle('hidden', state.searchQuery === '');
            }
            renderPosProducts();
        });
    }

    if (elements.posClearSearch) {
        elements.posClearSearch.addEventListener('click', function() {
            if (elements.posProductSearch) elements.posProductSearch.value = '';
            state.searchQuery = '';
            elements.posClearSearch.classList.add('hidden');
            renderPosProducts();
            if (elements.posProductSearch) elements.posProductSearch.focus();
        });
    }

    // Get Active Products from Config or Fallback
    function getActiveProductsList(config) {
        if (config.products && config.products.length > 0) {
            return config.products.filter(p => p.active !== false);
        }
        var list = [];
        Object.keys(config.flavors || {}).forEach(function(catId) {
            (config.flavors[catId] || []).forEach(function(f) {
                if (f.active !== false) {
                    list.push({
                        id: f.id,
                        name: f.name,
                        price: f.price || 0,
                        category: catId,
                        icon: '????',
                        active: true
                    });
                }
            });
        });
        return list;
    }

    // Render Categories Filter Chips
    function renderPosCategories() {
        var container = elements.posCategoriesBar || document.getElementById('posCategoriesBar');
        if (!container) return;

        var config = StorageManager.getConfig();
        var allProducts = getActiveProductsList(config);
        var totalCount = allProducts.length;

        var html = `
            <button type="button" class="pos-cat-chip ${state.selectedCategory === 'all' ? 'active' : ''}" data-cat="all">
                <span>Todos</span>
                <span class="pos-cat-chip-count">${totalCount}</span>
            </button>
        `;

        config.categories.forEach(function(cat) {
            var count = allProducts.filter(p => p.category === cat.id).length;
            var isActive = state.selectedCategory === cat.id ? 'active' : '';
            html += `
                <button type="button" class="pos-cat-chip ${isActive}" data-cat="${cat.id}">
                    <span>${cat.name}</span>
                    <span class="pos-cat-chip-count">${count}</span>
                </button>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.pos-cat-chip').forEach(function(btn) {
            btn.addEventListener('click', function() {
                state.selectedCategory = btn.dataset.cat;
                renderPosCategories();
                renderPosProducts();
            });
        });
    }

    // Render Products Grid
    function renderPosProducts() {
        var grid = document.getElementById('posProductsGrid');
        var catalogCol = document.getElementById('posCatalogColumn');
        var workspace = document.querySelector('.pos-workspace');
        
        if (!grid) return;

        if (!state.activeClient) {
            if (catalogCol) catalogCol.style.display = 'none';
            if (workspace) workspace.classList.add('no-catalog');
            return;
        }

        if (catalogCol) catalogCol.style.display = 'flex';
        if (workspace) workspace.classList.remove('no-catalog');

        var config = StorageManager.getConfig();
        var products = getActiveProductsList(config);

        if (state.selectedCategory !== 'all') {
            products = products.filter(p => p.category === state.selectedCategory);
        }

        if (state.searchQuery && state.searchQuery.trim() !== '') {
            var q = state.searchQuery.toLowerCase().trim();
            products = products.filter(p => p.name.toLowerCase().includes(q));
        }

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="pos-empty-cart" style="grid-column: 1 / -1; min-height: 220px;">
                    <i data-lucide="package-x"></i>
                    <h4>No se encontraron productos</h4>
                    <p>Prueba con otra b??squeda o selecciona otra categor??a</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        grid.innerHTML = products.map(function(p) {
            var inCartItem = state.cart.find(item => item.productId === p.id);
            var inCartBadge = inCartItem ? `<span class="pos-card-badge">${inCartItem.qty} en orden</span>` : '';
            var catInfo = config.categories.find(c => c.id === p.category);
            var catName = catInfo ? catInfo.name : p.category;

            return `
                <div class="pos-product-card" data-product-id="${p.id}">
                    ${inCartBadge}
                    <div>
                        <div class="pos-card-name">${p.name}</div>
                        <div class="pos-card-cat">${catName}</div>
                    </div>
                    <div class="pos-card-footer">
                        <span class="pos-card-price">${formatPrice(p.price || 0)}</span>
                        <button type="button" class="pos-card-add-btn" title="Agregar">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.pos-product-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var prodId = card.dataset.productId;
                var prod = products.find(p => p.id === prodId);
                if (prod) {
                    addToCart(prod);
                }
            });
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Add to Cart
    function addToCart(product, qty = 1) {
        if (!state.activeClient) {
            showNotification('Primero agrega o selecciona un cliente', 'error');
            return;
        }

        var existing = state.cart.find(item => item.productId === product.id && (!item.notes || item.notes === '') && item.clientName === state.activeClient);
        if (existing) {
            existing.qty += qty;
            existing.subtotal = existing.qty * existing.unitPrice;
        } else {
            state.cart.push({
                id: generateId(),
                productId: product.id,
                name: product.name,
                category: product.category,
                unitPrice: product.price || 0,
                qty: qty,
                notes: '',
                extras: [],
                subtotal: (product.price || 0) * qty,
                clientName: state.activeClient
            });
        }

        if (navigator.vibrate) navigator.vibrate(25);
        renderPosCart();
        renderPosProducts();
    }

    // Update Cart Item Quantity
    function updateCartItemQty(cartItemId, delta) {
        var item = state.cart.find(i => i.id === cartItemId);
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) {
            state.cart = state.cart.filter(i => i.id !== cartItemId);
        } else {
            item.subtotal = item.qty * item.unitPrice;
        }

        renderPosCart();
        renderPosProducts();
    }

    // Remove Item from Cart
    function removeCartItem(cartItemId) {
        state.cart = state.cart.filter(i => i.id !== cartItemId);
        renderPosCart();
        renderPosProducts();
    }

    // Clear Cart
    function clearPosCart(confirmClear = false) {
        if (confirmClear && state.cart.length > 0) {
            if (!confirm('??Deseas vaciar todos los productos del pedido?')) return;
        }
        state.cart = [];
        state.clients = [];
        state.activeClient = null;
        state.appendingOrderId = null;
        updateSubmitButtonText();
        renderClientsTabs();
        renderPosCart();
        renderPosProducts();
    }

    function updateSubmitButtonText() {
        var btnText = document.getElementById('posSubmitBtnText');
        if (!btnText) return;
        if (state.appendingOrderId) {
            var orig = StorageManager.getOrders().find(o => o.id == state.appendingOrderId);
            btnText.textContent = `A??ADIR A ${orig ? orig.orderNumber : 'ORDEN'}`;
        } else {
            btnText.textContent = 'ENVIAR A COCINA';
        }
    }

    // Render Cart
    function renderPosCart() {
        var emptyState = document.getElementById('posEmptyCart');
        var listContainer = document.getElementById('posCartItemsList');
        var totalQtyEl = document.getElementById('posTotalQty');
        var grandTotalEl = document.getElementById('posGrandTotal');
        var totalAmountFooter = elements.totalAmount || document.getElementById('totalAmount');

        var totalQty = 0;
        var grandTotal = 0;

        state.cart.forEach(function(item) {
            totalQty += item.qty;
            grandTotal += item.subtotal;
        });

        state.orderTotal = grandTotal;

        if (totalQtyEl) totalQtyEl.textContent = `${totalQty} uds`;
        if (grandTotalEl) grandTotalEl.textContent = formatPrice(grandTotal);
        if (totalAmountFooter) totalAmountFooter.textContent = formatPrice(grandTotal);

        if (!listContainer || !emptyState) return;

        if (state.cart.length === 0) {
            emptyState.style.display = 'flex';
            listContainer.innerHTML = '';
            return;
        }

        emptyState.style.display = 'none';

        var clientsObj = {};
        state.clients.forEach(c => clientsObj[c] = []);
        state.cart.forEach(function(item) {
            if (!clientsObj[item.clientName]) clientsObj[item.clientName] = [];
            clientsObj[item.clientName].push(item);
        });

        var html = '';
        for (var [clientName, items] of Object.entries(clientsObj)) {
            if (items.length === 0) continue;
            
            html += `
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-gold); padding: 12px 0 4px; border-bottom: 1px solid var(--border-subtle); margin-top: 8px; text-transform: uppercase;">
                    <i data-lucide="user" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;"></i> Cliente: ${clientName}
                </div>
            `;

            html += items.map(item => `
                <div class="pos-cart-item" data-cart-item-id="${item.id}">
                    <div class="pos-cart-item-top">
                        <div style="flex: 1;">
                            <div class="pos-cart-item-name">${item.name}</div>
                            <div class="pos-cart-item-unit-price">${formatPrice(item.unitPrice)} c/u</div>
                            ${item.notes ? `<div class="pos-cart-item-note"><i data-lucide="message-square" style="width: 10px; height: 10px; display: inline; vertical-align: middle;"></i> ${item.notes}</div>` : ''}
                        </div>
                        <div class="pos-cart-item-actions">
                            <button type="button" class="pos-item-action-btn" title="Agregar nota" onclick="window.openItemNoteModal('${item.id}')">
                                <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                            </button>
                            <button type="button" class="pos-item-action-btn delete" title="Eliminar" onclick="window.removeCartItem('${item.id}')">
                                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                            </button>
                        </div>
                    </div>
                    <div class="pos-cart-item-bottom">
                        <div class="pos-cart-stepper">
                            <button type="button" class="pos-stepper-btn" onclick="window.updateCartItemQty('${item.id}', -1)">
                                <i data-lucide="minus" style="width: 14px; height: 14px;"></i>
                            </button>
                            <span class="pos-stepper-qty">${item.qty}</span>
                            <button type="button" class="pos-stepper-btn" onclick="window.updateCartItemQty('${item.id}', 1)">
                                <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                            </button>
                        </div>
                        <div class="pos-cart-item-subtotal">${formatPrice(item.subtotal)}</div>
                    </div>
                </div>
            `).join('');
        }

        listContainer.innerHTML = html;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderClientsTabs() {
        var tabsContainer = elements.posClientsTabs || document.getElementById('posClientsTabs');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = state.clients.map(clientName => `
            <div class="pos-client-tab ${state.activeClient === clientName ? 'active' : ''}" data-client="${clientName}">
                ${clientName}
            </div>
        `).join('');

        tabsContainer.querySelectorAll('.pos-client-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                state.activeClient = tab.dataset.client;
                renderClientsTabs();
                renderPosProducts();
            });
        });
    }

    if (elements.btnAddClient || document.getElementById('btnAddClient')) {
        var btn = elements.btnAddClient || document.getElementById('btnAddClient');
        btn.addEventListener('click', function() {
            var defaultName = 'Cliente ' + (state.clients.length + 1);
            var clientName = prompt('Nombre del cliente:', defaultName);
            if (clientName && clientName.trim() !== '') {
                var name = clientName.trim().toUpperCase();
                if (!state.clients.includes(name)) {
                    state.clients.push(name);
                }
                state.activeClient = name;
                renderClientsTabs();
                renderPosProducts();
                renderPosCart();
            }
        });
    }

    // Expose Cart methods to window for inline onclick handlers
    window.addToCart = addToCart;
    window.updateCartItemQty = updateCartItemQty;
    window.removeCartItem = removeCartItem;
    window.clearPosCart = clearPosCart;

    // Item Note Modal Logic
    window.openItemNoteModal = function (cartItemId) {
        var item = state.cart.find(i => i.id === cartItemId);
        if (!item) return;
        state.editingNoteItemId = cartItemId;

        var modal = elements.itemNoteModal || document.getElementById('itemNoteModal');
        var prodNameEl = document.getElementById('itemNoteModalProductName');
        var inputEl = document.getElementById('itemNoteModalInput');
        var tagsContainer = document.getElementById('itemNoteQuickTags');

        if (prodNameEl) prodNameEl.textContent = `${item.qty}x ${item.name}`;
        if (inputEl) inputEl.value = item.notes || '';

        if (tagsContainer) {
            var config = StorageManager.getConfig();
            var obs = (config.observations && config.observations[item.category]) || [];
            tagsContainer.innerHTML = obs.map(o => `
                <span class="quick-obs-chip" onclick="window.appendQuickTag('${o.name}')">${o.name}</span>
            `).join('');
        }

        if (modal) modal.classList.add('open');
        if (inputEl) inputEl.focus();
    };

    window.appendQuickTag = function (tagName) {
        var inputEl = document.getElementById('itemNoteModalInput');
        if (!inputEl) return;
        if (inputEl.value.trim() === '') {
            inputEl.value = tagName;
        } else {
            inputEl.value += ', ' + tagName;
        }
    };

    function saveItemNoteModal() {
        if (!state.editingNoteItemId) return;
        var item = state.cart.find(i => i.id === state.editingNoteItemId);
        var inputEl = document.getElementById('itemNoteModalInput');
        if (item && inputEl) {
            item.notes = inputEl.value.trim();
        }
        var modal = elements.itemNoteModal || document.getElementById('itemNoteModal');
        if (modal) modal.classList.remove('open');
        state.editingNoteItemId = null;
        renderPosCart();
    }

    function closeItemNoteModalFunc() {
        var modal = elements.itemNoteModal || document.getElementById('itemNoteModal');
        if (modal) modal.classList.remove('open');
        state.editingNoteItemId = null;
    }

    if (elements.closeItemNoteModal) elements.closeItemNoteModal.addEventListener('click', closeItemNoteModalFunc);
    if (elements.closeItemNoteOverlay) elements.closeItemNoteOverlay.addEventListener('click', closeItemNoteModalFunc);
    if (elements.cancelItemNoteModal) elements.cancelItemNoteModal.addEventListener('click', closeItemNoteModalFunc);
    if (elements.saveItemNoteModal) elements.saveItemNoteModal.addEventListener('click', saveItemNoteModal);

    // Wire Clear Cart Button
    if (elements.posClearCartBtn) {
        elements.posClearCartBtn.addEventListener('click', () => clearPosCart(true));
    }

    // Submit Order (Send to Kitchen & Create Ticket)
    var pendingOrder = null;

    function submitOrder() {
        if (state.cart.length === 0) {
            showNotification('?????? Agrega productos al pedido antes de enviar', 'error');
            return;
        }

        var customerText = state.clients.join(' - ').trim().toUpperCase();

        if (!state.serviceType) state.serviceType = 'salon';

        if (!state.appendingOrderId && state.clients.length === 0) {
            showNotification('?????? Ingresa al menos un cliente en la orden', 'error');
            return;
        }

        var submitBtn = elements.posSubmitOrderBtn || elements.sendToKitchenBtn || document.getElementById('posSubmitOrderBtn');
        var origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Enviando...';
            submitBtn.disabled = true;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        try {
            var config = StorageManager.getConfig();
            var items = state.cart.map(function(i) {
                var catInfo = config.categories.find(c => c.id === i.category);
                return {
                    id: i.id,
                    productId: i.productId,
                    name: i.name,
                    category: i.category,
                    categoryName: catInfo ? catInfo.name : i.category,
                    unitPrice: i.unitPrice,
                    qty: i.qty,
                    notes: i.notes,
                    observations: i.notes,
                    extras: i.extras || [],
                    price: i.subtotal,
                    clientName: i.clientName
                };
            });

            if (state.appendingOrderId) {
                var originalOrder = StorageManager.getOrders().find(o => o.id == state.appendingOrderId);
                if (originalOrder) {
                    var updatedItems = [...originalOrder.items, ...items];
                    var updatedTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0);
                    StorageManager.updateOrder(originalOrder.id, {
                        items: updatedItems,
                        totalPrice: updatedTotalPrice
                    });

                    // Create partial order for printing
                    var partialOrder = {
                        orderNumber: `${originalOrder.orderNumber} (ADI)`,
                        sequenceNumber: originalOrder.sequenceNumber,
                        serviceType: state.serviceType,
                        customerInfo: originalOrder.customerInfo,
                        createdAt: new Date().toISOString(),
                        items: items,
                        totalPrice: items.reduce((s, i) => s + i.price, 0),
                        isAppending: true,
                        isPartial: true,
                        checkoutPrinted: false,
                        paid: false
                    };
                    StorageManager.addOrder(partialOrder);
                    showNotification(`Adici??n agregada al pedido ${originalOrder.orderNumber}`);
                }
                state.appendingOrderId = null;
            } else {
                var seqNum = generateOrderNumber();
                var orderIdentifier = customerText || seqNum;

                var newOrder = {
                    orderNumber: orderIdentifier,
                    sequenceNumber: seqNum,
                    serviceType: state.serviceType,
                    customerInfo: customerText,
                    customerName: customerText,
                    items: items,
                    status: 'pending',
                    totalPrice: state.orderTotal,
                    createdBy: 'Cajero 1',
                    needsPrint: true,
                    printed: false,
                    checkoutPrinted: false,
                    isAppending: false,
                    createdAt: new Date().toISOString()
                };

                StorageManager.addOrder(newOrder);
                showNotification(`??? Pedido ${newOrder.orderNumber} enviado a cocina`);
                showTicketModal(newOrder);
            }

            clearPosCart(false);
        } catch (err) {
            console.error('Error submitting order:', err);
            showNotification('?????? Error al procesar pedido', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = origText;
                submitBtn.disabled = false;
                updateSubmitButtonText();
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    }

    if (elements.posSubmitOrderBtn) elements.posSubmitOrderBtn.addEventListener('click', submitOrder);
    if (elements.sendToKitchenBtn) elements.sendToKitchenBtn.addEventListener('click', submitOrder);

    // Initial render of POS workspace
    renderPosCategories();
    renderPosProducts();
    renderPosCart();

    function showTicketModal(order) {
        if (!elements.ticketModal) return;
        elements.ticketContent.innerHTML = generateTicketText(order);
        elements.ticketModal.classList.add('open');
    }

    function closeTicketModal() {
        if (elements.ticketModal) {
            elements.ticketModal.classList.remove('open');
            pendingOrder = null;
        }
    }

    if (elements.cancelTicket) elements.cancelTicket.addEventListener('click', closeTicketModal);
    if (elements.cancelTicketFooter) elements.cancelTicketFooter.addEventListener('click', closeTicketModal);
    if (elements.closeTicketModal) elements.closeTicketModal.addEventListener('click', closeTicketModal);

    if (elements.printTicket) {
        elements.printTicket.addEventListener('click', function() {
            if (pendingOrder) {
                if (pendingOrder.isAppending) {
                    var originalOrder = StorageManager.getOrders().find(o => o.id == pendingOrder.id);
                    if (originalOrder) {
                        var updatedItems = [...originalOrder.items, ...pendingOrder.newItems];
                        var updatedTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0);
                        StorageManager.updateOrder(pendingOrder.id, {
                            items: updatedItems,
                            totalPrice: updatedTotalPrice,
                            checkoutPrinted: false
                        });
                    }
                    state.appendingOrderId = null;
                } else {
                    pendingOrder.printed = true;
                    StorageManager.addOrder(pendingOrder);
                }
                window.print();
                showNotification(`Pedido ${pendingOrder.orderNumber} impreso y enviado`);
                closeTicketModal();
                resetAllCategories();
            }
        });
    }

    if (elements.confirmTicket) {
        elements.confirmTicket.addEventListener('click', function() {
            if (pendingOrder) {
                if (pendingOrder.isAppending) {
                    var originalOrder = StorageManager.getOrders().find(o => o.id == pendingOrder.id);
                    if (originalOrder) {
                        var updatedItems = [...originalOrder.items, ...pendingOrder.newItems];
                        var updatedTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0);
                        StorageManager.updateOrder(pendingOrder.id, {
                            items: updatedItems,
                            totalPrice: updatedTotalPrice,
                            checkoutPrinted: false
                        });
                    }
                    state.appendingOrderId = null;
                } else {
                    StorageManager.addOrder(pendingOrder);
                }
                showNotification(`Pedido ${pendingOrder.orderNumber} enviado a cocina`);
                closeTicketModal();
                resetAllCategories();
            }
        });
    }

    function resetAllCategories() {
        Object.keys(state.categoryData).forEach(function(category) {
            state.categoryData[category].rows = [];
            var section = document.querySelector(`.category-section[data-category="${category}"]`);
            if (section) {
                var container = section.querySelector('.category-rows-container');
                container.innerHTML = '';

                // Reset category total to $0
                var priceEl = section.querySelector('.category-total-price');
                if (priceEl) {
                    priceEl.textContent = '$0';
                    priceEl.dataset.value = '0';
                }
            }
        });

        // Reset Service Type
        state.serviceType = 'salon';
        elements.serviceTabs.forEach(function(tab) {
            tab.classList.remove('active');
            if (tab.dataset.service === 'salon') tab.classList.add('active');
        });

        // Reset order total
        state.orderTotal = 0;
        updateOrderTotal();



    // ============================================
    // Checkout / Payment
    // ============================================

    var checkoutMode = 'to-print';
    var selectedPaymentOrder = null;

    function renderCheckoutPage() {
        var orders = StorageManager.getOrders();

        // Filter logic:
        // to-print: Not paid AND NOT printed for checkout
        // pending: Not paid AND printed for checkout
        // paid: Paid
        var today = new Date().toDateString();
        var toPrint = orders.filter(o => !o.paid && !o.checkoutPrinted);
        var pending = orders.filter(o => !o.paid && o.checkoutPrinted);
        var paid = orders.filter(o => o.paid && new Date(o.createdAt).toDateString() === today);

        if (elements.toPrintCount) elements.toPrintCount.textContent = toPrint.length;
        if (elements.pendingPaymentCount) elements.pendingPaymentCount.textContent = pending.length;
        if (elements.paidOrdersCount) elements.paidOrdersCount.textContent = paid.length;

        if (elements.toPrintList) elements.toPrintList.innerHTML = toPrint.reverse().map(o => createCheckoutCard(o)).join('');
        if (elements.pendingPaymentList) elements.pendingPaymentList.innerHTML = pending.reverse().map(o => createCheckoutCard(o)).join('');
        if (elements.paidOrdersList) elements.paidOrdersList.innerHTML = paid.reverse().map(o => createCheckoutCard(o)).join('');

        // Visibility toggle
        var lists = {
            'to-print': elements.toPrintList,
            'pending': elements.pendingPaymentList,
            'paid': elements.paidOrdersList
        };

        Object.keys(lists).forEach(function(mode) {
            if (lists[mode]) {
                if (mode === checkoutMode) {
                    lists[mode].classList.remove('hidden');
                } else {
                    lists[mode].classList.add('hidden');
                }
            }
        });

        document.querySelectorAll('.order-list-card[data-order-id]').forEach(function(card) {
            card.addEventListener('click', function() {
                openPaymentModal(card.dataset.orderId);
            });
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================
    // Kitchen (KDS)
    // ============================================

    function renderKitchenPage() {
        var orders = StorageManager.getActiveOrders();

        var pending = orders.filter(o => o.status === 'pending');
        var preparing = orders.filter(o => o.status === 'preparing');
        var ready = orders.filter(o => o.status === 'ready');

        var updateColumn = function(listId, countId, items, action) {
            var list = document.getElementById(listId);
            var count = document.getElementById(countId);
            if (count) count.textContent = items.length;
            if (list) {
                list.innerHTML = items.map(o => `
                    <div class="kitchen-card">
                        <div class="kitchen-card-header">
                            <span class="kitchen-order-number">${o.orderNumber} ${o.sequenceNumber && o.sequenceNumber !== o.orderNumber ? `(${o.sequenceNumber})` : ''}</span>
                            <span class="kitchen-time">${o.customerInfo}</span>
                        </div>
                        <div class="kitchen-items">
                            ${(function() {
                                var kItemsByClient = {};
                                o.items.forEach(function(item) {
                                    var cName = item.clientName || 'CLIENTE';
                                    if (!kItemsByClient[cName]) kItemsByClient[cName] = [];
                                    kItemsByClient[cName].push(item);
                                });
                                return Object.entries(kItemsByClient).map(([cName, cItems]) => `
                                    <div style="font-size: 0.85rem; font-weight: bold; color: var(--accent-gold); margin: 6px 0 2px 0;">
                                        Cliente: ${cName}
                                    </div>
                                    ${cItems.map(item => `
                                        <div class="k-item">
                                            <strong>${item.qty}x</strong> ${item.name || item.categoryName} ${item.size ? item.size : ''}
                                            ${item.notes ? `<div style="font-size:0.8rem; color:#f0c040; margin-left:14px;">* ${item.notes}</div>` : ''}
                                            ${item.extras && item.extras.length > 0 ? `<div style="font-size:0.8rem; color:#4ecdc4; margin-left:14px;">+ ${(Array.isArray(item.extras) ? item.extras.map(e => typeof e === 'object' ? e.name : e).join(', ') : item.extras)}</div>` : ''}
                                        </div>
                                    `).join('')}
                                `).join('');
                            })()}
                        </div>
                        <button class="k-action-btn" onclick="window.advanceOrder('${o.id}')">${action}</button>
                    </div>
                `).join('');
            }
        };

        updateColumn('listPending', 'countPending', pending, 'EMPEZAR');
        updateColumn('listPreparing', 'countPreparing', preparing, 'LISTO');
        updateColumn('listReady', 'countReady', ready, 'ENTREGAR');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    window.advanceOrder = function (id) {
        var orders = StorageManager.getOrders();
        var order = orders.find(o => o.id === id);
        if (!order) return;

        var nextStatus = {
            'pending': 'preparing',
            'preparing': 'ready',
            'ready': 'delivered'
        };

        var newStatus = nextStatus[order.status];
        if (newStatus) {
            StorageManager.updateOrder(id, { status: newStatus });
            renderKitchenPage();
            showNotification(`Orden ${order.orderNumber} movida a ${newStatus}`);
        }
    };

    function createCheckoutCard(order) {
        var labels = { pending: 'Pendiente', preparing: 'Preparando', ready: 'Listo', delivered: 'Entregado' };
        return `
            <div class="order-list-card ${order.paid ? 'paid' : ''}" data-order-id="${order.id}">
                <div class="order-card-header">
                    <span class="order-number">${order.orderNumber} ${order.sequenceNumber && order.sequenceNumber !== order.orderNumber ? `(${order.sequenceNumber})` : ''}</span>
                    <span class="order-status-badge">${order.paid ? 'Pagado' : labels[order.status]}</span>
                </div>
                <div class="order-customer-info">
                    <span class="order-time">${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span> - ${order.customerInfo}</span>
                </div>
                <div class="order-items-preview">
                    ${order.items.map(item => `
                        <div class="preview-item">
                            <div class="item-main">
                                <span class="preview-qty">${item.qty}</span>
                                <span class="preview-name">${item.name || item.categoryName} ${item.notes ? '(' + item.notes + ')' : ''} ${item.extras && item.extras.length > 0 ? '+ ' + (Array.isArray(item.extras) ? item.extras.map(e => typeof e === 'object' ? e.name : e).join(', ') : item.extras) : ''}</span>
                            </div>
                            <span class="item-price">${formatPrice(item.price || (item.unitPrice * item.qty))}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-card-footer">
                    <div style="display: flex; gap: var(--space-sm); align-items: center;">
                        <span class="order-total">${formatPrice(order.totalPrice)}</span>
                        ${!order.paid ? `
                            <button class="btn-append-items" onclick="event.stopPropagation(); window.appendToOrder('${order.id}')" 
                                style="background: var(--accent-primary); color: white; border: none; padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i data-lucide="plus" style="width: 14px; height: 14px;"></i> A??ADIR
                            </button>
                        ` : ''}
                    </div>
                    ${order.paid ? `
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span class="status-indicator" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); font-size: 0.75rem; padding: 2px 8px; border-radius: 999px;">
                                ${(order.paymentMethod || 'EFECTIVO').toUpperCase()}
                            </span>
                            <span class="status-indicator paid-chip">PAGADO</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    window.appendToOrder = function (orderId) {
        var order = StorageManager.getOrders().find(o => o.id == orderId);
        if (!order) return;

        state.appendingOrderId = orderId;
        state.serviceType = order.serviceType;

        // Reset UI to "New Order" page
        state.currentPage = 'new-order';
        elements.pages.forEach(p => p.classList.remove('active'));
        var targetPage = document.getElementById('page-new-order');
        if (targetPage) targetPage.classList.add('active');

        // Update drawer state
        elements.drawerItems.forEach(i => i.classList.remove('active'));
        var newOrderTab = Array.from(elements.drawerItems).find(i => i.dataset.page === 'new-order');
        if (newOrderTab) newOrderTab.classList.add('active');

        // Initialize/Clear category rows
        resetAllCategories(); // Ensure we start with a clean UI
        initializeCategories();

        state.serviceType = order.serviceType;

        // Update Service Tabs to match order
        elements.serviceTabs.forEach(function(tab) {
            tab.classList.toggle('active', tab.dataset.service === order.serviceType);
        });

        // Show Footer
        var appFooter = document.getElementById('appFooter');
        if (appFooter) appFooter.style.display = 'flex';



        showNotification(`A??adiendo productos a la Orden ${order.orderNumber}`);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    function openPaymentModal(orderId) {
        var order = StorageManager.getOrders().find(o => o.id == orderId);
        if (!order || !elements.paymentModal) return;

        selectedPaymentOrder = order;
        elements.paymentOrderNum.textContent = order.orderNumber;
        elements.paymentTotal.textContent = formatPrice(order.totalPrice);
        elements.paymentTicketContent.innerHTML = generateTicketText(order);

        var modalTitle = elements.paymentModal.querySelector('h3');

        // Button visibility logic
        if (order.paid) {
            modalTitle.textContent = 'Pedido Pagado - Detalle';
            elements.confirmPayment.style.display = 'none';
            elements.printPaymentTicket.style.display = 'flex'; // Allow re-print
            if (elements.deleteOrderBtn) elements.deleteOrderBtn.style.display = 'flex';
        } else if (!order.checkoutPrinted) {
            modalTitle.textContent = 'Imprimir Ticket de Cobro';
            elements.confirmPayment.style.display = 'none';
            elements.printPaymentTicket.style.display = 'flex';
            if (elements.deleteOrderBtn) elements.deleteOrderBtn.style.display = 'flex';
        } else {
            modalTitle.textContent = 'Cobrar Pedido';
            elements.confirmPayment.style.display = 'flex';
            elements.printPaymentTicket.style.display = 'flex'; // Allow re-print even if in pending
            if (elements.deleteOrderBtn) elements.deleteOrderBtn.style.display = 'flex';
        }

        // Factura button visibility
        if (elements.invoicePaymentTicket) {
            // Only show Factura in "Por Cobrar" (printed) or "Pagadas" (paid)
            if (order.paid || order.checkoutPrinted) {
                elements.invoicePaymentTicket.style.display = 'flex';
            } else {
                elements.invoicePaymentTicket.style.display = 'none';
            }
        }



        // Reset Payment Method Logic (Radio Buttons)
        var radios = document.querySelectorAll('input[name="paymentMethod"]');
        radios.forEach(r => r.checked = false);
        state.selectedPaymentMethod = null; // Clear state just in case, though we read DOM now.

        // Show/Hide method selector based on payment status
        var methodContainer = document.querySelector('.payment-methods-container');
        if (methodContainer) {
            methodContainer.style.display = elements.confirmPayment.style.display === 'none' ? 'none' : 'block';
        }

        // Hide combined payment panel
        var combinedPanel = document.getElementById('combinedPaymentPanel');
        if (combinedPanel) {
            combinedPanel.style.display = 'none';
            document.getElementById('combinedEfectivo').value = '';
            document.getElementById('combinedNequi').value = '';
            document.getElementById('combinedDaviplata').value = '';
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
        elements.paymentModal.classList.remove('hidden');
    }



    document.querySelectorAll('.checkout-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.checkout-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            checkoutMode = tab.dataset.tab;
            renderCheckoutPage();
        });
    });

    if (elements.cancelPayment) {
        elements.cancelPayment.addEventListener('click', function() {
            elements.paymentModal.classList.add('hidden');
            selectedPaymentOrder = null;
        });
    }

    if (elements.paymentModalOverlay) {
        elements.paymentModalOverlay.addEventListener('click', function() {
            elements.paymentModal.classList.add('hidden');
            selectedPaymentOrder = null;
        });
    }

    // Floating Dropdown Logic (Mimics native select)
    function openFloatingDropdown(trigger, title, options, currentIds, onUpdate) {
        // Close any existing
        closeFloatingDropdown();

        var rect = trigger.getBoundingClientRect();

        var dropdown = document.createElement('div');
        dropdown.className = 'floating-dropdown';
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 2}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${rect.width}px`;
        dropdown.style.minWidth = '200px';
        dropdown.style.maxHeight = '300px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.background = 'var(--bg-card)';
        dropdown.style.border = '1px solid var(--border-default)';
        dropdown.style.borderRadius = 'var(--radius-sm)';
        dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        dropdown.style.zIndex = '9999';
        dropdown.style.padding = '4px';
        dropdown.id = 'activeFloatingDropdown';

        // Header for context?
        // Optional: Add a title row
        // var header = document.createElement('div');
        // header.textContent = title; ...

        var tempSelected = [...currentIds];

        options.filter(o => o.active !== false).forEach(function(opt) {
            var row = document.createElement('div');
            row.className = 'selection-option';
            row.style.padding = '8px';
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.cursor = 'pointer';
            row.style.gap = '8px';

            if (tempSelected.includes(opt.id)) {
                row.style.background = 'var(--bg-secondary)';
                row.style.color = 'var(--accent-primary)';
            }

            row.innerHTML = `
                <input type="checkbox" ${tempSelected.includes(opt.id) ? 'checked' : ''} style="pointer-events:none;">
                <span>${opt.name}</span>
            `;

            row.addEventListener('click', function(e) {
                e.stopPropagation();
                var input = row.querySelector('input');
                // Toggle
                var isChecked = !input.checked;
                input.checked = isChecked;

                if (isChecked) {
                    if (!tempSelected.includes(opt.id)) tempSelected.push(opt.id);
                    row.style.background = 'var(--bg-secondary)';
                    row.style.color = 'var(--accent-primary)';
                } else {
                    var idx = tempSelected.indexOf(opt.id);
                    if (idx > -1) tempSelected.splice(idx, 1);
                    row.style.background = 'transparent';
                    row.style.color = 'var(--text-primary)';
                }
                onUpdate(tempSelected);
            });
            dropdown.appendChild(row);
        });

        // Adjust position if offscreen
        document.body.appendChild(dropdown);
        var dropRect = dropdown.getBoundingClientRect();
        if (dropRect.bottom > window.innerHeight) {
            dropdown.style.top = `${rect.top - dropRect.height - 2}px`;
        }
        if (dropRect.right > window.innerWidth) {
            dropdown.style.left = `${window.innerWidth - dropRect.width - 10}px`;
        }

        // Click outside closes
        setTimeout(function() {
            document.addEventListener('click', closeOnOutsideClick);
        }, 0);
    }

    function closeFloatingDropdown() {
        var existing = document.getElementById('activeFloatingDropdown');
        if (existing) existing.remove();
        document.removeEventListener('click', closeOnOutsideClick);
    }

    function closeOnOutsideClick(e) {
        if (!e.target.closest('#activeFloatingDropdown')) {
            closeFloatingDropdown();
        }
    }

    if (elements.confirmPayment) {
        elements.confirmPayment.addEventListener('click', function() {
            if (selectedPaymentOrder) {
                // Get selected radio
                var selectedRadio = document.querySelector('input[name="paymentMethod"]:checked');

                if (!selectedRadio) {
                    showNotification('?????? Selecciona un medio de pago', 'error');
                    return;
                }

                var method = selectedRadio.value;
                var paymentDetails = null;

                // Handle combined payment
                if (method === 'combinado') {
                    var efectivo = parseFloat(document.getElementById('combinedEfectivo').value) || 0;
                    var nequi = parseFloat(document.getElementById('combinedNequi').value) || 0;
                    var daviplata = parseFloat(document.getElementById('combinedDaviplata').value) || 0;
                    var total = efectivo + nequi + daviplata;

                    if (total < selectedPaymentOrder.totalPrice) {
                        showNotification(`?????? Faltan $${formatPrice(selectedPaymentOrder.totalPrice - total).replace('$', '')} para completar el pago`, 'error');
                        return;
                    }

                    paymentDetails = {
                        efectivo: efectivo,
                        nequi: nequi,
                        daviplata: daviplata,
                        total: total
                    };
                }

                // Open cash drawer if printer is connected
                if (window.openCashDrawer) {
                    window.openCashDrawer();
                }

                StorageManager.updateOrder(selectedPaymentOrder.id, {
                    paid: true,
                    status: 'delivered',
                    paymentMethod: method,
                    paymentDetails: paymentDetails
                });
                showNotification(`Pedido ${selectedPaymentOrder.orderNumber} pagado`);
                elements.paymentModal.classList.add('hidden');
                renderCheckoutPage();
            }
        });
    }

    // Combined payment panel toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(function(radio) {
        radio.addEventListener('change', function(e) {
            var panel = document.getElementById('combinedPaymentPanel');
            if (panel) {
                panel.style.display = e.target.value === 'combinado' ? 'block' : 'none';
                if (e.target.value === 'combinado') {
                    // Pre-fill with total in efectivo
                    var totalEl = document.getElementById('paymentTotal');
                    if (totalEl && selectedPaymentOrder) {
                        document.getElementById('combinedEfectivo').value = selectedPaymentOrder.totalPrice;
                        document.getElementById('combinedNequi').value = '';
                        document.getElementById('combinedDaviplata').value = '';
                        updateCombinedTotal();
                    }
                }
            }
        });
    });

    // Update combined total display
    function updateCombinedTotal() {
        var efectivo = parseFloat(document.getElementById('combinedEfectivo').value) || 0;
        var nequi = parseFloat(document.getElementById('combinedNequi').value) || 0;
        var daviplata = parseFloat(document.getElementById('combinedDaviplata').value) || 0;
        var total = efectivo + nequi + daviplata;
        var totalEl = document.getElementById('combinedTotal');
        if (totalEl && selectedPaymentOrder) {
            var diff = total - selectedPaymentOrder.totalPrice;
            if (diff >= 0) {
                totalEl.innerHTML = `??? Total: ${formatPrice(total)}`;
                totalEl.style.color = '#059669';
            } else {
                totalEl.innerHTML = `Faltan: ${formatPrice(Math.abs(diff))}`;
                totalEl.style.color = '#dc2626';
            }
        }
    }

    // Bind combined payment inputs
    ['combinedEfectivo', 'combinedNequi', 'combinedDaviplata'].forEach(function(id) {
        var input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateCombinedTotal);
        }
    });

    // Print button in payment modal
    if (elements.printPaymentTicket) {
        elements.printPaymentTicket.addEventListener('click', function() {
            if (selectedPaymentOrder) {
                // Show Printing Dialog
                window.print();

                if (selectedPaymentOrder.isPartial) {
                    // If it's a partial order (addition), delete it after printing
                    StorageManager.deleteOrder(selectedPaymentOrder.id);
                    showNotification(`Ticket de adici??n impreso`);
                } else {
                    // Normal order: Set as printed for checkout
                    StorageManager.updateOrder(selectedPaymentOrder.id, { checkoutPrinted: true });
                    showNotification(`Pedido ${selectedPaymentOrder.orderNumber} enviado a cobrar`);
                }

                // Refresh and close
                elements.paymentModal.classList.add('hidden');
                renderCheckoutPage();
            }
        });
    }

    if (elements.invoicePaymentTicket) {
        elements.invoicePaymentTicket.addEventListener('click', function() {
            if (selectedPaymentOrder) {
                var originalContent = elements.paymentTicketContent.innerHTML;
                elements.paymentTicketContent.innerHTML = generateInvoiceText(selectedPaymentOrder);
                window.print();
                elements.paymentTicketContent.innerHTML = originalContent; // Revert to comanda
                showNotification(`Factura de pedido ${selectedPaymentOrder.orderNumber} generada`);
            }
        });
    }

    if (elements.deleteOrderBtn) {
        elements.deleteOrderBtn.addEventListener('click', function() {
            if (!selectedPaymentOrder) return;

            var performDelete = function() {
                if (confirm(`??Est??s seguro de que deseas eliminar permanentemente el pedido ${selectedPaymentOrder.orderNumber}?`)) {
                    StorageManager.deleteOrder(selectedPaymentOrder.id);
                    showNotification(`Pedido ${selectedPaymentOrder.orderNumber} eliminado`);
                    elements.paymentModal.classList.add('hidden');
                    renderCheckoutPage();
                }
            };

            if (state.isAdminAuthenticated) {
                performDelete();
            } else {
                state.pendingAdminAction = performDelete;
                elements.adminLoginModal.classList.add('open');
                elements.adminPasswordInput.value = '';
                elements.adminPasswordInput.focus();
            }
        });
    }

    // ============================================
    // Orders / Kitchen
    // ============================================

    function renderOrdersPage() {
        var orders = StorageManager.getActiveOrders().reverse();
        var container = document.getElementById('ordersList');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="clipboard-list"></i>
                    <h3>No hay comandas activas</h3>
                </div>
            `;
        } else {
            container.innerHTML = orders.map(order => createOrderListCard(order)).join('');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function createOrderListCard(order) {
        var labels = { pending: 'Pendiente', preparing: 'Preparando', ready: 'Listo', delivered: 'Entregado' };
        return `
            <div class="order-list-card">
                <div class="order-card-header">
                    <span class="order-number">${order.orderNumber}</span>
                    <span class="order-status-badge">${labels[order.status]}</span>
                </div>
                <div class="order-customer-info"><span>${order.customerInfo}</span></div>
                <div class="order-items-preview">
                    ${order.items.map(item => `
                        <div class="preview-item">
                            <div class="item-main">
                                <span class="preview-qty">${item.qty}</span>
                                <span class="preview-name">${item.categoryName} ${item.size} ${item.extras.length > 0 ? '+ ' + item.extras.join(', ') : ''}</span>
                            </div>
                            <span class="item-price">${formatPrice(item.price / item.qty)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-card-footer">
                    <span class="order-total">${formatPrice(order.totalPrice)}</span>
                </div>
            </div>
        `;
    }

    // ============================================
    // Reports
    // ============================================

    function renderReportsPage() {
        var period = elements.reportPeriodSelect?.value || 'today';
        var orders = [];

        switch (period) {
            case 'today':
                orders = StorageManager.getTodayOrders();
                break;
            case 'date':
                var filterDate = elements.reportDatePicker?.value;
                orders = filterDate ? StorageManager.getOrdersByDate(filterDate) : StorageManager.getTodayOrders();
                break;
            case 'month':
                orders = StorageManager.getCurrentMonthOrders();
                break;
            case 'specific-month':
                var filterMonth = elements.reportMonthPicker?.value;
                orders = filterMonth ? StorageManager.getOrdersByMonth(filterMonth) : StorageManager.getCurrentMonthOrders();
                break;
            case 'total':
                orders = StorageManager.getOrders();
                break;
            default:
                orders = StorageManager.getTodayOrders();
        }

        // Filter out partial/temporary orders from reports
        orders = orders.filter(o => !o.isPartial);

        var paidOrders = orders.filter(o => o.paid);

        var totalSales = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        var totalFood = 0;
        var totalBebidas = 0;
        var totalDesechables = 0;
        var totalEfectivo = 0;
        var totalNequi = 0;
        var totalDaviplata = 0;

        var foodCategories = ['hamburguesas', 'perros', 'salchipapas', 'combos'];

        // Metrics Maps
        var categorySales = {};
        var categoryQtyStats = {}; // { cat: { total: 0, sizes: {} } }
        var flavorStats = { food: {}, drinks: {}, disposables: {} };
        var sizeCounts = { 'XS': 0, 'XM': 0, 'XL': 0, 'X': 0, 'HB': 0, 'PE': 0, 'SA': 0 };
        var extrasSales = {};
        var paymentList = { efectivo: [], nequi: [], daviplata: [] };
        var salesBreakdownByDay = {}; // Grouped by YYYY-MM-DD

        paidOrders.forEach(function(order) {
            // Process and categorize all items in the order
            var orderFood = 0;
            var orderDrinks = 0;
            var orderDisposables = 0;
            var orderOthers = 0;

            order.items.forEach(function(item) {
                var catId = (item.category || '').toLowerCase();
                var catName = (item.categoryName || '').toLowerCase();

                var categorized = false;
                if (catId === 'bebidas' || catName.includes('bebida')) {
                    totalBebidas += item.price;
                    orderDrinks += item.price;
                    flavorStats.drinks[item.flavors[0] || 'Gen??rica'] = (flavorStats.drinks[item.flavors[0] || 'Gen??rica'] || 0) + item.qty;
                    categorized = true;
                } else if (catId === 'desechables' || catName.includes('desechable')) {
                    totalDesechables += item.price;
                    orderDisposables += item.price;
                    (item.flavors || []).forEach(function(f) {
                        if (f) flavorStats.disposables[f] = (flavorStats.disposables[f] || 0) + item.qty;
                    });
                    categorized = true;
                } else if (foodCategories.includes(catId) || foodCategories.some(f => catName.includes(f.substring(0, 4)))) {
                    totalFood += item.price;
                    orderFood += item.price;
                    (item.flavors || []).forEach(function(f) {
                        if (f) flavorStats.food[f] = (flavorStats.food[f] || 0) + item.qty;
                    });
                    categorized = true;
                } else {
                    orderOthers += item.price;
                }

                // Category Sales breakdown
                var displayCatName = item.categoryName || 'Otros';
                categorySales[displayCatName] = (categorySales[displayCatName] || 0) + item.price;

                // Category Quantity breakdown
                if (!categoryQtyStats[displayCatName]) {
                    categoryQtyStats[displayCatName] = { total: 0, sizes: {} };
                }
                categoryQtyStats[displayCatName].total += item.qty;
                if (item.size) {
                    categoryQtyStats[displayCatName].sizes[item.size] = (categoryQtyStats[displayCatName].sizes[item.size] || 0) + item.qty;
                }

                // Size Counts
                if (item.size && sizeCounts.hasOwnProperty(item.size)) {
                    sizeCounts[item.size] += item.qty;
                }

                // Extras Sales
                (item.extras || []).forEach(function(extraName) {
                    if (extraName) extrasSales[extraName] = (extrasSales[extraName] || 0) + item.qty;
                });
            });

            // Use Local Date for grouping
            var d = new Date(order.createdAt);
            var dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            if (!salesBreakdownByDay[dateKey]) {
                salesBreakdownByDay[dateKey] = { food: 0, drinks: 0, desechables: 0, otros: 0, total: 0 };
            }
            salesBreakdownByDay[dateKey].food += orderFood;
            salesBreakdownByDay[dateKey].drinks += orderDrinks;
            salesBreakdownByDay[dateKey].desechables += orderDisposables;
            salesBreakdownByDay[dateKey].otros += orderOthers;
            salesBreakdownByDay[dateKey].total += order.totalPrice;

            // Payment Method Breakdown (including combined payments)
            var method = order.paymentMethod || 'efectivo';
            if (method === 'combinado' && order.paymentDetails) {
                // Split combined payments to their respective methods
                var ef = order.paymentDetails.efectivo || 0;
                var nq = order.paymentDetails.nequi || 0;
                var dv = order.paymentDetails.daviplata || 0;

                totalEfectivo += ef;
                totalNequi += nq;
                totalDaviplata += dv;

                if (ef > 0) paymentList.efectivo.push({ date: order.createdAt, amount: ef });
                if (nq > 0) paymentList.nequi.push({ date: order.createdAt, amount: nq });
                if (dv > 0) paymentList.daviplata.push({ date: order.createdAt, amount: dv });
            } else if (method === 'nequi') {
                totalNequi += order.totalPrice;
                paymentList.nequi.push({ date: order.createdAt, amount: order.totalPrice });
            } else if (method === 'daviplata') {
                totalDaviplata += order.totalPrice;
                paymentList.daviplata.push({ date: order.createdAt, amount: order.totalPrice });
            } else {
                totalEfectivo += order.totalPrice;
                paymentList.efectivo.push({ date: order.createdAt, amount: order.totalPrice });
            }
        });

        // Store for details
        currentReportOrders = paidOrders;
        lastSalesBreakdown = salesBreakdownByDay;

        // Update top cards
        if (elements.reportDailySales) elements.reportDailySales.textContent = formatPrice(totalSales);
        if (elements.reportFoodSales) elements.reportFoodSales.textContent = formatPrice(totalFood);
        if (elements.reportBebidasSales) elements.reportBebidasSales.textContent = formatPrice(totalBebidas);
        if (elements.reportDesechablesSales) elements.reportDesechablesSales.textContent = formatPrice(totalDesechables);
        if (elements.reportEfectivoSales) elements.reportEfectivoSales.textContent = formatPrice(totalEfectivo);
        if (elements.reportNequiSales) elements.reportNequiSales.textContent = formatPrice(totalNequi);
        if (elements.reportDaviplataSales) elements.reportDaviplataSales.textContent = formatPrice(totalDaviplata);

        // Re-attach listeners for detailed view
        document.querySelectorAll('.report-clickable').forEach(function(card) {
            card.addEventListener('click', function() {
                var method = card.getAttribute('data-report-filter');
                if (method) showReportPaymentDetail(method);
            });
        });

        // 1. Render Categories (Sorted by Price)
        if (elements.categorySalesList) {
            var sortedCats = Object.entries(categorySales).sort((a, b) => b[1] - a[1]);
            var maxSales = sortedCats.length > 0 ? sortedCats[0][1] : 1;
            elements.categorySalesList.innerHTML = sortedCats.map(([name, amount]) => {
                var percentage = (amount / maxSales) * 100;
                return `
                    <div class="category-sales-item">
                        <span class="cat-sales-name">${name}</span>
                        <div class="cat-sales-bar-bg"><div class="cat-sales-bar-fill" style="width: ${percentage}%"></div></div>
                        <span class="cat-sales-amount">${formatPrice(amount)}</span>
                    </div>`;
            }).join('') || '<div class="empty-state">Sin ventas</div>';
        }

        // 1.5. Render Category Quantities
        if (elements.categoryQtyList) {
            var sortedCats = Object.entries(categoryQtyStats).sort((a, b) => b[1].total - a[1].total);
            elements.categoryQtyList.innerHTML = sortedCats.map(([name, stat]) => {
                var sizesHtml = Object.entries(stat.sizes)
                    .map(([size, qty]) => `<span class="qty-pill">${size}: ${qty}</span>`)
                    .join(' ');

                return `
                    <div class="category-qty-item">
                        <div class="qty-item-header">
                            <span class="cat-sales-name">${name}</span>
                            <span class="cat-qty-total">${stat.total} ud.</span>
                        </div>
                        <div class="qty-item-details">
                            ${sizesHtml}
                        </div>
                    </div>`;
            }).join('') || '<div class="empty-state">Sin datos</div>';
        }

        // 2. Render Top Flavors (Grouped and Sorted)
        if (elements.flavorSalesList) {
            var flavorsHtml = '';

            var groupConfig = [
                { key: 'food', label: 'Comida', icon: 'utensils' },
                { key: 'drinks', label: 'Bebidas', icon: 'cup-water' },
                { key: 'disposables', label: 'Desechables', icon: 'package' }
            ];

            groupConfig.forEach(function(group) {
                var entries = Object.entries(flavorStats[group.key]).sort((a, b) => b[1] - a[1]);
                if (entries.length > 0) {
                    flavorsHtml += `<div class="report-sub-section-title">${group.label}</div>`;
                    flavorsHtml += entries.map(([name, count]) => `
                        <div class="stats-row">
                            <span class="stats-label">${name}</span>
                            <span class="stats-value">${count} ud.</span>
                        </div>
                    `).join('');
                }
            });

            elements.flavorSalesList.innerHTML = flavorsHtml || '<div class="empty-state">Sin datos</div>';
        }

        // 3. Render Sizes
        if (elements.sizeSalesList) {
            var sizesToShow = ['XS', 'XM', 'XL', 'X'];
            if (sizeCounts['HB'] > 0 || sizeCounts['PE'] > 0 || sizeCounts['SA'] > 0) {
                sizesToShow.push('HB', 'PE', 'SA');
            }
            elements.sizeSalesList.innerHTML = sizesToShow.map(size => `
                <div class="size-stat-box">
                    <span class="size-name">${size}</span>
                    <span class="size-count">${sizeCounts[size] || 0}</span>
                </div>
            `).join('');
        }

        // 4. Render Extras (Sorted by Popularity/Count)
        if (elements.extrasSalesList) {
            var sortedExtras = Object.entries(extrasSales).sort((a, b) => b[1] - a[1]);
            var maxExtras = sortedExtras.length > 0 ? sortedExtras[0][1] : 1;
            elements.extrasSalesList.innerHTML = sortedExtras.map(([name, count]) => {
                var percentage = (count / maxExtras) * 100;
                return `
                    <div class="category-sales-item">
                        <span class="cat-sales-name">${name}</span>
                        <div class="cat-sales-bar-bg"><div class="cat-sales-bar-fill" style="background: var(--accent-gold); width: ${percentage}%"></div></div>
                        <span class="cat-sales-amount">${count} ud.</span>
                    </div>`;
            }).join('') || '<div class="empty-state">Sin adicionales</div>';
        }

        // 5. Render Sales Breakdown Table (Grouped by Day)
        if (true) {
            var container = document.getElementById('salesBreakdownTable');
            if (container) {
                var days = Object.keys(salesBreakdownByDay).sort((a, b) => new Date(b) - new Date(a));
                if (days.length === 0) {
                    container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">Sin datos</div>';
                } else {
                    var html = `
                        <div style="overflow-x: auto; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
                            <thead>
                                <tr style="background: var(--bg-tertiary);">
                                    <th style="padding: 10px 12px; text-align: left; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">Fecha</th>
                                    <th style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">Comida</th>
                                    <th style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">Bebidas</th>
                                    <th style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">Desechables</th>
                                    <th style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">Otros</th>
                                    <th style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    days.forEach(function(dateStr) {
                        var s = salesBreakdownByDay[dateStr];
                        var dateObj = new Date(dateStr + 'T12:00:00'); // Midday to avoid TZ issues
                        var displayDate = dateObj.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });

                        html += `
                            <tr style="border-top: 1px solid var(--border-subtle); background: var(--bg-secondary);">
                                <td style="padding: 10px 12px; color: var(--text-primary); font-weight: 600;">${displayDate}</td>
                                <td style="padding: 10px 12px; text-align: right; color: var(--text-primary);">${formatPrice(s.food)}</td>
                                <td style="padding: 10px 12px; text-align: right; color: var(--text-primary);">${formatPrice(s.drinks)}</td>
                                <td style="padding: 10px 12px; text-align: right; color: var(--text-primary);">${formatPrice(s.desechables)}</td>
                                <td style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-style: italic;">${formatPrice(s.otros)}</td>
                                <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: var(--accent-primary);">${formatPrice(s.total)}</td>
                            </tr>
                        `;
                    });

                    html += `</tbody></table></div>`;
                    container.innerHTML = html;
                }
            }
        }

        // Update total label in header
        var salesTotalEl = document.getElementById('reportSalesTotal');
        if (salesTotalEl) salesTotalEl.textContent = formatPrice(totalSales);

        // 6. Render Payment Detail Tables
        var renderPaymentTable = function(elId, list, color) {
            var container = document.getElementById(elId);
            if (!container) return;

            if (list.length === 0) {
                container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">Sin transacciones</div>';
                return;
            }

            // Sort by date descending (most recent first)
            list.sort((a, b) => new Date(b.date) - new Date(a.date));

            var html = `
                <div style="overflow-y: auto; max-height: 250px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
                    <thead>
                        <tr style="background: var(--bg-tertiary);">
                            <th style="padding: 8px 12px; text-align: left; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem; position: sticky; top: 0; background: var(--bg-tertiary); z-index: 10;">Fecha</th>
                            <th style="padding: 8px 12px; text-align: right; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.65rem; position: sticky; top: 0; background: var(--bg-tertiary); z-index: 10;">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            list.forEach(function(p) {
                var dateObj = new Date(p.date);
                var dateStr = dateObj.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
                var timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                html += `
                    <tr style="border-top: 1px solid var(--border-subtle);">
                        <td style="padding: 8px 12px; color: var(--text-secondary);">
                            ${dateStr} <span style="font-size: 0.7rem; opacity: 0.6;">${timeStr}</span>
                        </td>
                        <td style="padding: 8px 12px; text-align: right; font-weight: 700; color: ${color};">
                            ${formatPrice(p.amount)}
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            container.innerHTML = html;
        };

        renderPaymentTable('paymentTableEfectivo', paymentList.efectivo, '#16a34a');
        renderPaymentTable('paymentTableNequi', paymentList.nequi, '#60a5fa');
        renderPaymentTable('paymentTableDaviplata', paymentList.daviplata, '#fb923c');

        // Update total labels in headers
        var efTotalEl = document.getElementById('reportEfectivoSalesTotal');
        var nqTotalEl = document.getElementById('reportNequiSalesTotal');
        var dvTotalEl = document.getElementById('reportDaviplataSalesTotal');
        if (efTotalEl) efTotalEl.textContent = formatPrice(totalEfectivo);
        if (nqTotalEl) nqTotalEl.textContent = formatPrice(totalNequi);
        if (dvTotalEl) dvTotalEl.textContent = formatPrice(totalDaviplata);

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (elements.searchReportBtn) {
        elements.searchReportBtn.addEventListener('click', function() {
            renderReportsPage();
        });
    }

    if (elements.downloadReportBtn) {
        elements.downloadReportBtn.addEventListener('click', function() {
            exportSalesToExcel();
        });
    }

    function exportSalesToExcel() {
        if (!lastSalesBreakdown || Object.keys(lastSalesBreakdown).length === 0) {
            showNotification('No hay datos para exportar', 'error');
            return;
        }

        var days = Object.keys(lastSalesBreakdown).sort((a, b) => new Date(a) - new Date(b));

        // Prepare data for SheetJS
        var data = days.map(function(date) {
            var s = lastSalesBreakdown[date];
            return {
                "Fecha": date,
                "Comida": s.food,
                "Bebidas": s.drinks,
                "Desechables": s.desechables,
                "Otros": s.otros,
                "Total": s.total
            };
        });

        // Add a Footer row with totals
        var totals = {
            "Fecha": "TOTALES",
            "Comida": days.reduce((sum, d) => sum + lastSalesBreakdown[d].food, 0),
            "Bebidas": days.reduce((sum, d) => sum + lastSalesBreakdown[d].drinks, 0),
            "Desechables": days.reduce((sum, d) => sum + lastSalesBreakdown[d].desechables, 0),
            "Otros": days.reduce((sum, d) => sum + lastSalesBreakdown[d].otros, 0),
            "Total": days.reduce((sum, d) => sum + lastSalesBreakdown[d].total, 0)
        };
        data.push(totals);

        try {
            var worksheet = XLSX.utils.json_to_sheet(data);
            var workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas Diarias");

            // Adjust column widths
            worksheet['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];

            XLSX.writeFile(workbook, `Reporte_Ventas_${new Date().toISOString().split('T')[0]}.xlsx`);
            showNotification('Reporte Excel generado');
        } catch (e) {
            console.error("SheetJS Error:", e);
            showNotification('Error al generar Excel', 'error');
        }
    }

    function showReportPaymentDetail(method) {
        if (!elements.reportDetailModal || !elements.reportDetailList) return;

        // Filter orders and get amounts per method (including combined)
        var filtered = [];
        currentReportOrders.forEach(function(o) {
            var m = o.paymentMethod || 'efectivo';

            if (m === 'combinado' && o.paymentDetails) {
                // For combined payments, check if this method has an amount
                var amount = o.paymentDetails[method] || 0;
                if (amount > 0) {
                    filtered.push({ ...o, displayAmount: amount, isCombined: true });
                }
            } else if (m === method) {
                filtered.push({ ...o, displayAmount: o.totalPrice, isCombined: false });
            }
        });

        // Sort descending (most recent first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        elements.reportDetailTitle.textContent = `Detalle: ${method.toUpperCase()}`;

        var html = `
            <table class="report-detail-table">
                <thead>
                    <tr>
                        <th>Fecha/Hora</th>
                        <th>Comanda</th>
                        <th>Cliente</th>
                        <th style="text-align: right;">Monto</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (filtered.length === 0) {
            html += `<tr><td colspan="4" style="text-align:center; padding: 2rem;">No hay transacciones registradas</td></tr>`;
        } else {
            filtered.forEach(function(o) {
                var dateObj = new Date(o.createdAt);
                var timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                var dateStr = dateObj.toLocaleDateString([], { day: '2-digit', month: '2-digit' });

                html += `
                    <tr>
                        <td>
                            <div class="detail-date">${dateStr}</div>
                            <div style="font-size: 0.7rem; color: var(--text-muted);">${timeStr}</div>
                        </td>
                        <td class="detail-order-num">
                            ${o.orderNumber}
                            ${o.isCombined ? '<span style="font-size: 0.65rem; color: var(--text-muted); display: block;">(Combinado)</span>' : ''}
                        </td>
                        <td style="font-size: 0.8rem; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${o.customerInfo}
                        </td>
                        <td class="detail-amount">${formatPrice(o.displayAmount)}</td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table>`;
        elements.reportDetailList.innerHTML = html;
        elements.reportDetailModal.classList.add('open');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Modal close handlers for report detail
    if (elements.closeReportDetailModal) {
        elements.closeReportDetailModal.addEventListener('click', function() {
            elements.reportDetailModal.classList.remove('open');
        });
    }
    if (elements.closeReportDetailModalOverlay) {
        elements.closeReportDetailModalOverlay.addEventListener('click', function() {
            elements.reportDetailModal.classList.remove('open');
        });
    }

    if (elements.reportPeriodSelect) {
        elements.reportPeriodSelect.addEventListener('change', function(e) {
            var val = e.target.value;
            // Handle date picker visibility
            if (val === 'date') {
                elements.reportDatePickerGroup?.classList.remove('hidden');
            } else {
                elements.reportDatePickerGroup?.classList.add('hidden');
            }

            // Handle month picker visibility
            if (val === 'specific-month') {
                elements.reportMonthPickerGroup?.classList.remove('hidden');
            } else {
                elements.reportMonthPickerGroup?.classList.add('hidden');
            }

            // Auto-refresh for static options
            if (val !== 'date' && val !== 'specific-month') {
                renderReportsPage();
            }
        });
    }

    // ============================================
    // History
    // ============================================

    var historyMode = 'today';
    var historyFilter = 'all';

    function renderHistoryPage() {
        var ordersRaw = historyMode === 'today'
            ? StorageManager.getTodayOrders().reverse()
            : StorageManager.getOrdersByDate(elements.historyDatePicker.value).reverse();

        // Filter out partial orders from history and show only PAID
        var orders = ordersRaw.filter(o => !o.isPartial && o.paid);

        // Apply Payment Method or Category Filter
        if (historyFilter !== 'all') {
            if (['efectivo', 'nequi', 'daviplata'].includes(historyFilter)) {
                orders = orders.filter(function(o) {
                    var m = o.paymentMethod || 'efectivo';
                    if (m === historyFilter) return true;
                    if (m === 'combinado' && o.paymentDetails && (o.paymentDetails[historyFilter] || 0) > 0) return true;
                    return false;
                });
            } else if (['comida', 'bebidas', 'desechables'].includes(historyFilter)) {
                var foodCategories = ['hamburguesas', 'perros', 'salchipapas', 'combos'];
                orders = orders.filter(function(o) {
                    return o.items.some(function(item) {
                        var catId = (item.category || '').toLowerCase();
                        if (historyFilter === 'comida') return foodCategories.includes(catId);
                        if (historyFilter === 'bebidas') return catId === 'bebidas';
                        if (historyFilter === 'desechables') return catId === 'desechables';
                        return false;
                    });
                });
            }
        }

        renderHistoryOrdersList(orders);
        calculateHistorySummary(ordersRaw.filter(o => !o.isPartial && o.paid)); // Total summary always shows all

        // Ensure modal is hidden
        if (elements.historyOrderModal) {
            elements.historyOrderModal.classList.add('hidden');
            elements.historyOrderModal.style.display = 'none';
        }
        elements.historyOrdersList.classList.remove('hidden');

        // Show/Hide date picker container
        if (historyMode === 'date') {
            elements.datePickerContainer.classList.remove('hidden');
        } else {
            elements.datePickerContainer.classList.add('hidden');
        }
    }

    // Initialize Clickable Filter Cards in Summary
    document.querySelectorAll('.filter-card').forEach(function(card) {
        card.addEventListener('click', function() {
            document.querySelectorAll('.filter-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            historyFilter = card.dataset.filter;
            renderHistoryPage();
        });
    });

    elements.historyTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            elements.historyTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            historyMode = tab.dataset.tab;
            renderHistoryPage();
        });
    });

    if (elements.searchDateBtn) {
        elements.searchDateBtn.addEventListener('click', function() {
            if (!elements.historyDatePicker.value) {
                showNotification('Selecciona una fecha');
                return;
            }
            renderHistoryPage();
        });
    }

    if (elements.historyDatePicker) {
        // Set default to today
        var today = new Date().toISOString().split('T')[0];
        elements.historyDatePicker.value = today;

        // Auto-search on change
        elements.historyDatePicker.addEventListener('change', function() {
            if (historyMode === 'date') {
                renderHistoryPage();
            }
        });
    }

    if (elements.backToHistoryBtn) {
        elements.backToHistoryBtn.addEventListener('click', function() {
            elements.historyOrderModal.classList.add('hidden');
            elements.historyOrderModal.style.display = 'none';
        });
    }

    if (elements.historyModalOverlay) {
        elements.historyModalOverlay.addEventListener('click', function() {
            elements.historyOrderModal.classList.add('hidden');
            elements.historyOrderModal.style.display = 'none';
        });
    }

    var selectedHistoryOrder = null;

    function showOrderDetail(orderId) {
        var order = StorageManager.getOrders().find(o => o.id == orderId);
        if (!order) return;

        selectedHistoryOrder = order;
        elements.historyTicketContent.innerHTML = generateTicketText(order);

        elements.historyOrderModal.classList.remove('hidden');
        elements.historyOrderModal.style.display = 'flex';
    }

    if (elements.reprintOrderBtn) {
        elements.reprintOrderBtn.addEventListener('click', function() {
            if (selectedHistoryOrder) {
                // In a real app, this would send to a printer
                // For now we use browser print
                showTicketModal(selectedHistoryOrder);
                window.print();
            }
        });
    }

    if (elements.invoiceOrderBtn) {
        elements.invoiceOrderBtn.addEventListener('click', function() {
            if (selectedHistoryOrder) {
                var originalContent = elements.historyTicketContent.innerHTML;
                elements.historyTicketContent.innerHTML = generateInvoiceText(selectedHistoryOrder);
                window.print();
                elements.historyTicketContent.innerHTML = originalContent;
                showNotification(`Factura de pedido ${selectedHistoryOrder.orderNumber} generada`);
            }
        });
    }

    if (elements.deleteOrderBtnHistory) {
        elements.deleteOrderBtnHistory.addEventListener('click', function() {
            if (!selectedHistoryOrder) return;

            var performDelete = function() {
                if (confirm(`??Est??s seguro de que deseas eliminar permanentemente el pedido ${selectedHistoryOrder.orderNumber}?`)) {
                    StorageManager.deleteOrder(selectedHistoryOrder.id);
                    showNotification(`Pedido ${selectedHistoryOrder.orderNumber} eliminado`);
                    elements.historyOrderModal.classList.add('hidden');
                    renderHistoryPage();
                }
            };

            if (state.isAdminAuthenticated) {
                performDelete();
            } else {
                state.pendingAdminAction = performDelete;
                elements.adminLoginModal.classList.add('open');
                elements.adminPasswordInput.value = '';
                elements.adminPasswordInput.focus();
            }
        });
    }

    function renderHistoryOrdersList(orders) {
        var container = document.getElementById('historyOrdersList');
        if (!container) return;
        var labels = { pending: 'Pendiente', preparing: 'Preparando', ready: 'Listo', delivered: 'Entregado' };

        container.innerHTML = orders.map(order => `
            <div class="order-list-card history-order-card" data-order-id="${order.id}">
                <div class="order-card-header">
                    <span class="order-number">${order.orderNumber}</span>
                    <span class="order-status-badge">${order.paid ? 'Pagado' : labels[order.status]}</span>
                </div>
                <div class="order-customer-info">
                    <span class="order-time">${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span> - ${order.customerInfo}</span>
                </div>
                <div class="order-items-preview">
                    ${order.items.map(item => `
                        <div class="preview-item">
                            <div class="item-main">
                                <span class="preview-qty">${item.qty}</span>
                                <span class="preview-name">${item.categoryName} ${item.size} ${item.extras.length > 0 ? '+ ' + item.extras.join(', ') : ''}</span>
                            </div>
                            <span class="item-price">${formatPrice(item.price / item.qty)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-card-footer">
                    <div class="footer-left">
                        <span class="order-total">${formatPrice(order.totalPrice)}</span>
                        <span class="payment-method-tag">${(order.paymentMethod || 'efectivo').toUpperCase()}</span>
                    </div>
                    ${order.paid ? '<span class="status-indicator paid-chip">PAGADO</span>' : ''}
                </div>
            </div>
        `).join('');

        // Re-attach click listeners for history detail
        document.querySelectorAll('.history-order-card').forEach(function(card) {
            card.addEventListener('click', function() {
                showOrderDetail(card.dataset.orderId);
            });
        });
    }

    function calculateHistorySummary(orders) {
        var paidOrders = orders.filter(o => o.paid);
        var totalSales = 0;
        var totalEfectivo = 0;
        var totalNequi = 0;
        var totalDaviplata = 0;
        var totalFood = 0;
        var totalBebidas = 0;
        var totalDesechables = 0;

        var foodCategories = ['hamburguesas', 'perros', 'salchipapas', 'combos'];

        paidOrders.forEach(function(order) {
            totalSales += order.totalPrice;
            var method = order.paymentMethod || 'efectivo';

            if (method === 'combinado' && order.paymentDetails) {
                totalEfectivo += order.paymentDetails.efectivo || 0;
                totalNequi += order.paymentDetails.nequi || 0;
                totalDaviplata += order.paymentDetails.daviplata || 0;
            } else if (method === 'nequi') {
                totalNequi += order.totalPrice;
            } else if (method === 'daviplata') {
                totalDaviplata += order.totalPrice;
            } else {
                totalEfectivo += order.totalPrice;
            }

            // Category Breakdown
            order.items.forEach(function(item) {
                var catId = (item.category || '').toLowerCase();
                var catName = (item.categoryName || '').toLowerCase();

                if (catId === 'bebidas' || catName.includes('bebida')) {
                    totalBebidas += item.price;
                } else if (catId === 'desechables' || catName.includes('desechable')) {
                    totalDesechables += item.price;
                } else if (foodCategories.includes(catId) || foodCategories.some(f => catName.includes(f.substring(0, 4)))) {
                    totalFood += item.price;
                }
            });
        });

        if (elements.historyTotalSales) elements.historyTotalSales.textContent = formatPrice(totalSales);
        if (elements.historyTotalEfectivo) elements.historyTotalEfectivo.textContent = formatPrice(totalEfectivo);
        if (elements.historyTotalNequi) elements.historyTotalNequi.textContent = formatPrice(totalNequi);
        if (elements.historyTotalDaviplata) elements.historyTotalDaviplata.textContent = formatPrice(totalDaviplata);
        if (elements.historyTotalFood) elements.historyTotalFood.textContent = formatPrice(totalFood);
        if (elements.historyTotalBebidas) elements.historyTotalBebidas.textContent = formatPrice(totalBebidas);
        if (elements.historyTotalDesechables) elements.historyTotalDesechables.textContent = formatPrice(totalDesechables);
    }

    function generateTicketText(order) {
        if (!order || !order.items) return 'Error: Pedido sin productos';
        var TICKET_WIDTH = 26;
        var labels = { salon: 'SAL??N', llevar: 'LLEVAR', domicilio: 'DOMICILIO' };
        var now = new Date(order.createdAt || Date.now());
        var dateStr = now.toLocaleDateString('es-CO');
        var timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

        var center = function(str) {
            str = String(str).toUpperCase();
            if (str.length >= TICKET_WIDTH) return str.substring(0, TICKET_WIDTH);
            var left = Math.floor((TICKET_WIDTH - str.length) / 2);
            return ' '.repeat(left) + str;
        };

        var justify = function(leftStr, rightStr) {
            var left = String(leftStr).toUpperCase();
            var right = String(rightStr).toUpperCase();
            var spaceNeeded = TICKET_WIDTH - (left.length + right.length);
            if (spaceNeeded < 1) return left + ' ' + right;
            return left + ' '.repeat(spaceNeeded) + right;
        };

        var topDivider = '???'.repeat(TICKET_WIDTH);
        var subDivider = '???'.repeat(TICKET_WIDTH);

        var ticket = '';
        ticket += topDivider + '\n';
        if (order.isAppending) {
            var sType = labels[order.serviceType] || 'SAL??N';
            ticket += center(`*** ${sType} ***`) + '\n';
            ticket += center('(ADICI??N)') + '\n';
        } else {
            ticket += center('COMANDA DE COCINA') + '\n';
            ticket += center('POS PRO') + '\n';
        }

        ticket += center(`ORDEN: ${order.orderNumber || '---'}`) + '\n';
        if (order.sequenceNumber && order.sequenceNumber !== order.orderNumber) {
            ticket += center(`TURNO: ${order.sequenceNumber}`) + '\n';
        }

        ticket += topDivider + '\n';
        ticket += justify(dateStr, timeStr) + '\n';
        ticket += center(`TIPO: ${labels[order.serviceType] || 'SAL??N'}`) + '\n';
        if (order.customerInfo) {
            ticket += center(`MESA/CLI: ${order.customerInfo}`) + '\n';
        }
        var itemsByClient = {};
        order.items.forEach(function(item) {
            var cName = item.clientName || 'CLIENTE';
            if (!itemsByClient[cName]) itemsByClient[cName] = [];
            itemsByClient[cName].push(item);
        });

        for (var [clientName, cItems] of Object.entries(itemsByClient)) {
            ticket += subDivider + '\n';
            ticket += center(`=== ${clientName.toUpperCase()} ===`) + '\n';
            ticket += subDivider + '\n';
            ticket += 'CANT PRODUCTO         VALOR\n';
            ticket += subDivider + '\n';

            cItems.forEach(function(item) {
                var qty = `${item.qty}x`.padEnd(5);
                var name = (item.name || item.categoryName || 'ITEM').toUpperCase();
                var price = formatPrice(item.price || (item.unitPrice * item.qty));
                
                if (name.length > 13) name = name.substring(0, 13);
                name = name.padEnd(14);
                
                ticket += `${qty}${name}${price.padStart(7)}\n`;
                if (item.notes && item.notes.trim() !== '') {
                    ticket += `  * NOTA: ${item.notes.toUpperCase()}\n`;
                }
                if (item.observations && item.observations.trim() !== '' && item.observations !== item.notes) {
                    ticket += `  * OBS: ${item.observations.toUpperCase()}\n`;
                }
                if (item.extras && item.extras.length > 0) {
                    var ext = Array.isArray(item.extras) ? item.extras.map(e => typeof e === 'object' ? e.name : e).join(', ') : item.extras;
                    ticket += `  + ADI: ${ext.toUpperCase()}\n`;
                }
            });
        }

        ticket += subDivider + '\n';
        ticket += justify('TOTAL:', formatPrice(order.totalPrice)) + '\n';
        ticket += topDivider + '\n';
        ticket += center('??GRACIAS POR SU COMPRA!') + '\n';
        ticket += topDivider + '\n\n\n.';

        return ticket;
    }

    function generateInvoiceText(order) {
        if (!order || !order.items) return 'Error: Pedido sin productos';
        var TICKET_WIDTH = 26;
        var labels = { salon: 'SAL??N', llevar: 'LLEVAR', domicilio: 'DOMICILIO' };
        var now = new Date(order.createdAt || Date.now());
        var dateStr = now.toLocaleDateString('es-CO');
        var timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

        var center = function(str) {
            str = String(str).toUpperCase();
            if (str.length >= TICKET_WIDTH) return str.substring(0, TICKET_WIDTH);
            var left = Math.floor((TICKET_WIDTH - str.length) / 2);
            return ' '.repeat(left) + str;
        };

        var justify = function(leftStr, rightStr) {
            var left = String(leftStr).toUpperCase();
            var right = String(rightStr).toUpperCase();
            var spaceNeeded = TICKET_WIDTH - (left.length + right.length);
            if (spaceNeeded < 1) return left + ' ' + right;
            return left + ' '.repeat(spaceNeeded) + right;
        };

        var topDivider = '???'.repeat(TICKET_WIDTH);
        var subDivider = '???'.repeat(TICKET_WIDTH);

        var ticket = '';
        ticket += center('FACTURA DE VENTA') + '\n';
        ticket += center('POS PRO') + '\n';
        ticket += center(`ORDEN: ${order.orderNumber || '---'}`) + '\n';
        if (order.sequenceNumber && order.sequenceNumber !== order.orderNumber) {
            ticket += center(`TURNO: ${order.sequenceNumber}`) + '\n';
        }
        ticket += topDivider + '\n';
        ticket += justify(dateStr, timeStr) + '\n';
        ticket += center(`TIPO: ${labels[order.serviceType] || 'SAL??N'}`) + '\n';
        if (order.customerInfo) {
            ticket += center(`MESA/CLI: ${order.customerInfo}`) + '\n';
        }
        var itemsByClient = {};
        order.items.forEach(function(item) {
            var cName = item.clientName || 'CLIENTE';
            if (!itemsByClient[cName]) itemsByClient[cName] = [];
            itemsByClient[cName].push(item);
        });

        for (var [clientName, cItems] of Object.entries(itemsByClient)) {
            ticket += subDivider + '\n';
            ticket += center(`=== ${clientName.toUpperCase()} ===`) + '\n';
            ticket += subDivider + '\n';
            ticket += 'CANT PRODUCTO         VALOR\n';
            ticket += subDivider + '\n';

            cItems.forEach(function(item) {
                var qty = `${item.qty}x`.padEnd(5);
                var name = (item.name || item.categoryName || 'ITEM').toUpperCase();
                var price = formatPrice(item.price || (item.unitPrice * item.qty));
                
                if (name.length > 13) name = name.substring(0, 13);
                name = name.padEnd(14);
                
                ticket += `${qty}${name}${price.padStart(7)}\n`;
                if (item.notes && item.notes.trim() !== '') {
                    ticket += `  * ${item.notes.toUpperCase()}\n`;
                }
            });
        }

        ticket += subDivider + '\n';
        ticket += justify('TOTAL:', formatPrice(order.totalPrice)) + '\n';
        ticket += topDivider + '\n';
        ticket += center('GRACIAS POR SU COMPRA') + '\n';
        ticket += topDivider + '\n\n\n.';

        return ticket;
    }

    // ============================================
    // Expenses (Egresos)
    // ============================================

    // Helper to get categories as a map { id: { label, emoji } }
    function getExpenseCatMap() {
        var cats = StorageManager.getExpenseCategories();
        var map = {};
        cats.forEach(function(c) { map[c.id] = { label: c.label, emoji: c.emoji }; });
        return map;
    }

    // Color palette for category cards
    var expenseCatColors = ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f97316', '#6b7280', '#e11d48', '#84cc16', '#14b8a6', '#a855f7'];

    function renderExpensesPage() {
        var period = document.getElementById('expensePeriodSelect')?.value || 'today';
        var searchField = document.getElementById('expenseSearchInput');
        var query = (searchField?.value || '').toLowerCase();
        var income = 0;

        switch (period) {
            case 'today':
                expenses = StorageManager.getTodayExpenses();
                income = StorageManager.getTodaySales();
                break;
            case 'month':
                expenses = StorageManager.getCurrentMonthExpenses();
                income = StorageManager.getCurrentMonthSales();
                break;
            case 'total':
                expenses = StorageManager.getExpenses();
                income = StorageManager.getTotalSales();
                break;
            case 'specific-month':
                var filterMonth = document.getElementById('expenseMonthPicker')?.value;
                expenses = filterMonth ? StorageManager.getExpensesByMonth(filterMonth) : StorageManager.getCurrentMonthExpenses();
                income = filterMonth ? StorageManager.getSalesByMonth(filterMonth) : StorageManager.getCurrentMonthSales();
                break;
            default:
                expenses = StorageManager.getTodayExpenses();
                income = StorageManager.getTodaySales();
        }

        // Filter by Search Query
        if (query) {
            expenses = expenses.filter(e => (e.description || '').toLowerCase().includes(query));
        }

        // Sort by date descending
        expenses.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

        var CATS = getExpenseCatMap();

        // Populate category select dynamically
        var catSelect = document.getElementById('expenseCategory');
        if (catSelect) {
            var currentVal = catSelect.value;
            var allCats = StorageManager.getExpenseCategories();
            catSelect.innerHTML = allCats.map(c => `<option value="${c.id}">${c.label}</option>`).join('');
            if (currentVal && allCats.find(c => c.id === currentVal)) catSelect.value = currentVal;
        }

        // Calculate totals
        var totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        var netBalance = income - totalExpenses;

        var categoryTotals = {};
        expenses.forEach(function(e) {
            var cat = e.category || 'otros';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.amount || 0);
        });

        // Update cards
        var incomeEl = document.getElementById('expenseTotalIncome');
        var totalEl = document.getElementById('expenseTotalAmount');
        var netEl = document.getElementById('expenseNetBalance');
        var statusEl = document.getElementById('balanceStatus');

        if (incomeEl) incomeEl.textContent = formatPrice(income);
        if (totalEl) totalEl.textContent = formatPrice(totalExpenses);
        if (netEl) netEl.textContent = formatPrice(netBalance);

        if (statusEl) {
            if (netBalance > 0) {
                statusEl.textContent = 'Excedente';
                statusEl.style.background = '#dcfce7';
                statusEl.style.color = '#16a34a';
            } else if (netBalance < 0) {
                statusEl.textContent = 'D??ficit';
                statusEl.style.background = '#fee2e2';
                statusEl.style.color = '#dc2626';
            } else {
                statusEl.textContent = 'Equilibrio';
                statusEl.style.background = '#f3f4f6';
                statusEl.style.color = '#6b7280';
            }
        }

        // Render category summary
        var summaryEl = document.getElementById('expenseCategorySummary');
        if (summaryEl) {
            var allCatsForColors = StorageManager.getExpenseCategories();
            summaryEl.innerHTML = Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([catId, amount]) => {
                    var cat = CATS[catId] || { label: catId, emoji: '????' };
                    var idx = allCatsForColors.findIndex(c => c.id === catId);
                    var color = expenseCatColors[idx % expenseCatColors.length] || '#6b7280';
                    return `
                        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md); border-left: 3px solid ${color};">
                            <div style="font-size: 0.7rem; color: var(--text-muted);">${cat.label}</div>
                            <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${formatPrice(amount)}</div>
                        </div>
                    `;
                }).join('');
        }

        // Render expense list as table
        var listEl = document.getElementById('expensesList');
        if (listEl) {
            if (expenses.length === 0) {
                listEl.innerHTML = `
                    <div class="empty-state" style="padding: 2rem; text-align: center;">
                        <i data-lucide="wallet" style="width: 40px; height: 40px; color: var(--text-muted); margin-bottom: 8px;"></i>
                        <p style="color: var(--text-muted);">No hay egresos registrados</p>
                    </div>
                `;
            } else {
                var tableHtml = `
                    <div style="overflow-x: auto; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
                        <thead>
                            <tr style="background: var(--bg-tertiary);">
                                <th style="padding: 10px 12px; text-align: left; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Fecha</th>
                                <th style="padding: 10px 12px; text-align: left; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Categor??a</th>
                                <th style="padding: 10px 12px; text-align: left; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Descripci??n</th>
                                <th style="padding: 10px 12px; text-align: center; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Cant.</th>
                                <th style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Unit.</th>
                                <th style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                                <th style="padding: 10px 6px; width: 30px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                expenses.forEach(function(expense) {
                    var cat = CATS[expense.category] || { label: 'Otros', emoji: '????' };
                    var dateObj = new Date(expense.date || expense.createdAt);
                    var dateStr = dateObj.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
                    var qty = expense.qty || 1;
                    var unitCost = expense.amount / qty;

                    tableHtml += `
                        <tr style="border-top: 1px solid var(--border-subtle); background: var(--bg-secondary);">
                            <td style="padding: 10px 12px; color: var(--text-secondary); white-space: nowrap; font-size: 0.8rem;">${dateStr}</td>
                            <td style="padding: 10px 12px; white-space: nowrap;">
                                <span style="font-size: 0.8rem;">${cat.label}</span>
                            </td>
                            <td style="padding: 10px 12px; color: var(--text-primary); max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.8rem;">
                                ${expense.description || '-'}
                            </td>
                            <td style="padding: 10px 12px; text-align: center; color: var(--text-primary); font-size: 0.8rem;">
                                ${qty}
                            </td>
                            <td style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-size: 0.75rem;">
                                ${formatPrice(unitCost)}
                            </td>
                            <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #ef4444; white-space: nowrap;">
                                -${formatPrice(expense.amount)}
                            </td>
                            <td style="padding: 10px 6px; text-align: center;">
                                <button onclick="window.deleteExpense('${expense.id}')"
                                    style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; opacity: 0.5;"
                                    title="Eliminar">
                                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                tableHtml += `</tbody></table></div>`;
                listEl.innerHTML = tableHtml;
            }
        }

        // Set default date to today (local time) if empty
        var dateInput = document.getElementById('expenseDate');
        if (dateInput && !dateInput.value) {
            var now = new Date();
            var yyyy = now.getFullYear();
            var mm = String(now.getMonth() + 1).padStart(2, '0');
            var dd = String(now.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ---- Expense Category Manager ----
    function renderExpenseCategoriesManager() {
        var container = document.getElementById('expenseCatManager');
        if (!container) return;

        var cats = StorageManager.getExpenseCategories();
        var html = `
            <div style="overflow-x: auto; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: var(--space-sm);">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
                <thead>
                    <tr style="background: var(--bg-tertiary);">
                        <th style="padding: 8px 12px; text-align: left; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase;">Nombre de Categor??a</th>
                        <th style="padding: 8px 6px; width: 60px; text-align: center; color: var(--text-muted); font-weight: 600; font-size: 0.7rem; text-transform: uppercase;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cats.forEach(function(cat) {
            html += `
                <tr style="border-top: 1px solid var(--border-subtle); background: var(--bg-secondary);">
                    <td style="padding: 8px 12px; color: var(--text-primary); font-size: 0.85rem;">${cat.label}</td>
                    <td style="padding: 8px 6px; text-align: center; white-space: nowrap;">
                        <button onclick="window.editExpenseCategory('${cat.id}')"
                            style="background: none; border: none; color: var(--accent-primary); cursor: pointer; padding: 4px; font-size: 1rem;" title="Editar">
                            ??????
                        </button>
                        <button onclick="window.deleteExpenseCategory('${cat.id}')"
                            style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; margin-left: 2px; font-size: 1rem;" title="Eliminar">
                            ???????
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;

        // Add new category form
        html += `
            <div style="display: flex; gap: var(--space-xs); align-items: center;">
                <input type="text" id="newExpenseCatLabel" placeholder="Nombre de categor??a"
                    style="flex: 1; padding: 8px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.85rem; box-sizing: border-box;">
                <button onclick="window.addExpenseCategory()"
                    style="padding: 8px 14px; background: var(--accent-primary); color: var(--bg-primary); border: none; border-radius: var(--radius-md); font-weight: 700; font-size: 0.8rem; cursor: pointer; white-space: nowrap;">
                    + Agregar
                </button>
            </div>
        `;

        container.innerHTML = html;
    }

    // Global handlers for category management
    window.addExpenseCategory = function () {
        var label = document.getElementById('newExpenseCatLabel')?.value.trim();

        if (!label) {
            showNotification('?????? Ingresa un nombre para la categor??a', 'error');
            return;
        }

        var cats = StorageManager.getExpenseCategories();
        var id = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

        if (cats.find(c => c.id === id)) {
            showNotification('?????? Ya existe una categor??a con ese nombre', 'error');
            return;
        }

        cats.push({ id, label, emoji: '????' });
        StorageManager.saveExpenseCategories(cats);
        showNotification(`Categor??a "${label}" creada`);
        renderExpensesPage();
    };

    window.editExpenseCategory = function (catId) {
        var cats = StorageManager.getExpenseCategories();
        var cat = cats.find(c => c.id === catId);
        if (!cat) return;

        var newLabel = prompt('Nombre de la categor??a:', cat.label);
        if (newLabel === null) return;

        cat.label = newLabel.trim() || cat.label;
        StorageManager.saveExpenseCategories(cats);
        showNotification(`Categor??a actualizada: ${cat.label}`);
        renderExpensesPage();
    };

    window.deleteExpenseCategory = function (catId) {
        var performDelete = function() {
            if (!confirm('??Eliminar esta categor??a de egreso?')) return;
            var cats = StorageManager.getExpenseCategories().filter(c => c.id !== catId);
            StorageManager.saveExpenseCategories(cats);
            showNotification('Categor??a eliminada');
            renderExpensesPage();
        };

        if (state.isAdminAuthenticated) {
            performDelete();
        } else {
            state.pendingAdminAction = performDelete;
            elements.adminLoginModal.classList.add('open');
            elements.adminPasswordInput.value = '';
            elements.adminPasswordInput.focus();
        }
    };

    // Add expense handler
    var addExpenseBtn = document.getElementById('addExpenseBtn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function() {
            var category = document.getElementById('expenseCategory').value;
            var description = document.getElementById('expenseDescription').value.trim();
            var qty = parseFloat(document.getElementById('expenseQty').value) || 1;
            var amount = parseFloat(document.getElementById('expenseAmount').value);
            var date = document.getElementById('expenseDate').value;

            if (!amount || amount <= 0) {
                showNotification('?????? Ingresa un monto v??lido', 'error');
                return;
            }

            if (!date) {
                showNotification('?????? Selecciona una fecha', 'error');
                return;
            }

            var CATS = getExpenseCatMap();
            var cat = CATS[category] || { label: 'Otros', emoji: '????' };

            StorageManager.addExpense({
                category: category,
                categoryLabel: cat.label,
                description: description || cat.label,
                qty: qty,
                amount: amount,
                date: date + 'T12:00:00'
            });

            showNotification(`Egreso registrado: ${formatPrice(amount)}`);

            // Clear form
            document.getElementById('expenseDescription').value = '';
            document.getElementById('expenseQty').value = '1';
            document.getElementById('expenseAmount').value = '';
            if (document.getElementById('expenseAmountPreview')) {
                document.getElementById('expenseAmountPreview').textContent = '$0';
            }

            renderExpensesPage();
        });
    }

    var expenseAmountInput = document.getElementById('expenseAmount');
    if (expenseAmountInput) {
        expenseAmountInput.addEventListener('input', function(e) {
            var val = parseFloat(e.target.value) || 0;
            var preview = document.getElementById('expenseAmountPreview');
            if (preview) preview.textContent = formatPrice(val);
        });
    }

    // Period filter change
    var expensePeriodSelect = document.getElementById('expensePeriodSelect');
    if (expensePeriodSelect) {
        expensePeriodSelect.addEventListener('change', function(e) {
            var val = e.target.value;
            var picker = document.getElementById('expenseMonthPicker');
            if (val === 'specific-month') {
                picker?.classList.remove('hidden');
            } else {
                picker?.classList.add('hidden');
                renderExpensesPage();
            }
        });
    }

    var expenseMonthPicker = document.getElementById('expenseMonthPicker');
    if (expenseMonthPicker) {
        expenseMonthPicker.addEventListener('change', function() {
            renderExpensesPage();
        });
    }

    var expenseSearchInput = document.getElementById('expenseSearchInput');
    if (expenseSearchInput) {
        expenseSearchInput.addEventListener('input', function() {
            renderExpensesPage();
        });
    }

    // Delete expense (global handler)
    window.deleteExpense = function (expenseId) {
        var performDelete = function() {
            if (confirm('??Eliminar este egreso?')) {
                StorageManager.deleteExpense(expenseId);
                showNotification('Egreso eliminado');
                renderExpensesPage();
            }
        };

        if (state.isAdminAuthenticated) {
            performDelete();
        } else {
            state.pendingAdminAction = performDelete;
            elements.adminLoginModal.classList.add('open');
            elements.adminPasswordInput.value = '';
            elements.adminPasswordInput.focus();
        }
    };

    // Download Expenses as Excel (.xlsx)
    window.downloadExpensesExcel = function () {
        var period = document.getElementById('expensePeriodSelect')?.value || 'today';
        var query = (document.getElementById('expenseSearchInput')?.value || '').toLowerCase();
        var expenses = [];
        var periodLabel = '';

        switch (period) {
            case 'today':
                expenses = StorageManager.getTodayExpenses();
                periodLabel = 'Hoy';
                break;
            case 'month':
                expenses = StorageManager.getCurrentMonthExpenses();
                periodLabel = 'Este_Mes';
                break;
            case 'specific-month':
                var filterMonth = document.getElementById('expenseMonthPicker')?.value;
                expenses = filterMonth ? StorageManager.getExpensesByMonth(filterMonth) : StorageManager.getCurrentMonthExpenses();
                periodLabel = filterMonth || 'Mes_Especifico';
                break;
            case 'total':
                expenses = StorageManager.getExpenses();
                periodLabel = 'Todo';
                break;
            default:
                expenses = StorageManager.getTodayExpenses();
                periodLabel = 'Hoy';
        }

        if (expenses.length === 0) {
            showNotification('?????? No hay egresos para descargar', 'error');
            return;
        }

        // Filter by Search Query
        if (query) {
            expenses = expenses.filter(e => (e.description || '').toLowerCase().includes(query));
        }

        // Sort by date ascending
        expenses.sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

        var CATS = getExpenseCatMap();

        // Build data rows matching the table: Fecha | Categor??a | Descripci??n | Cant. | V. Unit. | Total
        var rows = [['Fecha', 'Categor??a', 'Descripci??n', 'Cant.', 'V. Unit.', 'Total']];

        var total = 0;
        expenses.forEach(function(expense) {
            var cat = CATS[expense.category] || { label: 'Otros', emoji: '????' };
            var dateObj = new Date(expense.date || expense.createdAt);
            var dateStr = dateObj.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
            var qty = expense.qty || 1;
            var amount = expense.amount || 0;
            var unit = amount / qty;
            total += amount;

            rows.push([
                dateStr,
                cat.label,
                expense.description || cat.label,
                qty,
                unit,
                amount
            ]);
        });

        // Total row
        rows.push(['', '', '', '', 'TOTAL', total]);

        // Create workbook
        var ws = XLSX.utils.aoa_to_sheet(rows);

        // Set column widths
        ws['!cols'] = [
            { wch: 12 },  // Fecha
            { wch: 20 },  // Categor??a
            { wch: 30 },  // Descripci??n
            { wch: 8 },   // Cant.
            { wch: 12 },  // V. Unit.
            { wch: 12 }   // Total
        ];

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Egresos');

        // Generate filename
        var now = new Date();
        var dateFile = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        XLSX.writeFile(wb, `Egresos_${periodLabel}_${dateFile}.xlsx`);

        showNotification('???? Excel descargado');
    };

    // ============================================
    // Administration Logic
    // ============================================

    var currentAdminTab = 'categories';
    var adminEditContext = null;

    function renderAdminPage() {
        renderAdminPanel(currentAdminTab);
    }

    function renderAdminPanel(tab) {
        var config = StorageManager.getConfig();
        var categories = config.categories;

        if (tab === 'categories') renderCategoriesList(categories);
        else if (tab === 'flavors') {
            populateAdminCategorySelect(elements.adminCategorySelectFlavors, categories);
            renderFlavorsList(config.flavors, elements.adminCategorySelectFlavors.value);
        } else if (tab === 'extras') {
            populateAdminCategorySelect(elements.adminCategorySelectExtras, categories);
            renderExtrasList(config.extras, elements.adminCategorySelectExtras.value);
        } else if (tab === 'observations') {
            populateAdminCategorySelect(elements.adminCategorySelectObs, categories);
            renderObsList(config.observations, elements.adminCategorySelectObs.value);
        } else if (tab === 'expense-cats') {
            renderExpenseCategoriesManager();
        }
    }

    elements.adminTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            elements.adminTabs.forEach(t => t.classList.remove('active'));
            elements.adminPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            currentAdminTab = tab.dataset.tab;
            var target = document.getElementById(`panel-${currentAdminTab}`);
            if (target) target.classList.add('active');
            renderAdminPage();
        });
    });

    function renderCategoriesList(categories) {
        if (!elements.adminCategoriesList) return;
        elements.adminCategoriesList.innerHTML = categories.map(cat => `
            <div class="admin-item">
                <div class="admin-item-info"><span>${cat.name}</span></div>
                <div class="admin-item-actions">
                    <button class="btn-icon" onclick="window.editAdminItem('category', '${cat.id}')">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="window.deleteAdminItem('category', '${cat.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function populateAdminCategorySelect(selectEl, categories) {
        if (!selectEl) return;
        var current = selectEl.value;
        selectEl.innerHTML = categories.map(cat => `<option value="${cat.id}" ${cat.id === current ? 'selected' : ''}>${cat.name}</option>`).join('');
    }

    if (elements.adminCategorySelectFlavors) {
        elements.adminCategorySelectFlavors.addEventListener('change', function() {
            renderFlavorsList(StorageManager.getConfig().flavors, elements.adminCategorySelectFlavors.value);
        });
    }

    if (elements.adminCategorySelectExtras) {
        elements.adminCategorySelectExtras.addEventListener('change', function() {
            renderExtrasList(StorageManager.getConfig().extras, elements.adminCategorySelectExtras.value);
        });
    }

    if (elements.adminCategorySelectObs) {
        elements.adminCategorySelectObs.addEventListener('change', function() {
            renderObsList(StorageManager.getConfig().observations, elements.adminCategorySelectObs.value);
        });
    }

    function renderFlavorsList(all, catId) {
        if (!elements.adminFlavorsList) return;
        var config = StorageManager.getConfig();
        var list = (config.products && config.products.length > 0)
            ? config.products.filter(p => p.category === catId)
            : (all[catId] || []);

        elements.adminFlavorsList.innerHTML = list.map(f => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <span>${f.name}</span>
                    <span style="font-weight: 700; color: var(--accent-gold);">${formatPrice(f.price || 0)}</span>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-icon" onclick="window.editAdminItem('flavor', '${f.id}', '${catId}')">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="window.deleteAdminItem('flavor', '${f.id}', '${catId}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderExtrasList(all, catId) {
        if (!elements.adminExtrasList) return;
        var list = all[catId] || [];
        elements.adminExtrasList.innerHTML = list.map(e => `
            <div class="admin-item">
                <div class="admin-item-info"><span>${e.name}</span><span>${formatPrice(e.price)}</span></div>
                <div class="admin-item-actions">
                    <button class="btn-icon" onclick="window.editAdminItem('extra', '${e.id}', '${catId}')">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="window.deleteAdminItem('extra', '${e.id}', '${catId}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderObsList(all, catId) {
        if (!elements.adminObsList) return;
        var list = all[catId] || [];
        elements.adminObsList.innerHTML = list.map(o => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <span>${o.name}</span>
                    <span>${formatPrice(o.price || 0)}</span>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-icon" onclick="window.editAdminItem('observation', '${o.id}', '${catId}')">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="window.deleteAdminItem('observation', '${o.id}', '${catId}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    window.editAdminItem = function (type, id, parentId = null) {
        adminEditContext = { type, id, parentId };
        var config = StorageManager.getConfig();
        var displayType = type === 'flavor' ? 'Producto' : (type === 'category' ? 'Categor??a' : (type === 'extra' ? 'Adicional' : 'Observaci??n'));
        elements.adminModalTitle.textContent = `Editar ${displayType}`;
        var html = '';
        if (type === 'category') {
            var item = config.categories.find(c => c.id === id);
            html = `<div class="form-group"><label>Nombre de Categor??a</label><input type="text" id="editName" value="${item.name}"></div>`;
        } else if (type === 'flavor') {
            var allProds = getActiveProductsList(config);
            var item = allProds.find(p => p.id === id) || (config.flavors[parentId] && config.flavors[parentId].find(f => f.id === id)) || { name: '', price: 0 };
            html = `<div class="form-group"><label>Nombre del Producto</label><input type="text" id="editName" value="${item.name}"></div>
                    <div class="form-group"><label>Precio Unitario ($)</label><input type="number" id="editPrice" value="${item.price || 0}"></div>`;
        } else if (type === 'extra') {
            var item = config.extras[parentId].find(e => e.id === id);
            html = `<div class="form-group"><label>Nombre</label><input type="text" id="editName" value="${item.name}"></div>
                    <div class="form-group"><label>Precio ($)</label><input type="number" id="editPrice" value="${item.price}"></div>`;
        } else if (type === 'observation') {
            var item = config.observations[parentId].find(o => o.id === id);
            html = `<div class="form-group"><label>Descripci??n / Nota</label><input type="text" id="editName" value="${item.name}"></div>
                    <div class="form-group"><label>Precio Extra si aplica ($)</label><input type="number" id="editPrice" value="${item.price || 0}"></div>`;
        }
        elements.adminModalBody.innerHTML = html;
        elements.adminModal.classList.add('open');
    };

    window.deleteAdminItem = function (type, id, pId) {
        if (!confirm('??Seguro que deseas eliminar este elemento?')) return;
        var config = StorageManager.getConfig();
        if (type === 'category') {
            config.categories = config.categories.filter(c => c.id !== id);
            if (config.products) config.products = config.products.filter(p => p.category !== id);
            if (config.flavors) delete config.flavors[id];
            if (config.extras) delete config.extras[id];
            if (config.observations) delete config.observations[id];
        } else if (type === 'flavor') {
            if (config.products) config.products = config.products.filter(p => p.id !== id);
            if (config.flavors && config.flavors[pId]) {
                config.flavors[pId] = config.flavors[pId].filter(f => f.id !== id);
            }
        } else if (type === 'extra') {
            if (config.extras && config.extras[pId]) config.extras[pId] = config.extras[pId].filter(e => e.id !== id);
        } else if (type === 'observation') {
            if (config.observations && config.observations[pId]) config.observations[pId] = config.observations[pId].filter(o => o.id !== id);
        }

        StorageManager.saveConfig(config);
        renderAdminPage();
        renderPosCategories();
        renderPosProducts();
        showNotification('Eliminado correctamente');
    };

    if (elements.cancelAdminModal) elements.cancelAdminModal.onclick = () => elements.adminModal.classList.remove('open');
    if (elements.confirmAdminModal) {
        elements.confirmAdminModal.onclick = function() {
            var config = StorageManager.getConfig();
            var { type, id, parentId } = adminEditContext;
            var name = document.getElementById('editName').value.trim();
            if (!name) {
                showNotification('Ingresa un nombre v??lido', 'error');
                return;
            }

            if (type === 'category') {
                if (id) {
                    var cat = config.categories.find(c => c.id === id);
                    if (cat) {
                        cat.name = name;
                    }
                } else {
                    var newId = 'cat_' + Date.now();
                    config.categories.push({ id: newId, name, active: true });
                    if (!config.flavors) config.flavors = {};
                    config.flavors[newId] = [];
                    if (!config.extras) config.extras = {};
                    config.extras[newId] = [];
                    if (!config.observations) config.observations = {};
                    config.observations[newId] = [];
                }
            } else if (type === 'flavor') {
                var price = +document.getElementById('editPrice').value || 0;

                if (!config.products) config.products = [];

                if (id) {
                    var prod = config.products.find(p => p.id === id);
                    if (prod) {
                        prod.name = name;
                        prod.price = price;
                    }
                    if (config.flavors && config.flavors[parentId]) {
                        var fl = config.flavors[parentId].find(f => f.id === id);
                        if (fl) {
                            fl.name = name;
                            fl.price = price;
                        }
                    }
                } else {
                    var newId = 'prod_' + Date.now();
                    var newProd = { id: newId, name, price, category: parentId, active: true };
                    config.products.push(newProd);

                    if (!config.flavors) config.flavors = {};
                    if (!config.flavors[parentId]) config.flavors[parentId] = [];
                    config.flavors[parentId].push({ id: newId, name, price, active: true });
                }
            } else if (type === 'extra') {
                if (!config.extras) config.extras = {};
                if (!config.extras[parentId]) config.extras[parentId] = [];
                var price = +document.getElementById('editPrice').value || 0;
                if (id) {
                    var e = config.extras[parentId].find(x => x.id === id);
                    if (e) {
                        e.name = name;
                        e.price = price;
                    }
                } else {
                    config.extras[parentId].push({ id: 'e_' + Date.now(), name, price, active: true });
                }
            } else if (type === 'observation') {
                if (!config.observations) config.observations = {};
                if (!config.observations[parentId]) config.observations[parentId] = [];
                var price = +document.getElementById('editPrice').value || 0;
                if (id) {
                    var o = config.observations[parentId].find(x => x.id === id);
                    if (o) {
                        o.name = name;
                        o.price = price;
                    }
                } else {
                    config.observations[parentId].push({ id: 'o_' + Date.now(), name, price, active: true });
                }
            }

            StorageManager.saveConfig(config);
            elements.adminModal.classList.remove('open');
            renderAdminPage();
            renderPosCategories();
            renderPosProducts();
            showNotification('Guardado correctamente');
        };
    }

    if (elements.addCategoryBtn) {
        elements.addCategoryBtn.onclick = function() {
            adminEditContext = { type: 'category', id: null };
            elements.adminModalTitle.textContent = 'Nueva Categor??a';
            elements.adminModalBody.innerHTML = `
                <div class="form-group"><label>Nombre de Categor??a</label><input type="text" id="editName" placeholder="Ej: Panes Especiales"></div>
            `;
            elements.adminModal.classList.add('open');
        };
    }

    if (elements.addFlavorBtn) {
        elements.addFlavorBtn.onclick = function() {
            var catId = elements.adminCategorySelectFlavors ? elements.adminCategorySelectFlavors.value : 'panaderia';
            adminEditContext = { type: 'flavor', id: null, parentId: catId };
            elements.adminModalTitle.textContent = 'Nuevo Producto';
            elements.adminModalBody.innerHTML = `
                <div class="form-group"><label>Nombre del Producto</label><input type="text" id="editName" placeholder="Ej: Croissant de Almendras"></div>
                <div class="form-group"><label>Precio Unitario ($)</label><input type="number" id="editPrice" placeholder="4500" value="0"></div>
            `;
            elements.adminModal.classList.add('open');
        };
    }

    if (elements.addExtraBtn) {
        elements.addExtraBtn.onclick = function() {
            var catId = elements.adminCategorySelectExtras.value;
            adminEditContext = { type: 'extra', id: null, parentId: catId };
            elements.adminModalTitle.textContent = 'Nuevo Adicional';
            elements.adminModalBody.innerHTML = `<div class="form-group"><label>Nombre</label><input type="text" id="editName"></div>
                <div class="form-group"><label>Precio</label><input type="number" id="editPrice" value="0"></div>`;
            elements.adminModal.classList.add('open');
        };
    }

    if (elements.addObsBtn) {
        elements.addObsBtn.onclick = function() {
            var catId = elements.adminCategorySelectObs.value;
            adminEditContext = { type: 'observation', id: null, parentId: catId };
            elements.adminModalTitle.textContent = 'Nueva Observaci??n';
            elements.adminModalBody.innerHTML = `
                <div class="form-group"><label>Nombre</label><input type="text" id="editName"></div>
                <div class="form-group"><label>Precio</label><input type="number" id="editPrice" value="0"></div>
            `;
            elements.adminModal.classList.add('open');
        };
    }

    // ============================================
    // Security / Password Logic
    // ============================================

    if (elements.confirmAdminLogin) {
        var handleLogin = function() {
            var config = StorageManager.getConfig();
            var input = elements.adminPasswordInput.value;

            if (input === config.adminPassword) {
                state.isAdminAuthenticated = true;
                elements.adminLoginModal.classList.remove('open');
                showNotification('Acceso concedido');

                // Trigger the pending action (like deletion)
                if (state.pendingAdminAction) {
                    state.pendingAdminAction();
                    state.pendingAdminAction = null;
                }

                // Trigger the pending navigation to protected page
                if (state.pendingAdminPage) {
                    var targetBtn = Array.from(elements.drawerItems).find(i => i.dataset.page === state.pendingAdminPage);
                    if (targetBtn) targetBtn.click();
                    state.pendingAdminPage = null;
                }
            } else {
                showNotification('Contrase??a incorrecta', 'error');
                elements.adminPasswordInput.value = '';
                elements.adminPasswordInput.focus();
            }
        };

        elements.confirmAdminLogin.addEventListener('click', handleLogin);
        elements.adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }

    if (elements.closeAdminLoginModal) {
        elements.closeAdminLoginModal.addEventListener('click', function() {
            elements.adminLoginModal.classList.remove('open');
            state.pendingAdminPage = null;
            state.pendingAdminAction = null;
        });
    }

    if (elements.saveAdminPasswordBtn) {
        elements.saveAdminPasswordBtn.addEventListener('click', function() {
            var newPass = elements.newAdminPassword.value;
            var confirmPass = elements.confirmAdminPassword.value;

            if (newPass.length < 4) {
                showNotification('La contrase??a debe tener al menos 4 caracteres', 'error');
                return;
            }

            if (newPass !== confirmPass) {
                showNotification('Las contrase??as no coinciden', 'error');
                return;
            }

            var config = StorageManager.getConfig();
            config.adminPassword = newPass;
            StorageManager.saveConfig(config);

            showNotification('Contrase??a actualizada correctamente');
            elements.newAdminPassword.value = '';
            elements.confirmAdminPassword.value = '';
        });
    }

    // ============================================
    // Order Counter Reset Functionality
    // ============================================
    var resetOrderCounterBtn = document.getElementById('resetOrderCounterBtn');
    var currentOrderCounterEl = document.getElementById('currentOrderCounter');

    // Load and display current counter
    function loadCurrentOrderCounter() {
        var currentOrderCounterEl = document.getElementById('currentOrderCounter');
        if (!currentOrderCounterEl) return;

        var localCounter = localStorage.getItem('foodx_order_counter') || '0';
        currentOrderCounterEl.textContent = '#' + String(parseInt(localCounter)).padStart(3, '0');
    }

    // Reset counter to 0
    function resetOrderCounter() {
        try {
            // Reset local storage
            localStorage.setItem('foodx_order_counter', '0');
            localStorage.setItem('foodx_last_order_date', new Date().toDateString());

            showNotification('??? Contador reiniciado a #001');
            loadCurrentOrderCounter();
        } catch (error) {
            console.error('Error resetting counter:', error);
            showNotification('?????? Error al reiniciar: ' + error.message, 'error');
        }
    }

    if (resetOrderCounterBtn) {
        resetOrderCounterBtn.addEventListener('click', function() {
            if (confirm('??Est??s seguro que deseas reiniciar el contador de pedidos a #001?')) {
                resetOrderCounter();
            }
        });
    }

    // Load counter when navigating to admin
    var originalRenderAdminPage = typeof renderAdminPage === 'function' ? renderAdminPage : null;
    if (originalRenderAdminPage) {
        var extendedRenderAdmin = function() {
            originalRenderAdminPage();
            loadCurrentOrderCounter();
        };
        // Override if needed - for now just call on page load
    }

    // Also load on DOMContentLoaded for admin page
    loadCurrentOrderCounter();

    function showNotification(message, type = 'success') {
        var notification = document.createElement('div');
        var isError = type === 'error';
        var bgColor = isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(16, 185, 129, 0.95)';
        var icon = isError ? 'alert-circle' : 'check-circle';

        // Vibration and sound for errors
        if (isError) {
            // Vibrate (mobile devices)
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]); // vibrate-pause-vibrate pattern
            }

            // Play error sound using Web Audio API
            try {
                var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                var oscillator = audioCtx.createOscillator();
                var gainNode = audioCtx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.frequency.value = 400; // Low frequency buzz
                oscillator.type = 'square';
                gainNode.gain.value = 0.3;

                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                oscillator.stop(audioCtx.currentTime + 0.2);
            } catch (e) {
                console.log('Audio not supported');
            }
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            backdrop-filter: blur(10px);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideInDown 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        notification.innerHTML = `<i data-lucide="${icon}" style="width: 18px; height: 18px;"></i> ${message}`;
        document.body.appendChild(notification);
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(function() {
            notification.style.animation = 'fadeOutUp 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // Initialize Cloud Sync
    if (typeof StorageManager.initCloudSync === 'function') {
        StorageManager.initCloudSync(
            // Orders & Expenses callback
            function() {
                if (state.currentPage === 'checkout') renderCheckoutPage();
                if (state.currentPage === 'history') renderHistoryPage();
                if (state.currentPage === 'new-order') updateOrderTotal();
                if (state.currentPage === 'expenses') renderExpensesPage();
            },
            // Config callback (Admin changes from other devices)
            function() {
                if (state.currentPage === 'admin') renderAdminPage();
                if (state.currentPage === 'expenses') renderExpensesPage();
                if (state.currentPage === 'new-order') {
                    initializeCategories();
                    updateOrderTotal();
                }
                console.log('Config synced from cloud');
            },
            // Print callback (Remote print from other devices) - DISABLED
            null
        );
    }

    // Initialize
    updateOrderTotal();
});

