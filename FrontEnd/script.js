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
    console.log(data);

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
 
    //Ajout d'un EL pour déclencher la suppression de l'image au clic
      Corbeille.addEventListener('click', () => {        
          SuppressionImageGalerie(data[i].id);
        // console.log('Image identifiant' + data[i].id + 'supprimée' )
      });

  }
  console.log('galerie créée dans la modale')
}

// Fonction pour afficher dans la fenetre Modale en fonction de la catégorie
async function AfficherModaleGalerie(){
  if (!data) {
    await InterrogerAPIWorks();
  }    
  CreationModaleGalerie(data);
}

// Fonction pour ouvrir la fenetre Modale
function OuvrirModale(){
  const AfficherModale = document.getElementById('modale');
    
  AfficherModale.classList.remove('invisible');
  AfficherModale.classList.add('visible');
  AfficherModale.removeAttribute('aria-hidden');
  AfficherModale.setAttribute('aria-modal', 'true');

  // Ajoute les images dans la modale
  //AfficherModaleGalerie(null);
}

// Fonction pour fermer la fenetre Modale
function FermerModale(event) {
  // Vérifier si l'événement est défini
  if (event) {
    const FermerModale = document.getElementById('modale');
    const MessageSuppression = document.getElementById('MessageAjoutEtSuppression');
    const Output = document.getElementById("output");
    const FormulaireAjout = document.getElementById("AjoutForm");

    // Si l'élément cliqué est l'icône X ou si il contient la classe js-modal-stop, fermer la modale.
    if (event.target.classList.contains('FermetureModale') || event.target.classList.contains('js-modal-stop')) {
      FermerModale.classList.remove('visible');
      FermerModale.classList.add('invisible');
      FermerModale.setAttribute('aria-hidden', 'true');
      FermerModale.removeAttribute('aria-modal');

      // Permet de supprimer le message suite à la suppression d'une image
      MessageSuppression.innerHTML = "";
      MessageSuppression.classList.add('invisible');

      // Permet de supprimer le message en cas d'erreur d'ajout
      Output.innerHTML = "";
      Output.classList.add('invisible');

      // Permet de réinitialiser le formulaire
      FormulaireAjout.reset();
    } 
    //sinon on ne fait rien
    else return;
  }
}

//Fonction de suppression des images dans la galerie principale (appel à l'API et DELETE)
function SuppressionImageGalerie(id) {

  const userToken = sessionStorage.getItem('Token');
  fetch("http://localhost:5678/api/works/" + id, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + userToken
          },
      })
      .then(Response => {
          if (Response.ok) {
            // Supprimer l'image de la galerie modale
            //On utilise l'id de l'image pour repérer l'image à supprimer, et on supprime son parent (donc ici le conteneur),
            //ce qui permet de réadapter automatiquement la grille.
            const imgElement = document.getElementById("image" + id);
            if (imgElement) {
                imgElement.parentElement.remove();
            }

            // Supprimer l'image de la galerie principale (DOM)
            const imgElementGallery = document.getElementById("figure" + id);
            if (imgElementGallery) {
                imgElementGallery.remove();
            }
              const MessageSuppression = document.getElementById('MessageAjoutEtSuppression');
              MessageSuppression.innerHTML= 'Image supprimée avec succès !';
              MessageSuppression.classList.remove('invisible');

              console.log("Image " + id + " supprimée avec succès");
          } else {
              console.log("Erreur lors de la suppression de l'image");
              alert("Une erreur s'est produite lors de la suppression de l'image.");
          }
      })
      .catch(error => {
          console.error('Erreur lors de la suppression:', error);
          alert("Une erreur s'est produite lors de la suppression de l'image.");
      });
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
function FermerModaleAjout(event){
  // Vérifier si l'événement est défini
  if (event) {
  const FermerModaleAjout = document.getElementById('modaleAjout');
  const MessageSuppression = document.getElementById('MessageAjoutEtSuppression');
  const Output = document.getElementById("output");
  const FormulaireAjout = document.getElementById("AjoutForm");
  
   // Si l'élément cliqué est l'icône X ou si il contient la classe js-modal-stop, fermer la modale.
   if (event.target.classList.contains('FermetureModale') || event.target.classList.contains('js-modal-stop')) {

      FermerModaleAjout.classList.remove('visible');
      FermerModaleAjout.classList.add('invisible');
      FermerModaleAjout.setAttribute('aria-hidden', 'true');
      FermerModaleAjout.removeAttribute('aria-modal');

      //permet de supprimer le message suite à la suppression d'une image
      MessageSuppression.innerHTML="";
      MessageSuppression.classList.add('invisible');

      // permet de supprimer le message en cas d'erreur d'ajout
      Output.innerHTML="";
      Output.classList.add('invisible');

      //premet de reinitialiser le formulaire
      FormulaireAjout.reset(); 
      //location.reload();
    }       
    //sinon on ne fait rien
    else return;
  }
}

//Fonction pour revenir sur la fenetre modale précédente
function Retour(){
    const FermerAjout = document.getElementById("modaleAjout");
    const OuvrirGalerie = document.getElementById("modale");
    const MessageSuppression = document.getElementById('MessageAjoutEtSuppression');
    const Output = document.getElementById("output");
    const FormulaireAjout = document.getElementById("AjoutForm");

    FermerAjout.classList.remove('visible');
    FermerAjout.classList.add('invisible');
    FermerAjout.setAttribute('aria-hidden', 'true');
    FermerAjout.removeAttribute('aria-modal');

    OuvrirGalerie.classList.remove('invisible');
    OuvrirGalerie.classList.add('visible');
    OuvrirGalerie.removeAttribute('aria-hidden');
    OuvrirGalerie.setAttribute('aria-modal', 'true');

    //permet de supprimer le message suite à la suppression d'une image
    MessageSuppression.innerHTML="";
    MessageSuppression.classList.add('invisible');

    //permet de supprimer le message en cas d'erreur d'ajout
    Output.innerHTML="";
    Output.classList.add('invisible');

    //premet de reinitialiser le formulaire
    FormulaireAjout.reset(); 
}

//Fonction pour afficher l'image que l'on veut ajouter
function AfficherImage(event) {

    const file = event.target.files[0];
    const imagePreview = document.getElementById('Preview');
    const icone = document.getElementById('AjouterUneimage');
    const bontonAjouter = document.querySelector('.boutonAjouter');
    const texte = document.getElementById('InfoImage');
    const BtnValider = document.getElementById('InputAjouter')

    //Types de fichiers autorisés
    const fileTypes = ["image/jpeg", "image/jpg", "image/png"];

    //Fonction pour valider le type de fichier
    function validFileType(file) {
      for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
          return true;
        }
      }
      return false;
    }
    //Fonction pour valider la taille du fichier
    function validFileSize(file){
      const MaxSize= 4*1024*1024;
      if (file.size <= MaxSize){
        return true;
      }else return false;
    }
    
    if (file) {
      if (!validFileType(file) || !validFileSize(file)) {
        // Affichez un message d'erreur si le type de fichier n'est pas autorisé
        output=document.getElementById('output');
        output.innerHTML = 'Seuls les fichiers JPEG ou PNG inférieurs à 4Mo sont autorisés.';
        output.classList.add('MessageErreur');
        output.classList.remove('invisible');
        return; // Arrêtez la fonction si le type de fichier n'est pas autorisé
      }
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Affiche l'image
            icone.style.display = 'none'; // masque les autres éléments
            bontonAjouter.style.display = 'none';
            texte.style.display = 'none';
            BtnValider.style.background = 'rgba(29, 97, 84, 1)'; // une fois l'image chargée, le bouton valider devient vert
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none'; // Masque l'image

    }
}


//Fonction pour supprimer l'image que l'on a ajouté pour l'envoi au formulaire (dans le cadre de l'ajout d'une image)
function SupprimerImageChargee(){
  const imagePreview = document.getElementById('Preview');
  const icone = document.getElementById('AjouterUneimage');
  const bontonAjouter = document.querySelector('.boutonAjouter');
  const texte = document.getElementById('InfoImage');

  imagePreview.src = '#';
  imagePreview.style.display = 'none'; // Masque l'image
  icone.style.display = 'block'; // masque les autres éléments
  bontonAjouter.style.display = 'flex';
  texte.style.display = 'block';
}

//Formulaire pour l'ajout des images
let form = document.getElementById("AjoutForm");
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const output = document.getElementById('output');

    // Valeur des champs de formulaire
    const titre = document.getElementById('Titreimage').value;
    const categorie = document.getElementById('Categorieimage').value;

    // Image insérée dans le champ de fichier
    const fileInput = document.getElementById('FileInput');
    const file = fileInput.files[0];

    // Création de l'objet FormData et ajout des données
    const formData = new FormData();
    formData.append('title', titre);
    formData.append('category', categorie);
    formData.append('image', file);

    // Envoi de la requête POST à l'API
    var userToken = sessionStorage.getItem('Token');
    fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + userToken
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
          return  response.json();
        } else {
          switch (response.status) {
                case 400:
                    output.innerHTML = 'Erreur dans la requête, vérifiez les données saisies';
                    output.classList.add('MessageErreur');
                    output.classList.remove('invisible');
                    break;
                case 401:
                    output.innerHTML = 'Authentification Erronée';
                    output.classList.add('MessageErreur');
                    output.classList.remove('invisible');
                    break;
                case 500:
                    output.innerHTML = 'Erreur inconnue';
                    output.classList.add('MessageErreur');
                    output.classList.remove('invisible');
                    break;
            }
        }
      })
    
    .then(data =>{
      console.log(data);
      //#region Création des éléments dans la Galerie modale
        const ModaleGalerie = document.querySelector('.ModaleGalerie');
        const image = document.createElement('img');
        image.id = "image" + data.id;
        image.src=data.imageUrl;
        image.alt=data.title;

        const Corbeille = document.createElement('div');
        Corbeille.classList.add('Corbeille');

        const conteneur = document.createElement('div');
        conteneur.classList.add('conteneursuppression');

        const icone = document.createElement('i');
        icone.classList.add('fa-solid', 'fa-trash-can');
        
        ModaleGalerie.appendChild(conteneur);
        conteneur.appendChild(image);
        conteneur.appendChild(Corbeille);
        Corbeille.appendChild(icone);
      //#endregion

      //#region Création des éléments dans la Galerie principale
        const figure = document.createElement('figure');
        figure.id = "figure" + data.id;
        const img = document.createElement('img');
        img.src=data.imageUrl;
        img.alt=data.title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = data.title;

        // Ajout des éléments img et figcaption à figure
        figure.appendChild(img);
        figure.appendChild(figcaption);

        // Ajout de l'élément figure à la Galerie principale
        Galerie=document.querySelector('.gallery');
        Galerie.appendChild(figure);

        console.log("Image ajoutée à la galerie principale");
      //#endregion

      icone.addEventListener('click', function(){
         // Suppression de l'image dans la modale
        const imageElement = document.getElementById(image.id);
        imageElement.parentElement.remove();
        //Suppression de l'image dans le DOM
        const imgElementGallery = document.getElementById(figure.id);
        imgElementGallery.remove();
        const MessageSuppression = document.getElementById('MessageAjoutEtSuppression');
        MessageSuppression.innerHTML= 'Image supprimée avec succès !';
        MessageSuppression.classList.remove('invisible');

        console.log("Image " + id + " supprimée avec succès");
        // SupprimerImageChargee();
      })
        form.reset();
        Retour();

      //ajout d'un message dans la galerie modale pour informer l'utilisateur de l'ajout
        const MessageAjout=document.getElementById('MessageAjoutEtSuppression');
        MessageAjout.innerHTML = "Image ajoutée avec succès !";
        MessageAjout.classList.remove('invisible');
    } )
      
    .catch(error => {
        console.error('Erreur de réseau:', error);
      });
});


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
      
      //Masquer les filtres une fois connecté
      const MasquerFiltres = document.querySelector('.Filtres');
      MasquerFiltres.classList.add('invisible');

      //Créer le bandeau Mode Edition
      const ModeEdition = `
      <div class="ModeEdition" onclick="OuvrirModale()">
		  <i class="fa-regular fa-pen-to-square"></i>
		  <p>Mode édition</p>
	    </div>`;

      // Ajoute le code dans la div #ModeEdition pour faire apparaitre le bandeau
      document.getElementById('ModeEdition').innerHTML = ModeEdition;

      //creation modale galerie
      AfficherModaleGalerie(null);
    }
}

