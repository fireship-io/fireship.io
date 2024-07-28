+++
title = "Auteur"
description = "Comment définir l'auteur d'un cours"
weight = 6
lastmod = {{ .Date }}
emoji = "🌟"
reading_length = "1m15"
draft = true
+++

## Créer un contributeur
Pour définir un contributeur, il faut créer une page dans le dossier
`/content/contributors`.

{{< file "file" "./content/contributors/contributor-name.md" >}}

```toml
+++
title = "Contributor Name"
authorbio = "Small description"
authorname = "Nom de contributeur qui sera affiché, s'il doit être différent du titre"
date = 2024-07-18 10:22:57

[link]
  website = "https://www.example.fr"
  github = "https://github.com/Eirbware/"
+++
```

***Le nom du fichier markdown associé à la page doit être le nom spécifié dans
le champ `title` avec une conversion sous forme d'identifiant css.*** La
correspondance schématisée ci-dessous doit alors pouvoir être faite en
arrière-plan.

```
"Contributor Name" -> "contributor-name" -> /contributors/contributor-name.md
```

## Attribuer l'auteur au tutoriel

***Le nom de l'auteur doit être le même que celui définit dans le champ
`title` de son fichier de description.***

{{< file "file" "./content/courses/example-course/_index.md" >}}

```toml
+++
# ...
author = "Contributor Name"
+++
```


## Ajouter une image au contributeur

Une image peut aussi être associée si elle est placée dans un fichier
`./content/contributors/img/contributor-name.webp`.

Il est possible en revanche de passer outre ce système de nommage et de chemin :
si vous souhaitez nommer l'image autrement que `contributor-name`, pour
l'appeler par example `toto.webp`, vous pouvez la relier à l'auteur en
attribuant son *permalink* (i.e. son lien accessible depuis le site une fois
celui-ci généré) au champ `featured_img` du *front-matter* de sa page de
description:

{{< file "file" "./content/contributors/contributor-name.md" >}}

```toml
+++
# ...
featured_img = "/contributors/img/toto.webp"
+++

```

Vous pouvez donc aussi placer l'image dans le dossier `./static/img/` depuis la
racine du dépôt. Elle sera donc accessible dans la section `/img/toto.webp` du
site généré et il est donc possible de la relier à l'auteur comme ceci:

{{< file "file" "./content/contributors/contributor-name.md" >}}

```toml
+++
# ...
featured_img = "/img/toto.webp"
+++

```
