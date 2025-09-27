# Capacitor.js Setup untuk Android APK

Setup lengkap Capacitor.js untuk mengubah Next.js web app menjadi Android APK.

## Prerequisites

### 1. Java Development Kit (JDK)
```bash
# Download dan install OpenJDK 17 atau Oracle JDK 17
# Windows: https://adoptium.net/temurin/releases/
# Pastikan JAVA_HOME sudah di set di environment variables
```

### 2. Android Studio
```bash
# Download Android Studio dari: https://developer.android.com/studio
# Install Android SDK, Platform Tools, dan Build Tools
# Setup ANDROID_HOME dan ANDROID_SDK_ROOT environment variables
```

### 3. Node.js Dependencies (sudah terinstall)
- ✅ @capacitor/cli
- ✅ @capacitor/core
- ✅ @capacitor/android
- ✅ @capacitor/status-bar
- ✅ @capacitor/splash-screen

## Project Structure

```
├── android/                 # Android native project (auto-generated)
├── out/                     # Next.js static export output
├── capacitor.config.ts      # Capacitor configuration
├── package.json            # Scripts untuk build APK
└── CAPACITOR_SETUP.md      # Dokumentasi ini
```

## Available Scripts

### 1. Build untuk Capacitor
```bash
npm run cap:build
```
- Build Next.js dengan `BUILD_TARGET=capacitor`
- Static export ke folder `out/`
- Sync web assets ke Android project

### 2. Open Android Studio
```bash
npm run cap:android
```
- Build project dan buka Android Studio
- Untuk development dan debugging

### 3. Run di Android Device/Emulator
```bash
npm run cap:run:android
```
- Build dan langsung install di device
- Requires Android device connected atau emulator running

### 4. Build APK (via Android Studio)
```bash
npm run cap:android
```
Kemudian di Android Studio:
- **Build → Generate Signed Bundle/APK**
- Pilih **APK**
- Sign dengan debug key atau production key

## Development Workflow

### 1. Setup Environment Variables
Pastikan environment variables sudah di set:
```bash
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot
ANDROID_HOME=C:\Users\[username]\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\[username]\AppData\Local\Android\Sdk
```

### 2. First Time Setup
```bash
# Build project untuk pertama kali
npm run cap:build

# Buka Android Studio
npm run cap:android
```

### 3. Development Loop
```bash
# Setiap kali ada perubahan web code:
npm run cap:build

# Test di device/emulator:
npm run cap:run:android
```

### 4. Generate APK
1. **Development APK (Debug):**
   ```bash
   npm run cap:android
   ```
   Di Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**

2. **Production APK (Signed):**
   - Generate signing key
   - Build → Generate Signed Bundle/APK
   - Pilih APK dan signing key

## Configuration Files

### capacitor.config.ts
```typescript
{
  appId: 'com.gmit.imanueloepura',
  appName: 'GMIT Imanuel Oepura',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: { /* config */ },
    StatusBar: { /* config */ }
  }
}
```

### next.config.mjs
- ✅ Static export untuk Capacitor (`BUILD_TARGET=capacitor`)
- ✅ Asset prefix relatif (`./`)
- ✅ Image optimization disabled
- ✅ Trailing slash enabled

## Android Permissions

Edit `android/app/src/main/AndroidManifest.xml` untuk tambah permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

## App Icon & Splash Screen

### 1. App Icon
Ganti icon di:
```
android/app/src/main/res/mipmap-*/ic_launcher.png
android/app/src/main/res/mipmap-*/ic_launcher_round.png
```

### 2. Splash Screen
Ganti splash screen di:
```
android/app/src/main/res/drawable/splash.png
android/app/src/main/res/drawable-night/splash.png
```

## Build Variants

### Debug APK
- Untuk testing
- Auto-signed dengan debug key
- Debugging enabled
- File: `app-debug.apk`

### Release APK
- Untuk production
- Harus signed dengan production key
- Optimized dan minified
- File: `app-release.apk`

## Troubleshooting

### 1. Build Errors
```bash
# Clear cache dan rebuild
npm run cap:build
npx cap sync android
```

### 2. Android Studio Issues
- Pastikan Android SDK updated
- Sync project dengan Gradle files
- Invalidate caches dan restart

### 3. Device Connection
```bash
# Check connected devices
adb devices

# Enable USB debugging di Android device
```

### 4. Gradle Issues
```bash
# Di folder android/
./gradlew clean
./gradlew build
```

## Important Notes

- ⚠️ **API Routes**: Next.js API routes tidak bisa dipakai di static export
- ⚠️ **Database**: Perlu setup database external atau local storage
- ⚠️ **HTTPS**: App menggunakan https scheme untuk security
- ⚠️ **Testing**: Test di real device, bukan hanya emulator

## File Sizes

- **Debug APK**: ~10-20MB
- **Release APK**: ~5-15MB (dengan optimization)
- **Web Assets**: Di-bundle ke dalam APK

## Deployment

### 1. Development Testing
```bash
npm run cap:run:android
```

### 2. Production Release
1. Build release APK di Android Studio
2. Upload ke Google Play Store
3. Atau distribute via APK file

Sekarang Anda bisa mengubah web app GMIT Imanuel Oepura menjadi Android app! 📱