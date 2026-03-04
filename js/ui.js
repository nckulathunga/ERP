/**
 * UI.js
 * Handles rendering of all components and views.
 */

const UI = {
    content: document.getElementById('main-content'),
    modalContainer: document.getElementById('modal-container'),

    clearContent() {
        this.content.innerHTML = '';
    },

    // --- Signup & Admin ---

    renderSignupForm() {
        return `
            <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md glass-card fade-in">
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">${I18n.t('create_account')}</h1>
                    <p class="text-gray-500 text-sm">${I18n.t('join_fleet')}</p>
                </div>
                
                <form onsubmit="App.handleSignup(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('full_name')}</label>
                        <input type="text" name="name" required class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none">
                    </div>
                    <div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('email')}</label>
                        <input type="email" name="email" required class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('password')}</label>
                        <input type="password" name="password" required class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('role_request')}</label>
                        <select name="role" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none">
                            ${(Store.getAll('roles') || ['admin', 'manager', 'finance', 'supervisor', 'driver', 'accountant']).map(role => {
            const roleName = typeof role === 'object' ? role.name : role;
            return `<option value="${roleName}">${roleName === 'admin' ? 'Admin' : I18n.t(roleName)}</option>`;
        }).join('')}
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg">
                        ${I18n.t('sign_up')}
                    </button>
                    <div class="text-center mt-4">
                        <button type="button" onclick="App.showLogin()" class="text-sm text-primary hover:underline">
                            ${I18n.t('already_have_account')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderUserManagement() {
        this.clearContent();
        const users = Store.getAll('users');
        const roles = Store.getAll('roles') || ['admin', 'manager', 'finance', 'supervisor', 'driver', 'accountant'];

        const html = `
             <div class="fade-in space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">${I18n.t('user_management')}</h2>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm glass-card overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('full_name')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('email')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('password')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('role_request')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('status')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${users.map(u => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 font-medium text-gray-900">${u.name}</td>
                                    <td class="px-6 py-4 text-gray-500">${u.email}</td>
                                    <td class="px-6 py-4 text-gray-500 font-mono text-xs">••••••</td>
                                    <td class="px-6 py-4 capitalize text-gray-700">${u.role}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                            ${u.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 flex items-center gap-2">
                                        ${u.status === 'pending' ? `
                                            <button onclick="App.handleUserAction('${u.id}', 'active')" class="text-green-600 hover:text-green-800 font-medium text-sm">${I18n.t('approve')}</button>
                                            <button onclick="App.handleUserAction('${u.id}', 'rejected')" class="text-red-600 hover:text-red-800 font-medium text-sm">${I18n.t('reject')}</button>
                                        ` : ''}
                                        ${Auth.hasPermission('manage_users') ? `
                                            <button onclick="App.editUser('${u.id}')" class="text-blue-600 hover:text-blue-800 font-medium text-sm">${I18n.t('edit')}</button>
                                            <button onclick="App.deleteUser('${u.id}')" class="text-red-600 hover:text-red-800 font-medium text-sm">${I18n.t('delete')}</button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${users.length === 0 ? this.renderEmptyState('No users found') : ''}
                </div>

                <!-- Role Management Section -->
                <div class="bg-white rounded-xl shadow-sm glass-card p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-700">${I18n.t('role_management')}</h3>
                        ${Auth.hasPermission('manage_users') ? `
                            <button onclick="App.openModal('add_role')" class="bg-primary hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">${I18n.t('add_role')}</button>
                        ` : ''}
                    </div>
                    <div class="flex flex-wrap gap-4">
                        ${roles.map(role => {
            const roleName = typeof role === 'object' ? role.name : role;
            const permissions = typeof role === 'object' ? role.permissions : [];
            return `
                                <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 min-w-[200px] flex flex-col justify-between">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="capitalize font-bold text-gray-800">${roleName}</span>
                                        ${Auth.hasPermission('manage_users') ? `
                                            <div class="flex gap-1">
                                                <button onclick="App.editRole('${roleName}')" class="text-blue-600 hover:text-blue-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button onclick="App.deleteRole('${roleName}')" class="text-red-600 hover:text-red-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="space-y-1">
                                        ${permissions.length > 0 ? permissions.map(p => `
                                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                                <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                ${I18n.t(p)}
                                            </div>
                                        `).join('') : '<span class="text-xs text-gray-400 italic">No permissions</span>'}
                                    </div>
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>
            </div>
        `;
        this.content.innerHTML = html;
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            currencyDisplay: 'code'
        }).format(amount).replace('LKR', I18n.getCurrencySymbol());
    },

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString();
    },

    createCard(title, value, subtext = '', colorClass = 'text-primary') {
        return `
            <div class="glass-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">${title}</h3>
                <p class="mt-2 text-3xl font-bold ${colorClass}">${value}</p>
                <p class="mt-1 text-xs text-gray-400">${subtext}</p>
            </div>
        `;
    },

    // --- Views ---

    // Dashboard filter state
    dashboardFilter: {
        type: 'all', // 'all', 'month', 'year', 'custom'
        fromDate: null,
        toDate: null,
        vehicleId: 'all'
    },

    setDashboardFilter(type, fromDate = null, toDate = null, vehicleId = null) {
        this.dashboardFilter = {
            ...this.dashboardFilter,
            type,
            fromDate,
            toDate
        };
        if (vehicleId !== null) this.dashboardFilter.vehicleId = vehicleId;
        this.renderDashboard();
    },

    applyVehicleFilter() {
        const vehicleId = document.getElementById('filter-vehicle').value;
        this.dashboardFilter.vehicleId = vehicleId;
        this.renderDashboard();
    },

    applyCustomFilter() {
        const from = document.getElementById('filter-from').value;
        const to = document.getElementById('filter-to').value;
        if (from && to) {
            this.setDashboardFilter('custom', from, to);
        }
    },

    // Expenses filter state
    expensesFilter: {
        type: 'all',
        fromDate: null,
        toDate: null,
        vehicleId: 'all'
    },

    setExpensesFilter(type, fromDate = null, toDate = null, vehicleId = null) {
        this.expensesFilter = {
            ...this.expensesFilter,
            type,
            fromDate,
            toDate
        };
        if (vehicleId !== null) this.expensesFilter.vehicleId = vehicleId;
        this.renderExpenses();
    },

    applyExpensesVehicleFilter() {
        const vehicleId = document.getElementById('filter-expenses-vehicle').value;
        this.expensesFilter.vehicleId = vehicleId;
        this.renderExpenses();
    },

    applyExpensesCustomFilter() {
        const from = document.getElementById('filter-expenses-from').value;
        const to = document.getElementById('filter-expenses-to').value;
        if (from && to) {
            this.setExpensesFilter('custom', from, to);
        }
    },

    filterItemsByDate(items, filter, dateField = 'date') {
        const { type, fromDate, toDate } = filter;
        if (type === 'all') return items;

        const now = new Date();
        let startDate, endDate;

        if (type === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (type === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        } else if (type === 'custom' && fromDate && toDate) {
            startDate = new Date(fromDate);
            endDate = new Date(toDate);
        } else {
            return items;
        }

        return items.filter(item => {
            const itemDate = new Date(item[dateField]);
            return itemDate >= startDate && itemDate <= endDate;
        });
    },

    filterByDate(items, dateField = 'date') {
        return this.filterItemsByDate(items, this.dashboardFilter, dateField);
    },

    renderDashboard() {
        if (!Auth.hasPermission('admin')) {
            this.content.innerHTML = this.renderEmptyState(I18n.t('access_denied') || 'Access Denied');
            return;
        }
        try {
            this.clearContent();

            // Get all data
            let fuelLogs = Store.getAll('fuelLogs') || [];
            let maintenanceLogs = Store.getAll('maintenanceLogs') || [];
            let generalExpenses = Store.getAll('generalExpenses') || [];
            let invoices = Store.getAll('invoices') || [];

            // Apply date filter
            fuelLogs = this.filterByDate(fuelLogs, 'date');
            maintenanceLogs = this.filterByDate(maintenanceLogs, 'date');
            generalExpenses = this.filterByDate(generalExpenses, 'date');
            invoices = this.filterByDate(invoices, 'issueDate');

            const expense = fuelLogs.reduce((a, b) => a + (b.cost || 0), 0) +
                maintenanceLogs.reduce((a, b) => a + (b.cost || 0), 0) +
                generalExpenses.reduce((a, b) => a + (b.cost || 0), 0);
            const revenue = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + (b.amount || 0), 0);

            // Top 3 Expensive Vehicles (Fuel + Maintenance + General)
            const vehicleCosts = {};
            fuelLogs.forEach(l => vehicleCosts[l.vehicleId] = (vehicleCosts[l.vehicleId] || 0) + (l.cost || 0));
            maintenanceLogs.forEach(l => vehicleCosts[l.vehicleId] = (vehicleCosts[l.vehicleId] || 0) + (l.cost || 0));
            generalExpenses.forEach(l => {
                if (l.vehicleId) {
                    vehicleCosts[l.vehicleId] = (vehicleCosts[l.vehicleId] || 0) + (l.cost || 0);
                }
            });

            const sortedVehicles = Object.entries(vehicleCosts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([id, cost]) => {
                    const v = Store.getById('vehicles', id);
                    if (!v) return null;
                    return { name: `${v.make} ${v.model} (${v.plate})`, cost };
                })
                .filter(item => item !== null);

            const filterType = this.dashboardFilter.type;
            const currentVehicleId = this.dashboardFilter.vehicleId;
            const vehiclesList = Store.getAll('vehicles') || [];

            // Apply vehicle filter
            if (currentVehicleId !== 'all') {
                fuelLogs = fuelLogs.filter(l => l.vehicleId === currentVehicleId);
                maintenanceLogs = maintenanceLogs.filter(l => l.vehicleId === currentVehicleId);
                // Note: Invoices are usually not vehicle-specific in this model, but we usually filter expenses.
                // If invoices relate to trips (not in current schema), we'd filter them too.
            }

            const html = `
                <div class="fade-in space-y-6">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 class="text-2xl font-bold text-gray-800">${I18n.t('dashboard')}</h2>
                        
                        <div class="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-full md:w-auto">
                            <!-- Vehicle Selector -->
                            <div class="flex items-center gap-2 pr-3 border-r border-gray-100">
                                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">${I18n.t('filter_by_vehicle')}:</span>
                                <select id="filter-vehicle" onchange="UI.applyVehicleFilter()" class="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none font-medium">
                                    <option value="all">${I18n.t('all_vehicles')}</option>
                                    ${vehiclesList.map(v => `<option value="${v.id}" ${currentVehicleId === v.id ? 'selected' : ''}>${v.plate}</option>`).join('')}
                                </select>
                            </div>

                            <!-- Date Filter Controls -->
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">${I18n.t('filter_by')}:</span>
                                <div class="flex bg-gray-100 p-1 rounded-lg">
                                    <button onclick="UI.setDashboardFilter('all')" class="px-3 py-1 text-xs font-medium rounded-md transition-all ${filterType === 'all' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}">${I18n.t('all_time')}</button>
                                    <button onclick="UI.setDashboardFilter('month')" class="px-3 py-1 text-xs font-medium rounded-md transition-all ${filterType === 'month' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}">${I18n.t('this_month')}</button>
                                    <button onclick="UI.setDashboardFilter('year')" class="px-3 py-1 text-xs font-medium rounded-md transition-all ${filterType === 'year' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}">${I18n.t('this_year')}</button>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <div class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                    <input type="date" id="filter-from" class="text-xs bg-transparent border-none p-0 outline-none" value="${this.dashboardFilter.fromDate || ''}">
                                    <span class="text-gray-300">-</span>
                                    <input type="date" id="filter-to" class="text-xs bg-transparent border-none p-0 outline-none" value="${this.dashboardFilter.toDate || ''}">
                                </div>
                                <button onclick="UI.applyCustomFilter()" class="bg-gray-800 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95">
                                    ${I18n.t('apply_filter')}
                                </button>
                            </div>
                            
                            <!-- Export Buttons -->
                            <div class="ml-auto flex gap-2 border-l border-gray-100 pl-4">
                                <button onclick="App.exportDashboard('excel')" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95" title="${I18n.t('export_excel')}">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </button>
                                <button onclick="App.exportDashboard('pdf')" class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95" title="${I18n.t('export_pdf')}">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${this.createCard(I18n.t('total_revenue'), this.formatCurrency(revenue), I18n.t('from_paid_invoices'), 'text-green-600')}
                        ${this.createCard(I18n.t('total_expenses'), this.formatCurrency(expense), I18n.t('fuel_maintenance'), 'text-red-600')}
                        ${this.createCard(I18n.t('net_profit'), this.formatCurrency(revenue - expense), I18n.t('revenue_expenses'), (revenue - expense) >= 0 ? 'text-blue-600' : 'text-red-600')}
                    </div>

                    <!-- Charts & Lists -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Chart -->
                        <div class="bg-white p-6 rounded-xl shadow-sm glass-card">
                            <canvas id="financeChart"></canvas>
                        </div>

                        <!-- Top Expensive Trucks -->
                        <div class="bg-white p-6 rounded-xl shadow-sm glass-card">
                            <h3 class="text-lg font-bold text-gray-700 mb-4">${I18n.t('top_costs_vehicle')}</h3>
                            <div class="space-y-4">
                                ${sortedVehicles.map(v => `
                                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                                                $
                                            </div>
                                            <span class="font-medium text-gray-700">${v.name}</span>
                                        </div>
                                        <span class="font-bold text-gray-900">${this.formatCurrency(v.cost)}</span>
                                    </div>
                                `).join('')}
                                ${sortedVehicles.length === 0 ? '<p class="text-gray-500">No data available</p>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.content.innerHTML = html;

            // Initialize Chart
            setTimeout(() => {
                const ctx = document.getElementById('financeChart');
                if (ctx && typeof Chart !== 'undefined') {
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Fuel', 'Maintenance', 'General', 'Profit'],
                            datasets: [{
                                data: [
                                    fuelLogs.reduce((a, b) => a + (b.cost || 0), 0),
                                    maintenanceLogs.reduce((a, b) => a + (b.cost || 0), 0),
                                    generalExpenses.reduce((a, b) => a + (b.cost || 0), 0),
                                    Math.max(0, revenue - expense)
                                ],
                                backgroundColor: ['#F59E0B', '#EF4444', '#6366F1', '#10B981']
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: { display: true, text: I18n.t('financial_breakdown') }
                            }
                        }
                    });
                } else if (ctx) {
                    ctx.parentNode.innerHTML = '<p class="text-red-500 text-center py-10">Chart.js library not loaded. Check internet connection.</p>';
                }
            }, 100);

        } catch (error) {
            console.error('Dashboard Error:', error);
            this.content.innerHTML = this.renderEmptyState(`Error loading dashboard: ${error.message}`);
        }
    },

    renderVehicles() {
        this.clearContent();
        const vehicles = Store.getAll('vehicles');

        const html = `
            <div class="fade-in space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">${I18n.t('fleet')}</h2>
                    <button onclick="App.openModal('vehicle')" class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <span>${I18n.t('add_vehicle')}</span>
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-sm glass-card overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('plate_number')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('make')} / ${I18n.t('model')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('year')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('current_mileage')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('status')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${vehicles.map(v => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 font-medium text-gray-900">${v.plate}</td>
                                    <td class="px-6 py-4 text-gray-500">${v.make} ${v.model}</td>
                                    <td class="px-6 py-4 text-gray-500">${v.year}</td>
                                    <td class="px-6 py-4 text-gray-500">${v.mileage.toLocaleString()} km</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${v.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                            ${I18n.t(v.status.toLowerCase()) || v.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 flex items-center gap-2">
                                        <button onclick="App.viewVehicleDetails('${v.id}')" class="text-primary hover:text-blue-700 font-medium text-sm">${I18n.t('details')}</button>
                                        ${Auth.hasPermission('admin') ? `
                                        <button onclick="App.editVehicle('${v.id}')" class="text-blue-600 hover:text-blue-800 font-medium text-sm">${I18n.t('edit')}</button>
                                        <button onclick="App.deleteVehicle('${v.id}')" class="text-red-600 hover:text-red-800 font-medium text-sm">${I18n.t('delete')}</button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${vehicles.length === 0 ? this.renderEmptyState('No vehicles found') : ''}
                </div>
            </div>
        `;
        this.content.innerHTML = html;
    },

    renderEmptyState(message) {
        return `
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p>${message}</p>
            </div>
        `;
    },

    // --- Invoice ---
    renderInvoices() {
        this.clearContent();
        const invoices = Store.getAll('invoices');

        const html = `
            <div class="fade-in space-y-6">
                 <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">${I18n.t('invoices')}</h2>
                    <button onclick="App.openModal('invoice')" class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        ${I18n.t('create_invoice')}
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-sm glass-card overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('client_name')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('date')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('amount')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('status')}</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${invoices.map(i => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 font-medium text-gray-900">${i.id}</td>
                                    <td class="px-6 py-4 text-gray-500">${i.clientId}</td>
                                    <td class="px-6 py-4 text-gray-500">${i.issueDate}</td>
                                    <td class="px-6 py-4 text-gray-900 font-medium">${this.formatCurrency(i.amount)}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${i.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                            ${I18n.t(i.status.toLowerCase()) || i.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 flex items-center gap-2">
                                        ${Auth.hasPermission('admin') ? `
                                            <button onclick="App.editInvoice('${i.id}')" class="text-blue-600 hover:text-blue-800 font-medium text-sm">${I18n.t('edit')}</button>
                                            <button onclick="App.deleteInvoice('${i.id}')" class="text-red-600 hover:text-red-800 font-medium text-sm">${I18n.t('delete')}</button>
                                        ` : ''}
                                        <button onclick="App.printInvoice('${i.id}')" class="text-primary hover:text-blue-700 font-medium text-sm">Print</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${invoices.length === 0 ? this.renderEmptyState('No invoices found') : ''}
                </div>
            </div>
        `;
        this.content.innerHTML = html;
    },

    // --- Expenses ---
    renderExpenses() {
        this.clearContent();
        let fuelLogs = Store.getAll('fuelLogs') || [];
        let maintenanceLogs = Store.getAll('maintenanceLogs') || [];
        let generalExpenses = Store.getAll('generalExpenses') || [];
        const vehicles = Store.getAll('vehicles') || [];

        // Apply filters
        fuelLogs = this.filterItemsByDate(fuelLogs, this.expensesFilter);
        maintenanceLogs = this.filterItemsByDate(maintenanceLogs, this.expensesFilter);
        generalExpenses = this.filterItemsByDate(generalExpenses, this.expensesFilter);

        if (this.expensesFilter.vehicleId !== 'all') {
            fuelLogs = fuelLogs.filter(l => l.vehicleId === this.expensesFilter.vehicleId);
            maintenanceLogs = maintenanceLogs.filter(l => l.vehicleId === this.expensesFilter.vehicleId);
            generalExpenses = generalExpenses.filter(l => l.vehicleId === this.expensesFilter.vehicleId);
        }

        const expenses = [
            ...fuelLogs.map(l => ({ ...l, category: 'Fuel', type: 'Fuel' })),
            ...maintenanceLogs.map(l => ({ ...l, category: 'Maintenance' })),
            ...generalExpenses.map(l => ({ ...l, category: 'General' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        const getPlate = (id) => vehicles.find(v => v.id === id)?.plate || id;

        const html = `
            <div class="fade-in space-y-6">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <h2 class="text-2xl font-bold text-gray-800">${I18n.t('expenses')}</h2>
                    <div class="flex flex-wrap gap-2 w-full lg:w-auto">
                        <button onclick="App.exportExpenses('excel')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span>${I18n.t('export_excel')}</span>
                        </button>
                        <button onclick="App.exportExpenses('pdf')" class="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span>${I18n.t('export_pdf')}</span>
                        </button>
                        <button onclick="App.openModal('fuel')" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm">
                            <span class="text-lg font-bold">+</span>
                            <span>${I18n.t('log_fuel')}</span>
                        </button>
                        <button onclick="App.openModal('maintenance')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm">
                            <span class="text-lg font-bold">+</span>
                            <span>${I18n.t('log_maintenance')}</span>
                        </button>
                        <button onclick="App.openModal('general_expense')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm">
                            <span class="text-lg font-bold">+</span>
                            <span>${I18n.t('log_general_expense')}</span>
                        </button>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow-sm glass-card space-y-4">
                    <div class="flex flex-wrap items-center gap-4">
                        <div class="flex-1 min-w-[200px]">
                            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${I18n.t('filter_by_vehicle')}</label>
                            <select id="filter-expenses-vehicle" onchange="UI.applyExpensesVehicleFilter()" class="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-gray-50/50">
                                <option value="all">${I18n.t('all_vehicles')}</option>
                                ${vehicles.map(v => `<option value="${v.id}" ${this.expensesFilter.vehicleId === v.id ? 'selected' : ''}>${v.plate} - ${v.make} ${v.model}</option>`).join('')}
                            </select>
                        </div>
                        <div class="flex-grow flex items-end gap-2">
                            <div class="flex rounded-lg bg-gray-100 p-1">
                                <button onclick="UI.setExpensesFilter('all')" class="px-4 py-2 rounded-md text-sm font-medium transition-all ${this.expensesFilter.type === 'all' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}">${I18n.t('all_time')}</button>
                                <button onclick="UI.setExpensesFilter('month')" class="px-4 py-2 rounded-md text-sm font-medium transition-all ${this.expensesFilter.type === 'month' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}">${I18n.t('this_month')}</button>
                                <button onclick="UI.setExpensesFilter('year')" class="px-4 py-2 rounded-md text-sm font-medium transition-all ${this.expensesFilter.type === 'year' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}">${I18n.t('this_year')}</button>
                            </div>
                        </div>
                        <div class="flex items-end gap-2">
                            <div class="flex items-center gap-2">
                                <input type="date" id="filter-expenses-from" value="${this.expensesFilter.fromDate || ''}" class="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm bg-gray-50/50">
                                <span class="text-gray-400">→</span>
                                <input type="date" id="filter-expenses-to" value="${this.expensesFilter.toDate || ''}" class="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm bg-gray-50/50">
                            </div>
                            <button onclick="UI.applyExpensesCustomFilter()" class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
                                ${I18n.t('apply_filter')}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm glass-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('date')}</th>
                                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('plate_number')}</th>
                                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('description')} / ${I18n.t('type')}</th>
                                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('cost')}</th>
                                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">${I18n.t('category')}</th>
                                    ${Auth.hasPermission('manage_expenses') ? `<th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">${I18n.t('actions') || 'Actions'}</th>` : ''}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${expenses.length > 0 ? expenses.map(e => `
                                    <tr class="hover:bg-gray-50 group">
                                        <td class="px-6 py-4 text-gray-500">${this.formatDate(e.date)}</td>
                                        <td class="px-6 py-4 font-medium text-gray-900">${getPlate(e.vehicleId)}</td>
                                        <td class="px-6 py-4 text-sm text-gray-600">
                                            ${e.category === 'Fuel' ? `${e.liters}L ${I18n.t('fuel') || 'Fuel'}` : e.description}
                                            <span class="block text-xs text-gray-400 capitalize">${e.type}</span>
                                        </td>
                                        <td class="px-6 py-4 font-bold text-gray-900">${this.formatCurrency(e.cost)}</td>
                                        <td class="px-6 py-4">
                                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${e.category === 'Fuel' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
                                                ${e.category}
                                            </span>
                                        </td>
                                        ${(e.category === 'Fuel' && Auth.hasPermission('manage_fuel_logs')) ||
                (e.category === 'Maintenance' && Auth.hasPermission('manage_maintenance_logs')) ||
                (e.category === 'General' && Auth.hasPermission('manage_expenses')) ? `
                                        <td class="px-6 py-4 text-right whitespace-nowrap">
                                            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onclick="App.${e.category === 'Fuel' ? 'editFuelLog' : (e.category === 'Maintenance' ? 'editMaintenanceLog' : 'editGeneralExpense')}('${e.id}')" class="text-blue-600 hover:text-blue-800">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button onclick="App.${e.category === 'Fuel' ? 'deleteFuelLog' : (e.category === 'Maintenance' ? 'deleteMaintenanceLog' : 'deleteGeneralExpense')}('${e.id}')" class="text-red-600 hover:text-red-800">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                        ` : ''}
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                            <div class="flex flex-col items-center gap-2">
                                                <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span>${I18n.t('no_records_found') || 'No records found for the selected filters'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                    ${expenses.length === 0 ? this.renderEmptyState('No expenses found') : ''}
                </div>
            </div>
        `;
        this.content.innerHTML = html;
    },

    // --- Modals ---
    renderModal(title, content) {
        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onclick="App.closeModal()"></div>
                <div class="bg-white rounded-xl shadow-2xl z-10 w-full max-w-md transform transition-all scale-100 glass-card">
                    <div class="flex justify-between items-center p-6 border-b border-gray-200">
                        <h3 class="text-lg font-bold text-gray-900">${title}</h3>
                        <button onclick="App.closeModal()" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div class="p-6">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        this.modalContainer.innerHTML = html;
    },

    // --- Vehicle Details ---
    renderVehicleDetails(id) {
        this.clearContent();
        const vehicle = Store.getById('vehicles', id);
        if (!vehicle) return this.navigateTo('vehicles');

        const currentUser = Auth.getCurrentUser();
        console.log('Current User:', currentUser); // Debugging
        console.log('Role:', currentUser ? currentUser.role : 'No user'); // Debugging

        const fuelLogs = Store.getAll('fuelLogs').filter(l => l.vehicleId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
        const maintenanceLogs = Store.getAll('maintenanceLogs').filter(l => l.vehicleId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
        const generalExpenses = Store.getAll('generalExpenses').filter(l => l.vehicleId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
        const efficiency = Store.calculateEfficiency(id);

        const totalSpent = fuelLogs.reduce((a, b) => a + (b.cost || 0), 0) +
            maintenanceLogs.reduce((a, b) => a + (b.cost || 0), 0) +
            generalExpenses.reduce((a, b) => a + (b.cost || 0), 0);

        const html = `
            <div class="fade-in space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <button onclick="App.navigateTo('vehicles')" class="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            </button>
                            <h2 class="text-2xl font-bold text-gray-800">${vehicle.plate}</h2>
                        </div>
                        <p class="text-gray-500 ml-8">${vehicle.make} ${vehicle.model} (${vehicle.year})</p>
                    </div>
                    <div class="flex gap-2">
                        ${Auth.hasPermission('manage_fuel_logs') ? `
                        <button onclick="App.openModal('fuel', '${id}')" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                            <span>${I18n.t('refuel')}</span>
                        </button>
                        ` : ''}
                        ${Auth.hasPermission('manage_maintenance_logs') ? `
                        <button onclick="App.openModal('maintenance', '${id}')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                            <span>${I18n.t('service')}</span>
                        </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${this.createCard(I18n.t('current_mileage'), `${vehicle.mileage.toLocaleString()} km`, 'Odometer', 'text-gray-800')}
                    ${this.createCard(I18n.t('fuel_efficiency'), `${efficiency} km/L`, 'Average', efficiency > 2 ? 'text-green-600' : 'text-amber-600')}
                    ${this.createCard(I18n.t('status'), I18n.t(vehicle.status.toLowerCase()) || vehicle.status, 'Current State', vehicle.status === 'Active' ? 'text-green-600' : 'text-red-500')}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Fuel Logs -->
                    <div class="bg-white rounded-xl shadow-sm glass-card overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-800">${I18n.t('recent_fuel_logs')}</h3>
                        </div>
                        <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            ${fuelLogs.map(log => `
                                <div class="p-4 hover:bg-gray-50 transition-colors">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="font-medium text-gray-900">${log.liters} L (${this.formatCurrency(log.cost)})</p>
                                            <p class="text-xs text-gray-500">${this.formatDate(log.date)}</p>
                                        </div>
                                        <div class="text-right flex items-center gap-3">
                                            <p class="text-sm font-medium text-gray-600">${log.odometer.toLocaleString()} km</p>
                                            ${Auth.hasPermission('manage_fuel_logs') ? `
                                            <div class="flex items-center gap-1">
                                                <button onclick="App.editFuelLog('${log.id}')" class="text-blue-600 hover:text-blue-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button onclick="App.deleteFuelLog('${log.id}')" class="text-red-600 hover:text-red-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            ${fuelLogs.length === 0 ? '<p class="p-4 text-center text-gray-400 text-sm">No fuel logs yet.</p>' : ''}
                        </div>
                    </div>

                    <!-- Maintenance Logs -->
                    <div class="bg-white rounded-xl shadow-sm glass-card overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-800">${I18n.t('maintenance_history')}</h3>
                        </div>
                        <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            ${maintenanceLogs.map(log => `
                                <div class="p-4 hover:bg-gray-50 transition-colors">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="font-medium text-gray-900">${log.description}</p>
                                            <p class="text-xs text-gray-500">${this.formatDate(log.date)} • ${I18n.t(log.type.toLowerCase()) || log.type}</p>
                                        </div>
                                        <div class="text-right flex items-center gap-3">
                                            <p class="text-sm font-bold text-gray-800">${this.formatCurrency(log.cost)}</p>
                                            ${Auth.hasPermission('admin') ? `
                                            <div class="flex items-center gap-1">
                                                <button onclick="App.editMaintenanceLog('${log.id}')" class="text-blue-600 hover:text-blue-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button onclick="App.deleteMaintenanceLog('${log.id}')" class="text-red-600 hover:text-red-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            ${maintenanceLogs.length === 0 ? '<p class="p-4 text-center text-gray-400 text-sm">No maintenance records.</p>' : ''}
                        </div>
                    </div>

                    <!-- Associated General Expenses -->
                    <div class="bg-white rounded-xl shadow-sm glass-card overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-800">${I18n.t('associated_general_expenses') || 'Associated General Expenses'}</h3>
                        </div>
                        <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            ${generalExpenses.map(log => `
                                <div class="p-4 hover:bg-gray-50 transition-colors">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="font-medium text-gray-900">${I18n.t(log.type) || log.type} - ${log.description}</p>
                                            <p class="text-xs text-gray-500">${this.formatDate(log.date)}</p>
                                        </div>
                                        <div class="text-right flex items-center gap-3">
                                            <p class="text-sm font-bold text-gray-800">${this.formatCurrency(log.cost)}</p>
                                            ${Auth.hasPermission('admin') ? `
                                            <div class="flex items-center gap-1">
                                                <button onclick="App.editGeneralExpense('${log.id}')" class="text-blue-600 hover:text-blue-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button onclick="App.deleteGeneralExpense('${log.id}')" class="text-red-600 hover:text-red-800 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            ${generalExpenses.length === 0 ? '<p class="p-4 text-center text-gray-400 text-sm">No associated general expenses.</p>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.content.innerHTML = html;
    },

    // --- Forms ---

    renderFuelForm(vehicleId) {
        const vehicles = Store.getAll('vehicles');
        const vehicleSelect = !vehicleId ? `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('select_vehicle')}</label>
                <select name="vehicleId" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    <option value="">${I18n.t('select_vehicle')}</option>
                    ${vehicles.map(v => `<option value="${v.id}">${v.plate} - ${v.make} ${v.model}</option>`).join('')}
                </select>
            </div>
        ` : '';

        return `
            <form onsubmit="App.handleFuelSubmit(event, '${vehicleId || ''}')" class="space-y-4">
                ${vehicleSelect}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('date')}</label>
                    <input type="date" name="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('liters')}</label>
                        <input type="number" step="0.1" name="liters" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('total_cost')}</label>
                        <input type="number" step="0.01" name="cost" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('odometer_reading')}</label>
                    <input type="number" name="odometer" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                </div>
                <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition-colors">
                    ${I18n.t('log_fuel')}
                </button>
            </form>
        `;
    },

    renderMaintenanceForm(vehicleId) {
        const vehicles = Store.getAll('vehicles');
        const vehicleSelect = !vehicleId ? `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('select_vehicle')}</label>
                <select name="vehicleId" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    <option value="">${I18n.t('select_vehicle')}</option>
                    ${vehicles.map(v => `<option value="${v.id}">${v.plate} - ${v.make} ${v.model}</option>`).join('')}
                </select>
            </div>
        ` : '';

        return `
            <form onsubmit="App.handleMaintenanceSubmit(event, '${vehicleId || ''}')" class="space-y-4">
                ${vehicleSelect}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('date')}</label>
                    <input type="date" name="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('description')}</label>
                    <input type="text" name="description" placeholder="e.g. Oil Change" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('type')}</label>
                        <select name="type" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                            <option value="Routine">${I18n.t('routine')}</option>
                            <option value="Repair">${I18n.t('repair')}</option>
                            <option value="Inspection">${I18n.t('inspection')}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('cost')}</label>
                        <input type="number" step="0.01" name="cost" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                </div>
                <button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-colors">
                    ${I18n.t('log_maintenance')}
                </button>
            </form>
        `;
    },

    renderGeneralExpenseForm() {
        const vehicles = Store.getAll('vehicles');
        const categories = ['salaries', 'insurance_license', 'accommodation', 'rentals', 'others'];

        return `
            <form onsubmit="App.handleGeneralExpenseSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('select_category')}</label>
                    <select name="type" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        <option value="">${I18n.t('select_category')}</option>
                        ${categories.map(c => `<option value="${c}">${I18n.t(c)}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('date')}</label>
                    <input type="date" name="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('description')}</label>
                    <input type="text" name="description" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('cost')}</label>
                        <input type="number" step="0.01" name="cost" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('vehicle')} (${I18n.t('optional')})</label>
                        <select name="vehicleId" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                            <option value="">None</option>
                            ${vehicles.map(v => `<option value="${v.id}">${v.plate}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors">
                    ${I18n.t('log_general_expense')}
                </button>
            </form>
        `;
    },

    renderInvoiceForm() {
        return `
            <form onsubmit="App.handleInvoiceSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('client_name')}</label>
                    <input type="text" name="client" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                </div>
                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('issue_date')}</label>
                        <input type="date" name="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('amount')}</label>
                        <input type="number" step="0.01" name="amount" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('status')}</label>
                    <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        <option value="Pending">${I18n.t('pending')}</option>
                        <option value="Paid">${I18n.t('paid')}</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                    ${I18n.t('generate_invoice')}
                </button>
            </form>
        `;
    },

    renderVehicleForm() {
        return `
            <form onsubmit="App.handleVehicleSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('plate_number')}</label>
                    <input type="text" name="plate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('make')}</label>
                        <input type="text" name="make" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('model')}</label>
                        <input type="text" name="model" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('year')}</label>
                        <input type="number" name="year" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('current_mileage')}</label>
                        <input type="number" name="mileage" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                </div>
                <button type="submit" class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                    ${I18n.t('save_vehicle')}
                </button>
            </form>
        `;
    },

    renderEditUserForm(user) {
        return `
            <div class="bg-white p-6 rounded-lg">
                <form onsubmit="App.handleEditUserSubmit(event, '${user.id}')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('full_name')}</label>
                        <input type="text" name="name" value="${user.name}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('email')}</label>
                        <input type="email" name="email" value="${user.email}" required class="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('password')}</label>
                        <input type="text" name="password" value="${user.password}" required class="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                    </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('role_request')}</label>
                    <select name="role" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        ${(Store.getAll('roles') || ['admin', 'manager', 'finance', 'supervisor', 'driver', 'accountant']).map(role => {
            const roleName = typeof role === 'object' ? role.name : role;
            return `<option value="${roleName}" ${user.role === roleName ? 'selected' : ''}>${roleName === 'admin' ? 'Admin' : I18n.t(roleName)}</option>`;
        }).join('')}
                    </select>
                </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('status')}</label>
                        <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>${I18n.t('active')}</option>
                            <option value="pending" ${user.status === 'pending' ? 'selected' : ''}>${I18n.t('pending')}</option>
                            <option value="rejected" ${user.status === 'rejected' ? 'selected' : ''}>${I18n.t('rejected')}</option>
                        </select>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button type="button" onclick="App.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('cancel')}
                        </button>
                        <button type="submit" class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderEditVehicleForm(vehicle) {
        return `
            <div class="bg-white p-6 rounded-lg">
                <form onsubmit="App.handleEditVehicleSubmit(event, '${vehicle.id}')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('plate_number')}</label>
                        <input type="text" name="plate" value="${vehicle.plate}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('make')}</label>
                            <input type="text" name="make" value="${vehicle.make}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('model')}</label>
                            <input type="text" name="model" value="${vehicle.model}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('year')}</label>
                            <input type="number" name="year" value="${vehicle.year}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('status')}</label>
                            <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                                <option value="Active" ${vehicle.status === 'Active' ? 'selected' : ''}>${I18n.t('active')}</option>
                                <option value="Maintenance" ${vehicle.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                                <option value="Inactive" ${vehicle.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div>
                         <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('current_mileage')}</label>
                         <input type="number" name="mileage" value="${vehicle.mileage}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button type="button" onclick="App.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('cancel')}
                        </button>
                        <button type="submit" class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderEditFuelForm(log) {
        return `
            <div class="bg-white p-6 rounded-lg">
                <form onsubmit="App.handleEditFuelSubmit(event, '${log.id}')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('date')}</label>
                        <input type="date" name="date" value="${log.date}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('liters')}</label>
                            <input type="number" step="0.1" name="liters" value="${log.liters}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('total_cost')}</label>
                            <input type="number" step="0.01" name="cost" value="${log.cost}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('odometer_reading')}</label>
                        <input type="number" name="odometer" value="${log.odometer}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button type="button" onclick="App.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('cancel')}
                        </button>
                        <button type="submit" class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderEditMaintenanceForm(log) {
        return `
            <div class="bg-white p-6 rounded-lg">
                <form onsubmit="App.handleEditMaintenanceSubmit(event, '${log.id}')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('date')}</label>
                        <input type="date" name="date" value="${log.date}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('description')}</label>
                        <input type="text" name="description" value="${log.description}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('type')}</label>
                            <select name="type" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                                <option value="Routine" ${log.type === 'Routine' ? 'selected' : ''}>${I18n.t('routine')}</option>
                                <option value="Repair" ${log.type === 'Repair' ? 'selected' : ''}>${I18n.t('repair')}</option>
                                <option value="Inspection" ${log.type === 'Inspection' ? 'selected' : ''}>${I18n.t('inspection')}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('cost')}</label>
                            <input type="number" step="0.01" name="cost" value="${log.cost}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button type="button" onclick="App.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('cancel')}
                        </button>
                        <button type="submit" class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderEditGeneralExpenseForm(expense) {
        const vehicles = Store.getAll('vehicles');
        const categories = ['salaries', 'insurance_license', 'accommodation', 'rentals', 'others'];

        return `
            <div class="bg-white p-6 rounded-lg">
                <form onsubmit="App.handleEditGeneralExpenseSubmit(event, '${expense.id}')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('select_category')}</label>
                        <select name="type" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                            ${categories.map(c => `<option value="${c}" ${expense.type === c ? 'selected' : ''}>${I18n.t(c)}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('date')}</label>
                        <input type="date" name="date" value="${expense.date}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('description')}</label>
                        <input type="text" name="description" value="${expense.description}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('cost')}</label>
                            <input type="number" step="0.01" name="cost" value="${expense.cost}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('vehicle')} (${I18n.t('optional')})</label>
                            <select name="vehicleId" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                                <option value="">None</option>
                                ${vehicles.map(v => `<option value="${v.id}" ${expense.vehicleId === v.id ? 'selected' : ''}>${v.plate}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button type="button" onclick="App.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('cancel')}
                        </button>
                        <button type="submit" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderEditInvoiceForm(invoice) {
        return `
            <div class="bg-white p-6 rounded-lg">
                <form onsubmit="App.handleEditInvoiceSubmit(event, '${invoice.id}')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('client_name')}</label>
                        <input type="text" name="client" value="${invoice.clientId}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                    </div>
                     <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('issue_date')}</label>
                            <input type="date" name="date" value="${invoice.issueDate}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('amount')}</label>
                            <input type="number" step="0.01" name="amount" value="${invoice.amount}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('status')}</label>
                        <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                            <option value="Pending" ${invoice.status === 'Pending' ? 'selected' : ''}>${I18n.t('pending')}</option>
                            <option value="Paid" ${invoice.status === 'Paid' ? 'selected' : ''}>${I18n.t('paid')}</option>
                        </select>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button type="button" onclick="App.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('cancel')}
                        </button>
                        <button type="submit" class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderRoleForm(existingRoleName = null) {
        const roles = Store.getAll('roles');
        const roleObj = existingRoleName ? roles.find(r => r.name === existingRoleName) : null;
        const isEdit = existingRoleName !== null;

        const availablePermissions = [
            'view_dashboard',
            'manage_vehicles',
            'manage_expenses',
            'manage_fuel_logs',
            'manage_maintenance_logs',
            'manage_invoices',
            'manage_users',
            'export_reports'
        ];

        return `
            <div class="bg-white p-6 rounded-lg max-w-lg w-full">
                <h3 class="text-xl font-bold text-gray-800 mb-4">${isEdit ? I18n.t('edit_role') : I18n.t('add_role')}</h3>
                <form onsubmit="App.${isEdit ? `handleEditRoleSubmit(event, '${existingRoleName}')` : 'handleAddRoleSubmit(event)'}" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${I18n.t('role_name')}</label>
                        <input type="text" name="roleName" value="${existingRoleName || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. driver">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">${I18n.t('permissions') || 'Permissions'}</label>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${availablePermissions.map(p => `
                                <label class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input type="checkbox" name="permissions" value="${p}" ${roleObj && roleObj.permissions && roleObj.permissions.includes(p) ? 'checked' : ''} class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="text-sm text-gray-700">${I18n.t(p)}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex gap-2 pt-4">
                        <button type="button" onclick="App.closeModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors">
                            ${I18n.t('cancel')}
                        </button>
                        <button type="submit" class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors shadow-lg">
                            ${I18n.t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
};
