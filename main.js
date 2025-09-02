import * as THREE from "three";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 50;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 25;

  const scene = new THREE.Scene();

  // Create texture loader
  const textureLoader = new THREE.TextureLoader();

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light); // niye burda ışık ekliyoruz + parantezlerin arası boşluk kalıyor ?
  }

  // sun at the center
  const radius = 3;
  const widthSegments = 24;
  const heightSegments = 8;
  const sunGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const sunTexture = textureLoader.load('./assets/sun.jpg',
    onLoad, onProgress, onError);
  const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // planet creation function
  function createPlanet(radius, texturePath, orbitRadius, orbitSpeed) {
    const geometry = new THREE.SphereGeometry(radius, 24, 8);
    const texture = textureLoader.load(texturePath, onLoad, onProgress, onError);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2); // Repeat texture
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);

    const orbitGroup = new THREE.Group();
    planet.position.x = orbitRadius; // set initial position on the orbit
    orbitGroup.add(planet);
    scene.add(orbitGroup);

    return {
      planet: planet,
      orbitGroup: orbitGroup,
      orbitSpeed: orbitSpeed,
      rotationSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  // create multiple planets one by one 
  const planets = [];
  planets.push(createPlanet(0.4, './assets/mercury.jpg', 6, 0.02)); // mercury, closest to sun
  planets.push(createPlanet(0.6, './assets/venus.jpg', 10, 0.01)); // venus
  planets.push(createPlanet(0.8, './assets/earth.jpg', 14, 0.005)); // earth
  planets.push(createPlanet(0.5, './assets/mars.jpg', 18, 0.003)); // mars
  planets.push(createPlanet(1.2, './assets/jupiter.jpg', 22, 0.002)); // jupiter
  planets.push(createPlanet(1.5, './assets/saturn.jpg', 26, 0.001)); // saturn
  planets.push(createPlanet(1.0, './assets/uranus.jpg', 30, 0.0005)); // uranus
  planets.push(createPlanet(1.5, './assets/neptune.jpg', 34, 0.0002)); // neptune


  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement); // bunu yaparsan ekranda genisligi artiyor, kesvettim ki pixel gorunumunu hd yapiyor

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

    //rotate sun
    sun.rotation.x = time * 0.5;
    sun.rotation.y = time * 0.5;

    // animate planets 
    planets.forEach((planetData) => {
      planetData.orbitGroup.rotation.y = time * planetData.orbitSpeed; // orbit around sun

      planetData.planet.rotation.y = time * planetData.rotationSpeed; // rotate on its own axis
    });

    //come here again and try the cos&sin functions for more realistic orbits

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main(); // bunu cagirmayinca gelmiyo, interesting
