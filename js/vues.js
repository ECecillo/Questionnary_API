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
      `<li class="collection-item cyan lighten-5" data-quizzid="${q.quiz_id}"> 
        <h5>${q.title}</h5>
        ${q.description} <a class="chip">${q.owner_id}</a>
      </li>`
  );

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

  // qd on clique sur un quizz, on change sont contenu avant affichage
  // l'affichage sera automatiquement déclenché par materializecss car on
  // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
  function clickQuiz() {
    const quizzId = this.dataset.quizzid;
    console.debug(`@clickQuiz(${quizzId})`);
    const addr = `${state.serverUrl}/quizzes/${quizzId}`;

    state.currentQuizz = quizzId;
    
    // télécharge le contenu du quiz aved l'id quizzId
    return fetch(addr, { method: 'GET', headers: state.headers() })
      .then(filterHttpResponse)
      .then((data) => {
        state.quizzes = data;

        return renderCurrentQuizz();
      });
  }

  // pour chaque quizz, on lui associe son handler
  quizzes.forEach((q) => {
    q.onclick = clickQuiz;
  });
}

function renderUserQuizzes() {
  console.debug(`@renderUsersQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz
  const usersQuiz = document.getElementById('id-my-quizzes-list');

  // on appelle la fonction de généraion et on met le HTML produit dans le DOM
  usersQuiz.innerHTML = htmlQuizzesList(
    state.quizzes,
    state.quizzes.currentPage,
    state.quizzes.nbPages
  );

  // /!\ il faut que l'affectation usersElt.innerHTML = ... ait eu lieu pour
  // /!\ que prevBtn, nextBtn et quizzes en soient pas null
  // les éléments à mettre à jour : les boutons
  const prevBtn = document.getElementById('id-prev-quizzes');
  const nextBtn = document.getElementById('id-next-quizzes');
  // la liste de tous les quizzes individuels
  const quizzes = document.querySelectorAll('#id-my-quizzes-list li');

  // les handlers quand on clique sur "<" ou ">"
  function clickBtnPager() {
    // remet à jour les données de state en demandant la page
    // identifiée dans l'attribut data-page
    // noter ici le 'this' QUI FAIT AUTOMATIQUEMENT REFERENCE
    // A L'ELEMENT AUQUEL ON ATTACHE CE HANDLER
    getUserQuizzes(this.dataset.page);
  }
  if (prevBtn) prevBtn.onclick = clickBtnPager;
  if (nextBtn) nextBtn.onclick = clickBtnPager;

  // qd on clique sur un quizz, on change sont contenu avant affichage
  // l'affichage sera automatiquement déclenché par materializecss car on
  // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
  function clickQuizUser() {
    const quizzId = this.dataset.quizzid;
    console.debug(`@clickUserQuiz(${quizzId})`);
    const addr = `${state.serverUrl}/quizzes/${quizzId}`;


    state.currentQuizz = quizzId;
    // télécharge le contenu du quiz aved l'id quizzId
    return fetch(addr, { method: 'GET', headers: state.headers() })
      .then(filterHttpResponse)
      .then((data) => {
        state.quizzes = data;

        return renderCurrentUserQuizz();
      });
  }

  // pour chaque quizz, on lui associe son handler
  quizzes.forEach((q) => {
    q.onclick = clickQuizUser;
  });
}

function renderCurrentQuizz() {
  const main = document.getElementById('id-all-quizzes-main');
  const mainUsers = document.getElementById('id-my-quizzes-main');

  main.innerHTML = `<div class="card indigo lighten-5">
        <div class="card-content black-text">
          <span class="card-title">${state.quizzes.title}</span>
            <p>Créer le ${state.quizzes.created_at} par <a class="chip"> ${state.quizzes.owner_id} <i class="Small material-icons">account_circle</i> </a></p>    
            <p>description: ${state.quizzes.description}</p>
        </div>
        <div class="card-action">
          <form>
            
          </form>
        </div>
      </div>`;

}

function renderCurrentUserQuizz() {
  const mainUsers = document.getElementById('id-my-quizzes-main');

  // Partie affichage des quiz de l'utilisateur

  mainUsers.innerHTML = `<div class="card indigo lighten-5">
        <div class="card-content black-text">
          <span class="card-title">${state.quizzes.title}</span>
            <p>Créer le ${state.quizzes.created_at} par <a class="chip"> VOUS <i class="Small material-icons">account_circle</i> </a></p>    
            <p>description: ${state.quizzes.description}</p>
        </div>
        <div class="card-action">
          <form>
            
          </form>
        </div>
      </div>`;
}



// quand on clique sur le bouton de login, il nous dit qui on est
// eslint-disable-next-line no-unused-vars
const renderUserBtn = () => {
  console.debug('@renderUserBtn()');
  const btn = document.getElementById('id-login');

  btn.onclick = () => {
    if (state.user) {
      document.getElementById('login').remove();
      document.getElementById('log').innerHTML += '<a class="waves-effect waves-light btn modal-trigger" id="id-login" href="#modal2"><i class="Large material-icons">keyboard_backspace</i></a>';
      document.getElementById('content-logout').innerHTML +=
        `<h5> ${state.user.lastname.toUpperCase()} ${state.user.firstname} (${state.user.user_id}) <br />
        Vous êtes l'auteur de </h5>`;
      document.getElementById('id-logout').onclick = function () {
        state.xApiKey = '';
        //getUser();
        document.location.reload(true);
      }

    } else {
      const saisie = document.getElementById('api').value;
      state.xApiKey = saisie;

      if (state.xApiKey !== "") {
        document.getElementById('confirm-message').innerHTML += '<h5 style="color:green;">Connecté !</h5>';
        document.getElementById('login').remove();
        document.getElementById('log').innerHTML += '<a class="waves-effect waves-light btn modal-trigger" id="id-login" href="#modal2"><i class="Large material-icons">keyboard_backspace</i></a>';
        getUser();
        getUserQuizzes();
      }
      else {
        document.getElementById('confirm-message').innerHTML += '<h5 style="color:crimson;">Veuillez vérifier votre saisie !</h5>';
      }

    }
  };
};

