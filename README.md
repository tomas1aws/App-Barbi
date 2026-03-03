# App-Ceci

App de Next.js para registrar y calificar alfajores con Supabase.

> Nota: la PWA y el Service Worker fueron deshabilitados temporalmente para evitar interceptaciones de red que generaban errores `TypeError: Failed to fetch` en requests a Supabase.

## ⚠️ Seguridad de keys
- Usar en cliente **solo** `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Nunca** usar `sb_secret_...`, `service_role` ni ninguna secret key en frontend.
- Si una secret key fue cargada en Vercel, eliminarla de variables públicas y rotarla.

## Stack
- Next.js (pages router)
- TailwindCSS
- Supabase (Database + Storage)

## Requisitos
1. Node.js 18+
2. Crear `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://wygsrnmffypsbjbtjdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_nBXT6-mF6qrSP008AafBXw_ML2DjzdF
```

> No usar la `service_role` key en frontend.

## SQL Supabase

```sql
create extension if not exists "uuid-ossp";

create table if not exists alfajores (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  brand text,
  image_path text,
  rating integer,
  review text,
  tasted_at timestamp with time zone default now(),
  degustado_en date,
  created_at timestamp with time zone default now()
);
```



### Migración sugerida

```sql
alter table public.alfajores
add column if not exists degustado_en date;
```

## Storage Supabase
- Bucket: `alfajores`
- Público para lectura.
- Para MVP sin login, habilitar políticas de inserción acordes a tu proyecto.

Ejemplo de políticas (ajustar según seguridad necesaria):

```sql
-- lectura pública de archivos
create policy "Public read alfajores"
on storage.objects for select
to public
using (bucket_id = 'alfajores');

-- subida pública (MVP)
create policy "Public upload alfajores"
on storage.objects for insert
to public
with check (bucket_id = 'alfajores');
```

## Desarrollo local (sin PWA)
La app corre como una app estándar de Next.js, sin Service Worker:

```bash
npm install
npm run dev
```

## Build y producción

```bash
npm run build
npm start
```


### Variables de entorno en Vercel (evitar espacios/saltos de línea)
- Cargar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` **sin espacios al inicio/fin** y **sin saltos de línea**.
- Un espacio o `\n` extra puede romper fetch con errores como `Failed to fetch` / `fetch failed`.
- Recomendado: pegar el valor en una sola línea y verificar en `/debug` el `JSON.stringify(...)` y los `length` para confirmar que están limpios.

## Deploy en Vercel (pasos recomendados)
1. Importar repo en Vercel.
2. Configurar variables de entorno de proyecto (Production y Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Forzar redeploy luego de guardar variables.
4. Abrir `/debug` y correr diagnóstico.
5. Interpretación rápida:
   - Si frontend falla y `/api/supabase-ping` responde OK: problema de navegador (SW/cache/extensión/CORS en browser).
   - Si frontend y server fallan: problema de URL/key/env o Supabase caído/no alcanzable.
   - Si da `401/403`: key inválida o políticas/permisos de tabla/bucket.

## Estructura

```txt
/pages
  index.js
  debug.js
  new.js
  /api/supabase-ping.js
  /alfajores/[id].js
  /edit/[id].js
/components
  AlfajorCard.js
  AlfajorForm.js
  StarRating.js
/lib
  supabaseClient.js
  alfajoresApi.js
/styles
  globals.css
```
