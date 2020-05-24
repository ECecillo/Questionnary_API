// Quand on clique sur le bouton de login, il nous dit qui on est et combien nous avons de quiz <= en développement.
const renderUserBtn = () => {
  const btn = document.getElementById("id-login");
  btn.onclick = () => {
    if (state.user) {
      getUser();
      document.getElementById(
        "content-logout"
      ).innerHTML = `<h5> 👤 ${state.user.lastname.toUpperCase()} ${
        state.user.firstname
      } (${state.user.user_id}) <br />
        Vous êtes l'auteur de</h5>`;
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
          '<h5 style="color:green;">Heureux de vous revoir 🤟</h5>';
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

/*
function FindNext () {
  var str = document.getElementById ("search").value;
  if (str == "") {
      alert ("Rentrez du texte pour rechercher !");
      return;
  }

  var supported = false;
  var found = false;
  if (window.find) {        // Firefox, Google Chrome, Safari
      supported = true;
          // if some content is selected, the start position of the search 
          // will be the end position of the selection
      found = window.find (str);
  }
  if (supported) {
      if (!found) {
          alert ("Le texte n'a pas été trouvé :\n" + str);
      }
  }
  else {
      alert ("Your browser does not support this example!");
  }
}
*/
