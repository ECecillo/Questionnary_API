// //////////////////////////////////////////////////////////////////////////////
// Mise en place de l'affichage des quiz lorsque l'on clique sur un des quiz dans la liste.
// //////////////////////////////////////////////////////////////////////////////

function renderQuizzesSearch() {
  console.debug(`@renderQuizzesSearch()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz
  //const usersElt = document.getElementById('id-all-quizzes-list');

  // on appelle la fonction de généraion et on met le HTML produit dans le DOM
  /*usersElt.innerHTML = htmlQuizzesList(
        quiz
      );*/

  // la liste de tous les quizzes individuels
  const quizes = document.querySelectorAll("#id-all-quizzes-list li");
  console.log(quizes);

  // qd on clique sur un quizz, on change sont contenu avant affichage
  // l'affichage sera automatiquement déclenché par materializecss car on
  // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
  function clickQuizz(ev) {
    //console.log(ev);
    const element = ev.target;
    const quizzId = element.dataset.quizzid;
    console.debug(`@clickQuiz(${quizzId})`);
    state.currentQuizz = quizzId;

    return getQuizzData(quizzId).then((data) => {
      const Info = state.quizzes.results.find(
        (e) => e.quiz_id === Number(quizzId)
      );
      return renderCurrentQuizz({ info: Info, questions: data });
    });
  }

  quizes.forEach((q) => {
    console.log(q);
    q.onclick = (ev) => clickQuizz(ev);
  });
  // pour chaque quizz, on lui associe son handler
  /*quizes.onclick = function clickQuizz(ev) {
        const element = ev.target;
        console.log(element);
        const quizzId = element.dataset.quizzid;
        console.debug(`@clickQuiz(${quizzId})`);
        state.currentQuizz = quizzId;
    
        return getQuizzData(quizzId).then((data) => {
          const Info = state.quizzes.results.find((e) => e.quiz_id === Number(quizzId));
          return renderCurrentQuizz({ info: Info, questions: data });
        });
      };*/
}
