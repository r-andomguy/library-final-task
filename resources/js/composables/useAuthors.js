// src/composables/useAuthors.js
import { ref, onMounted } from "vue";
import { fetchAuthors, fetchAuthorDetails, addAuthor, updateAuthor, deleteAuthor } from "../services/author/authorService";
import { useAuthStore } from "../stores/auth";

export function useAuthors() {
    const authStore = useAuthStore();
    const authors = ref([]);
    const author = ref({ id: "", name: "", state: "" });
    const selectedAuthor = ref(null);
    const loading = ref(false);
    const message = ref(null);
    const messageType = ref(null);

    function clearMessage() {
        message.value = null;
        messageType.value = null;
    }

    async function loadAuthors() {
        try {
            loading.value = true;
            clearMessage();
            authors.value = await fetchAuthors(authStore.user?.id);
        } catch (error) {
            message.value = "Erro ao buscar autores.";
            messageType.value = "error";
        } finally {
            loading.value = false;
        }
    }

    async function loadAuthorDetails(id) {
        try {
            selectedAuthor.value = await fetchAuthorDetails(id);
        } catch (error) {
            message.value = "Erro ao buscar detalhes do autor.";
            messageType.value = "error";
        }
    }

    async function createAuthor() {
        try {
            await addAuthor(author.value);
            await loadAuthors();
            message.value = "Autor adicionado com sucesso!";
            messageType.value = "success";
        } catch (error) {
            message.value = "Erro ao adicionar autor.";
            messageType.value = "error";
        }
    }

    async function editAuthor() {
        try {
            await updateAuthor(author.value);
            await loadAuthors();
            message.value = "Autor atualizado com sucesso!";
            messageType.value = "success";
        } catch (error) {
            message.value = "Erro ao atualizar autor.";
            messageType.value = "error";
        }
    }

    async function removeAuthor(id) {
        try {
            await deleteAuthor(id);
            await loadAuthors();
            message.value = "Autor excluído com sucesso!";
            messageType.value = "success";
        } catch (error) {
            message.value = "Erro ao excluir autor.";
            messageType.value = "error";
        }
    }

    onMounted(loadAuthors);

    return {
        authors,
        author,
        selectedAuthor,
        loading,
        message,
        messageType,
        loadAuthors,
        loadAuthorDetails,
        createAuthor,
        editAuthor,
        removeAuthor,
        clearMessage,
    };
}
