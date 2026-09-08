// Lê o texto copiado da lista do mercado e devolve preço + quantidade de cada peça.
// Roda no navegador (window.Parser) e no node (require).
(function (raiz, fabrica) {
  "use strict";
  var api = fabrica();
  if (typeof module === "object" && module.exports) module.exports = api;
  else raiz.Parser = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var FAMILIAS = { hashboard: "hash", fan: "fan", wire: "wire" };
  var TIERS = ["common", "uncommon", "rare", "epic", "legendary"];
  var NOMES = { hash: "Hashboard", fan: "Fan", wire: "Wire" };

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

  var RE_ITEM = /\b(Common|Uncommon|Rare|Epic|Legendary)[ \t]+(Hashboard|Fan|Wire)\b/gi;
  // O jogo separa milhar com espaço ("548 848"), às vezes espaço fino ou NBSP.
  var ESPACOS = /[\s   ]/g;
  var RE_PRECO = /([\d][\d    .,]*?)[ \t]*RLT/i;
  var RE_QTD = /Quantity[ \t]*:?[ \t]*([\d][\d    .,]*)/i;

  function numero(txt) {
    if (!txt) return null;
    var limpo = txt.replace(ESPACOS, "").replace(/,/g, "");
    var m = limpo.match(/^\d+(?:\.\d+)?/);
    if (!m) return null;
    var n = parseFloat(m[0]);
    return isFinite(n) ? n : null;
  }

  function parse(texto) {
    if (typeof texto !== "string" || !texto.trim()) {
      return { itens: [], semPreco: [], total: 0 };
    }

    // Acha onde cada peça começa, pra recortar um bloco por peça.
    var marcas = [];
    var m;
    RE_ITEM.lastIndex = 0;
    while ((m = RE_ITEM.exec(texto)) !== null) {
      var fam = FAMILIAS[m[2].toLowerCase()];
      marcas.push({
        inicio: m.index,
        fim: RE_ITEM.lastIndex,
        tier: m[1].toLowerCase(),
        fam: fam,
        nome: cap(m[1]) + " " + NOMES[fam]
      });
    }

    var itens = [];
    var semPreco = [];

    marcas.forEach(function (marca, i) {
      var ate = (i + 1 < marcas.length) ? marcas[i + 1].inicio : texto.length;
      var bloco = texto.slice(marca.fim, ate);

      var mp = bloco.match(RE_PRECO);
      var preco = mp ? numero(mp[1]) : null;
      var mq = bloco.match(RE_QTD);
      var qtd = mq ? numero(mq[1]) : null;

      if (preco === null) {
        semPreco.push(marca.nome);
        return;
      }
      itens.push({
        fam: marca.fam,
        tier: marca.tier,
        nome: marca.nome,
        preco: preco,
        qtd: qtd === null ? null : Math.round(qtd)
      });
    });

    return { itens: itens, semPreco: semPreco, total: marcas.length };
  }

  return { parse: parse, TIERS: TIERS, FAMILIAS: FAMILIAS };
});
