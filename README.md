# Vapt Web 🛒⚡

Frontend do Vapt - Ecossistema digital reativo para conectar consumidores a ofertas locais de supermercados em tempo real.

## 🎯 Sobre o Projeto

O Vapt centraliza promoções de diferentes redes e unidades, permitindo que o usuário encontre o menor preço "num vapt-vupt".

## 🛠️ Stack Técnica

- **Nuxt 3** - Framework Vue.js com SSR
- **Vue 3** - Composition API e reatividade
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Bun** - Runtime e package manager

## 📁 Estrutura

```
├── composables/          # Lógica reutilizável e API calls
│   ├── usePromocoes.ts
│   ├── useUnidades.ts
│   ├── useRedes.ts
│   └── useGeolocalizacao.ts
├── components/           # Componentes Vue
│   ├── PromocaoCard.vue
│   └── UnidadeCard.vue
├── pages/               # Rotas da aplicação
│   ├── index.vue
│   └── unidades/
├── types/               # Tipos TypeScript
└── layouts/             # Layouts da aplicação
```

## ⚙️ Setup

```bash
bun install
```

Configure a URL da API:

```bash
cp .env.example .env
```

Edite `.env` com a URL do backend:

```
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

## 🚀 Desenvolvimento

```bash
bun run dev
```

Acesse `http://localhost:3000`

## 🏗️ Build para Produção

```bash
# Gerar build de produção
bun run build

# Testar build localmente
bun run preview
```

## 🚢 Deploy em Produção

### Variáveis de Ambiente

Configure antes do build:

```bash
NUXT_PUBLIC_API_BASE=https://api.vapt.com.br
```

### Executar com Bun

```bash
# Build
bun run build

# Executar em produção
bun .output/server/index.mjs
```

Com porta customizada:

```bash
PORT=8080 NUXT_PUBLIC_API_BASE=https://api.vapt.com.br bun .output/server/index.mjs
```

### Docker com Bun

```dockerfile
FROM oven/bun:1-alpine

WORKDIR /app
COPY .output .output

ENV NUXT_PUBLIC_API_BASE=https://api.vapt.com.br
ENV PORT=3000

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
```

```bash
docker build -t vapt-web .
docker run -p 3000:3000 -e NUXT_PUBLIC_API_BASE=https://api.vapt.com.br vapt-web
```

## ✨ Funcionalidades

- 🔍 Busca e filtro de ofertas por nome, marca e categoria
- 📍 Geolocalização para calcular distância das lojas
- 🏪 Busca de lojas por cidade
- 💰 Visualização de ofertas por loja
- 📱 Interface responsiva mobile-first
- ⚡ Performance reativa com Composition API
