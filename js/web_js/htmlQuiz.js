// //////////////////////////////////////////////////////////////////////////////
// HTML : fonctions génération de HTML à partir des données passées en paramètre
// //////////////////////////////////////////////////////////////////////////////

// génération d'une liste de quizzes avec deux boutons en bas
const htmlQuizzesList = (quizzes, curr, total) => {
  console.debug(`@htmlQuizzesList(.., ${curr}, ${total})`);

  // un élement <li></li> pour chaque quizz. Noter qu'on fixe une donnée
  // data-quizzid qui sera accessible en JS via element.dataset.quizzid.
  // On définit aussi .modal-trigger et data-target="id-modal-quizz-menu"
  // pour qu'une fenêtre modale soit affichée quand on clique dessus
  // VOIR https://materializecss.com/modals.html
  // Dans le class on avait : modal-trigger
  // data-target="id-modal-quizz-menu"
  const quizzesLIst = quizzes.map(
    (q) =>
      `<li class="hoverable collection-item cyan lighten-5" data-quizzid="${q.quiz_id}">
          <h5>${q.title}</h5>
          ${q.description} <a class="chip">${q.owner_id}</a>
        </li>`
  ); /* modal-trigger data-target="id-modal-quizz-menu" */

  // le bouton "<" pour revenir à la page précédente, ou rien si c'est la première page
  // on fixe une donnée data-page pour savoir où aller via JS via element.dataset.page
  const prevBtn =
    curr !== 1
      ? `<button id="id-prev-quizzes" data-page="${
          curr - 1
        }" class="btn"><i class="material-icons">navigate_before</i></button>`
      : "";

  // le bouton ">" pour aller à la page suivante, ou rien si c'est la première page
  const nextBtn =
    curr !== total
      ? `<button id="id-next-quizzes" data-page="${
          curr + 1
        }" class="btn"><i class="material-icons">navigate_next</i></button>`
      : "";

  // La liste complète et les deux boutons en bas
  const html = `
    <ul class="collection" id="collection">
      ${quizzesLIst.join("")}
    </ul>
    <div class="row">      
      <div class="col s6 left-align">${prevBtn}</div>
      <div class="col s6 right-align">${nextBtn}</div>
    </div>
    `;
  return html;
};

// //////////////////////////////////////////////////////////////////////////////
//  AFFICHE LE CONTENUS D'UN QUIZ SELECTIONNE
// //////////////////////////////////////////////////////////////////////////////

// quiz: les informations du quiz sélectionné
// userQuiz: les informations du quiz d'un utilisateur
// answer: les informations du quiz sélectionné avec les réponses de l'utilisateur.
const htmlQuizzesListContent = (quiz, userQuiz, answers) => {
  console.debug(`@htmlQuizzesListContent(${quiz})`);

  //Fonction qui va s'occuper de cocher les bonnes réponses pour l'affichage des réponses
  function checkAnsw(answer, proposition) {
    if (
      answer !== undefined &&
      answer.proposition_id === proposition.proposition_id
    ) {
      return "checked";
    } else {
      return "";
    }
  }

  // /!\ On parcours le tableau de proposition et on affiche les valeurs avec l'html /!\
  //prop : quizzes.proposition.
  //id: id de la proposition pour la réponse.
  //answer: Pour remplir le bouton si l'id de la prop correspond à la réponse de l'user.
  //disabled: permet de rendre les boutons cliquable si l'utilisateur est connecté.
  const Propositions = (prop, id, answer, disabled) =>
    prop.map((p) => {
      return `
        <label>
          <input type="radio" name="${id}" class="submit_quiz" value="${
        p.proposition_id
      }" 
          ${disabled ? "disabled" : ""}
          ${checkAnsw(answer, p)}>
          <span>${p.content}</span>
        </label>`;
    });

  // /!\ Affiche les propositions en rapport avec l'id de la question /!\
  // question: le contenu d'une question que l'on récupère à partir du quiz.
  // answers: un tableau d'object dans lequelle on a pour chaque question_id l'id de la prop
  // disabled: permet de rendre les inputs cliquable ou non si user connecté.
  const Question = (questions, answers, disabled) =>
    questions.map(
      (q) =>
        `<h6 id="sentence_${q.question_id}">${q.sentence}
          ${
            userQuiz === true
              ? `
            <a id="${q.question_id}" class="btn-floating orange edit_prop"> 
              <i class="material-icons">create</i>
            </a>
            <a id="${q.question_id}" class="btn-floating red delete_forever"> 
              <i class="material-icons">delete_forever</i>
            </a>`
              : ""
          }
          </h6>
          ${Propositions(
            q.propositions,
            q.question_id,
            answers !== undefined
              ? answers.find((elt) => elt.question_id === q.question_id) // Pour check si c'est une réponse de l'utilisateur ou non.
              : undefined,
            disabled // Si c'est pas une réponse on ne remplit pas le bouton
          ).join("")}`
    );

  //On déclare ces deux consantes qui serviront pour l'évalution du submit
  const noDisabled = quiz.info.open && state.user !== undefined;
  const noSubmit =
    state.user !== undefined && quiz.info.owner_id === state.user.user_id;

  // /!\ Fonction qui selon l'état de l'user et du quiz va afficher un message dans le bouton situé à la fin du quiz /!\
  // quiz: le tableau du quiz que l'utilisateur à choisi
  function checkValidate(quiz) {
    const btnDisplay = !quiz.info.open
      ? "Quiz fermé"
      : state.user === undefined
      ? "Utilisateur non connecté"
      : "Sélectionnés les réponses";

    return RenderSubButt(noSubmit, noDisabled, btnDisplay);
  }

  // /!\ Vérifie si le bouton valider a été soumis par l'user /!\
  function RenderSubButt(noSub, noDisab, idBtn) {
    if (noSub) {
      return "";
    } else {
      return `<br>
      <input value="${idBtn}" class="waves-effect waves-light btn orange" ${
        noDisab ? "" : "disabled"
      } style="margin-top: 2rem;">`;
    }
  }

  // On récupère la date du quiz que l'on a sélectionné et on la formate.
  let date = new Date(quiz.info.created_at).toLocaleString();

  // /!\ L'html qui sera affiché lorsque l'on cliquera sur un quiz /!\
  const Quizhtml = `
    <div class="card indigo lighten-5">
      <div class="card-content black-text">
        <div ${userQuiz === true ? `id="quizz_head"` : ""}>
          <span ${
            userQuiz === true ? `id="titleUserQuiz"` : ""
          } class="card-title">
            ${quiz.info.title}
          </span>
          <p>Créer le ${date} par <a class="chip"> ${quiz.info.owner_id}
          <i class="Small material-icons">account_circle</i> </a></p>    
          <p>${quiz.info.description}</p>
         </div>
         <form id="quizz_content" data-id="${quiz.info.quiz_id}">
            ${Question(quiz.questions, answers, !noDisabled || noSubmit).join(
              ""
            )}
            ${checkValidate(quiz)}
          </form>
      </div>
    </div>`;
  return Quizhtml;
};
