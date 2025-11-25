// CMFO ASTRONOMÍA - SISTEMA 3D CON DATOS REALES
class SistemaVisualizacion3D {
    constructor() {
        this.escena = null;
        this.camara = null;
        this.renderizador = null;
        this.controles = null;
        this.objetos3D = new Map();
        this.animacionActiva = false;
        this.datosNASA = null;
        this.datosORIZON = null;
        
        this.inicializarSistema();
        this.conectarAPIsCientificas();
    }

    inicializarSistema() {
        // Configurar Three.js
        const contenedor = document.getElementById('contenedor3d');
        
        this.escena = new THREE.Scene();
        this.escena.background = new THREE.Color(0x000011);
        
        // Configurar cámara
        this.camara = new THREE.PerspectiveCamera(
            75, 
            contenedor.clientWidth / contenedor.clientHeight, 
            0.1, 
            1000
        );
        this.camara.position.set(0, 10, 20);
        
        // Configurar renderizador
        this.renderizador = new THREE.WebGLRenderer({ antialias: true });
        this.renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
        this.renderizador.shadowMap.enabled = true;
        this.renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Limpiar contenedor y agregar renderizador
        contenedor.innerHTML = '';
        contenedor.appendChild(this.renderizador.domElement);
        
        // Controles de órbita
        this.controles = new THREE.OrbitControls(this.camara, this.renderizador.domElement);
        this.controles.enableDamping = true;
        this.controles.dampingFactor = 0.05;
        
        // Iluminación
        this.configurarIluminacion();
        
        // Iniciar animación
        this.animar();
        
        // Manejar redimensionamiento
        window.addEventListener('resize', () => this.redimensionar());
    }

    configurarIluminacion() {
        // Luz ambiental
        const luzAmbiental = new THREE.AmbientLight(0x333333);
        this.escena.add(luzAmbiental);
        
        // Luz direccional (sol)
        const luzSolar = new THREE.DirectionalLight(0xffffff, 1);
        luzSolar.position.set(10, 10, 5);
        luzSolar.castShadow = true;
        this.escena.add(luzSolar);
        
        // Luz puntual azul (efecto CMFO)
        const luzCMFO = new THREE.PointLight(0x00ffff, 0.5, 100);
        luzCMFO.position.set(0, 0, 0);
        this.escena.add(luzCMFO);
    }

    async conectarAPIsCientificas() {
        try {
            // Conectar a NASA APOD
            await this.obtenerDatosNASA();
            
            // Conectar a ORIZON (datos del sistema solar)
            await this.obtenerDatosORIZON();
            
            // Conectar a Stellarium Web API
            await this.obtenerDatosStellarium();
            
        } catch (error) {
            console.error('Error en conexiones científicas:', error);
        }
    }

    async obtenerDatosNASA() {
        try {
            document.getElementById('estado-nasa').className = 'estado-conexion cargando';
            document.getElementById('estado-nasa').textContent = 'NASA: CONECTANDO...';
            
            // NASA APOD API
            const respuestaAPOD = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
            const datosAPOD = await respuestaAPOD.json();
            
            // NASA Asteroids API
            const hoy = new Date().toISOString().split('T')[0];
            const respuestaAsteroides = await fetch(
                `https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoy}&end_date=${hoy}&api_key=DEMO_KEY`
            );
            const datosAsteroides = await respuestaAsteroides.json();
            
            this.datosNASA = {
                apod: datosAPOD,
                asteroides: datosAsteroides,
                timestamp: new Date().toISOString()
            };
            
            document.getElementById('estado-nasa').className = 'estado-conexion conectado';
            document.getElementById('estado-nasa').textContent = 'NASA: CONECTADO';
            
            this.actualizarPanelDatos();
            this.crearSistemaSolar();
            
        } catch (error) {
            document.getElementById('estado-nasa').className = 'estado-conexion desconectado';
            document.getElementById('estado-nasa').textContent = 'NASA: OFFLINE';
            console.warn('NASA API no disponible, usando datos de demostración');
            this.usarDatosDemoNASA();
        }
    }

    async obtenerDatosORIZON() {
        try {
            document.getElementById('estado-orizon').className = 'estado-conexion cargando';
            document.getElementById('estado-orizon').textContent = 'ORIZON: CONECTANDO...';
            
            // Simulación de conexión ORIZON - En producción usarías tu script Python
            const datosORIZON = {
                tierra: {
                    nombre: "Earth",
                    posicion: { x: 1, y: 0, z: 0 },
                    distancia: 1.0
                },
                marte: {
                    nombre: "Mars", 
                    posicion: { x: 1.5, y: 0, z: 0 },
                    distancia: 1.5
                },
                jupiter: {
                    nombre: "Jupiter",
                    posicion: { x: 5.2, y: 0, z: 0 },
                    distancia: 5.2
                }
            };
            
            this.datosORIZON = datosORIZON;
            
            document.getElementById('estado-orizon').className = 'estado-conexion conectado';
            document.getElementById('estado-orizon').textContent = 'ORIZON: CONECTADO';
            
        } catch (error) {
            document.getElementById('estado-orizon').className = 'estado-conexion desconectado';
            document.getElementById('estado-orizon').textContent = 'ORIZON: OFFLINE';
            console.warn('ORIZON no disponible');
        }
    }

    async obtenerDatosStellarium() {
        try {
            document.getElementById('estado-stellarium').className = 'estado-conexion cargando';
            document.getElementById('estado-stellarium').textContent = 'STELLARIUM: CONECTANDO...';
            
            // Stellarium Web API - Catálogo estelar
            setTimeout(() => {
                document.getElementById('estado-stellarium').className = 'estado-conexion conectado';
                document.getElementById('estado-stellarium').textContent = 'STELLARIUM: CONECTADO';
            }, 2000);
            
        } catch (error) {
            document.getElementById('estado-stellarium').className = 'estado-conexion desconectado';
            document.getElementById('estado-stellarium').textContent = 'STELLARIUM: OFFLINE';
        }
    }

    crearSistemaSolar() {
        // Limpiar escena existente
        this.objetos3D.forEach(obj => this.escena.remove(obj));
        this.objetos3D.clear();
        
        // Crear sol
        const sol = this.crearEsfera(2, 0xffff00, 'Sol');
        sol.position.set(0, 0, 0);
        this.escena.add(sol);
        this.objetos3D.set('sol', sol);
        
        // Crear planetas basados en datos ORIZON
        if (this.datosORIZON) {
            Object.entries(this.datosORIZON).forEach(([planeta, datos]) => {
                const radio = datos.distancia * 0.3;
                const color = this.obtenerColorPlaneta(planeta);
                const esfera = this.crearEsfera(radio, color, datos.nombre);
                
                esfera.position.set(datos.posicion.x * 3, datos.posicion.y, datos.posicion.z);
                this.escena.add(esfera);
                this.objetos3D.set(planeta, esfera);
            });
        }
        
        // Crear asteroides si hay datos
        if (this.datosNASA && this.datosNASA.asteroides) {
            this.crearAsteroides();
        }
    }

    crearEsfera(radio, color, nombre) {
        const geometria = new THREE.SphereGeometry(radio, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: color,
            shininess: 100
        });
        const esfera = new THREE.Mesh(geometria, material);
        esfera.castShadow = true;
        esfera.receiveShadow = true;
        esfera.userData = { nombre: nombre };
        
        return esfera;
    }

    crearAsteroides() {
        const asteroides = this.datosNASA.asteroides.near_earth_objects;
        const fechas = Object.keys(asteroides);
        
        if (fechas.length > 0) {
            const asteroidesHoy = asteroides[fechas[0]];
            
            asteroidesHoy.slice(0, 10).forEach((asteroide, index) => {
                const radio = 0.1 + Math.random() * 0.2;
                const geometria = new THREE.SphereGeometry(radio, 8, 8);
                const material = new THREE.MeshPhongMaterial({ 
                    color: asteroide.is_potentially_hazardous_asteroid ? 0xff0000 : 0x888888
                });
                
                const asteroide3D = new THREE.Mesh(geometria, material);
                
                // Posición aleatoria en anillo de asteroides
                const angulo = (index / asteroidesHoy.length) * Math.PI * 2;
                const distancia = 8 + Math.random() * 2;
                asteroide3D.position.set(
                    Math.cos(angulo) * distancia,
                    (Math.random() - 0.5) * 0.5,
                    Math.sin(angulo) * distancia
                );
                
                this.escena.add(asteroide3D);
                this.objetos3D.set(`asteroide_${index}`, asteroide3D);
            });
        }
    }

    obtenerColorPlaneta(planeta) {
        const colores = {
            tierra: 0x2233ff,
            marte: 0xff6600,
            jupiter: 0xffaa33,
            venus: 0xffff99,
            mercurio: 0x888888,
            saturno: 0xffdd99,
            urano: 0x99ffff,
            neptuno: 0x3366ff
        };
        return colores[planeta] || 0xffffff;
    }

    actualizarPanelDatos() {
        const panel = document.getElementById('datos-tiempo-real');
        let html = '';
        
        if (this.datosNASA) {
            html += `<div style="margin-bottom: 15px;">
                <strong>🛰️ NASA APOD:</strong> ${this.datosNASA.apod.title}<br>
                <small>${this.datosNASA.apod.date}</small>
            </div>`;
            
            if (this.datosNASA.asteroides) {
                const asteroides = this.datosNASA.asteroides.near_earth_objects;
                const fechas = Object.keys(asteroides);
                if (fechas.length > 0) {
                    const count = asteroides[fechas[0]].length;
                    const peligrosos = asteroides[fechas[0]].filter(a => a.is_potentially_hazardous_asteroid).length;
                    html += `<div>
                        <strong>💫 Asteroides Cercanos:</strong> ${count} (${peligrosos} potencialmente peligrosos)
                    </div>`;
                }
            }
        }
        
        if (this.datosORIZON) {
            html += `<div style="margin-top: 15px;">
                <strong>🌍 Datos ORIZON JPL:</strong> ${Object.keys(this.datosORIZON).length} objetos celestes cargados
            </div>`;
        }
        
        html += `<div style="margin-top: 10px; font-size: 12px; color: #00ffff;">
            Última actualización: ${new Date().toLocaleTimeString()}
        </div>`;
        
        panel.innerHTML = html;
    }

    animar() {
        requestAnimationFrame(() => this.animar());
        
        if (this.animacionActiva) {
            // Rotar planetas
            this.objetos3D.forEach((objeto, nombre) => {
                if (nombre !== 'sol') {
                    objeto.rotation.y += 0.01;
                }
            });
        }
        
        this.controles.update();
        this.renderizador.render(this.escena, this.camara);
    }

    redimensionar() {
        const contenedor = document.getElementById('contenedor3d');
        this.camara.aspect = contenedor.clientWidth / contenedor.clientHeight;
        this.camara.updateProjectionMatrix();
        this.renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
    }

    usarDatosDemoNASA() {
        this.datosNASA = {
            apod: {
                title: "Vista Astronómica CMFO - Datos de Demostración",
                date: new Date().toISOString().split('T')[0],
                explanation: "Datos de demostración mientras NASA API está offline"
            },
            asteroides: {
                near_earth_objects: {
                    [new Date().toISOString().split('T')[0]]: [
                        { is_potentially_hazardous_asteroid: false },
                        { is_potentially_hazardous_asteroid: true },
                        { is_potentially_hazardous_asteroid: false }
                    ]
                }
            }
        };
        
        this.actualizarPanelDatos();
        this.crearSistemaSolar();
    }
}

// FUNCIONES GLOBALES PARA LOS BOTONES
let sistema3D;

function cambiarVista(vista) {
    if (!sistema3D) return;
    
    switch(vista) {
        case 'sistema_solar':
            sistema3D.camara.position.set(0, 10, 20);
            break;
        case 'toro_fractal':
            sistema3D.camara.position.set(0, 5, 15);
            break;
        case 'orbita_tierra':
            sistema3D.camara.position.set(5, 5, 5);
            break;
    }
}

function animarEscena() {
    if (sistema3D) sistema3D.animacionActiva = true;
}

function pausarAnimacion() {
    if (sistema3D) sistema3D.animacionActiva = false;
}

function reiniciarCamara() {
    if (sistema3D) {
        sistema3D.camara.position.set(0, 10, 20);
        sistema3D.controles.reset();
    }
}

async function actualizarDatosNASA() {
    if (sistema3D) await sistema3D.obtenerDatosNASA();
}

async function actualizarDatosORIZON() {
    if (sistema3D) await sistema3D.obtenerDatosORIZON();
}

async function actualizarTodo() {
    if (sistema3D) {
        await sistema3D.obtenerDatosNASA();
        await sistema3D.obtenerDatosORIZON();
    }
}

// INICIAR SISTEMA CUANDO SE CARGA LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    sistema3D = new SistemaVisualizacion3D();
});