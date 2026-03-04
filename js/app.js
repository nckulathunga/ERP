/**
 * App.js
 * Main Controller
 */

const App = {
    currentView: 'dashboard',

    init() {
        this.setupNavigation();
        this.checkAuth();
        this.updateUserInfo();
        this.updateLanguageSelectors();
    },

    updateLanguageSelectors() {
        const lang = I18n.currentLang;
        const desktopSelect = document.getElementById('desktop-lang-select');
        const mobileSelect = document.getElementById('mobile-lang-select');
        if (desktopSelect) desktopSelect.value = lang;
        if (mobileSelect) mobileSelect.value = lang;
    },

    checkAuth() {
        if (!Auth.isAuthenticated()) {
            this.showLogin();
        } else {
            this.showApp();
        }
    },

    showLogin() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');

        document.getElementById('auth-container').innerHTML = `
            <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md glass-card fade-in">
                <div class="text-center mb-8">
                    <div class="inline-block p-3 rounded-full bg-blue-100 text-primary mb-4">
                         <span class="text-4xl">🚛</span>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800">${I18n.t('welcome_back')}</h1>
                    <p class="text-gray-500 text-sm">${I18n.t('sign_in_text')}</p>
                    
                     <div class="absolute top-4 right-4">
                        <select onchange="I18n.setLanguage(this.value)" class="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:ring-0 cursor-pointer">
                            <option value="en" ${I18n.currentLang === 'en' ? 'selected' : ''}>EN</option>
                            <option value="si" ${I18n.currentLang === 'si' ? 'selected' : ''}>SI</option>
                            <option value="ta" ${I18n.currentLang === 'ta' ? 'selected' : ''}>TA</option>
                        </select>
                    </div>

                </div>
                
                <form onsubmit="App.handleLogin(event)" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('email')}</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value="admin@fleetflow.com" 
                            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            required
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('password')}</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value="password" 
                            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            required
                        >
                    </div>
                    <button type="submit" class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                        ${I18n.t('sign_in')}
                    </button>
                    
                    <div class="text-center mt-4">
                         <button type="button" onclick="App.showSignup()" class="text-sm text-primary hover:underline">
                            ${I18n.t('no_account')}
                        </button>
                    </div>

                    <div class="text-center text-xs text-gray-400 mt-4">
                        <p>${I18n.t('demo_credentials')}</p>
                        <p>admin@fleetflow.com / password</p>
                        <button type="button" onclick="localStorage.clear(); window.location.reload();" class="mt-4 text-red-400 hover:text-red-600 underline">
                            ${I18n.t('reset_demo')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    showSignup() {
        document.getElementById('auth-container').innerHTML = UI.renderSignupForm();
    },

    handleSignup(e) {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const role = e.target.role.value;

        const result = Auth.signup(name, email, password, role);
        if (result.success) {
            alert(result.message);
            this.showLogin();
        } else {
            alert(result.message);
        }
    },

    showApp() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');

        // Render Navigation based on Role
        this.renderSidebar();

        // Default View
        this.navigateTo('dashboard');
    },

    updateUserInfo() {
        const user = Auth.getCurrentUser();
        if (user) {
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-role').textContent = user.role.toUpperCase();
            document.getElementById('user-avatar').textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        }
    },

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = Auth.login(email, password);
        if (result.success) {
            this.checkAuth();
            this.updateUserInfo();
        } else {
            alert(result.message);
        }
    },

    handleLogout() {
        Auth.logout();
    },

    setupNavigation() {
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());

        // Mobile Interactions
        const menuBtn = document.getElementById('mobile-menu-btn');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        const sidebar = document.getElementById('sidebar');

        const toggleSidebar = () => {
            sidebar.classList.toggle('sidebar-open');
            sidebar.classList.toggle('hidden'); // Simplify for mobile
            overlay.classList.toggle('hidden');
        };

        menuBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    },

    renderSidebar() {
        const nav = document.getElementById('sidebar-nav');

        const items = [
            { id: 'dashboard', label: I18n.t('dashboard'), icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', permission: 'view_dashboard' },
            { id: 'vehicles', label: I18n.t('fleet'), icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16v.01M21 12.14l-3.328-1.745A1.996 1.996 0 0017.306 10H15V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8l3.125 1.625c.343.179.695.344 1.053.493V21H16v-2.015c.358-.149.71-.314 1.053-.493l1.822.947A2 2 0 0021 17.653V12.14z', permission: 'manage_vehicles' },
            { id: 'invoices', label: I18n.t('invoices'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', permission: 'manage_invoices' },
            { id: 'expenses', label: I18n.t('expenses'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', permission: 'manage_expenses' },
            { id: 'users', label: I18n.t('users'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', permission: 'manage_users' },
        ];

        nav.innerHTML = items
            .filter(item => Auth.hasPermission(item.permission))
            .map(item => `
                <a href="#" onclick="event.preventDefault(); App.navigateTo('${item.id}')" class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors">
                    <svg class="mr-3 h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path></svg>
                    ${item.label}
                </a>
            `).join('');
    },

    navigateTo(pageId) {
        this.currentView = pageId;
        this.renderSidebar();

        // Specific view permission checks
        if (pageId === 'dashboard' && !Auth.hasPermission('view_dashboard')) {
            const nextBest = ['vehicles', 'expenses', 'invoices'].find(p => Auth.hasPermission(`manage_${p}`));
            if (nextBest) return this.navigateTo(nextBest);
        }

        if (pageId === 'users' && !Auth.hasPermission('manage_users')) {
            return this.navigateTo('dashboard');
        }

        switch (pageId) {
            case 'dashboard':
                UI.renderDashboard();
                break;
            case 'vehicles':
                UI.renderVehicles();
                break;
            case 'invoices':
                UI.renderInvoices();
                break;
            case 'expenses':
                UI.renderExpenses();
                break;
            case 'users':
                UI.renderUserManagement();
                break;
        }
    },

    handleUserAction(userId, status) {
        if (confirm(`Are you sure you want to set this user to ${status}?`)) {
            Auth.updateUserStatus(userId, status);
            this.navigateTo('users'); // Refresh
        }
    },

    editUser(userId) {
        this.openModal('edit_user', userId);
    },

    handleEditUserSubmit(e, userId) {
        e.preventDefault();
        const data = new FormData(e.target);

        const updates = {
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password'),
            role: data.get('role'),
            status: data.get('status')
        };

        Store.update('users', userId, updates);
        this.closeModal();
        this.navigateTo('users');
    },

    deleteUser(userId) {
        if (confirm(I18n.t('confirm_delete'))) {
            Store.delete('users', userId);
            this.navigateTo('users');
        }
    },

    // Role Management
    addRole() {
        this.openModal('add_role');
    },

    editRole(oldName) {
        this.openModal('edit_role', oldName);
    },

    deleteRole(roleName) {
        if (confirm(I18n.t('confirm_delete'))) {
            let roles = Store.getAll('roles') || ['admin', 'manager', 'finance', 'user'];
            roles = roles.filter(r => r !== roleName);
            Store.save('roles', roles);
            this.navigateTo('users');
        }
    },

    handleAddRoleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const roleName = data.get('roleName').toLowerCase().trim();
        const permissions = data.getAll('permissions');

        let roles = Store.getAll('roles') || [];
        if (!roles.find(r => r.name === roleName) && roleName) {
            roles.push({ name: roleName, permissions });
            Store.save('roles', roles);
        }
        this.closeModal();
        this.navigateTo('users');
    },

    handleEditRoleSubmit(e, oldName) {
        e.preventDefault();
        const data = new FormData(e.target);
        const newName = data.get('roleName').toLowerCase().trim();
        const permissions = data.getAll('permissions');

        let roles = Store.getAll('roles') || [];
        const index = roles.findIndex(r => r.name === oldName);
        if (index !== -1 && newName) {
            roles[index] = { name: newName, permissions };
            Store.save('roles', roles);

            // Also update users with old role
            const users = Store.getAll('users');
            users.forEach(u => {
                if (u.role === oldName) {
                    Store.update('users', u.id, { role: newName });
                }
            });
        }
        this.closeModal();
        this.navigateTo('users');
    },

    // --- Actions ---

    viewVehicleDetails(id) {
        UI.renderVehicleDetails(id);
    },

    openModal(type, id = null) {
        if (type === 'vehicle') {
            UI.renderModal(I18n.t('add_vehicle'), UI.renderVehicleForm());
        } else if (type === 'fuel') {
            UI.renderModal(I18n.t('log_fuel'), UI.renderFuelForm(id));
        } else if (type === 'maintenance') {
            UI.renderModal(I18n.t('log_maintenance'), UI.renderMaintenanceForm(id));
        } else if (type === 'invoice') {
            UI.renderModal(I18n.t('create_invoice'), UI.renderInvoiceForm());
        } else if (type === 'edit_user') {
            console.log('Edit user called with ID:', id);
            const user = Store.getById('users', id);
            console.log('User found:', user);
            if (user) {
                UI.renderModal(I18n.t('edit_user'), UI.renderEditUserForm(user));
            } else {
                console.error('User not found with ID:', id);
                alert('User not found!');
            }
        } else if (type === 'edit_vehicle') {
            const vehicle = Store.getById('vehicles', id);
            if (vehicle) {
                UI.renderModal(I18n.t('edit_vehicle'), UI.renderEditVehicleForm(vehicle));
            }
        } else if (type === 'edit_fuel') {
            const log = Store.getById('fuelLogs', id);
            if (log) {
                UI.renderModal(I18n.t('edit_fuel_log'), UI.renderEditFuelForm(log));
            }
        } else if (type === 'edit_maintenance') {
            const log = Store.getById('maintenanceLogs', id);
            if (log) {
                UI.renderModal(I18n.t('edit_maintenance_log'), UI.renderEditMaintenanceForm(log));
            }
        } else if (type === 'edit_invoice') {
            const invoice = Store.getById('invoices', id);
            if (invoice) {
                UI.renderModal(I18n.t('edit_invoice'), UI.renderEditInvoiceForm(invoice));
            }
        } else if (type === 'general_expense') {
            UI.renderModal(I18n.t('log_general_expense'), UI.renderGeneralExpenseForm());
        } else if (type === 'edit_general_expense') {
            const expense = Store.getById('generalExpenses', id);
            if (expense) {
                UI.renderModal(I18n.t('edit_expense'), UI.renderEditGeneralExpenseForm(expense));
            }
        } else if (type === 'add_role') {
            UI.renderModal(I18n.t('add_role'), UI.renderRoleForm());
        } else if (type === 'edit_role') {
            UI.renderModal(I18n.t('edit_role'), UI.renderRoleForm(id));
        }
    },

    closeModal() {
        document.getElementById('modal-container').innerHTML = '';
    },

    handleVehicleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const vehicle = {
            id: 'V' + Date.now().toString().slice(-4),
            plate: data.get('plate'),
            make: data.get('make'),
            model: data.get('model'),
            year: parseInt(data.get('year')),
            mileage: parseInt(data.get('mileage')),
            status: 'Active'
        };

        Store.add('vehicles', vehicle);
        this.closeModal();
        this.navigateTo('vehicles');
    },

    editVehicle(id) {
        this.openModal('edit_vehicle', id);
    },

    handleEditVehicleSubmit(e, id) {
        e.preventDefault();
        const data = new FormData(e.target);
        const updates = {
            plate: data.get('plate'),
            make: data.get('make'),
            model: data.get('model'),
            year: parseInt(data.get('year')),
            mileage: parseInt(data.get('mileage')),
            status: data.get('status')
        };

        Store.update('vehicles', id, updates);
        this.closeModal();
        this.navigateTo('vehicles');
    },

    editVehicle(id) {
        this.openModal('edit_vehicle', id);
    },

    deleteVehicle(id) {
        if (confirm(I18n.t('confirm_delete'))) {
            Store.delete('vehicles', id);
            this.navigateTo('vehicles');
        }
    },

    handleEditVehicleSubmit(e, id) {
        e.preventDefault();
        const data = new FormData(e.target);
        const updates = {
            plate: data.get('plate'),
            make: data.get('make'),
            model: data.get('model'),
            year: parseInt(data.get('year')),
            mileage: parseInt(data.get('mileage')),
            status: data.get('status')
        };

        Store.update('vehicles', id, updates);
        this.closeModal();
        this.navigateTo('vehicles');
    },

    handleFuelSubmit(e, vid) {
        e.preventDefault();
        const data = new FormData(e.target);
        const vehicleId = vid || data.get('vehicleId');
        const log = {
            id: Date.now(),
            vehicleId: vehicleId,
            date: data.get('date'),
            liters: parseFloat(data.get('liters')),
            cost: parseFloat(data.get('cost')),
            odometer: parseInt(data.get('odometer'))
        };

        // Update Vehicle Mileage
        const vehicle = Store.getById('vehicles', vehicleId);
        if (vehicle && log.odometer > vehicle.mileage) {
            Store.update('vehicles', vehicleId, { mileage: log.odometer });
        }

        Store.add('fuelLogs', log);
        this.closeModal();
        if (this.currentView === 'expenses') {
            this.navigateTo('expenses');
        } else {
            this.viewVehicleDetails(vehicleId);
        }
    },

    deleteFuelLog(id) {
        if (confirm(I18n.t('confirm_delete'))) {
            const log = Store.getById('fuelLogs', id);
            if (log) {
                const vehicleId = log.vehicleId;
                Store.delete('fuelLogs', id);
                if (this.currentView === 'expenses') {
                    this.navigateTo('expenses');
                } else {
                    this.viewVehicleDetails(vehicleId);
                }
            }
        }
    },

    editMaintenanceLog(id) {
        this.openModal('edit_maintenance', id);
    },

    handleEditMaintenanceSubmit(e, id) {
        e.preventDefault();
        const data = new FormData(e.target);
        const log = Store.getById('maintenanceLogs', id);

        const updates = {
            date: data.get('date'),
            description: data.get('description'),
            type: data.get('type'),
            cost: parseFloat(data.get('cost'))
        };

        Store.update('maintenanceLogs', id, updates);

        this.closeModal();
        if (this.currentView === 'expenses') {
            this.navigateTo('expenses');
        } else if (log) {
            this.viewVehicleDetails(log.vehicleId);
        }
    },

    deleteMaintenanceLog(id) {
        if (confirm(I18n.t('confirm_delete'))) {
            const log = Store.getById('maintenanceLogs', id);
            if (log) {
                const vehicleId = log.vehicleId;
                Store.delete('maintenanceLogs', id);
                if (this.currentView === 'expenses') {
                    this.navigateTo('expenses');
                } else {
                    this.viewVehicleDetails(vehicleId);
                }
            }
        }
    },

    handleInvoiceSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const invoice = {
            id: 'INV-' + Date.now().toString().slice(-5),
            clientId: data.get('client'),
            issueDate: data.get('date'),
            amount: parseFloat(data.get('amount')),
            status: data.get('status')
        };

        Store.add('invoices', invoice);
        this.closeModal();
        this.navigateTo('invoices');
    },

    editInvoice(id) {
        this.openModal('edit_invoice', id);
    },

    handleEditInvoiceSubmit(e, id) {
        e.preventDefault();
        const data = new FormData(e.target);

        const updates = {
            clientId: data.get('client'),
            issueDate: data.get('date'),
            amount: parseFloat(data.get('amount')),
            status: data.get('status')
        };

        Store.update('invoices', id, updates);
        this.closeModal();
        this.navigateTo('invoices');
    },

    deleteInvoice(id) {
        if (confirm(I18n.t('confirm_delete'))) {
            Store.delete('invoices', id);
            this.navigateTo('invoices');
        }
    },

    handleGeneralExpenseSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const expense = {
            id: Date.now(),
            type: data.get('type'),
            date: data.get('date'),
            description: data.get('description'),
            cost: parseFloat(data.get('cost')),
            vehicleId: data.get('vehicleId') || null
        };

        Store.add('generalExpenses', expense);
        this.closeModal();
        this.navigateTo('expenses');
    },

    editGeneralExpense(id) {
        this.openModal('edit_general_expense', id);
    },

    handleEditGeneralExpenseSubmit(e, id) {
        e.preventDefault();
        const data = new FormData(e.target);
        const updates = {
            type: data.get('type'),
            date: data.get('date'),
            description: data.get('description'),
            cost: parseFloat(data.get('cost')),
            vehicleId: data.get('vehicleId') || null
        };

        Store.update('generalExpenses', id, updates);
        this.closeModal();
        this.navigateTo('expenses');
    },

    deleteGeneralExpense(id) {
        if (confirm(I18n.t('confirm_delete'))) {
            Store.delete('generalExpenses', id);
            this.navigateTo('expenses');
        }
    },

    printInvoice(id) {
        const invoice = Store.getById('invoices', id);
        if (!invoice) return;

        // Simple Print View Injection
        const printArea = document.createElement('div');
        printArea.id = 'invoice-print-section';
        printArea.innerHTML = `
            <div class="p-8 max-w-4xl mx-auto">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-4xl font-bold text-gray-800">INVOICE</h1>
                    <div class="text-right">
                        <p class="font-bold text-xl text-primary">${I18n.t('app_name')}</p>
                        <p class="text-sm text-gray-500">123 Logistics Way</p>
                    </div>
                </div>
                <div class="bg-gray-50 p-6 rounded-lg mb-8">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500 uppercase">${I18n.t('bill_to')}</p>
                            <p class="font-bold text-lg">${invoice.clientId}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-500 uppercase">${I18n.t('invoice_num')}</p>
                            <p class="font-bold">${invoice.id}</p>
                            <p class="text-sm text-gray-500 uppercase mt-2">${I18n.t('issue_date')}</p>
                            <p class="font-bold">${invoice.issueDate}</p>
                        </div>
                    </div>
                </div>
                <table class="w-full mb-8">
                    <thead>
                        <tr class="border-b-2 border-gray-800">
                            <th class="text-left py-2">${I18n.t('description')}</th>
                            <th class="text-right py-2">${I18n.t('amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200">
                            <td class="py-4">${I18n.t('logistics_services')}</td>
                            <td class="text-right py-4">${UI.formatCurrency(invoice.amount)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td class="pt-4 font-bold text-right">${I18n.t('total')}</td>
                            <td class="pt-4 font-bold text-right text-xl">${UI.formatCurrency(invoice.amount)}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="mt-12 text-center text-gray-500 text-sm">
                    <p>${I18n.t('thank_you')}</p>
                </div>
            </div>
        `;
        document.body.appendChild(printArea);
        window.print();
        document.body.removeChild(printArea);
    },

    exportDashboard(format) {
        if (!Auth.hasPermission('export_reports')) {
            alert(I18n.t('no_permission') || 'You do not have permission to export reports.');
            return;
        }
        // 1. Get filtered data (reusing UI filter logic if possible, or re-implementing)
        let fuelLogs = Store.getAll('fuelLogs') || [];
        let maintenanceLogs = Store.getAll('maintenanceLogs') || [];
        let generalExpenses = Store.getAll('generalExpenses') || [];
        let invoices = Store.getAll('invoices') || [];

        // Apply date filters from UI
        fuelLogs = UI.filterByDate(fuelLogs, 'date');
        maintenanceLogs = UI.filterByDate(maintenanceLogs, 'date');
        generalExpenses = UI.filterByDate(generalExpenses, 'date');
        invoices = UI.filterByDate(invoices, 'issueDate');

        // Apply vehicle filter from UI
        const currentVehicleId = UI.dashboardFilter.vehicleId;
        if (currentVehicleId !== 'all') {
            fuelLogs = fuelLogs.filter(l => l.vehicleId === currentVehicleId);
            maintenanceLogs = maintenanceLogs.filter(l => l.vehicleId === currentVehicleId);
            generalExpenses = generalExpenses.filter(l => l.vehicleId === currentVehicleId);
        }

        const fileName = `FleetFlow_Report_${new Date().toISOString().split('T')[0]}`;

        if (format === 'excel') {
            this.exportToExcel(fuelLogs, maintenanceLogs, generalExpenses, invoices, fileName);
        } else if (format === 'pdf') {
            this.exportToPDF(fuelLogs, maintenanceLogs, generalExpenses, invoices, fileName);
        }
    },

    exportExpenses(format) {
        if (!Auth.hasPermission('export_reports')) {
            alert(I18n.t('no_permission') || 'You do not have permission to export reports.');
            return;
        }
        let fuel = Store.getAll('fuelLogs') || [];
        let maintenance = Store.getAll('maintenanceLogs') || [];
        let generalExpenses = Store.getAll('generalExpenses') || [];

        // Apply filters
        fuel = UI.filterItemsByDate(fuel, UI.expensesFilter, 'date');
        maintenance = UI.filterItemsByDate(maintenance, UI.expensesFilter, 'date');
        generalExpenses = UI.filterItemsByDate(generalExpenses, UI.expensesFilter, 'date');

        if (UI.expensesFilter.vehicleId !== 'all') {
            fuel = fuel.filter(l => l.vehicleId === UI.expensesFilter.vehicleId);
            maintenance = maintenance.filter(l => l.vehicleId === UI.expensesFilter.vehicleId);
            generalExpenses = generalExpenses.filter(l => l.vehicleId === UI.expensesFilter.vehicleId);
        }

        const fileName = `FleetFlow_Expenses_${new Date().toISOString().split('T')[0]}`;

        if (format === 'excel') {
            this.exportToExcel(fuel, maintenance, generalExpenses, [], fileName);
        } else if (format === 'pdf') {
            this.exportToPDF(fuel, maintenance, generalExpenses, [], fileName);
        }
    },

    exportToExcel(fuel, maintenance, general, invoices, fileName) {
        const wb = XLSX.utils.book_new();

        // Helper to get plate number
        const getPlate = (id) => Store.getById('vehicles', id)?.plate || id;

        // Fuel Logs Sheet
        const fuelData = fuel.map(l => ({
            Date: l.date,
            'Vehicle (Plate)': getPlate(l.vehicleId),
            Liters: l.liters,
            'Cost (Rs.)': l.cost,
            'Odometer (km)': l.odometer
        }));
        const wsFuel = XLSX.utils.json_to_sheet(fuelData);
        XLSX.utils.book_append_sheet(wb, wsFuel, "Fuel Logs");

        // Maintenance Sheet
        const maintData = maintenance.map(l => ({
            Date: l.date,
            'Vehicle (Plate)': getPlate(l.vehicleId),
            Description: l.description,
            Type: l.type,
            'Cost (Rs.)': l.cost
        }));
        const wsMaint = XLSX.utils.json_to_sheet(maintData);
        XLSX.utils.book_append_sheet(wb, wsMaint, "Maintenance");

        // General Expenses Sheet
        const generalData = general.map(l => ({
            Date: l.date,
            Category: I18n.t(l.type) || l.type,
            Description: l.description,
            'Vehicle (Plate)': getPlate(l.vehicleId),
            'Cost (Rs.)': l.cost
        }));
        const wsGeneral = XLSX.utils.json_to_sheet(generalData);
        XLSX.utils.book_append_sheet(wb, wsGeneral, "General Expenses");

        // Invoices Sheet
        const invData = invoices.map(i => ({
            'Invoice #': i.id,
            'Client Name': i.clientId,
            'Issue Date': i.issueDate,
            'Amount (Rs.)': i.amount,
            Status: i.status
        }));
        const wsInv = XLSX.utils.json_to_sheet(invData);
        XLSX.utils.book_append_sheet(wb, wsInv, "Invoices");

        XLSX.writeFile(wb, `${fileName}.xlsx`);
    },

    exportToPDF(fuel, maintenance, general, invoices, fileName) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert('PDF library (jsPDF) is not loaded. Please check your internet connection and reload.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        if (typeof doc.autoTable !== 'function') {
            alert('PDF Table library (jspdf-autotable) is not loaded. Please reload the page.');
            return;
        }

        const getPlate = (id) => Store.getById('vehicles', id)?.plate || id;

        doc.setFontSize(18);
        doc.text('FleetFlow Dashboard Report', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        let finalY = 35;

        // Invoices Section
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Invoices Summary', 14, finalY + 10);
        doc.autoTable({
            startY: finalY + 15,
            head: [['Invoice #', 'Client', 'Date', 'Amount (Rs.)', 'Status']],
            body: invoices.map(i => [i.id, i.clientId, i.issueDate, i.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }), i.status]),
        });
        finalY = doc.lastAutoTable.finalY;

        // Fuel Section
        doc.text('Fuel Consumption History', 14, finalY + 15);
        doc.autoTable({
            startY: finalY + 20,
            head: [['Date', 'Vehicle (Plate)', 'Liters', 'Cost (Rs.)', 'Odometer (km)']],
            body: fuel.map(l => [l.date, getPlate(l.vehicleId), l.liters, l.cost.toLocaleString(undefined, { minimumFractionDigits: 2 }), l.odometer.toLocaleString()]),
        });
        finalY = doc.lastAutoTable.finalY;

        // Maintenance Section
        if (finalY > 210) { doc.addPage(); finalY = 10; }
        doc.text('Maintenance History', 14, finalY + 15);
        doc.autoTable({
            startY: finalY + 20,
            head: [['Date', 'Vehicle (Plate)', 'Description', 'Type', 'Cost (Rs.)']],
            body: maintenance.map(l => [l.date, getPlate(l.vehicleId), l.description, l.type, l.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })]),
        });
        finalY = doc.lastAutoTable.finalY;

        // General Expenses Section
        if (finalY > 210) { doc.addPage(); finalY = 10; }
        doc.text('General Expenses History', 14, finalY + 15);
        doc.autoTable({
            startY: finalY + 20,
            head: [['Date', 'Category', 'Description', 'Vehicle (Plate)', 'Cost (Rs.)']],
            body: general.map(l => [l.date, I18n.t(l.type) || l.type, l.description, getPlate(l.vehicleId), l.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })]),
        });

        doc.save(`${fileName}.pdf`);
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => App.init());
