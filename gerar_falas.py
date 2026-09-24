# -*- coding: utf-8 -*-
u"""
============================================================
 ESQUELETO — gerador das falas da folha viva

 ⚠️ REGRA DA CASA: o `falas.json` é a VERDADE. Texto escrito aqui = voz gravada.
    Texto mudou = voz regravada (o `entregar.yml` compara o carimbo sha1). É isto
    que acaba com "a tela diz uma coisa e a voz diz outra" — e atividade sem
    `falas.json` NÃO TEM COMO SER CONFERIDA, porque mp3 não se lê.

 ⚠️ UMA FONTE SÓ. As palavras, as frases e os textos moram no bloco
    `/*DADOS-INI*/` do `index.html` e são LIDOS daqui. Nada de segunda lista
    para desencontrar: já custou caro nesta casa um relatório sair zero com a
    folha inteira respondida.

 ⚠️ TODA TELA É NARRADA, e o alto-falante entra também em CADA RESPOSTA que a
    criança toca. Regra do Marcos: *"o alto-falante nas respostas também, para
    ajudar os alunos que não sabem ler"*. Sem isso a criança que ainda soletra
    escolhe pelo tamanho da palavra e a folha vira sorteio.

 ⚠️ A DICA NUNCA DIZ A RESPOSTA. Ela manda olhar uma pista, ou faz outra
    pergunta. Responder no segundo erro não é ajudar: é tirar da criança a única
    chance de pensar de novo.

 ⚠️ PALAVRAS QUE A VOZ ERRA (medido, e o portão `_qa/falas.py` reprova):
    "complete" vira "complite" — usar "preencha". Letra solta ("som S") sai como
    o NOME da letra: ancorar num exemplo ("o som de SAPO").

 Uso:  python3 <pasta>/gerar_falas.py
 Saída: reescreve os blocos FALAS e VOZOK do index.html, o `falas.json` e o
        `voz.txt`.
============================================================
"""
from __future__ import print_function

import collections
import io
import json
import os
import re
import unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
CAM = os.path.join(AQUI, u"index.html")
PREFIXO = u"t3_"                     # <- o prefixo desta atividade
VOZ = u"pt-BR-AntonioNeural"

D = io.open(CAM, encoding=u"utf-8").read()


def bloco(nome):
    u"""Lê um objeto do bloco DADOS do index.html. Uma fonte só.

    ⚠️ ELE CONTA AS CHAVES, e isso foi conserto de 15/set/2026. O esqueleto
       procurava o fim do objeto por uma marca de texto (`\n});`) — e QUALQUER
       objeto que não terminasse exatamente assim fazia a leitura passar
       adiante e engolir o bloco seguinte. No primeiro caderno do 2º ano os
       vinte e três blocos falharam de uma vez, todos com o mesmo erro, e a
       mensagem do json não dizia nada sobre a causa. Contar chave por chave
       (pulando as que estão DENTRO de texto) acha o fim de qualquer objeto.
    """
    i = D.find(u"var " + nome + u" = ")
    if i < 0:
        raise SystemExit(u"nao achei o bloco `var %s` no index.html" % nome)
    i = D.index(u"{", i)
    nivel, j, dentro, escapa = 0, i, False, False
    while j < len(D):
        c = D[j]
        if dentro:
            if escapa:
                escapa = False
            elif c == u"\\":
                escapa = True
            elif c == u'"':
                dentro = False
        else:
            if c == u'"':
                dentro = True
            elif c == u"{":
                nivel += 1
            elif c == u"}":
                nivel -= 1
                if nivel == 0:
                    j += 1
                    break
        j += 1
    txt = D[i:j]
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.S)
    txt = re.sub(r'"\s*\+\s*\n\s*"', "", txt)                 # junta "a" + "b"
    # ⚠️ SEM O `"?` DOS DOIS LADOS, e isso foi conserto de 20/set/2026.
    #    Esta linha normaliza chave sem aspas (`chave:` -> `"chave":`). Com o
    #    `"?` ela também casava DENTRO de uma string: a opção
    #        ["b", "Não: é um MÚSCULO que ajuda o ar a entrar"]
    #    virava  ["b", "Não": é um MÚSCULO ...]  e o json.loads morria com
    #    "Expecting ',' delimiter", sem dizer uma palavra sobre a causa.
    #    Qualquer caderno com DOIS-PONTOS dentro de um texto caía nisso.
    #    Chave já entre aspas não precisa de conserto nenhum — então a regex
    #    só olha as SEM aspas, e string nenhuma é tocada.
    txt = re.sub(r'([\{,]\s*)([A-Za-zÀ-ÿ_0-9]+)\s*:', r'\1"\2":', txt)
    txt = re.sub(r",(\s*[\}\]])", r"\1", txt)
    return json.loads(txt)


# ⚠️⚠️ A ENTIDADE HTML TAMBÉM É MARCAÇÃO, e isto foi lição paga (15/set/2026,
#    caderno de inglês do 8º ano). O `lp` tirava as TAGS e deixava as
#    ENTIDADES, então a lista de ingredientes da pizza — escrita com `&middot;`
#    para virar o ponto que separa os itens — ia para a fila de gravação como
#    *"Oil and middot Tomato sauce and middot Some onions"*. O portão
#    `_qa/revisor.py` pegou; se não pegasse, a voz teria dito isso à criança.
_ENT = {u"&middot;": u",", u"&nbsp;": u" ", u"&amp;": u" e ", u"&mdash;": u" ",
        u"&ndash;": u" ", u"&hellip;": u" ", u"&quot;": u'"', u"&lt;": u"",
        u"&gt;": u"", u"&#39;": u"'", u"&apos;": u"'"}


def lp(s):
    u"""tira a marcação e deixa o texto do jeito que a voz vai dizer"""
    t = re.sub(r"<[^>]+>", " ", s or u"")
    for _e, _v in _ENT.items():
        t = t.replace(_e, _v)
    t = re.sub(r"\s+", u" ", t)
    # ⚠️ e a tag que vira espaco deixa um vao ANTES da pontuacao ("o cinema ."),
    #    que o `_qa/revisor.py` acusa — com razao: a voz faz a pausa no lugar
    #    errado. Cola a pontuacao de volta na palavra.
    t = re.sub(r"\s+([,.;:!?])", r"\1", t)
    # ⚠️ E A VIRGULA DA PAUSA PODE ENCOSTAR NUMA QUE JA EXISTIA (15/set/2026):
    #    a frase "My dad, ___ travels a lot" virou "My dad,, travels a lot" —
    #    duas virgulas coladas, que o Edge TTS le como uma pausa estranha e
    #    longa demais. Uma so, sempre.
    t = re.sub(r",\s*,+", u",", t)
    return t.strip()


def ch(w):
    return re.sub(r"[^a-z]", "",
                  unicodedata.normalize("NFKD", w.lower())
                  .encode("ascii", "ignore").decode())


F = collections.OrderedDict()


def p(k, v):
    F[k] = v


# ---------------------------------------------------------------------------
# AS FALAS DO MOTOR — estas toda folha viva tem
# ---------------------------------------------------------------------------
p(u"capa", u"Aprendendo a sílaba tônica: oxítona, paroxítona e "
           u"proparoxítona. Trinta e cinco folhas para ouvir onde a voz bate "
           u"mais forte em cada palavra. Escreva o seu nome ali embaixo e "
           u"toque em Começar.")
p(u"folhaPronta", u"Folha pronta! Muito bem.")
p(u"ligue", u"Toque num grupo do lado esquerdo e depois no nome dele, do lado direito.")
p(u"toque_palavra", u"Primeiro toque numa palavra ali embaixo. Depois toque na "
                    u"gaveta dela.")
p(u"toque_figura", u"Primeiro toque numa figura ali embaixo. Depois toque na "
                   u"gaveta dela.")
p(u"vozOn", u"Narração ligada!")
p(u"fim", u"Você chegou ao fim! Agora você acha a sílaba forte de qualquer "
          u"palavra, com acento ou sem acento. E fica a pergunta: como é que "
          u"você descobriu onde estava a força?")

# ==============================================================================
#  AS SÍLABAS FALADAS — e este bloco é obrigatório em caderno que fale sílaba
#
#  ⚠️⚠️ POR QUE NÃO DÁ PARA SINTETIZAR A SÍLABA SOLTA (e a casa já pagou por
#     isto DUAS vezes — set/2026 e 16/set/2026, as duas o Marcos ouvindo):
#     a voz não lê SOM, lê PALAVRA. Entregue "SA" a ela e ela soletra "esse-á";
#     "VA" vira "vê-á"; "ÇÃ" ela nem tenta, porque ç não começa palavra em
#     português. Escrever a sílaba "como se fala" conserta UM caso e nunca
#     fecha a família.
#
#  O QUE FUNCIONA é o contrário: gravar a PALAVRA INTEIRA — que a voz pronuncia
#  certo, porque é palavra de verdade — alinhar letra a letra com o
#  `ctc-forced-aligner` e CORTAR a sílaba de dentro dela. Quem faz isso é o
#  `_padrao/silabas_voz.py`, dentro do `entregar.yml`, lendo o `silabas.json`
#  que sai daqui. O portão é o `_qa/silabas.py`.
#
#  COMO SE USA: para cada palavra do caderno, uma linha
#      _reg(u"CAVALO", [u"CA", u"VA", u"LO"])
#  e, no app, a sílaba fala por `falarSilaba(null, 0, "VA")` — nunca por
#  `falar("sil_va")`. Caderno que não fala sílaba não escreve nada: o
#  `silabas.json` sai com `"palavras": {}` e o `entregar.yml` nem baixa o
#  alinhador por ele.
#
#  ⚠️ NÃO HÁ FALA DE RESERVA POR SÍLABA. Faltando o recorte, o app diz a
#     PALAVRA INTEIRA. Uma reserva sintetizada seria o defeito voltando pela
#     porta dos fundos — e calado, que é pior.
# ==============================================================================
_SIL_DE = {}          # palavra -> [sílabas, NA ORDEM da palavra]
_MAPA_SIL = {}        # sílaba  -> [palavra, posição]
_RECUSADAS = []


def _reg(palavra, silabas):
    u"""⚠️ A LISTA TEM DE ESTAR NA ORDEM DA PALAVRA. O alinhador corta pelos
    limites das letras: ["RO","CAR"] para CARRO faz sair "ro" onde devia sair
    "car" — e a criança ouve o pedaço errado, sem erro nenhum na tela. Folha de
    ORDENAR guarda as sílabas EMBARALHADAS: passe-as por `_ordena` antes.
    ⚠️ E ganha sempre a partição MAIS FINA: "PIPO"+"CA" fecha PIPOCA sem ser
    separação silábica, e sobrescrevendo PI-PO-CA deixaria a sílaba PI muda."""
    silabas = list(silabas)
    if u"".join(silabas).upper() != palavra.upper():
        _RECUSADAS.append((palavra, silabas))
        return
    velha = _SIL_DE.get(palavra.lower())
    if velha and len(velha) >= len(silabas):
        return
    _SIL_DE[palavra.lower()] = silabas


def _ordena(palavra, embaralhadas):
    u"""as mesmas sílabas na ORDEM em que formam a palavra — sem inventar
    nenhuma: encaixa da esquerda para a direita e desiste se não fechar."""
    resto, saida, alvo = list(embaralhadas), [], palavra.upper()
    while alvo:
        for _i, _sb in enumerate(resto):
            if alvo.startswith(_sb.upper()):
                saida.append(_sb)
                alvo = alvo[len(_sb):]
                resto.pop(_i)
                break
        else:
            return None
    return saida if not resto else None


def _achaSilaba(s):
    u"""a palavra de onde a sílaba será recortada. Ganha a MAIS CURTA: menos
    letras na gravação, menos lugar para o alinhador errar."""
    cand = [_w for _w in sorted(_SIL_DE) if s in _SIL_DE[_w]]
    if not cand:
        return None
    _w = min(cand, key=lambda w: (len(_SIL_DE[w]), len(w), w))
    return [_w, _SIL_DE[_w].index(s)]


def _mapeia(soltas):
    u"""monta o SILMAP das sílabas que o app fala sozinhas, e DEVOLVE as órfãs.
    ⚠️ Sílaba órfã não é erro — o app diz a palavra inteira — mas tem de sair
    IMPRESSA, senão aquele botão emudece sem ninguém saber. Distratora que não
    mora em palavra nenhuma do caderno pede uma PALAVRA-CARREGADORA: uma
    palavra de verdade, curta, registrada só para ser gravada e cortada."""
    orfas = []
    for _s in sorted(set(soltas)):
        _achou = _achaSilaba(_s)
        if _achou:
            _MAPA_SIL[_s] = _achou
        else:
            orfas.append(_s)
    # e a PALAVRA INTEIRA de cada uma precisa existir como fala: é dela que o
    # recorte sai, e é ela que o app diz quando o recorte falta.
    for _w in sorted(_SIL_DE):
        p(u"pal_" + ch(_w), _w.upper() + u".")
    return orfas


# ⚠️ o `_mapeia` só roda DEPOIS de as palavras estarem registradas — ele
#    procura, para cada sílaba solta, de qual palavra ela sai. A chamada
#    mora no fim da seção das folhas.


# ---------------------------------------------------------------------------
# A SAÍDA
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# AS FALAS DAS FOLHAS — uma seção por bloco, LENDO OS DADOS do index.html.
#
# ⚠️ UMA FONTE SÓ. Se a frase da tela morasse aqui e lá, a voz diria uma coisa
#    e a folha mostraria outra — e é esse o defeito que o `falas.json` existe
#    para matar.
#
# ⚠️ A DICA NUNCA ENTREGA A RESPOSTA. Ela diz ONDE OLHAR (ou, aqui, o que
#    OUVIR): *"diga a palavra em voz alta e repare em qual pedaço a sua voz
#    sobe"*, nunca *"é o segundo"*. Quem mede é o portão `0j`.
# ---------------------------------------------------------------------------

NOMEGAV = {u"k1": u"oxítona", u"k2": u"paroxítona", u"k3": u"proparoxítona"}
DIZGAV = {u"k1": u"a força na última sílaba",
          u"k2": u"a força na penúltima sílaba",
          u"k3": u"a força na antepenúltima sílaba"}
ORDINAL = {0: u"última", 1: u"penúltima", 2: u"antepenúltima"}

# ---- o cartaz das três classes -------------------------------------------
for _k in NOMEGAV:
    p(u"gav_" + _k, u"%s: %s." % (NOMEGAV[_k].capitalize(), DIZGAV[_k]))
    p(u"gavd_" + _k, DIZGAV[_k].capitalize() + u".")
    p(u"lapis_" + _k, u"Canetinha das palavras %s." % NOMEGAV[_k])

# ---- a voz de CADA PALAVRA, e as sílabas recortadas de dentro dela --------
# ⚠️⚠️ O ACENTO TEM DE SUMIR DO MESMO JEITO NOS DOIS LADOS. Quem grava usa
#    `ch()` (NFKD: ã vira a, ç vira c) e quem pede usa o `chaveQuadro` do app.
#    São a MESMA regra escrita duas vezes — mexeu numa, mexe na outra, e o
#    portão `1p` reprova se desencontrarem. Foi assim que dezessete palavras
#    ficaram mudas no 2º ano, todas com til ou cedilha.
PAL = bloco(u"PAL")
_VISTA = {}


def _pal(w, silabas=None):
    w = (w or u"").strip()
    if not w or w in _VISTA:
        return
    _VISTA[w] = 1
    p(u"pal_" + ch(w), w + u".")
    if silabas:
        _reg(w, silabas)


for _k, _P in PAL.items():
    _pal(_P[u"p"], _P[u"s"])

# ---- 1 a 6 e 19 — ouvir onde a voz bate mais forte ------------------------
p(u"p1enun", u"Folha um. Toque no alto-falante e ouça a palavra. Depois ouça "
             u"cada pedaço e toque no que a voz diz mais forte.")
p(u"p2enun", u"Folha dois. O mesmo gesto, e agora as palavras têm três pedaços. "
             u"Ouça os três antes de escolher.")
p(u"p3enun", u"Folha três. Agora sem figura nenhuma: só a palavra escrita e a "
             u"voz. Onde ela bate mais forte?")
p(u"p4enun", u"Folha quatro. Atenção: agora nenhuma destas palavras tem acento. "
             u"No papel dava para adivinhar pelo acento; aqui só o ouvido "
             u"resolve. Ouça pedaço por pedaço.")
p(u"p5enun", u"Folha cinco. Sem acento e agora sem figura também. Diga a palavra "
             u"em voz alta antes de escolher: a sua própria voz ajuda.")
p(u"p6enun", u"Folha seis. Sem acento outra vez, e agora a força cai em lugares "
             u"diferentes: numa palavra no fim, noutra no meio. Só ouvindo é que dá.")
p(u"p19enun", u"Folha dezenove. Uma parada para respirar: o gesto da primeira "
              u"folha, com palavras novas. Ouça cada pedaço e toque no mais forte.")
for _fo in (1, 2, 3, 4, 5, 6, 19):
    for _k, _P in PAL.items():
        p(u"certo%d_%s" % (_fo, _k),
          u"Isso! Em %s a força cai em %s." % (_P[u"p"], _P[u"s"][_P[u"t"]]))
        p(u"dica%d_%s" % (_fo, _k),
          u"Diga a palavra em voz alta, bem devagar, e repare em qual pedaço a "
          u"sua voz sobe. Toque nos alto-falantes dos pedaços para comparar.")

# ---- 7 e 8 — descobrir a regra e receber os nomes -------------------------
GRUPO = bloco(u"GRUPO")
p(u"p7enun", u"Folha sete. Três grupos de palavras. Ouça as quatro de cada "
             u"grupo e repare: em cada grupo a força cai sempre no mesmo lugar. "
             u"Depois responda às três perguntas.")
p(u"p8enun", u"Folha oito. Cada um daqueles grupos tem um nome. Toque no grupo "
             u"da esquerda e depois no nome dele, à direita.")
for _gk, _G in GRUPO.items():
    p(u"grupo_" + _gk, u"Grupo %s." % _gk[-1])
    for _w in _G[u"pal"]:
        _pal(_w)
_Q7 = {u"q1": (u"Em qual grupo a força cai sempre na última sílaba?", u"g1", u"k1"),
       u"q2": (u"E em qual ela cai sempre na penúltima, a segunda de trás para a frente?", u"g2", u"k2"),
       u"q3": (u"E em qual cai sempre na antepenúltima, a terceira de trás para a frente?", u"g3", u"k3")}
for _k, (_q, _r, _c) in _Q7.items():
    p(u"q7_" + _k, _q)
    p(u"certo7_" + _k, u"Isso! Nesse grupo a força cai sempre no mesmo lugar — "
                       u"e logo você vai saber o nome disso.")
    p(u"dica7_" + _k, u"Ouça as quatro palavras de um grupo seguidas. Se a sua "
                      u"voz subir sempre no mesmo pedaço, é esse o grupo.")
for _k in NOMEGAV:
    p(u"certo8_" + _k, u"Isso! %s é %s." % (NOMEGAV[_k].capitalize(), DIZGAV[_k]))
    p(u"dica8_" + _k, u"Volte à folha de trás e ouça o grupo. Onde a força caía?")

# ---- 9 e 10 — contar de trás para a frente -------------------------------
CONTA = bloco(u"CONTA")
p(u"p9enun", u"Folha nove. Contar de trás para a frente: a última, a penúltima, "
             u"a antepenúltima. O número está em cada pedaço, e o cartaz está "
             u"aí embaixo.")
p(u"p10enun", u"Folha dez. Agora sem o cartaz, e com palavras mais compridas. "
              u"Os números continuam nos pedaços: conte com o dedo.")
for _k, _C in CONTA.items():
    _P = PAL[_C[u"k"]]
    _fo = 9 if _k[0] == u"h" else 10
    p(u"certo%d_%s" % (_fo, _k),
      u"Isso! A %s sílaba de %s é %s."
      % (ORDINAL[_C[u"pede"]], _P[u"p"], _P[u"s"][len(_P[u"s"]) - 1 - _C[u"pede"]]))
    p(u"dica%d_%s" % (_fo, _k),
      u"Comece pelo último pedaço e conte para trás, como o número que está "
      u"escrito em cada um.")

# ---- 11 a 16 — as gavetas ------------------------------------------------
GAV = bloco(u"GAV")
p(u"p11enun", u"Folha onze. Duas gavetas bem diferentes: a força no fim e a "
              u"força três de trás para a frente. Arraste, ou toque na palavra "
              u"e depois na gaveta.")
p(u"p12enun", u"Folha doze. Agora as três gavetas abertas. Diga a palavra, ouça "
              u"onde a força cai e guarde-a.")
p(u"p13enun", u"Folha treze. Três gavetas outra vez, e agora com as palavras da "
              u"escola, as que você vê todo dia.")
p(u"p14enun", u"Folha catorze. Agora a mesma raiz, e a força muda de lugar. "
              u"Música e musical, pássaro e passarinho. Quem decorou a palavra "
              u"não resolve esta folha: só quem ouve.")
p(u"p15enun", u"Folha quinze. Agora a peça é a figura, sem a palavra escrita. "
              u"Toque nela para ouvir o nome, depois leve para a gaveta.")
p(u"p16enun", u"Folha dezesseis. As mesmas gavetas e agora doze figuras. Toque "
              u"em cada uma para ouvir antes de decidir.")
_FOGAV = {u"gA": 11, u"gB": 12, u"gC": 13, u"gD": 14, u"gE": 15, u"gF": 16}
for _gk, _G in GAV.items():
    _fo = _FOGAV[_gk]
    for _k, _P in _G[u"pal"].items():
        _pal(_P[u"p"])
        p(u"diz2_%s_%s" % (_gk, _k), _P[u"p"] + u".")
        p(u"certo%d_%s" % (_fo, _k),
          u"Isso! %s é %s." % (_P[u"p"], NOMEGAV[_P[u"c"]]))
        p(u"dica%d_%s" % (_fo, _k),
          u"Diga a palavra devagar e ouça onde a voz sobe. Depois conte de trás "
          u"para a frente: foi na última, na penúltima ou na antepenúltima?")

# ---- 17 e 18 — partir a palavra ------------------------------------------
COR = bloco(u"COR")
p(u"p17enun", u"Folha dezessete. Parta a palavra tocando nas frestas. Quando o "
              u"último corte cair, o caderno mostra onde a força está.")
p(u"p18enun", u"Folha dezoito. Agora as palavras compridas, de quatro e cinco "
              u"pedaços. Diga a palavra devagar: cada pausa da sua voz é uma fresta.")
for _k, _C in COR.items():
    _pal(_C[u"p"])
    _fo = 17 if _k[0] == u"r" else 18
    p(u"certo%d_%s" % (_fo, _k),
      u"Muito bem! %s se parte em %d pedaços." % (_C[u"p"], len(_C[u"g"]) + 1))
    p(u"dica%d_%s" % (_fo, _k),
      u"Diga a palavra devagar. O corte fica onde a sua voz faz uma pausa e "
      u"recomeça.")

# ---- 20 e 21 — pintar pela legenda ---------------------------------------
p(u"p20enun", u"Folha vinte. Pegue a canetinha da cor certa e pinte a sílaba "
              u"forte de cada palavra. A cor diz que nome a palavra tem.")
p(u"p21enun", u"Folha vinte e um. Agora pinte a palavra inteira, não só a "
              u"sílaba. A legenda é a mesma.")
p(u"pegue_lapis", u"Antes de pintar, pegue uma canetinha ali em cima.")
for _fo in (20, 21):
    for _k, _P in PAL.items():
        p(u"certo%d_%s" % (_fo, _k),
          u"Isso! %s é %s." % (_P[u"p"], NOMEGAV[_P[u"c"]]))
        p(u"dica%d_%s" % (_fo, _k),
          u"Essa canetinha não é a dessa palavra. Ouça a palavra e conte de "
          u"trás para a frente onde a força caiu.")

# ---- 22 — a cantiga ------------------------------------------------------
CANT = bloco(u"CANT")
p(u"p22enun", u"Folha vinte e dois. Cante a cantiga em voz alta: cantando fica "
              u"fácil ouvir a força. Entre as palavras destacadas, seis são "
              u"paroxítonas e uma não é. Marque as seis e toque em Conferir.")
p(u"cantiga", u"Se eu fosse um peixinho e soubesse nadar, eu tirava a Maria do "
              u"fundo do mar.")
for _k, _V in CANT[u"pal"].items():
    _pal(_V[u"p"])
p(u"certo22_a", u"Isso! Todas essas têm a força na penúltima sílaba.")
p(u"dica22_a", u"Cante o verso outra vez e bata a mão na sílaba em que a sua "
               u"voz sobe. Uma das sete tem a força no FIM — essa fica de fora.")

# ---- 23 e 24 — achar no texto --------------------------------------------
TEX = bloco(u"TEX")
p(u"p23enun", u"Folha vinte e três. Leia o texto e ouça-o. Entre as palavras do "
              u"quadro, marque as oxítonas, que têm a força no fim, e confira.")
p(u"p24enun", u"Folha vinte e quatro. Agora um texto maior, e você procura as "
              u"proparoxítonas, as de força bem no começo. Marque e confira.")
for _k, _T in TEX.items():
    p(u"tex_" + _k, _T[u"texto"])
    for _pc in _T[u"pecas"]:
        _pal(_pc[u"t"])
p(u"certo23_a", u"Isso! Subiu, comeu e caju têm a força na última sílaba.")
p(u"dica23_a", u"Diga cada palavra do quadro em voz alta e ouça o fim dela. "
               u"Marque só aquelas em que a voz sobe no último pedaço.")
p(u"certo24_a", u"Muito bem! Sábado e médico têm a força três pedaços de trás "
                u"para a frente.")
p(u"dica24_a", u"Conte de trás para a frente em cada palavra do quadro. Marque "
               u"só as que têm a força na antepenúltima.")

# ---- 25 e 26 — o X na coluna ---------------------------------------------
XIS = bloco(u"XIS")
p(u"p25enun", u"Folha vinte e cinco. Um X na coluna certa, palavra por palavra. "
              u"Ouça e decida.")
p(u"p26enun", u"Folha vinte e seis. Agora doze de uma vez. Vá rápido: você já "
              u"sabe. Se travar numa, ouça-a outra vez.")
for _k, _ref in XIS.items():
    _P = PAL[_ref]
    _fo = 25 if _k[0] == u"w" else 26
    p(u"certo%d_%s" % (_fo, _k), u"Isso! %s é %s." % (_P[u"p"], NOMEGAV[_P[u"c"]]))
    p(u"dica%d_%s" % (_fo, _k),
      u"Ouça a palavra outra vez e conte de trás para a frente: última, "
      u"penúltima, antepenúltima.")

# ---- 27 — o acento é pista, não é regra ----------------------------------
PIST = bloco(u"PIST")
p(u"p27enun", u"Folha vinte e sete. Olhe os dois pares abaixo. Uma palavra tem "
              u"acento e a outra não — e isso não decide nada. Ouça as duas e "
              u"diga se elas têm o mesmo nome.")
p(u"mesmo_sim", u"Têm o mesmo nome.")
p(u"mesmo_nao", u"Têm nomes diferentes.")
for _k, _Z in PIST.items():
    p(u"certo27_" + _k, u"Isso! " + _Z[u"por"])
    p(u"dica27_" + _k,
      u"Não olhe o acento: ouça. Diga as duas palavras em voz alta e repare em "
      u"qual pedaço a voz sobe em cada uma.")

# ---- 28 e 29 — o quiz ----------------------------------------------------
QUIZ = bloco(u"QUIZ")
p(u"p28enun", u"Folha vinte e oito. Uma palavra de cada vez: ouça e escolha o "
              u"nome dela.")
p(u"p29enun", u"Folha vinte e nove. Agora são quatro palavras de uma vez. A "
              u"fileira só vale se TODAS as quatro tiverem o nome pedido.")
_CERTA = {u"B1": u"t1", u"B2": u"t2", u"B3": u"t1", u"B4": u"t1"}
for _k, _Q in QUIZ.items():
    if u"k" in _Q:
        _P = PAL[_Q[u"k"]]
        p(u"certo28_" + _k, u"Isso! %s é %s." % (_P[u"p"], NOMEGAV[_P[u"c"]]))
        p(u"dica28_" + _k, u"Ouça a palavra e conte de trás para a frente onde "
                           u"a força caiu.")
        continue
    p(u"qz_" + _k, u"Em qual fileira todas as quatro são %s?" % NOMEGAV[_Q[u"certa"]])
    for _t, _lista in _Q[u"ops"].items():
        for _w in _lista:
            _pal(_w)
        p(u"fila_%s_%s" % (_k, _t), u", ".join(_lista) + u".")
    p(u"certo29_" + _k, u"Isso! Nessa fileira as quatro têm a força no mesmo lugar.")
    p(u"dica29_" + _k, u"Vá palavra por palavra da fileira. Basta UMA estar "
                       u"fora para a fileira inteira não servir.")

# ---- 30 — o caça-palavras ------------------------------------------------
CACA = bloco(u"CACA")
p(u"p30enun", u"Folha trinta. Ache cada palavra na grade: toque na primeira "
              u"letra e depois na última. Ao achar, o caderno diz o nome dela.")
p(u"caca_toque", u"Toque primeiro na casa onde a palavra começa.")
for _k, _C in CACA[u"pal"].items():
    _pal(_C[u"p"])
    p(u"certo30_" + _k, u"Achou! %s é %s." % (_C[u"p"], NOMEGAV[_C[u"c"]]))
    p(u"dica30_" + _k, u"Procure a casa com a primeira letra da palavra e siga "
                       u"a linha até a última.")

# ---- 31 — desembaralhar ---------------------------------------------------
ORD = bloco(u"ORD")
p(u"p31enun", u"Folha trinta e um. As sílabas se embaralharam. Toque nelas na "
              u"ordem para a palavra voltar — e repare em qual delas a voz bate "
              u"mais forte.")
for _k, _O in ORD.items():
    _P = PAL[_O[u"k"]]
    p(u"certo31_" + _k, u"Muito bem! %s, e a força está em %s."
                        % (_P[u"p"], _P[u"s"][_P[u"t"]]))
    p(u"dica31_" + _k, u"Comece pelo pedaço com que a palavra COMEÇA. Ouça-a de "
                       u"novo e repare no primeiro som.")

# ---- 32 e 33 — escrever ---------------------------------------------------
ESCR = bloco(u"ESCR")
CRZ = bloco(u"CRZ")
p(u"p32enun", u"Folha trinta e dois. Olhe a figura, diga o nome dela e escreva "
              u"só a sílaba mais forte. No computador dá para usar o teclado de "
              u"verdade.")
p(u"p33enun", u"Folha trinta e três. Uma cruzadinha em que a pista diz o nome da "
              u"palavra: oxítona, paroxítona ou proparoxítona. Toque numa pista "
              u"e escreva.")
p(u"escreva", u"Escreva usando o teclado.")
for _k, _E in ESCR.items():
    _P = PAL[_E[u"k"]]
    p(u"certo32_" + _k, u"Isso! A força de %s está em %s." % (_P[u"p"], _P[u"s"][_P[u"t"]]))
    p(u"dica32_" + _k, u"Ouça a palavra outra vez e escreva só o pedaço em que "
                       u"a voz sobe.")
for _k, _C in CRZ.items():
    p(u"crz_" + _k, _C[u"d"])
    p(u"certo33_" + _k, u"Isso!")
    p(u"dica33_" + _k, u"Leia a pista outra vez: ela diz onde a força cai, e "
                       u"isso já elimina quase todas.")

# ---- 34 — a memória -------------------------------------------------------
MEM = bloco(u"MEM")
p(u"p34enun", u"Folha trinta e quatro. Vire duas cartas e ache a figura e o nome "
              u"dela. As figuras são as mesmas das folhas de papel.")
for _k, _M in MEM.items():
    _pal(_M[u"p"])
    p(u"memok_" + _k, u"Par! %s é %s." % (_M[u"p"], _M[u"c"].lower()))
p(u"memfim", u"Tabuleiro limpo! Você lembrou de todas.")
p(u"memdica", u"Guarde onde cada carta estava: elas voltam para baixo no mesmo lugar.")

# ---- 35 — o fecho ---------------------------------------------------------
DESAF = bloco(u"DESAF")
p(u"p35enun", u"Folha trinta e cinco. O desafio do fim: escreva você uma palavra "
              u"de cada nome. Se faltar ideia, o banco está embaixo de cada linha.")
for _k, _D in DESAF.items():
    p(u"des_" + _k, u"Escreva " + _D[u"pede"] + u".")
    p(u"certo35_" + _k, u"Essa vale! Você escolheu e acertou o lugar da força.")
    p(u"dica35_" + _k, u"Diga em voz alta a palavra que você escreveu e conte de "
                       u"trás para a frente. Se não bater, escolha outra do banco.")

# ---- as sílabas que o app fala SOZINHAS ----------------------------------
# ⚠️ Neste caderno é TODA sílaba de TODA palavra: a peça central (`tocaTonica`)
#    põe um alto-falante em cada pedaço, e é disso que o caderno vive.
_SOLTAS = []
for _k, _P in PAL.items():
    _SOLTAS.extend(_P[u"s"])
_ORFAS = _mapeia(_SOLTAS)


def chave(s):
    u"""O nome do mp3 sai do TEXTO, não da chave da fala — assim duas chaves que
    dizem a mesma frase gravam um arquivo só."""
    s = re.sub(r"\s+", u" ", s or u"").strip().lower()
    hh = 5381
    for c in s:
        hh = ((hh * 33) ^ ord(c)) & 0xFFFFFFFF
    d, out = hh, u""
    if d == 0:
        return u"0"
    while d:
        out = u"0123456789abcdefghijklmnopqrstuvwxyz"[d % 36] + out
        d //= 36
    return out


falas, vistos = [], {}
for k in sorted(F.keys()):
    txt = F[k]
    if not txt:
        continue
    c = chave(txt)
    if c in vistos:
        continue
    vistos[c] = 1
    falas.append({u"id": PREFIXO + c, u"texto": txt, u"voz": VOZ})

html = io.open(CAM, encoding=u"utf-8").read()
blocoF = (u"/*FALAS-INI*/\nvar FALAS = "
          + json.dumps(F, ensure_ascii=False, indent=1, sort_keys=True) + u";\n/*FALAS-FIM*/")
blocoV = (u"/*VOZOK-INI*/var VOZOK = "
          + json.dumps(dict((c, 1) for c in vistos), ensure_ascii=False) + u";/*VOZOK-FIM*/")
novo = re.sub(r"/\*FALAS-INI\*/.*?/\*FALAS-FIM\*/", lambda m: blocoF, html, flags=re.S)
novo = re.sub(r"/\*VOZOK-INI\*/.*?/\*VOZOK-FIM\*/", lambda m: blocoV, novo, flags=re.S)

# ⭐ o `silabas.json` é o que o `entregar.yml` lê para cortar cada sílaba de
#    dentro do mp3 da palavra inteira, e o `SILMAP` é o que o app usa para saber
#    de qual palavra veio cada pedaço. Uma fonte só para os dois.
io.open(os.path.join(AQUI, u"silabas.json"), u"w", encoding=u"utf-8").write(
    json.dumps({u"prefixo": PREFIXO, u"voz": VOZ,
                u"palavras": dict((w, _SIL_DE[w]) for w in sorted(_SIL_DE))},
               ensure_ascii=False, indent=1))
blocoS = (u"/*SILMAP-INI*/var SILMAP = "
          + json.dumps(_MAPA_SIL, ensure_ascii=False, sort_keys=True) + u";/*SILMAP-FIM*/")
novo = re.sub(r"/\*SILMAP-INI\*/.*?/\*SILMAP-FIM\*/", lambda m: blocoS, novo, flags=re.S)
io.open(CAM, u"w", encoding=u"utf-8").write(novo)
io.open(os.path.join(AQUI, u"falas.json"), u"w", encoding=u"utf-8").write(
    json.dumps(falas, ensure_ascii=False, indent=1))
io.open(os.path.join(AQUI, u"voz.txt"), u"w", encoding=u"utf-8").write(VOZ + u"\n")
print(u"FALAS: %d chaves; falas.json: %d fala(s) para gravar; "
      u"silabas: %d palavra(s) para recortar, %d silaba(s) no mapa"
      % (len(F), len(falas), len(_SIL_DE), len(_MAPA_SIL)))
if _ORFAS:
    print(u"   \u26a0\ufe0f %d silaba(s) SEM palavra de origem (o app dira a palavra "
          u"inteira): %s" % (len(_ORFAS), u", ".join(_ORFAS)))
if _RECUSADAS:
    print(u"   \u26a0\ufe0f %d lista(s) recusada(s) por nao formarem a palavra: %s"
          % (len(_RECUSADAS), u", ".join(
              u"%s=%s" % (w, u"-".join(sl)) for w, sl in _RECUSADAS[:8])))
