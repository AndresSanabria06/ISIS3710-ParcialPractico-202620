# ISIS3710-ParcialPractico-202620

## Ejecución

```bash
npm install
cp .env   # NEXT_PUBLIC_API_URL=http://157.253.204.75:8080
npm run dev            # http://localhost:3000
```

## Revisión de Accesibilidad y Usabilidad

Revisión hecha con Lighthouse y AxeDevTools sobre todas las páginas (`/`, `/plans`, `/plans/[id]`, `/auth/login`, `/auth/register`), complementada con navegación solo con teclado. Las líneas corresponden al código **original** (antes de las correcciones).

| # | Ubicación (archivo y línea) | Herramienta que lo detectó | Regla o principio incumplido | Por qué es un problema o caso específico | Corrección |
|---|---|---|---|---|---|
| 1 | `src/app/layout.tsx` l. 30-32 | Lighthouse / AxeDevTools | `html-has-lang` – WCAG 3.1.1 Idioma de la página | La etiqueta `<html>` no tenía atributo `lang`, así que el lector de pantalla no sabe en qué idioma leer el contenido y lo pronuncia mal. | Se agregó `lang={locale}` (`es` o `en` según el idioma elegido). |
| 2 | `src/app/layout.tsx` l. 21-26 | Lighthouse | `meta-viewport` – WCAG 1.4.4 Cambio de tamaño del texto | `maximumScale: 1` y `userScalable: false` impedían hacer zoom en celulares, lo que afecta a personas con baja visión. | Se eliminaron ambas propiedades del `viewport`. |
| 3 | `src/app/plans/page.tsx` l. 14-17 | Lighthouse / AxeDevTools | `image-alt` – WCAG 1.1.1 Contenido no textual | Las imágenes de las tarjetas de planes no tenían `alt`; el lector de pantalla leía la URL de la imagen. | Se agregó `alt={plan.name}`. |
| 4 | `src/app/plans/page.tsx` l. 19 y 37 | Lighthouse / AxeDevTools | `color-contrast` – WCAG 1.4.3 Contraste mínimo | El creador y el precio usaban `text-slate-300` sobre `bg-slate-50` (contraste aprox. 1.5:1, se exige 4.5:1). El texto casi no se ve. | Se cambió a `text-slate-600` (contraste > 7:1). |
| 5 | `src/app/plans/page.tsx` l. 18 | AxeDevTools | `heading-order` – WCAG 1.3.1 Información y relaciones | Después del `<h1>` se saltaba directamente a `<h4>` en cada tarjeta, lo que rompe la estructura de encabezados con la que navegan los lectores de pantalla. | Los títulos de las tarjetas pasaron a `<h2>` y la grilla a una lista `<ul>/<li>`. |
| 6 | `src/app/page.tsx` l. 9 | AxeDevTools | `page-has-heading-one` – WCAG 1.3.1 / 2.4.6 | El título principal "¿Buscas planes?" era un `<p>`, así que la página de inicio no tenía ningún `<h1>`. | Se cambió por `<h1>`. |
| 7 | `src/app/page.tsx` l. 34-39 | Lighthouse / AxeDevTools | `label` – WCAG 4.1.2 Nombre, función, valor / 3.3.2 | El campo de búsqueda solo tenía `placeholder`, sin etiqueta: el lector anuncia "campo de edición" sin decir para qué es. | Se agregó un `<label htmlFor="search">` visualmente oculto (`sr-only`), `role="search"` en el formulario y el ícono con `aria-hidden`. |
| 8 | `src/app/auth/login/page.tsx` l. 39-62 y `src/app/auth/register/page.tsx` l. 43-93 | Lighthouse / AxeDevTools | `label` – WCAG 1.3.1 / 4.1.2 | Los `<label>` no estaban asociados a su `<input>` (faltaba `htmlFor`). Hacer clic en la etiqueta no enfoca el campo y el lector no anuncia el nombre del campo. | Se agregó `htmlFor` a cada etiqueta y `autoComplete` a cada campo. |
| 9 | `src/components/UserMenu.tsx` l. 41-56 | Lighthouse / AxeDevTools | `button-name` – WCAG 4.1.2 | El botón de cerrar sesión solo tenía un ícono SVG, sin texto: el lector anuncia solo "botón". | Se agregó `aria-label` y `title` ("Cerrar sesión") y el SVG quedó con `aria-hidden`. |
| 10 | `src/app/plans/[id]/page.tsx` l. 160 | AxeDevTools | `tabindex` – WCAG 2.4.3 Orden del foco | El botón "Me gustó" tenía `tabIndex={5}`, lo que altera el orden natural del foco con el teclado (salta a ese botón antes que el resto de la página). | Se eliminó el `tabIndex` positivo. |
| 11 | `src/components/UserMenu.tsx` l. 21-23 | Revisión manual con teclado | WCAG 2.1.1 Teclado / 4.1.2 | "+ Crear Plan" era un `<div>` con `cursor-pointer`: no se puede enfocar con Tab, no tiene rol y además no llevaba a ningún lado. | Se cambió por un `<Link href="/plans/create">`. |
| 12 | `src/app/auth/login/page.tsx` l. 49 y 61, `src/app/auth/register/page.tsx` l. 53, 66, 79 y 92, `src/app/page.tsx` l. 38 | Revisión manual con teclado | WCAG 2.4.7 Foco visible | Los campos usaban `outline-none`, así que al navegar con Tab no se ve cuál campo tiene el foco. | Se quitó `outline-none` y se agregó en `globals.css` un estilo `:focus-visible` con contorno azul para todos los elementos interactivos. |
| 13 | `src/app/globals.css` l. 15-20 | Lighthouse (con esquema de color oscuro) | `color-contrast` – WCAG 1.4.3 | Con el sistema en modo oscuro el texto por defecto pasaba a `#ededed`, pero las tarjetas e inputs son blancos: el texto escrito en el buscador y el número de likes quedaban invisibles. | Se eliminó el bloque `prefers-color-scheme: dark` (la interfaz está diseñada en modo claro) y se dieron colores explícitos al texto. |
| 14 | `src/app/auth/login/page.tsx` l. 65, `src/app/auth/register/page.tsx` l. 95, `src/app/plans/[id]/page.tsx` l. 165 | Revisión manual con lector de pantalla | WCAG 4.1.3 Mensajes de estado | Los mensajes de error aparecen en pantalla pero el lector de pantalla no los anuncia. | Se agregó `role="alert"`, se usó `text-red-700` (mejor contraste) y en login los campos quedan con `aria-invalid` y `aria-describedby`. |
| 15 | `src/app/page.tsx` l. 16-19 y `src/app/plans/page.tsx` l. 5 | Revisión manual (usabilidad) | Heurística de Nielsen: visibilidad del estado del sistema / consistencia | El buscador del inicio enviaba `?search=...` pero la página de planes ignoraba el parámetro: el usuario busca y siempre ve todos los planes. | La página de planes filtra por nombre y muestra "Resultados para …" o un mensaje si no hay resultados. |
| 16 | `src/app/plans/page.tsx` l. 8 y 11, `src/app/plans/[id]/page.tsx` l. 66 y 141, `src/components/Header.tsx` l. 14 | Lighthouse (vista móvil) | WCAG 1.4.10 Reajuste del contenido | `grid-cols-4`, `px-24` y la columna fija `w-96` generaban scroll horizontal y contenido cortado en pantallas pequeñas. | Grillas y columnas responsive (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `flex-col lg:flex-row`, `px-6 md:px-24`). |

## Nueva vista: Crear plan

- Ruta: `/plans/create` (`src/app/plans/create/page.tsx`), accesible desde el botón **+ Crear Plan** del header. Si no hay sesión, redirige a `/auth/login`.
- Al publicar se llama a `POST /plans` (`createPlan` en `src/services/plans.ts`) con el `userId` obtenido de `getSession()`. Si todo sale bien redirige a `/plans`.
- Validaciones:
  - Nombre entre 2 y 50 caracteres.
  - Precio estimado mayor a 0.
  - Duración: número entero (mayor a 0).
  - Descripción obligatoria y con menos de 600 caracteres (contador `n / 600`).
  - Recomendaciones opcionales. Como el back no acepta el campo vacío, si no se escribe nada se envía "Sin recomendaciones adicionales.".
  - Foto de portada opcional. Si se escribe, debe ser un enlace `http(s)`; si no, se usa una imagen genérica de picsum.
- Los errores se muestran debajo de cada campo (con `aria-invalid` y `aria-describedby`) y se enfoca el primer campo con error. Si el back rechaza el plan se muestra un mensaje con `role="alert"`.

## Pruebas E2E (Cypress)

Con la aplicación corriendo (`npm run dev`):

```bash
npm run cypress:run    # modo consola
```

- `cypress/e2e/create-plan-happy-path.cy.ts`: un usuario se registra desde la interfaz, entra a **Crear Plan**, llena el formulario, publica (el back real responde 201) y ve el plan nuevo en el listado.
- `cypress/e2e/create-plan-edge-case.cy.ts`:
  1. Datos inválidos (nombre de 1 carácter, precio 0, duración decimal, descripción de 600 caracteres): se muestran los errores, no se hace ninguna petición al back y no hay redirección.
  2. El back rechaza el plan (sesión con un `userId` que no es UUID → 400): se muestra el mensaje de error, no hay redirección y el plan no aparece en el listado.

La URL del back para las pruebas se lee del archivo `.env`.

## Bono: Internacionalización

Toda la aplicación está disponible en **español** e **inglés**. El botón `EN` / `ES` del header cambia el idioma, que se guarda en la cookie `lang`.

- `src/i18n/dictionaries.ts`: textos de cada idioma. TypeScript obliga a que ambos diccionarios tengan las mismas llaves.
- `src/i18n/server.ts`: `getDictionary()` para componentes de servidor.
- `src/i18n/I18nProvider.tsx`: `useI18n()` para componentes de cliente.
- El atributo `lang` del `<html>`, el título de la página y el formato de los precios (`es-CO` / `en-US`) también cambian con el idioma.
