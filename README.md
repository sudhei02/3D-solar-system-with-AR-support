# 3D Solar System with AR Support

An interactive 3D solar system built with Three.js, featuring **markerless augmented reality** support for mobile devices. Experience planets floating in your physical space!

![3D Solar System Preview](https://img.shields.io/badge/WebXR-AR%20Ready-brightgreen)
![Mobile Compatible](https://img.shields.io/badge/Mobile-Compatible-blue)
![Three.js](https://img.shields.io/badge/Three.js-Latest-orange)

## Features

- **🌍 Interactive 3D Solar System**: All 8 planets with realistic textures and orbits
- **📱 Augmented Reality Mode**: Markerless AR support using WebXR APIs
- **🔄 Real-time Animations**: Planets rotate and orbit with accurate relative speeds
- **📲 Cross-Platform**: Works on iOS Safari, Android Chrome, and desktop browsers
- **⚡ Performance Optimized**: Adaptive quality settings for smooth mobile performance
- **🎨 Modern UI**: Responsive design with intuitive AR controls

## AR Requirements

### Device Compatibility
- **Android**: Chrome 79+ or Edge 79+
- **iOS**: Safari 13+ (iOS 13+)
- **Desktop**: Chrome 79+, Edge 79+, Firefox 98+

### Technical Requirements
- **HTTPS connection** (required for WebXR)
- **Gyroscope and accelerometer** sensors
- **Camera permissions** for AR tracking
- Stable internet connection for initial load

## Setup Instructions

### Quick Start
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 3D-solar-system-with-AR-support
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. **Important**: For AR functionality, serve over HTTPS:
   ```bash
   # Using Vite with HTTPS
   npm run dev -- --https
   
   # Or use ngrok for local HTTPS tunneling
   npx ngrok http 3000
   ```

### Production Deployment
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to a **HTTPS-enabled** hosting service:
   - Netlify, Vercel, GitHub Pages
   - Firebase Hosting, AWS S3 with CloudFront
   - Any web server with SSL certificate

## How to Use AR Mode

### On Mobile Devices:
1. **Open the app** in a compatible browser (Chrome/Safari)
2. **Allow camera permissions** when prompted
3. **Tap the "Enter AR" button** that appears at the bottom
4. **Point your device** at a flat surface or open space
5. **See the solar system** floating in your physical environment!

### AR Controls:
- **Move your device** to walk around the solar system
- **Tap "Exit AR"** to return to normal 3D view
- The planets will appear **2 meters in front** of your device
- **Scaled to 25%** of original size for optimal AR viewing

## Technical Implementation

### WebXR AR Features
- **Markerless tracking** using device sensors
- **Environmental understanding** for stable placement
- **Light estimation** for realistic rendering
- **Hit-test API** for surface detection
- **Dom-overlay support** for UI elements

### Performance Optimizations
- **Adaptive LOD**: Lower polygon counts in AR mode
- **Texture optimization**: Mipmapping and compression
- **Efficient rendering**: WebGL context reuse
- **Memory management**: Texture cleanup and disposal
- **Frame rate optimization**: 60fps target on mobile

### Code Structure
```
main.js          # Core AR implementation with Three.js
index.html       # AR-optimized HTML with proper meta tags  
manifest.json    # PWA configuration for mobile installation
assets/          # Optimized planet textures
```

## Browser Support

| Browser | Desktop | Mobile AR | Notes |
|---------|---------|-----------|-------|
| Chrome | ✅ | ✅ | Full WebXR support |
| Safari | ✅ | ✅ | iOS 13+ required |
| Edge | ✅ | ✅ | Chromium-based versions |
| Firefox | ✅ | ⚠️ | Limited AR support |

## Troubleshooting

### AR Not Available?
- ✅ **Use HTTPS**: AR requires secure connection
- ✅ **Check device sensors**: Ensure gyroscope available
- ✅ **Update browser**: Use latest Chrome/Safari
- ✅ **Allow permissions**: Camera access required
- ✅ **Stable lighting**: Good lighting improves tracking

### Performance Issues?
- 📱 **Close other apps**: Free up mobile memory
- 🔄 **Refresh page**: Clear WebGL context
- 📶 **Check connection**: Stable internet for assets
- 🌡️ **Device temperature**: Cool device for optimal performance

### Common Errors
```javascript
// AR session failed
"Unable to start AR session" 
→ Check HTTPS and browser support

// Camera permission denied  
"Permission denied"
→ Allow camera access in browser settings

// WebXR not found
"WebXR not supported" 
→ Update browser or use compatible device
```

## Development

### Adding New Features
The AR implementation is modular and extensible:

```javascript
// Add new AR interactions
function addARInteractions() {
  // Hit testing for planet selection
  // Hand tracking for gestures  
  // Voice commands for navigation
}

// Customize AR positioning
function updateARLayout() {
  planetGroup.position.set(x, y, z);
  planetGroup.scale.setScalar(scale);
}
```

### Testing AR Features
- **Chrome DevTools**: Device simulation mode
- **Remote debugging**: Chrome inspect mobile devices
- **Real device testing**: Essential for AR functionality
- **WebXR Emulator**: Browser extension for AR simulation

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/ar-enhancement`
3. Test on real devices with AR capabilities
4. Submit pull request with AR testing screenshots

## License

MIT License - Feel free to use this project for educational or commercial purposes.

## Acknowledgments

- **Three.js** for 3D rendering capabilities
- **WebXR** specification and browser implementations  
- **NASA** for planet texture references
- Community feedback for AR usability improvements

---

**Enjoy exploring the solar system in augmented reality! 🚀✨**

For issues or questions about AR functionality, please open a GitHub issue with your device specifications and browser version.