// //////////////////////////////////////////////////////////////////////////////
// CONSTANTES
// //////////////////////////////////////////////////////////////////////////////

console.debug(`@search()`);
const quizzList = document.getElementById("id-all-quizzes-list");
const quizzListQuery = document.querySelectorAll("#id-all-quizzes-list");
const searchBar = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const closebutton = document.getElementById("closebutton");
let hpCharacters = [];

// //////////////////////////////////////////////////////////////////////////////
// ONCLICK DELCARATION
// //////////////////////////////////////////////////////////////////////////////

closebutton.onclick = (ev) => {
  renderQuizzes();
};

searchButton.onclick = (ev) => {
  const searchString = searchBar.value.toLowerCase();
  loadCharacters(searchString);
};
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

// //////////////////////////////////////////////////////////////////////////////
// SEARCH_BAR
// //////////////////////////////////////////////////////////////////////////////

const loadCharacters = async (searchString) => {
  try {
    const url = `${state.serverUrl}/search/?q=${searchString}`;
    return fetch(url, { method: "GET", headers: state.headers() })
      .then(filterHttpResponse)
      .then((data) => {
        const dataQuiz_id = data.map((q) => q.quiz_id);
        const dataInfoQuizz = dataQuiz_id.map((d) => getQuizzInfo(d));
        Promise.all(dataInfoQuizz)
          .then((dataTab) => (quizzList.innerHTML = htmlQuizzesList(dataTab)))
          .then(renderQuizzesSearch());
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
      });
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
    .join("");
  quizzList.innerHTML = htmlString;
};
