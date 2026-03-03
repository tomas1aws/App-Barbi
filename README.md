# App-Barbi

App de Next.js para registrar y calificar vinos con Supabase.

## ⚠️ Seguridad de keys
- Usar en cliente **solo** `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Nunca** usar `sb_secret_...`, `service_role` ni ninguna secret key en frontend.

## Stack
- Next.js (pages router)
- TailwindCSS
- Supabase (Database + Storage)

## Requisitos
1. Node.js 18+
2. Crear `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## SQL Supabase

```sql
create extension if not exists "uuid-ossp";

create table if not exists public.vinos (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  winery text,
  varietal text,
  year integer,
  rating integer,
  review text,
  catado_en date,
  image_path text,
  created_at timestamp with time zone default now()
);
```

## Storage Supabase
- Bucket: `vinos`
- Público para lectura.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build y producción

```bash
npm run build
npm start
```

## Estructura

```txt
/pages
  index.js
  new.js
  /vinos/[id].js
  /edit/[id].js
/components
  VinoCard.js
  VinoForm.js
  StarRating.js
/lib
  supabaseClient.js
  vinosApi.js
/styles
  globals.css
```
