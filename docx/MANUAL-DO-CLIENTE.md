# Manual de Uso do Site — Sceve Engenharia

Este manual explica, em linguagem simples, como manter o site no dia a dia: trocar textos, imagens, publicar atualizações, adicionar páginas e fazer backup.

**Antes de começar, um ponto importante:** este site **não tem painel administrativo** (não é WordPress nem similar). Ele é feito de arquivos HTML "puros" — cada página é um arquivo de texto com código, e editar o conteúdo significa editar esse arquivo diretamente. Isso é normal para sites deste tipo (costuma carregar mais rápido e custar menos hospedagem), mas quer dizer que qualquer alteração de texto ou imagem exige um mínimo de à-vontade com um editor de texto e com o envio de arquivos para a hospedagem.

Se a sua equipe não tiver essa disponibilidade, considere manter um freelancer ou agência para alterações pontuais, ou avaliar futuramente a migração para uma plataforma com painel (o que tem custo e é um projeto à parte).

---

## 1. Como publicar uma atualização

Toda alteração segue o mesmo fluxo, não importa o que você mudou:

1. Abra o arquivo que quer editar em um editor de texto. Recomendado: [VS Code](https://code.visualstudio.com/) (gratuito) — o Bloco de Notas do Windows funciona, mas sem realce de código fica mais fácil errar.
2. Faça a alteração e salve o arquivo.
3. Envie o arquivo alterado para a hospedagem, substituindo o arquivo antigo, por um destes caminhos:
   - **Painel da Hostinger** → Gerenciador de Arquivos → navegue até a pasta correspondente → envie o arquivo.
   - **FTP** (FileZilla ou similar) → conecte com os dados de acesso da hospedagem → arraste o arquivo pro mesmo caminho de pastas que ele tem aqui no projeto.
4. Acesse o site (de preferência em uma aba anônima, pra não pegar versão em cache) e confira se a alteração apareceu.

> **Dica:** sempre que for mexer em algo importante (como a home), faça uma cópia do arquivo original antes de editar. Se algo der errado, é só reenviar a cópia.

---

## 2. Como trocar um texto

Abra o arquivo da página em questão (veja a lista de páginas no [README.md](../README.md)) e procure o texto que quer trocar — em geral ele aparece entre uma tag de abertura e fechamento, por exemplo:

```html
<h1 class="page-hero__title">Solicite uma proposta</h1>
```

Aqui, o texto visível é só `Solicite uma proposta` — tudo que está entre `<` e `>` é código e **não deve ser apagado**, só o texto de dentro.

### Exemplos comuns

**Trocar o telefone/WhatsApp:** o número `(41) 98790-5344` (e o link `wa.me/5541987905344`) aparece em **praticamente todas as páginas** — no cabeçalho, no rodapé, nos botões de WhatsApp e no formulário. Não existe um lugar único para trocar de uma vez. No VS Code, use **"Localizar em Arquivos"** (`Ctrl+Shift+F`), procure por `5541987905344` e `98790-5344`, e troque um por um — o editor mostra todos os arquivos onde aparece. **Esse é o tipo de alteração que vale pedir ajuda de um desenvolvedor**, porque é fácil esquecer um arquivo.

**Trocar o endereço:** aparece em `pages/contato.html` (card "Endereço" e o link do mapa) e nos dados estruturados (`Schema.org`) de `index.html` e `pages/contato.html`. Procure por `Gabriel Ribeiro` nesses três arquivos.

**Trocar o texto da home:** está em `index.html`, dentro da seção com classe `page-hero` (perto do topo do arquivo).

---

## 3. Como trocar uma imagem

As imagens ficam em `assets/img/` (imagens gerais) e `assets/img/blog/` (fotos dos posts do blog).

1. Prepare a nova imagem já no tamanho certo — trocar por uma imagem com proporção muito diferente pode distorcer o layout. Comprima o arquivo antes de subir (ferramentas gratuitas: [squoosh.app](https://squoosh.app) ou [tinypng.com](https://tinypng.com)) para não pesar o carregamento do site.
2. **Mais simples:** salve a nova imagem com o **mesmo nome e extensão** do arquivo antigo (ex.: substituir `nr12-maquinas.jpg` por outra foto, mas continuar chamando o arquivo `nr12-maquinas.jpg`) e envie por FTP/painel sobrescrevendo o arquivo. Nenhum HTML precisa ser tocado.
3. **Se o nome for diferente**, além de enviar o arquivo novo você precisa editar o HTML da página que usa aquela imagem e trocar o `src="assets/img/..."` para o novo nome de arquivo.

---

## 4. Como adicionar uma nova página de serviço

O jeito mais seguro é partir de uma página parecida que já existe e adaptar. Exemplo: para criar um novo serviço parecido com PGR ou Laudos:

1. Copie o arquivo `pages/servicos/pgr.html` e renomeie a cópia (ex.: `pages/servicos/novo-servico.html`).
2. Abra a cópia e troque: `<title>`, a meta descrição, o `<h1>`, os textos das seções e o FAQ.
3. Adicione um link para essa nova página no menu "Serviços" — **e aqui está o ponto trabalhoso:** como não existe menu compartilhado entre páginas, esse link de menu precisa ser adicionado à mão em **todas** as páginas do site (mais de 20 arquivos), tanto na versão de computador quanto na de celular. Procure por `laudos-pericias.html` no VS Code ("Localizar em Arquivos") — ele vai mostrar exatamente os pontos onde o menu de Serviços é repetido, e você adiciona o link novo do lado.
4. Adicione a nova página também nos cards da home (`index.html`) e da página "Todos os Serviços" (`pages/servicos/index.html`), se quiser que ela apareça ali.
5. Adicione a URL no `sitemap.xml`.

**Esta é a tarefa mais indicada para pedir apoio técnico**, justamente pela parte 3 — é mecânico, mas com muitos arquivos pra manter consistentes.

---

## 5. Como fazer backup

1. No painel da Hostinger ou por FTP, baixe **a pasta inteira** do site (todos os arquivos e subpastas) para o seu computador.
2. Compacte essa pasta em um `.zip` com a data no nome, por exemplo `sceve-backup-2026-07-22.zip`.
3. Guarde esse arquivo em pelo menos dois lugares (ex.: um HD/nuvem da empresa + Google Drive), nunca só na sua máquina.
4. Recomendado: fazer esse backup antes de qualquer atualização grande, e pelo menos uma vez por mês mesmo sem mudanças.

> Como o código também está no Git (histórico de versões), cada alteração enviada por commit já fica registrada ali. O backup de arquivos serve principalmente para garantir a cópia do que está *realmente publicado* na hospedagem a qualquer momento.

---

## 6. Como restaurar um backup

1. Descompacte o `.zip` do backup em uma pasta no seu computador.
2. Conecte na hospedagem (painel ou FTP) e apague os arquivos atuais da raiz do site — **ou**, mais seguro, renomeie a pasta atual (ex.: `public_html_antigo`) em vez de apagar, para poder voltar atrás se precisar.
3. Envie todos os arquivos do backup para a raiz do site, mantendo a mesma estrutura de pastas.
4. Acesse o site em uma aba anônima e confira se voltou ao estado esperado.

---

## 7. Contas que a empresa deve manter sob controle próprio

Nunca deixe esses acessos só com o desenvolvedor — guarde login e senha em um cofre de senhas da empresa:

- Painel da hospedagem (Hostinger)
- Registro do domínio `sceveengseg.com.br`
- E-mail profissional (`comercial@sceveengseg.com.br`)
- Conta do Cloudflare Worker que processa o envio dos formulários (`sceve-contato...workers.dev`) — é esse serviço que efetivamente manda o e-mail quando alguém preenche o formulário do site
- Assim que forem criadas: Google Analytics, Google Search Console, Google Meu Negócio, Meta Business (Pixel)

---

## Dúvidas técnicas

Para detalhes de arquitetura, estrutura de pastas e status técnico do site, veja o [README.md](../README.md) na raiz do projeto.
