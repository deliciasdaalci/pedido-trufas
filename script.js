
// WhatsApp da loja, com DDI 55 e DDD.
const WHATSAPP_LOJA = "5511959803995";

// Informe aqui a chave Pix.
const CHAVE_PIX = "11949837634";

// Preços
const PRECO_UNIDADE = 3.00;
const PRECO_PROMOCIONAL = 2.50;

// Quantidade mínima permitida
const QUANTIDADE_MINIMA = 1;

//url do google
const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbzELvWkLgE2j9axlLgtu5aahpGmysEpSMgIdBDljQ-zBeQpbJ0ssh0d38BuIMrEH-Ev/exec";

/* ========================================
   ELEMENTOS DA PÁGINA
======================================== */

const botaoDiminuir = document.getElementById("diminuir");
const botaoAumentar = document.getElementById("aumentar");
const quantidadeElemento = document.getElementById("quantidade");
const quantidadeResumo = document.getElementById("quantidadeResumo");
const valorTotalElemento = document.getElementById("valorTotal");

const campoNome = document.getElementById("nome");
const campoTelefone = document.getElementById("telefone");

const campoPix = document.getElementById("chavePix");
const botaoCopiarPix = document.getElementById("copiarPix");
const mensagemPix = document.getElementById("mensagemPix");

const botaoConcluir = document.getElementById("concluirCompra");

let quantidadeAtual = 1;


/* ========================================
   CÁLCULO DOS PREÇOS
======================================== */

function obterPrecoUnitario() {
  return quantidadeAtual >= 2
    ? PRECO_PROMOCIONAL
    : PRECO_UNIDADE;
}

function obterTotal() {
  return quantidadeAtual * obterPrecoUnitario();
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function atualizarPagina() {
  const total = obterTotal();

  quantidadeElemento.textContent = quantidadeAtual;
  quantidadeResumo.textContent = quantidadeAtual;
  valorTotalElemento.textContent = formatarMoeda(total);

  botaoDiminuir.disabled = quantidadeAtual <= QUANTIDADE_MINIMA;

  botaoDiminuir.setAttribute(
    "aria-disabled",
    quantidadeAtual <= QUANTIDADE_MINIMA ? "true" : "false"
  );
}


/* ========================================
   BOTÕES DE QUANTIDADE
======================================== */

botaoAumentar.addEventListener("click", function () {
  if (quantidadeAtual < 999) {
    quantidadeAtual++;
    atualizarPagina();
  }
});

botaoDiminuir.addEventListener("click", function () {
  if (quantidadeAtual > QUANTIDADE_MINIMA) {
    quantidadeAtual--;
    atualizarPagina();
  }
});


/* ========================================
   CAMPO DE TELEFONE
   Formata números brasileiros.
======================================== */

campoTelefone.addEventListener("input", function () {
  let numeros = this.value.replace(/\D/g, "").slice(0, 11);

  if (numeros.length > 7) {
    numeros = numeros.replace(
      /^(\d{2})(\d{5})(\d{0,4})$/,
      "($1) $2-$3"
    );
  } else if (numeros.length > 2) {
    numeros = numeros.replace(
      /^(\d{2})(\d{0,5})$/,
      "($1) $2"
    );
  } else if (numeros.length > 0) {
    numeros = numeros.replace(
      /^(\d{0,2})$/,
      "($1"
    );
  }

  this.value = numeros;
});

/* ========================================
   COPIAR CHAVE PIX
======================================== */

campoPix.value = CHAVE_PIX;

botaoCopiarPix.addEventListener("click", async function () {
  if (
    !CHAVE_PIX ||
    CHAVE_PIX === "SUA_CHAVE_PIX_AQUI"
  ) {
    mensagemPix.textContent =
      "Configure sua chave Pix antes de utilizar esta função.";
    return;
  }

  try {
    await navigator.clipboard.writeText(CHAVE_PIX);
    mensagemPix.textContent = "Chave Pix copiada com sucesso!";
  } catch (erro) {
    // Alternativa para navegadores sem acesso à área de transferência.
    campoPix.focus();
    campoPix.select();

    try {
      const copiado = document.execCommand("copy");

      mensagemPix.textContent = copiado
        ? "Chave Pix copiada com sucesso!"
        : "Selecione e copie a chave manualmente.";
    } catch (erroCopia) {
      mensagemPix.textContent =
        "Selecione e copie a chave manualmente.";
    }
  }
});

/* ========================================
   CONCLUIR COMPRA PELO WHATSAPP
======================================== */

////evento limpar e mostra mensagem inicio
function limparPedido() {
  // Limpa os dados do cliente
  campoNome.value = "";
  campoTelefone.value = "";

  // Volta a quantidade para 1
  quantidadeAtual = 1;
  atualizarPagina();

  // Limpa mensagens anteriores
  mensagemPix.textContent = "";

  // Atualiza o campo Pix sem apagar a chave configurada
  campoPix.value = CHAVE_PIX;
}

const dialogSucesso = document.getElementById("dialogSucesso");
const fecharDialog = document.getElementById("fecharDialog");

let elementoAnteriorDialog = null;

function mostrarSucesso() {
  elementoAnteriorDialog = document.activeElement;

  dialogSucesso.classList.add("aberto");
  dialogSucesso.setAttribute("aria-hidden", "false");

  fecharDialog.focus();
}

function ocultarDialog() {
  dialogSucesso.classList.remove("aberto");
  dialogSucesso.setAttribute("aria-hidden", "true");

  if (elementoAnteriorDialog) {
    elementoAnteriorDialog.focus();
  }
}

// Fechar pelo botão
fecharDialog.addEventListener("click", ocultarDialog);

// Fechar ao clicar fora do cartão
dialogSucesso.addEventListener("click", function (evento) {
  if (evento.target === dialogSucesso) {
    ocultarDialog();
  }
});

// Fechar com a tecla Escape
document.addEventListener("keydown", function (evento) {
  if (
    evento.key === "Escape" &&
    dialogSucesso.classList.contains("aberto")
  ) {
    ocultarDialog();
  }
});


////evento limpar e mostra mensagem fim
botaoConcluir.addEventListener("click", function () {
  const nome = campoNome.value.trim();
  const telefone = campoTelefone.value.trim();

  if (!nome) {
    campoNome.setCustomValidity(
      "Por favor, informe seu nome para continuar."
    );
    campoNome.reportValidity();
    campoNome.focus();
    return;
  }

  campoNome.setCustomValidity("");

  if (
    !WHATSAPP_LOJA ||
    !/^\d{12,13}$/.test(WHATSAPP_LOJA)
  ) {
    alert(
      "O WhatsApp da loja ainda não foi configurado corretamente."
    );
    return;
  }

  const quantidade = quantidadeAtual;
  const precoUnitario = obterPrecoUnitario();
  const total = obterTotal();

  const nomeSeguro = nome.replace(/\s+/g, " ");

  const mensagem = [
    "Olá! Segue a confirmação do meu pedido de trufas.",
    "",
    "👤 *Nome:* " + nomeSeguro,
    telefone
      ? "📱 *Meu WhatsApp:* " + telefone
      : "",
    "",
    "🍫 *Quantidade:* " + quantidade + " trufa(s)",
    "💰 *Valor unitário:* " + formatarMoeda(precoUnitario),
    "🧾 *Valor total:* " + formatarMoeda(total),
    "",
    quantidade >= 2
      ? "🎉 Desconto promocional aplicado!"
      : "ℹ️ Valor referente a uma unidade.",
    "",
   "💰 *Chave PIX:* " + CHAVE_PIX,
    //"",
    "",
    "_Mensagem gerada automaticamente pelo sistema._"
  ].filter(Boolean).join("\n");

  const url =
    "https://wa.me/" +
    WHATSAPP_LOJA +
    "?text=" +
    encodeURIComponent(mensagem);


  const janela =window.open(url, "_blank");//caso tenha que tirar remover a variavel janela

   // Prepara os dados que serão enviados à planilha.
  const dados = new URLSearchParams({
    nome: nome,
    telefone: telefone,
    quantidade: String(quantidade),
    valorUnitario: precoUnitario.toFixed(2),
    valorTotal: total.toFixed(2)
  });

  // Envia o registro ao Google Sheets.
  // O modo no-cors não permite confirmar a gravação
  // pela resposta do servidor.
  const envioPlanilha = fetch(URL_GOOGLE_SHEETS, {
    method: "POST",
    mode: "no-cors",
    body: dados
  }).catch(function (erro) {
    console.error("Falha ao enviar o pedido à planilha:", erro);
  });

  ////evento limpar e mostra mensagem fim
  if (janela) {
    janela.location.href = url;//acrescentado para envio planilha
    limparPedido();
    mostrarSucesso();
  } else {

    // Se o navegador bloquear a nova aba, aguarda
    // o envio ser tentado antes de redirecionar.
    envioPlanilha.finally(function () {
      window.location.href = url;
    });

  }
  ////evento limpar e mostra mensagem fim

});

/* ========================================
   INICIALIZAÇÃO
======================================== */

campoNome.addEventListener("input", function () {
  this.setCustomValidity("");
});

atualizarPagina();
