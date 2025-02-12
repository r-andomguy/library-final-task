<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark navbar-custom shadow-sm">
            <div class="container">
                <router-link class="navbar-brand" to="/">Biblioteca Inovcorp</router-link>
                <button class="navbar-toggler" type="button" @click="toggleMenu">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" :class="{'show': isMenuOpen}" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <router-link class="nav-link custom-nav-link" to="/">
                                <i class="bi bi-house-door"></i> Início
                            </router-link>
                        </li>

                        <li v-if="auth.user" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle custom-nav-link" href="#" @click.prevent="toggleDropdown">
                                <i class="bi bi-person-circle"></i> {{ auth.user.name }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" :class="{ 'show': isDropdownOpen }">
                                <li>
                                    <button class="dropdown-item text-danger" @click="handleLogout">
                                        <i class="bi bi-box-arrow-right"></i> Sair
                                    </button>
                                </li>
                            </ul>
                        </li>

                        <li v-else class="nav-item">
                            <router-link class="nav-link custom-nav-link" to="/auth-web">
                                <i class="bi bi-person-circle"></i> Entrar
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container mt-4 content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const auth = useAuthStore();
        const router = useRouter();
        const isMenuOpen = ref(false);
        const isDropdownOpen = ref(false);

        onMounted(() => {
            auth.fetchUser();
        });

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };


        const handleLogout = () => {
            auth.logout();
            router.push('/login');
        };

        return { auth, isMenuOpen, isDropdownOpen, toggleMenu, toggleDropdown, handleLogout };
    }
};
</script>

<style scoped>
.navbar-custom {
    background-color: #343a40;
}

.navbar-brand {
    font-weight: 500;
    color: #f8f9fa;
}

.navbar-brand:hover {
    color: #fff;
}

.navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(255,255,255, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.custom-nav-link {
    color: #f8f9fa;
    font-weight: 500;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.custom-nav-link:hover, .custom-nav-link.router-link-active {
    background-color: #495057;
    color: #fff;
}

.dropdown-menu {
    border: none;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    background-color: #343a40;
}

.dropdown-item {
    color: #f8f9fa;
    font-weight: 500;
    padding: 0.6rem 1.5rem;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.dropdown-item:hover, .dropdown-item:focus {
    background-color: #495057;
    color: #fff;
}

.dropdown-item.text-danger {
    color: #e53e3e;
}

.dropdown-item.text-danger:hover, .dropdown-item.text-danger:focus {
    background-color: #545b62;
}

.container {
    max-width: 1200px;
}

.content {
    font-family: 'Arial', sans-serif;
}
</style>
