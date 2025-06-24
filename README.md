# 🍏 ManzanaAPP 

Aplicación móvil desarrollada con **Ionic Angular** que permite identificar el estado de una manzana (saludable o dañada) mediante la cámara del dispositivo.

## 📸 Funcionalidades principales

- Captura de imagen desde cámara nativa
- Procesamiento local con modelos entrenados
- Predicción en tiempo real o por captura
- Interfaz simple y amigable para uso en campo

---

## 🛠️ Herramientas y Tecnologías utilizadas

| Herramienta              | Uso principal                                      |
|--------------------------|----------------------------------------------------|
| Ionic Angular            | Interfaz móvil híbrida                            |
| TensorFlow.js            | Inferencia del modelo IA en el navegador o móvil  |
| Capacitor                | Acceso a APIs nativas (cámara, archivos, etc.)    |
| @capacitor/camera        | Captura de foto desde la cámara del dispositivo   |
| cordova-res              | Generación de íconos y splash para Android        |
| Android Studio           | Empaquetado y firma de APK para despliegue        |

---

## 🚀 Instalación y configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/ManzanaApp.git
cd ManzanaApp
```
### 2. Instala las dependencias
```bash
npm install
```
### 3. Agrega la plataforma Android (si no lo hiciste aún)
```bash
npx cap add android
```
### 4. Copia archivos web al entorno nativo
```bash
ionic build
npx cap copy android
```
### 5. Abre en Android Studio
```bash
npx cap open android
```
### 6. Genera el APK e instala la APP en tu dispositivo



