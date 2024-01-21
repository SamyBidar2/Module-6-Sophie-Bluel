let UrlSrc; 
let Titre;

function CreationGalerie() {
  return fetch('http://localhost:5678/api/works') // Renvoie la promesse pour permettre la gestion asynchrone
    .then(res => res.json()) 
    .then(data => {
      if (data.length > 0) {
        UrlSrc = data[0].imageUrl; // Stocke la valeur dans la variable UrlSrc
        Titre = data[0].title; //stocke la valeur dans la variable Titre
        console.log('URL retournée', UrlSrc);
        console.log('Titre retourné', Titre);

        //Création d'un modèle pour l'ajout des balises dans le Html
        const figure = `
          <figure>
              <img src="${UrlSrc}" alt="${Titre}">
              <figcaption>${Titre}</figcaption>
          </figure>
        `;

        // Ajoute l'image dans la balise contenant la classe Gallery
        document.querySelector('.gallery').innerHTML = figure;

      } else {
        console.error('Aucun élément trouvé.');
      }
    })
    .catch(error => console.error('Erreur :', error));
}

// Appelle la fonction
CreationGalerie();


