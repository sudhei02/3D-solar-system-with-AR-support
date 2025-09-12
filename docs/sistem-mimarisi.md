# Sistem Mimarisi Diyagramı

```mermaid
graph TB
    subgraph "Web Browser"
        A[index.html] --> B[style.css]
        A --> C[main.js]
    end
    
    subgraph "Three.js Katmanı"
        C --> D[THREE.WebGLRenderer]
        C --> E[THREE.Scene]
        C --> F[THREE.PerspectiveCamera]
        C --> G[THREE.OrbitControls]
    end
    
    subgraph "WebXR API"
        D --> H[XR Session Manager]
        H --> I[AR Session]
        H --> J[Immersive AR]
    end
    
    subgraph "Solar System Modelleri"
        E --> K[Güneş]
        E --> L[Merkür]
        E --> M[Venüs]
        E --> N[Dünya]
        E --> O[Mars]
        E --> P[Jüpiter]
        E --> Q[Satürn]
        E --> R[Uranüs]
        E --> S[Neptün]
    end
    
    subgraph "Asset Yönetimi"
        T[Planet Textures] --> K
        T --> L
        T --> M
        T --> N
        T --> O
        T --> P
        T --> Q
        T --> R
        T --> S
    end
    
    subgraph "Kullanıcı Etkileşimi"
        U[Mouse Events] --> V[Click Detection]
        W[Touch Events] --> V
        X[AR Gesture] --> V
        V --> Y[Planet Selection]
    end

    style A fill:#f9d71c
    style C fill:#ffd700
    style H fill:#ff6b6b
    style E fill:#4ecdc4
    style Y fill:#45b7d1