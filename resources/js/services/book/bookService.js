import { ref, onMounted } from "vue";

export default {
    setup() {
        const books = ref([]);
        const authors = ref([]);
        const book = ref({ title: "", author: "", publishDate: "", description: "", cover: "" });
        const showModal = ref(false);
        const showDetailsModal = ref(false);
        const showEditModal = ref(false);
        const selectedBook = ref(null);
        const message = ref("");
        const messageType = ref("success");
        const loading = ref(true);

        const fetchBooks = async () => {
            loading.value = true;
            try {
                const response = await fetch('/api/books');
                books.value = await response.json();
            } catch (error) {
                console.error("Erro ao buscar livros:", error);
            } finally {
                loading.value = false;
            }
        };

        const fetchBookDetails = async (id) => {
            try {
                const response = await fetch(`/api/books/${id}`);
                selectedBook.value = await response.json();
                showDetailsModal.value = true;
            } catch (error) {
                console.error("Erro ao buscar detalhes do livro:", error);
            }
        };

        const fetchBookEdit = (id) => {
            const bookToEdit = books.value.find((b) => b.id === id);
            if (bookToEdit) {
                book.value = { ...bookToEdit };
                showEditModal.value = true;
            }
        };

        const addBook = async () => {
            try {
                const response = await fetch('/api/books', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(book.value),
                });
                if (response.ok) {
                    message.value = "Livro adicionado com sucesso!";
                    messageType.value = "success";
                    fetchBooks();
                } else {
                    message.value = "Erro ao adicionar livro.";
                    messageType.value = "error";
                }
            } catch (error) {
                console.error("Erro ao adicionar livro:", error);
            } finally {
                showModal.value = false;
            }
        };

        const updateBook = async () => {
            try {
                const response = await fetch(`/api/books/${book.value.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(book.value),
                });
                if (response.ok) {
                    message.value = "Livro atualizado com sucesso!";
                    messageType.value = "success";
                    fetchBooks();
                } else {
                    message.value = "Erro ao atualizar livro.";
                    messageType.value = "error";
                }
            } catch (error) {
                console.error("Erro ao atualizar livro:", error);
            } finally {
                showEditModal.value = false;
            }
        };

        const handleDeleteBook = async (id) => {
            if (!confirm("Tem certeza que deseja excluir este livro?")) return;
            try {
                const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
                if (response.ok) {
                    message.value = "Livro excluído com sucesso!";
                    messageType.value = "success";
                    fetchBooks();
                } else {
                    message.value = "Erro ao excluir livro.";
                    messageType.value = "error";
                }
            } catch (error) {
                console.error("Erro ao excluir livro:", error);
            }
        };

        onMounted(fetchBooks);

        return {
            books,
            book,
            authors,
            selectedBook,
            showModal,
            showDetailsModal,
            showEditModal,
            message,
            messageType,
            loading,
            fetchBookDetails,
            fetchBookEdit,
            addBook,
            updateBook,
            handleDeleteBook,
        };
    },
};
