# Marcenaria Moreira V2

Projeto otimizado para publicação na Vercel/GitHub.

## Estrutura
- `index.html` = página principal
- `styles.css` = identidade visual e layout
- `dados.js` = produtos iniciais e número do WhatsApp
- `imagens/` = fotos separadas do HTML

## Publicação
1. Extraia este ZIP.
2. Envie `index.html`, `styles.css`, `dados.js` e a pasta `imagens` para a raiz do repositório GitHub.
3. Mantenha `index.html` na raiz.
4. Se a Vercel já estiver conectada ao GitHub, o novo commit gera uma nova implantação.

## Administração
O botão `Administrar` abre um painel no próprio site. A senha atual do painel é a mesma definida na versão anterior.

**Importante:** esta versão usa `localStorage`. Produtos e acompanhamentos adicionados pelo painel ficam no navegador do aparelho usado para administrar. O backup JSON permite transportar os dados. Para sincronização real entre vários celulares/computadores, a próxima etapa é conectar o painel a um banco de dados e autenticação no servidor.

## Desempenho
As imagens que antes estavam embutidas em Base64 no HTML agora são arquivos WebP separados. O carrossel carrega a foto ativa e o catálogo usa carregamento tardio.
