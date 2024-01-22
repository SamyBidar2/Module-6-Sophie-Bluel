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
    console.log(result.message);

    console.log(result.token)

}

console.log('chargé')

