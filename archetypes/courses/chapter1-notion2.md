+++
title = "Rendu dans l'index"
description = "Où définit-on les informations du tuto rendues dans les pages d'index."
weight = 3
lastmod = {{ .Date }}
emoji = "🌟"
reading_length = "40s"
draft = true
+++

L'apparence du tutoriel dans l'index de la section `/courses/` (où bien dans
celui des sections de type `/tags/<un-tag>`) sera définie par
les fichiers présents dans l'arborescence ci-dessous:

```
content/courses/example-course/
├── img
│   ├── featured.jpg
│   ├── featured.png
│   └── featured.webp
├── _index.md
```

## Titre et description

Ils sont à modifier dans le *front-matter* de la page `_index.md`, au niveau
des paramètres `title` et `description`

{{< file "file" "content/courses/example-course/_index.md" >}}

```md
+++
title = "titre du tuto"
description = "description du tuto"
+++
```

## Image associée au tuto

Dans le dossier de contenu de votre tuto, vous devez placer un fichier
`featured.webp` au format 16:9 dans le sous-dossier `img/`, comme ceci:

Il est conseillé de placer un fichier `featured.jpg` et/ou `featured.png`
de sorte à ce que l'image puisse être facilement modifiable par la suite
avec un traquage par `git`. Le format actuellement utilisé est en `1920x1080px`.

Libre à vous d'utiliser l'outil de votre choix pour générer l'image en format
`.webp`. Sur Linux, il existe le paquet `webp`, utilisable avec la commande
`cwebp` décrite ci-dessous:

```sh
# Dans le dossier img/
cwebp featured.png -o featured.webp
```
