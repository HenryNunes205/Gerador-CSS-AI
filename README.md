# GeradorCSS AI

Aplicação web que transforma uma descrição em linguagem natural em código **HTML e CSS**, mostrando o código gerado e um preview ao vivo. Feita com JavaScript puro e a API da Groq (modelo `openai/gpt-oss-120b`).

<!-- Adicione aqui um GIF curto do funcionamento e o link da demonstração -->

## O que faz

- **Gerar**: descreva um componente ("botão roxo que cresce ao passar o mouse") e receba o código.
- **Refinar**: peça ajustes sobre o resultado atual ("deixe maior e vermelho").
- **Copiar** o código e **Limpar** a tela.

## Como funciona

```mermaid
flowchart LR
    A[Navegador] --> B[Cloudflare Worker] --> C[API da Groq]
```

1. O navegador envia a descrição para um **Worker da Cloudflare**, que guarda a chave da API e o prompt de sistema. A chave nunca fica no front-end nem no repositório.
2. O Worker chama a Groq e devolve o código gerado.
3. O `scripts.js` valida a resposta e mostra o código como texto e o resultado em um `<iframe sandbox>`, que impede a execução de scripts.

Ao refinar, o código anterior vai junto na requisição, como histórico da conversa. O roteiro de testes do prompt está em [`testes-de-prompt.md`](testes-de-prompt.md).

## Como usar

**Só testar:** [abra a demonstração](https://henrynunes205.github.io/Gerador-CSS-AI/). Não precisa instalar nada.

**Rodar a sua própria cópia:** a chave da API não está no código, então você precisa do seu próprio Worker.

1. **Worker:** na Cloudflare, crie um Worker com o conteúdo de `worker.js`. Em *Variables and Secrets*, crie o secret `GROQ_API_KEY` com a sua chave da Groq. Em `ORIGENS_PERMITIDAS`, coloque o endereço onde o site vai rodar. Faça o deploy e copie a URL.
2. **Site:** em `scripts.js`, troque o valor de `endereco` pela URL do Worker.
3. **Abrir:** use o Live Server do VS Code (`http://127.0.0.1:5500`). Abrir o `index.html` direto do disco não funciona, porque o Worker bloqueia a origem.

## Arquivos

- `index.html`, `styles.css`, `scripts.js`: o site
- `worker.js`: o proxy na Cloudflare
- `testes-de-prompt.md`: testes e versões do prompt
