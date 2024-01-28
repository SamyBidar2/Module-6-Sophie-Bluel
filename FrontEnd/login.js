async function login(){
    console.log('fonction login')
    const mail = document.getElementById('mailLogin').value;
    const Pwd = document.getElementById('PWD').value;

    console.log(mail);
    console.log(Pwd);


    let user = {
        email: mail,
        password: Pwd
      };
      
      let response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
      });

    let result = await response.json();

    //Stockage du token
    

    //résultat de l'authentification
    //si un token est retourné, alors l'identification a fonctionné correctement. Sinon on a une erreur.
    if (result.token != null) {
      window.location.href = './index.html';
      sessionStorage.setItem('Token', result.token);
      console.log(result.token);
    }
    else{
      //si le message de retour est "user not found", on a une erreur sur l'ID, sinon on a forcément une erreur sur le MP
      console.log(result.message);
      if(result.message == "user not found")
        window.alert('Erreur: Indentifiant incorrect.');

      else
        window.alert('Erreur: Mot de passe incorrect.');
    }

}

//console.log('chargé')

