# Moshi (`@moshi89`) — Engineering Portfolio

Interactive static portfolio of **Moshi**, a 4th-year Computer Science & Engineering undergraduate at **Pusan National University (PNU)**.

- **Live Site:** `https://moshi89.github.io/` *(update with your repository Pages URL if deployed to a subpath)*
- **GitHub:** [github.com/moshi89](https://github.com/moshi89)
- **Email:** moshim668@gmail.com
- **Resume:** Downloadable PDF included (`public/Moshi_Resume.pdf`)

---

## Current Interests (현재 관심 분야)
- **Physical AI & Robotic AI** (Robot Arm Manipulation, Kinematics & Embodied Control)
- **On-Device & Embedded AI** (Quantized NLP / ONNX Runtime)
- **Real-Time Operating Systems** (`uC/OS-III`, `FreeRTOS`, deterministic hardware interlocks)
- **Mobile & Full-Stack Engineering** (Kotlin Jetpack Compose, React, TypeScript)

---

## Featured Projects (대표 프로젝트)

Each project includes its **Overview (대표 프로젝트 소개)**, **Problem Definition (문제 정의)**, **Role (역할)**, **Tech Stack (기술)**, **Results (결과)**, **Interactive/Video Demo Links (데모 링크)**, and **Source Code Links (소스 코드 링크)**:

1. **Clinical CBT Companion App**
   - Offline-first Android mental health app pairing quantized on-device `XLM-RoBERTa` (`ONNX`) distortion detection with Gemini Socratic reframing, GPS/weather-aware behavioral activation, and zero-lag Coroutines (`Dispatchers.IO`).
2. **RTOS-Factory-Safety-Controller (STM32 & uC/OS-III)**
   - 9-task preemptive industrial dual-conveyor safety controller with ISR emergency interlocks, `ADXL345` vibration hysteresis, `HC-SR04` proximity detection, and fail-secure `SG90` servo locking.
3. **Smart Pet Companion Robot (2024)**
   - Arduino Uno R3 autonomous companion featuring ultrasonic obstacle avoidance, timed dispenser servo control, photoresistor night-light automation, `DFPlayer Mini` audio, and custom `16x2` LCD CGRAM animations.

---

## Competition & Hackathon Experience (2026)
- **[DACON] 2026 AI·SW중심대학 디지털 경진대회** — Participated on behalf of Pusan National University (July 2026, Completed).
- **DIVE 2026 Busan Global Hackathon** — Completed sprint participation in Busan (July 2026).

---

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons
- **Static Deployment:** Configured with `base: './'` in `vite.config.ts` for GitHub Pages compatibility

---

## Local Development & Build

```bash
# Install dependencies
npm install

# Run local dev server (http://localhost:3000)
npm run dev

# Type-check and build static production bundle into dist/
npm run lint
npm run build
```

---

## Automatic Deployment to GitHub Pages

This repository includes `.github/workflows/deploy.yml` for automated deployment:

1. Push your code to the `main` branch on GitHub.
2. In your GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The workflow builds `dist/` via Vite and publishes it to GitHub Pages automatically on every push to `main` (or via manual **Run workflow** trigger).
