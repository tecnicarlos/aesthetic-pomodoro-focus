# Aesthetic Pomodoro Focus 🍅✨

A premium, high-performance productivity application that combines the Pomodoro technique with gamification, aesthetic themes, and a seamless cross-platform experience (Windows & Web).

![App Screenshot](https://via.placeholder.com/800x450.png?text=Aesthetic+Pomodoro+Preview)
*(Replace with actual screenshot)*

## 🚀 Features

-   **Focus Timer:** Customizable Pomodoro timer with "Focus", "Short Break", and "Long Break" modes.
-   **Gamification:** Earn XP and Coins for every minute of focus. Level up and unlock achievements! 🏆
-   **Shop System:** Spend your hard-earned coins on new themes and sounds. 🛒
-   **Aesthetic Themes:** Beautiful, curated themes (Cyberpunk, Nature, Minimal, etc.) with Dark Mode support. 🎨
-   **Internationalization:** Full support for English (EN) and Portuguese (PT-BR). 🌐
-   **System Tray Integration:** (Windows) Minimize to tray with dynamic tooltip updates showing remaining time.
-   **Smart Taskbar:** (Windows) Progress bar and timer in the window title.

## 🛠️ Tech Stack

-   **Core:** [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
-   **Desktop Wrapper:** [Electron](https://www.electronjs.org/)
-   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
-   **Persistence:** AsyncStorage
-   **Styling:** Tailwind-like utility styles (Custom Implementation)
-   **Bundler:** Metro (Configured for CJS/ESM compatibility)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/aesthetic-pomodoro.git
    cd aesthetic-pomodoro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## ▶️ Running Locally

### Development Mode (Electron + Web)
This runs the Expo Web server and wraps it in an Electron window with hot-reloading.
```bash
npm run electron:dev
```

### Web Only
```bash
npm run web
```

## 🏗️ Building for Production (Windows)

To generate the `.exe` installer or unpacked executable:

```bash
npm run dist:win
```
*Note: Requires Administrator privileges for full installer generation.*

The output will be in the `dist/` folder.

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components (AppButton, CircularTimer, etc.)
├── constants/    # Theme definitions, achievements, game data
├── context/      # Global state (Timer, Gamification, Settings)
├── hooks/        # Custom hooks (useTranslation, etc.)
├── i18n/         # Translation files
├── screens/      # Main application screens
├── services/     # Audio and Backend services
├── utils/        # Helper functions
└── ...
electron/         # Electron main process and preload scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
