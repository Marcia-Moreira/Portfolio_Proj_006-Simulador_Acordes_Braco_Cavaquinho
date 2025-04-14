// ==========================================
// CONTROLE DE TELA/ORIENTAÇÃO (VERSÃO UNIVERSAL)
// ==========================================
class ScreenFreezer {
    constructor() {
        this.isFrozen = false;
        this.supportsOrientationLock = false; // Adicionamos esta flag
        this.freezeButton = this.createFreezeButton();
        this.checkCapabilities(); // Verifica recursos do dispositivo
    }

    // Verifica o que o dispositivo suporta
    checkCapabilities() {
        this.supportsOrientationLock = !!screen.orientation?.lock;
        console.log(`Dispositivo ${this.supportsOrientationLock ? 'suporta' : 'NÃO suporta'} orientation.lock()`);
    }

    createFreezeButton() {
        const button = document.createElement('button');
        button.textContent = "🔒 Congelar Tela";
        button.style.cssText = `
            position: fixed;
            left: 10px;
            top: 10px;
            z-index: 1000;
            padding: 8px 12px;
            font-size: 14px;
            background-color: #b57129;
            color:rgb(172, 168, 168);
            border: 2px solid #53320f;
            border-radius: 4px;
            cursor: pointer;
        `;
        document.body.appendChild(button);
        return button;
    }

    toggleFreeze() {
        this.isFrozen = !this.isFrozen;

        // Método universal que funciona em qualquer dispositivo:
        this.applyUniversalLock();

        // Atualização visual
        this.updateButtonState();
    }

    // SOLUÇÃO QUE FUNCIONA EM TODOS OS DISPOSITIVOS
    applyUniversalLock() {
        // 1. Bloqueio de viewport (sempre funciona)
        const meta = document.querySelector('meta[name="viewport"]') || 
                    document.createElement('meta');
        meta.name = "viewport";
        meta.content = this.isFrozen
            ? "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            : "width=device-width, initial-scale=1.0";
        
        if (!document.querySelector('meta[name="viewport"]')) {
            document.head.appendChild(meta);
        }

        // 2. Bloqueio CSS (funciona mesmo em desktop)
        document.body.style.overflow = this.isFrozen ? "hidden" : "auto";
        document.documentElement.style.touchAction = this.isFrozen ? "none" : "auto";

        // 3. Tenta bloquear orientação (apenas em mobile)
        if (this.supportsOrientationLock && this.isFrozen) {
            screen.orientation.lock("portrait")
                .catch(e => console.log("Bloqueio de rotação ignorado em desktop"));
        }
    }

    updateButtonState() {
        this.freezeButton.textContent = this.isFrozen ? "🔓 Liberar" : "🔒 Travar";
        this.freezeButton.style.backgroundColor = this.isFrozen ? " #b57129" : "rgb(135, 84, 30)";
        
        // Tooltip explicativo
        this.freezeButton.title = this.isFrozen 
            ? "Modo travado (scroll e zoom desativados)" 
            : "Modo normal";
    }

    init() {
        this.freezeButton.addEventListener('click', () => this.toggleFreeze());
    }
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    new ScreenFreezer().init();
});