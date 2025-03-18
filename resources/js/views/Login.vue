<template>
    <div class="login-container">
        <div class="login-card">
            <h2 class="login-title">Acessar sua Conta</h2>
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input v-model="email" type="email" id="email" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="password" class="form-label">Senha</label>
                    <input v-model="password" type="password" id="password" class="form-control" required />
                </div>
                <button type="submit" class="btn login-button">Entrar</button>
            </form>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
import useLogin from "../composable/useLogin";

export default {
    setup() {
        return useLogin();
    },
};
</script>

<style src="../style/style.css"></style>
