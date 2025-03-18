<?php $__env->startSection('content'); ?>
    <div class="d-flex justify-content-center align-items-center min-vh-100">
        <div class="card p-4 shadow-lg" style="width: 400px;">
            <h2 class="text-center mb-4 text-dark">Login</h2>

            <?php if(session('error')): ?>
                <div class="alert alert-danger text-center">
                    <?php echo e(session('error')); ?>

                </div>
            <?php endif; ?>

            <form action="<?php echo e(route('auth.web.login')); ?>" method="POST">
                <?php echo csrf_field(); ?>
                <div class="mb-3">
                    <label for="email" class="form-label fw-bold">E-mail</label>
                    <input type="email" class="form-control form-control-lg border-dark" name="email" id="email" required>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label fw-bold">Senha</label>
                    <input type="password" class="form-control form-control-lg border-dark" name="password" id="password" required>
                </div>

                <button type="submit" class="btn btn-dark w-100 fw-bold">Entrar</button>
            </form>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\Elias\Desktop\library-final-task\resources\views/auth/login.blade.php ENDPATH**/ ?>