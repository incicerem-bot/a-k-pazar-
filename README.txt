:root {
  --ink: #111827;
  --muted: #6b7280;
  --line: #e5e7eb;
  --surface: #ffffff;
  --bg: #f3f5f9;
  --accent: #ff6b2c;
  --accent-dark: #e94e13;
  --green: #0e9f6e;
  --red: #dc2626;
}

* {
  box-sizing: border-box;
}
html {
  background: var(--bg);
  scroll-behavior: smooth;
}
body {
  margin: 0;
  color: var(--ink);
  background: var(--bg);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}
button,
input,
textarea,
select {
  font: inherit;
}
button {
  cursor: pointer;
}
img {
  display: block;
  max-width: 100%;
}

.app-shell {
  width: min(100%, 1180px);
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg);
  padding-bottom: 100px;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  min-height: 68px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(229, 231, 235, 0.9);
  backdrop-filter: blur(20px);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  text-align: left;
  padding: 0;
  color: var(--ink);
}
.brand-mark {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: white;
  background: linear-gradient(145deg, var(--accent), #ff985e);
  box-shadow: 0 8px 18px rgba(255, 107, 44, 0.28);
  font-size: 21px;
  font-weight: 950;
}
.brand strong,
.brand small {
  display: block;
}
.brand strong {
  font-size: 17px;
  letter-spacing: -0.5px;
}
.brand small {
  margin-top: 1px;
  font-size: 9px;
  color: var(--muted);
}
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-pill {
  border-radius: 999px;
  padding: 6px 9px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.5px;
}
.icon-button {
  position: relative;
  width: 42px;
  height: 42px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: white;
  font-size: 18px;
}
.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 2px solid white;
  color: white;
  background: var(--red);
  font-size: 9px;
  font-weight: 900;
}
.page {
  padding: 22px 18px 32px;
}

.hero {
  position: relative;
  overflow: hidden;
  min-height: 265px;
  display: grid;
  gap: 24px;
  padding: 30px 26px;
  border-radius: 28px;
  color: white;
  background:
    radial-gradient(
      circle at 84% 10%,
      rgba(255, 255, 255, 0.14),
      transparent 26%
    ),
    linear-gradient(135deg, #121826, #232c3e);
  box-shadow: 0 24px 50px rgba(17, 24, 39, 0.17);
}
.hero::after {
  content: "A";
  position: absolute;
  right: -36px;
  bottom: -112px;
  color: rgba(255, 255, 255, 0.035);
  font-size: 330px;
  line-height: 1;
  font-weight: 950;
}
.eyebrow {
  display: inline-block;
  color: #ffb28c;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.6px;
}
.hero h1 {
  margin: 12px 0 9px;
  font-size: clamp(30px, 6vw, 46px);
  line-height: 1.02;
  letter-spacing: -1.8px;
}
.hero p {
  max-width: 480px;
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
  line-height: 1.5;
}
.hero-cta {
  position: relative;
  z-index: 2;
  margin-top: 21px;
  border: 0;
  border-radius: 13px;
  background: var(--accent);
  color: white;
  padding: 12px 15px;
  font-size: 11px;
  font-weight: 900;
  box-shadow: 0 10px 22px rgba(255, 107, 44, 0.25);
}
.hero-cta span {
  margin-left: 8px;
}
.hero-metric {
  position: relative;
  z-index: 2;
  align-self: end;
  justify-self: start;
  display: grid;
  padding: 15px 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}
.hero-metric strong {
  font-size: 25px;
  letter-spacing: -1px;
}
.hero-metric span {
  color: #cbd5e1;
  font-size: 9px;
}
.hero-metric small {
  margin-top: 7px;
  color: #6ee7b7;
  font-weight: 800;
  font-size: 9px;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-top: 18px;
}
.search-box {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: white;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.04);
}
.search-box span {
  font-size: 22px;
  color: #9ca3af;
}
.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 12px;
  color: var(--ink);
}
.sort-select {
  max-width: 125px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: white;
  padding: 0 11px;
  color: var(--ink);
  font-size: 10px;
  font-weight: 800;
  outline: 0;
}
.chips {
  display: flex;
  gap: 8px;
  margin: 13px 0 18px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.chip {
  flex: 0 0 auto;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: white;
  color: var(--muted);
  padding: 9px 13px;
  font-size: 10px;
  font-weight: 800;
}
.chip.active {
  border-color: var(--ink);
  background: var(--ink);
  color: white;
}
.safety-banner {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 6px 0 21px;
  padding: 13px;
  border: 1px solid #bbf7d0;
  border-radius: 16px;
  background: #f0fdf4;
}
.safety-banner > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: white;
}
.safety-banner div {
  flex: 1;
}
.safety-banner strong,
.safety-banner small {
  display: block;
}
.safety-banner strong {
  color: #166534;
  font-size: 11px;
}
.safety-banner small {
  margin-top: 2px;
  color: #4b7a5b;
  font-size: 9px;
}
.safety-banner b {
  color: #15803d;
  font-size: 9px;
  white-space: nowrap;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 21px 1px 12px;
}
.section-heading div {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
}
.section-heading > span {
  color: var(--muted);
  font-size: 10px;
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 5px rgba(255, 107, 44, 0.13);
}

.auction-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.auction-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: white;
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.045);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}
.auction-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(17, 24, 39, 0.1);
}
.visual {
  height: 170px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #eef1f5, #fafafa);
}
.visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.countdown {
  position: absolute;
  z-index: 2;
  left: 9px;
  top: 9px;
  border-radius: 9px;
  padding: 6px 8px;
  color: white;
  background: rgba(17, 24, 39, 0.9);
  font-size: 9px;
  font-weight: 900;
}
.countdown.ended {
  background: rgba(107, 114, 128, 0.92);
}
.favorite {
  position: absolute;
  z-index: 3;
  right: 9px;
  top: 9px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.93);
  color: #9ca3af;
  font-size: 18px;
  box-shadow: 0 5px 15px rgba(17, 24, 39, 0.08);
}
.favorite.active {
  color: #ef4444;
}
.reserve-badge {
  position: absolute;
  z-index: 2;
  left: 9px;
  bottom: 9px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  padding: 5px 7px;
  color: #374151;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  font-size: 8px;
  font-weight: 900;
}
.reserve-badge.met {
  color: #047857;
}
.card-body {
  padding: 13px;
}
.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.card-meta > span:last-child {
  color: var(--muted);
  font-size: 8px;
}
.category-label {
  display: inline-block;
  border-radius: 999px;
  padding: 5px 8px;
  color: var(--accent-dark);
  background: #fff1eb;
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.card-body h2 {
  min-height: 38px;
  margin: 9px 0 15px;
  font-size: 13px;
  line-height: 1.3;
  letter-spacing: -0.25px;
}
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 6px;
}
.price-row small,
.price-row strong {
  display: block;
}
.price-row small {
  margin-bottom: 2px;
  color: var(--muted);
  font-size: 8px;
}
.price-row strong {
  font-size: 15px;
  letter-spacing: -0.5px;
}
.price-row > span {
  color: var(--muted);
  font-size: 8px;
  white-space: nowrap;
}

.bottom-nav {
  position: fixed;
  z-index: 30;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: min(100%, 1180px);
  height: 78px;
  padding: 10px 12px 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.25fr 1fr 1fr;
  align-items: center;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--line);
}
.nav-item {
  border: 0;
  background: transparent;
  color: #9ca3af;
  font-size: 9px;
  font-weight: 800;
  display: grid;
  justify-items: center;
  gap: 4px;
}
.nav-item span {
  font-size: 21px;
  line-height: 1;
}
.nav-item.active {
  color: var(--ink);
}
.sell-button {
  height: 58px;
  margin-top: -27px;
  border: 5px solid var(--bg);
  border-radius: 19px;
  background: var(--accent);
  color: white;
  font-size: 9px;
  font-weight: 900;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 1px;
  box-shadow: 0 10px 22px rgba(255, 107, 44, 0.3);
}
.sell-button span {
  font-size: 25px;
  line-height: 0.9;
}
.toast {
  position: fixed;
  z-index: 80;
  left: 50%;
  bottom: 92px;
  transform: translateX(-50%);
  max-width: calc(100% - 32px);
  padding: 12px 17px;
  border-radius: 12px;
  color: white;
  background: var(--ink);
  box-shadow: 0 15px 30px rgba(17, 24, 39, 0.25);
  font-size: 12px;
  text-align: center;
}

.detail-page {
  min-height: 100vh;
  background: white;
  padding-bottom: 30px;
}
.detail-actions {
  position: absolute;
  z-index: 5;
  top: 18px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
}
.detail-actions button {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 6px 20px rgba(17, 24, 39, 0.1);
  font-size: 20px;
}
.detail-visual {
  min-height: 340px;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(circle at 50% 45%, #fff 0%, #edf0f5 72%);
}
.detail-visual > img {
  width: 100%;
  height: 340px;
  object-fit: cover;
}
.detail-timer {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  min-width: 140px;
  border-radius: 14px;
  padding: 9px 18px;
  color: white;
  background: var(--ink);
  text-align: center;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.18);
}
.detail-timer.ended {
  background: #6b7280;
}
.detail-timer small,
.detail-timer strong {
  display: block;
}
.detail-timer small {
  color: #9ca3af;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.detail-timer strong {
  margin-top: 2px;
  font-size: 16px;
}
.detail-content {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 20px;
}
.detail-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail-topline > span:last-child {
  color: var(--muted);
  font-size: 9px;
}
.detail-content h1 {
  margin: 10px 0 18px;
  font-size: 27px;
  line-height: 1.1;
  letter-spacing: -1px;
}
.seller-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 15px 0;
  border-block: 1px solid var(--line);
}
.avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eef0f4;
  font-weight: 900;
}
.seller-row > div {
  flex: 1;
}
.seller-row strong,
.seller-row small {
  display: block;
}
.seller-row strong {
  font-size: 12px;
}
.seller-row strong em {
  color: #2563eb;
  font-style: normal;
}
.seller-row small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 9px;
}
.condition {
  border-radius: 999px;
  padding: 7px 10px;
  color: #047857;
  background: #ecfdf5;
  font-size: 9px;
  font-weight: 900;
}
.bid-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0 12px;
}
.bid-summary > div {
  padding: 15px;
  border-radius: 16px;
  background: #f7f8fa;
}
.bid-summary small,
.bid-summary strong {
  display: block;
}
.bid-summary small {
  color: var(--muted);
  font-size: 9px;
}
.bid-summary strong {
  margin-top: 5px;
  font-size: 21px;
  letter-spacing: -0.6px;
}
.reserve-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 11px;
  padding: 12px;
  border: 1px solid #fed7aa;
  border-radius: 14px;
  background: #fff7ed;
}
.reserve-status > span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #c2410c;
  background: white;
  font-weight: 900;
}
.reserve-status strong,
.reserve-status small {
  display: block;
}
.reserve-status strong {
  color: #9a3412;
  font-size: 10px;
}
.reserve-status small {
  margin-top: 3px;
  color: #9a5a36;
  font-size: 8px;
}
.reserve-status.met {
  border-color: #a7f3d0;
  background: #ecfdf5;
}
.reserve-status.met > span {
  color: #047857;
}
.reserve-status.met strong {
  color: #065f46;
}
.reserve-status.met small {
  color: #477565;
}
.trust-strip {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.trust-strip span {
  flex: 0 0 auto;
  border: 1px solid #ccfbf1;
  border-radius: 12px;
  padding: 10px;
  color: #0f766e;
  background: #f0fdfa;
  font-size: 9px;
  font-weight: 800;
}
.detail-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 22px;
  border-bottom: 1px solid var(--line);
}
.detail-tabs button {
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  padding: 12px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 900;
}
.detail-tabs button.active {
  border-color: var(--ink);
  color: var(--ink);
}
.detail-copy p {
  color: #4b5563;
  line-height: 1.65;
  font-size: 13px;
}
.detail-copy dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.detail-copy dl div {
  padding: 12px;
  border-radius: 13px;
  background: #f8fafc;
}
.detail-copy dt {
  color: var(--muted);
  font-size: 8px;
}
.detail-copy dd {
  margin: 3px 0 0;
  font-size: 11px;
  font-weight: 900;
}
.bid-history {
  padding: 8px 0;
}
.bid-history > div {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line);
}
.bid-history .rank {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #f3f4f6;
  font-size: 9px;
  font-weight: 900;
}
.bid-history > div > div {
  flex: 1;
}
.bid-history strong,
.bid-history small {
  display: block;
}
.bid-history strong {
  font-size: 10px;
}
.bid-history small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 8px;
}
.bid-history b {
  font-size: 11px;
}
.bid-box {
  margin-top: 18px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.06);
}
.bid-box > label {
  display: block;
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 900;
}
.quick-bids {
  display: flex;
  gap: 7px;
  margin-bottom: 9px;
}
.quick-bids button {
  flex: 1;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #f8fafc;
  padding: 8px 4px;
  font-size: 8px;
  font-weight: 900;
}
.bid-input {
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  border: 2px solid var(--ink);
  border-radius: 13px;
}
.bid-input span {
  font-weight: 900;
}
.bid-input input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 20px;
  font-weight: 900;
  text-align: right;
}
.bid-box > small {
  display: block;
  margin: 8px 0 14px;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
}
.bid-box > button,
.primary-button {
  width: 100%;
  border: 0;
  border-radius: 14px;
  background: var(--accent);
  color: white;
  padding: 15px;
  font-weight: 900;
  box-shadow: 0 10px 22px rgba(255, 107, 44, 0.23);
}
.bid-box > button:disabled {
  cursor: not-allowed;
  background: #9ca3af;
  box-shadow: none;
}

.screen-title {
  margin-bottom: 20px;
}
.screen-title h1 {
  margin: 0;
  font-size: 29px;
  letter-spacing: -1px;
}
.screen-title p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
}
.form-page {
  max-width: 720px;
  margin: auto;
}
.sell-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.sell-header > div {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
}
.sell-header button {
  width: 37px;
  height: 37px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: white;
}
.sell-header small {
  color: var(--muted);
  font-size: 9px;
}
.stepper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 25px;
}
.stepper span {
  height: 4px;
  border-radius: 99px;
  background: #dfe3ea;
}
.stepper span.active {
  background: var(--accent);
}
.sell-form {
  display: grid;
  gap: 15px;
}
.sell-form label {
  display: grid;
  gap: 7px;
  font-size: 11px;
  font-weight: 900;
}
.sell-form input,
.sell-form textarea,
.sell-form select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: white;
  padding: 14px;
  outline: none;
  color: var(--ink);
}
.sell-form input:focus,
.sell-form textarea:focus,
.sell-form select:focus {
  border-color: var(--ink);
}
.photo-upload {
  position: relative;
  height: 180px;
  overflow: hidden;
  display: grid !important;
  place-items: center;
  align-content: center;
  gap: 6px !important;
  border: 2px dashed #cbd5e1;
  border-radius: 18px;
  background: white;
  color: var(--muted);
  cursor: pointer;
}
.photo-upload > span {
  font-size: 34px;
}
.photo-upload > strong {
  color: var(--ink);
  font-size: 13px;
}
.photo-upload > small {
  font-size: 9px;
}
.photo-upload input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.photo-upload.has-photo {
  border-style: solid;
}
.photo-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}
.rule-card {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: white;
}
.rule-card > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #fff7ed;
}
.rule-card strong {
  font-size: 11px;
}
.rule-card p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.5;
}
.preview-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
}
.preview-card img {
  width: 105px;
  height: 105px;
  border-radius: 13px;
  object-fit: cover;
  background: #f3f4f6;
}
.preview-card h3 {
  margin: 7px 0 12px;
  font-size: 13px;
}
.preview-card small,
.preview-card strong {
  display: block;
}
.preview-card small {
  color: var(--muted);
  font-size: 8px;
}
.preview-card strong {
  margin-top: 2px;
}
.summary-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: white;
}
.summary-list div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 13px;
  border-bottom: 1px solid var(--line);
}
.summary-list div:last-child {
  border-bottom: 0;
}
.summary-list span {
  color: var(--muted);
  font-size: 9px;
}
.summary-list strong {
  font-size: 10px;
}
.info-box {
  padding: 13px;
  border: 1px solid #fed7aa;
  border-radius: 13px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 9px;
  line-height: 1.5;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.secondary-button {
  width: 35%;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: white;
  color: var(--ink);
  font-weight: 900;
}

.profile-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 24px;
  border-radius: 24px;
  color: white;
  background: linear-gradient(135deg, #111827, #263043);
  overflow: hidden;
}
.profile-card::after {
  content: "A";
  position: absolute;
  right: -10px;
  bottom: -55px;
  color: rgba(255, 255, 255, 0.04);
  font-size: 170px;
  font-weight: 950;
}
.large-avatar {
  width: 62px;
  height: 62px;
  z-index: 1;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: var(--accent);
  font-weight: 900;
}
.profile-card > div:nth-child(2) {
  z-index: 1;
}
.profile-card h1 {
  margin: 0 0 3px;
  font-size: 21px;
}
.profile-card p {
  margin: 0;
  color: #cbd5e1;
  font-size: 10px;
}
.profile-level {
  position: absolute;
  z-index: 1;
  right: 16px;
  top: 16px;
  border-radius: 999px;
  padding: 6px 8px;
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.13);
  font-size: 8px;
  font-weight: 900;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 14px 0;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
}
.stats > div {
  padding: 17px 8px;
  text-align: center;
}
.stats > div + div {
  border-left: 1px solid var(--line);
}
.stats strong,
.stats small {
  display: block;
}
.stats strong {
  font-size: 20px;
}
.stats small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.wallet-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 17px;
  border-radius: 18px;
  color: white;
  background: linear-gradient(135deg, var(--accent), #ff8f57);
  box-shadow: 0 12px 26px rgba(255, 107, 44, 0.2);
}
.wallet-card span,
.wallet-card strong {
  display: block;
}
.wallet-card span {
  color: #fff1e8;
  font-size: 9px;
}
.wallet-card strong {
  margin-top: 3px;
  font-size: 21px;
}
.wallet-card button {
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.16);
  color: white;
  padding: 9px 10px;
  font-size: 9px;
  font-weight: 900;
}
.menu-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
}
.menu-list button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: white;
  padding: 16px;
  color: var(--ink);
  font-size: 11px;
  font-weight: 800;
  text-align: left;
}
.menu-list button:last-child {
  border-bottom: 0;
}
.menu-list button > span {
  width: 27px;
}
.menu-list button b {
  margin-left: auto;
  color: #9ca3af;
  font-size: 18px;
}
.menu-list .danger-row {
  color: #b91c1c;
}

.tracking-list {
  display: grid;
  gap: 10px;
}
.tracking-list > button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  color: var(--ink);
  text-align: left;
  box-shadow: 0 6px 20px rgba(17, 24, 39, 0.035);
}
.tracking-list img {
  width: 74px;
  height: 74px;
  flex: 0 0 auto;
  border-radius: 13px;
  object-fit: cover;
  background: #f3f4f6;
}
.tracking-list > button > div {
  flex: 1;
  min-width: 0;
}
.tracking-list h3 {
  overflow: hidden;
  margin: 0 0 5px;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tracking-list small,
.tracking-list span {
  display: block;
}
.tracking-list small {
  color: var(--muted);
  font-size: 8px;
}
.tracking-list span {
  margin-top: 6px;
  color: var(--ink);
  font-size: 9px;
  font-weight: 800;
}
.status {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 6px 8px;
  font-size: 8px;
}
.status.winning {
  color: #047857;
  background: #ecfdf5;
}
.status.outbid {
  color: #b91c1c;
  background: #fef2f2;
}
.notice-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
}
.notice-list button {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 11px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: white;
  padding: 15px;
  text-align: left;
  color: var(--ink);
}
.notice-list button:last-child {
  border-bottom: 0;
}
.notice-list button > span {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #fff7ed;
}
.notice-list button > div {
  flex: 1;
}
.notice-list strong {
  font-size: 10px;
}
.notice-list p {
  margin: 4px 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.45;
}
.notice-list small {
  color: #9ca3af;
  font-size: 8px;
}
.notice-list b {
  color: #9ca3af;
}
.floating-back {
  position: fixed;
  z-index: 35;
  left: max(16px, calc(50% - 570px));
  bottom: 18px;
  border: 0;
  border-radius: 13px;
  padding: 12px 15px;
  color: white;
  background: var(--ink);
  font-size: 10px;
  font-weight: 900;
  box-shadow: 0 10px 26px rgba(17, 24, 39, 0.2);
}
.empty-state {
  grid-column: 1/-1;
  padding: 70px 20px;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
  background: white;
  text-align: center;
}
.empty-state > span {
  color: #9ca3af;
  font-size: 46px;
}
.empty-state h2 {
  margin: 10px 0 6px;
  font-size: 17px;
}
.empty-state p {
  max-width: 300px;
  margin: auto;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.5;
}

@media (min-width: 760px) {
  .page {
    padding: 32px 40px;
  }
  .topbar {
    padding-inline: 40px;
  }
  .hero {
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: 44px;
  }
  .hero-metric {
    align-self: center;
    justify-self: end;
  }
  .auction-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  .visual {
    height: 205px;
  }
  .card-body h2 {
    font-size: 14px;
  }
  .bottom-nav {
    max-width: 760px;
    left: 50%;
    border: 1px solid var(--line);
    border-bottom: 0;
    border-radius: 22px 22px 0 0;
  }
  .detail-visual {
    min-height: 480px;
  }
  .detail-visual > img {
    height: 480px;
    object-fit: contain;
  }
  .detail-content {
    padding-top: 32px;
  }
}

@media (max-width: 410px) {
  .page {
    padding-inline: 14px;
  }
  .hero {
    padding: 27px 21px;
  }
  .hero-metric {
    display: none;
  }
  .visual {
    height: 150px;
  }
  .card-body {
    padding: 11px;
  }
  .card-body h2 {
    font-size: 12px;
  }
  .price-row strong {
    font-size: 13px;
  }
  .bottom-nav {
    padding-inline: 4px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .profile-level {
    display: none;
  }
}

/* Supabase bağlantı ve kimlik ekranları */
.demo-pill.live {
  color: #047857;
  background: #ecfdf5;
}
.sync-banner {
  position: sticky;
  z-index: 25;
  top: 69px;
  padding: 8px 16px;
  color: #065f46;
  background: #d1fae5;
  border-bottom: 1px solid #a7f3d0;
  text-align: center;
  font-size: 9px;
  font-weight: 900;
}
.auth-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top right, #fff1e8 0, transparent 42%),
    linear-gradient(145deg, #f8fafc, #eef2f7);
}
.auth-card {
  width: min(100%, 460px);
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 34px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 28px 70px rgba(17, 24, 39, 0.12);
  text-align: center;
}
.auth-card h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: -1px;
}
.auth-card p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.6;
}
.auth-logo {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 19px;
  color: white;
  background: linear-gradient(135deg, var(--accent), #ff8f57);
  font-size: 25px;
  font-weight: 950;
  box-shadow: 0 14px 30px rgba(255, 107, 44, 0.28);
}
.auth-form-card {
  justify-items: stretch;
  text-align: left;
}
.auth-form-card .auth-logo {
  justify-self: center;
}
.auth-form-card > div:first-of-type {
  text-align: center;
}
.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 5px;
  border-radius: 14px;
  background: #f1f5f9;
}
.auth-tabs button {
  border: 0;
  border-radius: 10px;
  padding: 10px;
  color: var(--muted);
  background: transparent;
  font-size: 10px;
  font-weight: 900;
}
.auth-tabs button.active {
  color: var(--ink);
  background: white;
  box-shadow: 0 5px 14px rgba(17, 24, 39, 0.08);
}
.auth-form-card form {
  display: grid;
  gap: 13px;
}
.auth-form-card label {
  display: grid;
  gap: 7px;
  color: var(--ink);
  font-size: 10px;
  font-weight: 900;
}
.auth-form-card input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 13px;
  padding: 14px;
  outline: none;
  color: var(--ink);
  background: white;
}
.auth-form-card input:focus {
  border-color: var(--ink);
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
}
.auth-form-card .primary-button {
  width: 100%;
  margin-top: 4px;
}
.auth-form-card .primary-button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.auth-message {
  padding: 12px;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 9px;
  line-height: 1.55;
}
.auth-footnote {
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
  text-align: center;
}
.auth-footnote code {
  padding: 2px 5px;
  border-radius: 5px;
  background: #f1f5f9;
}
.auth-loader {
  width: 30px;
  height: 30px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: auth-spin 0.8s linear infinite;
}
@keyframes auth-spin {
  to {
    transform: rotate(360deg);
  }
}

/* v3: sipariş, satış merkezi, güvenlik ve destek ekranları */
.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  margin-bottom: 18px;
  padding: 5px;
  border-radius: 15px;
  background: #e9edf3;
}
.segmented button {
  border: 0;
  border-radius: 11px;
  padding: 11px;
  color: var(--muted);
  background: transparent;
  font-size: 10px;
  font-weight: 900;
}
.segmented button.active {
  color: var(--ink);
  background: white;
  box-shadow: 0 5px 16px rgba(17, 24, 39, 0.08);
}
.order-list {
  display: grid;
  gap: 14px;
}
.order-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: white;
  box-shadow: 0 10px 28px rgba(17, 24, 39, 0.055);
}
.order-main {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 13px;
  border: 0;
  background: white;
  padding: 13px;
  color: var(--ink);
  text-align: left;
}
.order-main img {
  width: 82px;
  height: 82px;
  flex: 0 0 auto;
  border-radius: 14px;
  object-fit: cover;
  background: #f3f4f6;
}
.order-main > div {
  flex: 1;
  min-width: 0;
}
.order-main h3 {
  overflow: hidden;
  margin: 5px 0 4px;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-main small {
  display: block;
  color: var(--muted);
  font-size: 8px;
}
.order-main strong {
  display: block;
  margin-top: 7px;
  font-size: 14px;
}
.order-main > b {
  color: #9ca3af;
  font-size: 20px;
}
.order-status {
  display: inline-flex;
  border-radius: 999px;
  padding: 5px 8px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 8px;
  font-weight: 900;
}
.order-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 13px 10px 14px;
  border-top: 1px solid var(--line);
  background: #fafbfc;
}
.order-steps > div {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 5px;
  color: #9ca3af;
}
.order-steps > div:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 12px;
  left: calc(50% + 14px);
  width: calc(100% - 28px);
  height: 2px;
  background: #dfe3ea;
}
.order-steps span {
  position: relative;
  z-index: 1;
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border: 2px solid #d1d5db;
  border-radius: 999px;
  background: white;
  font-size: 8px;
  font-weight: 900;
}
.order-steps small {
  font-size: 7px;
  font-weight: 800;
}
.order-steps .done,
.order-steps .current {
  color: var(--green);
}
.order-steps .done span {
  border-color: var(--green);
  color: white;
  background: var(--green);
}
.order-steps .current span {
  border-color: var(--green);
  color: var(--green);
}
.order-steps .done:not(:last-child)::after {
  background: var(--green);
}
.tracking-code {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  border-top: 1px dashed var(--line);
  color: var(--muted);
  background: #fff;
  font-size: 8px;
}
.tracking-code strong {
  color: var(--ink);
  letter-spacing: 0.4px;
}
.order-action {
  width: calc(100% - 26px);
  margin: 0 13px 13px;
  border: 0;
  border-radius: 12px;
  padding: 12px;
  color: white;
  background: var(--ink);
  font-size: 10px;
  font-weight: 900;
}
.live-note {
  display: block;
  padding: 0 14px 13px;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
}

.seller-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 15px;
  padding: 24px;
  border-radius: 24px;
  color: white;
  background:
    radial-gradient(
      circle at 80% 15%,
      rgba(255, 255, 255, 0.13),
      transparent 26%
    ),
    linear-gradient(135deg, #111827, #263043);
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.14);
}
.seller-hero span {
  color: #ffb28c;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1.5px;
}
.seller-hero h1 {
  margin: 7px 0 5px;
  font-size: 27px;
  letter-spacing: -1px;
}
.seller-hero p {
  max-width: 420px;
  margin: 0;
  color: #cbd5e1;
  font-size: 9px;
  line-height: 1.5;
}
.seller-hero button {
  flex: 0 0 auto;
  border: 0;
  border-radius: 12px;
  padding: 11px 13px;
  color: white;
  background: var(--accent);
  font-size: 9px;
  font-weight: 900;
}
.seller-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-bottom: 14px;
}
.seller-metrics > div {
  min-width: 0;
  padding: 15px 12px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  box-shadow: 0 7px 20px rgba(17, 24, 39, 0.035);
}
.seller-metrics span,
.seller-metrics strong,
.seller-metrics small {
  display: block;
}
.seller-metrics span {
  color: var(--muted);
  font-size: 8px;
}
.seller-metrics strong {
  overflow: hidden;
  margin: 5px 0 4px;
  font-size: 18px;
  letter-spacing: -0.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.seller-metrics small {
  color: var(--green);
  font-size: 7px;
  line-height: 1.4;
}
.insight-card {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 22px;
  padding: 14px;
  border: 1px solid #fed7aa;
  border-radius: 16px;
  background: #fff7ed;
}
.insight-card > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 11px;
  background: white;
}
.insight-card strong {
  font-size: 10px;
}
.insight-card p {
  margin: 4px 0 0;
  color: #9a3412;
  font-size: 8px;
  line-height: 1.5;
}

.security-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
  padding: 22px;
  border-radius: 22px;
  color: white;
  background: linear-gradient(135deg, #111827, #293448);
}
.security-score span,
.security-score strong,
.security-score small {
  display: block;
}
.security-score span {
  color: #cbd5e1;
  font-size: 9px;
}
.security-score strong {
  margin: 4px 0;
  font-size: 31px;
}
.security-score small {
  color: #a7f3d0;
  font-size: 8px;
}
.score-ring {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 7px solid rgba(255, 255, 255, 0.17);
  border-top-color: #6ee7b7;
  border-right-color: #6ee7b7;
  border-radius: 999px;
  font-size: 17px;
  font-weight: 900;
}
.security-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
}
.security-list article {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 15px;
  border-bottom: 1px solid var(--line);
}
.security-list article:last-child {
  border-bottom: 0;
}
.security-list article > span {
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 11px;
  color: #047857;
  background: #ecfdf5;
  font-size: 10px;
  font-weight: 900;
}
.security-list article > div {
  flex: 1;
}
.security-list strong {
  font-size: 10px;
}
.security-list p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.4;
}
.security-list b {
  color: var(--green);
  font-size: 8px;
}
.protection-card {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid #bbf7d0;
  border-radius: 18px;
  background: #f0fdf4;
}
.protection-card > span {
  font-size: 24px;
}
.protection-card strong {
  font-size: 11px;
}
.protection-card p {
  margin: 5px 0 0;
  color: #166534;
  font-size: 8px;
  line-height: 1.5;
}

.support-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-bottom: 17px;
}
.support-actions button {
  display: grid;
  justify-items: center;
  gap: 4px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  padding: 16px 8px;
  color: var(--ink);
  box-shadow: 0 7px 20px rgba(17, 24, 39, 0.035);
}
.support-actions span {
  font-size: 23px;
}
.support-actions strong {
  font-size: 9px;
}
.support-actions small {
  color: var(--muted);
  font-size: 7px;
}
.faq-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
}
.faq-list > button {
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: white;
  padding: 15px;
  color: var(--ink);
  text-align: left;
}
.faq-list > button:last-child {
  border-bottom: 0;
}
.faq-list > button > div {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}
.faq-list strong {
  font-size: 10px;
}
.faq-list span {
  color: var(--accent);
  font-size: 16px;
}
.faq-list p {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.55;
}
.faq-list button.open {
  background: #fffaf7;
}
.support-banner {
  margin-top: 15px;
  padding: 18px;
  border-radius: 19px;
  color: white;
  background: linear-gradient(135deg, #7f1d1d, #b91c1c);
}
.support-banner strong {
  font-size: 12px;
}
.support-banner p {
  margin: 6px 0 13px;
  color: #fecaca;
  font-size: 8px;
  line-height: 1.5;
}
.support-banner button {
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 11px;
  padding: 9px 11px;
  color: white;
  background: rgba(255, 255, 255, 0.12);
  font-size: 8px;
  font-weight: 900;
}

@media (min-width: 760px) {
  .order-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .seller-metrics {
    gap: 14px;
  }
  .seller-metrics > div {
    padding: 20px;
  }
  .seller-metrics strong {
    font-size: 24px;
  }
}

@media (max-width: 520px) {
  .seller-hero {
    align-items: flex-start;
    flex-direction: column;
  }
  .seller-metrics {
    grid-template-columns: 1fr;
  }
  .support-actions {
    grid-template-columns: 1fr 1fr;
  }
  .support-actions button:last-child {
    grid-column: 1/-1;
  }
}

/* AçıkPazar v4 */
.toolbar {
  grid-template-columns: 1fr auto auto;
}
.filter-button {
  min-height: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid var(--line);
  border-radius: 13px;
  padding: 0 12px;
  color: var(--ink);
  background: white;
  font-size: 9px;
  font-weight: 900;
}
.filter-button.active {
  border-color: #fed7aa;
  color: #c2410c;
  background: #fff7ed;
}
.filter-button b {
  min-width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: white;
  background: var(--accent);
  font-size: 7px;
}
.filter-panel {
  margin: 10px 0 14px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.055);
}
.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 13px;
}
.filter-head strong,
.filter-head small {
  display: block;
}
.filter-head strong {
  font-size: 11px;
}
.filter-head small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.filter-head button {
  border: 0;
  color: #c2410c;
  background: transparent;
  font-size: 8px;
  font-weight: 900;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}
.filter-grid label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 8px;
  font-weight: 800;
}
.filter-grid input,
.filter-grid select {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 11px;
  color: var(--ink);
  background: #fafbfc;
  outline: 0;
  font-size: 9px;
}
.filter-grid input:focus,
.filter-grid select:focus {
  border-color: var(--ink);
  background: white;
}

.seller-link {
  width: 100%;
  border-inline: 0;
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}
.seller-link:hover {
  background: #fafbfc;
}

.seller-profile-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  padding: 22px;
  border-radius: 23px;
  color: white;
  background:
    radial-gradient(
      circle at 85% 10%,
      rgba(255, 255, 255, 0.12),
      transparent 28%
    ),
    linear-gradient(135deg, #111827, #2f3a4f);
}
.seller-avatar-large {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 20px;
  color: white;
  background: var(--accent);
  font-size: 22px;
  font-weight: 950;
}
.seller-profile-head > div:nth-child(2) {
  flex: 1;
}
.seller-profile-head h1 {
  margin: 4px 0;
  font-size: 23px;
  letter-spacing: -0.8px;
}
.seller-profile-head p {
  margin: 0;
  color: #cbd5e1;
  font-size: 8px;
}
.seller-profile-head > button {
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 11px;
  padding: 10px 11px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  font-size: 8px;
  font-weight: 900;
}
.verified-line {
  color: #a7f3d0;
  font-size: 8px;
  font-weight: 900;
}
.seller-score-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-bottom: 11px;
}
.seller-score-grid > div {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  text-align: center;
}
.seller-score-grid strong,
.seller-score-grid span,
.seller-score-grid small {
  display: block;
}
.seller-score-grid strong {
  font-size: 22px;
}
.seller-score-grid span {
  margin: 4px 0 3px;
  color: #f59e0b;
  font-size: 9px;
  font-weight: 900;
}
.seller-score-grid small {
  color: var(--muted);
  font-size: 7px;
}
.seller-guarantees {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 22px;
}
.seller-guarantees span {
  border: 1px solid #d1fae5;
  border-radius: 999px;
  padding: 7px 9px;
  color: #047857;
  background: #ecfdf5;
  font-size: 8px;
  font-weight: 800;
}
.review-heading {
  margin-top: 25px;
}
.review-list {
  display: grid;
  gap: 10px;
  padding-bottom: 24px;
}
.review-list article {
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  box-shadow: 0 7px 20px rgba(17, 24, 39, 0.035);
}
.review-list article > div {
  display: flex;
  align-items: center;
  gap: 10px;
}
.review-list article > div > div {
  flex: 1;
}
.review-list strong,
.review-list small {
  display: block;
}
.review-list strong {
  font-size: 10px;
}
.review-list small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 7px;
}
.review-list b {
  color: #f59e0b;
  font-size: 10px;
  letter-spacing: 1px;
}
.review-list p {
  margin: 11px 0 0;
  color: #4b5563;
  font-size: 9px;
  line-height: 1.55;
}
.review-avatar {
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 11px;
  color: white;
  background: var(--ink);
  font-size: 10px;
  font-weight: 900;
}

.admin-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 14px;
  padding: 25px;
  border-radius: 24px;
  color: white;
  background:
    radial-gradient(
      circle at 85% 20%,
      rgba(249, 115, 22, 0.24),
      transparent 25%
    ),
    linear-gradient(135deg, #0f172a, #1f2937);
}
.admin-hero span {
  color: #fdba74;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: 1.5px;
}
.admin-hero h1 {
  margin: 7px 0 5px;
  font-size: 27px;
  letter-spacing: -1px;
}
.admin-hero p {
  margin: 0;
  color: #cbd5e1;
  font-size: 9px;
}
.admin-hero > b {
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  padding: 7px 9px;
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.12);
  font-size: 8px;
}
.admin-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
  margin-bottom: 16px;
}
.admin-metrics article {
  min-width: 0;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
}
.admin-metrics span,
.admin-metrics strong,
.admin-metrics small {
  display: block;
}
.admin-metrics span {
  color: var(--muted);
  font-size: 8px;
}
.admin-metrics strong {
  overflow: hidden;
  margin: 5px 0 4px;
  font-size: 20px;
  letter-spacing: -0.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-metrics small {
  color: #047857;
  font-size: 7px;
}
.admin-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(220px, 0.7fr);
  gap: 14px;
  align-items: start;
}
.moderation-list {
  display: grid;
  gap: 10px;
}
.moderation-list > article {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
  box-shadow: 0 7px 20px rgba(17, 24, 39, 0.035);
}
.moderation-main {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 0;
  background: white;
  padding: 11px;
  color: var(--ink);
  text-align: left;
}
.moderation-main img {
  width: 68px;
  height: 68px;
  flex: 0 0 auto;
  border-radius: 12px;
  object-fit: cover;
  background: #f3f4f6;
}
.moderation-main > div {
  flex: 1;
  min-width: 0;
}
.moderation-main span,
.moderation-main small {
  color: var(--muted);
  font-size: 7px;
}
.moderation-main h3 {
  overflow: hidden;
  margin: 5px 0;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.moderation-main > b {
  color: #9ca3af;
  font-size: 18px;
}
.moderation-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 11px 10px;
}
.moderation-flags span {
  border-radius: 999px;
  padding: 5px 7px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 7px;
  font-weight: 800;
}
.moderation-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px 11px 11px;
  border-top: 1px solid var(--line);
  background: #fafbfc;
}
.moderation-actions button {
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 9px;
  color: #b91c1c;
  background: white;
  font-size: 8px;
  font-weight: 900;
}
.moderation-actions button:last-child {
  border-color: #bbf7d0;
  color: #047857;
  background: #f0fdf4;
}
.risk-card {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 15px;
  border: 1px solid #bbf7d0;
  border-radius: 17px;
  background: #f0fdf4;
}
.risk-card > span {
  font-size: 23px;
}
.risk-card strong {
  font-size: 10px;
}
.risk-card p {
  margin: 4px 0 0;
  color: #166534;
  font-size: 8px;
  line-height: 1.45;
}
.admin-feed {
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
}
.admin-feed > strong {
  display: block;
  margin-bottom: 10px;
  font-size: 10px;
}
.admin-feed p {
  display: flex;
  gap: 7px;
  margin: 8px 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.4;
}
.admin-feed p span {
  color: var(--green);
  font-weight: 900;
}
.admin-feed p:nth-last-child(-n + 2) span {
  color: #f59e0b;
}

@media (max-width: 760px) {
  .toolbar {
    grid-template-columns: 1fr auto;
  }
  .sort-select {
    grid-column: 1/-1;
  }
  .filter-grid {
    grid-template-columns: 1fr 1fr;
  }
  .admin-metrics {
    grid-template-columns: 1fr 1fr;
  }
  .admin-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .seller-profile-head {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .seller-profile-head > button {
    width: 100%;
  }
  .seller-score-grid {
    grid-template-columns: 1fr;
  }
  .filter-grid {
    grid-template-columns: 1fr;
  }
  .admin-hero {
    align-items: flex-start;
    flex-direction: column;
  }
  .admin-metrics {
    grid-template-columns: 1fr;
  }
}

/* AçıkPazar v5 */
.detail-timer.extension {
  background: linear-gradient(135deg, #b45309, #f97316);
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.32);
}
.extension-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  padding: 12px 13px;
  border: 1px solid #fed7aa;
  border-radius: 15px;
  color: #9a3412;
  background: #fff7ed;
}
.extension-alert > span {
  font-size: 20px;
}
.extension-alert > div {
  flex: 1;
}
.extension-alert strong,
.extension-alert small {
  display: block;
}
.extension-alert strong {
  font-size: 9px;
}
.extension-alert small {
  margin-top: 3px;
  color: #c2410c;
  font-size: 7px;
  line-height: 1.4;
}
.extension-alert > b {
  border-radius: 999px;
  padding: 6px 8px;
  color: white;
  background: #f97316;
  font-size: 7px;
  white-space: nowrap;
}

.auto-bid-card {
  margin-top: 17px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: linear-gradient(145deg, #fff, #f8fafc);
  box-shadow: 0 9px 24px rgba(17, 24, 39, 0.045);
}
.auto-bid-card.active {
  border-color: #fde68a;
  background: linear-gradient(145deg, #fffbeb, #fff);
}
.auto-bid-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.auto-bid-head > span {
  width: 37px;
  height: 37px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 12px;
  color: #92400e;
  background: #fef3c7;
  font-size: 18px;
}
.auto-bid-head > div {
  flex: 1;
}
.auto-bid-head strong,
.auto-bid-head small {
  display: block;
}
.auto-bid-head strong {
  font-size: 11px;
}
.auto-bid-head small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 7px;
  line-height: 1.4;
}
.auto-bid-head > b {
  border-radius: 999px;
  padding: 6px 8px;
  color: #92400e;
  background: #fde68a;
  font-size: 7px;
  letter-spacing: 0.6px;
}
.auto-bid-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}
.auto-bid-form > button,
.auto-bid-active button {
  border: 0;
  border-radius: 12px;
  padding: 0 13px;
  color: white;
  background: #111827;
  font-size: 8px;
  font-weight: 900;
}
.auto-bid-form > button:disabled {
  background: #9ca3af;
}
.auto-bid-active {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(254, 243, 199, 0.62);
}
.auto-bid-active small,
.auto-bid-active strong {
  display: block;
}
.auto-bid-active small {
  color: #92400e;
  font-size: 7px;
}
.auto-bid-active strong {
  margin-top: 3px;
  font-size: 17px;
}
.auto-bid-active button {
  min-height: 36px;
}
.auto-bid-card > small {
  display: block;
  margin-top: 9px;
  color: var(--muted);
  font-size: 7px;
}
.simulation-button {
  width: 100%;
  margin-top: 8px;
  border: 1px dashed #f59e0b;
  border-radius: 11px;
  padding: 9px;
  color: #92400e;
  background: #fffbeb;
  font-size: 8px;
  font-weight: 900;
}

.bid-center-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-bottom: 13px;
}
.bid-center-metrics > div {
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: white;
}
.bid-center-metrics span,
.bid-center-metrics strong {
  display: block;
}
.bid-center-metrics span {
  color: var(--muted);
  font-size: 7px;
}
.bid-center-metrics strong {
  margin-top: 5px;
  font-size: 20px;
}
.bid-tabs {
  grid-template-columns: repeat(3, 1fr);
}
.bid-tabs button {
  padding-inline: 7px;
  font-size: 8px;
}
.auto-bid-chip {
  display: inline-flex;
  width: fit-content;
  margin-top: 5px;
  border-radius: 999px;
  padding: 4px 6px;
  color: #92400e;
  background: #fef3c7;
  font-size: 7px;
  font-style: normal;
  font-weight: 900;
}

@media (max-width: 520px) {
  .auto-bid-form {
    grid-template-columns: 1fr;
  }
  .auto-bid-form > button {
    min-height: 42px;
  }
  .bid-center-metrics {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
  }
  .bid-center-metrics > div {
    padding: 11px 8px;
    text-align: center;
  }
  .bid-center-metrics span {
    min-height: 20px;
  }
  .bid-tabs {
    overflow-x: auto;
    grid-template-columns: repeat(3, minmax(118px, 1fr));
  }
}

/* v6: güvenli mesajlaşma, ödeme ve ayrıntılı kargo akışı */
.contact-seller {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 15px;
  padding: 13px 14px;
  border: 1px solid #fed7aa;
  border-radius: 16px;
  color: var(--ink);
  background: #fff7ed;
  text-align: left;
}
.contact-seller > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: white;
}
.contact-seller > div {
  flex: 1;
}
.contact-seller strong,
.contact-seller small {
  display: block;
}
.contact-seller strong {
  font-size: 10px;
}
.contact-seller small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.45;
}
.contact-seller > b {
  font-size: 18px;
}
.menu-badge {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: white;
  background: var(--accent);
  font-size: 8px;
  font-style: normal;
}
.menu-list button .menu-badge + b {
  margin-left: 0;
}
.order-secondary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 11px 13px 0;
  border-top: 1px solid var(--line);
}
.order-secondary-actions button {
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 10px;
  color: var(--ink);
  background: white;
  font-size: 9px;
  font-weight: 900;
}
.messages-page {
  max-width: 1180px;
}
.message-layout {
  min-height: 590px;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: white;
  box-shadow: 0 14px 38px rgba(17, 24, 39, 0.06);
}
.conversation-list {
  overflow-y: auto;
  border-right: 1px solid var(--line);
  background: #fbfcfd;
}
.conversation-list > button {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 11px;
  border: 0;
  border-bottom: 1px solid var(--line);
  padding: 14px;
  color: var(--ink);
  background: transparent;
  text-align: left;
}
.conversation-list > button.active {
  background: #fff7ed;
}
.conversation-avatar {
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: white;
  background: linear-gradient(135deg, var(--accent), #ff9b69);
  font-size: 12px;
  font-weight: 950;
}
.conversation-list > button > div {
  min-width: 0;
  flex: 1;
}
.conversation-list strong,
.conversation-list small,
.conversation-list p {
  display: block;
}
.conversation-list strong {
  font-size: 10px;
}
.conversation-list small {
  overflow: hidden;
  margin-top: 2px;
  color: var(--muted);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conversation-list p {
  overflow: hidden;
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conversation-list > button > b {
  min-width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: white;
  background: var(--accent);
  font-size: 8px;
}
.chat-panel {
  min-width: 0;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
}
.chat-panel > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 18px;
  border-bottom: 1px solid var(--line);
}
.chat-panel > header strong,
.chat-panel > header small {
  display: block;
}
.chat-panel > header strong {
  font-size: 12px;
}
.chat-panel > header small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.chat-panel > header button {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 8px 10px;
  color: var(--ink);
  background: white;
  font-size: 8px;
  font-weight: 900;
}
.chat-safety {
  padding: 9px 15px;
  color: #065f46;
  background: #ecfdf5;
  border-bottom: 1px solid #a7f3d0;
  font-size: 8px;
  font-weight: 800;
}
.chat-messages {
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 20px;
  background: #f8fafc;
}
.chat-messages article {
  max-width: 72%;
  align-self: flex-start;
}
.chat-messages article.mine {
  align-self: flex-end;
  text-align: right;
}
.chat-messages article > div {
  padding: 11px 13px;
  border: 1px solid var(--line);
  border-radius: 15px 15px 15px 4px;
  color: var(--ink);
  background: white;
  font-size: 9px;
  line-height: 1.55;
  text-align: left;
}
.chat-messages article.mine > div {
  border-color: #fed7aa;
  border-radius: 15px 15px 4px 15px;
  background: #fff7ed;
}
.chat-messages article small {
  display: block;
  margin-top: 4px;
  color: #9ca3af;
  font-size: 7px;
}
.chat-compose {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 9px;
  padding: 13px;
  border-top: 1px solid var(--line);
  background: white;
}
.chat-compose input {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px;
  outline: none;
}
.chat-compose input:focus {
  border-color: var(--accent);
}
.chat-compose button {
  border: 0;
  border-radius: 12px;
  padding: 0 18px;
  color: white;
  background: var(--accent);
  font-size: 9px;
  font-weight: 900;
}
.checkout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 18px;
  align-items: start;
}
.checkout-product,
.checkout-card,
.payment-summary,
.shipment-hero,
.shipment-timeline,
.shipment-grid > aside {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: white;
  box-shadow: 0 10px 28px rgba(17, 24, 39, 0.045);
}
.checkout-product {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px;
}
.checkout-product img {
  width: 76px;
  height: 76px;
  border-radius: 13px;
  object-fit: cover;
  background: #f3f4f6;
}
.checkout-product > div {
  flex: 1;
  min-width: 0;
}
.checkout-product span,
.checkout-product strong,
.checkout-product small {
  display: block;
}
.checkout-product span {
  color: var(--accent);
  font-size: 8px;
  font-weight: 900;
}
.checkout-product strong {
  overflow: hidden;
  margin: 5px 0;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.checkout-product small {
  color: var(--muted);
  font-size: 8px;
}
.checkout-product > b {
  font-size: 14px;
}
.checkout-card {
  display: grid;
  gap: 10px;
  margin-top: 14px;
  padding: 17px;
}
.checkout-card > strong {
  margin-bottom: 3px;
  font-size: 12px;
}
.checkout-card > label {
  display: flex;
  align-items: center;
  gap: 11px;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
}
.checkout-card > label.selected {
  border-color: #fb923c;
  background: #fff7ed;
}
.checkout-card > label > span {
  font-size: 19px;
}
.checkout-card > label > div {
  flex: 1;
}
.checkout-card b,
.checkout-card small {
  display: block;
}
.checkout-card b {
  font-size: 10px;
}
.checkout-card small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.mock-card-fields {
  display: grid;
  gap: 9px;
  padding: 12px;
  border-radius: 14px;
  background: #f8fafc;
}
.mock-card-fields > div {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}
.mock-card-fields input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 11px;
  background: white;
  font-size: 9px;
}
.checkout-consent {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 13px 3px;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
}
.payment-summary {
  position: sticky;
  top: 88px;
  padding: 18px;
}
.payment-summary > strong {
  display: block;
  margin-bottom: 15px;
  font-size: 13px;
}
.payment-summary > div:not(.payment-hold-info) {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  color: var(--muted);
  font-size: 9px;
}
.payment-summary > div b {
  color: var(--ink);
}
.payment-summary .total {
  margin-top: 4px;
  padding-top: 14px !important;
  border-top: 1px solid var(--line);
  color: var(--ink) !important;
  font-size: 12px !important;
}
.payment-hold-info {
  display: flex;
  gap: 9px;
  margin: 12px 0;
  padding: 11px;
  border-radius: 12px;
  color: #065f46;
  background: #ecfdf5;
  font-size: 8px;
  line-height: 1.5;
}
.payment-hold-info p {
  margin: 0;
}
.payment-summary > button {
  width: 100%;
  border: 0;
  border-radius: 13px;
  padding: 13px;
  color: white;
  background: var(--accent);
  font-size: 10px;
  font-weight: 950;
}
.payment-summary > button:disabled {
  opacity: 0.45;
}
.shipment-hero {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  padding: 15px;
}
.shipment-hero img {
  width: 86px;
  height: 86px;
  border-radius: 15px;
  object-fit: cover;
}
.shipment-hero span {
  color: var(--accent);
  font-size: 8px;
  font-weight: 900;
}
.shipment-hero h2 {
  margin: 5px 0;
  font-size: 15px;
}
.shipment-hero p {
  margin: 0;
  color: var(--muted);
  font-size: 8px;
}
.shipment-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 16px;
  align-items: start;
}
.shipment-timeline {
  padding: 18px;
}
.shipment-timeline article {
  position: relative;
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  min-height: 100px;
}
.shipment-timeline article:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 16px;
  top: 35px;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}
.shipment-timeline article.done:not(:last-child)::after {
  background: #10b981;
}
.shipment-timeline article > span {
  z-index: 1;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #9ca3af;
  background: #f3f4f6;
  font-size: 9px;
  font-weight: 900;
}
.shipment-timeline article.done > span {
  color: white;
  background: #10b981;
}
.shipment-timeline article.current > span {
  color: white;
  background: var(--accent);
  box-shadow: 0 0 0 5px #fff1e8;
}
.shipment-timeline strong {
  font-size: 11px;
}
.shipment-timeline p {
  margin: 5px 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
}
.shipment-timeline button {
  border: 0;
  padding: 0;
  color: var(--accent);
  background: transparent;
  font-size: 8px;
  font-weight: 900;
}
.shipment-grid > aside {
  display: grid;
  gap: 10px;
  padding: 16px;
}
.shipment-address {
  padding-bottom: 13px;
  border-bottom: 1px solid var(--line);
}
.shipment-address strong {
  font-size: 11px;
}
.shipment-address p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.45;
}
.message-order-button,
.shipment-primary,
.dispute-button {
  width: 100%;
  border-radius: 12px;
  padding: 12px;
  font-size: 9px;
  font-weight: 900;
}
.message-order-button {
  border: 1px solid var(--line);
  color: var(--ink);
  background: white;
}
.shipment-primary {
  border: 0;
  color: white;
  background: var(--accent);
}
.dispute-button {
  border: 1px solid #fecaca;
  color: #b91c1c;
  background: #fef2f2;
}
@media (max-width: 760px) {
  .message-layout {
    min-height: auto;
    grid-template-columns: 1fr;
  }
  .conversation-list {
    max-height: 260px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .chat-panel {
    min-height: 500px;
  }
  .checkout-grid,
  .shipment-grid {
    grid-template-columns: 1fr;
  }
  .payment-summary {
    position: static;
  }
}

/* v7 — cüzdan, doğrulama ve güvenli işlem merkezi */
.screen-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.screen-title-row > button {
  border: 1px solid var(--line);
  border-radius: 11px;
  background: white;
  padding: 9px 11px;
  color: var(--ink);
  font-size: 9px;
  font-weight: 900;
}
.screen-title-row > button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}
.notice-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 14px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  overflow: hidden;
}
.notice-summary > div {
  padding: 14px 8px;
  text-align: center;
}
.notice-summary > div + div {
  border-left: 1px solid var(--line);
}
.notice-summary strong,
.notice-summary span {
  display: block;
}
.notice-summary strong {
  font-size: 19px;
}
.notice-summary span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.notice-list button.unread {
  background: #fffaf7;
}
.notice-list button {
  position: relative;
}
.notice-list button i {
  position: absolute;
  right: 34px;
  top: 17px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
}
.wallet-button {
  width: 100%;
  border: 0;
  text-align: left;
  cursor: pointer;
}
.wallet-button b {
  color: white;
  font-size: 10px;
}
.menu-status {
  margin-left: auto;
  border-radius: 999px;
  padding: 4px 7px;
  color: #047857;
  background: #ecfdf5;
  font-size: 8px;
  font-style: normal;
}
.wallet-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px;
  border-radius: 24px;
  color: white;
  background: linear-gradient(135deg, #111827, #28364d);
  box-shadow: 0 20px 38px rgba(17, 24, 39, 0.14);
}
.wallet-hero::after {
  content: "₺";
  position: absolute;
  right: 55px;
  bottom: -82px;
  color: rgba(255, 255, 255, 0.04);
  font-size: 190px;
  font-weight: 950;
}
.wallet-hero > div,
.wallet-shield {
  position: relative;
  z-index: 1;
}
.wallet-hero span,
.wallet-hero strong,
.wallet-hero small {
  display: block;
}
.wallet-hero > div > span {
  color: #cbd5e1;
  font-size: 10px;
}
.wallet-hero strong {
  margin: 5px 0 4px;
  font-size: 34px;
  letter-spacing: -1.5px;
}
.wallet-hero small {
  color: #a7f3d0;
  font-size: 9px;
}
.wallet-shield {
  width: 50px;
  height: 50px;
  display: grid !important;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 23px;
}
.wallet-live-note {
  margin-top: 12px;
}
.wallet-action-card {
  display: grid;
  gap: 14px;
  margin-top: 14px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: white;
}
.wallet-action-card label {
  display: grid;
  gap: 7px;
  font-size: 10px;
  font-weight: 900;
}
.wallet-quick {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}
.wallet-quick button {
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #f8fafc;
  padding: 10px 4px;
  color: var(--ink);
  font-size: 9px;
  font-weight: 900;
}
.wallet-quick button.active {
  border-color: var(--accent);
  color: var(--accent-dark);
  background: #fff7ed;
}
.wallet-amount {
  height: 53px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 2px solid var(--ink);
  border-radius: 13px;
}
.wallet-amount span {
  font-size: 19px;
  font-weight: 900;
}
.wallet-amount input {
  width: 100%;
  border: 0;
  outline: 0;
  text-align: right;
  font-size: 21px;
  font-weight: 900;
}
.wallet-transactions {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
}
.wallet-transactions article {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px;
  border-bottom: 1px solid var(--line);
}
.wallet-transactions article:last-child {
  border-bottom: 0;
}
.wallet-transactions article > div {
  flex: 1;
  min-width: 0;
}
.wallet-transactions strong,
.wallet-transactions small {
  display: block;
}
.wallet-transactions strong {
  font-size: 10px;
}
.wallet-transactions small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 8px;
}
.wallet-transactions article > b {
  font-size: 10px;
  white-space: nowrap;
}
.wallet-transactions .positive {
  color: #047857;
}
.wallet-transactions .negative {
  color: #b91c1c;
}
.transaction-icon {
  width: 35px;
  height: 35px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 11px;
  font-size: 17px;
  font-weight: 900;
}
.transaction-icon.positive {
  background: #ecfdf5;
}
.transaction-icon.negative {
  background: #fef2f2;
}
.verification-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 21px;
  background: white;
}
.verification-hero span,
.verification-hero strong,
.verification-hero small {
  display: block;
}
.verification-hero span {
  color: var(--muted);
  font-size: 9px;
}
.verification-hero strong {
  margin: 5px 0;
  font-size: 29px;
}
.verification-hero small {
  color: #047857;
  font-size: 9px;
}
.verification-ring {
  --progress: 0deg;
  width: 66px;
  height: 66px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(var(--accent) var(--progress), #e5e7eb 0);
  font-size: 13px;
  font-weight: 900;
  position: relative;
}
.verification-ring::before {
  content: "";
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: white;
}
.verification-ring {
  isolation: isolate;
}
.verification-ring::after {
  content: "%";
  position: relative;
  z-index: 1;
  margin-left: 22px;
  margin-top: 1px;
  font-size: 7px;
}
.verification-ring {
  color: var(--ink);
}
.verification-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}
.verification-list article {
  display: grid;
  grid-template-columns: 43px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
}
.verification-list article > span {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #f3f4f6;
  font-size: 18px;
}
.verification-list article.completed > span {
  color: #047857;
  background: #ecfdf5;
  font-weight: 900;
}
.verification-list article > div small,
.verification-list article > div strong {
  display: block;
}
.verification-list article > div small {
  color: var(--accent-dark);
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 0.5px;
}
.verification-list article > div strong {
  margin-top: 2px;
  font-size: 11px;
}
.verification-list article p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.45;
}
.verification-list article button {
  border: 0;
  border-radius: 10px;
  background: var(--ink);
  color: white;
  padding: 9px 10px;
  font-size: 8px;
  font-weight: 900;
}
.verification-list article button:disabled {
  color: #047857;
  background: #ecfdf5;
}
.verification-note {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #eff6ff;
}
.verification-note p {
  margin: 0;
  color: #1e3a8a;
  font-size: 8px;
  line-height: 1.55;
}
.trust-grid {
  display: grid;
  gap: 14px;
}
.risk-calculator,
.trust-score-card {
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: white;
}
.risk-calculator-head {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 15px;
}
.risk-calculator-head > span {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #fff7ed;
}
.risk-calculator-head strong,
.risk-calculator-head small {
  display: block;
}
.risk-calculator-head strong {
  font-size: 12px;
}
.risk-calculator-head small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.risk-calculator label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 8px;
  font-weight: 900;
}
.risk-input {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.risk-input input {
  width: 100%;
  border: 0;
  outline: 0;
  text-align: right;
  font-weight: 900;
}
.risk-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
}
.risk-result > div {
  display: flex;
  align-items: flex-start;
  gap: 9px;
}
.risk-result strong {
  font-size: 10px;
}
.risk-result p {
  margin: 3px 0 0;
  font-size: 8px;
  line-height: 1.45;
}
.risk-result > b {
  font-size: 9px;
  white-space: nowrap;
}
.risk-result.high {
  color: #991b1b;
  background: #fef2f2;
}
.risk-result.medium {
  color: #92400e;
  background: #fffbeb;
}
.risk-result.low {
  color: #065f46;
  background: #ecfdf5;
}
.trust-score-card {
  color: white;
  background: linear-gradient(145deg, #111827, #263043);
}
.trust-score-card > span {
  color: #cbd5e1;
  font-size: 9px;
}
.trust-score-card > strong {
  display: block;
  margin: 7px 0 15px;
  font-size: 31px;
}
.trust-score-card p {
  margin: 8px 0;
  color: #e5e7eb;
  font-size: 9px;
}
.trust-score-card p b {
  display: inline-grid;
  width: 17px;
  height: 17px;
  margin-right: 4px;
  place-items: center;
  border-radius: 6px;
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.13);
}
.red-flag-grid {
  display: grid;
  gap: 10px;
}
.red-flag-grid article {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
}
.red-flag-grid article > span {
  font-size: 22px;
}
.red-flag-grid strong {
  display: block;
  margin-top: 10px;
  font-size: 11px;
}
.red-flag-grid p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
}

@media (min-width: 760px) {
  .trust-grid {
    grid-template-columns: minmax(0, 1.55fr) minmax(260px, 0.75fr);
  }
  .red-flag-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .wallet-action-card {
    max-width: 700px;
  }
}

@media (max-width: 600px) {
  .screen-title-row {
    display: block;
  }
  .screen-title-row > button {
    margin: -8px 0 14px;
  }
  .wallet-quick {
    grid-template-columns: repeat(2, 1fr);
  }
  .verification-list article {
    grid-template-columns: 43px 1fr;
  }
  .verification-list article button {
    grid-column: 1/-1;
  }
  .risk-result {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* v8 — takip, uyarı ve kupon sistemi */
.menu-badge.neutral {
  color: #7c2d12;
  background: #ffedd5;
}
.watch-tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 13px 0;
}
.watch-tools > button,
.price-alert-tool {
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  padding: 14px;
}
.watch-tools > button {
  display: grid;
  grid-template-columns: 38px 1fr auto;
  align-items: center;
  gap: 10px;
  text-align: left;
  cursor: pointer;
}
.watch-tools > button > span,
.price-alert-tool > div:first-child > span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #fff7ed;
  font-size: 17px;
}
.watch-tools > button strong,
.watch-tools > button small,
.price-alert-tool strong,
.price-alert-tool small {
  display: block;
}
.watch-tools > button strong,
.price-alert-tool strong {
  font-size: 10px;
}
.watch-tools > button small,
.price-alert-tool small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.watch-tools > button > b {
  color: var(--accent-dark);
  font-size: 15px;
}
.watch-tools > button.active {
  border-color: #fb923c;
  background: #fffaf7;
}
.price-alert-tool > div:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
}
.price-alert-tool > div:last-child {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 7px;
  margin-top: 11px;
}
.price-alert-tool input {
  min-width: 0;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0 10px;
  font-size: 10px;
  font-weight: 900;
  outline: 0;
}
.price-alert-tool button {
  border: 0;
  border-radius: 10px;
  background: var(--ink);
  color: white;
  padding: 0 13px;
  font-size: 9px;
  font-weight: 900;
}
.seller-profile-head > button.following {
  border-color: #fed7aa;
  color: #9a3412;
  background: #fff7ed;
}
.followed-seller-list,
.reminder-list,
.coupon-list {
  display: grid;
  gap: 12px;
}
.followed-seller-list > article {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: white;
}
.followed-seller-head {
  width: 100%;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 11px;
  border: 0;
  background: white;
  padding: 15px;
  text-align: left;
  cursor: pointer;
}
.followed-seller-head > span {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: white;
  background: var(--ink);
  font-size: 16px;
  font-weight: 900;
}
.followed-seller-head strong,
.followed-seller-head small {
  display: block;
}
.followed-seller-head strong {
  font-size: 12px;
}
.followed-seller-head small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 8px;
}
.followed-auctions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 0 15px 15px;
}
.followed-auctions button {
  overflow: hidden;
  display: grid;
  grid-template-columns: 52px 1fr;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #f8fafc;
  padding: 7px;
  text-align: left;
}
.followed-auctions img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 9px;
  background: white;
}
.followed-auctions strong,
.followed-auctions small {
  display: block;
}
.followed-auctions strong {
  font-size: 8px;
  line-height: 1.35;
}
.followed-auctions small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 7px;
}
.followed-auctions > p {
  grid-column: 1/-1;
  margin: 0;
  padding: 10px;
  color: var(--muted);
  font-size: 8px;
  text-align: center;
}
.reminder-list article {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
}
.reminder-main {
  width: 100%;
  display: grid;
  grid-template-columns: 58px 1fr auto;
  align-items: center;
  gap: 11px;
  border: 0;
  background: white;
  padding: 13px;
  text-align: left;
  cursor: pointer;
}
.reminder-main img {
  width: 58px;
  height: 58px;
  object-fit: contain;
  border-radius: 12px;
  background: #f8fafc;
}
.reminder-main span,
.reminder-main strong,
.reminder-main small {
  display: block;
}
.reminder-main span {
  color: var(--accent-dark);
  font-size: 8px;
  font-weight: 900;
}
.reminder-main strong {
  margin-top: 4px;
  font-size: 11px;
}
.reminder-main small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 8px;
}
.reminder-main > b {
  border-radius: 999px;
  padding: 5px 8px;
  color: #047857;
  background: #ecfdf5;
  font-size: 8px;
}
.remove-reminder {
  width: 100%;
  border: 0;
  border-top: 1px solid var(--line);
  background: #fff;
  padding: 10px;
  color: #b91c1c;
  font-size: 8px;
  font-weight: 900;
}
.coupon-list article {
  position: relative;
  display: grid;
  grid-template-columns: 46px 1fr auto;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid #fed7aa;
  border-radius: 18px;
  background: linear-gradient(135deg, #fff7ed, #fff);
}
.coupon-list article.disabled {
  filter: grayscale(0.65);
  opacity: 0.62;
}
.coupon-cut {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border: 1px dashed #fb923c;
  border-radius: 14px;
  color: #9a3412;
  background: white;
  font-size: 18px;
  font-weight: 950;
}
.coupon-list span,
.coupon-list strong,
.coupon-list small {
  display: block;
}
.coupon-list span {
  color: #9a3412;
  font-size: 9px;
  font-weight: 950;
  letter-spacing: 0.7px;
}
.coupon-list strong {
  margin-top: 4px;
  font-size: 11px;
}
.coupon-list small {
  margin-top: 5px;
  color: var(--muted);
  font-size: 8px;
}
.coupon-list article > b {
  border-radius: 999px;
  padding: 6px 8px;
  color: #9a3412;
  background: #ffedd5;
  font-size: 8px;
}
.coupon-info {
  display: flex;
  gap: 11px;
  margin-top: 14px;
  padding: 15px;
  border: 1px solid #dbeafe;
  border-radius: 15px;
  background: #eff6ff;
}
.coupon-info > span {
  font-size: 20px;
}
.coupon-info strong {
  font-size: 10px;
}
.coupon-info p {
  margin: 4px 0 0;
  color: #1e3a8a;
  font-size: 8px;
  line-height: 1.5;
}
.coupon-entry {
  margin-top: 12px;
  padding: 15px;
  border: 1px dashed #fdba74;
  border-radius: 15px;
  background: #fffaf7;
}
.coupon-entry > div:first-child strong,
.coupon-entry > div:first-child small {
  display: block;
}
.coupon-entry > div:first-child strong {
  font-size: 10px;
}
.coupon-entry > div:first-child small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.coupon-entry > div:nth-child(2) {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 7px;
  margin-top: 10px;
}
.coupon-entry input {
  min-width: 0;
  height: 42px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0 11px;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 900;
  outline: 0;
}
.coupon-entry button {
  border: 0;
  border-radius: 10px;
  background: var(--ink);
  color: white;
  padding: 0 13px;
  font-size: 9px;
  font-weight: 900;
}
.coupon-entry p {
  margin: 8px 0 0;
  color: #b91c1c;
  font-size: 8px;
}
.coupon-entry > span {
  display: block;
  margin-top: 8px;
  color: #047857;
  font-size: 8px;
  font-weight: 900;
}
.payment-summary .discount-line {
  color: #047857;
}
.payment-summary .discount-line b {
  color: #047857;
}

@media (max-width: 700px) {
  .watch-tools {
    grid-template-columns: 1fr;
  }
  .followed-auctions {
    grid-template-columns: 1fr;
  }
  .coupon-list article {
    grid-template-columns: 46px 1fr;
  }
  .coupon-list article > b {
    grid-column: 2;
    justify-self: start;
  }
}

/* AçıkPazar v9 — sonuç, itiraz ve değerlendirme merkezi */
.result-summary-grid,
.review-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.result-summary-grid article,
.review-summary-grid article {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: linear-gradient(145deg, #fff, #f8fafc);
}
.result-summary-grid span,
.result-summary-grid strong,
.result-summary-grid small,
.review-summary-grid span,
.review-summary-grid strong,
.review-summary-grid small {
  display: block;
}
.result-summary-grid span,
.review-summary-grid span {
  color: var(--muted);
  font-size: 8px;
  font-weight: 850;
}
.result-summary-grid strong,
.review-summary-grid strong {
  margin-top: 6px;
  font-size: 22px;
  letter-spacing: -0.8px;
}
.result-summary-grid small,
.review-summary-grid small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 7px;
}
.auction-result-list,
.dispute-list,
.reviewable-list {
  display: grid;
  gap: 11px;
}
.auction-result-list > article,
.dispute-list > article,
.reviewable-list > article {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;
}
.result-product {
  width: 100%;
  display: grid;
  grid-template-columns: 72px 1fr auto;
  align-items: center;
  gap: 12px;
  border: 0;
  background: white;
  padding: 13px;
  text-align: left;
  cursor: pointer;
}
.result-product img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 13px;
  background: #f8fafc;
}
.result-product span,
.result-product strong,
.result-product small {
  display: block;
}
.result-product span {
  color: #0f766e;
  font-size: 7px;
  font-weight: 950;
  letter-spacing: 0.6px;
}
.result-product strong {
  margin-top: 5px;
  font-size: 11px;
}
.result-product small {
  margin-top: 5px;
  color: var(--muted);
  font-size: 8px;
}
.result-product > b {
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 7px;
  white-space: nowrap;
}
.result-product > b.success {
  color: #047857;
  background: #ecfdf5;
}
.result-product > b.warning {
  color: #9a3412;
  background: #fff7ed;
}
.result-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 13px;
  border-top: 1px solid var(--line);
  background: #f8fafc;
}
.result-meta span {
  color: var(--muted);
  font-size: 7px;
  font-weight: 750;
}
.result-meta button {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: var(--accent-dark);
  font-size: 8px;
  font-weight: 900;
  cursor: pointer;
}
.dispute-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(210px, 0.55fr);
  gap: 13px;
  margin-bottom: 18px;
}
.dispute-form-card,
.dispute-rules {
  border: 1px solid var(--line);
  border-radius: 19px;
  background: white;
  padding: 17px;
}
.dispute-form-card > span {
  color: #b45309;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: 0.8px;
}
.dispute-form-card h2 {
  margin: 7px 0 13px;
  font-size: 17px;
}
.dispute-form-card label {
  display: block;
  margin-top: 10px;
  color: var(--ink);
  font-size: 8px;
  font-weight: 850;
}
.dispute-form-card select,
.dispute-form-card textarea {
  width: 100%;
  margin-top: 6px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: #fbfdff;
  padding: 11px;
  color: var(--ink);
  font: inherit;
  outline: 0;
}
.dispute-form-card textarea {
  min-height: 88px;
  resize: vertical;
}
.dispute-form-card > p {
  margin: 11px 0 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.55;
}
.dispute-rules {
  background: linear-gradient(145deg, #0f172a, #1e293b);
  color: white;
}
.dispute-rules strong,
.dispute-rules b {
  display: block;
}
.dispute-rules strong {
  color: #cbd5e1;
  font-size: 9px;
}
.dispute-rules b {
  margin-top: 8px;
  font-size: 28px;
}
.dispute-rules p,
.dispute-rules li {
  color: #cbd5e1;
  font-size: 8px;
  line-height: 1.55;
}
.dispute-rules ul {
  list-style: none;
  padding: 0;
  margin: 15px 0 0;
}
.dispute-rules li {
  margin-top: 7px;
}
.dispute-list > article {
  padding: 15px;
}
.dispute-head,
.dispute-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.dispute-status {
  border-radius: 999px;
  padding: 5px 8px;
  font-size: 7px;
  font-weight: 950;
}
.dispute-status.open {
  color: #b45309;
  background: #fff7ed;
}
.dispute-status.reviewing {
  color: #1d4ed8;
  background: #eff6ff;
}
.dispute-status.resolved_buyer,
.dispute-status.resolved_seller {
  color: #047857;
  background: #ecfdf5;
}
.dispute-head small {
  color: var(--muted);
  font-size: 7px;
}
.dispute-list article > strong,
.dispute-list article > h3 {
  display: block;
}
.dispute-list article > strong {
  margin-top: 12px;
  font-size: 11px;
}
.dispute-list article > h3 {
  margin: 6px 0 0;
  font-size: 9px;
}
.dispute-list article > p {
  margin: 7px 0 13px;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.55;
}
.dispute-actions > span {
  font-size: 11px;
  font-weight: 950;
}
.dispute-actions > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}
.dispute-actions button {
  border: 1px solid var(--line);
  border-radius: 9px;
  background: white;
  padding: 7px 9px;
  color: var(--ink);
  font-size: 7px;
  font-weight: 850;
  cursor: pointer;
}
.reviewable-list > article {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 14px;
  padding: 14px;
}
.reviewable-list img {
  width: 110px;
  height: 110px;
  object-fit: contain;
  border-radius: 15px;
  background: #f8fafc;
}
.reviewable-list span,
.reviewable-list strong,
.reviewable-list small {
  display: block;
}
.reviewable-list span {
  color: #047857;
  font-size: 7px;
  font-weight: 950;
  letter-spacing: 0.7px;
}
.reviewable-list strong {
  margin-top: 5px;
  font-size: 12px;
}
.reviewable-list small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 8px;
}
.star-picker {
  display: flex;
  gap: 3px;
  margin: 9px 0;
}
.star-picker button {
  border: 0;
  background: transparent;
  padding: 0;
  color: #cbd5e1;
  font-size: 21px;
  cursor: pointer;
}
.star-picker button.active {
  color: #f59e0b;
}
.reviewable-list textarea {
  width: 100%;
  min-height: 66px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px;
  font: inherit;
  resize: vertical;
  outline: 0;
}
.reviewable-list .primary-button {
  width: auto;
  margin-top: 8px;
  padding: 10px 13px;
}

@media (max-width: 700px) {
  .result-summary-grid,
  .review-summary-grid,
  .dispute-layout {
    grid-template-columns: 1fr;
  }
  .result-product {
    grid-template-columns: 62px 1fr;
  }
  .result-product img {
    width: 62px;
    height: 62px;
  }
  .result-product > b {
    grid-column: 2;
    justify-self: start;
  }
  .result-meta button {
    width: 100%;
    margin-left: 0;
    text-align: left;
  }
  .reviewable-list > article {
    grid-template-columns: 74px 1fr;
  }
  .reviewable-list img {
    width: 74px;
    height: 74px;
  }
  .dispute-actions {
    align-items: flex-start;
    flex-direction: column;
  }
  .dispute-actions > div {
    justify-content: flex-start;
  }
}
