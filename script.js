
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
const URL_GOOGLE_SHEETS = "https://muddy-recipe-ea3e.malukete07.workers.dev/";

/* ========================================
   ELEMENTOS DA PÁGINA
======================================== */

const botaoDiminuir = document.getElementById("diminuir");
const botaoAumentar = document.getElementById("aumentar");
const quantidadeElemento = document.getElementById("quantidade");
const quantidadeResumo = document.getElementById("quantidade");
const valorTotalElemento = document.getElementById("valorTotal");
const campoNome = document.getElementById("nome");
const campoTelefone = document.getElementById("telefone");
const campoPix = document.getElementById("chavePix");
const botaoCopiarPix = document.getElementById("copiarPix");
const mensagemPix = document.getElementById("mensagemPix");
const botaoConcluir = document.getElementById("concluirCompra");
const bordaQuantidade = document.getElementById("bordaQuantidade");


const carregamentoPedido = document.getElementById("carregamentoPedido");


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
 // botaoConcluir.disabled = false;
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



const chavePixDialog = document.getElementById("chavePixDialog");
const copiarPixDialog = document.getElementById("copiarPixDialog");
const mensagemCopiaPixDialog = document.getElementById("mensagemCopiaPixDialog");

// Exibe a mesma chave PIX já utilizada no site.
chavePixDialog.value = CHAVE_PIX;


copiarPixDialog.addEventListener("click", async function () {
  try {
    await navigator.clipboard.writeText(CHAVE_PIX);

    mensagemCopiaPixDialog.textContent =
      "Chave PIX copiada com sucesso!";

  } catch (erro) {
    // Alternativa para navegadores que não permitem a cópia direta.
    chavePixDialog.focus();
    chavePixDialog.select();

    const copiou = document.execCommand("copy");

    mensagemCopiaPixDialog.textContent = copiou
      ? "Chave PIX copiada com sucesso!"
      : "Selecione e copie a chave PIX manualmente.";
  }
});


//alternativa com botao inicio

let urlWhatsAppAlternativo = "";

const avisoFalhaPedido = document.getElementById("avisoFalhaPedido");
const mensagemFalhaPedido = document.getElementById("mensagemFalhaPedido");
const botaoEnviarWhatsApp = document.getElementById("botaoEnviarWhatsApp");


botaoEnviarWhatsApp.addEventListener("click", function () {
  if (urlWhatsAppAlternativo) {
    //atualizarPagina();//atualiza pagina
    window.open(urlWhatsAppAlternativo, "_blank");
    window.location.reload();
  }
});
//alternativa com botao fim


botaoConcluir.addEventListener("click", async function () {
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

  if (!telefone) {
    campoTelefone.setCustomValidity(
      "Por favor, informe seu número de WhatsApp para continuar."
    );
    campoTelefone.reportValidity();
    campoTelefone.focus();
    return;
  }

  campoTelefone.setCustomValidity("");

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
    "📱 *Meu WhatsApp:* " + telefone,
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
    "",
    "_Mensagem gerada automaticamente pelo sistema._"
  ].join("\n");

  const url =
    "https://wa.me/" +
    WHATSAPP_LOJA +
    "?text=" +
    encodeURIComponent(mensagem);
  
  urlWhatsAppAlternativo = url;//alternativa com botao
  avisoFalhaPedido.style.display = "none";//alternativa com botao

  // Prepara os dados do pedido.
  const dados = new URLSearchParams({
    nome: nome,
    telefone: telefone,
    quantidade: String(quantidade),
    valorUnitario: precoUnitario.toFixed(2),
    valorTotal: total.toFixed(2)
  });

  // Impede cliques repetidos durante o envio.
  botaoConcluir.disabled = true;
  botaoDiminuir.disabled = true;
  botaoAumentar.disabled = true;

  carregamentoPedido.classList.add("ativo");
  carregamentoPedido.setAttribute("aria-hidden", "false");
  //esse espaço é local para desabilitar os botoes

  
  try {
    const resposta = await fetch(
      URL_GOOGLE_SHEETS,
      {
        method: "POST",
        body: dados
      }
    );
    //throw new Error("Falha simulada para teste");

    let resultado;

    try {
      resultado = await resposta.json();
    } catch (erro) {
      throw new Error("Resposta inválida do servidor.");
    }

    if (!resposta.ok || resultado.sucesso !== true) {
      throw new Error(
        resultado.erro || "Não foi possível confirmar o pedido."
      );
    }

    // Pedido confirmado pelo Google Apps Script.
    avisoFalhaPedido.style.display = "none";//alternativa com botao
    limparPedido();
    mostrarSucesso();

  } catch (erro) {
  console.error("Falha ao confirmar o pedido:", erro);

  //desativa cores e açoes nos botoes INICIO
  botaoConcluir.style.backgroundColor = "#cccccc";
  botaoConcluir.style.cursor="not-allowed";
  botaoConcluir.style.pointerEvents= "none";
  bordaQuantidade.style.borderColor="#cccccc";
  botaoDiminuir.style.color="#cccccc";
  botaoAumentar.style.color="#cccccc";
  quantidadeElemento.style.color="#cccccc";
  //desativa cores e açoes nos botoes FIM

  mensagemFalhaPedido.textContent =
  "Não conseguimos registrar o seu pedido. " +
  "Por favor envie seu pedido pelo WhatsApp. Clique abaixo.";

  avisoFalhaPedido.style.display = "block";

  avisoFalhaPedido.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  } finally {
    carregamentoPedido.classList.remove("ativo");
    carregamentoPedido.setAttribute("aria-hidden", "true");

    botaoConcluir.disabled = false;
    botaoDiminuir.disabled = false;
    botaoAumentar.disabled = false;
  }

});

/* ========================================
   INICIALIZAÇÃO
======================================== */

campoNome.addEventListener("input", function () {
  this.setCustomValidity("");
});

//para apagar mensagem de digitar telefone
campoTelefone.addEventListener("input", function () {
  this.setCustomValidity("");
});

atualizarPagina();
