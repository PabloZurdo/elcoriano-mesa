// Construye noticias.js (lo que lee la portada) a partir de contenido/.
// Solo entran las noticias con estado "publicada".
// Uso: node scripts/construir.js [carpeta_salida]
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const salida = process.argv[2] || raiz;
const leer = (f) => JSON.parse(fs.readFileSync(path.join(raiz, f), "utf8"));

const meta = leer("contenido/meta.json");
const agenda = leer("contenido/agenda.json").agenda || [];

const carpeta = path.join(raiz, "contenido/noticias");
const noticias = fs
  .readdirSync(carpeta)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(carpeta, f), "utf8")))
  .filter((n) => (n.estado || "publicada") === "publicada")
  .map((n) => {
    const o = { ...n };
    delete o.estado;
    if (o.orden !== undefined && o.orden !== "") o.orden = Number(o.orden);
    // El panel guarda la foto como "/fotos/archivo.jpg"; la portada espera "archivo.jpg".
    if (o.foto) o.foto = String(o.foto).replace(/^\/?fotos\//, "");
    // El panel guarda el SEO como objeto; la portada lo espera como lista.
    if (o.seo && !Array.isArray(o.seo)) {
      o.seo = [o.seo.slug || o.id, o.seo.titulo || "", o.seo.descripcion || "", o.seo.etiquetas || []];
    }
    if (o.peso) o.peso = Number(o.peso);
    if (o.ficticia === false) delete o.ficticia;
    if (o.ultima_hora && !o.ultima_hora.texto) delete o.ultima_hora;
    // Quita campos vacíos que deja el panel.
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (v === "" || v === null || (Array.isArray(v) && v.length === 0)) delete o[k];
    }
    return o;
  })
  .sort((a, b) => b.iso.localeCompare(a.iso) || (a.orden ?? 99) - (b.orden ?? 99) || (b.hora || "").localeCompare(a.hora || ""))
  .map((n) => { delete n.orden; return n; });

meta.actualizado = new Date().toISOString().slice(0, 10);
const datos = { meta, agenda, noticias };
fs.writeFileSync(path.join(salida, "noticias.js"), "window.EP = " + JSON.stringify(datos, null, 1) + ";\n");
console.log(`noticias.js: ${noticias.length} noticias publicadas`);
