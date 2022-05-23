# Piiquante
# Construisez une API sécurisée pour une application d'avis gastronomiques
Ceci est le projet 6 du parcours développeur web


![AwesomeCourses](https://badgen.net/badge/Project/OpenClassrooms/purple)
![BackEnd](https://badgen.net/badge/Backend/Node.js/green)
![Database](https://badgen.net/badge/Database/MongoDB/green)


## Mission
Le projet consiste à construire une "galerie de sauces" permettant aux utilisateurs de télécharger leurs sauces piquantes préférées et de liker ou disliker les sauces que d'autres partagent.

Perimètre :    
- Le mot de passe de l'utilisateur doit être haché
- L'authentification doit être renforcée sur toutes les routes sauce requises.
- Les adresses électroniques dans la base de données sont uniques et un
plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler
les erreurs.
- La sécurité de la base de données MongoDB (à partir d'un service tel que
MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la
machine d'un utilisateur.
- Un plugin Mongoose doit assurer la remontée des erreurs issues de la base
de données.
- Les versions les plus récentes des logiciels sont utilisées avec des correctifs
de sécurité actualisés.
- Le contenu du dossier images ne doit pas être téléchargé sur GitHub.


## Installation
### 1. Cloner le dépot
Depuis le terminal :
- `git clone https://github.com/Jerome-Baille/JeromeBaille_6_24012022`
- `cd JeromeBaille_6_24012022`

### 2. Initialiser le back-end
- Commencer par vous placer dans le dossier backend avec la commande : `cd backend`
- Créez un dossier images (où serons stockées toutes les images uploader par les utilisateurs): `mkdir images`
- Installer les dépendances : `npm install` 

- Renommer le fichier `.env_example` en `.env` et y renseigner les variables d'environnement suivantes pour faire fonctionner l'application :
ACCESS_TOKEN="<votre access token>"
REFRESH_TOKEN="<votre refresh token>"

- Lancer le serveur back-end : `nodemon server` 

### 3. Installer le front-end
Dans votre terminal et depuis le dossier "JeromeBaille_7_23022022" :
- Exécutez la commande : `cd frontend`
- Puis pour installer les dépendances : `npm install`  