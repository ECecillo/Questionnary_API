// //////////////////////////////////////////////////////////////////////////////
// Affichage de la liste de tous les quiz et affichage du gestionnaire de réponse.
// //////////////////////////////////////////////////////////////////////////////

// Met la liste HTML dans le DOM et associe les handlers aux événements
// eslint-disable-next-line no-unused-vars
function renderQuizzes() {
  console.debug(`@renderQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz
  const usersElt = document.getElementById("id-all-quizzes-list");

  // on appelle la fonction de généraion et on met le HTML produit dans le DOM
  usersElt.innerHTML = htmlQuizzesList(
    state.quizzes.results,
    state.quizzes.currentPage,
    state.quizzes.nbPages
  );

  // /!\ il faut que l'affectation usersElt.innerHTML = ... ait eu lieu pour
  // /!\ que prevBtn, nextBtn et quizzes en soient pas null
  // les éléments à mettre à jour : les boutons
  const prevBtn = document.getElementById("id-prev-quizzes");
  const nextBtn = document.getElementById("id-next-quizzes");
  // la liste de tous les quizzes individuels
  const quizzes = document.querySelectorAll("#id-all-quizzes-list li");

  // les handlers quand on clique sur "<" ou ">"
  function clickBtnPager() {
    // remet à jour les données de state en demandant la page
    // identifiée dans l'attribut data-page
    // noter ici le 'this' QUI FAIT AUTOMATIQUEMENT REFERENCE
    // A L'ELEMENT AUQUEL ON ATTACHE CE HANDLER
    getQuizzes(this.dataset.page);
  }
  if (prevBtn) prevBtn.onclick = clickBtnPager;
  if (nextBtn) nextBtn.onclick = clickBtnPager;

  // qd on clique sur un quizz, on change sont contenu avant affichage
  // l'affichage sera automatiquement déclenché par materializecss car on
  // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
  function clickQuiz() {
    const quizzId = this.dataset.quizzid;
    console.debug(`@clickQuiz(${quizzId})`);
    state.currentQuizz = quizzId;

    return getQuizzData(quizzId).then((data) => {
      const Info = state.quizzes.results.find(
        (e) => e.quiz_id === Number(quizzId)
      );
      return renderCurrentQuizz({ info: Info, questions: data }, quizzId);
    });
  }

  // pour chaque quizz, on lui associe son handler
  quizzes.forEach((q) => {
    q.onclick = clickQuiz;
  });
}

// Pour un quizz selectionné, on affiche les données du quizz en question
// C'est à dire que l'on affiche le formulaire pour séléctionner les réponses des questions
// ainsi que leurs questions
//data: les informations et les questions d'un quiz dans un object.
//quiz_id: l'id du quiz que l'on a sélectionné.
function renderCurrentQuizz(data, quiz_id) {
  console.debug(`@renderCurrentQuizz(${data}, ${quiz_id})`);
  const main = document.getElementById("id-all-quizzes-main");
  // On gère si il y a bien des données à afficher
  if (data === undefined) {
    main.innerHTML = "Pas de data";
  }
  // On les affiche si elles existent
  else {
    retrieveAnswer(quiz_id).then((quiz_answ) => {
      // Récupère les réponses.
      if (quiz_answ === undefined) {
        // Si on a pas soumis de réponse.
        main.innerHTML = htmlQuizzesListContent(data); // On affiche le quizz normalement.
        if (state.user !== undefined) {
          // Si l'utilisateur est connecté il peut répondre aux quizz.
          let submit_quiz = document.getElementsByClassName("submit_quiz");
          Array.from(submit_quiz).map(
            (el) =>
              (el.onchange = (ev) => {
                ev.preventDefault();
                sendQuizz(ev, quiz_id);
              })
          );
        }
      } else {
        main.innerHTML = htmlQuizzesListContent(data, false, quiz_answ); // On affiche le quiz avec les réponses remplit.
        if (state.user !== undefined) {
          // Si user connecté il peut répondre ou changer ces réponses au quizz.
          let submit_quiz = document.getElementsByClassName("submit_quiz");
          Array.from(submit_quiz).map(
            (el) =>
              (el.onchange = (ev) => {
                ev.preventDefault();
                sendQuizz(ev, quiz_id);
              })
          );
        }
      }
    });
  }
}
