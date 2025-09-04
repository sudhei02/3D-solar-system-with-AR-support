import * as THREE from "three";

// AR çalışması için gerekli değişkenler
let currentSession = null;
let arButton = null;
let isARSupported = false;
let planetGroup = null;
let renderer = null;
let arPlaced = false; // AR başlayınca bir kez yerleştir, sonra dokunma
let lastFrameTime = null; // animasyonun düzgün çalışması için zaman takibi

async function main() {
  const canvas = document.querySelector("#c");

  // webGL'i AR uyumlu hale getir
  const gl =
    canvas.getContext("webgl2", { xrCompatible: true }) ||
    canvas.getContext("webgl", { xrCompatible: true });

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    context: gl,
    alpha: true, // AR'de şeffaflık için gerekli
  });

  // AR özelliğini aç
  renderer.xr.enabled = true;

  const fov = 75;
  const aspect = 2; // canvas'ın varsayılan oranı
  const near = 0.1;
  const far = 100; // AR için uzağı daha çok görebilmek için arttırdım
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 25;

  const scene = new THREE.Scene();

  // bütün gezegenleri tek paket haline getir - AR'de hep beraber hareket etsinler
  planetGroup = new THREE.Group();
  scene.add(planetGroup);

  // gezegen yüzeylerini yüklemek için
  const textureLoader = new THREE.TextureLoader();

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light); // gezegenler görünsün diye ışık gerekiyo
  }

  // güneşi merkeze koy
  const radius = 3;
  const widthSegments = 24;
  const heightSegments = 8;
  const sunGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const sunTexture = textureLoader.load(
    "./assets/sun.jpg",
    // yüklenince
    function (texture) {
      console.log("Sun texture loaded:");
    },
    // yüklenirken
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // hata olursa
    function (error) {
      console.error("Error loading sun texture:", error);
    }
  );
  const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 0, 0); // güneş tam merkez'de olsun
  planetGroup.add(sun);

  // gezegen yaratma fonksiyonu - telefonda hızlı çalışsın diye optimize ettim
  function createPlanet(
    radius,
    texturePath,
    orbitRadius,
    orbitSpeed,
    initialRotation = 0
  ) {
    // telefonda hızlı çalışsın diye gezegen yüzeyini basitleştirdim
    const segmentCount = renderer.xr.isPresenting ? 12 : 24;
    const geometry = new THREE.SphereGeometry(
      radius,
      segmentCount,
      segmentCount / 2
    );

    const texture = textureLoader.load(
      texturePath,
      // yüklenince
      function (texture) {
        console.log("Texture loaded:");
      },

      // yüklenirken
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },

      // hata olursa
      function (error) {
        console.error("Error loading texture:", error);
      }
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2); // yüzeyi tekrarla, daha güzel görünsün

    // telefonda AR için performans ayarları
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);

    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, 0, 0); // orbit merkezi güneş'te olsun
    planet.position.x = orbitRadius; // gezegeni orbit üzerine yerleştir
    orbitGroup.rotation.y = initialRotation; // gezegenler aynı yerde durmasın, dağıt
    orbitGroup.add(planet);
    planetGroup.add(orbitGroup);

    return {
      planet: planet,
      orbitGroup: orbitGroup,
      orbitSpeed: orbitSpeed,
      rotationSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  // gezegenleri tek tek yarat - hepsinin farklı başlangıç pozisyonu olsun
  const planets = [];
  planets.push(createPlanet(0.4, "./assets/mercury.jpg", 6, 0.02, 0)); // merkür, güneşe en yakın
  planets.push(
    createPlanet(0.6, "./assets/venus.jpg", 10, 0.01, Math.PI * 0.25)
  ); // venüs
  planets.push(
    createPlanet(0.8, "./assets/earth.jpg", 14, 0.005, Math.PI * 0.5)
  ); // dünya
  planets.push(
    createPlanet(0.5, "./assets/mars.jpg", 18, 0.003, Math.PI * 0.75)
  ); // mars
  planets.push(createPlanet(1.2, "./assets/jupiter.jpg", 22, 0.002, Math.PI)); // jüpiter
  planets.push(
    createPlanet(1.5, "./assets/saturn.jpg", 26, 0.001, Math.PI * 1.25)
  ); // satürn
  planets.push(
    createPlanet(1.0, "./assets/uranus.jpg", 30, 0.0005, Math.PI * 1.5)
  ); // uranüs
  planets.push(
    createPlanet(1.5, "./assets/neptune.jpg", 34, 0.0002, Math.PI * 1.75)
  ); // neptün

  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement); // bunu yapma, ekran bozuluyo

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

  // AR uyumlu çizim fonksiyonu
  function render(time) {
    const now = time * 0.001; // saniyeye çevir
    const delta = lastFrameTime === null ? 0 : now - lastFrameTime;
    lastFrameTime = now;

    // sadece normal modda ekran boyutunu ayarla, AR'de karışma
    if (!renderer.xr.isPresenting && resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // AR modunda gezegenleri yerleştir (daha yakın ve küçük)
    if (renderer.xr.isPresenting) {
      // AR başlayınca bir kez yerleştir, sonra değiştirme (kaymasın diye)
      if (!arPlaced) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.normalize().multiplyScalar(3);
        const camPos = new THREE.Vector3();
        camera.getWorldPosition(camPos);
        const targetPos = camPos.add(forward);
        targetPos.y -= 0.8; // rahat bakmak için biraz aşağıya koy
        planetGroup.position.copy(targetPos);
        planetGroup.scale.setScalar(0.2);
        planetGroup.updateMatrixWorld(true);
        arPlaced = true;
      }
    } else {
      planetGroup.position.set(0, 0, 0); // bilgisayarda normal pozisyon
      planetGroup.scale.setScalar(1); // normal boyut
    }

    // güneş kendi etrafında dönsün (sadece görsel, yeri değişmiyo)
    sun.rotation.y += delta * 0.005;

    // gezegenleri hareket ettir
    planets.forEach((planetData) => {
      planetData.orbitGroup.rotation.y += delta * planetData.orbitSpeed; // güneş etrafında dön
      planetData.planet.rotation.y += delta * planetData.rotationSpeed; // kendi ekseni etrafında dön
    });

    renderer.render(scene, camera);
  }

  // AR uyumlu animasyon döngüsü kullan
  renderer.setAnimationLoop(render);
  // AR desteğini başlat
  initializeAR();
}

// AR oturumu yönetim fonksiyonları
async function initializeAR() {
  // telefon AR yapabiliyomu kontrol et
  if ("xr" in navigator) {
    try {
      isARSupported = await navigator.xr.isSessionSupported("immersive-ar");
      if (isARSupported) {
        createARButton();
      } else {
        console.log("AR not supported on this device");
        showARUnsupportedMessage();
      }
    } catch (error) {
      console.warn("Error checking AR support:", error);
      showARUnsupportedMessage();
    }
  } else {
    console.log("WebXR not supported in this browser");
    showARUnsupportedMessage();
  }
}

function showARUnsupportedMessage() {
  const infoDiv = document.getElementById("info");
  if (infoDiv) {
    const unsupportedMsg = document.createElement("p");
    unsupportedMsg.style.color = "#ff6b6b";
    unsupportedMsg.style.fontWeight = "bold";
    unsupportedMsg.innerHTML =
      "⚠️ AR not available on this device/browser. Try using Chrome on Android or Safari on iOS with HTTPS.";
    infoDiv.appendChild(unsupportedMsg);
  }
}

function createARButton() {
  arButton = document.createElement("button");
  arButton.textContent = "Enter AR";
  arButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 12px 24px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  `;

  arButton.addEventListener("mouseenter", () => {
    arButton.style.background = "#45a049";
    arButton.style.transform = "translateX(-50%) translateY(-2px)";
  });

  arButton.addEventListener("mouseleave", () => {
    arButton.style.background = "#4CAF50";
    arButton.style.transform = "translateX(-50%) translateY(0)";
  });

  arButton.addEventListener("click", toggleAR);
  document.body.appendChild(arButton);
}

async function toggleAR() {
  if (currentSession === null) {
    try {
      // AR oturumu başlat - mümkün olduğunca uyumlu olsun
      currentSession = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: [], // zorunlu özellik yok, herkes kullanabilsin
        optionalFeatures: [
          "local",
          "local-floor",
          "hit-test",
          "light-estimation",
        ],
      });

      // oturumu ayarla
      const canvas = document.querySelector("#c");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      await currentSession.updateRenderState({
        baseLayer: new XRWebGLLayer(currentSession, gl),
      });

      // AR oturumunu başlat
      await renderer.xr.setSession(currentSession);

      // referans alanı ayarla (en uyumlu olanı kullan)
      try {
        await currentSession.requestReferenceSpace("local-floor");
      } catch (e) {
        try {
          await currentSession.requestReferenceSpace("local");
        } catch (e2) {
          await currentSession.requestReferenceSpace("viewer");
        }
      }

      currentSession.addEventListener("end", onSessionEnd);
      arButton.textContent = "Exit AR";
      arButton.style.background = "#f44336";
      // AR başlarken yerleştirme bayrağını sıfırla
      arPlaced = false;
    } catch (error) {
      console.error("Error starting AR session:", error);
      alert("AR session failed. Check compatible device and browser.");
    }
  } else {
    currentSession.end();
  }
}

function onSessionEnd() {
  currentSession = null;
  arButton.textContent = "Enter AR";
  arButton.style.background = "#4CAF50";
}

main().catch(console.error); // main fonksiyonu async olduğu için hata yakalama
