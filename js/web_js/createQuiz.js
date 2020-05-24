// //////////////////////////////////////////////////////////////////////////////
// Affichage des quiz utilisateur et affichage du bouton de création de quiz avec sa fonction.
// //////////////////////////////////////////////////////////////////////////////

// On affiche la liste des quizzes disponibles de l'utilisateur.
//quizzes: les données d'un quiz qui appartient à un user.
const QuizzUtilisateur = (quizzes) => {
  console.debug(`@htmlUserQuizzes(${quizzes})`);

  const quizzesList = htmlQuizzesList(quizzes);

  return quizzesList;
};

// Affiche la liste des quizz et le bouton pour ajouter un nouveau quizz.
// quizz: la liste de quiz.
function CreateQuizzButt(quizz) {
  console.debug(`@renderUserQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz de l'user
  const usersElt = document.getElementById("id-my-quizzes-list");
  const main = document.getElementById("id-my-quizzes-main");

  //On gère si l'utilisateur possède un/des quizz/es
  if (quizz === undefined) {
    usersElt.innerHTML =
      "Vous n'avez pas de quiz, veuillez vérifier votre connexion";
  } else {
    usersElt.innerHTML = QuizzUtilisateur(quizz);

    // Bouton de création d'un quizz.
    let RenderAddButt = () => {
      let div = document.createElement("div");
      div.className = "fixed-action-btn";

      let a = document.createElement("a");
      a.className = "btn-floating btn-large red";
      a.innerHTML = `<i class="large material-icons">add</i>`;
      a.onclick = () => createquizz();

      div.appendChild(a);
      let div_UserQ = document.getElementById("id-my-quizzes");
      div_UserQ.firstElementChild.before(div);
    };

    RenderAddButt();
  }

  //Si aucun quizz n'est séléctionné
  main.innerHTML = "Pas de quiz séléctioné";

  const quizzElt = document.querySelectorAll("#id-my-quizzes-list li");

  //On gère l'événement lorsque l'utilisateur cliques sur l'un des quizzes disponibles
  function clickQuizz() {
    const quizzId = this.dataset.quizzid;
    return getQuizzData(quizzId).then((quizzData) => {
      // On affiche les infos du quiz sélectionné en fonction de son id.
      //On récupère les infos du quizz.
      const quizzInfo = quizz.find((e) => e.quiz_id === Number(quizzId));
      return renderCurrentUserQuizz(
        { info: quizzInfo, questions: quizzData },
        quizzId
      );
    });
  }

  quizzElt.forEach((q) => {
    q.onclick = clickQuizz;
  });
}

//Fonction qui permet de créer un nouveau quizz.
function createquizz() {
  if (state.user) {
    console.debug(`@createquizz()`);
    let main = document.getElementById("id-my-quizzes-main");
    let code = `
      <div id="Create_quiz">
        <h4>Nouveau Quizz<h4>
        <label>Titre :
          <input placeholder='Titre de votre quiz' id='titre' type='text' class='validate'>
        </label>
        <label>Description :
          <input placeholder='Description de votre quiz' id='description' type='text' class='validate'>
        </label>
        <button class='waves-effect waves-light btn' id='create_quiz'>Créer le quiz</button>
      </div>`;
    main.innerHTML = code;

    document.getElementById("create_quiz").onclick = () => {
      let title = document.getElementById("titre").value;
      let description = document.getElementById("description").value;
      sendNewQuizzTitleDesc(title, description, "POST");
      document.getElementById("Create_quiz").remove();
    };
  }
}
