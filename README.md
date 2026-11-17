# Sceve Engenharia — Site Institucional

Site institucional da **Sceve Engenharia de Segurança do Trabalho**, especializada em NR-12, segurança de máquinas, saúde ocupacional, meio ambiente e treinamentos NR.

**Domínio:** [sceveengseg.com.br](https://sceveengseg.com.br)
**Hospedagem:** Hostinger (Apache, hospedagem estática)
**Stack:** HTML5 + CSS3 + JavaScript vanilla — sem framework, sem build step, sem backend próprio

> Para o manual de uso não-técnico (como trocar texto, imagem, adicionar página, backup), veja [docx/MANUAL-DO-CLIENTE.md](docx/MANUAL-DO-CLIENTE.md).

---

## Estrutura do projeto

```
Sceve/
├── index.html                          # Página inicial
├── 404.html                            # Página de erro personalizada
├── .htaccess                           # Config Apache (HTTPS, cache, gzip, headers de segurança, CSP)
├── robots.txt                          # Diretivas para crawlers
├── sitemap.xml                         # Mapa do site para SEO
├── CNAME                               # Domínio (usado se hospedado via GitHub Pages)
├── FONTES.md                           # Fonte tipográfica usada no site
│
├── pages/
│   ├── contato.html                    # Formulário de contato + mapa + info
│   ├── sobre.html                      # Sobre a empresa, linha do tempo, equipe
│   ├── politica-de-privacidade.html    # Política de privacidade e cookies (LGPD)
│   │
│   ├── servicos/
│   │   ├── index.html                  # Visão geral de todos os serviços
│   │   ├── nr12.html                   # Adequação NR-12 e segurança de máquinas
│   │   ├── saude-ocupacional.html      # PCMSO / saúde ocupacional
│   │   ├── meio-ambiente.html          # Licenciamento ambiental
│   │   ├── pgr.html                    # PGR — Programa de Gerenciamento de Riscos
│   │   └── laudos-pericias.html        # LTCAT, insalubridade, periculosidade, perícias
│   │
│   ├── treinamentos/
│   │   ├── index.html                  # Catálogo de treinamentos NR
│   │   └── agenda.html                 # Agenda de turmas (fora do ar — ver robots.txt)
│   │
│   ├── blog/
│   │   ├── index.html                  # Listagem, busca e filtro por categoria
│   │   └── *.html                      # 6 posts publicados
│   │
│
├── assets/
│   ├── css/                            # Um arquivo por área + versão .min.css de cada
│   ├── js/                             # main.js, formulario.js, whatsapp.js (+ .min.js)
│   └── img/                            # Imagens, favicons (.ico + vários tamanhos), apple-touch-icon
│
├── components/                         # Snippets de referência — NÃO são incluídos via fetch,
│   │                                    # servem só de modelo para copiar em páginas novas
│   ├── header/header.html
│   ├── footer/footer.html
│   ├── forms/form-contato.html
│   ├── forms/form-orcamento.html       # Não usado em nenhuma página no momento
│   ├── whatsapp/whatsapp-btn.html
│   └── seo/meta-tags-template.html
│
├── data/                                # JSON de referência — não são consumidos por nenhum JS
│   ├── servicos.json
│   ├── blog-posts.json
│   └── treinamentos.json
│
└── docx/
    ├── MANUAL-DO-CLIENTE.md            # Manual não-técnico de uso e manutenção
    └── README.md                       # Índice desta pasta
```

Cada página HTML é autocontida (header, footer, modais e scripts colados diretamente nela) — não existe sistema de template/include. Isso significa que qualquer alteração que precise aparecer em **todas** as páginas (telefone, endereço, menu) precisa ser repetida página por página.

---

## Sistema de design

| Token | Valor |
|---|---|
| Cor primária | `#1B4F72` / `#0D2B3E` (azul) |
| Cor de destaque | `#E67E22` (laranja) |
| Fonte | Inter (Google Fonts — 400/500/600/700/800) — ver [FONTES.md](FONTES.md) |
| Container máximo | 1280px |
| Altura do header | 72px |
| Breakpoints | 1280 / 1024 / 768 / 480px |

Tokens completos em [assets/css/variables.css](assets/css/variables.css).

---

## Como rodar localmente

Site estático — qualquer servidor HTTP local funciona:

```bash
python -m http.server 8080
# ou
npx serve .
```

Acesse `http://localhost:8080`. Abrir os arquivos direto via `file://` não é recomendado (alguns recursos, como fetch de componentes, podem falhar por CORS).

---

## Deploy

Upload de todos os arquivos para a raiz do domínio via FTP ou o gerenciador de arquivos da Hostinger. Não há passo de build — os arquivos `.min.css`/`.min.js` já estão gerados e commitados; se editar um arquivo `.css`/`.js` fonte, é preciso reminificá-lo manualmente (ex.: `npx clean-css-cli -o arquivo.min.css arquivo.css` / `npx terser arquivo.js -o arquivo.min.js --compress --mangle`) e re-enviar os dois.

O `.htaccess` já configura:
- Redirecionamento HTTP → HTTPS e `www` → raiz
- Cache de navegador por tipo de arquivo
- Compressão Gzip
- Headers de segurança (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Content-Security-Policy)
- Página 404 personalizada (`ErrorDocument 404 /404.html`)

---

## Status atual

### O que funciona de ponta a ponta
- Todas as páginas de conteúdo (Home, Sobre, Serviços — incluindo NR12, Saúde Ocupacional, Meio Ambiente, PGR, Laudos e Perícias —, Treinamentos, Blog, Contato, Política de Privacidade, 404)
- Formulário de contato e formulário de orçamento rápido (Treinamentos): validam, enviam via Cloudflare Worker para a Brevo, e têm proteção anti-spam (honeypot)
- Banner de cookies (LGPD) em todas as páginas públicas
- Blog: busca por texto e filtro por categoria, funcionando client-side
- SEO on-page: title/description/canonical/Open Graph/Twitter Card em todas as páginas, Schema.org (dados da empresa) na home e no contato, sitemap.xml e robots.txt
- Mapa do Google incorporado na página de Contato
- Favicon completo (`.ico` + tamanhos PNG + apple-touch-icon)
- CSS e JS minificados

### O que depende de uma conta/ID que só a empresa pode criar
Está tudo preparado no código (inclusive a CSP do `.htaccess` já libera os domínios necessários) — só falta inserir o ID real:
- Google Analytics 4 e Google Tag Manager (placeholder comentado em `index.html`)
- Google Search Console (tag de verificação)
- Meta Pixel
- Google reCAPTCHA no formulário de contato

### Limitações conhecidas (decisões de escopo, não bugs)
- **Agenda de treinamentos** (`pages/treinamentos/agenda.html`): página existe mas está fora do índice (`robots.txt` bloqueia) até ter dados reais de turmas.
- **Depoimentos de clientes**: o CSS do componente existe (`.testimonial-card`), mas nenhuma página exibe depoimentos reais no momento.

---

## Formulários e integrações

Os formulários de contato (`pages/contato.html`) e orçamento rápido (`pages/treinamentos/index.html`) enviam para um **Cloudflare Worker** (`https://sceve-contato.lucasronald533.workers.dev`), que atua como proxy e dispara o e-mail via **Brevo** — a chave de API fica no Worker, nunca exposta no código do site. Para alterar o destinatário ou o provedor de e-mail, o ajuste é feito na configuração do Worker (fora deste repositório), não no código do site.
