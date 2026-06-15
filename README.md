# Parcel Flow App

## Prerequisites

- Node.js
- npm

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/sajidrec/rn_parcel_flow
cd rn_parcel_flow
npm install
```

## Development

Start the Expo development server:

```bash
npx expo start
```

## Android Build

### Generate APK

```bash
cd android
./gradlew assembleRelease
```

APK output:

```text
android/app/build/outputs/apk/release/app-release.apk
```

### Generate AAB (Google Play Store)

```bash
cd android
./gradlew bundleRelease
```

AAB output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## Notes

- Make sure dependencies are installed before running or building the project.
- If the `android` folder is missing, generate native files first:

```bash
npx expo prebuild
```