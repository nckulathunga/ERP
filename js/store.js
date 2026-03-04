/**
 * Store.js
 * Handles data persistence using localStorage.
 * Simulates a database with "tables" for Users, Vehicles, Maintenance, FuelLogs, etc.
 */

const Store = {
    dbName: 'FleetFlowDB',

    init() {
        if (!localStorage.getItem(this.dbName)) {
            this.seedData();
        } else {
            this.migrateRoles();
        }
    },

    migrateRoles() {
        const db = this.getDB();
        if (db.roles && db.roles.length > 0 && typeof db.roles[0] === 'string') {
            console.log('Migrating legacy roles to object format...');
            const defaultPermissions = {
                admin: ['view_dashboard', 'manage_vehicles', 'manage_expenses', 'manage_fuel_logs', 'manage_maintenance_logs', 'manage_invoices', 'manage_users', 'export_reports'],
                manager: ['view_dashboard', 'manage_vehicles', 'manage_expenses', 'manage_fuel_logs', 'manage_maintenance_logs', 'export_reports'],
                finance: ['view_dashboard', 'manage_expenses', 'manage_invoices', 'export_reports'],
                supervisor: ['manage_vehicles', 'manage_expenses', 'manage_fuel_logs', 'manage_maintenance_logs'],
                driver: ['manage_expenses', 'manage_fuel_logs'],
                accountant: ['view_dashboard', 'manage_expenses', 'manage_invoices', 'export_reports']
            };

            db.roles = db.roles.map(roleName => ({
                name: roleName,
                permissions: defaultPermissions[roleName] || []
            }));
            this.saveDB(db);
        }
    },

    seedData() {
        const initialData = {
            users: [
                { id: 1, name: 'Admin User', email: 'admin@fleetflow.com', password: 'password', role: 'admin', status: 'active' },
                { id: 2, name: 'Fleet Manager', email: 'manager@fleetflow.com', password: 'password', role: 'manager', status: 'active' },
                { id: 3, name: 'Finance User', email: 'finance@fleetflow.com', password: 'password', role: 'finance', status: 'active' },
                { id: 4, name: 'Driver Dave', email: 'driver@fleetflow.com', password: 'password', role: 'driver', status: 'active' },
            ],
            vehicles: [
                { id: 'V001', make: 'Volvo', model: 'FH16', year: 2022, plate: 'ABC-1234', status: 'Active', mileage: 120000 },
                { id: 'V002', make: 'Scania', model: 'R450', year: 2021, plate: 'XYZ-5678', status: 'Maintenance', mileage: 154000 },
                { id: 'V003', make: 'Mercedes', model: 'Actros', year: 2023, plate: 'LMN-9012', status: 'Active', mileage: 45000 },
            ],
            fuelLogs: [
                { id: 1, vehicleId: 'V001', date: '2023-10-01', liters: 300, cost: 450.00, odometer: 118000 },
                { id: 2, vehicleId: 'V001', date: '2023-10-05', liters: 280, cost: 420.00, odometer: 119500 },
                { id: 3, vehicleId: 'V003', date: '2023-10-02', liters: 350, cost: 525.00, odometer: 44000 },
            ],
            maintenanceLogs: [
                { id: 1, vehicleId: 'V002', date: '2023-09-15', description: 'Oil Change', cost: 250.00, type: 'Routine' },
                { id: 2, vehicleId: 'V002', date: '2023-10-10', description: 'Brake Replacement', cost: 1200.00, type: 'Repair' },
            ],
            invoices: [
                { id: 'INV-001', clientId: 'Client A', amount: 5000.00, issueDate: '2023-10-01', status: 'Paid' },
                { id: 'INV-002', clientId: 'Client B', amount: 3200.00, issueDate: '2023-10-05', status: 'Pending' },
            ],
            roles: [
                { name: 'admin', permissions: ['view_dashboard', 'manage_vehicles', 'manage_expenses', 'manage_fuel_logs', 'manage_maintenance_logs', 'manage_invoices', 'manage_users', 'export_reports'] },
                { name: 'manager', permissions: ['view_dashboard', 'manage_vehicles', 'manage_expenses', 'manage_fuel_logs', 'manage_maintenance_logs', 'export_reports'] },
                { name: 'finance', permissions: ['view_dashboard', 'manage_expenses', 'manage_invoices', 'export_reports'] },
                { name: 'supervisor', permissions: ['manage_vehicles', 'manage_expenses', 'manage_fuel_logs', 'manage_maintenance_logs'] },
                { name: 'driver', permissions: ['manage_expenses', 'manage_fuel_logs'] },
                { name: 'accountant', permissions: ['view_dashboard', 'manage_expenses', 'manage_invoices', 'export_reports'] }
            ],
            generalExpenses: []
        };
        localStorage.setItem(this.dbName, JSON.stringify(initialData));
        console.log('Database Seeded');
    },

    getDB() {
        return JSON.parse(localStorage.getItem(this.dbName)) || {};
    },

    saveDB(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    },

    // Generic Get All
    getAll(collection) {
        const db = this.getDB();
        return db[collection] || [];
    },

    // Generic Get by ID
    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id == id);
    },

    // Generic Add
    add(collection, item) {
        const db = this.getDB();
        if (!db[collection]) db[collection] = [];

        // Simple ID generation if not present
        if (!item.id) {
            item.id = Date.now();
        }

        db[collection].push(item);
        this.saveDB(db);
        return item;
    },

    // Generic Update
    update(collection, id, updates) {
        const db = this.getDB();
        const index = db[collection].findIndex(item => item.id == id);
        if (index !== -1) {
            db[collection][index] = { ...db[collection][index], ...updates };
            this.saveDB(db);
            return db[collection][index];
        }
        return null;
    },

    // Generic Delete
    delete(collection, id) {
        const db = this.getDB();
        const filtered = db[collection].filter(item => item.id != id);
        db[collection] = filtered;
        this.saveDB(db);
    },

    // Save entire collection (for arrays like roles)
    save(collection, data) {
        const db = this.getDB();
        db[collection] = data;
        this.saveDB(db);
    },

    // Specialized Logic
    calculateEfficiency(vehicleId) {
        const logs = this.getAll('fuelLogs').filter(l => l.vehicleId === vehicleId).sort((a, b) => a.odometer - b.odometer);
        if (logs.length < 2) return 0;

        let totalDist = 0;
        let totalFuel = 0;

        // Calculate differences between consecutive fills
        // Note: This is a simplified calculation.
        // Efficiency = (Last Odo - First Odo) / Total Fuel (excluding first fill if tank wasn't full... assuming full tank fills for simplicity)

        const first = logs[0];
        const last = logs[logs.length - 1];

        totalDist = last.odometer - first.odometer;

        // Sum fuel from 2nd log onwards because the 1st log's fuel covered the distance BEFORE the log
        // Actually, simpler standard: Sum of fuel for distance covered.
        // Let's assume each log fills the tank.
        // Distance covered between Log A and Log B is (B.odo - A.odo). The fuel used to cover that is B.liters.

        for (let i = 1; i < logs.length; i++) {
            totalFuel += logs[i].liters;
        }

        if (totalFuel === 0) return 0;
        return (totalDist / totalFuel).toFixed(2); // km/L
    }
};

// Initialize on load
Store.init();
