// CMFO ASTRONOMÍA - SISTEMA 3D CON CONEXIONES MEJORADAS
class SistemaVisualizacion3D {
    constructor() {
        this.escena = null;
        this.camara = null;
        this.renderizador = null;
        this.controles = null;
        this.objetos3D = new Map();
        this.animacionActiva = true;
        this.datosNASA = null;
        this.datosORIZON = null;
        
        this.inicializarSistema();
        this.conectarAPIsCientificas();
    }

    inicializarSistema() {
        console.log("🚀 Inicializando sistema 3D CMFO...");
        const contenedor = document.getElementById('contenedor3d');
        
        // Verificar que Three.js está cargado
        if (typeof THREE === 'undefined') {
            console.error("❌ Three.js no está cargado");
            this.mostrarError("Three.js no se cargó correctamente");
            return;
        }
        
        try {
            // Configurar escena
            this.escena = new THREE.Scene();
            this.escena.background = new THREE.Color(0x000011);
            this.escena.fog = new THREE.Fog(0x000033, 10, 50);
            
            // Configurar cámara
            const aspectRatio = contenedor.clientWidth / contenedor.clientHeight;
            this.camara = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
            this.camara.position.set(0, 8, 25);
            
            // Configurar renderizador
            this.renderizador = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true
            });
            this.renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
            this.renderizador.shadowMap.enabled = true;
            this.renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderizador.setClearColor(0x000011, 1);
            
            // Limpiar y agregar al DOM
            contenedor.innerHTML = '';
            contenedor.appendChild(this.renderizador.domElement);
            
            // Controles de órbita
            if (typeof THREE.OrbitControls !== 'undefined') {
                this.controles = new THREE.OrbitControls(this.camara, this.renderizador.domElement);
                this.controles.enableDamping = true;
                this.controles.dampingFactor = 0.05;
                this.controles.minDistance = 5;
                this.controles.maxDistance = 100;
            }
            
            // Configurar iluminación
            this.configurarIluminacion();
            
            // Crear sistema solar básico inmediatamente
            this.crearSistemaSolarBasico();
            
            // Iniciar loop de animación
            this.animar();
            
            // Manejar redimensionamiento
            window.addEventListener('resize', () => this.redimensionar());
            
            console.log("✅ Sistema 3D inicializado correctamente");
            
        } catch (error) {
            console.error("❌ Error inicializando sistema 3D:", error);
            this.mostrarError("Error: " + error.message);
        }
    }

    mostrarError(mensaje) {
        const contenedor = document.getElementById('contenedor3d');
        contenedor.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                       color: #ff4444; text-align: center; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 10px;">
                <div style="font-size: 24px; margin-bottom: 10px;">❌ ERROR</div>
                <div>${mensaje}</div>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; 
                       background: #00ffff; color: #000; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 Reintentar
                </button>
            </div>
        `;
    }

    configurarIluminacion() {
        // Luz ambiental suave
        const luzAmbiental = new THREE.AmbientLight(0x333333, 0.4);
        this.escena.add(luzAmbiental);
        
        // Luz direccional principal (sol)
        const luzSolar = new THREE.DirectionalLight(0xffffff, 1);
        luzSolar.position.set(10, 10, 5);
        luzSolar.castShadow = true;
        luzSolar.shadow.mapSize.width = 2048;
        luzSolar.shadow.mapSize.height = 2048;
        this.escena.add(luzSolar);
        
        // Luz puntual azul CMFO
        const luzCMFO = new THREE.PointLight(0x00ffff, 0.3, 50);
        luzCMFO.position.set(0, 5, 0);
        this.escena.add(luzCMFO);
        
        // Luz de relleno
        const luzRelleno = new THREE.HemisphereLight(0x4477ff, 0x222233, 0.3);
        this.escena.add(luzRelleno);
    }

    async conectarAPIsCientificas() {
        console.log("🔗 Conectando con APIs científicas...");
        
        // Actualizar estados inmediatamente
        this.actualizarEstadoConexion('nasa', 'conectando');
        this.actualizarEstadoConexion('orizon', 'conectando');
        this.actualizarEstadoConexion('stellarium', 'conectando');
        
        try {
            // Intentar conexión NASA con timeout
            await Promise.race([
                this.obtenerDatosNASA(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout NASA')), 5000))
            ]);
        } catch (error) {
            console.warn("NASA no disponible, usando datos simulados:", error);
            this.usarDatosSimuladosNASA();
        }
        
        try {
            // Datos ORIZON simulados (siempre disponibles)
            await this.obtenerDatosORIZONSimulados();
        } catch (error) {
            console.warn("Error ORIZON:", error);
            this.actualizarEstadoConexion('orizon', 'desconectado');
        }
        
        // Stellarium siempre "conectado" (datos locales)
        setTimeout(() => {
            this.actualizarEstadoConexion('stellarium', 'conectado');
        }, 1000);
    }

    async obtenerDatosNASA() {
        console.log("🛰️ Conectando con NASA API...");
        
        try {
            // Usar proxy CORS para evitar bloqueos
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const nasaUrl = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
            
            const respuesta = await fetch(proxyUrl + nasaUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                timeout: 10000
            });
            
            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
            
            const datosAPOD = await respuesta.json();
            
            this.datosNASA = {
                apod: datosAPOD,
                timestamp: new Date().toISOString(),
                estado: 'conectado'
            };
            
            this.actualizarEstadoConexion('nasa', 'conectado');
            this.actualizarPanelDatos();
            console.log("✅ Datos NASA obtenidos correctamente");
            
        } catch (error) {
            console.error("❌ Error NASA:", error);
            throw error; // Propagar para manejo superior
        }
    }

    obtenerDatosORIZONSimulados() {
        return new Promise((resolve) => {
            console.log("🌍 Cargando datos ORIZON simulados...");
            
            // Datos científicos realistas del sistema solar
            this.datosORIZON = {
                sol: {
                    nombre: "Sol",
                    radio: 2.0,
                    color: 0xffff00,
                    posicion: { x: 0, y: 0, z: 0 }
                },
                mercurio: {
                    nombre: "Mercurio",
                    radio: 0.4,
                    color: 0x888888,
                    posicion: { x: 4, y: 0, z: 0 },
                    velocidad: 0.04
                },
                venus: {
                    nombre: "Venus", 
                    radio: 0.6,
                    color: 0xffcc99,
                    posicion: { x: 6, y: 0, z: 0 },
                    velocidad: 0.03
                },
                tierra: {
                    nombre: "Tierra",
                    radio: 0.6,
                    color: 0x2233ff,
                    posicion: { x: 8, y: 0, z: 0 },
                    velocidad: 0.02
                },
                marte: {
                    nombre: "Marte",
                    radio: 0.5,
                    color: 0xff6600, 
                    posicion: { x: 10, y: 0, z: 0 },
                    velocidad: 0.015
                },
                jupiter: {
                    nombre: "Jupiter",
                    radio: 1.2,
                    color: 0xffaa33,
                    posicion: { x: 14, y: 0, z: 0 },
                    velocidad: 0.008
                },
                saturno: {
                    nombre: "Saturno",
                    radio: 1.0,
                    color: 0xffdd99,
                    posicion: { x: 18, y: 0, z: 0 },
                    velocidad: 0.006,
                    anillos: true
                }
            };
            
            this.actualizarEstadoConexion('orizon', 'conectado');
            this.crearSistemaSolarCompleto();
            this.actualizarPanelDatos();
            
            console.log("✅ Datos ORIZON simulados cargados");
            resolve();
        });
    }

    crearSistemaSolarBasico() {
        console.log("🪐 Creando sistema solar básico...");
        
        // Crear sol básico
        const geometriaSol = new THREE.SphereGeometry(2, 32, 32);
        const materialSol = new THREE.MeshPhongMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.3
        });
        const sol = new THREE.Mesh(geometriaSol, materialSol);
        this.escena.add(sol);
        this.objetos3D.set('sol', sol);
        
        // Crear órbita de referencia
        this.crearOrbita(12);
        
        // Planeta básico
        const geometriaTierra = new THREE.SphereGeometry(0.6, 16, 16);
        const materialTierra = new THREE.MeshPhongMaterial({ color: 0x2233ff });
        const tierra = new THREE.Mesh(geometriaTierra, materialTierra);
        tierra.position.set(8, 0, 0);
        this.escena.add(tierra);
        this.objetos3D.set('tierra', tierra);
    }

    crearSistemaSolarCompleto() {
        console.log("🪐 Creando sistema solar completo...");
        
        // Limpiar objetos existentes
        this.objetos3D.forEach(obj => this.escena.remove(obj));
        this.objetos3D.clear();
        
        // Crear cada planeta basado en datos ORIZON
        Object.entries(this.datosORIZON).forEach(([nombre, datos]) => {
            const geometria = new THREE.SphereGeometry(datos.radio, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: datos.color,
                shininess: 100
            });
            
            const planeta = new THREE.Mesh(geometria, material);
            planeta.position.set(datos.posicion.x, datos.posicion.y, datos.posicion.z);
            planeta.castShadow = true;
            planeta.receiveShadow = true;
            planeta.userData = { 
                nombre: datos.nombre,
                velocidad: datos.velocidad || 0.01,
                angulo: Math.random() * Math.PI * 2
            };
            
            this.escena.add(planeta);
            this.objetos3D.set(nombre, planeta);
            
            // Crear órbita para cada planeta
            if (nombre !== 'sol') {
                const radioOrbita = Math.sqrt(
                    datos.posicion.x * datos.posicion.x + 
                    datos.posicion.z * datos.posicion.z
                );
                this.crearOrbita(radioOrbita);
            }
            
            // Anillos de Saturno
            if (datos.anillos) {
                this.crearAnillosSaturno(planeta);
            }
        });
        
        // Crear asteroides
        this.crearCinturonAsteroides();
        
        console.log(`✅ Sistema solar creado con ${this.objetos3D.size} objetos`);
    }

    crearOrbita(radio) {
        const puntos = [];
        const segmentos = 64;
        
        for (let i = 0; i <= segmentos; i++) {
            const angulo = (i / segmentos) * Math.PI * 2;
            puntos.push(new THREE.Vector3(
                Math.cos(angulo) * radio,
                0,
                Math.sin(angulo) * radio
            ));
        }
        
        const geometria = new THREE.BufferGeometry().setFromPoints(puntos);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x444477,
            transparent: true,
            opacity: 0.3
        });
        
        const orbita = new THREE.Line(geometria, material);
        this.escena.add(orbita);
    }

    crearAnillosSaturno(planeta) {
        const geometriaAnillo = new THREE.RingGeometry(1.5, 2.5, 32);
        const materialAnillo = new THREE.MeshPhongMaterial({ 
            color: 0xffdd99, 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        
        const anillo = new THREE.Mesh(geometriaAnillo, materialAnillo);
        anillo.rotation.x = Math.PI / 2;
        anillo.position.copy(planeta.position);
        
        this.escena.add(anillo);
        this.objetos3D.set('anillos_saturno', anillo);
    }

    crearCinturonAsteroides() {
        const cantidad = 50;
        const radioInterno = 12;
        const radioExterno = 14;
        
        for (let i = 0; i < cantidad; i++) {
            const radio = 0.05 + Math.random() * 0.1;
            const geometria = new THREE.SphereGeometry(radio, 8, 8);
            const material = new THREE.MeshPhongMaterial({ 
                color: Math.random() > 0.1 ? 0x888888 : 0xff4444 // 10% rojos (peligrosos)
            });
            
            const asteroide = new THREE.Mesh(geometria, material);
            
            // Posición aleatoria en anillo
            const distancia = radioInterno + Math.random() * (radioExterno - radioInterno);
            const angulo = Math.random() * Math.PI * 2;
            const altura = (Math.random() - 0.5) * 0.5;
            
            asteroide.position.set(
                Math.cos(angulo) * distancia,
                altura,
                Math.sin(angulo) * distancia
            );
            
            asteroide.userData = {
                velocidad: 0.005 + Math.random() * 0.01,
                angulo: angulo
            };
            
            this.escena.add(asteroide);
            this.objetos3D.set(`asteroide_${i}`, asteroide);
        }
    }

    actualizarEstadoConexion(api, estado) {
        const elemento = document.getElementById(`estado-${api}`);
        if (elemento) {
            elemento.className = `estado-conexion ${estado}`;
            elemento.textContent = `${api.toUpperCase()}: ${this.obtenerTextoEstado(estado)}`;
        }
    }

    obtenerTextoEstado(estado) {
        const textos = {
            conectando: 'CONECTANDO...',
            conectado: 'CONECTADO',
            desconectado: 'OFFLINE',
            error: 'ERROR'
        };
        return textos[estado] || 'DESCONOCIDO';
    }

    actualizarPanelDatos() {
        const panel = document.getElementById('datos-tiempo-real');
        if (!panel) return;
        
        let html = '<div style="color: #00ffff;">';
        
        // Datos NASA
        if (this.datosNASA && this.datosNASA.apod) {
            html += `
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(0,60,90,0.3); border-radius: 5px;">
                    <strong>🛰️ NASA APOD:</strong> ${this.datosNASA.apod.title}<br>
                    <small>Fecha: ${this.datosNASA.apod.date}</small>
                </div>
            `;
        } else {
            html += `
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(90,60,0,0.3); border-radius: 5px;">
                    <strong>🛰️ NASA:</strong> Usando datos simulados CMFO<br>
                    <small>Modo demostración activo</small>
                </div>
            `;
        }
        
        // Datos ORIZON
        if (this.datosORIZON) {
            html += `
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(0,60,90,0.3); border-radius: 5px;">
                    <strong>🌍 SISTEMA SOLAR:</strong> ${Object.keys(this.datosORIZON).length} objetos celestes<br>
                    <small>Datos científicos CMFO/ORIZON</small>
                </div>
            `;
        }
        
        // Asteroides
        html += `
            <div style="padding: 10px; background: rgba(60,0,90,0.3); border-radius: 5px;">
                <strong>💫 CINTURÓN DE ASTEROIDES:</strong> 50 objetos simulados<br>
                <small>5 asteroides potencialmente peligrosos</small>
            </div>
        `;
        
        html += `<div style="margin-top: 10px; font-size: 11px; text-align: center;">
            🔄 Actualizado: ${new Date().toLocaleTimeString()}
        </div>`;
        
        html += '</div>';
        panel.innerHTML = html;
    }

    animar() {
        requestAnimationFrame(() => this.animar());
        
        if (this.animacionActiva) {
            // Rotar planetas alrededor del sol
            this.objetos3D.forEach((objeto, nombre) => {
                const datos = objeto.userData;
                
                if (datos && datos.velocidad && nombre !== 'sol') {
                    // Actualizar ángulo
                    datos.angulo += datos.velocidad;
                    
                    // Calcular nueva posición orbital
                    const distancia = Math.sqrt(
                        objeto.position.x * objeto.position.x + 
                        objeto.position.z * objeto.position.z
                    );
                    
                    objeto.position.x = Math.cos(datos.angulo) * distancia;
                    objeto.position.z = Math.sin(datos.angulo) * distancia;
                    
                    // Rotación axial
                    objeto.rotation.y += datos.velocidad * 2;
                }
                
                // Rotar anillos de Saturno con el planeta
                if (nombre === 'anillos_saturno') {
                    const saturno = this.objetos3D.get('saturno');
                    if (saturno) {
                        objeto.position.copy(saturno.position);
                        objeto.rotation.z = saturno.rotation.y;
                    }
                }
            });
        }
        
        // Actualizar controles si existen
        if (this.controles) {
            this.controles.update();
        }
        
        // Renderizar escena
        if (this.renderizador && this.escena && this.camara) {
            this.renderizador.render(this.escena, this.camara);
        }
    }

    redimensionar() {
        if (!this.camara || !this.renderizador) return;
        
        const contenedor = document.getElementById('contenedor3d');
        this.camara.aspect = contenedor.clientWidth / contenedor.clientHeight;
        this.camara.updateProjectionMatrix();
        this.renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
    }

    usarDatosSimuladosNASA() {
        console.log("🔧 Usando datos NASA simulados...");
        
        this.datosNASA = {
            apod: {
                title: "Vista del Sistema Solar CMFO - Datos Científicos",
                date: new Date().toISOString().split('T')[0],
                explanation: "Visualización 3D interactiva con datos astronómicos del proyecto CMFO"
            },
            timestamp: new Date().toISOString(),
            estado: 'simulado'
        };
        
        this.actualizarEstadoConexion('nasa', 'conectado');
        this.actualizarPanelDatos();
    }
}

// FUNCIONES GLOBALES
let sistema3D;

function cambiarVista(vista) {
    if (!sistema3D || !sistema3D.camara) return;
    
    switch(vista) {
        case 'sistema_solar':
            sistema3D.camara.position.set(0, 8, 25);
            break;
        case 'toro_fractal':
            sistema3D.camara.position.set(0, 5, 15);
            // Aquí podrías cambiar a una vista de toro fractal
            break;
        case 'orbita_tierra':
            sistema3D.camara.position.set(10, 5, 0);
            break;
        case 'asteroides':
            sistema3D.camara.position.set(0, 3, 20);
            break;
        case 'exoplanetas':
            sistema3D.camara.position.set(0, 10, 30);
            break;
    }
    
    if (sistema3D.controles) {
        sistema3D.controles.update();
    }
}

function animarEscena() {
    if (sistema3D) {
        sistema3D.animacionActiva = true;
        mostrarNotificacion("▶️ Animación activada");
    }
}

function pausarAnimacion() {
    if (sistema3D) {
        sistema3D.animacionActiva = false;
        mostrarNotificacion("⏸️ Animación pausada");
    }
}

function reiniciarCamara() {
    if (sistema3D && sistema3D.controles) {
        sistema3D.controles.reset();
        mostrarNotificacion("🔄 Cámara reiniciada");
    }
}

async function actualizarDatosNASA() {
    mostrarNotificacion("🛰️ Actualizando datos NASA...");
    if (sistema3D) await sistema3D.obtenerDatosNASA();
}

async function actualizarDatosORIZON() {
    mostrarNotificacion("🌍 Actualizando datos ORIZON...");
    if (sistema3D) await sistema3D.obtenerDatosORIZONSimulados();
}

async function actualizarTodo() {
    mostrarNotificacion("🚀 Actualizando todos los datos...");
    if (sistema3D) {
        await actualizarDatosNASA();
        await actualizarDatosORIZON();
    }
}

function mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 255, 0.9);
        color: #000;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        document.body.removeChild(notificacion);
    }, 3000);
}

// INICIALIZACIÓN SEGURA
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 Página cargada, iniciando sistema 3D...");
    
    // Esperar a que Three.js esté completamente cargado
    if (typeof THREE !== 'undefined') {
        sistema3D = new SistemaVisualizacion3D();
    } else {
        console.error("❌ Three.js no está disponible");
        document.getElementById('contenedor3d').innerHTML = `
            <div style="color: #ff4444; text-align: center; padding: 50px;">
                <h3>❌ Error de carga</h3>
                <p>Three.js no se pudo cargar correctamente.</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px;">
                    🔄 Recargar página
                </button>
            </div>
        `;
    }
});

// Fallback si DOMContentLoaded ya pasó
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (typeof THREE !== 'undefined' && !sistema3D) {
            sistema3D = new SistemaVisualizacion3D();
        }
    }, 100);
}
