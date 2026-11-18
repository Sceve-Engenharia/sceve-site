/* ============================================================
   SCEVE ENGENHARIA — formulario.js
   Validação front-end e envio do formulário de contato
   ============================================================ */

'use strict';

(function () {

  /* ── Regras de validação ──────────────────────────────────── */

  const rules = {
    nome: {
      required: true,
      minLength: 3,
      label: 'Nome completo'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      label: 'E-mail'
    },
    telefone: {
      required: true,
      pattern: /^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/,
      label: 'Telefone'
    },
    empresa: {
      required: false,
      label: 'Empresa'
    },
    servico: {
      required: false,
      label: 'Serviço de interesse'
    },
    mensagem: {
      required: true,
      minLength: 20,
      label: 'Mensagem'
    },
    lgpd: {
      required: true,
      type: 'checkbox',
      label: 'Autorização LGPD'
    }
  };

  /* ── Máscara de telefone ──────────────────────────────────── */

  function maskPhone(input) {
    input.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
      }
      this.value = v;
    });
  }

  /* ── Valida um campo individual ───────────────────────────── */

  function validateField(field, rule) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const group = field.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');

    let error = '';

    if (rule.required) {
      if (rule.type === 'checkbox' && !value) {
        error = 'Você precisa aceitar os termos de privacidade.';
      } else if (!value) {
        error = `${rule.label} é obrigatório.`;
      }
    }

    if (!error && value && rule.pattern && !rule.pattern.test(value)) {
      error = `${rule.label} inválido. Verifique o formato.`;
    }

    if (!error && value && rule.minLength && value.length < rule.minLength) {
      error = `${rule.label} deve ter pelo menos ${rule.minLength} caracteres.`;
    }

    // Aplica classes de validação
    field.classList.toggle('is-invalid', !!error);
    field.classList.toggle('is-valid', !error && (rule.required ? !!value : true));

    if (group) group.classList.toggle('has-error', !!error);

    if (errorEl) {
      errorEl.querySelector('span') ? (errorEl.querySelector('span').textContent = error) : (errorEl.textContent = error);
    }

    return !error;
  }

  /* ── Valida o formulário completo ─────────────────────────── */

  function validateForm(form) {
    let valid = true;

    Object.entries(rules).forEach(([name, rule]) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      if (!validateField(field, rule)) valid = false;
    });

    return valid;
  }

  /* ── Coleta dados do formulário ───────────────────────────── */

  function collectFormData(form) {
    const data = {};
    Object.keys(rules).forEach(name => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      data[name] = field.type === 'checkbox' ? field.checked : field.value.trim();
    });
    return data;
  }

  /* ── Honeypot anti-spam ────────────────────────────────────
     Campo "website" fica invisível para humanos (.hp-field).
     Se vier preenchido, é bot: ignora o envio silenciosamente. */

  function isHoneypotFilled(form) {
    const hp = form.querySelector('[name="website"]');
    return !!(hp && hp.value.trim());
  }

  /* ── Escapa HTML para evitar XSS no corpo do e-mail ─────── */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Envio via Cloudflare Worker (proxy da Brevo) ─────────── */
  // O Worker guarda a chave da Brevo em segredo no servidor;
  // o site nunca fica com a chave visível no código.

  const CONTACT_WORKER_URL = 'https://sceve-contato.lucasronald533.workers.dev';

  async function submitForm(data) {
    const htmlContent = `
      <h2 style="color:#1B4F72;font-family:sans-serif;margin-bottom:1.5rem">
        Nova mensagem — Sceve Engenharia
      </h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr style="background:#f5f8fa">
          <td style="padding:10px 14px;font-weight:600;width:140px;border:1px solid #ddd">Nome</td>
          <td style="padding:10px 14px;border:1px solid #ddd">${escapeHtml(data.nome)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:600;border:1px solid #ddd">Empresa</td>
          <td style="padding:10px 14px;border:1px solid #ddd">${escapeHtml(data.empresa || '—')}</td>
        </tr>
        <tr style="background:#f5f8fa">
          <td style="padding:10px 14px;font-weight:600;border:1px solid #ddd">E-mail</td>
          <td style="padding:10px 14px;border:1px solid #ddd">${escapeHtml(data.email)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:600;border:1px solid #ddd">Telefone</td>
          <td style="padding:10px 14px;border:1px solid #ddd">${escapeHtml(data.telefone)}</td>
        </tr>
        <tr style="background:#f5f8fa">
          <td style="padding:10px 14px;font-weight:600;border:1px solid #ddd">Serviço</td>
          <td style="padding:10px 14px;border:1px solid #ddd">${escapeHtml(data.servico || '—')}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:600;border:1px solid #ddd;vertical-align:top">Mensagem</td>
          <td style="padding:10px 14px;border:1px solid #ddd">${escapeHtml(data.mensagem).replace(/\n/g, '<br>')}</td>
        </tr>
      </table>`;

    const res = await fetch(CONTACT_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: `[Site] Contato de ${data.nome}${data.servico ? ' — ' + data.servico : ''}`,
        htmlContent,
        replyToEmail: data.email,
        replyToName: data.nome
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao enviar');
    }
  }

  /* ── Mostra estado de loading no botão ────────────────────── */

  function setLoading(btn, isLoading) {
    if (isLoading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" style="animation:spin 0.8s linear infinite">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Enviando...
      `;
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.originalText || 'Enviar';
      btn.disabled = false;
    }
  }

  /* ── Mostra mensagem de sucesso ───────────────────────────── */

  function showSuccess(form) {
    form.style.display = 'none';
    const successEl = form.closest('.contact-form-wrapper')?.querySelector('.form-success');
    if (successEl) {
      successEl.classList.add('is-visible');
      successEl.focus?.();
    }
  }

  /* ── Inicializa o formulário de contato ───────────────────── */

  function initContactForm() {
    const form = document.getElementById('form-contato');
    if (!form) return;

    // Máscara de telefone
    const phoneInput = form.querySelector('[name="telefone"]');
    if (phoneInput) maskPhone(phoneInput);

    // Validação em tempo real ao sair do campo
    Object.entries(rules).forEach(([name, rule]) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      field.addEventListener('blur', () => validateField(field, rule));
      if (field.type === 'checkbox') {
        field.addEventListener('change', () => validateField(field, rule));
      }
    });

    // Envio
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isHoneypotFilled(form)) {
        // Bot: finge sucesso sem enviar nada.
        showSuccess(form);
        return;
      }

      if (!validateForm(form)) {
        // Foca o primeiro campo inválido
        const firstInvalid = form.querySelector('.is-invalid');
        firstInvalid?.focus();
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      setLoading(submitBtn, true);

      try {
        const data = collectFormData(form);
        await submitForm(data);
        showSuccess(form);

        // Rastreamento (descomente após configurar GA)
        // gtag('event', 'form_submit', { event_category: 'lead', event_label: 'contato' });
      } catch (err) {
        console.error('[Sceve] Erro ao enviar formulário:', err);
        alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
        setLoading(submitBtn, false);
      }
    });
  }

  /* ── Inicializa o formulário de orçamento rápido (modal) ──── */

  /* ── CSS para animação de spin ────────────────────────────── */

  function injectSpinStyle() {
    if (document.getElementById('sceve-spin-style')) return;
    const style = document.createElement('style');
    style.id = 'sceve-spin-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  /* ── Inicialização ────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    injectSpinStyle();
    initContactForm();
  });

})();
