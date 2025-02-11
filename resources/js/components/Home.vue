<template>
    <div class="container text-center">
        <h1 class="mb-4 fw-bold text-dark">
            Bem-vindo
        </h1>
        <p class="mb-5 text-muted fs-5">
            Gerencie seus livros e autores de forma fácil, rápida e intuitiva.
        </p>

        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card shadow-lg border-0 rounded-3 overflow-hidden h-100">
                    <router-link to="/books" class="text-decoration-none">
                        <img src="/images/books.jpeg"
                             class="card-img-top img-fluid"
                             style="height: 250px; object-fit: cover;"
                             alt="Livros">
                    </router-link>
                    <div class="card-body d-flex flex-column text-center">
                        <h5 class="card-title fw-semibold text-dark">📖 Sessão de Livros</h5>
                        <p class="text-muted small">Gerencie seu acervo de forma prática</p>
                        <div class="mt-auto">
                            <router-link to="/books" class="btn btn-outline-dark w-100">
                                Acessar
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

