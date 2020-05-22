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

// /!\ Affiche le contenu d'un quiz sélectionné /!\
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
      return `</br>
    <input value="${idBtn}" class="waves-effect waves-light btn orange" ${
        noDisab ? "" : "disabled"
      }>`;
    }
  }

  // On récupère la date du quiz que l'on a sélectionné et on la formate.
  let date = new Date(quiz.info.created_at).toLocaleString();

  // /!\ L'html qui sera affiché lorsque l'on cliquera sur un quiz /!\
  const Quizhtml = `
  <div class="card indigo lighten-5">
    <div class="card-content black-text">
      <div id="quizz_head">
        <span id="titleUserQuiz" class="card-title">
          ${quiz.info.title}
        </span>
        <p>Créer le ${date} par <a class="chip"> ${quiz.info.owner_id}
        <i class="Small material-icons">account_circle</i> </a></p>    
        <p>${quiz.info.description}</p>
       </div>
       <form id="quizz_content" data-id="${quiz.info.quiz_id}">
          ${Question(quiz.questions, answers, !noDisabled || noSubmit).join(
            "<br>"
          )}
          ${checkValidate(quiz)} 
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

// pour un quizz selectionné, on affiche les données du quizz en question
// C'est à dire que l'on affiche le formulaire pour séléctionner les réponses des questions
// ainsi que leurs questions
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
      if (quiz_answ === undefined) {
        main.innerHTML = htmlQuizzesListContent(data);
        if (state.user !== undefined) {
          // Pour la fonctionnalité optio changer le querySelector sur les boutons et remplacer
          // onsubmit par onchange.
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
        main.innerHTML = htmlQuizzesListContent(data, false, quiz_answ);
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

    /* document.querySelector( 
      "#id-all-quizzes-main #quizz_content"
    ).onsubmit = (ev) => { // Si on met onclick on va déclencher le form pour chaque clique de bouton
      console.debug(`${ev}`);
      ev.preventDefault();
      const form = document.getElementById("quizz_content");
      sendQuizz(form);
    }; */
  }
}

//Il faudrait attribuer à chaque question un id, puis demander le nombre de réponses par id de question, et ensuite attribuer un id
//pour chaque réponses également

// On affiche la liste des quizzes disponibles de l'utilisateur actuellement connecté
const QuizzUtilisateur = (quizzes) => {
  console.debug("@htmlUserQuizzes()");

  const quizzesList = htmlQuizzesList(quizzes);

  return quizzesList;
};

// On gère l'affichage des quizzes sélectionnés mais ainsi que
// l'affichage de la liste des quizzes de l'utilisateur connecté
function renderUserQuizzes(quizz) {
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
      //On récupère les infos du quizz
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

// Créer des floating action button
// color: la couleur de l'icone
// nameOfIcon: le nom de l'icone pour l'affichage par rapport à material icon
// className: pour la génération d'eventlistener
// divToAppend: si on veut le mettre à un endroit précis.
function renderSmallFloatingObject(color, nameOfIcon, className, divToAppend) {
  let a = document.createElement("a");
  a.className = `btn-floating ${color} ${className}`;
  a.innerHTML = `<i class="material-icons">${nameOfIcon}</i>`;
}

// Pour un quizz selectionné, on affiche les données du quizz en question
// C'est à dire que l'on affiche le formulaire pour séléctionner les réponses des questions
// ainsi que leurs questions. Mais cette fois pour les quizzes de l'utilisateur
function renderCurrentUserQuizz(quizz, quiz_id) {
  console.debug(`@renderCurrentUserQuizz(${quizz}, ${quiz_id})`);
  const main = document.getElementById("id-my-quizzes-main");
  // On gère si il y a bien des données à afficher
  if (quizz === undefined) {
    main.innerHTML = "Pas de data";
  } else {
    main.innerHTML = htmlQuizzesListContent(quizz, true);

    let title = document.getElementById("titleUserQuiz");
    title.innerHTML += `
    <a class="btn-floating grey changeTD"> 
      <i class="material-icons">create</i>
    </a>
    `;

    let quiz_head = document.getElementById("quizz_head");
    quiz_head.innerHTML += `
    <div class="modifier" style="padding: 0.2rem 0rem;">
      <a class="btn-floating green create"> 
        <i class="material-icons">add</i>
      </a>
    </div>
    `;

    const changeTD = document.querySelector(".changeTD"); // Affichera changeTitleDesc
    const createProp = document.querySelector(".create"); // Affichera addNewProp
    let deleteForEVER = document.getElementsByClassName("delete_forever");
    let edit_prop = document.getElementsByClassName("edit_prop");

    createProp.addEventListener("click", function () {
      // On appuie sur le bouton PLUS
      var sentence = () => {
        // Retourne le nombre de Question dans le quiz sélectionné.
        let idQ = 0;
        while (document.querySelector(`#sentence_${idQ}`) !== null) {
          idQ++;
        }
        return idQ;
      };
      return addNewProp(quiz_id, sentence());
    });

    changeTD.addEventListener("click", function () {
      return changeTitleDesc(quizz, quiz_id);
    });

    Array.from(deleteForEVER).map(
      (el) =>
        (el.onclick = () => {
          let idQ = el.id;
          return deleteQuestionUser(quiz_id, idQ);
        })
    );

    Array.from(edit_prop).map(
      (el) =>
        (el.onclick = () => {
          let idQ = el.id;
          getQuestionData(quiz_id, idQ); // récupère les infos du quiz que l'on a sélectionné.
          return editUserQuizz(quiz_id, idQ);
        })
    );
  }
}

// Fonction qui ajoute une nouvelle proposition à un quiz
function addNewProp(quizz_id, nbQ) {
  console.debug(`addNewProp(${quizz_id})`);
  const modify = document.getElementById("id-modify-quizzes-main");
  var idQ = nbQ;
  var idP = 0;
  const code = `
    <h4>Ajouter une proposition<h4>
    <label>Nouvelle question :
      <input placeholder='Votre question' id='question' type='text' class='validate'>
    </label>
    <label>
      <input type='radio' name='newQ' checked='true'><span>Proposition ${idP} :</span>
      <input placeholder='Votre proposition' id='new_proposition${idP}' type='text' class='validate modified_proposition'>
    </label>
      <button class='waves-effect waves-light btn' id='create_answer'>Nouvelle proposition</button><br><br>
      <button class='waves-effect waves-light btn' id='create_question'>Ajouter la question</button>
        `;

  modify.innerHTML = code;
  document.getElementById("create_answer").onclick = () => {
    idP++;
    let html = `
    <label>
      <span>Proposition ${idP} :</span>
      <input placeholder='Votre proposition' id='new_proposition${idP}' type='text' class="validate modified_proposition">
    </label>`;
    document
      .getElementById(`new_proposition${idP - 1}`)
      .insertAdjacentHTML("afterend", html);
  };
  document.getElementById("create_question").onclick = () => {
    const sentence = document.getElementById("question").value;
    sendUserProp(quizz_id, idQ, idP, sentence, "POST");
  };
}

function createquizz() {
  if (state.user) {
    console.debug(`@createquizz()`);
    let main = document.getElementById("id-my-quizzes-main");
    let code = `
      <h4>Nouveau Quizz<h4>
      <label>Titre :
        <input placeholder='Titre de votre quiz' id='titre' type='text' class='validate'>
      </label>
      <label>Description :
        <input placeholder='Description de votre quiz' id='description' type='text' class='validate'>
      </label>
      <button class='waves-effect waves-light btn' id='create_quiz'>Créer le quiz</button>
    `;
    main.innerHTML = code;

    document.getElementById("create_quiz").onclick = () => {
      let title = document.getElementById("titre").value;
      let description = document.getElementById("description").value;
      sendNewQuizz(title, description, "POST");
    };
  }
}

// Fonction qui change le titre et la description d'un quiz
function changeTitleDesc(quizz, quizz_id) {
  console.debug("changeTitleDesc()");
  const modify = document.getElementById("id-modify-quizzes-main");
  const code = `
  <h4>Modifier le Titre et la Description<h4>
  <label>Titre :
      <input placeholder='Le Nouveau titre' id='new_title' type='text' class='validate' value='${quizz.info.title}'>
    </label>
    <label>Description :
      <input placeholder='La nouvelle description' id='new_desc' type='text' class='validate' value='${quizz.info.description}'>
    </label>
    <button class='waves-effect waves-light btn' id='update_quiz'>Modifier le Quiz</button>
    `;

  modify.innerHTML = code;

  document.getElementById("update_quiz").onclick = () => {
    let title = document.getElementById("new_title").value;
    let description = document.getElementById("new_desc").value;
    sendNewQuizz(title, description, "PUT", quizz_id);
  };
}

// Fonction qui supprime la question d'un quiz
function deleteQuestionUser(quiz_id, question_id) {
  console.debug(`deleteQuestionUser(${quiz_id},${question_id})`);
  const modify = document.getElementById("id-modify-quizzes-main");
  const code = `
  <div id="deleteQuest">
    <h4>Êtes-vous sur de vouloir surppimer cette question ?<h4>
    <button class='waves-effect waves-light btn grey' id='no_delete'>Non</button>
    <button class='waves-effect waves-light btn red' id='delete'>Oui</button>
   </div> 
   `;

  modify.innerHTML = code;

  document.getElementById("delete").onclick = () => {
    sendDeleteQuestion(quiz_id, question_id);
    document.getElementById("deleteQuest").remove();
  };
  document.getElementById("no_delete").onclick = () => {
    document.getElementById("deleteQuest").remove();
  };
}

// Fonction qui Modifi la question et les propositions d'un quiz
function editUserQuizz(quiz_id, question_id) {
  console.debug(`editUserQuizz(${quiz_id},${question_id})`);
  const modify = document.getElementById("id-modify-quizzes-main");
  getQuestionData(quiz_id, question_id); // récupère les infos du quiz que l'on a sélectionné.
  let question_info = state.currentQuizz;

  let idP = 0;
  let lenghtQuestion = question_info.propositions_number; // Nombre de propostion
  console.log(lenghtQuestion);
  const code = `
    <h4>Modification de la Question<h4>
    <label>Question :
      <input placeholder='La nouvelle question' id='question' type='text' class='validate' value="${question_info.sentence}" required>
    </label>
    <div id='propostionList'></div>
    <button class='waves-effect waves-light btn green' id='modify_question'>
      Modifier la question
    </button>
    `;

  modify.innerHTML = code;

  let propositionList = document.getElementById("propostionList");
  while (idP < lenghtQuestion) {
    console.log(idP);
    let propositionHtml = `
    <label>
      <input type='radio' name='newQ' checked='true'>
      <span> Proposition ${idP} :</span>
      <input id= "proposition${idP}" type='text' class="validate modified_proposition" value="${question_info.propositions[
      idP
    ].content.toString()}" required>
    </label>
    `;
    propositionList.innerHTML += propositionHtml;
    idP++;
  }

  document.getElementById("modify_question").onclick = () => {
    const sentence = document.getElementById("question").value;
    sendUserProp(quiz_id, question_id, idP, sentence, "PUT", "update");
  };
}

// quand on clique sur le bouton de login, il nous dit qui on est
// eslint-disable-next-line no-unused-vars
const renderUserBtn = () => {
  const btn = document.getElementById("id-login");
  btn.onclick = () => {
    if (state.user) {
      // eslint-disable-next-line no-alert
      /* alert(
        `Bonjour ${state.user.firstname} ${state.user.lastname.toUpperCase()}` 
      ); */
      getUser();
      createquizz();
      document.getElementById(
        "content-logout"
      ).innerHTML = `<h5> ${state.user.lastname.toUpperCase()} ${
        state.user.firstname
      } (${state.user.user_id}) <br />
        Vous êtes l'auteur de </h5>`;
      document.getElementById("id-logout").onclick = function () {
        state.xApiKey = "";
        getUser();
        document.location.reload(true);
      };
    } else {
      const saisie = document.getElementById("api").value;
      state.xApiKey = saisie;
      getUser();
      if (state.xApiKey != "") {
        document.getElementById("confirm-message").innerHTML =
          '<h5 style="color:green;">Connecté !</h5>';
        document.getElementById("login").remove();
        document.getElementById("log").innerHTML =
          '<a class="waves-effect waves-light btn modal-trigger" id="id-login" href="#modal2"><i class="Large material-icons">keyboard_backspace</i></a>';
        getUserQuizzes(state.quizz);
      } else {
        document.getElementById("confirm-message").innerHTML +=
          '<h5 style="color:crimson;">Veuillez vérifier votre saisie !</h5>';
      }
    }
  };
};
