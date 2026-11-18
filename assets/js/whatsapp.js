/* ============================================================
   SCEVE ENGENHARIA — whatsapp.js
   Comportamento do botão flutuante do WhatsApp
   ============================================================ */

'use strict';

(function () {

  const WHATSAPP_NUMBER = '5541987905344'; // substitua pelo número real (com DDI+DDD)
  const DEFAULT_MESSAGE = 'Olá! Vim pelo site da Sceve Engenharia e gostaria de obter mais informações.';

  /* Gera URL do WhatsApp com mensagem contextual */
  function buildWhatsAppURL(message) {
    const text = encodeURIComponent(message || DEFAULT_MESSAGE);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  /* Atualiza o href do botão flutuante com base na página atual */
  function updateFloatButton() {
    const btn = document.getElementById('whatsapp-float');
    if (!btn) return;

    const path = location.pathname;
    let message = DEFAULT_MESSAGE;

    if (path.includes('nr12')) {
      message = 'Olá! Vim pelo site da Sceve Engenharia e gostaria de um orçamento para adequação NR12.';
    } else if (path.includes('saude-ocupacional')) {
      message = 'Olá! Vim pelo site da Sceve Engenharia e tenho interesse nos serviços de Saúde Ocupacional.';
    } else if (path.includes('meio-ambiente')) {
      message = 'Olá! Vim pelo site da Sceve Engenharia e preciso de apoio na área de Meio Ambiente.';
    } else if (path.includes('contato') || path.includes('orcamento')) {
      message = 'Olá! Vim pelo site da Sceve Engenharia e gostaria de solicitar um orçamento.';
    }

    btn.href = buildWhatsAppURL(message);
  }

  /* Colapsa o botão para apenas ícone após scroll */
  function initScrollCollapse() {
    const btn = document.getElementById('whatsapp-float');
    if (!btn) return;

    let collapsed = false;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      const scrollingDown = scroll > lastScroll;
      lastScroll = scroll;

      if (scroll > 300 && scrollingDown && !collapsed) {
        collapsed = true;
        btn.classList.add('is-collapsed');
      } else if (scroll < 100 && collapsed) {
        collapsed = false;
        btn.classList.remove('is-collapsed');
      }
    }, { passive: true });
  }

  /* Rastreia cliques no botão (para analytics) */
  function trackClick() {
    const btn = document.getElementById('whatsapp-float');
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Google Analytics 4 (descomente quando GA estiver configurado)
      // gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location.pathname });

      // console.log('[Sceve] WhatsApp click tracked');
    });
  }

  /* Botões de WhatsApp inline (com data-whatsapp-msg) */
  function initInlineButtons() {
    document.querySelectorAll('[data-whatsapp-msg]').forEach(btn => {
      btn.href = buildWhatsAppURL(btn.dataset.whatsappMsg);
    });
  }

  /* Inicialização */
  document.addEventListener('DOMContentLoaded', () => {
    updateFloatButton();
    initScrollCollapse();
    trackClick();
    initInlineButtons();
  });

})();
