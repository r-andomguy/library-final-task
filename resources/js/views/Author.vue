<template>
    <div class="container my-5">
        <div class="author-list-container"><h2 class="section-title">👨‍💻 Lista de Autores</h2>
            <button @click="showModal = true" class="btn btn-add-author mb-3"><i class="bi bi-person-plus"></i>
                Adicionar
                Autor
            </button>

            <div v-if="message" class="mt-3 notification"
                 :class="{'notification-success': messageType === 'success', 'notification-error': messageType === 'error'}">
                {{ message }}
            </div>

            <div v-if="loading" class="text-center">Carregando...</div>
            <table v-else class="table author-table align-middle">
                <thead class="table-header">
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Estado</th>
                    <th class="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="author in authors" :key="author.id" class="author-row">
                    <td><span class="badge author-badge">{{ author.id }}</span></td>
                    <td class="author-name">{{ author.name }}</td>
                    <td>{{ author.state }}</td>
                    <td class="actions-cell text-center">
                        <button @click="fetchAuthorDetails(author.id)" class="btn btn-action btn-view"><i
                            class="bi bi-eye"></i> Ver
                        </button>
                        <button @click="fetchAuthorEdit(author.id)" class="btn btn-action btn-edit"><i
                            class="bi bi-pencil"></i> Editar
                        </button>
                        <button @click="handleDeleteAuthor(author.id)" class="btn btn-action btn-delete"><i
                            class="bi bi-trash"></i> Excluir
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content author-modal">
                <div class="modal-header author-modal-header"><h5 class="modal-title author-modal-title">👨‍💻 Adicionar
                    Autor</h5>
                    <button type="button" class="btn-close" @click="showModal = false"></button>
                </div>
                <div class="modal-body author-modal-body">
                    <form @submit.prevent="addAuthor">
                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Nome</label> <input
                            v-model="author.name" type="text" class="form-control form-input" required/></div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Estado</label>
                            <textarea v-model="author.state" class="form-control form-textarea" rows="4"
                                      required></textarea></div>
                    </form>
                </div>
                <div class="modal-footer author-modal-footer">
                    <button type="button" class="btn btn-secondary form-btn btn-secondary-modal me-2"
                            @click="showModal = false">
                        Cancelar
                    </button>
                    <button type="submit" class="btn form-btn btn-primary" @click.prevent="addAuthor">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showDetailsModal" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content author-details-modal">
                <div class="modal-header author-details-header"><h5 class="modal-title author-details-title">📘 Detalhes
                    do
                    Autor</h5>
                    <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
                </div>
                <div class="modal-body author-details-body" v-if="selectedAuthor">
                    <ul class="list-group author-details-list">
                        <li class="list-group-item author-details-item"><strong>ID:</strong> {{ selectedAuthor.id }}
                        </li>
                        <li class="list-group-item author-details-item"><strong>Nome:</strong> {{ selectedAuthor.name }}
                        </li>
                        <li class="list-group-item author-details-item"><strong>Estado:</strong>
                            {{ selectedAuthor.state }}
                        </li>
                    </ul>
                </div>
                <div class="modal-footer author-details-footer">
                    <button type="button" class="btn btn-secondary form-btn btn-secondary-modal"
                            @click="showDetailsModal = false">Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content author-edit-modal">
                <div class="modal-header author-edit-header"><h5 class="modal-title author-edit-title">✏️ Editar
                    Autor</h5>
                    <button type="button" class="btn-close" @click="showEditModal = false"></button>
                </div>
                <div class="modal-body author-edit-body">
                    <form @submit.prevent="updateAuthor">
                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Nome</label> <input
                            v-model="author.name" type="text" class="form-control form-input" required/></div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Estado</label>
                            <textarea v-model="author.state" class="form-control form-textarea" rows="4"
                                      required></textarea></div>
                    </form>
                </div>
                <div class="modal-footer author-edit-footer">
                    <button type="button" class="btn btn-secondary form-btn btn-secondary-modal me-2"
                            @click="showEditModal = false">Cancelar
                    </button>
                    <button type="submit" class="btn form-btn btn-primary" @click.prevent="updateAuthor">Atualizar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showDetailsModal || showModal || showEditModal" class="modal-backdrop fade show"></div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useAuthStore} from "../stores/auth";
import { useRouter } from 'vue-router';
import api from "../api";

let authStore = useAuthStore();
const router = useRouter();
let authors = ref([]);
let author = ref({
    id: '',
    name: '',
    state: '',
});
let selectedAuthor = ref(null);
let loading = ref(true);
let showModal = ref(false);
let showDetailsModal = ref(false);
let showEditModal = ref(false);

let message = ref(null);
let messageType = ref(null);

function clearMessage() {
    message.value = null;
    messageType.value = null;
}


async function fetchAuthors() {
    try {
        clearMessage();
        let response = await api.get("/authors", {
            params: {user_id: authStore.user?.id}
        });
        authors.value = response.data;
    } catch (error) {

        if (
            error.response &&
            error.response.data &&
            error.response.data.message === "Acesso negado. Apenas administradores podem acessar esta rota."
        ) {
            await router.push({
                path: '/',
                query: {
                    message: "Acesso à sessão de autores restrito a administradores.",
                    messageType: 'warning'
                }
            });
        } else {
            message.value = "Erro ao buscar autores. Tente novamente.";
            messageType.value = 'error';
        }
    } finally {
        loading.value = false;
    }
}

async function fetchAuthorDetails(id) {
    try {
        clearMessage();
        let response = await api.get(`/authors/${id}`);
        selectedAuthor.value = response.data;
        showDetailsModal.value = true;
    } catch (error) {
        console.error("Erro ao buscar detalhes do autor", error);
        message.value = "Erro ao buscar detalhes do autor.";
        messageType.value = 'error';
    }
}


async function fetchAuthorEdit(id) {
    try {
        clearMessage();
        let response = await api.get(`/authors/${id}`);
        selectedAuthor.value = response.data;

        author.value = {
            id: selectedAuthor.value.id,
            name: selectedAuthor.value.name,
            state: selectedAuthor.value.state,
        };

        showEditModal.value = true;
    } catch (error) {
        console.error("Erro ao buscar detalhes do autor", error);
        message.value = "Erro ao buscar informações para edição.";
        messageType.value = 'error';
    }
}


const addAuthor = async () => {
    try {
        clearMessage();
        await api.post('/authors', author.value);
        await fetchAuthors();

        showModal.value = false;
        author.value = {name: '', state: ''};
        message.value = "Autor adicionado com sucesso!";
        messageType.value = 'success';
        setTimeout(clearMessage, 3000);
    } catch (error) {
        message.value = "Erro ao adicionar o autor. Por favor, tente novamente.";
        messageType.value = 'error';
        setTimeout(clearMessage, 3000);
    }
};

async function updateAuthor() {
    try {
        clearMessage();

        await api.put(
            `/authors/${author.value.id}`,
            author.value,
            {
                params: {user_id: authStore.user?.id},
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        await fetchAuthors();
        showEditModal.value = false;
        message.value = "Autor atualizado com sucesso!";
        messageType.value = 'success';
        setTimeout(clearMessage, 3000);
    } catch (error) {
        console.error("Erro ao atualizar o autor:", error);
        message.value = "Erro ao atualizar o autor. Por favor, tente novamente.";
        messageType.value = 'error';
        setTimeout(clearMessage, 3000);
    }
}

async function handleDeleteAuthor(id) {
    if (confirm("Tem certeza que deseja excluir este autor?")) {
        try {
            clearMessage();
            await deleteAuthor(id);
            await fetchAuthors();
            message.value = "Autor excluído com sucesso!";
            messageType.value = 'success';
            setTimeout(clearMessage, 3000);
        } catch (error) {
            console.error("Erro ao excluir o autor:", error);
            message.value = "Erro ao excluir o autor. Por favor, tente novamente.";
            messageType.value = 'error';
            setTimeout(clearMessage, 3000);
        }
    }
}


async function deleteAuthor(id) {
    try {
        await api.delete(`/authors/${id}`, {
            params: {user_id: authStore.user?.id}
        });
    } catch (error) {
        console.error("Erro ao excluir autor:", error);
        throw error;
    }
}


onMounted(() => {
    fetchAuthors();
});
</script>


<style scoped>
body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f7f9;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    max-width: 1200px;
}

.section-title {
    color: #4a5568;
    margin-bottom: 1.5rem;
}

.notification {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.375rem;
}

.notification-success {
    background-color: #e6f7ec;
    color: #37a35b;
    border: 1px solid #b2e0c8;
}

.notification-error {
    background-color: #fdeded;
    color: #e53e3e;
    border: 1px solid #f9c9c9;
}


.author-list-container {
    background-color: #e9ecef;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.author-table {
    background-color: transparent;
    border-collapse: separate;
    border-spacing: 0 0.5rem;
}

.table-header th {
    background-color: #cbd5e0;
    color: #4a5568;
    font-weight: 500;
    padding: 0.75rem 1rem;
    border-bottom: none;
    text-align: left;
}

.table-header th:first-child {
    border-radius: 0.75rem 0 0 0;
}

.table-header th:last-child {
    border-radius: 0 0.75rem 0 0;
}


.author-row {
    background-color: white;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.04);
}

.author-row td {
    padding: 0.75rem 1rem;
    border-top: none;
    border-bottom: none;
}

.author-row:hover {
    background-color: #f8fafc;
}


.author-row td:first-child {
    border-radius: 0.75rem 0 0 0.75rem;
}

.author-row td:last-child {
    border-radius: 0 0.75rem 0.75rem 0;
}


.author-badge {
    background-color: #a3b18a;
    color: white;
    font-weight: normal;
}

.author-name {
    font-weight: 500;
    color: #2d3748;
}

.actions-cell .btn-action {
    margin: 0 0.25rem;
}

.btn {
    border-radius: 0.5rem;
    padding: 0.6rem 1.2rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out, transform 0.1s ease;
}

.btn:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(107, 114, 128, 0.5);
}

.btn:hover {
    transform: scale(1.02);
}

.btn-primary, .form-btn.btn-primary {
    background-color: #63b3ed;
    color: white;
}

.btn-primary:hover, .form-btn.btn-primary:hover {
    background-color: #3182ce;
}

.btn-add-author {
    background-color: #48bb78;
    color: white;
}

.btn-add-author:hover {
    background-color: #2f855a;
}


.btn-secondary, .form-btn.btn-secondary, .form-btn.btn-secondary-modal, .btn-cancel {
    background-color: #e2e8f0;
    color: #4a5568;
}

.btn-secondary:hover, .form-btn.btn-secondary:hover, .form-btn.btn-secondary-modal:hover, .btn-cancel:hover {
    background-color: #cbd5e0;
}

.btn-outline-info {
    background-color: transparent;
    color: #63b3ed;
    border: 1px solid #63b3ed;
}

.btn-outline-info:hover {
    background-color: #e6f7ff;
}

.btn-outline-warning {
    background-color: transparent;
    color: #ed8936;
    border: 1px solid #ed8936;
}

.btn-outline-warning:hover {
    background-color: #fffaf0;
}

.btn-outline-danger {
    background-color: transparent;
    color: #e53e3e;
    border: 1px solid #e53e3e;
}

.btn-outline-danger:hover {
    background-color: #fdeded;
}


.btn-action {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
}

.btn-view {
    @apply btn-outline-info;
}

.btn-edit {
    @apply btn-outline-warning;
}

.btn-delete {
    @apply btn-outline-danger;
}


.modal-overlay {
    background: rgba(0, 0, 0, 0.6);
}

.modal-content.author-modal, .modal-content.author-edit-modal, .modal-content.author-details-modal {
    background-color: #f0f0f0; /* Changed modal background color */
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
    padding: 2rem;
    border-radius: 0.75rem;
}

.modal-title {
    color: #344a5e;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.modal-header.author-details-header, .modal-header.author-modal-header, .modal-header.author-edit-header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.modal-body.author-details-body, .modal-body.author-modal-body, .modal-body.author-edit-body {
    padding-bottom: 1.5rem;
}

.modal-footer.author-details-footer, .modal-footer.author-modal-footer, .modal-footer.author-edit-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
}


.form-group {
    margin-bottom: 1.5rem;
}

.form-label-bold {
    font-weight: bold;
    color: #4a5568;
    margin-bottom: 0.5rem;
    display: block;
}

.form-control {
    border: 1px solid #d2d6da;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    color: #333;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-control:focus {
    outline: none;
    border-color: #63b3ed;
    box-shadow: 0 0 0 0.2rem rgba(99, 179, 237, 0.25);
}

.form-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 7l3-3 3 3m-3-6v12"/></svg>');
    background-repeat: no-repeat;
    background-position-x: calc(100% - 0.75rem);
    background-position-y: 50%;
    background-size: 1rem;
    padding-right: 2rem;
}

.form-textarea {
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
}

.author-details-list .list-group-item {
    border: none;
    padding: 0.5rem 0;
    background-color: transparent;
    color: #4a5568;
}

.author-details-list .list-group-item:first-child {
    padding-top: 0;
}

.author-details-list .list-group-item:last-child {
    padding-bottom: 0;
}
</style>
