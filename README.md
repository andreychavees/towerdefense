# Gatos vs Minhoca

Jogo de defesa de torres em HTML5 Canvas com arte cartoon chibi original: gatos, classes, inimigos segmentados, cenário de floresta e interface ilustrada.

- Arraste os gatos para espaços livres de grama.
- Una dois gatos iguais para evoluir. No nível 5, escolha Evolução ou Mutação.
- Quebre os potes de vidro para resgatar novos gatos. Eles saltam do jarro até uma posição aleatória livre na grama e permanecem onde pousaram; não andam sozinhos.
- Gatos têm animações de espera, ataque, arraste e pouso. Acertos provocam reação, brilho e números de dano; potes se quebram em fragmentos da própria imagem; fusões têm um efeito de evolução.
- Use os controles **Pausar** e **Ritmo** para interromper a partida ou alternar entre 1×, 2× e 3×.

## Executar

Requer Node.js. Não há dependências npm ou etapa de build.

```bash
node server.js
```

O servidor escuta em todas as interfaces na porta 8765. Para usar outra porta, execute `PORT=3000 node server.js`. O processo deve continuar ativo enquanto você joga. A disponibilidade de uma prévia embutida depende da interface do ambiente.

Para gerar um arquivo que abre diretamente no navegador, sem servidor:

```bash
python scripts/build-standalone.py
```

Abra `dist/gatos-vs-minhoca-jogar.html`. Todas as imagens e o código de animação ficam incorporados no arquivo.

## Verificar

```bash
node --test tests/game.test.cjs
```

Os seis testes exercitam a lógica real do jogo: destinos válidos e exclusivos, quebra e salto de resgate, permanência na posição, lotação do tabuleiro, pausa e retomada, feedback de dano e limpeza ao reiniciar.

## Arte e renderização

O jogo carrega oito imagens locais em `assets/art/`, sem serviços externos:

| Arquivo | Conteúdo |
| --- | --- |
| `gatos-chibi.png` | Quatro gatos iniciais, atlas 2 × 2 |
| `herois-chibi.png` | Dez classes e duas evoluções, atlas 4 × 3 |
| `inimigos-chibi.png` | Cabeças e segmentos de minhoca, cobra, lacraia e dragão, atlas 4 × 2 |
| `cenario-chibi.png` | Vegetação, pedras, cristais, caverna, portal, pote e itens, atlas 4 × 3 |
| `armas-chibi.png` | Armas e projéteis mágicos, atlas 4 × 2 |
| `floresta-chibi.png` | Mapa pintado com o trajeto da partida |
| `gato-animacoes.png` | Doze poses de espera, deslocamento e ataque do gatinho, atlas 4 × 3 |
| `hud-bosque.png` | Placas, pergaminho e ícones da interface, atlas 4 × 2 |

As imagens foram geradas para este projeto. Os atlas de sprites têm transparência; o carregador recorta as margens sem remover cores dos personagens. As variantes de gelo, lava, veneno e sombra usam filtros sobre a arte dos inimigos. A partida só começa após o carregamento completo; falhas mostram uma mensagem para recarregar a página.

O tabuleiro mantém a proporção 9:16 e se ajusta à largura e altura disponíveis, incluindo telas na horizontal. As coordenadas de toque e arraste são convertidas para o espaço do jogo.

`gatos-vs-minhoca.html` contém o jogo, `motion.js` implementa animações e efeitos e `server.js` serve os arquivos. Os demais scripts antigos são utilitários históricos de alteração do HTML; não são carregados pela aplicação nem necessários para executá-la.
