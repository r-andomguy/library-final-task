<template>
    <div class="container my-5">
        <div class="book-list-container"><h2 class="section-title">📚 Lista de Livros</h2>
            <button @click="showModal = true" class="btn btn-add-book mb-3"><i class="bi bi-book-plus"></i> Adicionar
                Livro
            </button>

            <div v-if="message" class="mt-3 notification"
                 :class="{'notification-success': messageType === 'success', 'notification-error': messageType === 'error'}">
                {{ message }}
            </div>

            <div v-if="loading" class="text-center">Carregando...</div>
            <table v-else class="table book-table align-middle">
                <thead class="table-header">
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Data de Publicação</th>
                    <th class="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="book in books" :key="book.id" class="book-row">
                    <td><span class="badge book-badge">{{ book.id }}</span></td>
                    <td class="book-title">{{ book.title }}</td>
                    <td>{{ book.author?.name }}</td>
                    <td>{{ book.publishDate }}</td>
                    <td class="actions-cell text-center">
                        <button @click="fetchBookDetails(book.id)" class="btn btn-action btn-view"><i
                            class="bi bi-eye"></i> Ver
                        </button>
                        <button @click="fetchBookEdit(book.id)" class="btn btn-action btn-edit"><i
                            class="bi bi-pencil"></i> Editar
                        </button>
                        <button @click="handleDeleteBook(book.id)" class="btn btn-action btn-delete"><i
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
            <div class="modal-content book-modal">
                <div class="modal-header book-modal-header"><h5 class="modal-title book-modal-title">📖 Adicionar
                    Livro</h5>
                    <button type="button" class="btn-close" @click="showModal = false"></button>
                </div>
                <div class="modal-body book-modal-body">
                    <form @submit.prevent="addBook">
                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Título</label> <input
                            v-model="book.title" type="text" class="form-control form-input" required/></div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Autor</label> <select
                            v-model="book.author" class="form-control form-select" required>
                            <option v-for="author in authors" :key="author.id" :value="author.id">
                                {{ author.name }}
                            </option>
                        </select>
                        </div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Data de
                            Publicação</label>
                            <input v-model="book.publishDate" type="date" class="form-control form-input" required/>
                        </div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Descrição</label>
                            <textarea v-model="book.description" class="form-control form-textarea" rows="4"
                                      required></textarea></div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Imagem da Capa</label>
                            <input type="file" @change="handleFileUpload" class="form-control form-file-input"
                                   accept="image/jpg, image/png"/></div>
                    </form>
                </div>
                <div class="modal-footer book-modal-footer">
                    <button type="button" class="btn btn-secondary form-btn btn-cancel me-2" @click="showModal = false">
                        Cancelar
                    </button>
                    <button type="submit" class="btn form-btn btn-primary" @click.prevent="addBook">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showDetailsModal" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content book-details-modal">
                <div class="modal-header book-details-header"><h5 class="modal-title book-details-title">📘 Detalhes do
                    Livro</h5>
                    <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
                </div>
                <div class="modal-body book-details-body" v-if="selectedBook"><img v-if="selectedBook.cover"
                                                                                   :src="`/storage/covers/${selectedBook.cover}`"
                                                                                   class="book-cover-image mb-3"
                                                                                   style="max-width: 100%;"/>
                    <ul class="list-group book-details-list">
                        <li class="list-group-item book-details-item"><strong>ID:</strong> {{ selectedBook.id }}</li>
                        <li class="list-group-item book-details-item"><strong>Título:</strong> {{ selectedBook.title }}
                        </li>
                        <li class="list-group-item book-details-item"><strong>Autor:</strong>
                            {{ selectedBook.author?.name }}
                        </li>
                        <li class="list-group-item book-details-item"><strong>Data de Publicação:</strong>
                            {{ selectedBook.publishDate }}
                        </li>
                        <li class="list-group-item book-details-item"><strong>Descrição:</strong>
                            {{ selectedBook.description }}
                        </li>
                    </ul>
                </div>
                <div class="modal-footer book-details-footer">
                    <button type="button" class="btn btn-secondary form-btn btn-secondary-modal"
                            @click="showDetailsModal = false">Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content book-edit-modal">
                <div class="modal-header book-edit-header"><h5 class="modal-title book-edit-title">✏️ Editar Livro</h5>
                    <button type="button" class="btn-close" @click="showEditModal = false"></button>
                </div>
                <div class="modal-body book-edit-body">
                    <form @submit.prevent="updateBook">
                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Título</label> <input
                            v-model="book.title" type="text" class="form-control form-input" required/></div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Autor</label> <select
                            v-model="book.author" class="form-control form-select" required>
                            <option v-for="author in authors" :key="author.id" :value="author.id">
                                {{ author.name }}
                            </option>
                        </select>
                        </div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Data de
                            Publicação</label>
                            <input v-model="book.publishDate" type="date" class="form-control form-input" required/>
                        </div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Descrição</label>
                            <textarea v-model="book.description" class="form-control form-textarea" rows="4"
                                      required></textarea></div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Capa Atual</label> <img
                            v-if="book.cover" :src="`/storage/covers/${book.cover}`" class="book-cover-image mb-3"
                            style="max-width: 100%;"/>
                            <p v-else class="text-muted">Nenhuma capa disponível.</p>
                        </div>

                        <div class="mb-3 form-group"><label class="form-label form-label-bold">Substituir Capa</label>
                            <input type="file" @change="handleFileUpload" class="form-control form-file-input"
                                   accept="image/jpg, image/png"/></div>
                    </form>
                </div>
                <div class="modal-footer book-edit-footer">
                    <button type="button" class="btn btn-secondary form-btn btn-cancel me-2"
                            @click="showEditModal = false">Cancelar
                    </button>
                    <button type="submit" class="btn form-btn btn-primary" @click.prevent="updateBook">Atualizar
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
let books = ref([]);
let authors = ref([]);
let book = ref({
    id: '',
    title: '',
    author: '',
    publishDate: '',
    description: '',
    cover: null
});
let selectedBook = ref(null);
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


async function fetchBooks() {
    try {
        clearMessage();
        let response = await api.get("/books");
        books.value = response.data;
    } catch (error) {

        if (
            error.response &&
            error.response.data &&
            error.response.data.message === "Acesso negado. Apenas administradores podem acessar esta rota."
        ) {
            await router.push({
                path: '/',
                query: {
                    message: "Acesso à sessão de livros restrito a administradores.",
                    messageType: 'warning'
                }
            });
        } else {
            message.value = "Erro ao buscar livros. Tente novamente.";
            messageType.value = 'error';
        }
    } finally {
        loading.value = false;
    }
}

async function fetchBookDetails(id) {
    try {
        clearMessage();
        let response = await api.get(`/books/${id}`);
        selectedBook.value = response.data;
        showDetailsModal.value = true;
    } catch (error) {
        console.error("Erro ao buscar detalhes do livro", error);
        message.value = "Erro ao buscar detalhes do livro.";
        messageType.value = 'error';
    }
}

async function fetchAuthors() {
    try {
        clearMessage();
        let response = await api.get("/authors", {
            params: {user_id: authStore.user?.id}
        });
        authors.value = response.data;
    } catch (error) {
        console.error("Erro ao buscar autores:", error);
        message.value = "Erro ao buscar autores.";
        messageType.value = 'error';
    }
}

async function fetchBookEdit(id) {
    try {
        clearMessage();
        let response = await api.get(`/books/${id}`);
        selectedBook.value = response.data;

        book.value = {
            id: selectedBook.value.id,
            title: selectedBook.value.title,
            author: selectedBook.value.author.id,
            publishDate: selectedBook.value.publishDate,
            description: selectedBook.value.description,
            cover: selectedBook.value.cover
        };

        showEditModal.value = true;
    } catch (error) {
        console.error("Erro ao buscar detalhes do livro", error);
        message.value = "Erro ao buscar informações para edição.";
        messageType.value = 'error';
    }
}

let handleFileUpload = (event) => {
    book.value.cover = event.target.files[0];
};

const addBook = async () => {
    try {
        clearMessage();
        let formData = new FormData();
        Object.keys(book.value).forEach((key) => {
            if (book.value[key]) formData.append(key, book.value[key]);
        });

        await api.post('/books', formData);
        await fetchBooks();

        showModal.value = false;
        book.value = {title: '', author: '', publishDate: '', description: '', cover: null};
        message.value = "Livro adicionado com sucesso!";
        messageType.value = 'success';
        setTimeout(clearMessage, 3000);
    } catch (error) {
        message.value = "Erro ao adicionar o livro. Por favor, tente novamente.";
        messageType.value = 'error';
        setTimeout(clearMessage, 3000);
    }
};

async function updateBook() {
    try {
        clearMessage();
        let data = {};

        let base64Cover = null;
        if (book.value.cover instanceof File) {
            const file = book.value.cover;
            base64Cover = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        Object.keys(book.value).forEach((key) => {
            if (book.value[key]) {
                if (key === 'cover' && base64Cover) {
                    data[key] = base64Cover;
                } else if (key !== 'cover') {
                    data[key] = book.value[key];
                }
            }
        });

        console.log("Dados a serem enviados como JSON:", data);

        await api.put(
            `/books/${book.value.id}`,
            data,
            {
                params: {user_id: authStore.user?.id},
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        await fetchBooks();
        showEditModal.value = false;
        message.value = "Livro atualizado com sucesso!";
        messageType.value = 'success';
        setTimeout(clearMessage, 3000);
    } catch (error) {
        console.error("Erro ao atualizar o livro:", error);
        message.value = "Erro ao atualizar o livro. Por favor, tente novamente.";
        messageType.value = 'error';
        setTimeout(clearMessage, 3000);
    }
}

async function handleDeleteBook(id) {
    if (confirm("Tem certeza que deseja excluir este livro?")) {
        try {
            clearMessage();
            await deleteBook(id);
            await fetchBooks();
            message.value = "Livro excluído com sucesso!";
            messageType.value = 'success';
            setTimeout(clearMessage, 3000);
        } catch (error) {
            console.error("Erro ao excluir o livro:", error);
            message.value = "Erro ao excluir o livro. Por favor, tente novamente.";
            messageType.value = 'error';
            setTimeout(clearMessage, 3000);
        }
    }
}


async function deleteBook(id) {
    try {
        await api.delete(`/books/${id}`, {
            params: {user_id: authStore.user?.id}
        });
    } catch (error) {
        console.error("Erro ao excluir livro:", error);
        throw error;
    }
}


onMounted(() => {
    fetchBooks();
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


.book-list-container {
    background-color: #e9ecef;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.book-table {
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


.book-row {
    background-color: white;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.04);
}

.book-row td {
    padding: 0.75rem 1rem;
    border-top: none;
    border-bottom: none;
}

.book-row:hover {
    background-color: #f8fafc;
}


.book-row td:first-child {
    border-radius: 0.75rem 0 0 0.75rem;
}

.book-row td:last-child {
    border-radius: 0 0.75rem 0.75rem 0;
}


.book-badge {
    background-color: #a3b18a;
    color: white;
    font-weight: normal;
}

.book-title {
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

.btn-add-book {
    background-color: #48bb78;
    color: white;
}

.btn-add-book:hover {
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

.modal-content.book-modal, .modal-content.book-edit-modal, .modal-content.book-details-modal {
    background-color: #f0f0f0;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
    padding: 2rem;
    border-radius: 0.75rem;
}

.modal-title {
    color: #344a5e;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.modal-header.book-details-header, .modal-header.book-modal-header, .modal-header.book-edit-header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.modal-body.book-details-body, .modal-body.book-modal-body, .modal-body.book-edit-body {
    padding-bottom: 1.5rem;
}

.modal-footer.book-details-footer, .modal-footer.book-modal-footer, .modal-footer.book-edit-footer {
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

.book-cover-image {
    border-radius: 0.5rem;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    border: none;
    padding: 0;
}

.book-details-list .list-group-item {
    border: none;
    padding: 0.5rem 0;
    background-color: transparent;
    color: #4a5568;
}

.book-details-list .list-group-item:first-child {
    padding-top: 0;
}

.book-details-list .list-group-item:last-child {
    padding-bottom: 0;
}


</style>
```
