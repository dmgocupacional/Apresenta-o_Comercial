/* Carrega em sequência: núcleo → roteiro (?r=) → cenário do roteiro → slides → kit 3D → motor.
   O roteiro define qual cenário 3D usar, por isso a ordem precisa ser estrita. */

/* ═══ BLOCO: CARREGADOR ═══ */
(function(){
  var ROTEIRO_PADRAO = 'construcao-esportiva';
  var pedido = new URLSearchParams(location.search).get('r');
  var id = pedido && /^[a-z0-9-]+$/.test(pedido) ? pedido : ROTEIRO_PADRAO;   // só nomes de arquivo seguros

  function carregar(src, depois){
    var s = document.createElement('script');
    s.src = src;
    s.onload = depois;
    s.onerror = function(){ falhar(src); };
    document.body.appendChild(s);
  }
  function falhar(src){
    var aviso = document.createElement('p');
    aviso.className = 'erro-carga';
    aviso.textContent = 'Não foi possível carregar ' + src + '. Verifique o endereço da apresentação.';
    document.body.appendChild(aviso);
  }
  function emSequencia(lista, fim){
    if (!lista.length){ if (fim) fim(); return; }
    var src = typeof lista[0] === 'function' ? lista[0]() : lista[0];
    carregar(src, function(){ emSequencia(lista.slice(1), fim); });
  }

  // Sem roteiro na URL: abre o hub de preparação para o vendedor montar o link do cliente
  if (!pedido){ emSequencia(['js/nucleo.js', 'js/hub.js']); return; }

  emSequencia([
    'js/nucleo.js',
    'roteiros/' + id + '.js',
    function(){ return 'js/cenarios/' + window.ROTEIRO.cenario + '.js'; },
    'js/slides.js',
    'js/kit3d.js',
    'js/motor.js'
  ]);
})();
/* ── FIM BLOCO ── */
