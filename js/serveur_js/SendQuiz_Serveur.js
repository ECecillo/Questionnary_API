// //////////////////////////////////////////////////////////////////////////////
// ENVOIE DES QUIZ, PROPOSITIONS SERVEUR ...
// //////////////////////////////////////////////////////////////////////////////

// Envoie les réponses à un quizz au serveur
//Sform: l'élément où l'on a modifié / ajouter une réponse.
//quiz_id: l'id du quiz dans lequel on a répondu.
const sendQuizz = (Sform, quiz_id) => {
  console.debug(`@sendQuiz(${Sform}, ${quiz_id})`);
  let prop_content = Sform.target;
  const url = `${state.serverUrl}/quizzes/${quiz_id}/questions/${prop_content.name}/answers/${prop_content.value}`;

  return fetch(url, { method: "POST", headers: state.headers() })
    .then(filterHttpResponse)
    .then((res) => {
      const date = new Date(res.answered_at).toLocaleString();
      const toast = M.toast({
        html: `La question ${res.question_id} du quiz d'identifiant ${res.quiz_id} à été validé à ${date} 👊`,
        displayLength: 5000,
        classes: "green rounded",
      }).el;
      toast.el.onclick = function dismiss() {
        toast.timeRemaining = 0;
      };
      return res;
    })
    .catch((err) => `Erreur: ${err}`);
};

// On envoie le quiz créer par l'utilisateur.
//titre: variable qui contient le titre du quiz que l'on récup avec value.
//desc: variable qui contient la description du quiz  que l'on récup avec value.
//Method: selon le cas d'utilisation, soit on modifie le titre et la description du quiz, soit on en créer un nouveau.
//quiz_id: id du quiz que l'on veut modifier si on a mis PUT en methode.
const sendNewQuizzTitleDesc = (titre, desc, Method, quiz_id) => {
  if (Method === "POST") {
    var url = `${state.serverUrl}/quizzes`;
    var quiz = {
      title: titre,
      description: desc,
    };
  } else {
    var url = `${state.serverUrl}/quizzes/${quiz_id}/`;
    var quiz = {
      title: titre,
      description: desc,
      open: true,
    };
  }

  fetch(url, {
    method: `${Method}`,
    headers: state.headers(),
    body: JSON.stringify(quiz),
  })
    .then(filterHttpResponse)
    .then(() => {
      const toast = M.toast({
        html: `Quiz numéro ${quiz.quiz_id}. <br>
              Titre : ${quiz.title}.
              <br>Description : ${quiz.description}.`,
        displayLength: 5000,
        classes: "blue rounded",
      });
    })
    .catch(console.error);
};

// Créer/Modifie des questions et des propositions.
// id: id du quiz où l'on ajoutera les nouvelles prop.
// idQ: id de la nouvelle question.
// idP: le nombre de proposition.
// sentence: la question qui sera rattaché au proposition.
// methode: On peut choisir entre PUT et POST en fonction du cas de l'utilisation de la fonction.
const sendUserProp = (id, idQ, idP, sentence, methode) => {
  console.debug(`@SendUserProp(${id},${idQ},${idP},${sentence},${methode})`);
  let url = `${state.serverUrl}/quizzes/${id}/questions/`;

  methode === "PUT"
    ? (url = `${state.serverUrl}/quizzes/${id}/questions/${idQ}`)
    : "";

  const questionObj = {
    question_id: idQ,
    sentence: sentence,
    propositions: [],
  };

  let i = 0; // variable pour le numéro de la proposition.
  let class_prop = document.getElementsByClassName(`modified_proposition`);
  Array.from(class_prop).map((el) => {
    let prop = el; // Renvoie le première élément qui contient class_prop en class.
    if (prop.previousElementSibling.checked === true) {
      questionObj.propositions.push({
        content: prop.value,
        proposition_id: i,
        correct: "false",
      });
      i++;
    } else {
      questionObj.propositions.push({
        content: prop.value,
        proposition_id: i,
        correct: "true",
      });
      i++;
    }
  });

  return fetch(url, {
    method: `${methode}`,
    headers: state.headers(),
    body: JSON.stringify(questionObj),
  })
    .then(filterHttpResponse)
    .then(() => {
      if (methode === "PUT") {
        const toast = M.toast({
          html: "Votre proposition a été modifié avec brio &#128076",
          displayLength: 5000,
          classes: "blue rounded",
        });
        toast.el.onclick = function dismiss() {
          toast.timeRemaining = 0;
        };
      } else {
        const toast = M.toast({
          html: "Une nouvelle proposition a été ajouté &#128170",
          displayLength: 5000,
          classes: "green rounded",
        });
        toast.el.onclick = function dismiss() {
          toast.timeRemaining = 0;
        };
      }
    })
    .catch(console.error);
};

// Envoie une requête delete au serveur pour supprimer une question d'un quiz
// quiz_id: l'id du quiz de la question
// question_id: l'id de la question à supprimer dans le quiz
const sendDeleteQuestion = (quizz_id, question_id) => {
  const url = `${state.serverUrl}/quizzes/${quizz_id}/questions/${question_id}`;

  return fetch(url, {
    method: "DELETE",
    headers: state.headers(),
  })
    .then(filterHttpResponse)
    .then(() => {
      M.toast({
        html: "Votre Question a été supprimé avec succès ❗",
        displayLength: 5000,
        classes: "red rounded",
      });
      toast.el.onclick = function dismiss() {
        toast.timeRemaining = 0;
      };
    });
};
