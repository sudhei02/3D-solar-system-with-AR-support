import * as THREE from 'three';
import renderer from './Renderer.js';

export default class App {
	async buildCamera() {
		const camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			0.01,
			20
		);
		camera.position.z = 25; // Position camera to see the solar system
		this.mainCamera = camera;
	}

	setupScene() {
		this.scene = new THREE.Scene();
		
		// Add some lights for better visibility
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		this.scene.add(ambientLight);
		
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(-1, 2, 4);
		this.scene.add(directionalLight);

		// Create the solar system
		this.createSolarSystem();
	}

	createSolarSystem() {
		// Create texture loader
		const textureLoader = new THREE.TextureLoader();

		// Create sun at the center
		const radius = 3;
		const widthSegments = 24;
		const heightSegments = 8;
		const sunGeometry = new THREE.SphereGeometry(
			radius,
			widthSegments,
			heightSegments
		);
		const sunTexture = textureLoader.load('./assets/sun.jpg');
		const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
		this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
		this.scene.add(this.sun);

		// Planet creation function
		const createPlanet = (radius, texturePath, orbitRadius, orbitSpeed) => {
			const geometry = new THREE.SphereGeometry(radius, 24, 8);
			const texture = textureLoader.load(texturePath);
			const material = new THREE.MeshPhongMaterial({ map: texture });
			const planet = new THREE.Mesh(geometry, material);

			const orbitGroup = new THREE.Group();
			planet.position.x = orbitRadius;
			orbitGroup.add(planet);
			this.scene.add(orbitGroup);

			return {
				planet: planet,
				orbitGroup: orbitGroup,
				orbitSpeed: orbitSpeed,
				rotationSpeed: Math.random() * 0.02 + 0.01,
			};
		};

		// Create planets
		this.planets = [];
		this.planets.push(createPlanet(0.4, './assets/mercury.jpg', 6, 0.02)); // mercury
		this.planets.push(createPlanet(0.6, './assets/venus.jpg', 10, 0.01)); // venus
		this.planets.push(createPlanet(0.8, './assets/earth.jpg', 14, 0.005)); // earth
		this.planets.push(createPlanet(0.5, './assets/mars.jpg', 18, 0.003)); // mars
		this.planets.push(createPlanet(1.2, './assets/jupiter.jpg', 22, 0.002)); // jupiter
		this.planets.push(createPlanet(1.5, './assets/saturn.jpg', 26, 0.001)); // saturn
		this.planets.push(createPlanet(1.0, './assets/uranus.jpg', 30, 0.0005)); // uranus
		this.planets.push(createPlanet(1.5, './assets/neptune.jpg', 34, 0.0002)); // neptune
	}
	
	async start() {
		await this.buildCamera();
		this.setupScene();
		await renderer.initRenderer();
		this.startUpdate();
	}

	startUpdate() {
		const currentInstance = this;
		this.update = (time) => {
			time *= 0.001; // convert to seconds

			// Rotate sun
			if (currentInstance.sun) {
				currentInstance.sun.rotation.x = time * 0.5;
				currentInstance.sun.rotation.y = time * 0.5;
			}

			// Animate planets
			if (currentInstance.planets) {
				currentInstance.planets.forEach((planetData) => {
					planetData.orbitGroup.rotation.y = time * planetData.orbitSpeed;
					planetData.planet.rotation.y = time * planetData.rotationSpeed;
				});
			}

			renderer.update(currentInstance.scene, currentInstance.mainCamera, currentInstance.update);
		};

		this.update();
	}
	
}