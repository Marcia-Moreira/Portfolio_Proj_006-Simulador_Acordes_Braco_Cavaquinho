// ==========================================
// SISTEMA DE ÁUDIO DO CAVAQUINHO (WEB AUDIO API)
// ==========================================

// ==========================================
class CavaquinhoAudio {
    constructor() {
        this.audioContext = null;
        
        // Afinação profissional (+1 oitava para ficar mais nítido)
        this.frequencias = {
            // Cordas: 4ª(D4), 3ª(G3), 2ª(B3), 1ª(D3) - Notação musical
            '1_1': 587.33, '1_2': 392.00, '1_3': 493.88, '1_4': 293.66, // 1º traste
            '2_1': 622.25, '2_2': 415.30, '2_3': 523.25, '2_4': 311.13, // 2º traste
            '3_1': 659.25, '3_2': 440.00, '3_3': 554.37, '3_4': 329.63, // 3º traste
            '4_1': 698.46, '4_2': 466.16, '4_3': 587.33, '4_4': 349.23, // 4º traste
            '5_1': 739.99, '5_2': 493.88, '5_3': 622.25, '5_4': 369.99, // 5º traste
            '6_1': 783.99, '6_2': 523.25, '6_3': 659.25, '6_4': 392.00,  // 6º traste
        
        // Cordas: D4, G3, B3, D3 (afinação padrão)
            '7_1': 293.66, '7_2': 196.00, '7_3': 246.94, '7_4': 146.83, // 7° 1º traste
            '8_1': 311.13, '8_2': 207.65, '8_3': 261.63, '8_4': 155.56, // 8° 2º traste
            '9_1': 329.63, '9_2': 220.00, '9_3': 277.18, '9_4': 164.81, // 9° 3º traste
            // '4_1': 349.23, '4_2': 233.08, '4_3': 293.66, '4_4': 174.61, // 4º traste
            // '5_1': 369.99, '5_2': 246.94, '5_3': 311.13, '5_4': 185.00, // 5º traste
            // '6_1': 392.00, '6_2': 261.63, '6_3': 329.63, '6_4': 196.00  // 6º traste
        };
    }

    initAudio() {
        // Inicializa o AudioContext apenas quando necessário:
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playNote(frequency) {
        this.initAudio();
        
        // 1. OSCILADOR PRINCIPAL (para o corpo do som)
        const osc = this.audioContext.createOscillator();
        osc.type = "sawtooth"; // Timbre rico em harmônicos
        osc.frequency.value = frequency;
        
        // 2. FILTRO (simula a ressonância do corpo do cavaquinho)
        const filter = this.audioContext.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = frequency * 1.5; // Ponto de ressonância era 3.5
        filter.Q.value = 1.8; // "Q" = qualidade/ressonância
        
        // 3. ENVELOPE (ataque e decay do som)
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.001, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.03); // Ataque rápido (palheta)
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3); // Decay
        
        // Conexão dos módulos: Osc -> Filter -> Gain -> Output:
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        // Inicia e para o som:
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.35);
        
        // 4. RUIDO DE PALHETA (opcional - podemos comentar)
        this.addPickAttack(frequency);
    }

    addPickAttack(freq) {
        // Para criar um ruído branco breve para simular o ataque da palheta:
        const noiseDuration = 0.03;
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Preenche com ruído:
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        
        // Filtro para deixar o ruído mais "agudo":
        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.value = freq * 4;
        
        // Envelope rápido:
        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noiseDuration);
        
        // Conexões:
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);
        
        noise.start();
        noise.stop(this.audioContext.currentTime + noiseDuration);
    }

    handleInteraction(item) {
        // Extrai posição (linha/traste e coluna/corda)
        const linha = item.className.match(/l([1-9])/)?.[1];
        const coluna = item.className.match(/c([1-4])/)?.[1];
        
        if (linha && coluna) {
            const frequency = this.frequencias[`${linha}_${coluna}`];
            if (frequency) {
                this.playNote(frequency);
                this.highlightItem(item);
            }
        }
    }

    highlightItem(item) {
        // Feedback visual ao tocar:
        item.style.backgroundColor = "rgba(108, 87, 56, 0.86)";
        item.style.boxShadow = "0 0 18px rgb(132, 84, 12)";
        setTimeout(() => {
            item.style.backgroundColor = "";
            item.style.boxShadow = "";
        }, 300);
    }

    init() {
        // Configura eventos para todas as "casas" do cavaquinho:
        document.querySelectorAll('.item-braco').forEach(item => {
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleInteraction(e.target);
            });
            
            item.addEventListener('click', () => this.handleInteraction(item));
        });
    }
}

// Inicializa quando o DOM estiver pronto:
document.addEventListener('DOMContentLoaded', () => {
    const audio = new CavaquinhoAudio();
    audio.init();
});