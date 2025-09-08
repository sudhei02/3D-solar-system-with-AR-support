import * as THREE from 'three';

class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    this.xrSession = null;
  }

  async initRenderer() {
    // Check if WebXR is supported
    if ('xr' in navigator) {
      const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
      if (isARSupported) {
        console.log('AR is supported!');
        this.setupRenderer();
        this.enableXR();
        return true;
      }
    }
    
    console.log('AR not supported, falling back to regular 3D view');
    this.setupRenderer();
    return true;
  }

  setupRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);
  }

  enableXR() {
    // Enable WebXR for AR
    this.renderer.xr.enabled = true;
    
    // Add AR button
    this.createARButton();
  }

  createARButton() {
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
    button.textContent = 'Enter AR';
    
    button.onclick = async () => {
      if (this.xrSession) {
        await this.xrSession.end();
      } else {
        try {
          this.xrSession = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['local-floor']
          });
          this.renderer.xr.setSession(this.xrSession);
          button.textContent = 'Exit AR';
          
          this.xrSession.addEventListener('end', () => {
            this.xrSession = null;
            button.textContent = 'Enter AR';
          });
        } catch (error) {
          console.log('AR session request failed:', error);
        }
      }
    };
    
    document.body.appendChild(button);
  }

  update(scene, camera, updateCallback) {
    this.renderer.render(scene, camera);
    this.renderer.setAnimationLoop(updateCallback);
  }
}

export default new Renderer();