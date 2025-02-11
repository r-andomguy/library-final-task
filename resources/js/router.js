import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "./stores/auth";
import Home from './components/Home.vue';
import Login from './views/Login.vue';
import BookAdd from './components/Book/BookAdd.vue';
import BookList from './components/Book/BookList.vue';
import BookDetail from './components/Book/BookDetail.vue';
import BookEdit from './components/Book/BookEdit.vue';

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/auth-web', component: Login, name: 'auth-web' },
    { path: '/book/create', component: BookAdd },
    { path: '/books', component: BookList },
    { path: '/books/:id', component: BookDetail, props: true },
    { path: '/books/:id/edit', component: BookEdit },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.token) {
        next('/auth-web');
    } else {
        next();
    }
});

export default router;
