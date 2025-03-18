import { ref, onMounted } from "vue";
import { fetchBooks, fetchBookDetails, fetchAuthors, addBook, updateBook, deleteBook } from "../services/book/bookService";
import { useAuthStore } from "../stores/auth";
import { useRouter } from 'vue-router';

export function useBooks() {
    const authStore = useAuthStore();
    const router = useRouter();
    const books = ref([]);
    const authors = ref([]);
    const book = ref({});
    const selectedBook = ref(null);
    const loading = ref(true);
    const showModal = ref(false);
    const showDetailsModal = ref(false);
    const showEditModal = ref(false);
    const message = ref(null);
    const messageType = ref(null);

    function clearMessage() {
        message.value = null;
        messageType.value = null;
    }

    async function loadBooks() {
        try {
            clearMessage();
            books.value = await fetchBooks();
        } catch (error) {
            message.value = "Erro ao buscar livros.";
            messageType.value = 'error';
        } finally {
            loading.value = false;
        }
    }

    async function loadBookDetails(id) {
        try {
            clearMessage();
            selectedBook.value = await fetchBookDetails(id);
            showDetailsModal.value = true;
        } catch (error) {
            message.value = "Erro ao buscar detalhes.";
            messageType.value = 'error';
        }
    }

    async function loadAuthors() {
        try {
            clearMessage();
            authors.value = await fetchAuthors(authStore.user?.id);
        } catch (error) {
            message.value = "Erro ao buscar autores.";
            messageType.value = 'error';
        }
    }

    async function createBook() {
        try {
            clearMessage();
            await addBook(book.value);
            await loadBooks();
            showModal.value = false;
            message.value = "Livro adicionado!";
            messageType.value = 'success';
        } catch {
            message.value = "Erro ao adicionar o livro.";
            messageType.value = 'error';
        }
    }

    async function editBook() {
        try {
            clearMessage();
            await updateBook(book.value);
            await loadBooks();
            showEditModal.value = false;
            message.value = "Livro atualizado!";
            messageType.value = 'success';
        } catch {
            message.value = "Erro ao atualizar o livro.";
            messageType.value = 'error';
        }
    }

    async function removeBook(id) {
        if (confirm("Tem certeza?")) {
            try {
                clearMessage();
                await deleteBook(id, authStore.user?.id);
                await loadBooks();
                message.value = "Livro excluído!";
                messageType.value = 'success';
            } catch {
                message.value = "Erro ao excluir.";
                messageType.value = 'error';
            }
        }
    }

    onMounted(() => {
        loadBooks();
        loadAuthors();
    });

    return {
        books, authors, book, selectedBook, loading, showModal, showDetailsModal, showEditModal,
        message, messageType,
        loadBooks, loadBookDetails, loadAuthors, createBook, editBook, removeBook, clearMessage
    };
}
