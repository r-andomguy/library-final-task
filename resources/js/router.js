import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from "./stores/auth";
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Book from './views/Book.vue';
import Author from './views/Author.vue';

const routes = [
    {path: '/', component: Home, name: 'home',},
    {path: '/auth-web', component: Login, name: 'auth-web'},
    {path: '/books', component: Book, props: true},
    {path: '/authors', component: Author, props: true},
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta?.requiresAuth && !auth.token) {
        next('/auth-web');
    } else {
        next();
    }
});

export default router;
