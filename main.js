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
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 50;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 25;

  const scene = new THREE.Scene();

  // Step 5: Create a group for the solar system to scale it for AR
  const solarSystemGroup = new THREE.Group();
  solarSystemGroup.scale.setScalar(0.5); // OPTIMIZATION: Smaller scale for better AR performance
  scene.add(solarSystemGroup);

  // OPTIMIZATION: Improved lighting setup
  {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Soft ambient light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1, 2, 4);
    scene.add(directionalLight);
    
    // Additional light from opposite direction for better planet visibility
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(1, -1, -2);
    scene.add(fillLight);
  }

  // TEXTURE LOADING: Create texture loader with optimizations
  const textureLoader = new THREE.TextureLoader();
  
  // OPTIMIZATION: Preload all textures to avoid loading delays during runtime
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
          // OPTIMIZATION: Optimize texture settings for performance
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

  // SUN ENHANCEMENT: Create enhanced sun with multiple visual effects
  const sunRadius = 4; // ENHANCEMENT: Larger sun for better visibility
  // OPTIMIZATION: Reduced segments for better performance while maintaining visual quality
  const sunGeometry = new THREE.SphereGeometry(sunRadius, 24, 16);
  
  // ENHANCEMENT: Multi-layered sun material for realistic appearance
  const sunMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffaa00,
    emissive: 0xff4400, // ENHANCEMENT: Strong emissive for sun glow
    emissiveIntensity: 0.6
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);

  // ENHANCEMENT: Add corona layer for sun atmosphere effect
  const coronaGeometry = new THREE.SphereGeometry(sunRadius * 1.15, 16, 12);
  const coronaMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffaa44, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.BackSide // Render from inside
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  sun.add(corona);

  // ENHANCEMENT: Add outer glow for sun
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

  // PLANET CREATION: Enhanced function with texture support and optimizations
  function createPlanet(radius, textureName, orbitRadius, orbitSpeed, specialFeatures = {}) {
    // OPTIMIZATION: Reduced geometry complexity for better performance
    const geometry = new THREE.SphereGeometry(radius, 16, 12); // Reduced from 24,8
    
    let material;
    if (textures[textureName]) {
      // TEXTURE APPLICATION: Use loaded texture
      material = new THREE.MeshPhongMaterial({ 
        map: textures[textureName],
        shininess: 30 // Add slight shininess for better appearance
      });
    } else {
      // Fallback to solid color if texture fails
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

    const orbitGroup = new THREE.Group();
    planet.position.x = orbitRadius;
    orbitGroup.add(planet);

    // ENHANCEMENT: Add orbital trail for better visualization
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

    // SPECIAL FEATURES: Enhanced planet-specific details
    if (specialFeatures.rings) {
      // Saturn rings with better geometry
      const ringGeometry = new THREE.RingGeometry(radius * 1.2, radius * 2, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xC0C0C0, 
        transparent: true, 
        opacity: 0.7,
        side: THREE.DoubleSide 
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      rings.rotation.z = 0.1; // Slight tilt
      planet.add(rings);
    }

    if (specialFeatures.atmosphere) {
      // Enhanced atmospheric effect
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
      // OPTIMIZATION: Simplified moon geometry
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
    
    // Apply sun texture after loading
    if (textures.sun) {
      sun.material.map = textures.sun;
      sun.material.needsUpdate = true;
    }
    
  }).catch((error) => {
    console.warn('Some textures failed to load, using fallback colors:', error);
  });

  // PLANET CREATION: Create planets with textures and enhanced features
  const planets = [];
  
  // Mercury - small, no atmosphere
  planets.push(createPlanet(0.4, 'mercury', 6, 0.02));
  
  // Venus - thick atmosphere
  planets.push(createPlanet(0.6, 'venus', 10, 0.01, {
    atmosphere: 0xffdd88
  }));
  
  // Earth - blue with moon and atmosphere
  planets.push(createPlanet(0.8, 'earth', 14, 0.005, {
    atmosphere: 0x87CEEB,
    moon: true
  }));
  
  // Mars - red planet
  planets.push(createPlanet(0.5, 'mars', 18, 0.003));
  
  // Jupiter - gas giant with atmosphere
  planets.push(createPlanet(1.2, 'jupiter', 22, 0.002, {
    atmosphere: 0xffcc99
  }));
  
  // Saturn - with prominent rings
  planets.push(createPlanet(1.1, 'saturn', 26, 0.001, {
    rings: true
  }));
  
  // Uranus - tilted ice giant
  planets.push(createPlanet(0.9, 'uranus', 30, 0.0005, {
    atmosphere: 0x66ddff
  }));
  
  // Neptune - windy blue giant
  planets.push(createPlanet(0.9, 'neptune', 34, 0.0002, {
    atmosphere: 0x3366ff
  }));

  // Step 3: Initialize AR button
  const arButton = createARButton();

  // OPTIMIZATION: Efficient resize function
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

  // OPTIMIZATION: Efficient render loop
  function render(time) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // ENHANCED SUN ANIMATION: Multi-axis rotation for dynamic effect
    sun.rotation.x = time * 0.3;
    sun.rotation.y = time * 0.5;
    sun.rotation.z = time * 0.1;

    // OPTIMIZATION: Efficient planet animation
    planets.forEach((planetData) => {
      planetData.orbitGroup.rotation.y = time * planetData.orbitSpeed;
      planetData.planet.rotation.y = time * planetData.rotationSpeed;
      
      // ENHANCEMENT: Animate special features
      planetData.planet.children.forEach(child => {
        if (child.material && child.material.color && child.material.color.getHex() === 0xC0C0C0) {
          // Moon orbit animation
          child.rotation.y = time * 2;
        }
        if (child.material && child.material.transparent && child.material.opacity < 0.5) {
          // Atmosphere rotation
          child.rotation.y = time * 0.1;
        }
      });
    });

    renderer.render(scene, camera);
  }

  // Step 4: Use XR-compatible animation loop
  renderer.setAnimationLoop(render);
}

main();