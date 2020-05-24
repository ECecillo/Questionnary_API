// //////////////////////////////////////////////////////////////////////////////
// Affichage de la gestion des Quiz de l'utilisateur (modif, delete ...)
// //////////////////////////////////////////////////////////////////////////////

// Fonction qui ajoute une nouvelle proposition à un quiz.
//quizz_id: l'id du quiz dans lequelle on a cliqué.
//nbQ: l'id de la dernière question du quiz + 1.
function addNewProp(quizz_id, nbQ) {
  console.debug(`addNewProp(${quizz_id})`);
  const modify = document.getElementById("id-modify-quizzes-main");
  var idP = 0;
  const code = `
    <div id="addNewProp_div">
      <h4>Ajouter une proposition<h4>
      <label>Nouvelle question :
        <input placeholder='Votre question' id='question' type='text' class='validate'>
      </label>
      <label>
        <input type='radio' name='newQ' checked='true'><span>Proposition ${idP} :</span>
        <input placeholder='Votre proposition' id='new_proposition${idP}' type='text' class='validate modified_proposition' required>
      </label>
        <button class='waves-effect waves-light btn blue' id='create_answer'>Nouvelle proposition</button>
        <button class='waves-effect waves-light btn green' id='create_question'>Ajouter la question</button>
          `;

  modify.innerHTML = code;
  document.getElementById("create_answer").onclick = () => {
    idP++;
    let html = `
      <label>
        <input type='radio' name='newQ'>
        <span>Proposition ${idP} :</span>
        <input placeholder='Votre proposition' id='new_proposition${idP}' type='text' class="validate modified_proposition">
      </label>`;
    document
      .getElementById(`new_proposition${idP - 1}`)
      .insertAdjacentHTML("afterend", html);
  };
  document.getElementById("create_question").onclick = () => {
    const sentence = document.getElementById("question").value;
    sendUserProp(quizz_id, nbQ, idP, sentence, "POST");
    document.getElementById("addNewProp_div").remove();
  };
}

// Fonction qui change le titre et la description d'un quiz.
//quizz: les informations du quiz (titre, description) pour l'affichage dans les inputs.
//quizz_id: l'id du quizz que l'on a sélectionné.
function changeTitleDesc(quizz, quizz_id) {
  console.debug(`changeTitleDesc(${quizz}, ${quizz_id})`);
  const modify = document.getElementById("id-modify-quizzes-main");
  const code = `
    <div id="change_Title_Desc">
      <h4>Modifier le Titre et la Description<h4>
      <label>Titre :
          <input placeholder='Le Nouveau titre' id='new_title' type='text' class='validate' value='${quizz.info.title}'>
        </label>
        <label>Description :
          <input placeholder='La nouvelle description' id='new_desc' type='text' class='validate' value='${quizz.info.description}'>
        </label>
        <button class='waves-effect waves-light btn' id='update_quiz'>Modifier le Quiz</button>
    </div>`;

  modify.innerHTML = code;

  document.getElementById("update_quiz").onclick = () => {
    let title = document.getElementById("new_title").value;
    let description = document.getElementById("new_desc").value;
    sendNewQuizzTitleDesc(title, description, "PUT", quizz_id);
    document.getElementById("change_Title_Desc").remove();
  };
}

// Fonction qui supprime la question d'un quiz
//quiz_id: l'id du quiz que l'on veut supprimer.
//question_id: l'id de la question que l'on veut supprimer.
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

// Fonction qui Modifie la question et les propositions d'un quiz
//quiz_id: l'id du quiz que où l'on veut modifier les propositions.
//question_id: l'id de la question que l'on veut modifier.
function editUserQuizz(quiz_id, question_id) {
  console.debug(`editUserQuizz(${quiz_id},${question_id})`);
  const modify = document.getElementById("id-modify-quizzes-main");
  getQuestionData(quiz_id, question_id); // récupère les infos du quiz que l'on a sélectionné.
  let question_info = state.currentQuizz;
  let idP = 0;
  let lenghtQuestion = question_info.propositions_number; // Nombre de propostion
  console.log(lenghtQuestion);
  const code = `
    <div id="modif_quizz">
      <h4>Modification de la Question<h4>
      <label>Question :
        <input placeholder='La nouvelle question' id='question' type='text' class='validate' value="${question_info.sentence}" required>
      </label>
      <div id='propostionList'></div>
      <button class='waves-effect waves-light btn green' id='modify_question'>
        Modifier la question
      </button>
    </div>
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
    document.getElementById("modif_quizz").remove();
  };
}
