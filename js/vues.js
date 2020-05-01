/* document.addEventListener("DOMContentLoaded", function() {
  const modal_class = document.getElementById('modal1');

  var header = '<header class="head"><blockquote> <h4>Bienvenue</h4> </blockquote></header>';
  var content = '<div class="modal-content"> <label for="key"><strong>Entrer votre clé</strong></label><input type="text" id="api" name="name" class="key-input" placeholder="7038e76c-7fc3-423f-bfaa-97a0872bdb68"></div>';
  var footer = '<div class="modal-footer"><button class="btn waves-effect waves-light" type="submit" name="action" id="id-login">Login<i class="material-icons right">send</i></button></div>';
  modal_class.appendChild(header);
  modal_class.appendChild(content);
  modal_class.appendChild(footer);
  modal_class.modal();
}); */


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
  const quizzesLIst = quizzes.map(
    (q) =>
      `<li class="collection-item cyan lighten-5" data-quizzid="${q.quiz_id}">
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

// //////////////////////////////////////////////////////////////////////////////
// RENDUS : mise en place du HTML dans le DOM et association des événemets
// //////////////////////////////////////////////////////////////////////////////

// met la liste HTML dans le DOM et associe les handlers aux événements
// eslint-disable-next-line no-unused-vars
function renderQuizzes() {
  console.debug(`@renderQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz
  const usersElt = document.getElementById('id-all-quizzes-list');
  // une fenêtre modale définie dans le HTML
  const modal = document.getElementById('id-modal-quizz-menu');

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
    const addr = `${state.serverUrl}/quizzes/${quizzId}`;
    const quest = `${state.serverUrl}/quizzes/${quizzId}/questions`;
    return fetch(addr, { method: 'GET', headers: state.headers() })
      .then(filterHttpResponse)
      .then((data) => {
        state.currentQuizz = data;
        console.log(state.currentQuizz);
        return fetch(quest, { method: 'GET', headers: state.headers() })
          .then(filterHttpResponse)
          .then((data) => {
            state.quizzes = data;
            renderCurrentQuizz();
          });
        // eslint-disable-next-line no-use-before-define
        return renderCurrentQuizz();
      });
  };

  // pour chaque quizz, on lui associe son handler
  quizzes.forEach((q) => {
    q.onclick = clickQuiz;
  });
}


function renderCurrentQuizz() {
  var quest = '';
  const propo = document.getElementById('content-propo');
  const main = document.getElementById('id-all-quizzes-main');

  main.innerHTML += `<div class="card indigo lighten-5">
        <div class="card-content black-text">
          <span class="card-title">${state.currentQuizz.title}</span>
            <p>Créer le ${state.currentQuizz.created_at} par <a class="chip"> ${state.currentQuizz.owner_id} <i class="Small material-icons">account_circle</i> </a></p>    
            <p>description: ${state.currentQuizz.description}</p> <br>
            <form action="#">
              <p id="content-propo">
              </p>
            </form>
        </div>
      </div>`;


  for (var i = 0; i < state.quizzes.length; i++) {
    quest += state.quizzes[i].sentence;
    quest += '<br/>';
    for (var j = 0; j < state.quizzes[i].propositions_number; j++) {
      quest += state.quizzes[i].propositions[j].content;
      propo.innerHTML = `
      <label>
        <input type="checkbox" />
        <span>${quest}</span>
    </label>`;
    }
    quest += '<br/>';
  }
  console.log(quest);

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
      document.getElementById('content-logout').innerHTML +=
        `<h5> ${state.user.lastname.toUpperCase()} ${state.user.firstname} (${state.user.user_id}) <br />
        Vous êtes l'auteur de </h5>`;
      document.getElementById('id-logout').onclick = function () {
        state.xApiKey = '';
        getUser();
        document.location.reload(true);
      }

    } else {
      const saisie = document.getElementById('api').value;
      state.xApiKey = saisie;
      getUser();
      if (state.xApiKey != "") {
        document.getElementById('confirm-message').innerHTML += '<h5 style="color:green;">Connecté !</h5>';
        document.getElementById('login').remove();
        document.getElementById('log').innerHTML += '<a class="waves-effect waves-light btn modal-trigger" id="id-login" href="#modal2"><i class="Large material-icons">keyboard_backspace</i></a>';
      }
      else {
        document.getElementById('confirm-message').innerHTML += '<h5 style="color:crimson;">Veuillez vérifier votre saisie !</h5>';
      }

    }
  };
};
