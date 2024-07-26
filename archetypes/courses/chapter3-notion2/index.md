+++
title = "Shortcodes"
description = """Découvrez comment joliment rédiger avec du Markdown."""
weight = 8
lastmod = {{ .Date }}
emoji = "✏️"
video_length = "2m"
draft = true
+++

Pour mettre en forme une page, trois syntaxes seront plus ou moins utiles à
prendre en main, selon le besoin.

Elles peuvent être classables de la plus native à la plus abstraite :

1. Le Markdown natif permet de couvrir 95% de la mise en forme d'une page. Hugo
   suit la [spec CommonMark](https://spec.commonmark.org/0.31.2/) dans son moteur
   de rendu.
2. En mode *inline*, des balises HTML peuvent aussi être intégrées dans le
   Markdown. Ceci peut permettre d'enrichir l'interactivité d'une page.
3. Il est enfin possible d'enrichir la page à l'aide d'une syntaxe introduite
   par Hugo: les ***[shortcodes](https://gohugo.io/content-management/shortcodes/)***.

Je recommande plutôt d'utiliser des shortcodes car ils permettent un usage bien
plus contrôlé d'élements HTML ajoutés, comme des composants Svelte.

## Shortcodes natifs d'Hugo

### Figures

Les schémas et les images ça peut toujours être pratique à intégrer. Le
shortcode [figure](https://gohugo.io/content-management/shortcodes/#figure)
dispose de pas mal d'attributs intéressant à déployer

{{< highlight markdown >}}
{{</* figure src="/courses/test-course/img/featured.png" 
    caption="L'image de couverture" */>}}
{{< /highlight >}}

{{< figure src="/courses/test-course/img/featured.png"
    caption="L'image de couverture" >}}

### [Bloc de code](https://gohugo.io/content-management/shortcodes/)

Bien qu'avec la syntaxe des trois ``` on peut déjà écrire des blocs de code
formaté, il existe aussi un shortcode pour le faire, avec des syntaxes
enrichies.

Ainsi, écrire ceci dans le markdown

{{< highlight markdown >}}
{{</* highlight typescript */>}}
function myFunction(a: string, b: number): string {
  return a + b.toString();
}
{{</* /highlight */>}}
{{< /highlight >}}

sera rendu comme ceci :
{{< highlight typescript >}}
function myFunction(a: string, b: number): string {
  return a + b.toString();
}
{{< /highlight >}}

### Référence vers d'autres sections du site

Les shortcodes [`ref`](https://gohugo.io/content-management/shortcodes/#ref) et
[`relref`](https://gohugo.io/content-management/shortcodes/#relref) peuvent
être utiles pour ça.

## Shortcodes ajoutés par ce site

### Fichier

Ce shortcode prend comme premier argument le nom de l'icône associé à
l'extension du fichier (l'icône doit être disponible dans le dossier
`./layouts/partials/svg`) puis comme second argument l'adresse du fichier qu'on
a envie d'afficher.

Le code ci-dessous couplé avec celui d'avant donnerait le bloc après.

{{< highlight markdown >}}
{{</* file "ts" "src/index.ts" */>}}
{{< /highlight >}}
{{< file "ts" "src/index.ts" >}}
{{< highlight typescript >}}
function myFunction(a: string, b: number): string {
  return a + b.toString();
}
{{< /highlight >}}

### Onglets à switcher

Ceci peut être utile si certaines parties d'un chapitre dépendent d'un certain
choix du lecteur concernant je ne sais quoi (e.g. si un chapitre traite de
l'intégration d'un formatteur de code dans un éditeur, alors il peut être
possible de ne lire que la section concernant VSCode et non celle concernant
Neovim).

Le bloc de code ci-dessous à insérer dans le markdown produit le rendu après.

{{< highlight markdown >}}
{{%/* tabs/main */%}}
  {{%/* tabs/item title="Item1" */%}}

## Voilà mon item
Cette section va être mise en forme comme il faut.

  {{%/*/ tabs/item */%}}
  {{%/* tabs/item title="Item2" */%}}

## Voilà mon second item
Ce bloc de contenu aussi, mais il ne pourra pas être affiché simulatanément
avec l'autre bloc.

  {{%/*/ tabs/item */%}}
{{%/*/ tabs/main */%}}
{{</ highlight >}}


{{% tabs/main %}}
  {{% tabs/item title="Item1" %}}

## Voilà mon item
Cette section va être mise en forme comme il faut.

  {{%/ tabs/item %}}
  {{% tabs/item title="Item2" %}}

## Voilà mon second item
Ce bloc de contenu aussi, mais il ne pourra pas être affiché simulatanément
avec l'autre bloc.

  {{%/ tabs/item %}}
{{%/ tabs/main %}}
