# El Coriano · prototipo de redacción

Entorno de pruebas de la nueva mesa de redacción. No es la web pública (elcoriano.es).

- **Panel de redacción:** `/admin/` (Sveltia CMS). Se entra con la cuenta de GitHub.
- **Noticias:** un archivo por noticia en `contenido/noticias/`. Solo salen en la web las que tienen `estado: publicada`.
- **Agenda:** `contenido/agenda.json`.
- **Fotos:** `fotos/`.
- **Publicación:** cada cambio en `main` ejecuta `scripts/construir.js`, que genera `noticias.js`, y GitHub Pages publica la web en un minuto.
