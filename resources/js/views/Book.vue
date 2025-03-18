<template>
    <div class="container my-5">
        <div class="book-list-container">
            <h2 class="section-title">📚 Lista de Livros</h2>
            <button @click="showModal = true" class="btn btn-add-book mb-3">Adicionar Livro</button>

            <div v-if="message" class="notification" :class="{'notification-success': messageType === 'success', 'notification-error': messageType === 'error'}">
                {{ message }}
            </div>

            <div v-if="loading" class="text-center">Carregando...</div>
            <table v-else class="table book-table align-middle">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Data de Publicação</th>
                    <th class="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="book in books" :key="book.id">
                    <td>{{ book.id }}</td>
                    <td>{{ book.title }}</td>
                    <td>{{ book.author?.name }}</td>
                    <td>{{ book.publishDate }}</td>
                    <td class="actions-cell">
                        <button @click="fetchBookDetails(book.id)" class="btn btn-view">Ver</button>
                        <button @click="fetchBookEdit(book.id)" class="btn btn-edit">Editar</button>
                        <button @click="handleDeleteBook(book.id)" class="btn btn-delete">Excluir</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { useBooks } from "../composable/useBooks";

const {
    books,
    authors,
    book,
    selectedBook,
    loading,
    showModal,
    showDetailsModal,
    showEditModal,
    message,
    messageType,
    loadBooks,
    loadBookDetails,
    loadAuthors,
    createBook,
    editBook,
    removeBook,
    clearMessage
} = useBooks();
</script>

<style src="../style/style.css"></style>
