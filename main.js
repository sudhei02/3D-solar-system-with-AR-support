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
  solarSystemGroup.scale.setScalar(0.8); // Scale down for AR
  scene.add(solarSystemGroup);

  // Create texture loader
  // const textureLoader = new THREE.TextureLoader(); // Removed for now

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // sun at the center with glow effect
  const radius = 3;
  const widthSegments = 24;
  const heightSegments = 8;
  const sunGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const sunMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xfdb813,
    emissive: 0x442200 // Add slight glow
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);

  // Add sun's corona/glow
  const coronaGeometry = new THREE.SphereGeometry(radius * 1.1, 16, 8);
  const coronaMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffaa00, 
    transparent: true, 
    opacity: 0.3 
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  sun.add(corona);

  solarSystemGroup.add(sun);

  // planet creation function with unique designs
  function createPlanet(radius, color, orbitRadius, orbitSpeed, specialFeatures = {}) {
    const geometry = new THREE.SphereGeometry(radius, 24, 8);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const planet = new THREE.Mesh(geometry, material);

    const orbitGroup = new THREE.Group();
    planet.position.x = orbitRadius;
    orbitGroup.add(planet);

    // Add orbital trail
    const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.1, orbitRadius + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: 0.1,
      side: THREE.DoubleSide 
    });
    const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitRing.rotation.x = Math.PI / 2; // Rotate to be horizontal
    solarSystemGroup.add(orbitRing);

    // Add special features
    if (specialFeatures.rings) {
      // Saturn rings
      const ringGeometry = new THREE.RingGeometry(radius * 1.2, radius * 2, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xC0C0C0, 
        transparent: true, 
        opacity: 0.6,
        side: THREE.DoubleSide 
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      rings.rotation.z = Math.random() * 0.3; // Slight tilt
      planet.add(rings);
    }

    if (specialFeatures.atmosphere) {
      // Atmospheric glow
      const atmosGeometry = new THREE.SphereGeometry(radius * 1.1, 16, 8);
      const atmosMaterial = new THREE.MeshBasicMaterial({ 
        color: specialFeatures.atmosphere, 
        transparent: true, 
        opacity: 0.3 
      });
      const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
      planet.add(atmosphere);
    }

    if (specialFeatures.moon) {
      // Add a moon
      const moonGeometry = new THREE.SphereGeometry(radius * 0.3, 12, 8);
      const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.x = radius * 3;
      planet.add(moon);
    }

    if (specialFeatures.spots) {
      // Jupiter's Great Red Spot
      const spotGeometry = new THREE.SphereGeometry(radius * 0.3, 8, 8);
      const spotMaterial = new THREE.MeshPhongMaterial({ color: 0xDC143C });
      const spot = new THREE.Mesh(spotGeometry, spotMaterial);
      spot.position.set(radius * 0.8, 0, 0);
      planet.add(spot);
    }

    solarSystemGroup.add(orbitGroup);

    return {
      planet: planet,
      orbitGroup: orbitGroup,
      orbitSpeed: orbitSpeed,
      rotationSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  // create multiple planets with unique designs
  const planets = [];
  
  // Mercury - small, cratered
  planets.push(createPlanet(0.4, 0x8C7853, 6, 0.02));
  
  // Venus - thick atmosphere
  planets.push(createPlanet(0.6, 0xFFC649, 10, 0.01, {
    atmosphere: 0xffdd88
  }));
  
  // Earth - blue with moon
  planets.push(createPlanet(0.8, 0x6B93D6, 14, 0.005, {
    atmosphere: 0x87CEEB,
    moon: true
  }));
  
  // Mars - red planet
  planets.push(createPlanet(0.5, 0xCD5C5C, 18, 0.003));
  
  // Jupiter - gas giant with Great Red Spot
  planets.push(createPlanet(1.2, 0xD8CA9D, 22, 0.002, {
    spots: true,
    atmosphere: 0xffcc99
  }));
  
  // Saturn - with prominent rings
  planets.push(createPlanet(1.5, 0xFAD5A5, 26, 0.001, {
    rings: true
  }));
  
  // Uranus - tilted ice giant
  planets.push(createPlanet(1.0, 0x4FD0E7, 30, 0.0005, {
    atmosphere: 0x66ddff
  }));
  
  // Neptune - windy blue giant
  planets.push(createPlanet(1.5, 0x4B70DD, 34, 0.0002, {
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
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // rotate sun
    sun.rotation.x = time * 0.5;
    sun.rotation.y = time * 0.5;

    // animate planets 
    planets.forEach((planetData) => {
      planetData.orbitGroup.rotation.y = time * planetData.orbitSpeed;
      planetData.planet.rotation.y = time * planetData.rotationSpeed;
      
      // Animate special features
      planetData.planet.children.forEach(child => {
        if (child.material && child.material.color.getHex() === 0xC0C0C0) { // Moon
          child.rotation.y = time * 2; // Moon orbits faster
        }
        if (child.material && child.material.transparent && child.material.opacity === 0.3) { // Atmosphere
          child.rotation.y = time * 0.1; // Slow atmospheric rotation
        }
      });
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // Step 4: Use XR-compatible animation loop
  renderer.setAnimationLoop(render);
}

main();
