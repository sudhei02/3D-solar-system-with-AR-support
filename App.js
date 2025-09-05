import  {  ARPerspectiveCamera  }  from  'three.ar.js';
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
	}
}