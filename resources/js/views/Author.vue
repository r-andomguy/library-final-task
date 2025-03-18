<template>
    <div class="container my-5">
        <h2 class="section-title">👨‍💻 Lista de Autores</h2>
        <button @click="showModal = true" class="btn btn-add-author">Adicionar Autor</button>

        <div v-if="message" class="notification" :class="{'notification-success': messageType === 'success', 'notification-error': messageType === 'error'}">
            {{ message }}
        </div>

        <div v-if="loading" class="text-center">Carregando...</div>
        <table v-else class="table author-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Estado</th>
                <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="author in authors" :key="author.id">
                <td>{{ author.id }}</td>
                <td>{{ author.name }}</td>
                <td>{{ author.state }}</td>
                <td>
                    <button @click="fetchAuthorDetails(author.id), showDetailsModal = true">Ver</button>
                    <button @click="openEditModal(author)">Editar</button>
                    <button @click="deleteAuthor(author.id)">Excluir</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <h3>Adicionar Autor</h3>
            <input v-model="author.name" placeholder="Nome" />
            <input v-model="author.state" placeholder="Estado" />
            <button @click="addAuthor(); showModal = false">Salvar</button>
            <button @click="showModal = false">Cancelar</button>
        </div>
    </div>

    <div v-if="showEditModal" class="modal">
        <div class="modal-content">
            <h3>Editar Autor</h3>
            <input v-model="author.name" placeholder="Nome" />
            <input v-model="author.state" placeholder="Estado" />
            <button @click="updateAuthor(); showEditModal = false">Atualizar</button>
            <button @click="showEditModal = false">Cancelar</button>
        </div>
    </div>

    <div v-if="showDetailsModal && selectedAuthor" class="modal">
        <div class="modal-content">
            <h3>Detalhes do Autor</h3>
            <p><strong>ID:</strong> {{ selectedAuthor.id }}</p>
            <p><strong>Nome:</strong> {{ selectedAuthor.name }}</p>
            <p><strong>Estado:</strong> {{ selectedAuthor.state }}</p>
            <button @click="showDetailsModal = false">Fechar</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthors } from "../composable/useAuthors";

const {
    authors,
    author,
    selectedAuthor,
    loading,
    message,
    messageType,
    fetchAuthorDetails,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    clearMessage
} = useAuthors();

const showModal = ref(false);
const showDetailsModal = ref(false);
const showEditModal = ref(false);

function openEditModal(authorData) {
    author.value = { ...authorData };
    showEditModal.value = true;
}
</script>

<style src="../style/style.css"></style>
