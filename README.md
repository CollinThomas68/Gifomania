# Gifomania

I) Clonez le dépot github.

II) Installation de la partie frontend.
    A) Accédez au contenu du dossier frontend avec votre terminal.
    B) Lancez Npm Install
    C) Lancez Npm run serve

III) Installation de la partie backend.
    A) Création de la base de données :
        1) Accédez depuis l'invite de commande au dossier bin de votre serveur mysql.
        2) Connectez vous y.
        3) Créez votre base de données avec CREATE DATABASE exempledb;

    B) Création du serveur Node
        1) Depuis le terminal accédez au dossier backend.
        2) Lancez Npm Install

    C) Mise en place des infos de connexion à la base de données
        1) Ouvrez le fichier backend/config/config.json
        2) Renseignez les infos nécessaires à la connexion à votre serveur mysql.
        3) ouvrez le fichier .env à la racine du dossier backend.
        4) Renseignez les infos permettant à sequelize de se connecter à votre base de données.
        5) Dans le terminal utilisez la commande sequelize db:migrate
        6) Lancez votre serveur node!

