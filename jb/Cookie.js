// ==UserScript==
// @name         Cookie 注入器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  粘贴什么就写入什么，不校验、不解析、不废话
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    const isMobile = window.innerWidth < 768;

    // ---------- 悬浮按钮 ----------
    const floatBtn = document.createElement('div');
    floatBtn.textContent = 'Cookie';
    floatBtn.style.cssText = `
        position: fixed;
        bottom: ${isMobile ? '70px' : '80px'};
        right: ${isMobile ? '10px' : '16px'};
        padding: ${isMobile ? '6px 12px' : '8px 16px'};
        background: #1e1e1e;
        color: #fff;
        font-size: ${isMobile ? '12px' : '14px'};
        font-weight: 600;
        font-family: sans-serif;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        z-index: 99999;
        cursor: pointer;
        user-select: none;
        border: 1px solid #555;
        letter-spacing: 0.3px;
    `;
    document.body.appendChild(floatBtn);

    // ---------- 面板 ----------
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        bottom: ${isMobile ? '120px' : '140px'};
        right: ${isMobile ? '10px' : '16px'};
        left: ${isMobile ? '10px' : 'auto'};
        width: ${isMobile ? 'calc(100% - 20px)' : '400px'};
        max-height: ${isMobile ? '60vh' : 'auto'};
        background: #1e1e1e;
        color: #e0e0e0;
        padding: ${isMobile ? '12px' : '16px'};
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.7);
        z-index: 99998;
        font-family: sans-serif;
        font-size: 13px;
        display: none;
        flex-direction: column;
        gap: 10px;
        border: 1px solid #333;
    `;
    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <b style="color:#f1c40f;">Cookie 注入器</b>
            <span id="closePanel" style="cursor:pointer;color:#888;font-size:18px;">✕</span>
        </div>
        <textarea id="cookieInput" placeholder="粘贴 Cookie 字符串，例如：&#10;key1=value1; key2=value2" style="width:100%;height:80px;background:#2d2d2d;color:#fff;border:1px solid #444;border-radius:6px;padding:8px;font-size:13px;resize:vertical;font-family:monospace;"></textarea>
        <div style="display:flex;gap:8px;">
            <button id="injectBtn" style="flex:2;background:#2ecc71;color:#000;border:none;border-radius:6px;padding:8px;cursor:pointer;font-weight:bold;">写入</button>
            <button id="clearBtn" style="flex:1;background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:8px;cursor:pointer;">清除</button>
        </div>
        <div id="statusMsg" style="font-size:12px;color:#888;min-height:18px;"></div>
    `;
    document.body.appendChild(panel);

    let visible = false;

    floatBtn.onclick = () => {
        visible = !visible;
        panel.style.display = visible ? 'flex' : 'none';
    };

    document.getElementById('closePanel').onclick = () => {
        panel.style.display = 'none';
        visible = false;
    };

    // ---------- 注入 ----------
    document.getElementById('injectBtn').onclick = () => {
        const raw = document.getElementById('cookieInput').value;
        if (!raw.trim()) {
            document.getElementById('statusMsg').textContent = '⚠️ 请粘贴内容';
            return;
        }
        document.cookie = raw;
        document.getElementById('statusMsg').textContent = '✅ 已写入';
    };

    // ---------- 清除 ----------
    document.getElementById('clearBtn').onclick = () => {
        const cookies = document.cookie.split(';');
        let count = 0;
        for (const cookie of cookies) {
            const eq = cookie.indexOf('=');
            const key = eq === -1 ? cookie.trim() : cookie.slice(0, eq).trim();
            if (key) {
                document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                count++;
            }
        }
        document.getElementById('statusMsg').textContent = `🗑️ 已清除 ${count} 个 Cookie`;
    };
})();