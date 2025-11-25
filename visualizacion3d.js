// CMFO ASTRONOMÍA - SCRIPT PRINCIPAL CORREGIDO
document.addEventListener('DOMContentLoaded', function() {
    console.log('CMFO Astronomía Web - Inicializando...');
    
    // MENÚ MOBILE - VERSIÓN SIMPLIFICADA Y CONFIABLE
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (menuToggle && menuIcon) {
        // CLIC EN EL ÍCONO DEL MENÚ
        menuIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            menuToggle.checked = !menuToggle.checked;
            console.log('Menú toggled:', menuToggle.checked);
        });
        
        // CERRAR MENÚ AL HACER CLIC EN UN ENLACE (MOBILE)
        const menuLinks = document.querySelectorAll('.navbar .menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 820) {
                    menuToggle.checked = false;
                    console.log('Menú cerrado por click en enlace');
                }
            });
        });
        
        // CERRAR MENÚ AL HACER CLIC FUERA (MOBILE)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 820 && menuToggle.checked) {
                if (!e.target.closest('.navbar')) {
                    menuToggle.checked = false;
                    console.log('Menú cerrado por click fuera');
                }
            }
        });
        
        // CERRAR MENÚ AL REDIMENSIONAR A DESKTOP
        window.addEventListener('resize', function() {
            if (window.innerWidth > 820 && menuToggle.checked) {
                menuToggle.checked = false;
                console.log('Menú cerrado por resize a desktop');
            }
        });
    }
    
    // SMOOTH SCROLL PARA ENLACES INTERNOS
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
    
    console.log('CMFO Astronomía - Script inicializado correctamente');
});
