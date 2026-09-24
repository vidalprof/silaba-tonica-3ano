/* ============================================================
   ESQUELETO DA FOLHA VIVA — as folhas.

   ⚠️ ESTE ARQUIVO É A CASCA. As folhas (`f01`, `f02`, …) se escrevem abaixo, e
   cada uma nasce de um VERBO impresso numa folha de papel colhida. O crivo —
   comando VERBATIM e veredito de cada uma das trinta — vai em
   `_sequencias/POTE-<assunto>.md`, e é DELE que sai o roteiro.

   ⚠️ A POSIÇÃO É A IDENTIDADE: a folha da posição 7 usa o pote `p7`, grava os
      ids `n7_*` e fala `p7enun`. Não há segunda lista para desencontrar.

   O QUE JÁ VEM PRONTO AQUI (clonar destas peças, não reescrever):
     · `faixa` · `enunciado` · `item` · `fechaItem` · `nomeSecreto`
     · `opcoes` (a fileira de escolhas, com arrastar de brinde)
     · `puxavel` (arrastar com mouse, dedo e caneta — três lições pagas dentro)
     · `gavetas` (classificar em colunas, nas duas portas)
     · `montaLigar` (ligar com linha curva)
     · o teclado (`abreCruz`/`digitaCruz`/`confereCruz`/`rolaParaCruz`)
     · navegação, boletim, relatório do professor, dossiê, retomar 55 min
   ============================================================ */

var livro = document.getElementById("livro"), PAGEL = [], TIRAS = [];
/* ⚠️⚠️ AS FOLHAS DE LIGAR SE DECLARAM AQUI, e o número errado quebra DUAS
   folhas de uma vez — medido no `_rima1`, que estava no ar: a folha que liga
   NUNCA fechava (a criança ligava tudo e continuava faltando) e a folha
   apontada por engano FECHAVA SOZINHA, sem ninguém tocar nela. São as únicas
   cujos ids não nascem de `n<pi>_`, e sim dentro do `montaLigar`
   (`l<pi>g<i>_<chave>`). Conferir com `node _qa/conta_folha.js <pasta>`. */
var LIGAR = [8];
/* a cor da faixa por BLOCO da escada, não por folha: a criança vê que o assunto
   mudou. Uma entrada por folha, de c1 a c5. */
var CORES = ["c1", "c1", "c1", "c1", "c1", "c1", "c2", "c2", "c2", "c2", "c3", "c3", "c3", "c3", "c3", "c3", "c4", "c4", "c4", "c4", "c4", "c4", "c4", "c4", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5"];


/* ============================================================
   AS TABELAS QUE O `boot()` PRECISA, E POR QUE ELAS MORAM AQUI EM CIMA.

   ⚠️⚠️ `function` SOBE INTEIRA; `var X = {...}` SOBE VAZIA. O `boot()` deste
      motor roda no MEIO do arquivo e as folhas se escrevem no FIM — então uma
      tabela declarada lá embaixo ainda vale `undefined` quando a capa se
      desenha e quando a primeira folha se monta. O caderno abre EM BRANCO,
      com um TypeError no console e NENHUM portão de texto vendo nada.
      **Esta é a segunda vez que a casa paga por isto em dois dias** (o
      caderno de sílabas, 23/set). Quem pega é o `node _qa/conta_folha.js`.
   ============================================================ */
/* o nome de cada classe e a regra dela, para a tela e para a voz. Uma fonte
   só: o que aparece no botão é o que o alto-falante diz. */
var NOMEGAV = {k1: "OXÍTONA", k2: "PAROXÍTONA", k3: "PROPAROXÍTONA"};
var DIZGAV = {k1: "a força na última sílaba",
              k2: "a força na penúltima sílaba",
              k3: "a força na antepenúltima sílaba"};
/* as três perguntas da d09, na ordem em que ela as faz */
var PERG7 = {
  q1: {q: "Em qual grupo a força cai sempre na <b>última</b> sílaba?", r: "g1"},
  q2: {q: "E em qual ela cai sempre na <b>penúltima</b> — a segunda de trás para a frente?", r: "g2"},
  q3: {q: "E em qual cai sempre na <b>antepenúltima</b> — a terceira de trás para a frente?", r: "g3"}
};
/* ⚠️ A FILEIRA CERTA SE DECLARA AQUI, e não se deduz na tela: deduzi-la
   exigiria classificar as doze palavras no navegador, e uma delas fora do pote
   faria a folha aceitar a resposta errada em silêncio. */
var QCERTA = {B1: "t1", B2: "t2", B3: "t1", B4: "t1"};
var MEGAF = [
  {s: ["SO", "FÁ"], t: 1},
  {s: ["ME", "NI", "NA"], t: 1},
  {s: ["Ó", "CU", "LOS"], t: 0}
];

function faixa(d, i, titulo){ d.appendChild(el("div", "faixa", '<div class="num">' + i + '</div><h2>' + titulo + '</h2>')); }
function aoAbrir(d, fn){ if(!d._aoAbrir) d._aoAbrir = []; d._aoAbrir.push(fn); }
/* ---------- O ALTO-FALANTE ----------
   Regra da casa: tudo o que a criança PRECISA LER tem que poder ser OUVIDO.
   O desenho do botão é CSS puro: nada de emoji (vira quadradinho nos PCs da
   escola). */
function botaoSom(rot, aoTocar, cls){
  var b = el("button", cls || "som");
  b.innerHTML = '<i class="cone"></i><i class="onda o1"></i><i class="onda o2"></i>';
  b.setAttribute("aria-label", rot || "Ouvir");
  b.onclick = function(ev){ ev.stopPropagation(); sPasso(); aoTocar(); };
  return b;
}
function enunciado(d, pi, texto, chave){
  var cx = el("div", "enunlin");
  cx.appendChild(el("div", "enun", texto));
  cx.appendChild(botaoSom("Ouvir o que a folha pede", function(){ falar(chave); }));
  d.appendChild(cx);
}
function item(n){ return el("div", "item", n ? '<span class="n">' + n + '.</span>' : ""); }
function fechaItem(d, box, id){
  if(ST.resp[id]) box.className = "item feito";
  box.setAttribute("data-qa", "item-" + id);
  d.appendChild(box);
}
/* ⚠️ A RESPOSTA NÃO PODE APARECER ANTES DE A CRIANÇA RESPONDER. A palavra não
   some: fica INVISÍVEL (`visibility`, para o espaço ficar guardado e a folha não
   pular) e aparece no instante do acerto. É o que o `_qa/resposta_impressa.py`
   mede. */
function nomeSecreto(txt, id){
  var b = el("b", "segredo" + (ST.resp[id] ? " revelado" : ""), txt);
  b.setAttribute("data-nome", id);
  return b;
}
/* ⚠️⚠️ O ACENTO TEM DE SUMIR DO MESMO JEITO NOS DOIS LADOS (21/set/2026,
   defeito que chegou à sala: *"as palavras estão sendo ditas erradas"*).
   Quem grava a voz (`gerar_falas.py`, função `ch`) tira o acento por NFKD:
   ã vira A, ç vira C — e arquiva a fala em `pal_aviao`, `pal_laco`.
   Esta função APAGAVA a letra acentuada em vez de trocá-la, então o app pedia
   `pal_avio` e `pal_lao`, que não existem. O `falar()` volta calado quando a
   chave não existe: a criança tocava o alto-falante de AVIÃO, CAMALEÃO,
   CARROÇA, CHORÃO, DOMINÓ, DRAGÃO, LAÇO, LEÃO, POÇO e NÃO OUVIA NADA.
   ⚠️ E JÁ TINHA SIDO CONSERTADO UMA VEZ — no `_aumdim2`, com outro nome
   (`chavePal`) e até com o comentario certo: *"as pontas têm de casar, senão a
   voz procura um mp3 que não existe"*. Consertei num caderno e não levei aos
   outros dezesseis. Defeito medido em código gêmeo se conserta em TODOS os
   lugares na mesma rodada — esta é a segunda vez que a casa paga por isso. */
var SEMACENTO = {"á":"a","à":"a","â":"a","ã":"a","ä":"a","é":"e","è":"e","ê":"e","ë":"e",
  "í":"i","ì":"i","î":"i","ï":"i","ó":"o","ò":"o","ô":"o","õ":"o","ö":"o",
  "ú":"u","ù":"u","û":"u","ü":"u","ç":"c","ñ":"n"};
function chaveQuadro(w){
  return String(w).toLowerCase().replace(/[^a-z]/g, function(c){ return SEMACENTO[c] || ""; });
}

/* ---------- fileira de opções (a peça que mais se repete) ----------
   `soltarEm` (opcional) liga o ARRASTAR: a criança pode puxar a peça até o
   alvo em vez de só tocar nela. AS DUAS PORTAS, SEMPRE — no PC da escola ela
   usa o mouse e arrastar é o gesto natural; no celular, tocar é. */
function opcoes(pai, pi, id, lista, certa, cls, falaCerto, falaDica, aoAcertar, soltarEm){
  registra(id, pi, certa);
  var box = el("div", "ops"), feito = !!ST.resp[id];
  function responde(o, b){
    if(ST.resp[id]) return;
    sPasso(); if(o.fala) falar(o.fala);
    if(o.v === certa){
      b.className = "op" + (cls ? " " + cls : "") + " certa";
      if(aoAcertar) aoAcertar(b);
      setTimeout(function(){ acertou(id, falaCerto); }, aoAcertar ? 620 : 240);
    } else {
      b.className = "op" + (cls ? " " + cls : "") + " erro";
      setTimeout(function(){ b.className = "op" + (cls ? " " + cls : ""); }, 500);
      errou(id, falaDica);
    }
  }
  lista.forEach(function(o){
    var b = el("button", "op" + (cls ? " " + cls : "") + (feito && o.v === certa ? " certa" : ""), o.rot);
    b.setAttribute("data-qa", "op-" + id + "-" + o.v);
    b.setAttribute("aria-label", o.aria || o.v);
    b.onclick = function(){ if(b._arrastou){ b._arrastou = false; return; } responde(o, b); };
    if(soltarEm) puxavel(b, soltarEm, function(){ responde(o, b); });
    /* ⚠️ O ALTO-FALANTE DA RESPOSTA, e ele é DISCRETO e vem ANTES da escolha.
       Pergunta do Marcos (20/set/2026): *"a atividade tem áudio para ajudar os
       que não sabem ler? O alto-falante discreto para clicar caso o estudante
       queira ouvir"*. A resposta era NÃO: a opção tinha `fala`, mas o motor só
       a tocava DEPOIS do clique — ou seja, a criança tinha de ESCOLHER para
       ouvir, e aí já tinha respondido. O portão `1o` media a metade errada
       (cobrava o campo `fala` existir, não a criança poder ouvir antes).
       Quem não lê agora ouve cada resposta quantas vezes quiser e só então
       escolhe — que é a regra da casa de ago/2026, enfim cumprida.
       ⚠️ Botão IRMÃO, nunca dentro do outro: botão dentro de botão é HTML
       inválido e o clique vaza para a resposta. O `botaoSom` já faz
       `stopPropagation`. */
    if(o.fala){
      var w = el("div", "opw" + (cls && cls.indexOf("frase") > -1 ? " larga" : ""));
      w.appendChild(b);
      w.appendChild(botaoSom("Ouvir esta resposta",
        (function(f){ return function(){ falar(f); }; })(o.fala), "som somop"));
      box.appendChild(w);
    } else {
      box.appendChild(b);
    }
  });
  pai.appendChild(box);
}

/* ---------- PUXAR uma peça até um alvo (mouse, dedo e caneta) ----------
   ⚠️ Pointer Events e não mouse+touch separados: no celular o navegador dispara
   eventos de mouse FANTASMA depois do toque, e foi assim que o arrastar já
   quebrou duas vezes nesta casa.
   ⚠️ E nada de `preventDefault` no início: isso mataria o toque. Só depois de o
   dedo ANDAR 8 px é que vira arrasto — antes disso continua sendo um toque
   normal e o `onclick` responde igual. */
var PUXA = null;

function puxavel(bt, alvos, aoSoltar){
  if(!alvos.push) alvos = [alvos];
  bt.style.touchAction = "none";
  bt.addEventListener("pointerdown", function(ev){
    if(ev.button && ev.button !== 0) return;
    PUXA = {bt: bt, alvos: alvos, aoSoltar: aoSoltar,
            x0: ev.clientX, y0: ev.clientY,
            lx: ev.clientX, ly: ev.clientY,
            andando: false, fantasma: null};
  });
}
/* ⚠️⚠️ TRÊS LIÇÕES PAGAS AQUI, e nenhuma delas dava erro na tela — o arrasto
   simplesmente não acontecia:
   1. ouvir o `pointermove` no PRÓPRIO botão: só o primeiro movimento chegava.
      O padrão certo é ouvir no DOCUMENTO — o dedo precisa poder SAIR de cima da
      peça, que é justamente o que ele faz ao levá-la.
   2. o navegador FUNDE os movimentos: num teste com oito passos chegou UM
      `pointermove`. Quem manda é a SOLTURA, não a contagem de movimentos.
   3. o `pointercancel` chega ANTES do `pointerup` e vem com clientX/clientY
      = 0,0 — quem usasse a coordenada dele concluiria que a criança soltou no
      canto da tela. Por isso o último ponto REAL fica guardado. */
function _puxaAnda(ev){
  var P = PUXA; if(!P) return;
  P.lx = ev.clientX; P.ly = ev.clientY;
  var dx = ev.clientX - P.x0, dy = ev.clientY - P.y0;
  if(!P.andando){
    if(dx * dx + dy * dy < 64) return;
    P.andando = true; P.bt._arrastou = true;
    var f = P.bt.cloneNode(true);
    f.className = "fantasma " + P.bt.className;
    var r = P.bt.getBoundingClientRect();
    f.style.width = r.width + "px"; f.style.height = r.height + "px";
    f._ox = r.left; f._oy = r.top;
    document.body.appendChild(f); P.fantasma = f;
    P.bt.className = P.bt.className + " puxada";
  }
  if(ev.cancelable) ev.preventDefault();
  P.fantasma.style.left = (P.fantasma._ox + dx) + "px";
  P.fantasma.style.top = (P.fantasma._oy + dy) + "px";
  P.alvos.forEach(function(a){
    a.className = a.className.replace(/ ?perto/, "") + (sobre(ev, a) ? " perto" : "");
  });
}
function _puxaSolta(ev){
  var P = PUXA; if(!P) return;
  PUXA = null;
  P.alvos.forEach(function(a){ a.className = a.className.replace(/ ?perto/, ""); });
  P.bt.className = P.bt.className.replace(/ ?puxada/, "");
  if(P.fantasma && P.fantasma.parentNode) P.fantasma.parentNode.removeChild(P.fantasma);
  var px = ev.clientX, py = ev.clientY;
  if(!px && !py){ px = P.lx; py = P.ly; }
  var onde = {clientX: px, clientY: py};
  var andou = (px - P.x0) * (px - P.x0) + (py - P.y0) * (py - P.y0) >= 64;
  if(!andou) return;
  P.bt._arrastou = true;
  var i;
  for(i = 0; i < P.alvos.length; i++){
    if(sobre(onde, P.alvos[i])){ P.aoSoltar(P.alvos[i], i); break; }
  }
  setTimeout(function(){ P.bt._arrastou = false; }, 60);
}
document.addEventListener("dragstart", function(ev){ ev.preventDefault(); });
document.addEventListener("pointermove", _puxaAnda);
document.addEventListener("pointerup", _puxaSolta);
document.addEventListener("pointercancel", _puxaSolta);
function sobre(ev, alvo){
  var r = alvo.getBoundingClientRect(), m = 14;
  return ev.clientX >= r.left - m && ev.clientX <= r.right + m &&
         ev.clientY >= r.top - m && ev.clientY <= r.bottom + m;
}

function monta(){
  livro.innerHTML = ""; PAGEL = []; RESP = {}; TIRAS = [];
  /* ⚠️ UMA ENTRADA POR FOLHA, na ordem, começando pela capa `f0`. */
  var caps = [f0, f01, f02, f03, f04, f05, f06, f07, f08, f09, f10, f11, f12, f13, f14, f15, f16, f17, f18, f19, f20, f21, f22, f23, f24, f25, f26, f27, f28, f29, f30, f31, f32, f33, f34, f35], i;
  for(i = 0; i < caps.length; i++){
    var d = el("div", "pagina" + (i > 0 ? " " + CORES[i - 1] : "")); d.setAttribute("data-pag", i);
    caps[i](d, i);
    if(i > 0) d.appendChild(el("div", "carimbo", "FOLHA<br>PRONTA"));
    livro.appendChild(d); PAGEL.push(d);
  }
}

/* ---------- A CAPA: O MEGAFONE DA SÍLABA FORTE ----------
   ⭐ A cena É a ideia do caderno: cada palavra passa por um megafone e UMA
      sílaba sai maior que as outras — a que leva a força. A criança entende o
      gesto antes de ler o título.
   ⚠️ O título diz o ASSUNTO, não uma metáfora bonita (regra do Marcos,
      20/set/2026), e a PALAVRA ANIMADA da capa tem de dizer o mesmo que o
      `<title>` — já houve caderno que trocou de nome e continuou estampando o
      velho em letras grandes; quem pegou foi o portão 0b11. */
function f0(d){
  var c = el("div", "capa"), nome = "APRENDENDO A SÍLABA TÔNICA: OXÍTONA, PAROXÍTONA E PROPAROXÍTONA", k, letras = "";
  nome.split(" ").forEach(function(pal, w){
    var s2 = "";
    for(k = 0; k < pal.length; k++) s2 += '<span class="lt">' + pal.charAt(k) + '</span>';
    letras += (w ? '<span class="esp"></span>' : '') + '<span class="tpal">' + s2 + '</span>';
  });
  var cena = "";
  MEGAF.forEach(function(M){
    var peds = "";
    M.s.forEach(function(sb, n){
      peds += '<span class="mgsb' + (n === M.t ? " forte" : "") + '">' + sb + "</span>";
    });
    cena += '<i class="mgcone"></i><div class="mgcx">' + peds + "</div>";
  });
  c.innerHTML =
    '<div class="ceu"></div>' +
    '<h1 class="titu">' + letras + "</h1>" +
    '<div class="sub">Língua Portuguesa &middot; 3º ano &middot; 35 folhas para ouvir ' +
      'onde a voz bate mais forte: oxítona, paroxítona e proparoxítona</div>' +
    '<div class="cena"><div class="megaf">' + cena + "</div></div>" +
    '<div class="chamada">Em cada palavra, <b>um pedaço sai mais forte</b> — é ele ' +
      "que você vai procurar. Escreva o seu nome ali embaixo e toque em <b>Começar</b>.</div>";
  d.appendChild(c);
}
function gavetas(d, pi, gk, pede){
  faixa(d, pi, NOMES[pi - 1]);
  var G = GAV[gk];
  enunciado(d, pi, pede, "p" + pi + "enun");
  var cols = el("div", "colunas"), caixas = {}, listaC = [];
  G.cols.forEach(function(C){
    var c = el("div", "coluna");
    var t = el("div", "ctit", C.n);
    t.setAttribute("data-alvo", "1");
    /* ⚠️ o alvo é COMPARTILHADO pela folha inteira, então ele se declara no
       nível da página — e com o número da folha no nome, porque as 22 folhas
       moram no mesmo HTML e o jogador da banca busca por `document.querySelector`. */
    c.setAttribute("data-qa", "alvo-gav" + pi + "_" + C.k);
    t.appendChild(botaoSom("Ouvir a regra desta gaveta", function(){ falar("gav_" + gk + "_" + C.k); }));
    c.appendChild(t);
    var dentro = el("div", "cdentro");
    c.appendChild(dentro);
    c._v = C.k; c._dentro = dentro;
    caixas[C.k] = c; listaC.push(c);
    cols.appendChild(c);
  });
  d.appendChild(cols);
  var banco = el("div", "figbanco"), marcada = null;
  ST.folha["p" + pi].forEach(function(n, i){
    var P = G.pal[n], id = "n" + pi + "_" + i;
    registra(id, pi, ">gav" + pi + "_" + P.c);
    var b = el("button", "op pal" + (ST.resp[id] ? " usada" : ""), P.p);
    b.setAttribute("aria-label", P.p);
    b.setAttribute("data-qa", "item-" + id);
    /* a palavra escrita é a PEÇA que a criança pega, não a resposta entregue */
    b.setAttribute("data-alvo", "1");
    if(ST.resp[id]) caixas[P.c]._dentro.appendChild(el("span", "fdentro", P.p));
    function larga(col){
      if(ST.resp[id]) return;
      if(col._v === P.c){
        b.className = "op pal usada";
        col._dentro.appendChild(el("span", "fdentro", P.p));
        if(marcada === b) marcada = null;
        acertou(id, "certo" + pi + "_" + n);
      } else {
        col.className = "coluna erro";
        setTimeout(function(){ col.className = "coluna"; }, 500);
        errou(id, "dica" + pi + "_" + n);
      }
    }
    b._larga = larga;
    b.onclick = function(){
      if(b._arrastou){ b._arrastou = false; return; }
      if(ST.resp[id]) return;
      sPasso(); falar("diz2_" + gk + "_" + n);
      if(marcada === b){ b.className = "op pal"; marcada = null; return; }
      if(marcada) marcada.className = "op pal";
      b.className = "op pal marcada"; marcada = b;
    };
    puxavel(b, listaC, function(col){ larga(col); });
    banco.appendChild(b);
  });
  listaC.forEach(function(col){
    col.onclick = function(){
      if(!marcada){ sPasso(); falar("toque_palavra"); return; }
      marcada._larga(col);
    };
  });
  d.appendChild(banco);
}

/* ============================================================
   AS FOLHAS — escrever daqui para baixo, uma função por folha.

   O MOLDE de uma folha de escolher:

     function f01(d, pi){
       faixa(d, pi, NOMES[pi - 1]);
       enunciado(d, pi, "O que a criança tem de fazer.", "p" + pi + "enun");
       ST.folha["p" + pi].forEach(function(k, i){
         var D = MEUDADO[k], id = "n" + pi + "_" + i, box = item(i + 1);
         // … desenhar a peça …
         opcoes(box, pi, id, lista, certa, "pal",
                "certo" + pi + "_" + k, "dica" + pi + "_" + k);
         fechaItem(d, box, id);
       });
     }

   ⚠️ E CADA PEÇA TEM DE SER ALCANÇÁVEL PELO JOGADOR DA BANCA, senão a folha sai
      como dívida e ninguém a mede. Os contratos, em `_qa/joga_folha.js`:
        `esc-<id>`            → campo de teclado
        `op-<id>-<valor>`     → uma escolha
        `item-<id>` + `>gav`  → pegar a peça e largar na gaveta
        `pinta-<id>-<x>` + `data-lapis="<x>"` e o estojo `lapis-<x>` → pintar
        `cp-<id>-a` / `cp-<id>-z` → as duas pontas da palavra no caça-palavras
        `conferir-<id>`       → marque vários e confirme
   ============================================================ */
/* ---------- o teclado da palavra: uma por vez, letra a letra ----------
   ⚠️ UMA PEÇA SÓ PARA A CRUZADINHA (22) E PARA O REESCREVA (19). As duas
   escrevem palavra letra a letra; escrever dois teclados seria arrumar lugar
   para um segundo defeito. O que muda entre elas é só o rótulo da tarja —
   daí o `E.rot`. */
var CRUZ = null;
/* ---------- ROLAR A PALAVRA PARA CIMA DO TECLADO ----------
   ⚠️⚠️ O TECLADO TAPAVA A ATIVIDADE, e o Marcos viu no celular (15/set/2026):
      *"ele preenche a tela e não dá para ver a atividade"*. Medido: na
      cruzadinha de 360x640 o teclado ocupava 368 px de 640 e a grade ficava
      INTEIRA por baixo dele — a criança escrevia às cegas.
   ⚠️ E A REGRA TEM DOIS DEGRAUS, porque medir só um não bastou:
      1. se a PALAVRA inteira cabe na faixa que sobra, ela sobe inteira;
      2. se não cabe (palavra em pé, tela de 320x568 — medido), sobe a CASINHA
         QUE ESTÁ SENDO ESCRITA, centrada na faixa. É o que um campo de texto
         faz: mantém à vista a letra que a pessoa está digitando.
   Por isso ela é chamada duas vezes: ao abrir o teclado e a cada letra.
   ⚠️⚠️ E ELA ATENDE OS DOIS TECLADOS DA CASA, o que é a lição paga aqui
      (15/set/2026): há dois desenhos de teclado nos cadernos de folha viva —
      o da CRUZADINHA, que escreve numa fila de casinhas (`CRUZ.E.cels`), e o
      da SÍLABA/PALAVRA, que escreve numa quadra só (`ATIVA.q`). Eu escrevi
      esta função ancorada no primeiro e a enfiei nos dezoito cadernos pelo
      `function abreCruz(` — que só existe em TRÊS. Nos outros quinze ficou a
      CHAMADA sem a função: `setTimeout(rolaParaCruz, 60)` estourava
      ReferenceError e matava o resto de `ativa()`, que era justamente quem
      escrevia a dica e falava com a criança. O teclado abria mudo.
      O `node --check` não vê isso (a sintaxe está perfeita); quem vê é o
      `_qa/funcoes.py`, o portão "função que não existe" — que eu não rodei. */
function rolaParaCruz(){
  /* ⚠️ VAZIA DE PROPÓSITO, e ela fica aqui em vez de sumir. Enquanto o
     teclado era uma barra fixa nossa, esta função levava a palavra para
     a faixa que sobrava acima dele. Agora quem abre é o teclado do
     aparelho, e o navegador já rola a página sozinho para o campo com
     foco. Apagá-la quebraria as chamadas que ainda existem por aí. */
}
function abreCruz(E, pi){
  /* ⚠️ SEM BARRA FIXA, SEM ROLAGEM FORÇADA. O teclado da casa era fixo no pé da
     tela e tapava a palavra que a criança escrevia — daí existir o `comtec` e o
     `rolaParaCruz`. Agora quem abre é o teclado do APARELHO, que o próprio
     navegador já trata: ele rola a página para deixar o campo com foco à vista.
     Foi por isso que as duas peças saíram daqui juntas. */
  /* ⚠️ Toque na casinha dispara o `onclick` da casinha E o da grade: a mesma
     palavra pede para abrir duas vezes. Se já está aberta, só devolve o foco —
     fechar e reabrir era o que apagava a letra e (antes do conserto acima)
     estourava. */
  if(CRUZ && CRUZ.E === E){ try{ TECIN && TECIN.focus(); }catch(e){} return; }
  if(CRUZ) fechaCruz();
  CRUZ = {E: E, val: "", pi: pi};
  if(E.bt) E.bt.className = E.bt.className.indexOf("oculta") > -1 ? "pista oculta" : "pista ativa";
  pintaCruz();
  var grade = E.cels && E.cels[0] ? E.cels[0].parentNode : null;
  var c = poeCampoSobre(grade);
  c.value = "";
  c.setAttribute("maxlength", String(E.aceita ? E.cels.length : E.w.length));
  c.setAttribute("aria-label", E.rot || "Escreva a palavra");
  try{ c.focus({preventScroll: false}); }catch(e){ c.focus(); }
  falar("escreva");
}
function fechaCruz(){
  /* ⚠️⚠️ LIÇÃO PAGA — "O ALUNO NÃO CONSEGUIA DIGITAR" (Marcos, 18/set/2026, na
     folha 8 d'A Fábrica de Nomes). Aqui estava `CRUZ = null; pintaCruz();` — e
     `pintaCruz` começa lendo `CRUZ.E`. Estourava TypeError toda vez que se
     fechava a caneta. Como a casinha E a grade tinham `onclick`, um toque na
     casinha chamava `abreCruz` duas vezes: a segunda fechava a primeira, o
     fecho estourava, e o `abreCruz` morria ANTES de reabrir. Resultado: a
     criança tocava, nada abria, digitava e nada acontecia — sem erro na tela.
     O jogador da banca não pegou porque clicava na GRADE (um `onclick` só);
     agora ele clica na CASINHA, como a criança. Aqui: pintar com o E guardado
     ANTES de zerar, e nunca ler CRUZ depois de zerá-lo. */
  if(!CRUZ) return;
  var E = CRUZ.E;
  if(E.bt) E.bt.className = E.bt.className.indexOf("oculta") > -1 ? "pista oculta" : "pista";
  CRUZ = null;
  if(TECIN){ TECIN.value = ""; try{ TECIN.blur(); }catch(e){} }
  limpaCruz(E);
}
function limpaCruz(E){
  (E && E.cels || []).forEach(function(c){
    if(!c || c.className.indexOf(" ok") > -1) return;
    var n = c.querySelector(".cn");
    c.textContent = ""; if(n) c.appendChild(n);
    c.className = "ccel viva";
  });
}
function pintaCruz(){
  if(!CRUZ) return;                       /* nunca ler CRUZ.E sem CRUZ */
  var E = CRUZ.E, v = CRUZ.val;
  E.cels.forEach(function(c, i){
    if(!c) return;
    var n = c.querySelector(".cn");
    c.textContent = v.charAt(i) || "";
    if(n) c.appendChild(n);
    c.className = "ccel viva" + (i === v.length ? " ativa" : "");
  });
}
function digitaCruz(ch){
  if(!CRUZ) return;
  sTecla();
  var E = CRUZ.E;
  /* ⚠️ NA FOLHA DE PRODUÇÃO O TAMANHO NÃO É O DO GABARITO: as palavras aceitas
     têm tamanhos diferentes, e o teto é a maior delas (`E.cels.length`). E ela
     NÃO se confere sozinha ao encher — a criança é que diz quando acabou, no
     botão OK. Conferir sozinho recusaria "GATO" no meio de "GATOS". */
  var teto = E.aceita ? E.cels.length : E.w.length;
  if(ch === "ap") CRUZ.val = CRUZ.val.slice(0, -1);
  else if(ch === "ok"){ confereCruz(); return; }
  else { if(CRUZ.val.length >= teto) return; CRUZ.val += ch; }
  pintaCruz(); rolaParaCruz();
  if(fechaSozinho(E, CRUZ.val)) setTimeout(confereCruz, 380);
}
/* ⚠️⚠️ O ACENTO NÃO PODE REPROVAR QUEM ACERTOU A PALAVRA (ordem do Marcos,
   15/set/2026, com a turma na sala: *"faça que tanto com o sem dê certo"*).
   O gabarito de BACTERIAS estava sem acento e o teclado da tela TEM os acentos:
   a criança que escrevia BACTÉRIAS — que é o certo em português — era recusada,
   e ficava olhando para uma palavra certa marcada como errada. O contrário
   também acontecia, em caderno cujo gabarito vinha acentuado.
   ⚠️ E ONDE O ACENTO É O CONTEÚDO, ele continua contando: a folha declara
      `exigeAcento` e aí a comparação é letra por letra, acento incluído. */
function semAcento(s){
  s = String(s || "").toUpperCase();
  var de = "ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ", para = "AAAAAEEEEIIIIOOOOOUUUUC", i, o = "";
  for(i = 0; i < s.length; i++){
    var n = de.indexOf(s.charAt(i));
    o += n > -1 ? para.charAt(n) : s.charAt(i);
  }
  return o;
}
function mesmaPalavra(a, b, exigeAcento){
  if(exigeAcento) return String(a).toUpperCase() === String(b).toUpperCase();
  return semAcento(a) === semAcento(b);
}
/* ⭐ SEM PRECISAR DO ENTER (ordem do Marcos, 21/set/2026, sobre o caderno dos
   sistemas do 5º ano): ***"tem uma atividade onde o estudante digita e tem que
   clicar enter para confirmar, melhor não precisar do enter"*** — e logo
   depois: ***"corrija isso em qualquer atividade que tenha isso"***.

   ⚠️ O QUE ERA: a grade de tamanho FIXO já fechava sozinha ao encher a última
      casa. A grade LIVRE (a das folhas de produção — *"escreva a SUA palavra"*,
      *"a sua manchete"*, *"o seu título"*) não tinha como saber quando a criança
      terminou, e o único jeito de confirmar era o ENTER. No celular a tecla se
      chama outra coisa em cada aparelho, e no PC a criança de 10 anos não
      adivinha que precisa dela: ela escrevia a resposta certa e a folha ficava
      parada.

   ⚠️ POR QUE NÃO FECHAR SOZINHO NUMA PAUSA: pausa de dois segundos é a criança
      PENSANDO no meio da palavra, e fechar ali contaria erro no que ela nem
      terminou de escrever. Tempo não é sinal de que acabou.

   O que entra no lugar, e são duas coisas:
     1. fecha sozinho assim que o escrito BATE com uma resposta aceita — sem
        esperar tecla nenhuma;
     2. quando ela escreve uma palavra que não está na lista (a folha de
        produção aceita isso), o botão **PRONTO**, ao lado da grade, confirma.
   O Enter continua valendo: é a terceira porta, nunca mais a única. */
function fechaSozinho(E, val){
  if(!val) return false;
  if(!E.aceita) return val.length >= E.w.length;
  var bate = E.aceita.some(function(w){ return mesmaPalavra(val, w, E.exigeAcento); });
  if(!bate) return false;
  /* ⚠️ e ninguém CONTINUA a partir dela: se a lista tem PÃO e PÃOZINHO, fechar
     no PÃO trancaria justamente a criança que ia escrever a palavra maior. */
  var maior = E.aceita.some(function(w){
    return w.length > val.length && semAcento(w).indexOf(semAcento(val)) === 0;
  });
  return !maior;
}
function confereCruz(){
  if(!CRUZ || !CRUZ.val) return;
  var E = CRUZ.E, pi = CRUZ.pi;
  /* ⚠️⚠️ A FOLHA DE PRODUÇÃO (34) ACEITA MUITAS RESPOSTAS, e sem isto ela seria
     uma armadilha: a criança escreveria uma palavra CERTA e o app diria que
     está errada. Quando `E.aceita` existe, vale qualquer palavra da lista —
     e a que fica escrita nas casas é a que ELA escreveu, não a do gabarito.
     ⚠️ E o gabarito continua existindo (`E.w` = a primeira da lista), porque é
        ele que o jogador da banca digita. */
  var vale = E.aceita
    ? E.aceita.some(function(w){ return mesmaPalavra(CRUZ.val, w, E.exigeAcento); })
    : mesmaPalavra(CRUZ.val, E.w, E.exigeAcento);
  var escrita = E.aceita ? CRUZ.val : E.w;
  if(vale){
    E.cels.forEach(function(c, i){
      if(!c) return;
      var n = c.querySelector(".cn");
      c.textContent = escrita.charAt(i); if(n) c.appendChild(n);
      c.className = "ccel viva" + (i < escrita.length ? " ok" : "");
    });
    if(E.bt) E.bt.className = E.bt.className.indexOf("oculta") > -1 ? "pista oculta" : "pista feita";
    CRUZ = null;
    if(TECIN){ TECIN.value = ""; try{ TECIN.blur(); }catch(e){} }
    acertou(E.id, "certo" + pi + "_" + E.k);
  } else {
    CRUZ.val = ""; pintaCruz();
    errou(E.id, "dica" + pi + "_" + E.k);
  }
}
function montaLigar(caixa, pi, tag, pares, pagina){
  var box = el("div", "ligar"), ce = el("div", "col"), cd = el("div", "col");
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "linhas");
  box.appendChild(ce); box.appendChild(cd); box.appendChild(svg); caixa.appendChild(box);
  var ordem = baralha(pares.map(function(_, i){ return i; }));
  var E = {}, D = {}, marcada = null;
  pares.forEach(function(P){ registra("l" + pi + tag + "_" + P.k, pi, P.k); });
  function centro(e, lado){
    var r = e.getBoundingClientRect(), b = box.getBoundingClientRect();
    return {x: (lado === "e" ? r.right : r.left) - b.left, y: r.top + r.height / 2 - b.top};
  }
  function linha(a, b2, cor){
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var dx = Math.max(28, Math.abs(b2.x - a.x) * 0.45);
    var dd = "M" + a.x + "," + a.y + " C" + (a.x + dx) + "," + a.y + " " +
             (b2.x - dx) + "," + b2.y + " " + b2.x + "," + b2.y;
    var halo = document.createElementNS("http://www.w3.org/2000/svg", "path");
    halo.setAttribute("d", dd); halo.setAttribute("fill", "none");
    halo.setAttribute("stroke", "#ffffff"); halo.setAttribute("stroke-width", 11);
    halo.setAttribute("stroke-linecap", "round");
    var l = document.createElementNS("http://www.w3.org/2000/svg", "path");
    l.setAttribute("d", dd); l.setAttribute("fill", "none");
    l.setAttribute("stroke", cor); l.setAttribute("stroke-width", 6);
    l.setAttribute("stroke-linecap", "round");
    g.appendChild(halo); g.appendChild(l);
    [a, b2].forEach(function(p){
      var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", 6);
      c.setAttribute("fill", cor); c.setAttribute("stroke", "#fff"); c.setAttribute("stroke-width", 2.5);
      g.appendChild(c);
    });
    svg.appendChild(g); return g;
  }
  function desmarca(){ if(marcada) marcada.el.className = marcada.el.className.replace(" marcada", ""); marcada = null; }
  function redesenha(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    for(var k in E) if(ST.lig["l" + pi + tag + "_" + k]) linha(centro(E[k].el, "e"), centro(D[k].el, "d"), "#15a34a");
  }
  aoAbrir(pagina, redesenha);
  window.addEventListener("resize", function(){ if(pagina.className.indexOf("viva") > -1) redesenha(); });
  function fecha(Re, Rd){
    var id = "l" + pi + tag + "_" + Re.k;
    if(Rd.k === Re.k){
      ST.lig[id] = 1; tentativa(id, true); ST.resp[id] = 1; salvar();
      Re.el.className += " feita"; Rd.el.className += " feita"; desmarca(); redesenha(); sCerto();
      falar(Re.fc); setTimeout(function(){ confereFolha(pi); }, 850);
    } else {
      tentativa(id, false); sErro();
      Rd.el.className += " treme";
      setTimeout(function(){ Rd.el.className = Rd.el.className.replace(" treme", ""); }, 500);
      falar(ST.tent[id].erros >= 2 ? Re.dica : "quase");
      if(ST.tent[id].erros >= 2 && D[Re.k].el.className.indexOf("feita") < 0) D[Re.k].el.className += " mostra";
    }
  }
  pares.forEach(function(P){
    var e = el("div", "ponta" + (ST.lig["l" + pi + tag + "_" + P.k] ? " feita" : ""), P.esq);
    e.setAttribute("role", "button"); e.setAttribute("tabindex", "0");
    /* ⚠️ O NÚMERO DA FOLHA ENTRA NO `data-qa`, e isto foi conserto de
       20/set/2026. As 36 folhas moram no MESMO html, e o jogador da banca
       acha a ponta com `document.querySelector`. Duas folhas de LIGAR com a
       mesma etiqueta publicavam o mesmo `data-qa`: o clique ia sempre para a
       PRIMEIRA, e a segunda folha não fechava nem com a resposta certa.
       Foi o que aconteceu no `_corpo5`, folhas 5 e 6. */
    /* ⚠️ A PONTA DO LIGAR É ALVO, e por isso ela se declara. O portão 1i4
       (`resposta_impressa.py`) procura a resposta escrita na tela antes de a
       criança responder — e no LIGAR as duas colunas estão à vista de propósito:
       é o gesto. Sem esta declaração ele reprova quando a chave do par é igual
       à palavra mostrada (aconteceu na folha 20, com o par `sangue` ↔ "leva
       oxigênio": a chave é "sangue" e o rótulo diz SANGUE). Não é desligar o
       portão: é dizer o que aquele elemento é. */
    e.setAttribute("data-qa", "lig" + pi + tag + "-e-" + P.k);
    e.setAttribute("data-alvo", "1");
    e.setAttribute("aria-label", P.ariaE);
    var R = {k: P.k, el: e, fc: P.fc, dica: P.dica};
    E[P.k] = R;
    e.addEventListener("pointerdown", function(ev){
      if(e.className.indexOf("feita") > -1) return;
      ev.preventDefault(); desmarca(); marcada = R; e.className += " marcada"; sPasso(); falar(P.fe);
    });
    e.onkeydown = function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); desmarca(); marcada = R; e.className += " marcada"; falar(P.fe); } };
    ce.appendChild(e);
  });
  ordem.forEach(function(j){
    var P = pares[j];
    var e = el("div", "ponta" + (ST.lig["l" + pi + tag + "_" + P.k] ? " feita" : ""), P.dir);
    e.setAttribute("role", "button"); e.setAttribute("tabindex", "0");
    e.setAttribute("data-qa", "lig" + pi + tag + "-d-" + P.k);
    e.setAttribute("data-alvo", "1");
    e.setAttribute("aria-label", P.ariaD);
    var R = {k: P.k, el: e}; D[P.k] = R;
    e.addEventListener("pointerdown", function(ev){
      if(e.className.indexOf("feita") > -1) return;
      ev.preventDefault();
      if(marcada) fecha(marcada, R); else { sPasso(); falar(P.fd); falarDepois("ligue", 900); }
    });
    e.onkeydown = function(ev){ if((ev.key === "Enter" || ev.key === " ") && marcada){ ev.preventDefault(); fecha(marcada, R); } };
    cd.appendChild(e);
  });
}

/* ---------- o teclado da tela, e o teclado DE VERDADE ----------
   ⚠️⚠️ O ALFABETO ESTAVA INCOMPLETO, E ISSO TRANCAVA A CRIANÇA (15/set/2026).
   Faltavam K, W e Y — e, pior, faltavam Ê, Â, Ã, Ô, Õ, À e Ü. Quem tentasse
   escrever PÊSSEGO no teclado da tela ou no teclado de verdade ficava com
   "PSSEGO": a tecla não existia, a letra não entrava, e a folha NUNCA FECHAVA.
   Não havia erro nenhum no console; a criança só tentava de novo até desistir.
   Medido com o navegador de verdade, letra por letra, antes deste conserto.
   ⚠️ Quem fecha esta família agora é o portão `_qa/teclado.py`: ele confere que
      o alfabeto tem as 26 letras e os treze acentos do português, e que o
      teclado da tela e o filtro do teclado de verdade usam o MESMO alfabeto —
      porque dois alfabetos diferentes é o mesmo defeito com uma porta só.
   ⚠️ REGRA DAS DUAS PORTAS (Marcos, ago/2026): *"seria interessante se o aluno
   além de teclar no teclado virtual funcionasse se ele tocasse no teclado de
   verdade, as duas opções"*. No PC da escola tem teclado e a criança vai
   digitar; no celular, não tem. Nunca só uma porta. */
/* ============================================================
   O TECLADO DO APARELHO — substitui o teclado de 41 teclas da casa.

   ⭐ ORDEM DO MARCOS (15/set/2026): *"pode remover o teclado das atividades,
      melhor digitar com teclado normal"*. O nosso ocupava 53% de um celular de
      640 px, e mesmo redistribuído para 4 fileiras ainda comia 40%.

   ⚠️ O QUE ELE RESOLVE E O QUE NÃO RESOLVE, dito por inteiro: no PC da escola o
      teclado físico já funcionava (as duas portas são regra da casa desde
      ago/2026) — o campo abaixo não muda nada lá. Ele existe pelo CELULAR, que
      não tem teclado físico: sem um campo de verdade para focar, o aparelho não
      abre teclado nenhum e a criança fica trancada.
   ============================================================ */
var TECIN = null;
function campoTeclado(){
  if(TECIN) return TECIN;
  TECIN = document.createElement("input");
  TECIN.id = "tecIn";
  TECIN.type = "text";
  TECIN.setAttribute("autocomplete", "off");
  TECIN.setAttribute("autocorrect", "off");
  TECIN.setAttribute("autocapitalize", "characters");
  TECIN.setAttribute("spellcheck", "false");
  TECIN.setAttribute("aria-label", "Escreva a palavra");
  TECIN.setAttribute("inputmode", "text");
  /* ⚠️ O EVENTO É `input`, NÃO `keydown`: no celular o teclado do sistema não
     dispara keydown com a letra (ele "compõe" o texto), e um caderno que só
     ouvisse keydown seria mudo justamente no aparelho para o qual este campo
     existe. */
  TECIN.addEventListener("input", function(){
    if(!CRUZ) return;
    var v = (TECIN.value || "").toUpperCase();
    var teto = CRUZ.E.aceita ? CRUZ.E.cels.length : CRUZ.E.w.length;
    if(v.length > teto) v = v.slice(0, teto);
    CRUZ.val = v; TECIN.value = v;
    pintaCruz();
    if(fechaSozinho(CRUZ.E, CRUZ.val)) setTimeout(confereCruz, 380);
  });
  TECIN.addEventListener("keydown", function(ev){
    if(ev.key === "Enter"){ ev.preventDefault(); confereCruz(); }
    else if(ev.key === "Escape"){ fechaCruz(); }
  });
  /* ⚠️⚠️ PERDER O FOCO NÃO FECHA MAIS A PALAVRA (18/set/2026). Aqui havia um
     `blur -> fechaCruz()`. Medido no navegador com o gesto da criança: ela toca
     na casinha, toca em "Ouvir a frase" para escutar de novo (o que a folha
     CONVIDA a fazer) e o foco vai para o botão — a palavra fechava, e o que ela
     digitava em seguida caía no vazio. No PC a digitação nem precisa do foco
     (o teclado é ouvido no documento); no celular, tocar de novo na casinha
     devolve o foco e reabre o teclado do aparelho. Então o blur não faz nada. */
  document.body.appendChild(TECIN);
  return TECIN;
}
function poeCampoSobre(grade){
  var c = campoTeclado();
  if(grade && grade.parentNode){
    if(c.parentNode !== grade) grade.appendChild(c);
    c.style.left = "0"; c.style.top = "0";
    c.style.width = "100%"; c.style.height = "100%";
  }
  return c;
}
document.addEventListener("keydown", function(ev){
  if(document.activeElement && document.activeElement.id === "nomeIn") return;
  var k = (ev.key || "").toUpperCase();
  /* ⭐ DIGITAR SEM TER CLICADO ABRE A PRIMEIRA PALAVRA VAZIA DA FOLHA
     (18/set/2026). A criança do 5º ano vê as casinhas e começa a digitar —
     nada dizia "toque nas casinhas primeiro". As DUAS PORTAS valem para o
     gesto também: no PC, o teclado tem de funcionar sem clique. */
  if(!CRUZ && k.length === 1 && "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÜÇ".indexOf(k) > -1){
    var alvo = null, todos = document.querySelectorAll('.pagina.viva [data-qa^="esc-"]');
    for(var i = 0; i < todos.length && !alvo; i++){
      var idq = todos[i].getAttribute("data-qa").slice(4);
      if(!ST.resp[idq]) alvo = todos[i];
    }
    if(alvo){ alvo.click(); }
  }
  if(!CRUZ) return;
  if(k.length === 1 && "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÜÇ".indexOf(k) > -1){ ev.preventDefault(); digitaCruz(k); }
  else if(ev.key === "Backspace"){ ev.preventDefault(); digitaCruz("ap"); }
  else if(ev.key === "Enter"){ ev.preventDefault(); digitaCruz("ok"); }
  else if(ev.key === "Escape"){ fechaCruz(); }
});

/* ---------- folha pronta e navegação ---------- */
function idsDaPagina(pi){
  /* ⚠️⚠️ ISTO JÁ MENTIU DUAS VEZES NESTA CASA. Antes, cada folha gravava `n6_0`
     à mão e esta função dizia à mão que a página 6 tinha ids `n6_`. Eram DOIS
     lugares a combinar, os dois sintaticamente corretos, e quando a ordem das
     folhas mudava o relatório saía ZERO com a folha toda respondida — sem erro
     nenhum no console. Agora o id NASCE DA POSIÇÃO e aqui se lê a mesma
     posição; a única forma diferente é o LIGAR, que se declara na constante. */
  var ids = [], i, k, L = (ST.folha["p" + pi] || []);
  if(LIGAR.indexOf(pi) > -1){
    for(i = 0; i < L.length; i++)
      for(k = 0; k < L[i].length; k++) ids.push("l" + pi + "g" + i + "_" + L[i][k]);
    return ids;
  }
  for(i = 0; i < L.length; i++) ids.push("n" + pi + "_" + i);
  return ids;
}
function pendentes(pi){
  var ids = idsDaPagina(pi), n = 0, i;
  for(i = 0; i < ids.length; i++) if(!ST.resp[ids[i]]) n++;
  return n;
}
function confereFolha(pi){
  if(pendentes(pi) > 0 || ST.prontas[pi]) return;
  ST.prontas[pi] = 1; salvar();
  PAGEL[pi].className += " pronta"; sFesta(); confete(24);
  if(pi < PAGEL.length - 1){ falar("folhaPronta"); setTimeout(function(){ if(ST.pag === pi) vaiPara(pi + 1); }, 2400); }
  else setTimeout(fim, 1400);
  atualizaNav();
}
function espelhaNome(t){
  var i = document.getElementById("nomeIn"); if(i && i.value !== t) i.value = t;
}
function vaiPara(pi){
  calar(); fechaCruz();
  document.getElementById("barraCapa").className = pi === 0 ? "aberta" : "";
  if(pi === 0) espelhaNome(ST.nome || "");
  document.getElementById("fim").style.display = "none";
  document.getElementById("retomar").style.display = "none";
  document.getElementById("nav").style.display = pi === 0 ? "none" : "flex";
  for(var i = 0; i < PAGEL.length; i++) PAGEL[i].className = PAGEL[i].className.replace(" viva", "");
  ST.pag = pi; salvar();
  /* ⚠️ GUARDA DO ESQUELETO VAZIO: enquanto o caderno ainda não tem folha
     nenhuma, o "Começar" pede a folha 1 e `PAGEL[1]` não existe — estourava
     `TypeError` e o portão do boot reprovava. Não é defeito do caderno em
     construção; é o esqueleto tendo de abrir limpo ANTES de ter conteúdo, que é
     justamente o que torna o pré-voo útil no primeiro minuto. Num caderno com
     folhas esta guarda nunca dispara. */
  var d = PAGEL[pi];
  if(!d){ atualizaNav(); return; }
  d.className += " viva";
  if(pi > 0) window.scrollTo(0, 0);
  if(d._aoAbrir) for(var z = 0; z < d._aoAbrir.length; z++) (function(fn){ setTimeout(fn, 60); })(d._aoAbrir[z]);
  atualizaNav();
  falarDepois(pi === 0 ? "capa" : "p" + pi + "enun", 280);
}
function atualizaNav(){
  var pi = ST.pag, total = PAGEL.length;
  document.getElementById("pg").textContent = pi === 0 ? "Capa" : "Folha " + pi + " de " + (total - 1);
  var feitas = 0, k; for(k in ST.prontas) feitas++;
  document.getElementById("progI").style.width = (feitas / (total - 1) * 100) + "%";
  document.getElementById("bAnt").disabled = pi === 0;
  var prox = document.getElementById("bProx");
  prox.style.visibility = pi === 0 ? "hidden" : "visible";
  var pend = pi > 0 ? pendentes(pi) : 0;
  prox.innerHTML = pi === total - 1 ? (pend ? "Faltam " + pend : "Ver o resultado")
    : (pend ? "Faltam " + pend + '<i class="seta dir"></i>' : 'Próxima<i class="seta dir"></i>');
  prox.className = pend ? "bt cinza" : "bt verde";
  document.getElementById("navTxt").textContent = pi === 0 ? "" : NOMES[pi - 1];
}

/* ---------- fim: boletim, medalha e relatório ---------- */
/* ⭐⭐ O FECHO A QUALQUER MOMENTO.
   O Marcos fixou a sequência em no mínimo 20 folhas (o piso era 25 e ele o
   baixou em 14/set/2026, por velocidade de produção). Este caderno tem 22, e o
   número saiu do inventário de verbos do `POTE`, não de uma meta. Só que a
   criança DEVAGAR leva bem mais nas mesmas 22 folhas — ela não termina. Se o boletim, o parecer e a
   medalha só existissem DEPOIS da última folha, quem mais precisa do elogio
   seria a única a nunca vê-lo.
   ⚠️ E o boletim conta só o que ela TENTOU. Folha que ela não chegou a abrir
      aparece como "ainda não" — jamais como 0 de 6. */
function fim(){
  /* ⭐⭐ AVISA O CONTROLE DA SALA QUE ESTA CRIANÇA TERMINOU.
     Pedido do Marcos (15/set/2026): *"preciso que essas atividades sequências
     didáticas me avisem quando termino no painel de atividades, aquele que tem
     o controle da sala, assim como as atividades que fazíamos antes"*.

     ⚠️ E ELAS NÃO AVISAVAM POR CAMINHO NENHUM — conferido no código do
     laboratório antes de escrever isto. A tela do aluno (`_lab/index.html`)
     reconhece o fim de DOIS jeitos, e a folha viva escapava dos dois:
       1. A ESPIADA — ela olha dentro do quadro e procura a MEDALHA do fim pela
          CLASSE `.medal`. A folha viva chama a dela de `#medalha`, por id, e
          portanto a espiada nunca a via;
       2. O AVISO — o motor manda `postMessage({eduverse:"terminou"})` ao chegar
          no fim. A folha viva não mandava nada, porque nasceu sem essa peça.
     Agora ela manda o aviso aqui, e a medalha ganhou também a classe `medal`
     no HTML: dois caminhos, um cobrindo o buraco do outro, que é a razão pela
     qual o laboratório tem os dois.

     ⚠️ FORA DO LABORATÓRIO NÃO HÁ PAI NENHUM ESCUTANDO e a linha não faz nada —
     por isso ela é segura em qualquer lugar (em casa, no celular, aberta
     direto pelo link). O `try` existe para o caso de a janela de cima ser de
     outro domínio, quando o navegador recusa a leitura de `window.parent`. */
  try{ if(window.parent && window.parent !== window)
         window.parent.postMessage({eduverse: "terminou"}, "*"); }catch(e){}
  calar();
  var abertas = 0, naoAbertas = [], pp;
  for(pp = 1; pp <= NOMES.length; pp++){
    var idp = idsDaPagina(pp), algum = false, z;
    for(z = 0; z < idp.length; z++) if(ST.tent[idp[z]]) { algum = true; break; }
    if(algum) abertas++; else naoAbertas.push(pp);
  }
  var completo = naoAbertas.length === 0;
  var tf = document.getElementById("fimTit");
  if(tf) tf.textContent = completo ? "Caderno completo!" : "O seu boletim de hoje";
  var bv = document.getElementById("bVoltar");
  if(bv) bv.style.display = completo ? "none" : "";
  for(var i = 0; i < PAGEL.length; i++) PAGEL[i].className = PAGEL[i].className.replace(" viva", "");
  document.getElementById("nav").style.display = "none";
  var f = document.getElementById("fim"); f.style.display = "block";
  var tot = 0, prim = 0, pi;
  for(pi = 1; pi <= NOMES.length; pi++){
    var ids = idsDaPagina(pi);
    for(var j = 0; j < ids.length; j++){
      var t = ST.tent[ids[j]];
      if(!t) continue;
      tot++;
      if(t.erros === 0 && t.ok) prim++;
    }
  }
  var pc = tot ? prim / tot : 0;
  var cheias = pc >= .85 ? 3 : pc >= .6 ? 2 : 1, est = "", ke;
  for(ke = 0; ke < 3; ke++)
    est += '<img src="img/t3_selo' + (ke < cheias ? "" : "_off") + '.png?v=' + VIMG + '" alt="" draggable="false">';
  document.getElementById("estrelas").innerHTML = est;
  document.getElementById("estrelas").setAttribute("aria-label", cheias + " de 3 estrelas");
  var bar = document.getElementById("barras"); bar.innerHTML = "";
  for(pi = 1; pi <= NOMES.length; pi++){
    (function(pi){
      var ids = idsDaPagina(pi), p = 0, nt = 0, j;
      for(j = 0; j < ids.length; j++){
        var tt = ST.tent[ids[j]];
        if(tt) nt++;
        if(tt && tt.erros === 0 && tt.ok) p++;
      }
      if(nt === 0){
        bar.appendChild(el("div", "barra naoabriu",
          "<span>" + NOMES[pi - 1] + "</span><div class='tr'></div><b>ainda não</b>"));
        return;
      }
      var b = el("div", "barra", "<span>" + NOMES[pi - 1] + "</span><div class='tr'><i></i></div><b>" + p + "/" + nt + "</b>");
      bar.appendChild(b);
      setTimeout(function(){ b.querySelector("i").style.width = (nt ? p / nt * 100 : 0) + "%"; }, 400);
    })(pi);
  }
  /* ⭐ O PARECER DA CRIANÇA. O currículo de Blumenau diz que a avaliação orienta
     *"o professor E O ESTUDANTE acerca de quais objetivos foram alcançados"*, e
     que *"mostrar o que sabe ou o que não sabe é pertinente, faz parte do
     crescimento e não da exclusão"*. Então ela vê o que já sabe — na linguagem
     dela, sem número, sem a palavra "errou" e sem porcentagem.
     ⚠️ A ORDEM IMPORTA: primeiro o que ela JÁ SABE; o "vale treinar" vem depois
     e no máximo dois, senão a lista vira boletim de defeitos. */
  var jaSabe = [], treinar = [], q;
  for(q = 0; q < OBJETIVOS.length; q++){
    var Oq = OBJETIVOS[q], mq = mede(Oq.f);
    if(mq.tot === 0 || !mq.tent) continue;
    var pcq = Math.round(100 * mq.prim / mq.tent);
    (pcq >= 75 ? jaSabe : treinar).push(pcq >= 75 ? Oq.ok : Oq.n.toLowerCase());
  }
  var txt = "";
  if(jaSabe.length) txt = "Você já " + jaSabe.slice(0, 3).join("; ") + ".";
  else txt = "Você começou a reparar que o mesmo som pode se escrever de cinco jeitos — e isso é o principal!";
  if(treinar.length) txt += " Vale treinar mais: " + treinar.slice(0, 2).join(" e ") + ".";
  if(!completo)
    txt = "você fez " + abertas + " de " + NOMES.length + " folhas hoje — e olhe o "
        + "que já dá para ver: " + txt.charAt(0).toLowerCase() + txt.slice(1);
  /* ⚠️ SEM NOME, SEM PREFIXO. Com o prefixo fixo saía "Você, você já…" para a
     criança que não escreve o nome na capa — que é justamente a que mais precisa
     que a tela fale direito com ela. */
  var quem = (ST.nome || "").replace(/^\s+|\s+$/g, "");
  document.getElementById("resumo").innerHTML = quem
    ? "<b>" + esch(quem) + "</b>, " + txt.charAt(0).toLowerCase() + txt.slice(1)
    : txt.charAt(0).toUpperCase() + txt.slice(1);
  sFesta(); confete(40); falar("fim");
}
(function(){
  var m = document.getElementById("medalha"), t = null;
  function segura(){ t = setTimeout(function(){ abreRelatorio(); }, 2000); }
  function larga(){ if(t){ clearTimeout(t); t = null; } }
  m.addEventListener("pointerdown", segura);
  m.addEventListener("pointerup", larga);
  m.addEventListener("pointerleave", larga);
  m.addEventListener("pointercancel", larga);
})();

/* ============================================================
   O QUE A ATIVIDADE MEDE — e como isso vira PARECER e NOTA

   ⚠️ A NOTA FICA COM O PROFESSOR. A Instrução Normativa SEMED nº 1/2017, art.
   3º, citada no currículo de Blumenau, manda avaliar *"com preponderância dos
   aspectos qualitativos sobre os quantitativos"*. O parecer vai para a criança;
   o número fica só aqui.
   ⚠️ E NÃO SE CONTA TUDO IGUAL: acerto de primeira vale 1,0 e acerto com ajuda
   vale 0,6 — o relatório mostra os dois lado a lado, para o professor ver a
   nota E o esforço que ela custou. O critério sai impresso por exigência da
   mesma Instrução (*"a exposição de critérios utilizados"*).
   ============================================================ */
var PESO_PRIMEIRA = 1.0, PESO_COM_AJUDA = 0.6;

/* ⚠️ ESTA LISTA E O `curriculo.json` SÃO A MESMA COISA, ditas para dois
   leitores: aqui em palavras que o professor lê no relatório, lá no vocabulário
   do currículo da rede. O portão `_qa/pedagogo_curriculo.py` reprova se os nomes
   e as folhas não baterem um a um. Os números são POSIÇÕES de folha: mudou a
   ordem, mudam aqui e no `curriculo.json`, no mesmo commit. *//* ⚠️ ESTA LISTA E O `curriculo.json` SÃO A MESMA COISA, ditas para dois
   leitores: aqui em palavras que o professor lê no relatório, lá no vocabulário
   do currículo da rede. O portão `_qa/pedagogo_curriculo.py` reprova se os
   nomes e as folhas não baterem um a um, e também se alguma folha de trabalho
   ficar sem objetivo que a meça. Os números são POSIÇÕES de folha.
   Ex.: {n: "Distinguir X de Y", f: [1, 2, 3],
         ok:  "faz o que o objetivo pede, em palavras do professor",
         nao: "o que ainda não faz — sem a palavra 'errou'"}  */
var OBJETIVOS = [
  /* ⚠️ ESTA LISTA E O `curriculo.json` SÃO A MESMA COISA, e o portão 0b9 reprova
     se divergirem — nome por nome e folha por folha. */
  {n: "Ouvir e achar a sílaba mais forte da palavra", f: [1, 2, 3, 4, 5, 6, 19, 20]},
  {n: "Descobrir a regra sozinha e então receber os três nomes", f: [7, 8]},
  {n: "Contar de trás para a frente: última, penúltima, antepenúltima", f: [9, 10]},
  {n: "Classificar a palavra em oxítona, paroxítona ou proparoxítona", f: [11, 12, 13, 14, 15, 16, 21, 25, 26, 28, 29, 34]},
  {n: "Partir a palavra em sílabas e escrever a que leva a força", f: [17, 18, 30, 31, 32, 33]},
  {n: "Achar e classificar a palavra dentro de um texto ou de uma cantiga", f: [22, 23, 24]},
  {n: "Saber que o acento é pista, e não regra", f: [27]},
  {n: "Escrever a própria palavra de cada classe", f: [35]}
];

function mede(folhas){
  var prim = 0, ajuda = 0, tot = 0, tentados = 0, k, j;
  for(k = 0; k < folhas.length; k++){
    var ids = idsDaPagina(folhas[k]);
    tot += ids.length;
    for(j = 0; j < ids.length; j++){
      var t = ST.tent[ids[j]];
      if(t) tentados++;
      if(!t || !t.ok) continue;
      if(t.erros === 0) prim++; else ajuda++;
    }
  }
  return {prim: prim, ajuda: ajuda, tot: tot, tent: tentados,
          pontos: prim * PESO_PRIMEIRA + ajuda * PESO_COM_AJUDA,
          pc: tot ? Math.round(100 * prim / tot) : 0};
}

function abreRelatorio(){
  var r = document.getElementById("relatorio");
  var linhas = "", domina = [], retomar = [], k;
  var pontos = 0, total = 0, primG = 0, ajudaG = 0, tentG = 0;
  var naoAlcancou = [];
  var folhasFeitas = 0, fz;
  for(fz = 1; fz <= NOMES.length; fz++){
    var idf = idsDaPagina(fz), tocou = false, y;
    for(y = 0; y < idf.length; y++) if(ST.tent[idf[y]]) { tocou = true; break; }
    if(tocou) folhasFeitas++;
  }
  var inteiro = folhasFeitas >= NOMES.length;

  for(k = 0; k < OBJETIVOS.length; k++){
    var O = OBJETIVOS[k], m = mede(O.f);
    pontos += m.pontos; total += m.tot; primG += m.prim; ajudaG += m.ajuda;
    tentG += m.tent;
    /* ⚠️⚠️ O QUE DECIDE É O QUE ELA FEZ. Antes, num caderno não terminado, o
       objetivo cujas folhas ela nem alcançou entrava em "retomar" com 0% — e o
       parecer dizia "precisa retomar" de uma criança que tinha ido bem no que
       deu tempo de fazer. Um julgamento errado com cara de medida, contra a
       criança. Objetivo não tocado não entra em lista nenhuma. */
    var pcObj = m.tent ? Math.round(100 * m.prim / m.tent) : -1;
    if(pcObj < 0) naoAlcancou.push(O.n.toLowerCase());
    else if(pcObj >= 75) domina.push(O.ok);
    else retomar.push(O.n.toLowerCase() + " (" + pcObj + "%)");
    var pcf = m.tent ? Math.round(100 * m.prim / m.tent) : 0;
    linhas += "<tr><td>" + esch(O.n) + "</td><td>" + m.prim + "/" + m.tot +
      "</td><td><b>" + m.pc + "%</b></td><td>" +
      (m.tent ? "<b>" + pcf + "%</b> <small>(" + m.prim + "/" + m.tent + ")</small>"
              : "<small>não fez</small>") + "</td><td>" + m.ajuda + "</td></tr>";
  }

  /* ⚠️ A NOTA DE UM CADERNO NÃO TERMINADO SE MEDE NO QUE FOI FEITO. Dividir
     pelos itens que ela nunca viu dá uma nota que não fala dela — fala do
     relógio. Com o caderno completo, os dois denominadores são o mesmo número. */
  var baseNota = inteiro ? total : tentG;
  var nota = baseNota ? Math.round(100 * pontos / baseNota) / 10 : 0;
  var pc = baseNota ? Math.round(100 * primG / baseNota) : 0;
  var conceito = !baseNota ? "Sem dados" :
    nota >= 8.5 ? "Dominou" : nota >= 6 ? "Está construindo" : "Precisa retomar";
  if(!inteiro) conceito += " (parcial)";

  var nome = esch(ST.nome || "O aluno");
  var parecer = nome + " ";
  if(domina.length && !retomar.length && !naoAlcancou.length)
    parecer += "domina os objetivos avaliados: " + domina.join("; ") + ".";
  else if(domina.length)
    parecer += "já " + domina.join("; ") + ". Ainda precisa retomar: " + retomar.join(", ") + ".";
  else
    parecer += "está começando a perceber que letras diferentes fazem o mesmo som. Nenhum " +
      "objetivo chegou a 75% de acerto de primeira — vale retomar ORALMENTE, ditando cinco " +
      "palavras por dia e perguntando POR QUE se escreve com aquela letra, antes de voltar " +
      "à tela. A regra dita em voz alta fixa mais do que a palavra copiada dez vezes.";
  if(naoAlcancou.length)
    parecer += " Ainda não chegou a fazer (a aula acabou antes): " + naoAlcancou.join(", ") + ".";

  var h = "<b>Relatório do professor</b> &mdash; " + nome + " &middot; " +
    Math.round((Date.now() - (ST.inicio || Date.now())) / 60000) + " min" +
    "<div class='notao'><span class='nn'>" + nota.toFixed(1).replace(".", ",") + "</span>" +
    "<span class='nl'><b>" + conceito + "</b><br>" + primG + " de " + baseNota +
    " de primeira (" + pc + "%)<br>" + ajudaG + " com ajuda</span></div>" +
    "<p class='parecer'>" + parecer + "</p>" +
    (inteiro ? "" :
      "<p class='avisoparcial'><b>Caderno não terminado:</b> " + folhasFeitas +
      " de " + NOMES.length + " folhas. A coluna <b>%</b> conta o caderno inteiro; " +
      "a coluna <b>do que fez</b> conta só o que a criança chegou a responder — " +
      "é esta que diz como ela foi.</p>") +
    "<table><tr><th>Objetivo</th><th>De primeira</th><th>%</th>" +
    "<th>do que fez</th><th>Com ajuda</th></tr>" + linhas + "</table>" +
    "<p class='comonota'>Nota de 0 a 10: acerto de primeira vale 1,0 e acerto com ajuda vale 0,6. " +
    "A criança não vê este número — ele fica só aqui.</p>" +
    "<p class='comonota'><b>O que este caderno NÃO mede:</b> várias das folhas de papel que " +
    "deram origem a ele terminam em <b>&ldquo;copie no seu caderno&rdquo;</b> e " +
    "<b>&ldquo;classifique no caderno&rdquo;</b> &mdash; e a tela não corrige o que a criança " +
    "escreve à mão. O que dá para medir aqui é reconhecer, marcar e escrever com o teclado. " +
    "<b>A cópia e o ditado no papel continuam sendo do professor</b>, e a folha 22 existe para " +
    "isso: a criança sai daqui com o quadro de regras dela para copiar no caderno.</p>";
  r.innerHTML = h; r.style.display = "block"; sPasso();
}
function esch(t){
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------- retomar, chave mestra e a partida ---------- */
var CHAVE_MESTRA = "1275@";
function abreMenuProf(){
  var cx = document.getElementById("mpFolhas");
  if(!cx.childNodes.length){
    var mk = function(rot, alvo){
      var b = el("button", null, rot);
      b.onclick = function(){ fechaMenuProf(); vaiPara(alvo); };
      cx.appendChild(b);
    };
    mk("Capa", 0);
    /* ⚠️ `NOMES.length` e não um número cravado: com "10" escrito aqui, um
       caderno de 25 folhas mostrava só as dez primeiras no menu do professor —
       e as quinze restantes ficavam sem como conferir. */
    for(var k = 1; k <= NOMES.length; k++) mk(k + ". " + NOMES[k - 1], k);
  }
  calar(); document.getElementById("menuProf").className = "aberto";
}
function fechaMenuProf(){ document.getElementById("menuProf").className = ""; }
document.getElementById("mpFechar").onclick = fechaMenuProf;
document.getElementById("menuProf").onclick = function(ev){ if(ev.target === this) fechaMenuProf(); };
document.getElementById("nomeIn").oninput = function(){
  if(this.value.indexOf(CHAVE_MESTRA) > -1){ this.value = ST.nome || ""; abreMenuProf(); return; }
  ST.nome = this.value.slice(0, 24); espelhaNome(ST.nome); salvar();
};
document.getElementById("nomeIn").onkeydown = function(ev){ if(ev.key === "Enter"){ ev.preventDefault(); this.blur(); } };
document.getElementById("bComecar").onclick = function(){ ac(); sPasso(); if(!ST.inicio) ST.inicio = Date.now(); vaiPara(1); };
document.getElementById("bAnt").onclick = function(){ sPasso(); vaiPara(Math.max(0, ST.pag - 1)); };
document.getElementById("bProx").onclick = function(){
  sPasso();
  if(ST.pag === PAGEL.length - 1 && pendentes(ST.pag) === 0) return fim();
  vaiPara(Math.min(PAGEL.length - 1, ST.pag + 1));
};
document.getElementById("bOuvir").onclick = function(){ ac(); if(ultimaFala) falar(ultimaFala); };
document.getElementById("bVoz").onclick = function(){
  vozLigada = !vozLigada; this.className = vozLigada ? "zap" : "zap off";
  if(!vozLigada) calar(); else falar("vozOn");
};
document.getElementById("bRever").onclick = function(){ sPasso(); vaiPara(1); };
document.getElementById("bRecomecar").onclick = function(){
  sPasso(); try{ localStorage.removeItem(CHAVE_LS); }catch(e){}
  ST = {pag: 0, nome: ST.nome, folha: novaFolha(), resp: {}, lig: {}, tent: {}, prontas: {}, inicio: 0};
  monta(); vaiPara(0); falarDepois("novoCaderno", 400);
};
document.getElementById("bContinuar").onclick = function(){ ac(); sPasso(); vaiPara(ST.pag || 1); };
document.getElementById("bZerar").onclick = function(){ document.getElementById("bRecomecar").onclick(); };

(function boot(){
  var velho = carregar();
  if(velho && velho.folha){
    ST = velho;
    if(!ST.resp) ST.resp = {}; if(!ST.lig) ST.lig = {}; if(!ST.tent) ST.tent = {}; if(!ST.prontas) ST.prontas = {};
    /* ⚠️ TRAVA 2 — A REDE DE SEGURANÇA. Se montar a partir da memória estourar
       por qualquer motivo que eu não previ, o caderno joga a memória fora e
       abre LIMPO. Perder o "continuar de onde parou" é ruim; ficar com uma tela
       morta a aula toda é muito pior. */
    try{ monta(); }
    catch(erroMemoria){
      try{ localStorage.removeItem(CHAVE_LS); }catch(e3){}
      ST = {pag: 0, nome: ST.nome, folha: novaFolha(), resp: {}, lig: {}, tent: {}, prontas: {}, inicio: 0};
      monta(); vaiPara(0); return;
    }
    document.getElementById("retomar").style.display = "block";
    document.getElementById("retTxt").textContent =
      (ST.nome ? ST.nome + ", você" : "Você") + " parou na folha " + (ST.pag || 1) + ": " + NOMES[(ST.pag || 1) - 1] + ".";
    document.getElementById("nav").style.display = "none";
  } else {
    ST.folha = novaFolha(); monta(); vaiPara(0);
  }
})();

/*<dossie-js>*/
/* ============================================================
   DOSSIÊ PEDAGÓGICO — o que o PROFESSOR vê quando abre a atividade

   ⭐ PEDIDO DO MARCOS (set/2026): *"preciso que quando um professor olhe e
      analise a atividade ele veja que está ótima"*.

   O buraco que isto fecha: o parecer pedagógico de cada caderno existia — mas
   morava num arquivo `.md` DENTRO DO REPOSITÓRIO, que nenhum professor abre.
   Quem olhava a atividade via um joguinho bonito e não tinha como saber se
   aquilo estava alinhado ao currículo da rede. Agora o alinhamento está DENTRO
   da atividade, a um toque — e a qualquer momento, não só no fim.

   ⚠️ E não é texto solto: cada habilidade citada aqui vem do
   `<pasta>/curriculo.json`, e o portão `_qa/pedagogo_curriculo.py` reprova se a frase
   citada não existir, palavra por palavra, no `_curriculo/blumenau.txt`, ou se
   os objetivos do relatório e os do currículo não baterem um a um. Citação de
   currículo é a única coisa que o professor NÃO tem como conferir sozinho sem
   abrir 440 páginas de PDF — por isso ela é medida.

   Abre por dois caminhos: o botão no menu do professor (chave mestra 1275@,
   vale a qualquer hora) e o botão dentro do relatório, no fim.

   Este arquivo é a FONTE: `python3 _padrao/dossie_professor.py <pasta>` injeta o CSS, o
   trecho de tela e este código no caderno. Não editar a cópia injetada.
   ============================================================ */
function dossieCita(s){
  var m = String(s || "").match(/[“"]([^”"]+)[”"]/);
  return m ? m[1] : String(s || "");
}
function dossieHTML(){
  var C = (typeof CURRICULO === "object" && CURRICULO) ? CURRICULO : null;
  if(!C) return "<p>Este caderno ainda não declarou o currículo.</p>";
  var h = "", k, o;
  h += "<p class='dfonte'><b>" + esch(C.componente) + " &middot; " + C.ano +
       "º ano.</b> " + esch(C.rede) + ". As habilidades abaixo estão " +
       "<b>copiadas do documento oficial, palavra por palavra</b> &mdash; nenhuma " +
       "foi reescrita nem resumida.</p>";
  h += "<table><tr><th>O que a atividade mede</th><th>Folhas</th>" +
       "<th>Habilidade do currículo da rede</th></tr>";
  for(k = 0; k < C.objetivos.length; k++){
    o = C.objetivos[k];
    h += "<tr><td>" + esch(o.objetivo) + "</td><td>" + o.folhas.join(", ") +
         "</td><td>&ldquo;" + esch(dossieCita(o.habilidade)) + "&rdquo;" +
         "<span class='dobj'>" + esch(o.pratica) + " &middot; " +
         esch(o.objeto) + "</span></td></tr>";
  }
  h += "</table>";

  h += "<p class='dsub'><b>A escada didática</b> &mdash; uma folha por degrau, e " +
       "nenhuma repete o gesto da anterior:</p><ol class='descada'>";
  for(k = 0; k < NOMES.length; k++) h += "<li>" + esch(NOMES[k]) + "</li>";
  h += "</ol>";

  h += "<p class='dsub'><b>Como a criança é avaliada</b></p>" +
       "<p class='dtxt'>O relatório do professor (no fim, segurando a medalha por " +
       "2 segundos) traz, por objetivo: quantos itens ela acertou <b>de primeira</b>, " +
       "quantos precisou de ajuda e a porcentagem. A partir de 75% de acerto de " +
       "primeira o objetivo conta como dominado. Sai também um parecer em palavras " +
       "&mdash; do jeito que se escreve no bimestral &mdash; e uma nota de 0 a 10 " +
       "que <b>a criança não vê</b>. Dentro da atividade não há nota, nem ranking, " +
       "nem a palavra &ldquo;errou&rdquo;: o erro responde na hora e diz o que " +
       "olhar, e a ajuda cresce a cada tentativa (dica &rarr; apoio concreto &rarr; " +
       "revelar).</p>";

  if(C.evidencia && C.evidencia.length){
    h += "<p class='dsub'><b>O que foi medido antes de publicar</b></p><ul class='dev'>";
    for(k = 0; k < C.evidencia.length; k++) h += "<li>" + esch(C.evidencia[k]) + "</li>";
    h += "</ul>";
  }
  return h;
}
function abreDossie(){
  var cx = document.getElementById("dsCorpo");
  if(!cx) return;
  if(typeof calar === "function") calar();
  cx.innerHTML = dossieHTML();
  document.getElementById("dossie").className = "aberto";
  cx.scrollTop = 0;
}
function fechaDossie(){ document.getElementById("dossie").className = ""; }
(function(){
  var b = document.getElementById("bDossie"), f = document.getElementById("dsFechar"),
      cx = document.getElementById("dossie");
  if(b) b.onclick = function(){ fechaMenuProf(); abreDossie(); };
  if(f) f.onclick = fechaDossie;
  if(cx) cx.onclick = function(ev){ if(ev.target === this) fechaDossie(); };

  /* o segundo caminho: o botão nasce DENTRO do relatório, quando ele abre.
     Fica ali e não na tela final porque o relatório é a parte que a criança
     não vê — e o dossiê é conversa de adulto. */
  if(typeof abreRelatorio === "function"){
    var antes = abreRelatorio;
    abreRelatorio = function(){
      antes.apply(this, arguments);
      var r = document.getElementById("relatorio");
      if(r && !r.querySelector(".bdossie")){
        var bt = document.createElement("button");
        bt.className = "bt bdossie";
        bt.textContent = "Dossiê pedagógico (currículo da rede)";
        bt.onclick = abreDossie;
        r.appendChild(bt);
      }
    };
  }
}());
/*</dossie-js>*/

/* ⭐ o botão "Terminar" e o "Voltar para o caderno" — ver o comentário do fim() */
(function(){
  var bt = document.getElementById("bTerminar");
  if(bt) bt.onclick = function(){
    var falta = 0, pz;
    for(pz = 1; pz <= NOMES.length; pz++) falta += pendentes(pz);
    if(falta && !confirm("Quer fechar o caderno e ver o seu boletim?\n\nVocê pode voltar depois e continuar de onde parou."))
      return;
    fim();
  };
  var bv = document.getElementById("bVoltar");
  if(bv) bv.onclick = function(){
    document.getElementById("fim").style.display = "none";
    vaiPara(ST.pag || 1);
  };
})();

/* ============================================================
   AS PEÇAS DESTE CADERNO.

   ⚠️ NENHUMA FOI REESCRITA (regra da casa, `_padrao/INTERATIVIDADES-FOLHA.md`):
      `cortaPalavra`, `marqueConfira`, `estojo`/`pintavel` e `montaOrdenar` vêm
      do `_sil2`; `cruzadinha` e a memória vêm do `_corpo5` (que as trouxe do
      `_jogo1`); `gavetasFig` e `folhaTexto` vêm do `_sil3`, o caderno de
      sílabas do 3º ano, que é o irmão deste.
      O que eu escrevi aqui foi o CONTEÚDO e a peça NOVA deste assunto — a
      `tocaTonica`, que não existia em casa nenhuma.
   ============================================================ */

/* a sílaba fala pelo RECORTE da palavra inteira (`_padrao/silabas_voz.py`),
   nunca por síntese solta: entregue "TA" à voz e ela soletra "tê-á". */
function falaDaSilaba(sb){
  return function(){ falarSilaba(null, 0, String(sb).toUpperCase()); };
}

/* ---------- ⭐ A PEÇA NOVA: TOCAR NA SÍLABA MAIS FORTE ----------
   Ela nasce do comando das folhas d11 e d20 (*"Circule a sílaba tônica de cada
   palavra"*) e da d40 (*"Sublinhe as sílabas tônicas"*), e não existia em
   caderno nenhum desta casa.

   ⭐ E ELA É O MOTIVO DE ESTE CADERNO EXISTIR NA TELA. No papel a criança
      acerta olhando o ACENTO, porque metade dos exemplos o tem — em CADERNO,
      ESPELHO e BANANA não há acento nenhum e ela chuta. Aqui cada sílaba tem o
      SEU alto-falante: a criança ouve pedaço por pedaço e escolhe o que a voz
      diz mais forte. É o que o papel não pode dar.

   ⚠️ A RESPOSTA É A POSIÇÃO, não o texto: `s0`, `s1`, `s2`. Registrar a sílaba
      escrita faria o portão `_qa/resposta_impressa.py` acusar, com razão, que a
      resposta está impressa na tela — e ela estaria.
   ⚠️ E o alto-falante de cada sílaba vem do `opcoes`, que já o desenha irmão do
      botão (regra do Marcos, 20/set/2026: *"o alto-falante discreto para clicar
      caso o estudante queira ouvir"* — ANTES de escolher, não depois). */
function tocaTonica(d, pi, texto, fonte, comFigura){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, texto, "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var P = fonte[k], id = "n" + pi + "_" + i, box = item(i + 1);
    var lin = el("div", "enunlin");
    if(comFigura && P.f) lin.appendChild(el("div", "figcx", img(P.f, "fig", P.p)));
    lin.appendChild(el("div", "palgrande", P.p));
    lin.appendChild(botaoSom("Ouvir a palavra inteira",
      function(){ falar("pal_" + chaveQuadro(P.p)); }));
    box.appendChild(lin);
    var ops = P.s.map(function(sb, n){
      return {v: "s" + n, rot: sb, aria: sb, fala: falaDaSilaba(sb)};
    });
    opcoes(box, pi, id, ops, "s" + P.t, "sil",
           "certo" + pi + "_" + k, "dica" + pi + "_" + k);
    fechaItem(d, box, id);
  });
}

/* ---------- CORTAR A PALAVRA — do `_sil2` ----------
   ⚠️ O ALVO É A FRESTA, NÃO A LETRA, e ela precisa de 40 px de toque (portão
      `4b`). Daí a fresta ser larga e o quadradinho da letra, estreito. */
function cortaPalavra(box, id, pi, palavra, cortes, fCerto, fDica, aoFechar){
  var feito = !!ST.resp[id];
  registra(id, pi, cortes.map(function(n){ return "g" + n; }).join(" "));
  var lin = el("div", "cortar"), achados = {}, n;
  for(n = 0; n < palavra.length; n++){
    lin.appendChild(el("span", "clt", palavra.charAt(n)));
    if(n < palavra.length - 1){
      (function(pos){
        var certo = cortes.indexOf(pos) > -1;
        var f = el("button", "fresta" + (feito && certo ? " cortada" : ""), "");
        f.setAttribute("aria-label", "cortar depois da letra " + palavra.charAt(pos - 1));
        f.setAttribute("data-qa", certo ? "op-" + id + "-g" + pos : "no-" + id + "-" + pos);
        f.onclick = function(){
          if(ST.resp[id]) return;
          sPasso();
          if(!certo){
            f.className = "fresta nao";
            setTimeout(function(){ f.className = "fresta"; }, 420);
            errou(id, fDica); return;
          }
          if(achados["g" + pos]) return;
          achados["g" + pos] = 1; f.className = "fresta cortada";
          var quantas = 0, q;
          for(q in achados) if(achados.hasOwnProperty(q)) quantas++;
          if(quantas === cortes.length){
            acertou(id, fCerto); box.className = "item feito";
            if(aoFechar) aoFechar();
          } else sPasso();
        };
        lin.appendChild(f);
      })(n + 1);
    }
  }
  box.appendChild(lin);
}

/* ---------- MARCAR VÁRIOS + CONFERIR — do `_sil2` ----------
   A criança marca quantas quiser e só depois confirma — é isso que a deixa se
   corrigir, que numa folha de oito anos vale mais que acertar de primeira. */
function marqueConfira(box, id, pi, pecas, fCerto, fDica){
  var feito = !!ST.resp[id], marcadas = {}, bts = [];
  registra(id, pi, pecas.filter(function(p){ return p.ok; })
                        .map(function(p){ return p.k; }).join(" "));
  var cx = el("div", "sils");
  pecas.forEach(function(P){
    var b = el("button", "sil larga" + (feito && P.ok ? " ok" : ""), P.t);
    b.setAttribute("aria-label", P.t);
    b.setAttribute("data-qa", (P.ok ? "op-" : "no-") + id + "-" + P.k);
    b.onclick = function(){
      if(ST.resp[id]) return;
      sPasso();
      if(P.fala) P.fala();
      if(marcadas[P.k]){ delete marcadas[P.k]; b.className = "sil larga"; }
      else { marcadas[P.k] = 1; b.className = "sil larga marcada"; }
    };
    cx.appendChild(b); bts.push({b: b, P: P});
  });
  box.appendChild(cx);
  var cf = el("button", "bt verde pronto", "Conferir");
  cf.setAttribute("data-qa", "conferir-" + id);
  cf.onclick = function(){
    if(ST.resp[id]) return;
    var certo = true;
    bts.forEach(function(x){ if(!!marcadas[x.P.k] !== !!x.P.ok) certo = false; });
    if(certo){
      bts.forEach(function(x){ if(x.P.ok) x.b.className = "sil larga ok"; });
      acertou(id, fCerto); box.className = "item feito"; cf.style.display = "none";
    } else {
      sErro(); cx.className = "sils erro";
      setTimeout(function(){ cx.className = "sils"; }, 480);
      errou(id, fDica);
    }
  };
  if(feito) cf.style.display = "none";
  box.appendChild(cf);
}

/* ---------- PINTAR PELA LEGENDA — do `_sil2` ----------
   ⚠️ CONTRATO: o estojo publica `lapis-<cor>` e cada alvo publica
      `pinta-<id>-<n>` mais `data-lapis="<cor>"`. Sem isso o jogador da banca
      pinta tudo com a primeira cor e acusa a folha de não fechar. */
var LAPIS = null;
function estojo(d, cores){
  var cx = el("div", "estojo");
  cores.forEach(function(C){
    var b = el("button", "cnt cnt-" + C.k, C.n);
    b.setAttribute("data-qa", "lapis-" + C.k);
    b.setAttribute("aria-label", "canetinha das palavras " + C.n);
    b.onclick = function(){
      sPasso(); LAPIS = C.k;
      var t = cx.querySelectorAll(".cnt"), i;
      for(i = 0; i < t.length; i++) t[i].className = t[i].className.replace(" pega", "");
      b.className += " pega";
      falar("lapis_" + C.k);
    };
    cx.appendChild(b);
  });
  d.appendChild(cx);
  return cx;
}
function pintavel(el2, id, pi, cor, fCerto, fDica, box){
  el2.setAttribute("data-qa", "pinta-" + id + "-0");
  el2.setAttribute("data-lapis", cor);
  if(ST.resp[id]) el2.className += " pin pin-" + cor;
  el2.onclick = function(){
    if(ST.resp[id]) return;
    if(!LAPIS){ sPasso(); falar("pegue_lapis"); return; }
    sPasso();
    if(LAPIS === cor){
      el2.className += " pin pin-" + cor;
      acertou(id, fCerto); if(box) box.className = "item feito";
    } else {
      el2.className += " sacode";
      setTimeout(function(){ el2.className = el2.className.replace(" sacode", ""); }, 420);
      errou(id, fDica);
    }
  };
}

/* ---------- MONTAR A PALAVRA TOCANDO AS SÍLABAS — do `_sil2` ---------- */
function montaOrdenar(d, pi, fonte){
  ST.folha["p" + pi].forEach(function(k, i){
    var O = PAL[fonte[k].k], id = "n" + pi + "_" + i, box = item(i + 1);
    var certo = [], n;
    for(n = 0; n < O.s.length; n++) certo.push("s" + n);
    registra(id, pi, certo.join(" "));
    var lin = el("div", "enunlin");
    lin.appendChild(el("div", "ajuda", "Ouça a palavra e monte-a."));
    lin.appendChild(botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(O.p)); }));
    box.appendChild(lin);
    var vaga = el("div", "vagas"), feitas = 0, cxs = [], t;
    for(t = 0; t < O.s.length; t++){
      var c = el("span", "cxs2", "");
      cxs.push(c); vaga.appendChild(c);
    }
    if(ST.resp[id]) vaga.innerHTML = '<span class="cxs2 cheia">' +
      O.s.slice(0).join('</span><span class="cxs2 cheia">') + "</span>";
    box.appendChild(vaga);
    var cx = el("div", "sils");
    baralha(O.s.map(function(sb, n2){ return {sb: sb, n: n2}; })).forEach(function(P){
      var b = el("button", "sil", P.sb);
      b.setAttribute("aria-label", P.sb);
      b.setAttribute("data-qa", "op-" + id + "-s" + P.n);
      b.onclick = function(){
        if(ST.resp[id]) return;
        sPasso(); falaDaSilaba(P.sb)();
        if(P.n !== feitas){
          b.className = "sil nao";
          setTimeout(function(){ b.className = "sil"; }, 420);
          errou(id, "dica" + pi + "_" + k); return;
        }
        b.className = "sil usada";
        cxs[feitas].innerHTML = P.sb; cxs[feitas].className = "cxs2 cheia";
        feitas++;
        if(feitas === O.s.length){ acertou(id, "certo" + pi + "_" + k); box.className = "item feito"; }
      };
      cx.appendChild(b);
    });
    box.appendChild(cx);
    fechaItem(d, box, id);
  });
}

/* ---------- AS GAVETAS COM A FIGURA — do `_sil3` ----------
   ⚠️ A peça que a criança pega é a FIGURA, e o motivo é didático: quem lê a
      palavra pode decorá-la; quem vê só o desenho tem de DIZER o nome para
      ouvir onde a força cai, que é o gesto do caderno. */
function gavetasFig(d, pi, gk, pede){
  faixa(d, pi, NOMES[pi - 1]);
  var G = GAV[gk];
  enunciado(d, pi, pede, "p" + pi + "enun");
  var cols = el("div", "colunas"), caixas = {}, listaC = [];
  G.cols.forEach(function(C){
    var c = el("div", "coluna");
    var t = el("div", "ctit", C.n);
    t.setAttribute("data-alvo", "1");
    c.setAttribute("data-qa", "alvo-gav" + pi + "_" + C.k);
    t.appendChild(botaoSom("Ouvir a regra desta gaveta", function(){ falar("gav_" + C.k); }));
    c.appendChild(t);
    var dentro = el("div", "cdentro");
    c.appendChild(dentro);
    c._v = C.k; c._dentro = dentro;
    caixas[C.k] = c; listaC.push(c);
    cols.appendChild(c);
  });
  d.appendChild(cols);
  var banco = el("div", "figbanco"), marcada = null;
  ST.folha["p" + pi].forEach(function(n, i){
    var P = G.pal[n], id = "n" + pi + "_" + i;
    registra(id, pi, ">gav" + pi + "_" + P.c);
    var b = el("button", "op figbt" + (ST.resp[id] ? " usada" : ""),
               img(P.f, "figmini", P.p));
    b.setAttribute("aria-label", P.p);
    b.setAttribute("data-qa", "item-" + id);
    b.setAttribute("data-alvo", "1");
    if(ST.resp[id]) caixas[P.c]._dentro.appendChild(el("span", "fdentro", P.p));
    function larga(col){
      if(ST.resp[id]) return;
      if(col._v === P.c){
        b.className = "op figbt usada";
        col._dentro.appendChild(el("span", "fdentro", P.p));
        if(marcada === b) marcada = null;
        acertou(id, "certo" + pi + "_" + n);
      } else {
        col.className = "coluna erro";
        setTimeout(function(){ col.className = "coluna"; }, 500);
        errou(id, "dica" + pi + "_" + n);
      }
    }
    b._larga = larga;
    b.onclick = function(){
      if(b._arrastou){ b._arrastou = false; return; }
      if(ST.resp[id]) return;
      sPasso(); falar("pal_" + chaveQuadro(P.p));
      if(marcada === b){ b.className = "op figbt"; marcada = null; return; }
      if(marcada) marcada.className = "op figbt";
      b.className = "op figbt marcada"; marcada = b;
    };
    puxavel(b, listaC, function(col){ larga(col); });
    banco.appendChild(b);
  });
  listaC.forEach(function(col){
    col.onclick = function(){
      if(!marcada){ sPasso(); falar("toque_figura"); return; }
      marcada._larga(col);
    };
  });
  d.appendChild(banco);
}

/* ---------- A CRUZADINHA — do `_corpo5` (que a trouxe do `_jogo1`) ---------- */
function cruzadinha(d, pi, DADOSC, prefFala){
  var pool = ST.folha["p" + pi];
  var mapa = {}, maxX = 0, maxY = 0, entradas = [];
  function poe(w, x, y, hor){
    var i;
    for(i = 0; i < w.length; i++){
      var cx = x + (hor ? i : 0), cy = y + (hor ? 0 : i);
      mapa[cx + "," + cy] = w.charAt(i);
      if(cx > maxX) maxX = cx;
      if(cy > maxY) maxY = cy;
    }
  }
  function cabe(w, x, y, hor){
    var i;
    for(i = 0; i < w.length; i++){
      var cx = x + (hor ? i : 0), cy = y + (hor ? 0 : i);
      var q = mapa[cx + "," + cy];
      if(q && q !== w.charAt(i)) return false;
      if(!q){
        var a = hor ? mapa[cx + "," + (cy - 1)] : mapa[(cx - 1) + "," + cy];
        var b = hor ? mapa[cx + "," + (cy + 1)] : mapa[(cx + 1) + "," + cy];
        if(a || b) return false;
      }
    }
    var antes = hor ? mapa[(x - 1) + "," + y] : mapa[x + "," + (y - 1)];
    var dep = hor ? mapa[(x + w.length) + "," + y] : mapa[x + "," + (y + w.length)];
    return !antes && !dep;
  }
  var linhaLivre = 0;
  pool.forEach(function(k, n){
    var w = DADOSC[k].p.replace(/[^A-ZÁÂÃÉÊÍÓÔÕÚÇ]/g, ""), col = null;
    if(!entradas.length){ col = {x: 0, y: 0, hor: true}; }
    else {
      var i, j, achou = null;
      for(i = 0; i < w.length && !achou; i++)
        for(j = 0; j < entradas.length && !achou; j++){
          var E = entradas[j], p;
          for(p = 0; p < E.w.length; p++){
            if(E.w.charAt(p) !== w.charAt(i)) continue;
            var hor = !E.hor;
            var x = hor ? E.x - i : E.x + p;
            var y = hor ? E.y + p : E.y - i;
            if(cabe(w, x, y, hor)){ achou = {x: x, y: y, hor: hor}; break; }
          }
        }
      col = achou || {x: 0, y: maxY + 2 + (linhaLivre++), hor: true};
    }
    poe(w, col.x, col.y, col.hor);
    entradas.push({k: k, w: w, x: col.x, y: col.y, hor: col.hor, n: n + 1});
  });
  var minX = 0, minY = 0, key;
  for(key in mapa){
    var pxy = key.split(","), px = +pxy[0], py = +pxy[1];
    if(px < minX) minX = px;
    if(py < minY) minY = py;
  }
  var env = el("div", "cruzenv"), grade = el("div", "cruz");
  var larg = maxX - minX + 1, alt = maxY - minY + 1;
  grade.style.gridTemplateColumns = "repeat(" + larg + ",-webkit-max-content)";
  grade.style.gridTemplateColumns = "repeat(" + larg + ",max-content)";
  var celula = {}, yy, xx;
  for(yy = 0; yy < alt; yy++) for(xx = 0; xx < larg; xx++){
    var ch = mapa[(xx + minX) + "," + (yy + minY)];
    if(!ch){ grade.appendChild(el("span", "ccel")); continue; }
    var c = el("button", "ccel viva", "");
    c.setAttribute("aria-label", "Casa da cruzadinha");
    c._x = xx + minX; c._y = yy + minY;
    celula[c._x + "," + c._y] = c;
    grade.appendChild(c);
  }
  env.appendChild(grade); d.appendChild(env);
  var pistas = el("div", "pistas");
  entradas.forEach(function(E, i){
    var id = "n" + pi + "_" + i;
    registra(id, pi, E.w);
    E.id = id; E.cels = []; E.rot = "Escreva a palavra " + E.n;
    var t;
    for(t = 0; t < E.w.length; t++){
      var cc = celula[(E.x + (E.hor ? t : 0)) + "," + (E.y + (E.hor ? 0 : t))];
      E.cels.push(cc);
      if(t === 0 && cc && !cc.querySelector(".cn")) cc.appendChild(el("span", "cn", E.n));
    }
    if(ST.resp[id]) E.cels.forEach(function(c2, t2){
      if(c2){ c2.className = "ccel viva ok"; c2.textContent = E.w.charAt(t2);
              if(t2 === 0) c2.appendChild(el("span", "cn", E.n)); } });
    var p = el("button", "pista" + (ST.resp[id] ? " feita" : ""),
               '<span class="pn">' + E.n + ".</span> " + DADOSC[E.k].d);
    p.setAttribute("data-qa", "esc-" + id);
    p.setAttribute("aria-label", "Pista " + E.n + " da cruzadinha");
    E.bt = p;
    p.onclick = function(){
      if(ST.resp[id]) return;
      sPasso(); falar(prefFala + E.k);
      abreCruz(E, pi);
    };
    pistas.appendChild(p);
    E.cels.forEach(function(c2){
      if(!c2) return;
      c2.addEventListener("click", function(){ if(!ST.resp[id]) abreCruz(E, pi); });
    });
  });
  d.appendChild(pistas);
}

/* ============================================================
   AS 35 FOLHAS. Cada bloco diz de qual folha de papel nasceu e o comando
   impresso VERBATIM. O crivo das quarenta está em
   `_sequencias/POTE-TONICA3.md`.

   ⚠️ A ESCADA, EM UMA LINHA: ouvir onde a voz bate mais forte (1-6) →
      descobrir a regra sozinha e só então receber os nomes (7-8) → contar de
      trás para a frente (9-10) → guardar na gaveta pela palavra (11-14) e pela
      figura (15-16) → partir a palavra e ver a força acender (17-19) → pintar,
      cantar e achar no texto (20-24) → decidir em série (25-26) → ⭐ entender
      que o acento é PISTA e não regra (27) → o quiz (28-29) → brincar com o
      que aprendeu (30-34) → escrever a sua palavra e dizer COMO achou (35).
   ============================================================ */

/* ===== BLOCO A — OUVIR ONDE A VOZ BATE MAIS FORTE (1 a 6) ===== */
/* ⭐ DAS FOLHAS d11 e d20 (*"Circule a sílaba tônica de cada palavra"*) e da
      d40 (*"Sublinhe as sílabas tônicas"*).
   ⚠️ O DEGRAU DAS SEIS É O APOIO QUE SOME, e o enunciado DIZ o que mudou —
      senão, para quem só ouve, é a mesma folha seis vezes (portão `0b14`).
      1: duas sílabas com figura · 2: três com figura · 3: quatro e mais sem
      figura · 4 a 6: **só palavras SEM ACENTO**, que é onde o papel falha. */
function f01(d, pi){
  tocaTonica(d, pi, "Toque no alto-falante e ouça a palavra. Depois ouça " +
    "<b>cada pedaço</b> e toque no que a voz diz <b>mais forte</b>.", PAL, 1);
}
function f02(d, pi){
  tocaTonica(d, pi, "O mesmo gesto, e <b>agora as palavras têm três pedaços</b>. " +
    "Ouça os três antes de escolher.", PAL, 1);
}
function f03(d, pi){
  tocaTonica(d, pi, "<b>Agora sem figura nenhuma</b> — só a palavra escrita e a " +
    "voz. Onde ela bate mais forte?", PAL, 0);
}
function f04(d, pi){
  tocaTonica(d, pi, "⚠️ <b>Agora nenhuma destas tem acento.</b> No papel dava " +
    "para adivinhar pelo acento; aqui só o ouvido resolve. Ouça pedaço por pedaço.",
    PAL, 1);
}
function f05(d, pi){
  tocaTonica(d, pi, "Sem acento e <b>agora sem figura também</b>. Diga a palavra " +
    "em voz alta antes de escolher: a sua própria voz ajuda.", PAL, 0);
}
function f06(d, pi){
  /* ⚠️ ESTE ENUNCIADO FOI CONSERTADO NA LEITURA FOLHA A FOLHA: ele dizia
     *"estas se parecem, e a força muda de lugar"* e o pote não tinha palavra
     parecida nenhuma — JAVALI, BONECA, CAVALO, JANELA, TATU e FELIZ não se
     parecem com nada. A folha das palavras parecidas é a 14, e ali elas se
     parecem de verdade (MÚSICA/MUSICAL). **Título que promete o que a folha
     não entrega é defeito, e portão nenhum o vê.** */
  tocaTonica(d, pi, "Sem acento outra vez, e <b>agora a força cai em lugares " +
    "diferentes</b>: numa palavra no fim, noutra no meio. Só ouvindo é que dá.",
    PAL, 0);
}

/* ===== BLOCO B — DESCOBRIR A REGRA E RECEBER OS NOMES (7 e 8) ===== */
/* ⭐⭐ A d09 é a melhor das quarenta, e é o Portão 0 da casa impresso em papel.
      VERBATIM: *"Leia os três grupos de palavras a seguir, tentando perceber
      qual é a posição da sílaba tônica em cada uma"* e depois *"Em qual desses
      grupos a sílaba tônica é sempre a última?"*.
   ⚠️ O PROBLEMA VEM PRIMEIRO E O NOME POR ÚLTIMO: na folha 7 a criança acha o
      padrão sozinha, e as palavras *oxítona*, *paroxítona* e *proparoxítona*
      só aparecem na 8. Seis folhas de ouvido antes de qualquer nome. */
function f07(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Três grupos de palavras. Ouça as quatro de cada grupo e " +
    "repare: <b>em cada grupo a força cai sempre no mesmo lugar</b>. " +
    "Responda embaixo.", "p" + pi + "enun");
  var cx = el("div", "cartaz");
  ["g1", "g2", "g3"].forEach(function(gk, n){
    var lin = el("div", "cartlin");
    var tit = el("div", "cartit", "<b>GRUPO " + (n + 1) + "</b>");
    lin.appendChild(tit);
    var lista = el("div", "sils");
    GRUPO[gk].pal.forEach(function(w){
      var wr = el("div", "opw");
      var b = el("button", "sil larga", w);
      b.setAttribute("aria-label", w);
      b.onclick = function(){ sPasso(); falar("pal_" + chaveQuadro(w)); };
      wr.appendChild(b);
      wr.appendChild(botaoSom("Ouvir esta palavra",
        (function(p){ return function(){ falar("pal_" + chaveQuadro(p)); }; })(w),
        "som somop"));
      lista.appendChild(wr);
    });
    lin.appendChild(lista);
    cx.appendChild(lin);
  });
  d.appendChild(cx);
  ST.folha["p" + pi].forEach(function(k, i){
    var id = "n" + pi + "_" + i, box = item(i + 1);
    var lin = el("div", "enunlin");
    lin.appendChild(el("div", "perg", PERG7[k].q));
    lin.appendChild(botaoSom("Ouvir a pergunta", function(){ falar("q7_" + k); }));
    box.appendChild(lin);
    opcoes(box, pi, id, [
      {v: "g1", rot: "GRUPO 1", aria: "grupo um", fala: "grupo_g1"},
      {v: "g2", rot: "GRUPO 2", aria: "grupo dois", fala: "grupo_g2"},
      {v: "g3", rot: "GRUPO 3", aria: "grupo três", fala: "grupo_g3"}
    ], PERG7[k].r, "pal", "certo" + pi + "_" + k, "dica" + pi + "_" + k);
    fechaItem(d, box, id);
  });
}
function f08(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Cada um daqueles grupos tem um <b>nome</b>. Toque no grupo " +
    "da esquerda e depois no nome dele, à direita.", "p" + pi + "enun");
  var grupo = ST.folha["p" + pi][0];
  var pares = grupo.map(function(k){
    return {k: k,
            esq: '<span class="rotop">' + NOMEGAV[k] + "</span>",
            dir: DIZGAV[k],
            ariaE: NOMEGAV[k], ariaD: DIZGAV[k],
            fe: "gav_" + k, fd: "gavd_" + k,
            fc: "certo" + pi + "_" + k, dica: "dica" + pi + "_" + k};
  });
  var cx = el("div", "");
  montaLigar(cx, pi, "g0", pares, d);
  d.appendChild(cx);
}

/* ===== BLOCO C — CONTAR DE TRÁS PARA A FRENTE (9 e 10) ===== */
/* ⭐ A d01 diz, VERBATIM: *"Para perceber a posição da sílaba tônica de uma
      palavra, conte a partir da última sílaba"*.
   ⚠️ NA TELA ISSO É GESTO, não quadro: a palavra aparece com as sílabas
      NUMERADAS DE TRÁS PARA A FRENTE, e a criança toca na que foi pedida. A
      d01 dá a regra escrita e pronto — e é por isso que a criança do papel
      decora em vez de entender. */
function folhaConta(d, pi, texto, comCartaz){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, texto, "p" + pi + "enun");
  if(comCartaz) cartazTres(d);
  ST.folha["p" + pi].forEach(function(k, i){
    var C = CONTA[k], P = PAL[C.k], id = "n" + pi + "_" + i, box = item(i + 1);
    var alvo = P.s.length - 1 - C.pede;       /* 0 = última, 1 = penúltima */
    var lin = el("div", "enunlin");
    lin.appendChild(el("div", "perg",
      "Qual é a <b>" + (C.pede ? "penúltima" : "última") + "</b> sílaba de " +
      P.p + "?"));
    lin.appendChild(botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(P.p)); }));
    box.appendChild(lin);
    var ops = P.s.map(function(sb, n){
      /* ⭐ o número de trás para a frente aparece NA PEÇA: é a régua da d01
         virando coisa que se vê, e some quando a criança já não precisa. */
      return {v: "s" + n, rot: sb + '<i class="tras">' + (P.s.length - n) + "</i>",
              aria: sb, fala: falaDaSilaba(sb)};
    });
    opcoes(box, pi, id, ops, "s" + alvo, "sil",
           "certo" + pi + "_" + k, "dica" + pi + "_" + k);
    fechaItem(d, box, id);
  });
}
function cartazTres(d){
  var cx = el("div", "cartaz");
  ["k1", "k2", "k3"].forEach(function(k){
    var l = el("div", "cartlin");
    l.appendChild(el("div", "cartit",
      "<b>" + NOMEGAV[k] + "</b><span>" + DIZGAV[k] + "</span>"));
    l.appendChild(botaoSom("Ouvir", (function(kk){
      return function(){ falar("gav_" + kk); }; })(k)));
    cx.appendChild(l);
  });
  d.appendChild(cx);
}
function f09(d, pi){
  folhaConta(d, pi, "Contar <b>de trás para a frente</b>: a última, a penúltima, " +
    "a antepenúltima. O número está em cada pedaço, e o cartaz está aí embaixo.", 1);
}
function f10(d, pi){
  folhaConta(d, pi, "<b>Agora sem o cartaz</b>, e com palavras mais compridas. " +
    "Os números continuam nos pedaços: conte com o dedo.", 0);
}

/* ===== BLOCO D — A GAVETA (11 a 14) ===== */
/* ⭐ A d07 manda *"Organize as palavras no quadro seguinte, de acordo com a
      posição da sílaba tônica"* e a d14 *"Separe as palavras oxítonas,
      paroxítonas e proparoxítonas"*.
   ⚠️ SÃO TRÊS GAVETAS, não quatro: no caderno de sílabas contavam-se PEDAÇOS
      (e há quatro tamanhos); aqui conta-se a POSIÇÃO da força, e ela só tem
      três lugares. */
function f11(d, pi){
  gavetas(d, pi, "gA", "Duas gavetas bem diferentes: a força no <b>fim</b> e a " +
    "força <b>três de trás para a frente</b>. Arraste, ou toque na palavra e " +
    "depois na gaveta.");
}
function f12(d, pi){
  gavetas(d, pi, "gB", "<b>Agora as três gavetas abertas.</b> Diga a palavra, " +
    "ouça onde a força cai e guarde-a.");
}
function f13(d, pi){
  gavetas(d, pi, "gC", "Três gavetas outra vez, e <b>agora com as palavras da " +
    "escola</b> — as que você vê todo dia.");
}
function f14(d, pi){
  gavetas(d, pi, "gD", "⭐ <b>Agora a mesma raiz, e a força MUDA de lugar.</b> " +
    "MÚSICA e MUSICAL, PÁSSARO e PASSARINHO. Quem decorou a palavra não resolve " +
    "esta: só quem ouve.");
}

/* ===== BLOCO E — ARRASTAR A FIGURA (15 e 16) ===== */
/* ⭐ A d10 manda, VERBATIM: *"Arraste as imagens abaixo até a coluna
      correspondente"* — é o papel pedindo arrastar com todas as letras. */
function f15(d, pi){
  gavetasFig(d, pi, "gE", "<b>Agora a peça é a figura, sem a palavra escrita.</b> " +
    "Toque nela para ouvir o nome, depois leve para a gaveta.");
}
function f16(d, pi){
  gavetasFig(d, pi, "gF", "As mesmas gavetas e <b>agora doze figuras</b>. " +
    "Toque em cada uma para ouvir antes de decidir.");
}

/* ===== BLOCO F — PARTIR A PALAVRA (17 a 19) ===== */
/* ⭐ A d03 manda, VERBATIM: *"Separe as palavras em sílabas, circule a sílaba
      tônica e escreva em que posição ela se encontra, conforme o modelo."*
   ⚠️ NA TELA A ORDEM É OUTRA E É MELHOR: a criança PARTE a palavra tocando nas
      frestas e, quando o último corte cai, **a sílaba forte se acende sozinha**.
      Ela vê a força aparecer em vez de ter de marcá-la. */
function folhaCortar(d, pi, texto, fonte){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, texto, "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var C = fonte[k], id = "n" + pi + "_" + i, box = item(i + 1);
    var P = null, kk;
    for(kk in PAL) if(PAL[kk].p === C.p) P = PAL[kk];
    var lin = el("div", "enunlin");
    lin.appendChild(el("div", "ajuda", "Toque onde a palavra se parte."));
    lin.appendChild(botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(C.p)); }));
    box.appendChild(lin);
    cortaPalavra(box, id, pi, C.p, C.g, "certo" + pi + "_" + k,
                 "dica" + pi + "_" + k, function(){
      if(!P) return;
      var x = el("div", "ajuda cent");
      x.appendChild(nomeSecreto("A força está em " + P.s[P.t] + ".", id));
      box.appendChild(x);
    });
    fechaItem(d, box, id);
  });
}
function f17(d, pi){
  folhaCortar(d, pi, "Parta a palavra tocando nas <b>frestas</b>. Quando o " +
    "último corte cair, o caderno mostra onde a força está.", COR);
}
function f18(d, pi){
  folhaCortar(d, pi, "<b>Agora as palavras compridas</b>, de quatro e cinco " +
    "pedaços. Diga-a devagar: cada pausa da sua voz é uma fresta.", COR);
}
/* 19 — AQUECIMENTO. ⚠️ Única folha que repete um gesto fora do bloco, e é de
   propósito: revisão espaçada (Roediger, Bjork). O gesto é o da folha 1 e as
   palavras são novas — a criança volta ao começo já sabendo os nomes. */
function f19(d, pi){
  tocaTonica(d, pi, "Uma parada para respirar: o gesto da <b>primeira folha</b>, " +
    "com palavras novas. Ouça cada pedaço e toque no mais forte.", PAL, 0);
}

/* ===== BLOCO G — PINTAR PELA LEGENDA (20 e 21) ===== */
/* ⭐ A d06 manda *"Pinte as sílabas tônicas de acordo com a legenda"* e a d18,
      *"PINTE AS PALAVRAS DE ACORDO COM A LEGENDA"*. São duas folhas porque a
      PEÇA muda: lá se pinta a sílaba, aqui a palavra inteira. */
function f20(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Pegue a canetinha da cor certa e pinte <b>a sílaba forte</b> " +
    "de cada palavra — a cor diz que nome a palavra tem.", "p" + pi + "enun");
  estojo(d, LEG);
  ST.folha["p" + pi].forEach(function(k, i){
    var P = PAL[k], id = "n" + pi + "_" + i, box = item(i + 1);
    registra(id, pi, P.c);
    var lin = el("div", "cortar");
    P.s.forEach(function(sb, n){
      var sp = el("span", "clt larga", sb);
      if(n === P.t) pintavel(sp, id, pi, P.c, "certo" + pi + "_" + k,
                             "dica" + pi + "_" + k, box);
      lin.appendChild(sp);
    });
    box.appendChild(lin);
    var b = botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(P.p)); });
    box.appendChild(b);
    fechaItem(d, box, id);
  });
}
function f21(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "<b>Agora pinte a palavra inteira</b>, não só a sílaba. " +
    "A legenda é a mesma.", "p" + pi + "enun");
  estojo(d, LEG);
  var cx = el("div", "sils");
  ST.folha["p" + pi].forEach(function(k, i){
    var P = PAL[k], id = "n" + pi + "_" + i;
    registra(id, pi, P.c);
    var wr = el("div", "opw");
    var b = el("span", "sil larga", P.p);
    pintavel(b, id, pi, P.c, "certo" + pi + "_" + k, "dica" + pi + "_" + k, null);
    wr.appendChild(b);
    wr.appendChild(botaoSom("Ouvir esta palavra",
      (function(p){ return function(){ falar("pal_" + chaveQuadro(p)); }; })(P.p),
      "som somop"));
    cx.appendChild(wr);
  });
  d.appendChild(cx);
  d.appendChild(el("div", "ajuda cent",
    "Pegue uma canetinha ali em cima e depois toque na palavra."));
}

/* ===== 22 — A CANTIGA (da d19) ===== */
/* ⭐ A d19 manda CANTAR a cantiga de roda e depois achar nela uma palavra de
      cada classe. É o único texto CANTADO das quarenta, e cantar é onde a
      criança de oito anos mais sente onde a força cai.
   ⚠️ Cantiga de domínio público. E os monossílabos do verso (SE, EU, UM, A,
      DO, MAR) NÃO são peça: monossílabo não se classifica em oxítona,
      paroxítona ou proparoxítona — isso é de outro ano. */
function f22(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  /* ⚠️ O ENUNCIADO DIZ QUANTAS SÃO, e isso é escolha, não descuido. Nesta
     cantiga SEIS das sete palavras destacadas são paroxítonas — é o que ela
     tem. Sem o aviso, a criança marca tudo e acerta por acaso; com ele, ela
     tem de achar QUAL é a que não é, e aí precisa ouvir as sete. */
  enunciado(d, pi, "Cante a cantiga em voz alta — cantando fica fácil ouvir a " +
    "força. Entre as palavras destacadas, <b>seis são paroxítonas e uma não é</b>. " +
    "Marque as seis e toque em Conferir.", "p" + pi + "enun");
  var cx = el("div", "cantiga");
  CANT.versos.forEach(function(verso){
    var lin = el("div", "cantlin");
    verso.forEach(function(w){ lin.appendChild(el("span", "tra", w)); });
    cx.appendChild(lin);
  });
  d.appendChild(cx);
  var b = botaoSom("Ouvir a cantiga", function(){ falar("cantiga"); });
  d.appendChild(b);
  var id = "n" + pi + "_0", box = item(0);
  marqueConfira(box, id, pi,
    Object.keys(CANT.pal).map(function(vk){
      var V = CANT.pal[vk];
      return {k: vk, t: V.p, ok: V.c === "k2" ? 1 : 0,
              fala: (function(p){ return function(){ falar("pal_" + chaveQuadro(p)); }; })(V.p)};
    }), "certo" + pi + "_a", "dica" + pi + "_a");
  fechaItem(d, box, id);
}

/* ===== BLOCO H — ACHAR NO TEXTO (23 e 24) ===== */
/* ⭐ O gesto vem da d32 (*"PALAVRAS FALADAS, PALAVRAS ESCRITAS"*), mas o texto
      dela é assinado e não se copia — estes dois são nossos.
   ⚠️ SÓ AS PALAVRAS DO QUADRO ENTRAM NA CONTA, e o enunciado diz isso. */
function folhaTexto(d, pi, chave, texto){
  faixa(d, pi, NOMES[pi - 1]);
  var T = TEX[chave];
  enunciado(d, pi, texto, "p" + pi + "enun");
  var lin = el("div", "enunlin");
  lin.appendChild(el("div", "textocx", T.texto));
  lin.appendChild(botaoSom("Ouvir o texto", function(){ falar("tex_" + chave); }));
  d.appendChild(lin);
  var id = "n" + pi + "_0", box = item(0);
  marqueConfira(box, id, pi, T.pecas.map(function(P){
    return {k: P.k, t: P.t, ok: P.ok,
            fala: (function(w){ return function(){ falar("pal_" + chaveQuadro(w)); }; })(P.t)};
  }), "certo" + pi + "_a", "dica" + pi + "_a");
  fechaItem(d, box, id);
}
function f23(d, pi){
  folhaTexto(d, pi, "t23", "Leia o texto e ouça-o. Entre as palavras do quadro, " +
    "marque <b>as oxítonas</b> — as que têm a força no fim — e confira.");
}
function f24(d, pi){
  folhaTexto(d, pi, "t24", "<b>Agora um texto maior</b>, e você procura as " +
    "<b>proparoxítonas</b> — as de força bem no começo. Marque e confira.");
}

/* ===== BLOCO I — O X NA COLUNA (25 e 26) ===== */
/* ⭐ A d17 manda, VERBATIM: *"Faça um X na coluna certa"*, com dezoito palavras.
      É o gesto mais rápido das quarenta, e por isso vem aqui: a criança já
      sabe decidir, e agora decide EM SÉRIE. */
function folhaXis(d, pi, texto){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, texto, "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var P = PAL[XIS[k]], id = "n" + pi + "_" + i, box = item(i + 1);
    var lin = el("div", "enunlin");
    lin.appendChild(el("div", "palgrande", P.p));
    lin.appendChild(botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(P.p)); }));
    box.appendChild(lin);
    opcoes(box, pi, id, ["k1", "k2", "k3"].map(function(c){
      return {v: c, rot: NOMEGAV[c], aria: NOMEGAV[c], fala: "gav_" + c};
    }), P.c, "pal", "certo" + pi + "_" + k, "dica" + pi + "_" + k);
    fechaItem(d, box, id);
  });
}
function f25(d, pi){
  folhaXis(d, pi, "Um X na coluna certa, palavra por palavra. Ouça e decida.");
}
function f26(d, pi){
  folhaXis(d, pi, "<b>Agora doze de uma vez.</b> Vá rápido: você já sabe. " +
    "Se travar numa, ouça-a outra vez.");
}

/* ===== 27 — ⭐ O ACENTO É PISTA, NÃO É REGRA (BLOCO DECLARADO) ===== */
/* ⚠️⚠️ ESTA FOLHA NÃO VEM DE FOLHA DE PAPEL NENHUMA, e é a mais importante do
      caderno. Nas quarenta colhidas, metade dos exemplos de oxítona tem acento
      (CAFÉ, CIPÓ, SOFÁ) — e a criança que faz aquelas folhas aprende, sem
      ninguém lhe dizer, a regra errada: *"é oxítona quando tem acento no fim"*.
      Aí ela trava em ANZOL, PAPEL e TAMBOR, que são oxítonas SEM acento, e em
      MÚSICA, que tem acento e é proparoxítona.
   ⚠️ E ela NÃO ensina acentuação (quando se PÕE o acento): isso é outra
      habilidade, mais adiante no mesmo ano, e é regra de ESCRITA. */
function f27(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Olhe os dois pares abaixo. Uma palavra tem acento e a outra " +
    "não — e <b>isso não decide nada</b>. Ouça as duas e diga se elas têm o " +
    "mesmo nome.", "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var Z = PIST[k], A = PAL[Z.a], B = PAL[Z.b];
    var id = "n" + pi + "_" + i, box = item(i + 1);
    var lin = el("div", "enunlin");
    var par = el("div", "sils");
    [A, B].forEach(function(P){
      var wr = el("div", "opw");
      var b = el("span", "sil larga", P.p);
      wr.appendChild(b);
      wr.appendChild(botaoSom("Ouvir esta palavra",
        (function(p){ return function(){ falar("pal_" + chaveQuadro(p)); }; })(P.p),
        "som somop"));
      par.appendChild(wr);
    });
    lin.appendChild(par);
    box.appendChild(lin);
    opcoes(box, pi, id, [
      {v: "sim", rot: "TÊM O MESMO NOME", aria: "têm o mesmo nome", fala: "mesmo_sim"},
      {v: "nao", rot: "TÊM NOMES DIFERENTES", aria: "têm nomes diferentes", fala: "mesmo_nao"}
    ], A.c === B.c ? "sim" : "nao", "pal frase",
       "certo" + pi + "_" + k, "dica" + pi + "_" + k, function(){
      var x = el("div", "ajuda cent");
      x.appendChild(nomeSecreto(Z.por, id));
      box.appendChild(x);
    });
    fechaItem(d, box, id);
  });
  d.appendChild(el("div", "ajuda cent",
    "<b>O acento, quando existe, mostra onde a força cai. Mas a maioria das " +
    "palavras não tem acento — e aí só o ouvido resolve.</b>"));
}

/* ===== BLOCO J — O QUIZ (28 e 29) ===== */
/* ⭐ A d36 manda *"Marque com X apenas as palavras oxítonas"* (uma de cada vez)
      e a d33, *"MARQUE A ALTERNATIVA EM QUE TODAS AS PALAVRAS SÃO OXÍTONAS"* —
      que é um degrau acima: aqui a criança julga QUATRO e só então responde. */
function f28(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Uma palavra de cada vez: ouça e escolha o nome dela.",
    "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var P = PAL[QUIZ[k].k], id = "n" + pi + "_" + i, box = item(i + 1);
    var lin = el("div", "enunlin");
    if(P.f) lin.appendChild(el("div", "figcx", img(P.f, "fig", P.p)));
    lin.appendChild(el("div", "palgrande", P.p));
    lin.appendChild(botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(P.p)); }));
    box.appendChild(lin);
    opcoes(box, pi, id, ["k1", "k2", "k3"].map(function(c){
      return {v: c, rot: NOMEGAV[c], aria: NOMEGAV[c], fala: "gav_" + c};
    }), P.c, "pal", "certo" + pi + "_" + k, "dica" + pi + "_" + k);
    fechaItem(d, box, id);
  });
}
function f29(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "<b>Agora são quatro palavras de uma vez.</b> A alternativa " +
    "só vale se <b>TODAS</b> as quatro tiverem o nome pedido.", "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var Q = QUIZ[k], id = "n" + pi + "_" + i, box = item(i + 1);
    var lin = el("div", "enunlin");
    lin.appendChild(el("div", "perg",
      "Em qual fileira <b>todas</b> são " + NOMEGAV[Q.certa] + "?"));
    lin.appendChild(botaoSom("Ouvir a pergunta", function(){ falar("qz_" + k); }));
    box.appendChild(lin);
    var certa = QCERTA[k];
    opcoes(box, pi, id, ["t1", "t2", "t3"].map(function(t){
      return {v: t, rot: Q.ops[t].join(" &middot; "), aria: Q.ops[t].join(", "),
              fala: "fila_" + k + "_" + t};
    }), certa, "pal frase", "certo" + pi + "_" + k, "dica" + pi + "_" + k);
    fechaItem(d, box, id);
  });
}

/* ===== 30 — O CAÇA-PALAVRAS (da d22) ===== */
/* ⚠️ A grade é de LETRAS, não de sílabas (é o que a d22 faz), e a casa da
      letra é estreita — por isso cabem oito colunas aqui e só seis cabiam no
      caderno de sílabas, onde cada casa era um pedaço de até três letras.
      **Quantas colunas cabem depende do tamanho da CASA, não de um número
      fixo** — lição de 23/set/2026. */
function f30(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Ache cada palavra na grade: toque na <b>primeira</b> letra " +
    "e depois na <b>última</b>. Ao achar, o caderno diz o nome dela.",
    "p" + pi + "enun");
  var cels = {};
  var g = el("div", "cpgrade");
  CACA.grade.forEach(function(lin, y){
    var l = el("div", "cplin");
    lin.forEach(function(ch, x){
      var b = el("button", "cpcel", ch);
      b.setAttribute("aria-label", ch);
      cels[y + "," + x] = b;
      l.appendChild(b);
    });
    g.appendChild(l);
  });
  d.appendChild(g);
  var lista = el("div", "cplista");
  ST.folha["p" + pi].forEach(function(k, i){
    var C = CACA.pal[k], id = "n" + pi + "_" + i;
    registra(id, pi, "cpa cpz");
    var rot = el("div", "cprot" + (ST.resp[id] ? " achada" : ""), C.p);
    rot.appendChild(botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(C.p)); }));
    lista.appendChild(rot);
    var ca = cels[C.a[0] + "," + C.a[1]], cz = cels[C.z[0] + "," + C.z[1]];
    ca.setAttribute("data-qa", "cp-" + id + "-a");
    cz.setAttribute("data-qa", "cp-" + id + "-z");
    function marca(){
      var y = C.a[0], x;
      for(x = C.a[1]; x <= C.z[1]; x++) cels[y + "," + x].className = "cpcel achada";
      rot.className = "cprot achada";
    }
    if(ST.resp[id]) marca();
    var passo = 0;
    [ca, cz].forEach(function(cel, n){
      cel.addEventListener("click", function(){
        if(ST.resp[id]) return;
        sPasso();
        if(n === 0){ passo = 1; cel.className = "cpcel pega"; return; }
        if(passo !== 1){ falar("caca_toque"); return; }
        marca(); acertou(id, "certo" + pi + "_" + k);
      });
    });
  });
  d.appendChild(lista);
}

/* ===== 31 — DESEMBARALHAR (da d12 e da d23) ===== */
function f31(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "As sílabas se embaralharam. Toque nelas <b>na ordem</b> " +
    "para a palavra voltar — e repare em qual delas a voz bate mais forte.",
    "p" + pi + "enun");
  montaOrdenar(d, pi, ORD);
}

/* ===== BLOCO K — ESCREVER (32 e 33) ===== */
/* ⭐ A d08 manda, VERBATIM: *"Escreva a sílaba tônica de cada palavra."*, com a
      figura ao lado e o modelo preenchido (lancheira → CHEI).
   ⚠️ AS DUAS PORTAS, SEMPRE: o teclado da tela e o teclado de verdade. */
function f32(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Olhe a figura, diga o nome dela e <b>escreva só a sílaba " +
    "mais forte</b>. No computador dá para usar o teclado de verdade.",
    "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var P = PAL[ESCR[k].k], id = "n" + pi + "_" + i, box = item(i + 1);
    var alvo = P.s[P.t];
    registra(id, pi, alvo);
    var lin = el("div", "enunlin");
    if(P.f) lin.appendChild(el("div", "figcx", img(P.f, "fig", P.p)));
    lin.appendChild(el("div", "palgrande", P.p));
    lin.appendChild(botaoSom("Ouvir a palavra",
      function(){ falar("pal_" + chaveQuadro(P.p)); }));
    box.appendChild(lin);
    var grade = el("div", "cruz uma"), cels = [], t;
    grade.setAttribute("data-qa", "esc-" + id);
    for(t = 0; t < alvo.length; t++){
      var c = el("button", "ccel viva" + (ST.resp[id] ? " ok" : ""),
                 ST.resp[id] ? alvo.charAt(t) : "");
      c.setAttribute("aria-label", "Casa da sílaba");
      cels.push(c); grade.appendChild(c);
    }
    box.appendChild(grade);
    var E = {id: id, w: alvo, cels: cels, bt: grade,
             rot: "Escreva a sílaba forte de " + P.p,
             fc: "certo" + pi + "_" + k, dica: "dica" + pi + "_" + k};
    grade.onclick = function(){ if(!ST.resp[id]) abreCruz(E, pi); };
    cels.forEach(function(c2){
      c2.addEventListener("click", function(){ if(!ST.resp[id]) abreCruz(E, pi); });
    });
    fechaItem(d, box, id);
  });
}
function f33(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Uma cruzadinha em que <b>a pista diz o nome da palavra</b> " +
    "— oxítona, paroxítona ou proparoxítona. Toque numa pista e escreva.",
    "p" + pi + "enun");
  cruzadinha(d, pi, CRZ, "crz_");
}

/* ===== 34 — A MEMÓRIA ===== */
/* ⚠️ CARTA GRANDE, regra permanente do Marcos. E o ITEM É O TABULEIRO INTEIRO,
      não o par: o `idsDaPagina` deduz o id da POSIÇÃO no pote, e registrar um
      item por par faria a folha nunca fechar com o tabuleiro todo resolvido. */
function f34(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "Vire duas cartas e ache a <b>figura</b> e o <b>nome</b> dela. " +
    "As figuras são as mesmas das folhas de papel.", "p" + pi + "enun");
  var L = ST.folha["p" + pi];
  for(var g = 0; g < L.length; g++){
    (function(grupo, g2){
      var id = "n" + pi + "_" + g2, box = item(g2 + 1);
      var abertas = [], travado = false, faltam = grupo.length, k;
      registra(id, pi, grupo.join(" "));
      var lista = [];
      for(k = 0; k < grupo.length; k++) lista.push({k: grupo[k], lado: "fig"});
      for(k = grupo.length - 1; k >= 0; k--) lista.push({k: grupo[k], lado: "nome"});
      var grade = el("div", "mcartas");
      lista.forEach(function(c){
        var M = MEM[c.k], feito = !!ST.resp[id];
        var ct = el("div", "mcarta" + (feito ? " achada" : ""));
        ct.setAttribute("data-qa", "mem-" + id + "-" + c.k + "-" + c.lado);
        ct.setAttribute("aria-label", feito ? esch(M.p) : "carta virada para baixo");
        ct.innerHTML =
          '<div class="mgira">' +
            '<div class="mface mverso"><i class="mbrilho"></i><span class="minterro">?</span></div>' +
            '<div class="mface mfrente">' +
              (c.lado === "fig" ? img(M.f, "mfig", M.p) : "") +
              '<span class="mrot">' + esch(c.lado === "fig" ? M.p : M.c) + "</span>" +
            "</div>" +
          "</div>";
        ct.onclick = function(){
          if(travado || ST.resp[id] || ct.className.indexOf("achada") > -1 ||
             ct.className.indexOf("aberta") > -1) return;
          sTecla(); ct.className = "mcarta aberta";
          falar(c.lado === "fig" ? "pal_" + chaveQuadro(M.p) : "gav_" + chaveGav(M.c));
          abertas.push({el: ct, c: c});
          if(abertas.length < 2) return;
          travado = true;
          var a = abertas[0], b = abertas[1];
          setTimeout(function(){
            if(a.c.k === b.c.k && a.el !== b.el){
              a.el.className = "mcarta achada"; b.el.className = "mcarta achada";
              sCerto(); falar("memok_" + a.c.k);
              faltam--;
              if(!faltam) setTimeout(function(){ acertou(id, "memfim"); }, 700);
            } else {
              sErro(); a.el.className = "mcarta"; b.el.className = "mcarta";
              errou(id, "memdica");
            }
            abertas = []; travado = false;
          }, 1100);
        };
        grade.appendChild(ct);
      });
      box.appendChild(grade);
      fechaItem(d, box, id);
    })(L[g], g);
  }
}
/* o caminho de volta do nome da gaveta para a chave dela — uma fonte só */
function chaveGav(nome){
  var k;
  for(k in NOMEGAV) if(NOMEGAV[k] === nome) return k;
  return "k1";
}

/* ===== 35 — O FECHO (da d05 e da d30) ===== */
/* ⭐ A d05 manda *"Escreva ou recorte de jornais e revistas palavras: 1-
      Oxítonas 2- Paroxítonas 3- Proparoxítonas"* e a d30 fecha perguntando
      *"Como você encontrou a sílaba tônica das palavras?"* — a melhor pergunta
      das quarenta, porque devolve o MÉTODO à criança.
   ⚠️ O FECHO É ALCANÇÁVEL A QUALQUER MOMENTO (regra da folha viva): não pede
      nada que as 34 anteriores não tenham ensinado, e não pede velocidade —
      senão o tamanho do caderno castiga justamente quem vai devagar. */
function f35(d, pi){
  faixa(d, pi, NOMES[pi - 1]);
  enunciado(d, pi, "O desafio do fim: <b>escreva você</b> uma palavra de cada " +
    "nome. Se faltar ideia, o banco está embaixo de cada linha.", "p" + pi + "enun");
  ST.folha["p" + pi].forEach(function(k, i){
    var D = DESAF[k], id = "n" + pi + "_" + i, box = item(i + 1);
    registra(id, pi, D.aceita[0]);
    var lin = el("div", "enunlin");
    lin.appendChild(el("div", "perg", "Escreva " + D.pede + ":"));
    lin.appendChild(botaoSom("Ouvir o pedido", function(){ falar("des_" + k); }));
    box.appendChild(lin);
    var maior = 0, t;
    for(t = 0; t < D.aceita.length; t++) if(D.aceita[t].length > maior) maior = D.aceita[t].length;
    var grade = el("div", "cruz uma"), cels = [];
    grade.setAttribute("data-qa", "esc-" + id);
    for(t = 0; t < maior; t++){
      var c = el("button", "ccel viva" + (ST.resp[id] ? " ok" : ""),
                 ST.resp[id] ? (D.aceita[0].charAt(t) || "") : "");
      c.setAttribute("aria-label", "Casa da palavra");
      cels.push(c); grade.appendChild(c);
    }
    box.appendChild(grade);
    var E = {id: id, w: D.aceita[0], cels: cels, bt: grade, aceita: D.aceita,
             rot: "Escreva " + D.pede, fc: "certo" + pi + "_" + k,
             dica: "dica" + pi + "_" + k};
    grade.onclick = function(){ if(!ST.resp[id]) abreCruz(E, pi); };
    cels.forEach(function(c2){
      c2.addEventListener("click", function(){ if(!ST.resp[id]) abreCruz(E, pi); });
    });
    /* ⚠️ O BANCO FICA À VISTA DE PROPÓSITO, e por isso se DECLARA alvo: o
       portão 1i4 leria, com razão, "a resposta está impressa na tela". Está —
       e tem de estar. Esta folha não mede se a criança LEMBRA de uma palavra:
       mede se ela ESCOLHE uma do tipo pedido e a escreve. */
    var bco = el("div", "ajuda cent", "banco: " + D.aceita.join(" &middot; "));
    bco.setAttribute("data-alvo", "1");
    box.appendChild(bco);
    fechaItem(d, box, id);
  });
  d.appendChild(el("div", "ajuda cent",
    "E fica a pergunta que o caderno inteiro respondeu: <b>como é que você " +
    "descobriu onde estava a força?</b> Conte para a sua professora."));
}
