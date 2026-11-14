const botaoGerar = document.querySelector(".botao-gerar")
const botaoRefinar = document.querySelector(".botao-refinar")
const botaoLimpar = document.querySelector(".botao-limpar")
const botaoCopiar = document.querySelector(".botao-copiar")
const caixaTexto = document.querySelector(".caixa-texto")
const areaMensagem = document.querySelector(".mensagem")
const blocoCodigo = document.querySelector(".bloco-codigo")
const resultadoCodigo = document.querySelector(".resultado-codigo")


const endereco = "https://spring-cake-ba34.henry-nunes-205.workers.dev/"

const TEXTO_BOTAO_GERAR = "Gerar Código ✌️"
const TEXTO_BOTAO_REFINAR = "Refinar ✨"
const TEXTO_BOTAO_COPIAR = "Copiar"
const PLACEHOLDER_INICIAL = "Digite aqui"
const PLACEHOLDER_REFINAR = "Peça um ajuste e clique em Refinar, ou descreva outro componente e clique em Gerar Código"

let ultimoCodigo = null

async function buscarCodigo(descricao, codigoAnterior) {
    let resposta
    try {
        resposta = await fetch(endereco, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descricao: descricao, codigoAnterior: codigoAnterior })
        })
    } catch {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua internet e tente de novo.")
    }

    let dados
    try {
        dados = await resposta.json()
    } catch {
        throw new Error("O servidor devolveu uma resposta inesperada. Tente de novo em instantes.")
    }

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro inesperado ao gerar o código.")
    }

    return dados.codigo
}
function limparResposta(texto) {
    return texto
        .replace(/^```[a-z]*\s*/i, "")
        .replace(/\s*```$/, "")
        .trim()
}
function extrairCodigo(respostaBruta) {
    const texto = limparResposta(respostaBruta)

    if (/^ERRO:/i.test(texto)) {
        throw new Error(texto.replace(/^ERRO:\s*/i, "") || "Não consegui gerar esse pedido.")
    }

    if (!texto.includes("<")) {
        throw new Error("A IA não devolveu um código válido. Tente reformular o pedido.")
    }

    return texto
}

function mostrarResultado(codigo) {
    ultimoCodigo = codigo
    blocoCodigo.textContent = codigo
    resultadoCodigo.srcdoc = codigo
    botaoCopiar.disabled = false
}

function mostrarErro(mensagem) {
    areaMensagem.textContent = mensagem
    areaMensagem.hidden = false
}

function esconderMensagem() {
    areaMensagem.textContent = ""
    areaMensagem.hidden = true
}
function definirCarregando(carregando, botaoClicado, texto) {
    botaoGerar.disabled = carregando
    botaoLimpar.disabled = carregando
    botaoRefinar.disabled = carregando || !ultimoCodigo
    botaoClicado.classList.toggle("carregando", carregando)
    botaoClicado.textContent = texto
}
async function solicitarGeracao(codigoAnterior) {
    const descricao = caixaTexto.value.trim()

    if (!descricao) {
        mostrarErro("Escreva uma descrição antes de continuar.")
        caixaTexto.focus()
        return
    }

    const refinando = Boolean(codigoAnterior)
    const botaoClicado = refinando ? botaoRefinar : botaoGerar
    const textoOriginal = refinando ? TEXTO_BOTAO_REFINAR : TEXTO_BOTAO_GERAR
    const textoCarregando = refinando ? "Refinando..." : "Gerando..."

    esconderMensagem()
    definirCarregando(true, botaoClicado, textoCarregando)

    try {
        const codigoBruto = await buscarCodigo(descricao, codigoAnterior)
        mostrarResultado(extrairCodigo(codigoBruto))
        caixaTexto.value = ""
        caixaTexto.placeholder = PLACEHOLDER_REFINAR
        caixaTexto.focus()
    } catch (erro) {
        mostrarErro(erro.message)
    } finally {
        definirCarregando(false, botaoClicado, textoOriginal)
    }
}

function gerarCodigo() {
    return solicitarGeracao(null)
}

function refinarCodigo() {
    if (!ultimoCodigo) return
    return solicitarGeracao(ultimoCodigo)
}

async function copiarCodigo() {
    try {
        await navigator.clipboard.writeText(blocoCodigo.textContent)
        botaoCopiar.textContent = "Copiado!"
    } catch {
        botaoCopiar.textContent = "Não foi possível copiar"
    }

    setTimeout(() => {
        botaoCopiar.textContent = TEXTO_BOTAO_COPIAR
    }, 2000)
}

function limparTudo() {
    ultimoCodigo = null
    caixaTexto.value = ""
    caixaTexto.placeholder = PLACEHOLDER_INICIAL
    blocoCodigo.textContent = ""
    resultadoCodigo.srcdoc = ""
    botaoCopiar.disabled = true
    botaoRefinar.disabled = true
    esconderMensagem()
    caixaTexto.focus()
}

botaoGerar.addEventListener("click", gerarCodigo)
botaoRefinar.addEventListener("click", refinarCodigo)
botaoLimpar.addEventListener("click", limparTudo)
botaoCopiar.addEventListener("click", copiarCodigo)