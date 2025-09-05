import * as THREE from 'three';
import  {  ARPerspectiveCamera  }  from  'three.ar.js';
import VRControls from 'three/examples/jsm/controls/VRControls.js';
import  renderer  from  './Renderer';

export  default  class  App  {
	buildCamera()  {
		const  camera  =  new  ARPerspectiveCamera(
		renderer.vrDisplay,
		60,
		window.innerWidth / window.innerHeight,
		renderer.vrDisplay.depthNear,
		renderer.vrDisplay.depthFar
		);
		this.mainCamera  =  camera;
		this.vrControls = new VRControls(camera);
	}

	setupScene()  {
		this.setupScene = new THREE.Scene();
		this.scene.add(this.mainCamera);
	}
	
	start()  {
		renderer.initRenderer().then((success)  =>  {
			if  (success)  {
				this.buildCamera();
				this.setupScene();
				this.startUpdate();
			}

		});
	}

	startUpdate()  {
		const currentInstance = this;
		this.update = ()  =>  {
			currentInstance.mainCamera.updateProjectionMatrix();
			currentInstance.vrControls.update();
			renderer.update(currentInstance.scene, entityManager.mainManager, currentInstance.update);
		};

		this.update();
	}

}