 # 🌌 Interactive 3D Solar System with AR Support

<div align="center">

![WebXR](https://img.shields.io/badge/WebXR-AR%20Ready-brightgreen?style=for-the-badge&logo=webxr)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TUBITAK](https://img.shields.io/badge/TUBITAK-UZAY%20Internship-red?style=for-the-badge)

*Experience the cosmos like never before with immersive AR technology! 🚀*

[🎮 Try Live Demo](#getting-started) • [📱 AR Features](#ar-features) • [🛠️ Setup Guide](#installation)

</div>

---

## ✨ What Makes This Special?

This isn't just another solar system simulation - it's a **fully interactive, AR-enabled cosmic experience** that brings the universe to your fingertips! Built during my TUBITAK UZAY internship, this project combines cutting-edge WebXR technology with educational astronomy content.

### 🎯 Key Features

- 🥽 **WebXR AR Support** - View planets floating in your real environment
- 🌍 **All 8 Planets + Sun** - Accurate relative sizes and orbital mechanics  
- 🖱️ **Interactive Planet Clicking** - Get fascinating facts about each celestial body
- 🎮 **Smooth Controls** - OrbitControls for seamless 3D navigation
- 📱 **Mobile Optimized** - Works on smartphones with AR capability
- ⚡ **Real-time Animations** - Planets orbit and rotate at realistic speeds
- 🎨 **Beautiful Textures** - High-quality planet surface materials

---

## 🚀 Live AR Experience

### Desktop/Mobile Browser
```
🌐 Navigate with mouse/touch
🖱️ Click planets for fun facts
🔍 Zoom in/out with scroll wheel
```

### AR Mode (Mobile/AR Headsets)
```
📱 Tap "Enter AR" button
🏠 Point camera at floor/surface  
👀 Watch planets appear in your space!
🤏 Walk around and explore
```

---

## 🛠️ Installation & Setup

### Quick Start
```bash
# Clone the cosmic repository
git clone https://github.com/sudhei02/3D-solar-system-with-AR-support.git
cd 3D-solar-system-with-AR-support

# Install dependencies
npm install

# Launch the universe! 🚀
npm run dev
```

### Requirements
- **Node.js** (v14 or higher)
- **Modern browser** with WebGL support
- **HTTPS connection** (required for WebXR AR)
- **AR-capable device** for full AR experience

---

## 🧠 How It Works: Code Deep Dive

### 🎬 Scene Architecture

The magic starts in `main.js` where we initialize our cosmic theater:

```javascript
// WebXR AR Setup - The gateway to mixed reality!
renderer.xr.enabled = true;

// AR Button Creation - Your portal to the stars
const session = await navigator.xr.requestSession('immersive-ar', {
  requiredFeatures: ['local-floor']
});
```

### 🌟 Solar System Creation

Our `createSolarSystem()` function in `App.js` is where the universe comes alive:

```javascript
// Planet Factory - Building worlds with code! 🏭
const createPlanet = (radius, texturePath, orbitRadius, orbitSpeed) => {
  const geometry = new THREE.SphereGeometry(radius, 24, 8);
  const texture = textureLoader.load(texturePath);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  
  // Orbital mechanics - Real physics in virtual space! 
  const orbitGroup = new THREE.Group();
  planet.position.x = orbitRadius;
  orbitGroup.add(planet);
  
  return { planet, orbitGroup, orbitSpeed, rotationSpeed };
};
```

### 🎮 Interactive Features

Click detection brings education to life:

```javascript
// Raycasting Magic - Turn clicks into cosmic knowledge! ✨
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(clickableObjects);

if (intersects.length > 0) {
  // Show fascinating planet facts! 🪐
  displayPlanetInfo(intersectedPlanet);
}
```

### 🎨 Visual Excellence

Our lighting system creates that perfect space ambiance:

```javascript
// Cosmic Lighting Setup - Illuminating the void! 💡
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-1, 2, 4); // Simulating distant starlight
```

---

## 🌍 Planet Database

Each planet comes with fascinating real facts:

| Planet | Radius | Orbit Distance | Fun Fact |
|--------|--------|----------------|----------|
| ☀️ Sun | 3.0 | Center | 4.6 billion years old! |
| ☿️ Mercury | 0.4 | 6 units | Fastest orbit - 88 Earth days |
| ♀️ Venus | 0.6 | 10 units | Hottest planet - 900°F! |
| 🌍 Earth | 0.8 | 14 units | Our beautiful blue marble |
| ♂️ Mars | 0.5 | 18 units | The Red Planet with polar ice |
| ♃ Jupiter | 1.2 | 22 units | Gas giant with 95+ moons |
| ♄ Saturn | 1.5 | 26 units | Stunning ring system |
| ♅ Uranus | 1.0 | 30 units | Tilted at 98 degrees! |
| ♆ Neptune | 1.5 | 34 units | Windiest planet - 1,200 mph |

---

## 📁 Project Structure

```
🌌 3D-solar-system-with-AR-support/
├── 📱 index.html          # Entry point with cosmic UI
├── 🚀 main.js             # Core application & AR logic  
├── 🏗️ App.js              # Solar system creation engine
├── 🎮 Renderer.js         # WebXR renderer & AR controls
├── 🕹️ VRControls.js       # Legacy VR support
├── 🎨 style.css           # Cosmic styling
├── ⚙️ webpack.config.js   # Build configuration
├── 📦 package.json        # Dependencies & scripts
└── 🖼️ assets/            # Planet texture images
    ├── sun.jpg
    ├── mercury.jpg
    ├── venus.jpg
    └── ... (all planet textures)
```

---

## 🎯 Technical Highlights

### WebXR Implementation
- **Immersive AR Sessions** - Full WebXR 1.0 compatibility
- **Local Floor Tracking** - Accurate spatial positioning
- **Fallback Support** - Graceful degradation for non-AR devices

### Performance Optimizations
- **Efficient Rendering** - Smart use of Three.js geometry instancing
- **Texture Management** - Optimized loading and memory usage
- **Animation Loop** - 60fps smooth planetary motion

### Educational Features
- **Real Astronomical Data** - Accurate planet sizes and distances (scaled)
- **Interactive Learning** - Click-to-learn planet facts
- **Immersive Experience** - AR brings space education to life

---

## 🚀 Future Enhancements

- [ ] 🪐 **Saturn's Ring System** - Detailed ring particles (in progress on `ring-formation` branch!)
- [ ] 🌙 **Moon Systems** - Add major moons for gas giants
- [ ] ⭐ **Asteroid Belt** - Particle system between Mars and Jupiter
- [ ] 🎵 **Spatial Audio** - Planet-specific ambient sounds
- [ ] 📊 **Data Visualization** - Real-time astronomical data integration
- [ ] 🎮 **Hand Tracking** - Natural gesture controls for AR
- [ ] 🗣️ **Voice Interaction** - "Tell me about Mars" voice commands

---

## 🤝 Contributing

Love space exploration? Want to add your cosmic touch? 

1. **Fork** this repository ⭐
2. Create your feature branch (`git checkout -b feature/amazing-space-feature`)
3. **Code** your stellar improvements 🚀
4. **Test** in both desktop and AR modes
5. **Submit** a pull request with cosmic enthusiasm! 

### Areas We'd Love Help With:
- 🎨 Enhanced planet textures and materials
- 🔬 More detailed astronomical data
- 🎮 Additional AR interaction modes
- 📱 Mobile performance optimizations
- 🌟 Visual effects and particle systems

---

## 📄 License & Credits

### Developed By
**Sudhei02** - TUBITAK UZAY Internship Project  
*Bringing the cosmos to everyone through immersive technology* 🌌

### Technologies Used
- **Three.js** - 3D graphics powerhouse
- **WebXR** - AR/VR web standards
- **Vite** - Lightning-fast build tool
- **Modern JavaScript** - ES6+ features

### Special Thanks
- 🏛️ **TUBITAK UZAY** - For the incredible internship opportunity
- 🌍 **NASA** - For planetary texture references
- 🚀 **Three.js Community** - For amazing WebGL capabilities
- 👥 **WebXR Community** - For pushing AR/VR boundaries

---

<div align="center">

## 🌟 Star This Project!

*If this cosmic journey inspired you, please give it a star! ⭐*

*Let's explore the universe together, one line of code at a time! 🚀*

**[🔝 Back to Top](#-interactive-3d-solar-system-with-ar-support)**

---

*Made with 💫 and lots of ☕ during TUBITAK UZAY internship*

</div>
