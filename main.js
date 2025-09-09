import * as THREE from "three";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  
  // Step 1: Enable WebXR support
  renderer.xr.enabled = true;

  // Step 2: Create AR Button
  function createARButton() {
    const button = document.createElement('button');
    button.style.position = 'absolute';
    button.style.bottom = '20px';
    button.style.left = '50%';
    button.style.transform = 'translateX(-50%)';
    button.style.padding = '12px 24px';
    button.style.background = '#1f1f1f';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.fontFamily = 'Arial, sans-serif';
    button.textContent = 'Enter AR';

    button.onclick = async () => {
      if (navigator.xr) {
        try {
          const session = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['local-floor']
          });
          renderer.xr.setSession(session);
          button.textContent = 'Exit AR';
          
          session.addEventListener('end', () => {
            button.textContent = 'Enter AR';
          });
        } catch (error) {
          console.log('AR not supported or failed:', error);
          button.textContent = 'AR Not Available';
        }
      } else {
        console.log('WebXR not supported');
        button.textContent = 'WebXR Not Supported';
      }
    };

    document.body.appendChild(button);
    return button;
  }

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 50;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 25;

  const scene = new THREE.Scene();

  // MOUSE/TOUCH CONTROLS: Add OrbitControls for navigation
  let controls;
  
  // Import controls dynamically to avoid issues
  import('https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js')
    .then(({ OrbitControls }) => {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; // Smooth camera movement
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableRotate = true;
      controls.autoRotate = false;
      
      // Set boundaries
      controls.minDistance = 10;
      controls.maxDistance = 100;
      controls.maxPolarAngle = Math.PI; // Allow full vertical rotation
    })
    .catch(error => {
      console.log('OrbitControls not available:', error);
    });

  // RAYCASTING: Set up click detection for planets
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let clickableObjects = []; // Store planet meshes for clicking

  // PLANET FACTS: Database of planet information
  const planetFacts = {
    sun: {
      name: "The Sun",
      facts: [
        "The Sun is 4.6 billion years old",
        "Surface temperature: 5,778K (5,505°C)",
        "It's 109 times wider than Earth",
        "The Sun accounts for 99.86% of our solar system's mass"
      ]
    },
    mercury: {
      name: "Mercury", 
      facts: [
        "Closest planet to the Sun",
        "One day on Mercury = 59 Earth days",
        "No atmosphere or moons",
        "Temperature ranges from -173°C to 427°C"
      ]
    },
    venus: {
      name: "Venus",
      facts: [
        "Hottest planet in our solar system",
        "Surface temperature: 462°C",
        "Spins backwards (retrograde rotation)",
        "One day on Venus = 243 Earth days"
      ]
    },
    earth: {
      name: "Earth",
      facts: [
        "The only known planet with life",
        "71% of surface is covered by water",
        "Has one natural satellite (the Moon)",
        "Atmosphere is 78% nitrogen, 21% oxygen"
      ]
    },
    mars: {
      name: "Mars",
      facts: [
        "Known as the 'Red Planet'",
        "Has the largest volcano in the solar system",
        "One day on Mars = 24.6 Earth hours",
        "Has two small moons: Phobos and Deimos"
      ]
    },
    jupiter: {
      name: "Jupiter",
      facts: [
        "Largest planet in our solar system",
        "Has a Great Red Spot storm for 400+ years",
        "Has at least 95 known moons",
        "Could fit 1,300 Earths inside it"
      ]
    },
    saturn: {
      name: "Saturn",
      facts: [
        "Famous for its prominent ring system",
        "Has at least 146 known moons",
        "Less dense than water",
        "Winds can reach 1,800 km/h"
      ]
    },
    uranus: {
      name: "Uranus",
      facts: [
        "Rotates on its side (98° tilt)",
        "Coldest planetary atmosphere: -224°C",
        "Has faint rings discovered in 1977",
        "Has 27 known moons"
      ]
    },
    neptune: {
      name: "Neptune",
      facts: [
        "Windiest planet with speeds up to 2,100 km/h",
        "Farthest planet from the Sun",
        "One year on Neptune = 165 Earth years",
        "Has 16 known moons"
      ]
    }
  };

  // UI CREATION: Create info panel for displaying facts
  function createInfoPanel() {
    const panel = document.createElement('div');
    panel.id = 'info-panel';
    panel.style.position = 'absolute';
    panel.style.top = '20px';
    panel.style.left = '20px';
    panel.style.background = 'rgba(0, 0, 0, 0.8)';
    panel.style.color = 'white';
    panel.style.padding = '20px';
    panel.style.borderRadius = '10px';
    panel.style.maxWidth = '300px';
    panel.style.display = 'none';
    panel.style.fontSize = '14px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.zIndex = '1000';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => panel.style.display = 'none';
    
    panel.appendChild(closeButton);
    document.body.appendChild(panel);
    return panel;
  }

  const infoPanel = createInfoPanel();

  // CLICK HANDLER: Function to show planet facts
  function showPlanetInfo(planetName) {
    const info = planetFacts[planetName];
    if (!info) return;

    const title = document.createElement('h3');
    title.textContent = info.name;
    title.style.margin = '0 0 15px 0';
    title.style.color = '#ffd700';

    const factsList = document.createElement('ul');
    factsList.style.margin = '0';
    factsList.style.paddingLeft = '20px';
    
    info.facts.forEach(fact => {
      const listItem = document.createElement('li');
      listItem.textContent = fact;
      listItem.style.marginBottom = '8px';
      factsList.appendChild(listItem);
    });

    // Clear previous content and add new
    infoPanel.innerHTML = '';
    
    // Re-add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => infoPanel.style.display = 'none';
    
    infoPanel.appendChild(closeButton);
    infoPanel.appendChild(title);
    infoPanel.appendChild(factsList);
    infoPanel.style.display = 'block';
  }

  // CLICK DETECTION: Mouse and touch event handlers
  function onPointerDown(event) {
    event.preventDefault();

    // Handle both mouse and touch events
    let clientX, clientY;
    if (event.type === 'touchstart') {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Calculate mouse position in normalized device coordinates
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with clickable objects
    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const planetName = clickedObject.userData.planetName;
      if (planetName) {
        showPlanetInfo(planetName);
      }
    }
  }

  // Add event listeners for both mouse and touch
  renderer.domElement.addEventListener('mousedown', onPointerDown, false);
  renderer.domElement.addEventListener('touchstart', onPointerDown, false);

  // Step 5: Create a group for the solar system to scale it for AR
  const solarSystemGroup = new THREE.Group();
  solarSystemGroup.scale.setScalar(0.5);
  scene.add(solarSystemGroup);

  // OPTIMIZATION: Improved lighting setup
  {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1, 2, 4);
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(1, -1, -2);
    scene.add(fillLight);
  }

  // TEXTURE LOADING: Create texture loader with optimizations
  const textureLoader = new THREE.TextureLoader();
  const textures = {};
  const texturePromises = [];
  
  const textureFiles = {
    sun: './assets/sun.jpg',
    mercury: './assets/mercury.jpg',
    venus: './assets/venus.jpg',
    earth: './assets/earth.jpg',
    mars: './assets/mars.jpg',
    jupiter: './assets/jupiter.jpg',
    saturn: './assets/saturn.jpg',
    uranus: './assets/uranus.jpg',
    neptune: './assets/neptune.jpg'
  };

  // Load textures with error handling and optimization
  for (const [name, path] of Object.entries(textureFiles)) {
    const promise = new Promise((resolve, reject) => {
      textureLoader.load(
        path,
        (texture) => {
          texture.generateMipmaps = true;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          textures[name] = texture;
          console.log(`${name} texture loaded`);
          resolve(texture);
        },
        (progress) => {
          console.log(`${name} loading: ${(progress.loaded / progress.total * 100)}%`);
        },
        (error) => {
          console.error(`Error loading ${name} texture:`, error);
          reject(error);
        }
      );
    });
    texturePromises.push(promise);
  }

  // SUN ENHANCEMENT: Create enhanced sun with click detection
  const sunRadius = 4;
  const sunGeometry = new THREE.SphereGeometry(sunRadius, 24, 16);
  
  const sunMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffaa00,
    emissive: 0xff4400,
    emissiveIntensity: 0.6
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  
  // CLICK DETECTION: Add sun to clickable objects
  sun.userData.planetName = 'sun';
  clickableObjects.push(sun);

  const coronaGeometry = new THREE.SphereGeometry(sunRadius * 1.15, 16, 12);
  const coronaMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffaa44, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.BackSide
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  sun.add(corona);

  const glowGeometry = new THREE.SphereGeometry(sunRadius * 1.3, 16, 12);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  sun.add(glow);

  solarSystemGroup.add(sun);

  // PLANET CREATION: Enhanced function with click detection
  function createPlanet(radius, textureName, orbitRadius, orbitSpeed, specialFeatures = {}) {
    const geometry = new THREE.SphereGeometry(radius, 16, 12);
    
    let material;
    if (textures[textureName]) {
      material = new THREE.MeshPhongMaterial({ 
        map: textures[textureName],
        shininess: 30
      });
    } else {
      const fallbackColors = {
        mercury: 0x8C7853,
        venus: 0xFFC649,
        earth: 0x6B93D6,
        mars: 0xCD5C5C,
        jupiter: 0xD8CA9D,
        saturn: 0xFAD5A5,
        uranus: 0x4FD0E7,
        neptune: 0x4B70DD
      };
      material = new THREE.MeshPhongMaterial({ color: fallbackColors[textureName] || 0x888888 });
    }
    
    const planet = new THREE.Mesh(geometry, material);
    
    // CLICK DETECTION: Add planet to clickable objects
    planet.userData.planetName = textureName;
    clickableObjects.push(planet);

    const orbitGroup = new THREE.Group();
    planet.position.x = orbitRadius;
    orbitGroup.add(planet);

    const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 32);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x444444, 
      transparent: true, 
      opacity: 0.2,
      side: THREE.DoubleSide 
    });
    const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitRing.rotation.x = Math.PI / 2;
    solarSystemGroup.add(orbitRing);

    // Special features
    if (specialFeatures.rings) {
      const ringGeometry = new THREE.RingGeometry(radius * 1.2, radius * 2, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xC0C0C0, 
        transparent: true, 
        opacity: 0.7,
        side: THREE.DoubleSide 
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      rings.rotation.z = 0.1;
      planet.add(rings);
    }

    if (specialFeatures.atmosphere) {
      const atmosGeometry = new THREE.SphereGeometry(radius * 1.05, 12, 8);
      const atmosMaterial = new THREE.MeshBasicMaterial({ 
        color: specialFeatures.atmosphere, 
        transparent: true, 
        opacity: 0.4,
        side: THREE.BackSide
      });
      const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
      planet.add(atmosphere);
    }

    if (specialFeatures.moon) {
      const moonGeometry = new THREE.SphereGeometry(radius * 0.27, 8, 6);
      const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.x = radius * 2.5;
      planet.add(moon);
    }

    solarSystemGroup.add(orbitGroup);

    return {
      planet: planet,
      orbitGroup: orbitGroup,
      orbitSpeed: orbitSpeed,
      rotationSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  // Wait for textures to load before creating planets
  Promise.all(texturePromises).then(() => {
    console.log('All textures loaded, creating planets...');
    
    if (textures.sun) {
      sun.material.map = textures.sun;
      sun.material.needsUpdate = true;
    }
    
  }).catch((error) => {
    console.warn('Some textures failed to load, using fallback colors:', error);
  });

  // PLANET CREATION: Create planets with click detection
  const planets = [];
  
  planets.push(createPlanet(0.4, 'mercury', 6, 0.02));
  planets.push(createPlanet(0.6, 'venus', 10, 0.01, {
    atmosphere: 0xffdd88
  }));
  planets.push(createPlanet(0.8, 'earth', 14, 0.005, {
    atmosphere: 0x87CEEB,
    moon: true
  }));
  planets.push(createPlanet(0.5, 'mars', 18, 0.003));
  planets.push(createPlanet(1.2, 'jupiter', 22, 0.002, {
    atmosphere: 0xffcc99
  }));
  planets.push(createPlanet(1.1, 'saturn', 26, 0.001, {
    rings: true
  }));
  planets.push(createPlanet(0.9, 'uranus', 30, 0.0005, {
    atmosphere: 0x66ddff
  }));
  planets.push(createPlanet(0.9, 'neptune', 34, 0.0002, {
    atmosphere: 0x3366ff
  }));

  // Step 3: Initialize AR button
  const arButton = createARButton();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // CONTROLS UPDATE: Update camera controls if available
    if (controls) {
      controls.update();
    }

    sun.rotation.x = time * 0.3;
    sun.rotation.y = time * 0.5;
    sun.rotation.z = time * 0.1;

    planets.forEach((planetData) => {
      planetData.orbitGroup.rotation.y = time * planetData.orbitSpeed;
      planetData.planet.rotation.y = time * planetData.rotationSpeed;
      
      planetData.planet.children.forEach(child => {
        if (child.material && child.material.color && child.material.color.getHex() === 0xC0C0C0) {
          child.rotation.y = time * 2;
        }
        if (child.material && child.material.transparent && child.material.opacity < 0.5) {
          child.rotation.y = time * 0.1;
        }
      });
    });

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(render);
}

main();