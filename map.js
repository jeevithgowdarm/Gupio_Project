// GPU Map Simulation
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('map-canvas');
    const ctx = canvas.getContext('2d');
    
    // Get user info
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userWelcome = document.getElementById('user-welcome');
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const loginLink = document.getElementById('login-link');
    
    // Update user info if logged in
    if (currentUser) {
        userWelcome.textContent = currentUser.name;
        userInfo.textContent = `Welcome, ${currentUser.name}`;
        logoutBtn.style.display = 'inline-block';
        loginLink.style.display = 'none';
    }
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Simulation variables
    let simulationRunning = false;
    let animationFrameId = null;
    let particles = [];
    let simulationType = 'temperature';
    let simulationSpeed = 5;
    let gpuUtilization = 0;
    let particleCount = 0;
    
    // DOM elements
    const startBtn = document.getElementById('start-simulation');
    const pauseBtn = document.getElementById('pause-simulation');
    const resetBtn = document.getElementById('reset-simulation');
    const simTypeSelect = document.getElementById('simulation-type');
    const simSpeedInput = document.getElementById('simulation-speed');
    const gpuInfo = document.getElementById('gpu-info');
    const particleCountEl = document.getElementById('particle-count');
    
    // Map data - simplified world map coordinates
    const mapData = {
        width: canvas.width,
        height: canvas.height,
        regions: [
            { name: 'North America', x: 150, y: 150, width: 200, height: 150 },
            { name: 'South America', x: 220, y: 300, width: 150, height: 200 },
            { name: 'Europe', x: 400, y: 150, width: 100, height: 100 },
            { name: 'Africa', x: 400, y: 250, width: 150, height: 200 },
            { name: 'Asia', x: 500, y: 150, width: 200, height: 200 },
            { name: 'Australia', x: 600, y: 350, width: 120, height: 100 }
        ]
    };
    
    // Color schemes for different simulation types
    const colorSchemes = {
        temperature: {
            min: '#0000FF', // Blue (cold)
            max: '#FF0000'  // Red (hot)
        },
        precipitation: {
            min: '#FFFFFF', // White (dry)
            max: '#0066FF'  // Blue (wet)
        },
        wind: {
            min: '#E0F7FA', // Light cyan (calm)
            max: '#006064'  // Dark cyan (windy)
        },
        pressure: {
            min: '#E1F5FE', // Light blue (low pressure)
            max: '#01579B'  // Dark blue (high pressure)
        }
    };
    
    // Initialize the canvas
    function initCanvas() {
        // Set canvas dimensions to match display size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        // Draw initial map
        drawMap();
    }
    
    // Draw the base map
    function drawMap() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ocean background
        ctx.fillStyle = '#E0F7FA';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw continents
        mapData.regions.forEach(region => {
            ctx.fillStyle = '#D7CCC8';
            ctx.fillRect(region.x, region.y, region.width, region.height);
            
            // Draw region borders
            ctx.strokeStyle = '#8D6E63';
            ctx.lineWidth = 1;
            ctx.strokeRect(region.x, region.y, region.width, region.height);
        });
    }
    
    // Create particles for simulation
    function createParticles() {
        particles = [];
        const particleDensity = simulationSpeed * 20; // More particles with higher speed
        
        // Create particles across the map
        for (let i = 0; i < particleDensity; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * simulationSpeed * 0.5,
                speedY: (Math.random() - 0.5) * simulationSpeed * 0.5,
                value: Math.random(), // 0 to 1 value for color interpolation
                region: getRegionAtPoint(Math.random() * canvas.width, Math.random() * canvas.height)
            });
        }
        
        particleCount = particles.length;
        particleCountEl.textContent = particleCount;
    }
    
    // Get region at a specific point
    function getRegionAtPoint(x, y) {
        for (const region of mapData.regions) {
            if (x >= region.x && x <= region.x + region.width &&
                y >= region.y && y <= region.y + region.height) {
                return region.name;
            }
        }
        return 'Ocean';
    }
    
    // Interpolate between two colors
    function interpolateColor(color1, color2, factor) {
        const result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
            const color1Value = parseInt(hex, 16);
            const color2Value = parseInt(color2.slice(1).match(/.{2}/g)[i], 16);
            const value = Math.round(color1Value + factor * (color2Value - color1Value));
            return value.toString(16).padStart(2, '0');
        }).join('');
        
        return `#${result}`;
    }
    
    // Update simulation
    function updateSimulation() {
        // Update GPU utilization (simulated)
        gpuUtilization = Math.min(95, gpuUtilization + (Math.random() * 5 - 2));
        if (gpuUtilization < 30) gpuUtilization = 30 + Math.random() * 10;
        gpuInfo.textContent = `${Math.round(gpuUtilization)}%`;
        
        // Update particles
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Boundary check
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }
            
            // Update region
            particle.region = getRegionAtPoint(particle.x, particle.y);
            
            // Slightly vary the value for animation effect
            particle.value += (Math.random() - 0.5) * 0.02;
            particle.value = Math.max(0, Math.min(1, particle.value));
        });
        
        // Update region info with random region
        if (Math.random() < 0.05) {
            const randomParticle = particles[Math.floor(Math.random() * particles.length)];
            document.getElementById('region-info').textContent = randomParticle.region;
        }
    }
    
    // Render the simulation
    function renderSimulation() {
        // Draw base map
        drawMap();
        
        // Draw particles
        particles.forEach(particle => {
            const colorScheme = colorSchemes[simulationType];
            const color = interpolateColor(colorScheme.min, colorScheme.max, particle.value);
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });
    }
    
    // Animation loop
    function animate() {
        if (simulationRunning) {
            updateSimulation();
            renderSimulation();
            animationFrameId = requestAnimationFrame(animate);
        }
    }
    
    // Start simulation
    function startSimulation() {
        if (!simulationRunning) {
            simulationRunning = true;
            canvas.classList.add('active-simulation');
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            animate();
        }
    }
    
    // Pause simulation
    function pauseSimulation() {
        simulationRunning = false;
        canvas.classList.remove('active-simulation');
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }
    
    // Reset simulation
    function resetSimulation() {
        pauseSimulation();
        gpuUtilization = 0;
        gpuInfo.textContent = '0%';
        document.getElementById('region-info').textContent = 'Global';
        createParticles();
        drawMap();
    }
    
    // Event listeners
    startBtn.addEventListener('click', startSimulation);
    pauseBtn.addEventListener('click', pauseSimulation);
    resetBtn.addEventListener('click', resetSimulation);
    
    simTypeSelect.addEventListener('change', function() {
        simulationType = this.value;
        if (simulationRunning) {
            renderSimulation();
        }
    });
    
    simSpeedInput.addEventListener('input', function() {
        simulationSpeed = parseInt(this.value);
        particles.forEach(particle => {
            particle.speedX = (Math.random() - 0.5) * simulationSpeed * 0.5;
            particle.speedY = (Math.random() - 0.5) * simulationSpeed * 0.5;
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        initCanvas();
        if (simulationRunning) {
            renderSimulation();
        }
    });
    
    // Initialize
    initCanvas();
    createParticles();
    pauseBtn.disabled = true;
});