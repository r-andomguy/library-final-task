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

<style scoped>
.home-container {
    font-family: 'Arial', sans-serif;
    background-color: #ced4da;
    color: #fff;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.home-banner {
    text-align: center;
    margin-bottom: 2rem;
    padding: 0 2rem;
}

.home-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #343a40;
}

.home-subtitle {
    font-size: 1.2rem;
    color: #343a40;
    max-width: 700px;
    margin: 0 auto;
}

.home-cards-container {
    width: 100%;
    max-width: 1200px;
    padding: 0 1rem;
}

.home-card {
    background-color: #343a40;
    border: none;
    transition: transform 0.3s ease-in-out;
}

.home-card:hover {
    transform: scale(1.05);
}

.card-link {
    text-decoration: none;
    display: block;
    height: 100%;
}

.home-card-image {
    height: 200px;
    object-fit: cover;
    border-radius: 0.75rem 0.75rem 0 0;
}

.card-body {
    padding: 1.5rem;
}

.home-card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 200px);
}


.home-card-title {
    color: #f8f9fa;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
}

.home-card-text {
    color: #d0d0d0;
    text-align: center;
}

.notification {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.375rem;
    text-align: center;
}

.notification-warning {
    background-color: #fffaf0;
    color: #ed8936;
    border: 1px solid #ed8936;
}

.notification-error {
    background-color: #fdeded;
    color: #e53e3e;
    border: 1px solid #f9c9c9;
}

.notification-success {
    background-color: #e6f7ec;
    color: #37a35b;
    border: 1px solid #b2e0c8;
}
</style>
