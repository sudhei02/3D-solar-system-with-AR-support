# Veri Akışı Diyagramı

```mermaid
graph LR
    subgraph "Başlangıç"
        A[HTML Load] --> B[CSS Load]
        B --> C[JavaScript Load]
        C --> D[Three.js Initialize]
    end
    
    subgraph "Asset Loading"
        E[Planet Textures] --> F[Texture Loader]
        F --> G[Material Creation]
        G --> H[Geometry Creation]
        H --> I[Mesh Creation]
    end
    
    subgraph "Scene Setup"
        D --> J[Scene Creation]
        J --> K[Camera Setup]
        K --> L[Renderer Setup]
        L --> M[Controls Setup]
    end
    
    subgraph "Planet Creation"
        I --> N[Planet Factory]
        N --> O[Solar System Assembly]
        O --> P[Add to Scene]
    end
    
    subgraph "Animation Loop"
        Q[requestAnimationFrame] --> R[Update Planet Rotations]
        R --> S[Update Orbital Positions]
        S --> T[Update Camera]
        T --> U[Render Scene]
        U --> Q
    end
    
    subgraph "AR Integration"
        V[WebXR Check] --> W{AR Supported?}
        W -->|Yes| X[Enable AR Button]
        W -->|No| Y[3D Only Mode]
        X --> Z[AR Session Start]
        Z --> AA[XR Render Loop]
    end
    
    subgraph "User Interaction"
        BB[Mouse/Touch Events] --> CC[Raycasting]
        CC --> DD[Planet Detection]
        DD --> EE[Info Display]
    end
    
    P --> Q
    M --> V
    AA --> R
    EE --> Q

    style A fill:#e1f5fe
    style Q fill:#c8e6c9
    style Z fill:#fff3e0
    style DD fill:#fce4ec