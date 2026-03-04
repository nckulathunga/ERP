/**
 * Auth.js
 * Handles User Authentication and RBAC
 */

const Auth = {
    currentUser: null,

    init() {
        const savedUser = localStorage.getItem('fleetFlowUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    },

    login(email, password) {
        const users = Store.getAll('users');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Fail-safe: If user is admin, force active status (fixes stale localStorage data issues)
            if (user.role === 'admin' && user.status !== 'active') {
                user.status = 'active';
                Store.update('users', user.id, { status: 'active' });
            }

            if (user.status !== 'active') {
                return { success: false, message: 'Account is pending approval by Admin.' };
            }
            this.currentUser = user;
            localStorage.setItem('fleetFlowUser', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    signup(name, email, password, role) {
        const users = Store.getAll('users');
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role, // Requested role
            status: 'pending' // Default status
        };

        Store.add('users', newUser);
        return { success: true, message: 'Registration successful! Please wait for Admin approval.' };
    },

    updateUserStatus(userId, status) {
        const user = Store.getById('users', userId);
        if (user) {
            Store.update('users', userId, { status });
            return true;
        }
        return false;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('fleetFlowUser');
        window.location.reload();
    },

    isAuthenticated() {
        return !!this.currentUser;
    },

    getCurrentUser() {
        return this.currentUser;
    },

    // Check if current user has permission for a specific feature
    hasPermission(permission) {
        if (!this.currentUser) return false;

        const roleName = (this.currentUser.role || '').toLowerCase();

        // Admins have all permissions
        if (roleName === 'admin') return true;

        // Fetch permissions for this role from the store
        const roles = Store.getAll('roles');
        const roleObj = roles.find(r => r.name === roleName);

        if (roleObj && roleObj.permissions) {
            return roleObj.permissions.includes(permission);
        }

        return false;
    }
};

Auth.init();
