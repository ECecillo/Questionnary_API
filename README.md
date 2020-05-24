
LIFAP5 - projet 2019-2020 : gestionnaire de QCM

===============================================

  

* Notre dépôt <https://forge.univ-lyon1.fr/p1805901/lifap5-projet-ae>

* BONIS Alexis p1805132

* CECILLON Enzo p1805901

* Nom de votre application (optionnel)

  

## Fonctionnalités obligatoires

  

*  [X]  **Modifier l'utilisateur connecté** : il faut pour cela remplir la champ `xApiKey` de l'objet `state` déclaré dans `js/modeles.js`. Comprendre le fonctionnement permettant le mise à jour de l'état (dans `js/modeles.js`) et la modification du comportement du bouton "utilisateur" (dans `js/vues.js`). Ensuite, il faut permettre de choisir l'utilisateur avec lequel on se connecte et se délogguer le cas échéant.

*  [X]  **Afficher les questions et les propositions d'un quiz** : lorsque l'on clique sur un quiz, la fonction `clickQuiz` (définie dans `js/vues.js`) est appelée. Elle appelle `renderCurrentQuizz` qui va changer l'affichage du div HTML `id-all-quizzes-main`. Modifier ces fonctions de façon à afficher les questions (et leurs propositions de réponses) du quiz au lieu de "Ici les détails pour le quiz _xxyyzz_".

*  [X]  **Répondre à un quiz**: modifier l'affichage précédent de façon à pouvoir répondre au quiz, c'est-à-dire pouvoir cocher la réponse choisie à chaque question, puis cliquer sur un bouton "Répondre" qui enverra les réponses au serveur.

* [X] **Afficher les quiz de l'utilisateur connecté et des réponses déjà données** : reprendre la fonctionnalité d'affichage de tous les quiz et l'adapter pour afficher les quiz de l'utilisateur connecté dans l'onglet "MES QUIZ". Similairement, remplir l'onglet "MES REPONSES" pour afficher les quiz auxquels l'utilisateur connecté a répondu.
	- **La fonctionnalité n'a pas été faite entièrement,** 
`ref --> Remarque sur la partie oblicatoire(bas de page)` .

*  [X]  **Créer un quiz pour l'utilisateur connecté** : ajouter un formulaire permettant de saisir les informations d'un nouveau quiz dans l'onglet "MES QUIZ". Ajouter un bouton "Créer" qu déclenchera l'ajout du quiz sur le serveur et le rafraîchissement de la liste des quiz. Permettre d'ajouter aux quiz de l'utilisateur connecté un formulaire d'ajout de question. Ce formulaire permettra de saisir les propositions possibles pour la question. Sa validation déclenchera l'ajout de la question sur le serveur.

  

## Fonctionnalités optionnelles
 

*  [X] Catégorie **modifications de quiz et de leurs questions**

- Mettre à jour un quiz : changer la description et le titre d'un quiz. Ajouter un bouton "Modifier" qui va faire apparaître un formulaire de modification. Gérer ce formulaire pour mettre à jour les données sur le serveur.

- Mettre à jour l'énoncé une question: changer la phrase (`sentence`) d'énoncé et permettre d'ajouter / de supprimer une proposition à une question : ajouter par exemple un bouton de suppression à côté de chaque question et un formulaire d'ajout de proposition (NB, le serveur ne propose pas de route permettant de manipuler les propositions, tout passe par l'API des questions)

  

* [ ] Catégorie **affichage des quiz**

- Permettre de choisir le nombre de résultats, le critère de tri des quiz ainsi que l'ordre (croissant ou décroissant) de l'affichage

- Gérer la pagination pour afficher la liste des pages existantes avec le [composant pagination](https://materializecss.com/pagination.html) de Materialize.

  

* [ ] Catégorie **calcul des notes des quiz**

- Dans l'onglet "MES QUIZ", afficher pour chacun des quiz de l'utilisateur la listes des répondants à ce quiz ainsi que la note obtenue, en comptant le nombre de réponses correctes répondues à chacune des questions (on supposera que toutes les questions ont le même poids).

- Dans la liste des répondant d'un quiz, colorer différement les quiz qui sont complets (le répondant a répondu à toutes les questions) et les partiels

  

*  [X] Catégorie **gestion des réponses**

- Modifier les réponses à un quiz auquel on a déjà répondu: Lorsque l'on a déjà répondu à un quiz, modifier le formulaire de réponse de façon à ce que le contenu du formulaire soit pré-rempli avec les réponses de l'utilisateur.

- Se passer du bouton "Répondre" dans le formulaire de réponse: à chaque fois qu'une case est cochée, mettre directement à jour le serveur avec la réponse choisie par l'utilisateur.

  

* [ ] Catégorie **simplification IHM, suppression "MES QUIZ"**

- Supprimer l'onglet "MES QUIZ" et intégrer ses fonctionnalités à l' onglet "TOUS LES QUIZ" en faisant en sorte que si le quiz affiché appartient à l'utilisateur connecté, les fonctionnalités de création (et modifications le cas échéant) sont accessibles.

  

*  [X] Catégorie **formulaire de recherche**

- Le formulaire de recherche en haut de la page permet de recherche en texte plein sur tous les champ de texte des quiz, des questions et des propositions. Changer le comportement de l'onglet "TOUS LES QUIZ" mette en surbrillance les éléments au

  

* [ ] Catégorie **mise à jour dynamique**

- Gérer la mise à jour dynamique de la liste des quiz avec avec le _websocket_ fourni par le fichier [`websocket.js`](./js/websocket.js). La fonction fournie `installWebSocket(callbackOnMessage)` prend un paramètre un callback qui devra lancer le rafraichissement de votre interface lors d'une mise à jour sur le serveur.



  

## Remarque sur la partie obligatoire :

- Nous n'avons pas eu le temps de faire la fonctionnalité d'affichage des réponses, en revanche en codant la fonctionnalité optio. gestion des réponses nous avons pu nous approcher de ce qui semblait être attendu.

## Remarques sur la partie optionnelle :

- Pour la fonctionnalité de modification d'une proposition d'un quiz, il **faut appuyer deux fois sur le bouton modifier** pour que l'on puisse voir la question et les propositions. Si on change de proposition à modifier, on doit appuyer deux fois sur le logo sinon nous n'avons pas les valeurs déjà présente dans la proposition.

- La fonctionnalité de Recherche de quiz **n'est pas complétement fonctionnelle**.
	- Elle affiche seulement les quiz qui ont un numéro étudiant ou un élément peu présent dans d'autre quiz.
	-  Nous avons essayés de travailler avec un **rate limiter** pour faire en sorte que le serveur ne nous bloquent pas lorsque nous faisions une recherche dans la base de donnée.
	 Néanmoins, nous n'avons pas réussi à le faire marcher et nous avons également eu des problèmes pour afficher les quiz retournés par la recherche. Par ailleurs, pour l'affichage des quiz nous avons essayés de reprendre les fonctions que nous avions écris précedement tel que ***renderQuizz***  mais sans succès apparent.
## Ce que nous aurions pu faire avec plus de temps :
- Nous avions envisagés de modifier la partie login de l'utilisateur pour que sa clé d'API soit sauvegardé dans le **LocalStorage** cela aurait ressemblé par exemple à : 
*(ceci est une juste un exemple, cela n'aurait pas été le code finale)*

    ````
    // Cette partie serait dans le renderUserBtn quand l'utilisateur se connecte.
  localStorage.setItem('Apikey', document.getElementById("api").value);
   // Celle-ci dans la constante state.
   xApiKey: localStorage.getItem('ApiKey'),
   // Puis lorsque l'utilisateur se déconnecte :
   localStorage.clear();
