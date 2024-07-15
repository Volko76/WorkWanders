![](/site_main_page.png "site main page")


<details><summary>Version Française</summary>

# WorkWonders
Bienvenue sur le dépot de WorkWonders, un site web open source élégant, performant et intuitif permettant de simplifier l'embauche.

## Présentation
Vous voici dans le dépot du projet de AI16 réalisé par Marin LUET et Paul WACQUET.
Dans le cadre de AI16, nous avons réalisé un site web en NodeJS suivant l'architecture MVC.

Le site web permet de rechercher du boulot et d'y postuler.
On peut également demander à devenir un recruteur (demande qui doit être validée par un admin).
Il y a également un panel admin mais seul un autre admin ou quelqu'un ayant un accès complet à la base de donnée peut définir quelqu'un comme admin.

## Comment déployer le site
1. Clonez ou téléchargez le dépot.
2. Installez [NodeJS](https://nodejs.org/en/download/package-manager).
3. Lancez la commande `npm i` pour installer tous les packets nécéssaires. 
4. Lancez le site web avec la commande `npm start`.
5. Vérifiez que vous êtes bien connecté à Internet et au VPN de l'UTC.
5. Rendez-vous à l'addresse [localhost:3000](localhost:3000) sur votre navigateur web préféré.

## Comptes de test
<details><summary>Candidat</summary>

**Nom de compte :** candidat@test.com

**Mot de passe :** Candidat1!

</details>

<details><summary>Recruteur</summary>

**Nom de compte :** recruteur@test.com

**Mot de passe :** Recruteur1!

**Entreprise de test auquel il appartient :** 999999999999 (Nom TEST)

</details>

<details><summary>Admin</summary>

**Nom de compte :** admin@test.com

**Mot de passe :** Administrateur1!

</details>

## Fonctionnalités de sécurité
<details><summary>1. Prise en charge de ReCaptcha (Intégration de ReCaptcha)</summary>

**Utiles pour :** Empêcher les bots et les scripts automatisés d'accéder au système.

**Fonctionnement :** ReCaptcha génère un test de réponse pour déterminer si l'utilisateur est humain ou un bot. Lorsqu'un utilisateur tente de se connecter, il doit résoudre le défi ReCaptcha pour prouver qu'il est humain.

**Ce qui se passerait si cela n'était pas en place :** Sans ReCaptcha, les bots et les scripts automatisés pourraient facilement forcer leur chemin dans le système, menant à des accès non autorisés et des brèches de sécurité.
</details>
<details><summary>2. Prise en charge d'un nombre variable autorisé de tentatives de connexion (Nombre variable de tentatives de connexion autorisées)</summary>

**Utiles pour :** Empêcher les attaques par force brute sur les comptes utilisateurs.

**Fonctionnement :** Le système définit un nombre limité de tentatives de connexion autorisées dans un certain laps de temps. Si le nombre de tentatives est dépassé, le compte est temporairement verrouillé ou des mesures de sécurité supplémentaires sont déclenchées.

**Ce qui se passerait si cela n'était pas en place :** Sans limite de tentatives de connexion, les attaquants pourraient utiliser des outils automatisés pour essayer rapidement différentes combinaisons de mots de passe, ce qui pourrait leur permettre d'accéder de manière non autorisée aux comptes utilisateurs.
</details>
<details><summary>3. Vérification de la conformité CNIL du mot de passe (Vérification de la conformité CNIL des mots de passe)</summary>

**Utiles pour :** S'assurer que les mots de passe répondent aux normes de sécurité de la CNIL (Commission Nationale de l'Informatique et des Libertés).

**Fonctionnement :** Le système vérifie les mots de passe contre un ensemble de règles et de lignes directrices, telles que la longueur du mot de passe, la complexité et les politiques d'expiration, pour s'assurer qu'ils répondent aux normes de la CNIL.

**Ce qui se passerait si cela n'était pas en place :** Sans vérification de la conformité CNIL, les utilisateurs pourraient choisir des mots de passe faibles ou facilement devinables, ce qui faciliterait l'accès non autorisé à leurs comptes.
</details>
<details><summary>4. Hashage du mot de passe (Hachage des mots de passe)</summary>

**Utiles pour :** Protéger les mots de passe contre l'accès non autorisé en cas de fuite de données et les stocker de manière sécurisée.

**Fonctionnement :** Les mots de passe sont hachés à l'aide d'un algorithme de hachage unidirectionnel, rendant impossible la récupération du mot de passe original. Lorsqu'un utilisateur se connecte, son mot de passe est haché et comparé au hachage stocké.

**Ce qui se passerait si cela n'était pas en place :** Sans hachage des mots de passe, les mots de passe seraient stockés en clair, ce qui faciliterait l'accès non autorisé en cas de fuite de données et les brèches de sécurité.
</details>
<details><summary>5. Protection contre les injections SQL (Protection contre les injections SQL)</summary>

**Utiles pour :** Empêcher les attaquants d'injecter du code SQL malveillant pour accéder ou modifier des données sensibles.

**Fonctionnement :** Le système utilise des instructions préparées et des validations d'entrée pour s'assurer que les données utilisateur sont nettoyées et ne peuvent pas être utilisées pour injecter du code SQL malveillant.

**Ce qui se passerait si cela n'était pas en place :** Sans protection contre les injections SQL, les attaquants pourraient injecter du code SQL malveillant pour accéder ou modifier des données sensibles, menant à des brèches de sécurité et des pertes de données.
</details>
<details><summary>6. Validation des entrées (Validation des entrées HTML)</summary>

**Utiles pour :** Empêcher les attaques XSS (Cross-Site Scripting) et s'assurer que les données utilisateur sont nettoyées.

**Fonctionnement :** Le système utilise la validation HTML pour s'assurer que les données utilisateur sont correctement nettoyées et encodées, empêchant les attaques XSS.

**Ce qui se passerait si cela n'était pas en place :** Sans validation des entrées HTML, les attaquants pourraient injecter du code malveillant, menant à des attaques XSS et des brèches de sécurité.
</details>
<details><summary>7. Session temporaire (30 min) (Session temporaire)</summary>

**Utiles pour :** Limiter la fenêtre d'opportunité pour les attaquants d'exploiter une session volée.

**Fonctionnement :** Le système définit une session temporaire avec une durée de vie limitée (par exemple, 30 minutes), après quoi la session est automatiquement terminée.

**Ce qui se passerait si cela n'était pas en place :** Sans sessions temporaires, les attaquants pourraient utiliser une session volée pour accéder au système indéfiniment, menant à des accès non autorisés et des brèches de sécurité.
</details>
<details><summary>8. HTTPonly pour la session (Cookies de session HTTPOnly)</summary>

**Utiles pour :** Empêcher les attaquants d'accéder aux cookies de session via JavaScript.

**Fonctionnement :** Le système définit les cookies de session avec le drapeau HTTPOnly, les rendant inaccessibles au JavaScript et empêchant les attaques XSS.

**Ce qui se passerait si cela n'était pas en place :** Sans cookies de session HTTPOnly, les attaquants pourraient utiliser des attaques XSS pour voler les cookies de session et accéder au système de manière non autorisée.
</details>
<details><summary>9. Routes sécurisés (Vérification des rôles avant accès) (Routes sécurisées avec contrôle d'accès basé sur les rôles)</summary>

**Utiles pour :** S'assurer que les utilisateurs n'accèdent qu'aux ressources et fonctionnalités autorisées pour leur rôle.

**Fonctionnement :** Le système vérifie le rôle et les autorisations de l'utilisateur avant de lui accorder l'accès à des ressources et fonctionnalités spécifiques.

**Ce qui se passerait si cela n'était pas en place :** Sans routes sécurisées et contrôle d'accès basé sur les rôles, les utilisateurs pourraient accéder à des ressources et fonctionnalités non autorisées, menant à des brèches de sécurité et des pertes de données.
</details>

## Fonctionnalités non implémentés
<details><summary>1. Droit d'accès sur la BDD réduite</summary>
Droit d'accès sur la BDD réduite non fait car nous ne pouvons pas créer de nouveau comptes sur la BDD (car nous utilisons celle qui nous a été fournie par l'UTC). Si nous avions pu, nous aurions créer un nouvel utilisateur avec le strict minimum en terme de permission (juste assez pour que l'appli fonctionne) afin d'augmenter la sécurité au cas où quelqu'un arrive à accèder à ce compte.
</details>

## Conception du livrable
[Diagramme de cas d'utilisation](https://lucid.app/lucidchart/9b498071-9b68-4949-b4c2-f3518345398c/edit?viewport_loc=-1127%2C-223%2C2219%2C1087%2C0_0&invitationId=inv_1f1319d7-3aea-49d4-ad49-c9d91f12c70b)
    

[MCD](https://lucid.app/lucidchart/d1c93a19-e003-4769-93b8-bfcaadb46cf7/edit?viewport_loc=-317%2C-862%2C3020%2C1524%2C0_0&invitationId=inv_efbaf8a4-f7e9-4be2-946b-324f950da0e4)
    

[Carte de navigation du site](https://lucid.app/lucidchart/1b583145-0b6c-4983-a0e7-684b73a27b7a/edit?view_items=TzAjaIdo_pMr&invitationId=inv_b398f5a9-6aad-4add-908a-50226591dbc9)

MLD :
    - [Lucid](https://lucid.app/lucidchart/dd2c1456-eedf-4de7-bcfa-c828214ccc25/edit?viewport_loc=-1854%2C-1062%2C5450%2C2676%2C0_0&invitationId=inv_a8e16c9c-08d9-40c3-b722-a7bd406ad4db)
    - Ou généré par phpMyAdmin :
    ![MLD](/MLD.png "MLD")

[Maquette](https://www.figma.com/file/XiDiKS8qzgltCpJtNPI8OI/Maquette-du-site?type=design&node-id=0%3A1&mode=design&t=zil3ebso6pPTLirr-1)
</details>

<details><summary>English version</summary>

# WorkWonders
Welcome to the WorkWonders repository, an elegant, high-performance, and intuitive open-source website that simplifies the hiring process.

## Presentation
You are now in the repository of the AI16 project, developed by Marin LUET and Paul WACQUET. As part of AI16, we have developed a NodeJS website following the MVC architecture.

The website allows users to search for jobs and apply to them. Users can also request to become a recruiter (subject to validation by an admin). There is also an admin panel, but only another admin or someone with full access to the database can define someone as an admin.

## How to deploy the site
1. Clone or download the repository,
2. Install [NodeJS](https://nodejs.org/en/download/package-manager)
3. Run the command `npm i` to install all necessary packages.
4. Launch the website with the command `npm start`
5. Go to [localhost:3000](localhost:3000) in your preferred web browser.

Here is the translation:

## Security Features
<details><summary>1. ReCaptcha Support (ReCaptcha Integration)</summary>

**Useful for:** Preventing bots and automated scripts from accessing the system.

**How it works:** ReCaptcha generates a response test to determine if the user is human or a bot. When a user attempts to log in, they must solve the ReCaptcha challenge to prove they are human.

**What would happen if this weren't in place:** Without ReCaptcha, bots and automated scripts could easily force their way into the system, leading to unauthorized access and security breaches.
</details>
<details><summary>2. Variable Number of Authorized Login Attempts (Variable Number of Authorized Login Attempts)</summary>

**Useful for:** Preventing brute-force attacks on user accounts.

**How it works:** The system defines a limited number of authorized login attempts within a certain time frame. If the number of attempts is exceeded, the account is temporarily locked or additional security measures are triggered.

**What would happen if this weren't in place:** Without a limit on login attempts, attackers could use automated tools to rapidly try different password combinations, potentially gaining unauthorized access to user accounts.
</details>
<details><summary>3. CNIL Compliance Password Verification (CNIL Compliance Password Verification)</summary>

**Useful for:** Ensuring passwords meet CNIL (Commission Nationale de l'Informatique et des Libertés) security standards.

**How it works:** The system checks passwords against a set of rules and guidelines, such as password length, complexity, and expiration policies, to ensure they meet CNIL standards.

**What would happen if this weren't in place:** Without CNIL compliance verification, users could choose weak or easily guessable passwords, making it easier for unauthorized access to their accounts.
</details>
<details><summary>4. Password Hashing (Password Hashing)</summary>

**Useful for:** Protecting passwords against unauthorized access in case of data breaches and storing them securely.

**How it works:** Passwords are hashed using a one-way hashing algorithm, making it impossible to retrieve the original password. When a user logs in, their password is hashed and compared to the stored hash.

**What would happen if this weren't in place:** Without password hashing, passwords would be stored in plain text, making it easy for unauthorized access in case of data breaches and security breaches.
</details>
<details><summary>5. SQL Injection Protection (SQL Injection Protection)</summary>

**Useful for:** Preventing attackers from injecting malicious SQL code to access or modify sensitive data.

**How it works:** The system uses prepared statements and input validation to ensure user data is cleaned and cannot be used to inject malicious SQL code.

**What would happen if this weren't in place:** Without SQL injection protection, attackers could inject malicious SQL code to access or modify sensitive data, leading to security breaches and data loss.
</details>
<details><summary>6. Input Validation (HTML Input Validation)</summary>

**Useful for:** Preventing XSS (Cross-Site Scripting) attacks and ensuring user data is cleaned.

**How it works:** The system uses HTML validation to ensure user data is properly cleaned and encoded, preventing XSS attacks.

**What would happen if this weren't in place:** Without input validation, attackers could inject malicious code, leading to XSS attacks and security breaches.
</details>
<details><summary>7. Temporary Session (30 minutes) (Temporary Session)</summary>

**Useful for:** Limiting the window of opportunity for attackers to exploit a stolen session.

**How it works:** The system defines a temporary session with a limited lifetime (e.g., 30 minutes), after which the session is automatically terminated.

**What would happen if this weren't in place:** Without temporary sessions, attackers could use a stolen session to access the system indefinitely, leading to unauthorized access and security breaches.
</details>
<details><summary>8. HTTPOnly Session Cookies (HTTPOnly Session Cookies)</summary>

**Useful for:** Preventing attackers from accessing session cookies via JavaScript.

**How it works:** The system sets session cookies with the HTTPOnly flag, making them inaccessible to JavaScript and preventing XSS attacks.

**What would happen if this weren't in place:** Without HTTPOnly session cookies, attackers could use XSS attacks to steal session cookies and gain unauthorized access to the system.
</details>
<details><summary>9. Secure Routes (Role-Based Access Control) (Secure Routes with Role-Based Access Control)</summary>

**Useful for:** Ensuring users only access resources and features authorized for their role.

**How it works:** The system verifies the user's role and permissions before granting access to specific resources and features.

**What would happen if this weren't in place:** Without secure routes and role-based access control, users could access unauthorized resources and features, leading to security breaches and data loss.
</details>

## Unimplemented Features
<details><summary>1. Reduced Database Access Rights</summary>
Reduced database access rights not implemented because we cannot create new accounts on the database (since we are using the one provided by the UTC). If we could, we would have created a new user with minimal permissions (just enough for the app to function) to increase security in case someone gains access to that account.
</details>

## Deliverable design
[Use Case Diagram](https://lucid.app/lucidchart/9b498071-9b68-4949-b4c2-f3518345398c/edit?viewport_loc=-1127%2C-223%2C2219%2C1087%2C0_0&invitationId=inv_1f1319d7-3aea-49d4-ad49-c9d91f12c70b)

[MCD](https://lucid.app/lucidchart/d1c93a19-e003-4769-93b8-bfcaadb46cf7/edit?viewport_loc=-317%2C-862%2C3020%2C1524%2C0_0&invitationId=inv_efbaf8a4-f7e9-4be2-946b-324f950da0e4)

[Site Navigation Map](https://lucid.app/lucidchart/1b583145-0b6c-4983-a0e7-684b73a27b7a/edit?view_items=TzAjaIdo_pMr&invitationId=inv_b398f5a9-6aad-4add-908a-50226591dbc9)

MLD :
    - [Lucid](https://lucid.app/lucidchart/dd2c1456-eedf-4de7-bcfa-c828214ccc25/edit?viewport_loc=-1854%2C-1062%2C5450%2C2676%2C0_0&invitationId=inv_a8e16c9c-08d9-40c3-b722-a7bd406ad4db)
    - Or generated by phpMyAdmin:
    ![MLD](/MLD.png "MLD")

[Mockup](https://www.figma.com/file/XiDiKS8qzgltCpJtNPI8OI/Maquette-du-site?type=design&node-id=0%3A1&mode=design&t=zil3ebso6pPTLirr-1)

</details>