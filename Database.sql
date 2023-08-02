-- Lancer les commandes l'une à la suite de l'autre

-- création de la base de données
CREATE DATABASE db_pawnation;

-- Création tableau "compte"
CREATE TABLE db_pawnation.compte (
  compte_id INT NOT NULL AUTO_INCREMENT,
  compte_email VARCHAR(255) NOT NULL,
  compte_password VARCHAR(255) NOT NULL,
  compte_type BOOLEAN NOT NULL,
  PRIMARY KEY (compte_id)
);

-- Création tableau "abonnement"
CREATE TABLE db_pawnation.abonnement (
  abonnement_id INT NOT NULL AUTO_INCREMENT,
  abonnement_name VARCHAR(255) NOT NULL,
  abonnement_tarif DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (abonnement_id)
);

INSERT INTO abonnement (abonnement_name, abonnement_tarif) VALUES ('Plan A', 30);
INSERT INTO abonnement (abonnement_name, abonnement_tarif) VALUES ('Plan B', 50);
INSERT INTO abonnement (abonnement_name, abonnement_tarif) VALUES ('Plan C', 75);
INSERT INTO abonnement (abonnement_name, abonnement_tarif) VALUES ('Plan D', 100);

-- Création tableau "veterinaire"
CREATE TABLE db_pawnation.veterinaire (
  veterinaire_id INT NOT NULL AUTO_INCREMENT,
  id_compte INT NOT NULL,
  veterinaire_description VARCHAR(255) NOT NULL,
  veterinaire_tarif DECIMAL(10,2) NOT NULL,
  veterinaire_duree TIME NOT NULL,
  id_abonnement INT,
  abonnement_date_prelevement DATE,
  abonnement_paye BOOLEAN,
  PRIMARY KEY (veterinaire_id),
  FOREIGN KEY (id_compte) REFERENCES db_pawnation.compte(compte_id),
  FOREIGN KEY (id_abonnement) REFERENCES db_pawnation.abonnement(abonnement_id)
);

-- Création tableau "horaire"
CREATE TABLE db_pawnation.horaire (
  id_veterinaire INT NOT NULL,
  horaire_jour INT NOT NULL,
  horaire_etat BOOLEAN NOT NULL,
  horaire_debut TIME NULL DEFAULT NULL,
  horaire_fin TIME NULL DEFAULT NULL,
  FOREIGN KEY (id_veterinaire) REFERENCES db_pawnation.veterinaire(veterinaire_id)
);

-- Création tableau "client"
CREATE TABLE db_pawnation.client (
  client_id INT NOT NULL AUTO_INCREMENT,
  id_compte INT NOT NULL,
  client_animal VARCHAR(255),
  client_code_postal VARCHAR(5) NOT NULL,
  id_veterinaire_favori INT,
  PRIMARY KEY (client_id),
  FOREIGN KEY (id_compte) REFERENCES db_pawnation.compte(compte_id),
  FOREIGN KEY (id_veterinaire_favori) REFERENCES db_pawnation.veterinaire(veterinaire_id)
);

-- Création tableau "rdv"
CREATE TABLE db_pawnation.rdv (
  rdv_id INT NOT NULL AUTO_INCREMENT,
  id_veterinaire INT NOT NULL,
  id_client INT NOT NULL,
  rdv_date_time DATETIME NOT NULL,
  rdv_animal VARCHAR(30),
  PRIMARY KEY (rdv_id),
  FOREIGN KEY (id_veterinaire) REFERENCES db_pawnation.veterinaire(veterinaire_id),
  FOREIGN KEY (id_client) REFERENCES db_pawnation.client(client_id)
);