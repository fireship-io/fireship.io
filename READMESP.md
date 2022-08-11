# [Fireship.io](https://fireship.io/)

Contenido [diseñado](https://fireship.io/mission/) para incrementar la felicidad😁 y la productividad 🚀 del desarrollador.

## Tour del proyecto

El monorepositorio está organizado en cinco sub-proyectos: 

1. `hugo` - Generador de sitios estáticos. Aquí es dónde reside el contenido
2. `design` - Temas y CSS
3. `components` - Componentes Web Elementos de Angular
4. `functions` - Funciones en la nube para firebase en un servidor sin Backend
5. `cypress` - Especificaciones extremo a extremo e integración



## Contribuyendo

Edita y arregla el contenido del sition en  `hugo/content/`. Siéntete libre de enviar PRs para problemas pequeños o fallos de escritura. Para grandes problemas o añadir una característica nueva abre un "Issue". 

### Opción 1 - Errores de escritura u otros errores simple

Para pequeños problemas, como un error de escritura o un enlace roto, usa el editor de archivos de Github o el editor web (se abre presionando <kbd>.</kbd> en la copia del código que hiciste) para hacer el cambio y enviar la "pull request". 

### Opción 2 - Trabaja en tu propia copia

Para contribuciones más complejas, como publicaciones de invitado y nuevas funcionalidades, debes trabajar en tu sistema local

Lo primero, crea un copia del repositorio en GitHub con "Fork"

```shell
git clone <your-forked-repo>
npm install
npm run dev

git checkout -b my-fix
# fix some code...

git commit -m "fix: corrected a typo"
git push origin my-fix
```

Por último, abre una "pull request" en GitHub. Una vez juntado, los cambios serán automáticamente desplegados en el sitio en vivo gracias a la tubería CI/CD

## Ejecutando el sitio


Primero, instala [Hugo](https://gohugo.io/getting-started/installing/).

```shell
git clone <fireship-repo>

npm install

npm run dev
```

Entra en `localhost:1313` y deberías estar en vivo. No necesitas los componentes web para el desarrollo de contenido general, pero se pueden construir con:

```shell
cd components && npm install
npm run build
```


## Contribuye con una publicación

Lee la [guía de estilos](https://fireship.io/style-guide/) para algunos consejos antes de contribuir. 

```shell
cd hugo
hugo new -k bundle lessons/angularfire-google-oauth
hugo new snippets/my-cool-snippet.md
```

### Añade tu bio

¿Tu primera vez contribuyendo? Añade tu bio y enlaces a redes sociales en `content/contributors`. 

## Desarrollo de componentes web

Las funcionalidades interactivas están construidas con Componentes web Elementos Angulas en  `components/`
