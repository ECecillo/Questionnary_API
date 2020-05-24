// //////////////////////////////////////////////////////////////////////////////
// Affiche les infos d'un quiz que l'on a sélectionné avec les boutons de modification ...
// //////////////////////////////////////////////////////////////////////////////

// Créer des floating action button
// color: la couleur de l'icone
// nameOfIcon: le nom de l'icone pour l'affichage par rapport à material icon
// className: pour la génération d'eventlistener
// divToAppend: si on veut le mettre à un endroit précis.
function renderSmallFloatingObject(color, nameOfIcon, className) {
  let a = `
    <a class="btn-floating ${color} ${className}"> 
      <i class="material-icons">${nameOfIcon}</i>
    </a>
    `;
  return a;
}

// Pour un quizz selectionné, on affiche les données du quizz en question
// C'est à dire que l'on affiche le formulaire pour séléctionner les réponses des questions
// ainsi que leurs questions. Mais cette fois pour les quizzes de l'utilisateur
//quiz: le contenu du quiz sur lequel on a cliqué.
//quiz_id: l'id du quiz sur lequel on a cliqué.
function renderCurrentUserQuizz(quizz, quiz_id) {
  console.debug(`@renderCurrentUserQuizz(${quizz}, ${quiz_id})`);
  const main = document.getElementById("id-my-quizzes-main");
  // On gère si il y a bien des données à afficher
  if (quizz === undefined) {
    main.innerHTML = "Pas de data";
  } else {
    main.innerHTML = htmlQuizzesListContent(quizz, true);

    let title = document.getElementById("titleUserQuiz");
    title.innerHTML += renderSmallFloatingObject("grey", "create", "changeTD");

    let quiz_head = document.getElementById("quizz_head");
    quiz_head.innerHTML += `
        <div class="modifier" style="padding: 0.2rem 0rem;">
          ${renderSmallFloatingObject("green", "add", "create")}
        </div>
      `;

    let changeTD = document.querySelector(".changeTD"); // Affichera changeTitleDesc
    let createProp = document.querySelector(".create"); // Affichera addNewProp
    let deleteForEVER = document.getElementsByClassName("delete_forever"); // Affichera deleteQuestionUser
    let edit_prop = document.getElementsByClassName("edit_prop"); // Affichera editUserQuizz

    createProp.addEventListener("click", function () {
      // On appuie sur le bouton PLUS
      var sentenceId = () => {
        // Retourne le nombre de Question dans le quiz sélectionné.
        let idQ = 0;
        while (document.querySelector(`#sentence_${idQ}`) !== null) {
          idQ++;
        }
        return idQ;
      };
      return addNewProp(quiz_id, sentenceId());
    });

    changeTD.addEventListener("click", function () {
      return changeTitleDesc(quizz, quiz_id);
    });

    Array.from(deleteForEVER).map(
      //Pour chaque bouton on lui donne l'événement onclick deleteQuestionUser
      (el) =>
        (el.onclick = () => {
          let idQ = el.id;
          return deleteQuestionUser(quiz_id, idQ);
        })
    );

    Array.from(edit_prop).map(
      //Pour chaque bouton on lui donne l'événement onclick editUserQuizz
      (el) =>
        (el.onclick = () => {
          let idQ = el.id;
          getQuestionData(quiz_id, idQ); // récupère les infos du quiz que l'on a sélectionné.
          return editUserQuizz(quiz_id, idQ);
        })
    );
  }
}
