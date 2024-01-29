let UrlSrc; 
let Titre;

function CreationGalerie(data, categoryId) {
  return fetch('http://localhost:5678/api/works') // Renvoie la promesse pour permettre la gestion asynchrone
    .then(res => res.json()) 
    .then(data => 
    {
      if (data.length > 0) 
      {
        const Galerie = document.querySelector('.gallery');

        // Supprime tous les éléments actuels de la galerie
        Galerie.innerHTML = '';

        for (let i = 0; i < data.length; i++) 
        {
          // Vérifie si la catégorie correspond au filtre (ou affiche tout si pas de filtre)
          if (categoryId === null || data[i].categoryId === categoryId) 
          {
            const UrlSrc = data[i].imageUrl; // Stocke la valeur dans la variable UrlSrc
            console.log('URL retournée', UrlSrc);

            const Titre = data[i].title; //stocke la valeur dans la variable Titre
            console.log('Titre retourné', Titre);

            // Création des éléments
            const figure = document.createElement('figure');
            figure.id = "figure" + data[i].id;

            const img = document.createElement('img');
            img.src=UrlSrc;
            img.alt=Titre;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = Titre;

            // Ajout des éléments img et figcaption à figure
            figure.appendChild(img);
            figure.appendChild(figcaption);

            // Ajout de l'élément figure à la Galerie
            Galerie.appendChild(figure);
          }
        }
        console.log('galerie créée pour le filtre'+ ' ' + categoryId)
      } else {
        console.error('Aucun élément trouvé.');
      }
    })
}


// Appelle la fonction
window.onload = function(){
  CreationGalerie();
  console.log('fonction chargée');
}


        //Création d'un modèle pour l'ajout des balises dans le Html
      //   const figure = `
      //   <figure>
      //       <img src="${UrlSrc}" alt="${Titre}">
      //       <figcaption>${Titre}</figcaption>
      //   </figure>
      // `;

        // Ajoute l'image dans la balise contenant la classe Gallery
       // document.querySelector('.gallery').innerHTML = figure;





