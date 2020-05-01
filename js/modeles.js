/* globals renderQuizzes renderUserBtn */

// //////////////////////////////////////////////////////////////////////////////
// LE MODELE, a.k.a, ETAT GLOBAL
// //////////////////////////////////////////////////////////////////////////////

// un objet global pour encapsuler l'état de l'application
// on pourrait le stocker dans le LocalStorage par exemple
const state = {
  // la clef de l'utilisateur
  xApiKey: '', //Ma clé : 7726bb9b-f8b3-4a58-95de-a2eeb9ad4d78

  // l'URL du serveur où accéder aux données
  serverUrl: 'https://lifap5.univ-lyon1.fr',

  // la liste des quizzes
  quizzes: [],

  // le quizz actuellement choisi
  currentQuizz: undefined,

  // une méthode pour l'objet 'state' qui va générer les headers pour les appel à fetch
  headers() {
    const headers = new Headers();
    headers.set('X-API-KEY', this.xApiKey);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
};

// //////////////////////////////////////////////////////////////////////////////
// OUTILS génériques
// //////////////////////////////////////////////////////////////////////////////

// un filtre simple pour récupérer les réponses HTTP qui correspondent à des
// erreurs client (4xx) ou serveur (5xx)
// eslint-disable-next-line no-unused-vars
function filterHttpResponse(response) {
  return response
    .json()
    .then((data) => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error(`${data.name}: ${data.message}`);
      }
      return data;
    })
    .catch((err) => console.error(`Error on json: ${err}`));
}

// //////////////////////////////////////////////////////////////////////////////
// DONNEES DES UTILISATEURS
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// l'utilisateur est identifié via sa clef X-API-KEY lue dans l'état
// eslint-disable-next-line no-unused-vars
const getUser = () => {
  console.debug(`@getUser()`);
  const url = `${state.serverUrl}/users/whoami`;
  return fetch(url, { method: 'GET', headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.user = data;
      // on lance le rendu du bouton de login
      return renderUserBtn();
    });
};

// //////////////////////////////////////////////////////////////////////////////
// DONNEES DES QUIZZES
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// getQuizzes télécharge la page 'p' des quizzes et la met dans l'état
// puis relance le rendu
// eslint-disable-next-line no-unused-vars
const getQuizzes = (p = 1) => {
  console.debug(`@getQuizzes(${p})`);
  const url = `${state.serverUrl}/quizzes/?page=${p}`;
  
  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: 'GET', headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.quizzes = data;

      // on a mis à jour les donnés, on peut relancer le rendu
      // eslint-disable-next-line no-use-before-define
      
      return renderQuizzes();
    });
};

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// getQuizzes télécharge la page 'p' des quizzes et la met dans l'état
// puis relance le rendu
// eslint-disable-next-line no-unused-vars
const getUserQuizzes = (p = 1) => {
  console.debug(`@getUserQuizzes`);
  const url = `${state.serverUrl}/users/quizzes`;
  
  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: 'GET', headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.quizzes = data;

      // on a mis à jour les donnés, on peut relancer le rendu
      // eslint-disable-next-line no-use-before-define
      
      return renderUserQuizzes();
    });
};

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// getQuizzes télécharge la page 'p' des quizzes et la met dans l'état
// puis relance le rendu
// eslint-disable-next-line no-unused-vars
const getAnswQuizzes = (p = 1) => {
  console.debug(`@getAnswQuizzes`);
  const url = `${state.serverUrl}/users/answers`;
  
  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: 'GET', headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.quizzes = data;

      // on a mis à jour les donnés, on peut relancer le rendu
      // eslint-disable-next-line no-use-before-define
      
      return renderAnswQuizzes();
    });
};

// /!\ Télécharge le quiz avec les infos général /!\
function getQuizzInfo(id) {
  console.debug(`@getQuizzInfo(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}`;

  return fetch(url, { method: "GET", headers: state.headers() }).then(
    filterHttpResponse
  );
}

// /!\ On récupère les données du quiz grâce à l'id (propositions, questions ...) /!\
// id: id qui est dans currentQuiz quand on sélectionnera le quiz
function getQuizzData(id) {
  console.debug(`@getQuizzData(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}/questions`;

  return fetch(url, { method: "GET", headers: state.headers() })
  .then(filterHttpResponse);
}

// /!\ Va chercher toutes les infos d'un quizz avec son id, on a ces réponses ect ... /!\
// id: est l'identifiant du quizz à télécharger
// info: infos sur le quizz
// data: questions du quizz
function getInfoData(id) {
  console.debug(`@getInfoData(${id})`);
  const Info = `${state.serverUrl}/quizzes/${id}`;
  const Data = `${urlInfo}/questions`;

  return fetch(Data, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) =>
      // eslint-disable-next-line promise/no-nesting
      fetch(Info, { method: "GET", headers: state.headers() })
        .then(filterHttpResponse)
        .then((res) => {
          state.currentQuizzData = { info: res, questions: data }; // Un objet avec toutes les infos
          return state.currentQuizzData;
        })
    )
    .catch((err) => console.error(`Erreur: ${err}`));
}
