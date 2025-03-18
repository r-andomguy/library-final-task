<template>
    <div class="home-container">
        <div class="home-banner">
            <h1 class="home-title">
                Bem-vindo à Biblioteca Inovcorp
            </h1>
            <p class="home-subtitle">
                Gerencie seus livros e autores de forma intuitiva e eficiente.
            </p>
        </div>

        <div class="home-cards-container">
            <div class="row justify-content-center">
                <div class="col-md-6 mb-4">
                    <div class="card home-card shadow-lg rounded-3 overflow-hidden h-100">
                        <router-link to="/books" class="card-link">
                            <img src="/images/books.jpeg"
                                 class="card-img-top home-card-image"
                                 alt="Livros">
                            <div
                                class="card-body home-card-body d-flex flex-column align-items-center justify-content-center">
                                <h5 class="card-title home-card-title">📖 Sessão de Livros</h5>
                                <p class="home-card-text">Explore e organize seu acervo de livros.</p>
                            </div>
                        </router-link>
                    </div>
                </div>

                <div class="col-md-6 mb-4">
                    <div class="card home-card shadow-lg rounded-3 overflow-hidden h-100">
                        <router-link to="/authors" class="card-link">
                            <img src="/images/authors.jpg"
                                 class="card-img-top home-card-image"
                                 alt="Autores">
                            <div
                                class="card-body home-card-body d-flex flex-column align-items-center justify-content-center">
                                <h5 class="card-title home-card-title">👨‍💻 Sessão de Autores</h5>
                                <p class="home-card-text">Gerencie a lista de autores e suas informações.</p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showMessage" class="mt-4 notification"
             :class="notificationClasses">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const route = useRoute();
const router = useRouter();

const message = ref('');
const messageType = ref('');
const showMessage = ref(false);
const notificationClasses = ref({});

const clearNotification = () => {
    showMessage.value = false;
    message.value = '';
    messageType.value = '';
    router.replace({ query: {} });
};

onMounted(() => {
    if (route.query.message) {
        message.value = route.query.message.toString();
        messageType.value = route.query.messageType ? route.query.messageType.toString() : 'warning';

        notificationClasses.value = {
            'notification-warning': messageType.value === 'warning',
            'notification-error': messageType.value === 'error',
            'notification-success': messageType.value === 'success'
        };
        showMessage.value = true;

        setTimeout(clearNotification, 3000);
    }
});
</script>

<style src="../style/style.css"></style>
