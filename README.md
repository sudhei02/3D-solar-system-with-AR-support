# 🌌 3D Solar System with AR Support

<div align="center">

![WebXR](https://img.shields.io/badge/WebXR-AR%20Ready-brightgreen?style=for-the-badge&logo=webxr)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TUBITAK](https://img.shields.io/badge/TUBITAK-UZAY%20Internship-red?style=for-the-badge)

*A 3D solar system simulator I built during my TUBITAK UZAY internship*

[🚀 Live Demo](#setup) • [📱 AR Features](#what-it-does) • [🛠️ How I Built It](#how-i-built-it)

</div>

---

## What it does

- **Interactive 3D solar system** with all 8 planets plus the sun
- **Click on planets** to learn random facts about them  
- **AR mode** that lets you view the solar system in your actual space (if your device supports WebXR)
- **Realistic-ish orbital speeds** and planet sizes (scaled down so you don't have to wait years to see Mercury complete an orbit)

## Try it out

Just open it in a modern browser. If you're on mobile and your browser supports AR, you'll see an "Enter AR" button. Fair warning though - AR can be finicky depending on your device.

### Controls
```
🖱️ Mouse/Touch: Navigate around
🔍 Scroll: Zoom in/out  
📱 Tap planets: Get fun facts
🥽 AR Mode: Walk around and explore!
```

---

## Setup

```bash
git clone https://github.com/sudhei02/3D-solar-system-with-AR-support.git
cd 3D-solar-system-with-AR-support
npm install
npm run dev
```

**Requirements:**
- Node.js and a browser that doesn't hate WebGL
- HTTPS connection for AR features (localhost works fine for testing)
- AR-capable device for the full experience

---

## How I built it

This was my first real dive into WebXR and Three.js. The main components are:

### 🎬 Core Technologies
- **Three.js** for all the 3D graphics and animations
- **WebXR** for the AR functionality (which was honestly harder to get working than I expected)  
- **Vite** for bundling everything together

### 🌟 The Challenge
The trickiest part was getting the AR to work consistently across different devices. Turns out WebXR support is still pretty spotty, but when it works, it's pretty cool.

Each planet is just a sphere with a texture mapped onto it, orbiting around the sun at different speeds. I found most of the planet textures from NASA's website and scaled everything down to reasonable sizes.

### 📁 Project Structure
```
├── index.html          # Main HTML file
├── main.js             # Entry point and AR setup  
├── App.js              # Solar system creation and animation
├── Renderer.js         # WebXR renderer setup
├── style.css           # Basic styling
├── assets/             # Planet texture images
└── package.json        # Dependencies
```

---

## 🌍 Planet Facts Database

Each planet comes with real astronomical data (simplified for sanity):

| Planet | Fun Fact |
|--------|----------|
| ☀️ Sun | 4.6 billion years old! |
| ☿️ Mercury | Fastest orbit - 88 Earth days |
| ♀️ Venus | Hottest planet - 900°F! |
| 🌍 Earth | Our beautiful blue marble |
| ♂️ Mars | The Red Planet with polar ice |
| ♃ Jupiter | Gas giant with 95+ moons |
| ♄ Saturn | Stunning ring system |
| ♅ Uranus | Tilted at 98 degrees! |
| ♆ Neptune | Windiest planet - 1,200 mph |

---

## What I learned

This project taught me a lot about:
- 3D graphics programming (coordinate systems are confusing)
- WebXR APIs (still evolving and kind of a pain to debug)
- Orbital mechanics (even simplified versions)
- How to make things work across different devices (spoiler: it's hard)

## Known issues & future plans

**Current limitations:**
- AR mode doesn't work on all devices (WebXR support varies)
- Performance can be sluggish on older phones
- The sun is way too small compared to real life (but if I made it realistic, you wouldn't see the planets)

**If I have time to come back to this:**
- [ ] Add Saturn's rings (started working on this but got distracted)
- [ ] Include some of the major moons  
- [ ] Better mobile performance
- [ ] Maybe add some asteroid belt particles

---

## 📬 Questions or want to connect?

<div align="center">

<a href="https://linkedin.com/in/fsudenazhelvaci"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"></a>
<a href="mailto:helvacisudenazf@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"></a>

*Feel free to reach out if you have questions about the project or just want to chat about space, AR, or coding!*

</div>

---

**Credits:** Built during my TUBITAK UZAY internship. Planet textures from NASA. Thanks to the Three.js community for the documentation and examples.

<div align="center">

*Made with caffeine and debugging frustration during summer 2024* ☕

</div>