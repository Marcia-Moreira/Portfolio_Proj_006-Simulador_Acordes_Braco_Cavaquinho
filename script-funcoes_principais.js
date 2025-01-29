// VERIFICAR:

// Função para Capturar:
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos que representam casas e cordas do cavaquinho:
    const items = document.querySelectorAll('.item-braco');

    // Adiciona um evento de toque a cada elemento:
    items.forEach((item) => {
        item.addEventListener('touchstart', (event) => {
            // Obtenha a classe de linha e coluna do item:
            const linha = item.classList.contains('l1') ? 1 :
                          item.classList.contains('l2') ? 2 :
                          item.classList.contains('l3') ? 3 :
                          item.classList.contains('l4') ? 4 :
                          item.classList.contains('l5') ? 5 : 6;

            const coluna = item.classList.contains('c1') ? 1 :
                           item.classList.contains('c2') ? 2 :
                           item.classList.contains('c3') ? 3 : 4;

            // Reproduz o som associado à linha e coluna:
            tocarSom(linha, coluna);
        });
    });
});

// Mapeamento dos sufixos dos arquivos de som para cada linha e coluna
const audioSufixos = {
    '1_1': 'D2',
    '1_2': 'B1',
    '1_3': 'G1',
    '1_4': 'D1',
    '2_1': 'D2s',
    '2_2': 'C2',
    '2_3': 'G2s',
    '2_4': 'D1s',
    '3_1': 'E2',
    '3_2': 'C2s',
    '3_3': 'A1',
    '3_4': 'E1',
    '4_1': 'F2',
    '4_2': 'D2',
    '4_3': 'A1s',
    '4_4': 'F1',
    '5_1': 'F2s',
    '5_2': 'D2s',
    '5_3': 'B2',
    '5_4': 'F1s',
    '6_1': 'G2',
    '6_2': 'E2',
    '6_3': 'C1',
    '6_4': 'G1',
    // Adicione todas as combinações linha_coluna com seus respectivos sufixos
};

// Função para Reproduzir o Som
function tocarSom(linha, coluna) {
    // Obtenha o sufixo do arquivo usando a linha e a coluna
    const sufixo = audioSufixos[`${linha}_${coluna}`];
    
    if (sufixo) {  // Verifica se o sufixo existe para a combinação linha/coluna
        const audioPath = `./sounds/linha${linha}_corda${coluna}-${sufixo}.wav`;
        const audio = new Audio(audioPath);

        audio.play().catch((error) => {
            console.error("Erro ao tocar o som:", error);
        });
    } else {
        console.warn(`Sufixo não encontrado para linha ${linha}, corda ${coluna}`);
    }
}
