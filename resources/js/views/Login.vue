<template>
        <div class="container">
            <h2>Login</h2>
            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label>Email</label>
                    <input v-model="email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Senha</label>
                    <input v-model="password" type="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Entrar</button>
            </form>
            <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
        </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { ref } from "vue";

export default {
    components: { Navbar },
    setup() {
        const auth = useAuthStore();
        const router = useRouter();
        const email = ref('');
        const password = ref('');
        const errorMessage = ref('');

        const handleLogin = async () => {
            const success = await auth.login({ email: email.value, password: password.value });
            if (success) {
                setTimeout(() => {
                    router.push('/');
                }, 500);
            } else {
                errorMessage.value = "Credenciais inválidas!";
            }
        };

        return { email, password, handleLogin, errorMessage };
    }
};
</script>
