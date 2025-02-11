<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container">
                <router-link class="navbar-brand" to="/">Biblioteca Inovcorp</router-link>
                <button class="navbar-toggler" type="button" @click="toggleMenu">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" :class="{'show': isMenuOpen}" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <router-link class="nav-link text-white" to="/">
                                <i class="bi bi-house-door"></i> Início
                            </router-link>
                        </li>

                        <li v-if="auth.user" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" @click.prevent="toggleDropdown">
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
                            <router-link class="nav-link text-white" to="/auth-web">
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

        <footer class="mt-3">
            <div class="container text-dark-emphasis text-center">
                &copy; {{ new Date().getFullYear() }} Biblioteca Inovcorp. Todos os direitos reservados.
            </div>
        </footer>
    </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { onMounted, ref } from "vue";

export default {
    setup() {
        const auth = useAuthStore();
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


        const handleLogout = async () => {
            await auth.logout();
        };

        return { auth, isMenuOpen, isDropdownOpen, toggleMenu, toggleDropdown, handleLogout };
    }
};
</script>
