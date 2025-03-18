import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

export default function useLoginController() {
    const auth = useAuthStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const handleLogin = async () => {
        const success = await auth.login({ email: email.value, password: password.value });
        if (success) {
            setTimeout(() => {
                router.push("/");
            }, 500);
        } else {
            errorMessage.value = "Credenciais inválidas!";
        }
    };

    return { email, password, handleLogin, errorMessage };
}
