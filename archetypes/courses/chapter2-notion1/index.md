+++
title = "Technologies abordées"
description = """Dans la page d'arrivée du tuto, des icônes d'outils célèbres
peuvent être affichés."""
weight = 5
lastmod = {{ .Date }}
emoji = "⚙️"
reading_length = "15s"
chapter_start = "Chapitre 2"
draft = true
+++

Le paramètre `stack` dans le fichier `/content/courses/<nom-tuto>/_index.md`
doit être rempli d'une liste de mots-clés bien précis pour qu'une liste
d'icônes apparaisse sur la page d'arrivée (section `/courses/<nom-tuto>/`).
Vous pouvez voir ces icônes sur la page à la racine de ce tuto généré.

Les mots-clés dans le paramètre `stack` doivent avoir leur image `.svg`
associée dans le fichier sur le chemin `/static/img/icons/<mot-clé>.svg` depuis
la racine du repository.
