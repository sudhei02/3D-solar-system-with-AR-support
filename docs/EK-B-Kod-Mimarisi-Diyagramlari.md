# EK B: KOD MİMARİSİ DİYAGRAMLARI

## 1. Sistem Mimarisi

![Sistem Mimarisi](docs/sistem-mimarisi.png)

**Açıklama:** 
Bu diyagram sistemin genel mimarisini göstermektedir. Web browser katmanından başlayarak Three.js, WebXR API ve solar system modellerine kadar olan tüm bileşenler ve aralarındaki ilişkiler görselleştirilmiştir.

**Ana Bileşenler:**
- **Web Browser Katmanı:** HTML, CSS ve JavaScript dosyalarının yüklenmesi
- **Three.js Katmanı:** 3D grafik motorunun temel bileşenleri
- **WebXR API:** AR oturumu yönetimi ve immersive deneyim
- **Solar System Modelleri:** 8 gezegenin 3D modelleri
- **Asset Yönetimi:** Planet texture'larının yüklenmesi
- **Kullanıcı Etkileşimi:** Mouse, touch ve AR gesture event'leri

## 2. Sınıf Diyagramı

![Sınıf Diyagramı](docs/sinif-diyagrami.png)

**Açıklama:**
Projenin nesne yönelimli yapısını gösteren detaylı sınıf diyagramı. Her sınıfın sorumlulukları, metotları ve diğer sınıflarla olan ilişkileri açık şekilde tanımlanmıştır.

**Ana Sınıflar:**

### SolarSystemApp
- **Sorumluluk:** Ana uygulama kontrolcüsü
- **Özellikler:** Scene, camera, renderer, controls, planets
- **Metotlar:** init(), animate(), startAR(), stopAR()

### Planet
- **Sorumluluk:** Gezegen nesnelerinin temsili
- **Özellikler:** name, mesh, orbitRadius, rotationSpeed, orbitSpeed, texture
- **Metotlar:** updateRotation(), updateOrbit(), onClick()

### XRSessionManager
- **Sorumluluk:** WebXR oturum yönetimi
- **Özellikler:** session, referenceSpace, isARSupported
- **Metotlar:** checkARSupport(), startSession(), endSession()

### PlanetFactory
- **Sorumluluk:** Gezegen nesnelerinin oluşturulması
- **Metotlar:** createPlanet(), loadTexture()

### OrbitController
- **Sorumluluk:** Gezegen yörünge hareketlerinin kontrolü
- **Metotlar:** updateOrbits(), calculatePosition()

### EventHandler
- **Sorumluluk:** Kullanıcı etkileşimlerinin yönetimi
- **Metotlar:** onMouseClick(), onTouchStart(), detectPlanetClick()

## 3. AR Workflow Diyagramı

![AR Workflow](docs/ar-workflow.png)

**Açıklama:**
AR özelliğinin çalışma akışını gösteren detaylı flowchart. Uygulama başlatılmasından AR session'ının sonlandırılmasına kadar olan tüm adımlar ve karar noktaları açıkça belirtilmiştir.

**Akış Adımları:**

1. **Başlangıç Kontrolleri:**
   - WebXR desteğinin kontrol edilmesi
   - AR modu butonunun gösterilmesi/gizlenmesi

2. **Session Başlatma:**
   - Kamera izninin kontrol edilmesi
   - İzin isteme süreci
   - AR session'ının başlatılması

3. **AR Deneyimi:**
   - Kamera feed'inin başlatılması
   - 3D solar system'in AR ortamında render edilmesi
   - Kullanıcı etkileşimlerinin işlenmesi

4. **Hata Yönetimi:**
   - WebXR desteklenmeme durumu
   - Kamera erişim hataları
   - Session başlatma hataları

## 4. Veri Akışı Diyagramı

![Veri Akışı](docs/veri-akisi.png)

**Açıklama:**
Uygulamadaki veri akışını gösteren diyagram. Dosyaların yüklenmesinden başlayarak animation loop'una kadar olan tüm veri işleme adımları görselleştirilmiştir.

**Veri Akış Aşamaları:**

### Başlangıç Aşaması
- HTML, CSS ve JavaScript dosyalarının yüklenmesi
- Three.js kütüphanesinin initialize edilmesi

### Asset Loading Aşaması
- Planet texture'larının yüklenmesi
- Material ve geometry oluşturma
- 3D mesh'lerin oluşturulması

### Scene Setup Aşaması
- 3D sahnenin kurulması
- Kamera ve renderer konfigürasyonu
- Kontrol sistemlerinin aktif edilmesi

### Planet Creation Aşaması
- Planet Factory kullanılarak gezegenlerin oluşturulması
- Solar system'in birleştirilmesi
- Nesnelerin sahneye eklenmesi

### Animation Loop
- requestAnimationFrame döngüsü
- Gezegen rotasyonlarının güncellenmesi
- Orbital pozisyonların hesaplanması
- Sahnenin render edilmesi

### AR Integration
- WebXR desteğinin kontrol edilmesi
- AR butonunun etkinleştirilmesi
- XR render loop'unun başlatılması

### User Interaction
- Mouse/Touch event'lerinin yakalanması
- Raycasting ile nesne tespiti
- Planet bilgi ekranının gösterilmesi

## 5. Teknik Implementasyon Detayları

### 5.1 Dosya Yapısı
```
docs/
├── sistem-mimarisi.png     # Sistem mimarisi diyagramı
├── sinif-diyagrami.png     # UML sınıf diyagramı
├── ar-workflow.png         # AR çalışma akışı
└── veri-akisi.png          # Veri akış diyagramı
```

### 5.2 Diyagram Özellikleri
- **Çözünürlük:** 1920x1080 (Full HD)
- **Format:** PNG (şeffaf arka plan)
- **Tema:** Dark theme (koyu tema)
- **Oluşturma Aracı:** Mermaid CLI v10.x

### 5.3 Kullanım Alanları
Bu diyagramlar aşağıdaki amaçlarla kullanılabilir:
- Proje dokümantasyonu
- Teknik sunumlar
- Kod review süreçleri
- Yeni geliştirici onboarding
- Akademik raporlama
- TUBITAK UZAY internship sunum materyalleri

### 5.4 Güncelleme Süreci
Diyagramların güncellenmesi için:
1. İlgili `.mmd` dosyasını düzenleyin
2. Mermaid CLI ile PNG'ye dönüştürün:
   ```bash
   mmdc -i diagram-name.mmd -o diagram-name.png -t dark -b transparent -w 1920 -H 1080
   ```
3. Dokümantasyondaki referansları kontrol edin

## 6. Diyagram Bağlantıları ve Referanslar

- **Sistem Mimarisi:** [docs/sistem-mimarisi.png](docs/sistem-mimarisi.png)
- **Sınıf Diyagramı:** [docs/sinif-diyagrami.png](docs/sinif-diyagrami.png)
- **AR Workflow:** [docs/ar-workflow.png](docs/ar-workflow.png)
- **Veri Akışı:** [docs/veri-akisi.png](docs/veri-akisi.png)

Bu diyagramlar projenin teknik yapısını kapsamlı bir şekilde dokumenta etmekte ve geliştiriciler için net bir referans sağlamaktadır.