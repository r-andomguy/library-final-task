<template>
    <div class="login-container">
        <div class="login-card">
            <h2 class="login-title">Acessar sua Conta</h2>
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input v-model="email" type="email" id="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password" class="form-label">Senha</label>
                    <input v-model="password" type="password" id="password" class="form-control" required>
                </div>
                <button type="submit" class="btn login-button">Entrar</button>
            </form>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
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

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #ced4da;
    padding: 2rem;
}

.login-card {
    background-color: #343a40;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px; /* Limit card width */
}

.login-title {
    color: #f8f9fa;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: bold;
    font-size: 2rem;
}

.login-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    color: #d0d0d0;
    font-weight: bold;
}

.form-control {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #495057;
    background-color: #495057;
    color: #f8f9fa;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-control:focus {
    outline: none;
    border-color: #6c757d;
    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
}

.login-button {
    background-color: #63b3ed;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.login-button:hover {
    background-color: #3182ce;
}

.error-message {
    color: #e53e3e;
    margin-top: 1rem;
    text-align: center;
}
</style>
