/**
 * Dashboard HTML Templates
 *
 * Lightweight HTML templates using Amina's design system.
 * No external dependencies - pure HTML/CSS.
 */

import { aminaDesignSystem } from '../lib/styles';

// Additional dashboard-specific styles
const dashboardStyles = `
${aminaDesignSystem}

body {
  line-height: 1.5;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: var(--space-4);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  background: var(--shadow-gray);
  border-bottom: 1px solid var(--steel-gray);
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--amina-crimson);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 2px solid var(--amina-crimson);
}

.username {
  color: var(--off-white);
  font-weight: 500;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--amina-crimson), var(--blood-red));
  color: var(--pure-white);
  box-shadow: var(--shadow-md), var(--glow-crimson);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--glow-crimson);
}

.btn-discord {
  background: var(--discord-blurple);
  color: var(--pure-white);
}

.btn-discord:hover {
  background: #4752c4;
}

.btn-secondary {
  background: transparent;
  color: var(--electric-blue);
  border-color: var(--electric-blue);
}

.btn-secondary:hover {
  background: var(--electric-blue);
  color: var(--midnight-black);
}

.btn-danger {
  background: var(--blood-red);
  color: var(--pure-white);
}

.btn-danger:hover {
  background: var(--discord-red);
}

.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: 0.75rem;
}

/* Cards */
.card {
  background: var(--shadow-gray);
  border: 1px solid var(--steel-gray);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--pure-white);
  margin-bottom: var(--space-4);
}

/* Forms */
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--off-white);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--midnight-black);
  border: 2px solid var(--steel-gray);
  border-radius: var(--radius-md);
  color: var(--pure-white);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--electric-blue);
}

/* API Key display */
.key-display {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--midnight-black);
  border: 2px solid var(--imperial-gold);
  border-radius: var(--radius-lg);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.key-value {
  flex: 1;
  word-break: break-all;
  color: var(--imperial-gold);
}

.copy-btn {
  padding: var(--space-2) var(--space-3);
  background: var(--steel-gray);
  border: none;
  border-radius: var(--radius-md);
  color: var(--pure-white);
  cursor: pointer;
  transition: background 0.3s ease;
}

.copy-btn:hover {
  background: var(--slate-gray);
}

/* Key List */
.key-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.key-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--midnight-black);
  border: 1px solid var(--steel-gray);
  border-radius: var(--radius-lg);
  transition: border-color 0.3s ease;
}

.key-item:hover {
  border-color: var(--electric-blue);
}

.key-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.key-name {
  font-weight: 600;
  color: var(--pure-white);
}

.key-prefix {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--cyber-blue);
}

.key-meta {
  font-size: 0.75rem;
  color: var(--off-white);
}

.key-actions {
  display: flex;
  gap: var(--space-2);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stat-card {
  background: var(--shadow-gray);
  border: 1px solid var(--steel-gray);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--amina-crimson);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--off-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Alerts */
.alert {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
}

.alert-warning {
  background: rgba(255, 165, 0, 0.2);
  border: 1px solid var(--amber-gold);
  color: var(--amber-gold);
}

.alert-success {
  background: rgba(87, 242, 135, 0.2);
  border: 1px solid var(--discord-green);
  color: var(--discord-green);
}

.alert-error {
  background: rgba(237, 66, 69, 0.2);
  border: 1px solid var(--discord-red);
  color: var(--discord-red);
}

/* Hero */
.hero {
  text-align: center;
  padding: var(--space-8) var(--space-4);
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--amina-crimson);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--off-white);
  max-width: 600px;
  margin: 0 auto var(--space-6);
}

/* Footer */
.footer {
  text-align: center;
  padding: var(--space-6);
  color: var(--off-white);
  font-size: 0.875rem;
  border-top: 1px solid var(--steel-gray);
  margin-top: var(--space-8);
}

/* Utility */
.text-center { text-align: center; }
.text-muted { color: var(--off-white); }
.mt-4 { margin-top: var(--space-4); }
.mb-4 { margin-bottom: var(--space-4); }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }

/* Responsive */
@media (max-width: 768px) {
  .hero-title { font-size: 1.75rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .key-item { flex-direction: column; align-items: flex-start; gap: var(--space-3); }
  .key-actions { width: 100%; }
}
`;

// Base HTML template
function baseTemplate(content: string, title = 'Amina API Dashboard'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="icon" href="https://4mina.app/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rajdhani:wght@500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>${dashboardStyles}</style>
</head>
<body>
  ${content}
</body>
</html>`;
}

// Login page
export function loginPage(error?: string): string {
  return baseTemplate(
    `
    <div class="container">
      <div class="hero">
        <h1 class="hero-title">Amina API</h1>
        <p class="hero-subtitle">
          Access powerful image generation and Discord bot utilities.
          Sign in with Discord to get your API key.
        </p>
        ${error ? `<div class="alert alert-error">${error}</div>` : ''}
        <a href="/dashboard/auth/discord" class="btn btn-discord">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Sign in with Discord
        </a>
      </div>
      
      <div class="card">
        <h2 class="card-title">What can you do with the API?</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">🎴</div>
            <div class="stat-label">Rank Cards</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">👋</div>
            <div class="stat-label">Welcome Cards</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">🎨</div>
            <div class="stat-label">Image Filters</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">😂</div>
            <div class="stat-label">Meme Generators</div>
          </div>
        </div>
      </div>
      
      <footer class="footer">
        <p>© ${new Date().getFullYear()} Amina Bot • <a href="https://docs.4mina.app/api" style="color: var(--electric-blue);">API Documentation</a></p>
      </footer>
    </div>
  `,
    'Amina API - Login'
  );
}

// Dashboard home
export function dashboardPage(
  user: {
    id: string;
    username: string;
    avatar?: string;
  },
  keys: Array<{
    id: string;
    name: string;
    prefix: string;
    usage: { total: number; lastUsed: Date | null };
    createdAt: Date;
    revoked: boolean;
  }>,
  newKey?: string
): string {
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=80`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`;

  const activeKeys = keys.filter((k) => !k.revoked);
  const totalUsage = keys.reduce((sum, k) => sum + k.usage.total, 0);

  return baseTemplate(
    `
    <header class="header">
      <a href="/dashboard" class="logo">Amina API</a>
      <div class="user-info">
        <span class="username">${user.username}</span>
        <img src="${avatarUrl}" alt="Avatar" class="avatar">
        <a href="/dashboard/logout" class="btn btn-secondary btn-sm">Logout</a>
      </div>
    </header>
    
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${activeKeys.length}</div>
          <div class="stat-label">Active Keys</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalUsage.toLocaleString()}</div>
          <div class="stat-label">Total Requests</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">60/min</div>
          <div class="stat-label">Rate Limit</div>
        </div>
      </div>
      
      ${
        newKey
          ? `
        <div class="alert alert-warning">
          <strong>⚠️ Save your API key now!</strong> This is the only time you'll see it.
        </div>
        <div class="key-display">
          <span class="key-value" id="newKey">${newKey}</span>
          <button class="copy-btn" onclick="copyKey()">📋 Copy</button>
        </div>
        <script>
          function copyKey() {
            navigator.clipboard.writeText('${newKey}');
            document.querySelector('.copy-btn').textContent = '✓ Copied!';
            setTimeout(() => document.querySelector('.copy-btn').textContent = '📋 Copy', 2000);
          }
        </script>
      `
          : ''
      }
      
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title" style="margin-bottom: 0;">Your API Keys</h2>
          <form action="/dashboard/keys/create" method="POST" style="display: flex; gap: var(--space-2);">
            <input type="text" name="name" placeholder="Key name" class="form-input" style="width: 200px;" required>
            <button type="submit" class="btn btn-primary btn-sm">+ Create Key</button>
          </form>
        </div>
        
        ${
          activeKeys.length > 0
            ? `
          <div class="key-list">
            ${activeKeys
              .map(
                (key) => `
              <div class="key-item">
                <div class="key-info">
                  <span class="key-name">${key.name}</span>
                  <span class="key-prefix">${key.prefix}...</span>
                  <span class="key-meta">
                    Created ${new Date(key.createdAt).toLocaleDateString()} •
                    ${key.usage.total.toLocaleString()} requests
                    ${key.usage.lastUsed ? ` • Last used ${new Date(key.usage.lastUsed).toLocaleDateString()}` : ''}
                  </span>
                </div>
                <div class="key-actions">
                  <form action="/dashboard/keys/${key.id}/revoke" method="POST" onsubmit="return confirm('Are you sure you want to revoke this key?');">
                    <button type="submit" class="btn btn-danger btn-sm">Revoke</button>
                  </form>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : `
          <p class="text-muted text-center mt-4">
            No API keys yet. Create one to get started!
          </p>
        `
        }
      </div>
      
      <div class="card">
        <h2 class="card-title">Quick Start</h2>
        <pre style="background: var(--midnight-black); padding: var(--space-4); border-radius: var(--radius-lg); overflow-x: auto; font-family: var(--font-mono); font-size: 0.875rem; color: var(--cyber-blue);">
# Generate a rank card
curl "https://api.4mina.app/v1/images/rank-card?username=Player&level=42&xp=1500&requiredXp=2000&rank=7" \\
  -H "Authorization: Bearer YOUR_API_KEY"
        </pre>
      </div>
      
      <footer class="footer">
        <p>
          <a href="https://docs.4mina.app/api" style="color: var(--electric-blue);">Documentation</a> •
          <a href="https://discord.gg/4mina" style="color: var(--discord-blurple);">Discord</a> •
          <a href="https://github.com/iamvikshan/amina" style="color: var(--off-white);">GitHub</a>
        </p>
      </footer>
    </div>
  `,
    'Amina API Dashboard'
  );
}

// Error page
export function errorPage(message: string, title = 'Error'): string {
  return baseTemplate(
    `
    <div class="container">
      <div class="hero">
        <h1 class="hero-title">${title}</h1>
        <p class="hero-subtitle">${message}</p>
        <a href="/dashboard" class="btn btn-primary">Back to Dashboard</a>
      </div>
    </div>
  `,
    `Amina API - ${title}`
  );
}
