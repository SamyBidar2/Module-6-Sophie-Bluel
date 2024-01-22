let UrlSrc; 
let Titre;

function CreationGalerie() {
  return fetch('http://localhost:5678/api/works') // Renvoie la promesse pour permettre la gestion asynchrone
    .then(res => res.json()) 
    .then(data => {
      if (data.length > 0) 
      {
        const Galerie = document.querySelector('.gallery');

        for (let i=0; i<data.length; i++)
        {
            const UrlSrc = data[i].imageUrl; // Stocke la valeur dans la variable UrlSrc
            console.log('URL retournée', UrlSrc);

            const Titre = data[i].title; //stocke la valeur dans la variable Titre
            console.log('Titre retourné', Titre);

            //création des éléments
            const figure = document.createElement('figure');

            const img = document.createElement('img');
            img.src=UrlSrc;
            img.alt=Titre;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent=Titre;

            //Ajout des éléments img et figcaption à figure
            figure.appendChild(img);
            figure.appendChild(figcaption);

            //Ajout des éléments figure à Galerie
            Galerie.appendChild(figure);
        }
      } else {
        console.error('Aucun élément trouvé.');
      }
    })
}

// Appelle la fonction
CreationGalerie();


        //Création d'un modèle pour l'ajout des balises dans le Html
      //   const figure = `
      //   <figure>
      //       <img src="${UrlSrc}" alt="${Titre}">
      //       <figcaption>${Titre}</figcaption>
      //   </figure>
      // `;

        // Ajoute l'image dans la balise contenant la classe Gallery
       // document.querySelector('.gallery').innerHTML = figure;