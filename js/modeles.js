/* globals renderQuizzes renderUserBtn */

// //////////////////////////////////////////////////////////////////////////////
// LE MODELE, a.k.a, ETAT GLOBAL
// //////////////////////////////////////////////////////////////////////////////

// un objet global pour encapsuler l'état de l'application
// on pourrait le stocker dans le LocalStorage par exemple
const state = {
  // la clef de l'utilisateur
  xApiKey: "", //Ma clé : 7726bb9b-f8b3-4a58-95de-a2eeb9ad4d78

  // l'URL du serveur où accéder aux données
  serverUrl: "https://lifap5.univ-lyon1.fr",

  // la liste des quizzes
  quizzes: [],

  // le quizz actuellement choisi
  currentQuizz: undefined,

  // une méthode pour l'objet 'state' qui va générer les headers pour les appel à fetch
  headers() {
    const headers = new Headers();
    headers.set("X-API-KEY", this.xApiKey);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
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
  return fetch(url, { method: "GET", headers: state.headers() })
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
        classes: 'green rounded'
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
        classes: 'blue rounded'
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
  console.debug(
    `@SendUserProp(${id},${idQ},${idP},${sentence},${methode})`
  );
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
      if(methode === "PUT") {
        M.toast({
          html: "Votre proposition a été modifié avec brio &#128076",
          displayLength: 5000,
          classes: 'blue rounded'
        });
        toast.el.onclick = function dismiss() {
          toast.timeRemaining = 0;
        };
      }else {
        M.toast({
          html: "Une nouvelle proposition a été ajouté &#128170",
          displayLength: 5000,
          classes: 'green rounded'
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
        classes: 'red rounded'
      });
      toast.el.onclick = function dismiss() {
        toast.timeRemaining = 0;
      };
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




  console.debug(`@search()`);
  const quizzList = document.getElementById('id-all-quizzes-list');
  const quizzListQuery = document.querySelectorAll('#id-all-quizzes-list');
  const searchBar = document.getElementById('search');
  const searchButton = document.getElementById('searchButton');
  const closebutton = document.getElementById('closebutton');
  let hpCharacters = [];
  
  closebutton.onclick = (ev) => {
    renderQuizzes();
  }

  searchButton.onclick = (ev) => {
    const searchString = searchBar.value.toLowerCase();
    loadCharacters(searchString);
  }
  /*searchBar.addEventListener('keyup', (e) => {
      console.log(e.target.value.toLowerCase());
      const searchString = e.target.value.toLowerCase();
  
      const filteredCharacters = state.quizzes.results.filter((quizz) => {
          console.log(quizz);
        return (
              quizz.title.toLowerCase().includes(searchString) ||
              quizz.description.toLowerCase().includes(searchString)
          );
      });
      //displayCharacters(filteredCharacters);
  });*/
  
  /*function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }*/
  
  const loadCharacters = async (searchString) => {
      try {
        const url = `${state.serverUrl}/search/?q=${searchString}`;
        return fetch(url, { method: "GET", headers: state.headers()})
          .then(filterHttpResponse)
          .then((data) => {
            const dataQuiz_id = data.map((q) => q.quiz_id);
            const dataInfoQuizz = dataQuiz_id.map(d => getQuizzInfo(d));
            Promise.all(dataInfoQuizz)
              .then(dataTab => quizzList.innerHTML = htmlQuizzesList(dataTab))
              .then(renderQuizzesSearch())
              /*const quizzes = document.querySelectorAll("#id-all-quizzes-list li");
                quizzes.forEach((q) => {
                  q.onclick = () => {
                    console.log(`${this}`);
                    const quizzId = this.dataset.quizzid;
                console.debug(`@clickQuiz(${quizzId})`);
                state.currentQuizz = quizzId;
            
                return getQuizzData(quizzId).then((data) => {
                  const Info = state.quizzes.results.find((e) => e.quiz_id === Number(quizzId));
                  return renderCurrentQuizz({ info: Info, questions: data });
                });
                  }
                })*/
              console.debug(dataInfoQuizz);
              console.debug(dataQuiz_id);
              console.debug(data);
            /*for(let i=0; i<quizzid.length; i++)
            {
              //let quizz = timeout(1000, getQuizzInfo(quizzid[i]));
              let quizz = getQuizzInfo(quizzid[i]);
              console.debug(quizz);
              
            }*/
            //console.debug(quizz);
            //quizzList.innerHTML = htmlQuizzesList(quizzid);
          })
          /*.then((data) => {
            console.debug(data);
            let quizzid = Array.from(data.quiz_id);
            console.debug(quizzid);
            quizzid.style.color = 'yellow';
            console.debug(quizz);
            console.debug(state.currentQuizz);
            quizz = Array.from(state.currentQuizz);
            quizzList.innerHTML = htmlQuizzesList(data);
            //console.log(data);
          })*/
      } catch (err) {
          //console.error(err);
      }
  };
  
  
  const displayCharacters = (quizzes) => {
      const htmlString = quizzes
          .map((quizz) => {
              return `
                  <h2>${quizz.title}</h2>
                  <p>House: ${quizz.description}</p>
          `;
          })
          .join('');
      quizzList.innerHTML = htmlString;
  };
