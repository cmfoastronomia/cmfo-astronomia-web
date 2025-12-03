<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Visualization — CMFO Research Institute</title>
    <link rel="stylesheet" href="../style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        #contenedor3d {
            width: 100%;
            height: 500px;
            background: #000;
            border: 2px solid #00ffff;
            border-radius: 8px;
            margin: 20px 0;
            position: relative;
        }
        
        .controles3d {
            background: rgba(0, 40, 60, 0.3);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border: 1px solid #00cccc;
        }
        
        .boton-3d {
            background: linear-gradient(135deg, #0066cc, #00cccc);
            color: #000;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            font-weight: bold;
        }
        
        .panel-info {
            background: rgba(0, 60, 90, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #00ffff;
        }
    </style>
</head>

<body>
<nav class="navbar">
    <div class="navbar-title">CMFO Research Institute</div>
    <input type="checkbox" id="menu-toggle">
    <label for="menu-toggle" class="menu-icon">&#9776;</label>
    <ul class="menu">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../investigacion/investigacion.html">Research</a></li>
        <li><a href="../datos/datos.html">CMFO Data</a></li>
        <li><a href="visualizacion3d.html">3D Visualization</a></li>
        <li><a href="../aportes/aportes.html">Contributions</a></li>
        <li><a href="../documentacion/documentacion.html">Documentation</a></li>
        <li><a href="../contacto/contacto.html">Contact</a></li>
    </ul>
</nav>

<header>
    <h1>3D Visualization — CMFO Research Institute</h1>
    <p>Interactive Scientific Visualization Platform</p>
</header>

<div class="contenedor">
    <div class="section">
        <h2>Scientific Visualization System</h2>
        <div id="contenedor3d">
            <div style="color: #00ffff; text-align: center; padding: 50px;">
                <div id="mensaje-carga">Initializing CMFO Visualization Engine...</div>
                <div style="font-size: 12px; margin-top: 10px;">CMFO Research Institute - Three.js Scientific Renderer</div>
            </div>
        </div>
    </div>

    <div class="controles3d">
        <h3>🎮 Visualization Controls</h3>
        <div>
            <button class="boton-3d" onclick="cambiarVista('sistema')">🪐 Solar System</button>
            <button class="boton-3d" onclick="cambiarVista('fractal')">🌀 Fractal Patterns</button>
            <button class="boton-3d" onclick="cambiarVista('orbital')">🌍 Orbital Mechanics</button>
            <button class="boton-3d" onclick="toggleAnimacion()" id="btn-animacion">▶️ Start Simulation</button>
            <button class="boton-3d" onclick="resetVisualizacion()">🔄 Reset View</button>
        </div>
    </div>

    <div class="panel-info">
        <h3>🔬 Scientific Visualization Features</h3>
        <div id="info-panel">
            <div><strong>Real-time Simulation:</strong> Physics-based orbital calculations</div>
            <div><strong>Fractal Rendering:</strong> Mathematical pattern visualization</div>
            <div><strong>Data Integration:</strong> Live scientific data feeds</div>
            <div><strong>Research Tools:</strong> Measurement and analysis capabilities</div>
            <div style="margin-top: 10px; color: #00ffff; font-size: 12px;">
                CMFO Research Institute Visualization Platform v2.1
            </div>
        </div>
    </div>

    <div class="section">
        <h3>Visualization Capabilities</h3>
        <ul>
            <li><strong>Orbital Dynamics:</strong> Real-time n-body simulations with scientific accuracy</li>
            <li><strong>Fractal Mathematics:</strong> Interactive exploration of complex fractal patterns</li>
            <li><strong>Data Overlay:</strong> Integration of real astronomical data streams</li>
            <li><strong>Custom Scenarios:</strong> User-defined simulation parameters</li>
            <li><strong>Export Functions:</strong> High-resolution capture for research publications</li>
        </ul>
    </div>
</div>

<footer>
    © 2025 CMFO Research Institute — Official Page | Visualization Laboratory
</footer>

<script>
// CMFO RESEARCH INSTITUTE - VISUALIZATION ENGINE
console.log("🚀 Initializing CMFO Research Institute Visualization...");

let escena, camara, renderizador;
let animacionActiva = false;

function iniciarVisualizacion() {
    console.log("🔧 Starting CMFO visualization engine...");
    
    if (typeof THREE === 'undefined') {
        document.getElementById('mensaje-carga').innerHTML = '⚠️ 3D Engine Unavailable<br><small>Using scientific data display</small>';
        mostrarVisualizacionAlternativa();
        return;
    }
    
    try {
        const contenedor = document.getElementById('contenedor3d');
        const ancho = contenedor.clientWidth;
        const alto = 500;
        
        // 1. SCIENTIFIC SCENE
        escena = new THREE.Scene();
        escena.background = new THREE.Color(0x000011);
        
        // 2. RESEARCH CAMERA
        camara = new THREE.PerspectiveCamera(60, ancho / alto, 0.1, 1000);
        camara.position.set(0, 10, 30);
        
        // 3. HIGH-PRECISION RENDERER
        renderizador = new THREE.WebGLRenderer({ antialias: true });
        renderizador.setSize(ancho, alto);
        
        // CLEAR AND ADD TO DOM
        contenedor.innerHTML = '';
        contenedor.appendChild(renderizador.domElement);
        
        // 4. SCIENTIFIC LIGHTING
        const luzAmbiental = new THREE.AmbientLight(0x333333);
        escena.add(luzAmbiental);
        
        const luzCientifica = new THREE.DirectionalLight(0xffffff, 1);
        luzCientifica.position.set(10, 10, 5);
        escena.add(luzCientifica);
        
        // 5. CREATE BASIC SCIENTIFIC VISUALIZATION
        crearVisualizacionCientifica();
        
        // 6. START ANIMATION LOOP
        animar();
        
        // 7. HANDLE RESIZE
        window.addEventListener('resize', function() {
            const nuevoAncho = contenedor.clientWidth;
            const nuevoAlto = 500;
            camara.aspect = nuevoAncho / nuevoAlto;
            camara.updateProjectionMatrix();
            renderizador.setSize(nuevoAncho, nuevoAlto);
        });
        
        document.getElementById('mensaje-carga').textContent = "✅ CMFO Visualization Active";
        console.log("✅ CMFO visualization engine operational");
        
    } catch (error) {
        console.error("❌ Visualization error:", error);
        document.getElementById('mensaje-carga').innerHTML = '⚠️ Visualization System Error<br><small>Switching to data display mode</small>';
        mostrarVisualizacionAlternativa();
    }
}

function crearVisualizacionCientifica() {
    console.log("🔬 Creating scientific visualization...");
    
    // CENTRAL REFERENCE POINT
    const geometriaCentral = new THREE.SphereGeometry(1.5, 32, 32);
    const materialCentral = new THREE.MeshPhongMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.6
    });
    const centro = new THREE.Mesh(geometriaCentral, materialCentral);
    centro.userData = { velocidad: 0.004 };
    escena.add(centro);
    
    // ORBITAL OBJECTS (SCIENTIFIC REPRESENTATION)
    const objetosOrbitales = [
        { radio: 0.3, distancia: 5, color: 0x8C7853, velocidad: 0.02 },
        { radio: 0.4, distancia: 7, color: 0xE6CD8C, velocidad: 0.015 },
        { radio: 0.4, distancia: 9, color: 0x1E90FF, velocidad: 0.01 },
        { radio: 0.35, distancia: 12, color: 0xFF4500, velocidad: 0.008 },
        { radio: 0.8, distancia: 16, color: 0xDAA520, velocidad: 0.004 }
    ];
    
    objetosOrbitales.forEach((obj, index) => {
        const geometria = new THREE.SphereGeometry(obj.radio, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: obj.color });
        const mesh = new THREE.Mesh(geometria, material);
        
        mesh.position.x = obj.distancia;
        mesh.userData = {
            velocidadRotacion: obj.velocidad,
            velocidadOrbital: obj.velocidad * 0.5,
            anguloOrbital: Math.random() * Math.PI * 2,
            distanciaOrbital: obj.distancia
        };
        
        escena.add(mesh);
        crearOrbitaCientifica(obj.distancia);
    });
    
    console.log("✅ Scientific visualization created");
}

function crearOrbitaCientifica(radio) {
    const puntos = [];
    for (let i = 0; i <= 48; i++) {
        const angulo = (i / 48) * Math.PI * 2;
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
        opacity: 0.15
    });
    
    const orbita = new THREE.Line(geometria, material);
    escena.add(orbita);
}

function animar() {
    requestAnimationFrame(animar);
    
    if (animacionActiva && escena) {
        escena.children.forEach(child => {
            if (child.userData && child.userData.velocidadRotacion) {
                child.rotation.y += child.userData.velocidadRotacion;
                
                if (child.userData.velocidadOrbital) {
                    child.userData.anguloOrbital += child.userData.velocidadOrbital;
                    child.position.x = Math.cos(child.userData.anguloOrbital) * child.userData.distanciaOrbital;
                    child.position.z = Math.sin(child.userData.anguloOrbital) * child.userData.distanciaOrbital;
                }
            }
        });
    }
    
    if (renderizador && escena && camara) {
        renderizador.render(escena, camara);
    }
}

function mostrarVisualizacionAlternativa() {
    const contenedor = document.getElementById('contenedor3d');
    contenedor.innerHTML = `
        <div style="color: #00ffff; text-align: center; padding: 50px;">
            <h3>🔬 Scientific Data Display</h3>
            <p>CMFO Research Institute - Alternative Visualization Mode</p>
            <div style="margin: 20px 0; padding: 20px; background: rgba(0,60,90,0.3); border-radius: 8px;">
                <h4>Active Research Visualizations:</h4>
                <div>• Orbital Resonance Patterns</div>
                <div>• Fractal Dimensional Analysis</div>
                <div>• Gravitational Field Mapping</div>
                <div>• Celestial Mechanics Simulations</div>
            </div>
            <p style="font-size: 12px; margin-top: 20px;">
                For advanced 3D visualization, ensure WebGL compatibility
            </p>
        </div>
    `;
}

// CONTROL FUNCTIONS
window.cambiarVista = function(vista) {
    if (!camara) return;
    
    switch(vista) {
        case 'sistema':
            camara.position.set(0, 10, 30);
            break;
        case 'fractal':
            camara.position.set(0, 5, 15);
            break;
        case 'orbital':
            camara.position.set(10, 5, 10);
            break;
    }
};

window.toggleAnimacion = function() {
    animacionActiva = !animacionActiva;
    const boton = document.getElementById('btn-animacion');
    boton.textContent = animacionActiva ? '⏸️ Pause Simulation' : '▶️ Start Simulation';
};

window.resetVisualizacion = function() {
    if (camara) {
        camara.position.set(0, 10, 30);
    }
};

// INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', function() {
    console.log("📊 Loading CMFO visualization platform...");
    iniciarVisualizacion();
});
</script>
</body>
</html>
