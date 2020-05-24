// //////////////////////////////////////////////////////////////////////////////
// DONNEES DE TOUS LES QUIZZES
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// getQuizzes télécharge la page 'p' des quizzes et la met dans l'état
// puis relance le rendu
// eslint-disable-next-line no-unused-vars
const getQuizzes = (p = 1) => {
  console.debug(`@getQuizzes(${p})`);
  const url = `${state.serverUrl}/quizzes/?page=${p}`;

  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.quizzes = data;

      // on a mis à jour les donnés, on peut relancer le rendu
      // eslint-disable-next-line no-use-before-define

      return renderQuizzes();
    });
};

// //////////////////////////////////////////////////////////////////////////////
// DONNEES QUIZ UTILISATEUR
// //////////////////////////////////////////////////////////////////////////////

// Récupère les quizz de l'utilisateur lorsque l'on se connecte
const getUserQuizzes = () => {
  console.debug(`@getUserQuizzes`);
  const url = `${state.serverUrl}/users/quizzes`;

  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then(CreateQuizzButt); // On affiche le bouton pour ajouter un quizz.
};

// Récupère les réponses de l'uilisateur.
const getAnswQuizzes = () => {
  console.debug(`@getAnswQuizzes`);
  const url = `${state.serverUrl}/users/answers`;

  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then(renderAnswQuizzes()); // Affiche les réponses de l'utilisateur
};

// //////////////////////////////////////////////////////////////////////////////
// RECUPERATEUR DE QUIZ
// //////////////////////////////////////////////////////////////////////////////

// /!\ Télécharge le quiz avec les infos général /!\
//id: id du quizz où l'on veut récup les infos.
function getQuizzInfo(id) {
  console.debug(`@getQuizzInfo(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}`;

  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      state.currentQuizz = data;
      return data;
    });
}

// /!\ On récupère les données du quiz grâce à l'id (propositions, questions ...) /!\
// id: id qui est dans currentQuiz quand on sélectionnera le quiz.
function getQuizzData(id) {
  console.debug(`@getQuizzData(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}/questions`;

  return fetch(url, { method: "GET", headers: state.headers() }).then(
    filterHttpResponse
  );
}

// /!\ Va chercher toutes les infos d'un quizz avec son id, on a ces réponses ect ... /!\
// id: est l'identifiant du quizz à télécharger
// info: infos sur le quizz
function getInfoData(id) {
  console.debug(`@getInfoData(${id})`);
  const Info = `${state.serverUrl}/quizzes/${id}`;
  const Data = `${Info}/questions`;

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

// /!\ Récupère toute les infos liés à une question dans un quiz /!\
// id: l'id du quiz sélectionné.
// quest_id: l'id de la question dont on veut les infos.
const getQuestionData = (id, quest_id) => {
  console.debug(`getQuestionData(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}/questions/${quest_id}`;

  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      state.currentQuizz = data;
    });
};

// /!\ Fonction qui a pour intérret de récupérer les réponses de l'utilisateur. /!\
// quiz_id: l'id du quiz que l'on a sélectionné et où l'on veut récupérer les réponses.
const retrieveAnswer = (quiz_id) => {
  console.debug(`retrieveAnwswer(${quiz_id})`);
  const url = `${state.serverUrl}/users/answers`;

  return fetch(url, {
    method: "GET",
    headers: state.headers(),
  })
    .then(filterHttpResponse)
    .then((data) => {
      if (Array.isArray(data) && data.length) {
        // On check une première fois si le tableau est vide (pas de réponse)
        let quiz_data = data.find((el) => el.quiz_id === parseInt(quiz_id, 10));
        if (quiz_data !== undefined) {
          // On check si on a répondu au quiz.
          let quiz_answ = quiz_data.answers.map((n) => {
            delete n.answered_at;
            return n;
          });
          return quiz_answ; // renvoie l'object avec proposition_id et question_id.
        }
      } else {
        return undefined;
      }
    });
};
