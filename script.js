// CMFO ASTRONOMÍA - SCRIPT PRINCIPAL
document.addEventListener('DOMContentLoaded', function() {
    console.log('CMFO Astronomía Web - Cargado');
    
    // Menú móvil
    const menuToggle = document.getElementById('menu-toggle');
    const body = document.body;
    
    if (menuToggle) {
        menuToggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('show-menu');
            } else {
                body.classList.remove('show-menu');
            }
        });
    }
    
    // Cerrar menú al hacer clic en un enlace (móvil)
    const menuLinks = document.querySelectorAll('.navbar .menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 820) {
                menuToggle.checked = false;
                body.classList.remove('show-menu');
            }
        });
    });
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
