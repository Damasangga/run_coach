# Run Coach — Road to Marathon
Dashboard statis (HTML/JS) untuk GitHub Pages: Dashboard, Timeline Training (30 minggu), Achievement.

## Deploy
1. Buat repo baru di github.com/Damasangga, mis. `run-coach`, lalu upload isi folder ini.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Buka https://damasangga.github.io/run-coach/

## Sinkron Strava otomatis (setiap 3 jam)
1. Di strava.com/settings/api buat ulang Client Secret, lalu ambil Client ID.
2. Dapatkan refresh token dengan scope `activity:read_all` (otorisasi OAuth sekali; lihat developers.strava.com/docs/authentication).
3. Settings → Secrets and variables → Actions: tambahkan `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`.
4. Actions → Sync Strava → Run workflow. Setiap aktivitas baru memperbarui dashboard, dan volume minggu berikutnya otomatis disesuaikan (turun 10% bila volume < 70% rencana).
Jangan pernah menaruh kunci Strava di file kode.

## Huawei Watch Fit 3
Tab Timeline: tombol "Salin untuk Huawei" per sesi (pemanasan, inti, pendinginan) untuk dibuat sebagai kursus lari kustom di Huawei Health. File `.ics` mengisi kalender HP dengan alarm 04:00 (lari) dan 19:00 (strength). Impor file latihan otomatis ke jam tidak saya jamin didukung Huawei.
