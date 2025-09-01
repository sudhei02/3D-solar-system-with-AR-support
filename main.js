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
  const sunMaterial = new THREE.MeshPhongMaterial({ color: 0xfdb813 }); // yellow-orange
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // planet creation function
  function createPlanet(radius, color, orbitRadius, orbitSpeed) {
    const geometry = new THREE.SphereGeometry(radius, 24, 8);
    const material = new THREE.MeshPhongMaterial({ color });
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

  // create multiple planets
  const planets = [];
  planets.push(createPlanet(0.4, 0x8C7853, 6, 0.02)); // mercury, closest to sun
  planets.push(createPlanet(0.6, 0xC0C0C0, 10, 0.01)); // venus
  planets.push(createPlanet(0.8, 0x0000FF, 14, 0.005)); // earth
  planets.push(createPlanet(0.5, 0xFF0000, 18, 0.003)); // mars
  planets.push(createPlanet(1.2, 0xFFA500, 22, 0.002)); // jupiter
  planets.push(createPlanet(1.5, 0x800080, 26, 0.001)); // saturn

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

    sun.rotation.x = time * 0.5;
    sun.rotation.y = time * 0.5;

    planets.forEach((planetData) => {
      planetData.orbitGroup.rotation.y = time * planetData.orbitSpeed; // orbit around sun

      planetData.planet.rotation.y = time * planetData.rotationSpeed; // rotate on its own axis
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main(); // bunu cagirmayinca gelmiyo, interesting
