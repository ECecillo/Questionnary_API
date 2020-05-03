/* global state getQuizzes */

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
      ? `<button id="id-prev-quizzes" data-page="${curr -
      1}" class="btn"><i class="material-icons">navigate_before</i></button>`
      : '';

  // le bouton ">" pour aller à la page suivante, ou rien si c'est la première page
  const nextBtn =
    curr !== total
      ? `<button id="id-next-quizzes" data-page="${curr +
      1}" class="btn"><i class="material-icons">navigate_next</i></button>`
      : '';

  // La liste complète et les deux boutons en bas
  const html = `
  <ul class="collection">
    ${quizzesLIst.join('')}
  </ul>
  <div class="row">      
    <div class="col s6 left-align">${prevBtn}</div>
    <div class="col s6 right-align">${nextBtn}</div>
  </div>
  `;
  return html;
};

const htmlQuizzesListContent = (quiz, answers) => {
  console.debug(`@htmlQuizzesListContent(${quiz})`);

  //Fonction qui va s'occuper de cocher les bonnes réponses pour l'affichage des réponses
 function checkAnsw (answer, proposition) {
    if(answer !== undefined && answer.p === proposition.proposition_id) {
      return "checked";
    }
    else {
      return "";
    }
  }


  // /!\ Génère les radios pour les réponses /!\
  //prop : quizzes.proposition
  //id: quizzes.quiz_id pour récup l'id du quiz
  //answer: les réponses qui sont dans la requpête
  const Propositions = (prop, id, answer, disabled) =>
    prop.map((p) => {
      return `<label>
              <input type="radio" name="${id}" value="${p.proposition_id}" ${
        disabled ? "disabled" : ""} ${checkAnsw(answer,prop)}>
              <span>${p.content}</span>
           </label>`;
    });

  // /!\ Pour chaque question on parcours les propositions /!\
  // question: state.currentQuizzes
  // answers: 
  const Question = (questions, answers, disabled) =>
    questions.map(
      (q) =>
        `<h6>${q.sentence}</h6>
        ${Propositions(
          q.propositions,
          q.question_id,
          answers !== undefined
            ? answers.find((elt) => elt.q === q.question_id)
            : undefined,
          disabled
        ).join("")}`
    );
  //On déclare ces deux consantes qui serviront pour l'évalution du submit
  const noDisabled = quiz.info.open && state.user !== undefined;
  const noSubmit = state.user !== undefined && quiz.info.owner_id === state.user.user_id;
  // /!\ Fonction qui contient toute les conditions qui doivennt être remplis pour le submit /!\
  // quiz: le tableau du quiz que l'utilisateur à choisi
  function checkValidate(quiz) {
    const btnDisplay = !quiz.info.open
      ? "Quiz fermé"
      : state.user === undefined
        ? "Utilisateur non connecté"
        : "Répondre";

    return RenderSubButt(noSubmit, noDisabled, btnDisplay);
  }

  //Créer un toast quand on cliquera sur le bouton submit.
  /* const date_sub = parseDate(new Date(quiz.answered_at));
  const toast = M.toast({
    html: `La question ${quiz.question_id} du quiz d'identifiant ${quiz.quiz_id} à été validé à ${date_sub}`,
    classes: "toast-update",
    displayLength: 5000,
  }).el;
  toast.onclick = function dismiss() {
    toast.timeRemaining = 0;
  }; */
  // /!\ Vérifie si le bouton valider a été soumis par l'user /!\
  function RenderSubButt(noSub, noDisab, idBtn) {
    if (noSub) {
      return "";
    }
    else {
      return `</br>
    <input type="submit" value="${idBtn}" class="btn" id="btn-submit"
    ${ noDisab ? "" : "disabled"} onclick="">`;
    }
  }
  var date = quiz.info.created_at;
  date = new Date(date).toLocaleString();
  // /!\ L'html qui sera mis dans RenderCurrentQuiz pour afficher le titre, desc ... /!\
  const Quizhtml = `
  <div class="card indigo lighten-5">
    <div class="card-content black-text">
      <span class="card-title">${quiz.info.title}</span>
        <p>Créer le ${date} par <a class="chip"> ${quiz.info.owner_id} <i class="Small material-icons">account_circle</i> </a></p>    
        <p>${quiz.info.description}</p> <br>
          <form id="quizz_content" data-id="${quiz.info.quiz_id}">
            ${Question(quiz.questions, answers, !noDisabled || noSubmit).join("<br>")}
            ${checkValidate(quiz, answers)} 
          </form>
    </div>
  </div>`;
  return Quizhtml;
};

// //////////////////////////////////////////////////////////////////////////////
// RENDUS : mise en place du HTML dans le DOM et association des événemets
// //////////////////////////////////////////////////////////////////////////////

// met la liste HTML dans le DOM et associe les handlers aux événements
// eslint-disable-next-line no-unused-vars
function renderQuizzes() {
  console.debug(`@renderQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz
  const usersElt = document.getElementById('id-all-quizzes-list');


  // on appelle la fonction de généraion et on met le HTML produit dans le DOM
  usersElt.innerHTML = htmlQuizzesList(
    state.quizzes.results,
    state.quizzes.currentPage,
    state.quizzes.nbPages
  );

  // /!\ il faut que l'affectation usersElt.innerHTML = ... ait eu lieu pour
  // /!\ que prevBtn, nextBtn et quizzes en soient pas null
  // les éléments à mettre à jour : les boutons
  const prevBtn = document.getElementById('id-prev-quizzes');
  const nextBtn = document.getElementById('id-next-quizzes');
  // la liste de tous les quizzes individuels
  const quizzes = document.querySelectorAll('#id-all-quizzes-list li');

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


  //Parcours json response
  function maj_url(url_data) {
    const title = url_data.map((contenu, indx) => ({
      titre: desc.title,
      descript: desc.description,
    }));

  }


  // qd on clique sur un quizz, on change sont contenu avant affichage
  // l'affichage sera automatiquement déclenché par materializecss car on
  // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
  function clickQuiz() {
    const quizzId = this.dataset.quizzid;
    console.debug(`@clickQuiz(${quizzId})`);
    state.currentQuizz = quizzId;

    return getQuizzData(quizzId).then((data) => {
      const Info = state.quizzes.results.find((e) => e.quiz_id === Number(quizzId));
      return renderCurrentQuizz({ info: Info, questions: data });
    });
  };

  // pour chaque quizz, on lui associe son handler
  quizzes.forEach((q) => {
    q.onclick = clickQuiz;
  });
}

function renderCurrentQuizz(data) {
  console.debug(`@renderCurrentQuizz()`);
  const main = document.getElementById('id-all-quizzes-main');
  console.debug(`@(${data.created_at})`);
  if (data === undefined) {
    main.innerHTML = "Pas de data";
  }
  else {
    main.innerHTML = htmlQuizzesListContent(data);
    document.querySelector(
      "#id-all-quizzes-main #quizz_content"
    ).onsubmit = function submitForm(ev) {
      ev.preventDefault();
      const form = document.getElementById("quizz_content");
      sendQuizz(form);
    };
  }
}

const QuizzUtilisateur = (quizzes) => {
  console.debug("@htmlUserQuizzes()");

  const quizzesList = htmlQuizzesList(quizzes);

  return quizzesList;
};


function renderUserQuizzes(quizz) {
  console.debug(`@renderUserQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz de l'user
  const usersElt = document.getElementById("id-my-quizzes-list");
  const main = document.getElementById("id-my-quizzes-main");

  if (quizz === undefined) {
    usersElt.innerHTML = "Vous n'avez pas de quiz, veuillez vérifier votre connexion";
  } else {
    usersElt.innerHTML = QuizzUtilisateur(quizz);
  }

  main.innerHTML = "Pas de quiz séléctioné";

  const quizzElt = document.querySelectorAll("#id-my-quizzes-list li");

  function clickQuizz() {
    const quizzId = this.dataset.quizzid;
    return getQuizzData(quizzId).then((quizzData) => { //On récupère les infos du quizz
      const quizzInfo = quizz.find(e => e.quiz_id === Number(quizzId));
      return renderCurrentUserQuizz({ info: quizzInfo, questions: quizzData })
    });
  }

  quizzElt.forEach((q) => {
    q.onclick = clickQuizz;
  });
}

function renderCurrentUserQuizz(quizz) {
  console.debug(`@renderCurrentQuizz()`);
  const main = document.getElementById('id-my-quizzes-main');
  console.debug(`@(${quizz.created_at})`);
  if (quizz === undefined) {
    main.innerHTML = "Pas de data";
  }
  else {
    main.innerHTML = htmlQuizzesListContent(quizz);
  }
}


function renderAnswQuizzes () {
  console.debug(`@renderAnswQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz de l'user
  const usersElt = document.getElementById("id-my-answers-list");
  const main = document.getElementById("id-my-answers-main");

  if (quizz === undefined) {
    usersElt.innerHTML = "<p style='color: crimson;'>Vous n'avez pas de quiz, veuillez vérifier votre connexion</p>";
  } else {
    usersElt.innerHTML = QuizzUtilisateur(quizz);
  }

  main.innerHTML = "Pas de quiz séléctioné";

  const quizzElt = document.querySelectorAll("#id-my-quizzes-list li");

  function clickQuizz() {
    const quizzId = this.dataset.quizzid;
    return getQuizzData(quizzId).then((quizzData) => { //On récupère les infos du quizz
      const quizzInfo = quizz.find(e => e.quiz_id === Number(quizzId));
      return AnswQuizz(quizzData, quizzAnsw)
    });
  }

  quizzElt.forEach((q) => {
    q.onclick = clickQuizz;
  });
}

// quand on clique sur le bouton de login, il nous dit qui on est
// eslint-disable-next-line no-unused-vars
const renderUserBtn = () => {
  const btn = document.getElementById('id-login');
  btn.onclick = () => {
    if (state.user) {
      // eslint-disable-next-line no-alert
      /* alert(
        `Bonjour ${state.user.firstname} ${state.user.lastname.toUpperCase()}` 
      ); */
      getUser();
      document.getElementById('content-logout').innerHTML =
        `<h5> ${state.user.lastname.toUpperCase()} ${state.user.firstname} (${state.user.user_id}) <br />
        Vous êtes l'auteur de </h5>`;
      document.getElementById('id-logout').onclick = function() {
        state.xApiKey = '';
        getUser();
        document.location.reload(true);
      }

    } else {
      const saisie = document.getElementById('api').value;
      state.xApiKey = saisie;
      getUser();
      if (state.xApiKey != "") {
        document.getElementById('confirm-message').innerHTML = '<h5 style="color:green;">Connecté !</h5>';
        document.getElementById('login').remove();
        document.getElementById('log').innerHTML = '<a class="waves-effect waves-light btn modal-trigger" id="id-login" href="#modal2"><i class="Large material-icons">keyboard_backspace</i></a>';
        getUserQuizzes(state.quizz);
      }
      else {
        document.getElementById('confirm-message').innerHTML += '<h5 style="color:crimson;">Veuillez vérifier votre saisie !</h5>';
      }

    }
  };
};
