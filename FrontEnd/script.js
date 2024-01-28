let UrlSrc; 
let Titre;

// Fonction pour interroger l'API et récupérer les données
async function InterrogerAPIWorks(){
    const WorksReponse = await fetch('http://localhost:5678/api/works');
    
    if (!WorksReponse.ok) {
      throw new Error('Erreur lors de la requête fetch');
    }

    const data = await WorksReponse.json();
    // console.log(data);

    return data;
} 

// Fonction pour créer la galerie en fonction de la catégorie
function CreationGalerie(data, categoryId){
  
  const Galerie = document.querySelector('.gallery');

  // Supprime tous les éléments actuels de la galerie
  Galerie.innerHTML = '';

  for (let i = 0; i < data.length; i++) {

    // Vérifie si la catégorie correspond au filtre (ou affiche tout si pas de filtre)
    if (categoryId === null || data[i].categoryId === categoryId) {
        
      const UrlSrc = data[i].imageUrl; // Stocke la valeur dans la variable UrlSrc
      console.log('URL retournée', UrlSrc);

      const Titre = data[i].title; //stocke la valeur dans la variable Titre
      console.log('Titre retourné', Titre);

      // Création des éléments
      const figure = document.createElement('figure');
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
}

// Fonction pour afficher la galerie en fonction de la catégorie
async function AfficherGalerieParCategorie(categoryId){
  // Interroge l'API pour récupérer les données
  const data = await InterrogerAPIWorks();
    
  // Crée la galerie en fonction de la catégorie spécifiée
  await CreationGalerie(data, categoryId);

}

// Chargement de la galerie entière par défaut
window.onload = function(){
  AfficherGalerieParCategorie(null);  // null pour afficher toutes les catégories
}

//fonction pour changer de classe en fonction de la sélection du filtre
function select(clickedButton) {
  // Supprime la classe "selected" de tous les boutons
  var buttons = document.querySelectorAll('.bouton');
  buttons.forEach(function (btn) {
      btn.classList.remove('selected');
  });

  // Ajoute la classe "selected" au bouton cliqué
  clickedButton.classList.add('selected');
}
