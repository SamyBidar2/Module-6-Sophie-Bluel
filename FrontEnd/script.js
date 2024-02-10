let UrlSrc; 
let Titre;
let data;

// Fonction pour interroger l'API et récupérer les données
async function InterrogerAPIWorks(){
    const WorksReponse = await fetch('http://localhost:5678/api/works');
    
    if (!WorksReponse.ok) {
      throw new Error('Erreur lors de la requête fetch');
    }

    data = await WorksReponse.json();
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
        
      const UrlSrc = data[i].imageUrl;
      console.log('URL retournée', UrlSrc);

      const Titre = data[i].title; 
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
}

// Fonction pour afficher la galerie en fonction de la catégorie
async function AfficherGalerieParCategorie(categoryId){
  // Interroge l'API pour récupérer les données si elles n'ont pas été récupérées
  if (!data) {
    await InterrogerAPIWorks();
  }    
  // Crée la galerie en fonction de la catégorie spécifiée
  CreationGalerie(data, categoryId);
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

// Fonction pour créer la galerie dans la fenetre Modale en fonction de la catégorie
function CreationModaleGalerie(data){
  
  const ModaleGalerie = document.querySelector('.ModaleGalerie');

  // Supprime tous les éléments actuels de la galerie
  ModaleGalerie.innerHTML = '';

  for (let i = 0; i < data.length; i++) {
      const UrlSrc = data[i].imageUrl;
      console.log('URL retournée', UrlSrc);

      // Création des éléments
      const img = document.createElement('img');
      img.id = "image" + data[i].id;
      img.src=UrlSrc;
      img.alt=Titre;

      const Corbeille = document.createElement('div');
      Corbeille.classList.add('Corbeille');

      const conteneur = document.createElement('div');
      conteneur.classList.add('conteneursuppression');

      const icone = document.createElement('i');
      icone.classList.add('fa-solid', 'fa-trash-can');
      
      ModaleGalerie.appendChild(conteneur);
      conteneur.appendChild(img);
      conteneur.appendChild(Corbeille);
      Corbeille.appendChild(icone);
      
      Corbeille.addEventListener('click', () => {
        //fonction suppression
        //On utilise l'id de l'image pour repérer l'image à supprimer, et on supprime son parent (donc ici le conteneur),
        //ce qui permet de réadapter automatiquement la grille.
        // Ensuite on appelle la fonction SuppressionImageGalerie qui va supprimer l'image dans l'API
        console.log('identifiant', data[i].id);
        
        document.getElementById(img.id).parentElement.remove(); 
        SuppressionImageGalerie(data[i].id);
        console.log('Image identifiant' + data[i].id + 'supprimée' )
      });

  }
  console.log('galerie créée dans la modale')
}

// Fonction pour afficher dans la fenetre Modale en fonction de la catégorie
async function AfficherModaleGalerieParCategorie(){
  if (!data) {
    await InterrogerAPIWorks();
  }    
  CreationModaleGalerie(data);
}

//Fonction pour ouvrir la fenetre Modale
function OuvrirModale(){
  const AfficherModale = document.getElementById('modale');

  AfficherModale.classList.remove('invisible');
  AfficherModale.classList.add('visible');
  AfficherModale.removeAttribute('aria-hidden');
  AfficherModale.setAttribute('aria-modal', 'true');

  //Ajoute les images dans la modale
  AfficherModaleGalerieParCategorie(null);
}

//fonction pour fermer la fenetre Modale
function FermerModale(){
  const FermerModale = document.getElementById('modale');

  FermerModale.classList.remove('visible');
  FermerModale.classList.add('invisible');
  FermerModale.setAttribute('aria-hidden', 'true');
  FermerModale.removeAttribute('aria-modal');
}

//Fonction de suppression des images dans la galerie principale (appel à l'API et DELETE)
function SuppressionImageGalerie(id){
  const figure = document.getElementById("figure" + id);

  if (figure) {
    var userToken = sessionStorage.getItem('Token');
    fetch ("http://localhost:5678/api/works/"+ id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ userToken
        },
    }).then (Response =>{
      if (Response.ok){
        console.log("Image "+id+ "supprimée")
      }
      else{
        console.log("Erreur lors de la suppression")
      }
    })
  }
}

//Fonction pour ouvrir la fenetre d'ajout de photos 
function OuvrirFenetreAjout(){
      const FermerGalerie = document.getElementById("modale");
      const OuvrirAjout = document.getElementById("modaleAjout");

      FermerGalerie.classList.remove('visible');
      FermerGalerie.classList.add('invisible');
      FermerGalerie.setAttribute('aria-hidden', 'true');
      FermerGalerie.removeAttribute('aria-modal');

      OuvrirAjout.classList.remove('invisible');
      OuvrirAjout.classList.add('visible');
      OuvrirAjout.removeAttribute('aria-hidden');
      OuvrirAjout.setAttribute('aria-modal', 'true');
}

//Fonction pour femrer la modale d'ajout
function FermerModaleAjout(){
  const FermerModaleAjout = document.getElementById('modaleAjout');

  FermerModaleAjout.classList.remove('visible');
  FermerModaleAjout.classList.add('invisible');
  FermerModaleAjout.setAttribute('aria-hidden', 'true');
  FermerModaleAjout.removeAttribute('aria-modal');
}

//Fonction pour revenir sur la fenetre modale précédente
function Retour(){
    const FermerAjout = document.getElementById("modaleAjout");
    const OuvrirGalerie = document.getElementById("modale");

    FermerAjout.classList.remove('visible');
    FermerAjout.classList.add('invisible');
    FermerAjout.setAttribute('aria-hidden', 'true');
    FermerAjout.removeAttribute('aria-modal');

    OuvrirGalerie.classList.remove('invisible');
    OuvrirGalerie.classList.add('visible');
    OuvrirGalerie.removeAttribute('aria-hidden');
    OuvrirGalerie.setAttribute('aria-modal', 'true');
}

//Formulaire pour l'ajout des images
const form = document.forms.namedItem("FormulaireAjoutPhoto");
form.addEventListener(
  "submit",
  (event) => {
    //Valeur des champs de formulaire
    const titre = document.getElementById('Titreimage').value;
    const categorie = document.getElementById('Categorieimage').value;

    //Image insérée dans file
    const Fileinput = document.getElementById('FileInput')
    const file = FileInput.files[0];

    const output = document.querySelector("#output");
    const formData = new FormData(form);

    formData.append('titre', titre);
    formData.append('categorie', categorie);
    formData.append('image',file);

   // Récupération du token d'authentification depuis la session
   const userToken = sessionStorage.getItem('Token');

    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:5678/api/works", true);
    request.setRequestHeader('Authorization', 'Bearer ' + userToken); // Ajout du jeton d'authentification dans l'en-tête
    
    request.onload = (progress) => {
      output.innerHTML =
        request.status === 200
          ? "Fichier téléversé !"
          : `Erreur ${request.status} lors de la tentative de téléversement du fichier.<br />`;
    };

    request.send(formData);
    event.preventDefault();
  },
  false,
);




window.onload = function(){
  // Chargement de la galerie entière par défaut
    AfficherGalerieParCategorie(null);  // null pour afficher toutes les catégories

  //Afficher le bouton modifier si le login est correct.
    //Récupère le token stocké pour vérifier si l'utilisateur est connecté
    var userToken = sessionStorage.getItem('Token');
    const BoutonModifier = document.getElementById('BoutonModifier');

    //si le token existe alors on rend le bouton visible
    if(userToken){
      BoutonModifier.classList.remove('invisible');
      BoutonModifier.classList.add('visible');

      //Créer le bandeau Mode Edition
      const ModeEdition = `
      <div class="ModeEdition">
		  <i class="fa-regular fa-pen-to-square"></i>
		  <p>Mode édition</p>
	    </div>`;

      // Ajoute le code dans la div #ModeEdition pour faire apparaitre le bandeau
      document.getElementById('ModeEdition').innerHTML = ModeEdition;
    }
}





// fetch ("http://localhost:5678/api/works/"+boutonId, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': 'Bearer '+token
//                 },
//             })





