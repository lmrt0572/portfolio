import type { Project } from "./types";

/**
 * Source unique de vérité des projets. L'ordre du tableau est l'ordre d'affichage.
 * Ajouter un projet = ajouter une entrée ici, rien d'autre.
 */
export const projects: Project[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "camera-ptz",
    featured: true,
    status: "ongoing",
    confidential: true,
    period: { fr: "Depuis 2025", en: "Since 2025" },
    title: {
      fr: "Poursuite automatique sur caméra PTZ",
      en: "Automatic tracking on a PTZ camera",
    },
    tagline: {
      fr: "Détecter, suivre et poursuivre automatiquement des embarcations à l'aide d'un système électro-optique existant.",
      en: "Automatically detecting, tracking and following vessels using an existing electro-optical system.",
    },
    context: { fr: "Thales LAS · Alternance", en: "Thales LAS · Apprenticeship" },
    domain: "computer-vision",
    stack: [
      "Python",
      "PyTorch",
      "RF-DETR",
      "ByteTrack",
      "TensorRT",
      "OpenCV",
      "ONVIF",
      "Qt / QML",
      "Docker",
      "Linux",
    ],
    cover: {
      src: "/images/pocptz.jpg",
      width: 1024,
      height: 559,
      alt: {
        fr: "Caméra PTZ de surveillance maritime",
        en: "Maritime surveillance PTZ camera",
      },
    },
    facts: [
      {
        label: { fr: "Rôle", en: "Role" },
        value: {
          fr: "Alternant ingénieur, conception et réalisation de la chaîne",
          en: "Apprentice engineer, design and build of the pipeline",
        },
      },
      {
        label: { fr: "Cadre", en: "Setting" },
        value: {
          fr: "Preuve de concept en environnement R&D",
          en: "Proof of concept in an R&D environment",
        },
      },
      {
        label: { fr: "Capteur", en: "Sensor" },
        value: {
          fr: "Caméra PTZ, système électro-optique (EOS)",
          en: "PTZ camera, electro-optical system (EOS)",
        },
      },
      {
        label: { fr: "Environnement", en: "Environment" },
        value: {
          fr: "Poste Linux sans accès à Internet",
          en: "Linux machine with no internet access",
        },
      },
    ],
    highlights: {
      fr: [
        "Chaîne complète en boucle fermée : acquisition, détection, suivi, commande de la caméra",
        "Détecteur de la famille DETR entraîné sur un jeu d'images du site",
        "Suivi multi-cibles par ByteTrack associé à un filtre de Kalman",
        "Domaine d'emploi établi par la mesure, limites comprises",
      ],
      en: [
        "Full closed-loop pipeline: capture, detection, tracking, camera control",
        "A DETR-family detector trained on an image set from the site itself",
        "Multi-target tracking with ByteTrack and a Kalman filter",
        "Operating envelope established by measurement, limits included",
      ],
    },
    pipeline: [
      {
        id: "capture",
        title: { fr: "Acquisition", en: "Capture" },
        body: {
          fr: "La caméra diffuse sa vidéo en RTSP. Le flux est décodé en continu, puis préparé pour l'inférence. Un décodeur unique alimente à la fois l'affichage et l'analyse : avec deux, l'opérateur verrait une image légèrement différente de celle que le système traite, ce qui pose problème au moment de désigner une cible en cliquant dessus.",
          en: "The camera streams over RTSP. The stream is decoded continuously, then prepared for inference. A single decoder feeds both the display and the analysis: with two, the operator would see a slightly different frame from the one the system processes, which matters when designating a target by clicking on it.",
        },
      },
      {
        id: "detect",
        title: { fr: "Détection", en: "Detection" },
        body: {
          fr: "Un détecteur RF-DETR localise les embarcations, du cargo au jet-ski. Cette famille produit d'emblée un nombre fixe de prédictions, ce qui supprime l'étape de suppression des doublons dont dépendent les détecteurs à ancres. Le modèle est entraîné sur des images du site, annotées sous CVAT installé en local, et l'inférence est ensuite compilée avec TensorRT pour tenir le temps réel.",
          en: "An RF-DETR detector locates the vessels, from cargo ship to jet ski. This family emits a fixed number of predictions outright, removing the duplicate-suppression step that anchor-based detectors depend on. The model is trained on imagery from the site, annotated in a locally hosted CVAT, and inference is then compiled with TensorRT to hold real time.",
        },
      },
      {
        id: "track",
        title: { fr: "Suivi", en: "Tracking" },
        body: {
          fr: "ByteTrack prédit où chaque cible devrait se trouver grâce à un filtre de Kalman, puis associe les nouvelles détections aux pistes existantes. Le filtre rend un second service : la boîte de détection tremble d'une image à l'autre même sur une cible immobile, et le lissage donne à l'asservissement une consigne stable plutôt qu'une consigne qui vibre.",
          en: "ByteTrack predicts where each target should be using a Kalman filter, then matches new detections to existing tracks. The filter renders a second service: the detection box jitters between frames even on a stationary target, and smoothing gives the control loop a steady set-point rather than a vibrating one.",
        },
      },
      {
        id: "servo",
        title: { fr: "Asservissement", en: "Camera control" },
        body: {
          fr: "L'écart entre la cible et le centre de l'image devient une vitesse de rotation, envoyée à la caméra via ONVIF en mode continu. Deux difficultés s'ajoutent au régulateur proportionnel de départ : le gain dépend du zoom, un réglage valable au grand-angle rendant le système instable au téléobjectif ; et la boucle comporte un retard, puisque le régulateur agit toujours sur une information déjà périmée.",
          en: "The offset between target and frame centre becomes a rotation speed, sent to the camera over ONVIF in continuous mode. Two difficulties compound the initial proportional controller: gain depends on zoom, a setting valid at wide angle making the system unstable at full telephoto; and the loop carries a delay, since the controller always acts on information that is already out of date.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "La surveillance côtière consiste à repérer les embarcations qui circulent dans une zone et à les garder à l'œil. Sur les sites équipés, cette veille s'appuie notamment sur des caméras motorisées longue portée, que l'opérateur pilote à la main depuis un poste de supervision. Cependant, cette conduite manuelle mobilise un opérateur par caméra, repose sur une vigilance que la fatigue érode, et ne laisse aucune trace exploitable de ce qui a été observé. Ma mission consiste à déterminer si cette veille peut être confiée à une chaîne de traitement automatique, sur le matériel déjà installé, sans dégrader la qualité d'observation attendue par l'opérateur.",
          en: "Coastal surveillance means spotting the vessels moving through an area and keeping an eye on them. On equipped sites this watch relies on long-range motorised cameras, which an operator steers by hand from a supervision desk. That manual approach, however, ties up one operator per camera, depends on sustained attention that fatigue erodes, and leaves no usable record of what was observed. My assignment is to determine whether this watch can be handed to an automatic processing chain, on the hardware already installed, without degrading the quality of observation the operator expects.",
        },
      },
      {
        id: "difficulty",
        title: {
          fr: "Pourquoi la mer est un cas difficile",
          en: "Why the sea is a hard case",
        },
        body: {
          fr: "La détection sur une scène maritime ne ressemble pas à de la détection sur route ou en intérieur. Le fond n'est jamais deux fois le même, et plusieurs difficultés se cumulent.",
          en: "Detection on a maritime scene is nothing like detection on roads or indoors. The background is never the same twice, and several difficulties compound.",
        },
        bullets: {
          fr: [
            "La houle crée des motifs qui bougent en permanence sans jamais constituer un objet",
            "Une même classe d'embarcation occupe quelques pixels au loin et une bonne partie de l'image à courte distance",
            "Les conditions de lumière varient fortement : contre-jour, brume, pluie, crépuscule",
            "Le zoom modifie la perception du mouvement, ce qui interdit un réglage unique de la commande",
            "La définition de la vidéo reste limitée au regard des distances observées",
          ],
          en: [
            "Swell creates patterns that move constantly without ever forming an object",
            "The same class of vessel takes a few pixels far off and much of the frame close in",
            "Lighting varies widely: backlight, haze, rain, dusk",
            "Zoom changes how motion is perceived, which rules out a single control setting",
            "Video definition stays limited given the distances observed",
          ],
        },
      },
      {
        id: "choices",
        title: { fr: "Les choix techniques", en: "Technical choices" },
        body: {
          fr: "Trois critères ont guidé la sélection de chaque brique, fixés avant toute comparaison : voir des cibles minuscules, tenir le temps réel sur le matériel disponible, et pouvoir être intégré dans un produit. Le troisième s'est révélé le plus discriminant.",
          en: "Three criteria guided the choice of every building block, set before any comparison: see tiny targets, hold real time on the available hardware, and be integrable into a product. The third proved the most discriminating.",
        },
        bullets: {
          fr: [
            "La famille DETR plutôt que les détecteurs à ancres : elle évite le filtrage des doublons, dont un réglage trop sévère fusionne une bouée et une embarcation alignées, et trop permissif laisse passer des redondances",
            "RF-DETR s'appuie sur un extracteur pré-entraîné sans annotations, ce qui lui demande beaucoup moins d'exemples pour s'adapter à un jeu d'images constitué en quelques semaines",
            "ByteTrack conserve les détections de faible score pour une seconde tentative d'association : quand une petite embarcation s'éloigne et que son score chute, sa trajectoire survit au lieu d'être coupée",
            "La licence a pesé autant que la performance. Certaines briques plus efficaces sur le papier obligeraient à publier le code de tout produit les intégrant, ce qui est rédhibitoire pour une preuve de concept destinée à devenir un produit. Toutes celles retenues sont sous licence permissive",
            "ONVIF pour la commande, parce que c'est un standard : le système fonctionnera avec d'autres caméras que celle installée",
          ],
          en: [
            "The DETR family rather than anchor-based detectors: it avoids duplicate filtering, where too strict a setting merges an aligned buoy and vessel, and too permissive a one lets redundancies through",
            "RF-DETR builds on a backbone pre-trained without annotations, which means it needs far fewer examples to adapt to an image set assembled in a few weeks",
            "ByteTrack keeps low-score detections for a second association attempt: when a small vessel moves away and its score drops, its track survives instead of being cut",
            "Licensing weighed as much as performance. Some blocks that are stronger on paper would force publishing the source of any product embedding them, which is disqualifying for a proof of concept meant to become a product. Every block retained carries a permissive licence",
            "ONVIF for camera control, because it is a standard: the system will work with cameras other than the one installed",
          ],
        },
      },
      {
        id: "results",
        title: {
          fr: "Ce que le système fait, et où il s'arrête",
          en: "What the system does, and where it stops",
        },
        body: {
          fr: "Les essais menés en conditions réelles montrent que le système peut faire de la détection multi-cible, poursuit une embarcation de taille normale pendant plusieurs minutes, en temps réel, sans dégrader l'image présentée à l'opérateur. Cependant, il décroche sur les cibles les plus petites et les plus rapides. Le domaine d'emploi est donc connu, ce qui vaut mieux qu'un système dont on ignore à partir de quand il cesse de fonctionner.",
          en: "Field trials show the system can do multi-target detection,follows a normal-sized vessel for several minutes, in real time, without degrading the image shown to the operator. It does, however, lose the smallest and fastest targets. The operating envelope is therefore known, which is worth more than a system whose point of failure is a mystery.",
        },
      },
      {
        id: "finding",
        title: {
          fr: "Trouver le maillon faible",
          en: "Finding the weak link",
        },
        body: {
          fr: "Le système décroche sur les cibles petites et rapides, mais lequel des trois maillons en est responsable : la détection, le suivi ou la commande ? La question décide de l'endroit où porter l'effort suivant. Pour la trancher, j'ai comparé les enregistrements des poursuites réussies et de celles qui ont échoué, sur deux mesures : le nombre d'images où la cible n'est pas détectée, et l'écart moyen entre la cible et le centre de l'image. Le lien apparaît sur la première, pas sur la seconde. Autrement dit, quand la cible est détectée, la caméra vise juste ; ce sont les instants où elle ne l'est pas qui hachent la poursuite. C'est donc la disponibilité de la détection qui limite le système, et l'effort est passé du réglage du régulateur à l'amélioration du détecteur.",
          en: "The system loses small, fast targets, but which of the three links is responsible: detection, tracking or control? The answer decides where the next effort goes. To settle it, I compared recordings of successful pursuits with failed ones on two measures: the number of frames where the target goes undetected, and the average offset between target and frame centre. The correlation shows up on the first, not the second. In other words, when the target is detected the camera aims true; it is the moments when it is not that break up the pursuit. Detection availability is therefore what limits the system, and the effort moved from tuning the controller to improving the detector.",
        },
        bullets: {
          fr: [
            "L'enregistrement des sessions permet de rejouer la même scène avec deux réglages différents. La mer et la lumière n'étant jamais deux fois les mêmes, une comparaison faite en direct ne prouverait rien",
            "Un banc de réglage intégré à l'application modifie un paramètre sans redémarrer.",
            "Sans ces deux outils, le constat serait resté une impression",
          ],
          en: [
            "Session recording makes it possible to replay the same scene with two different settings. Since sea and light are never the same twice, a live comparison would prove nothing",
            "A tuning bench built into the application changes a parameter without restarting.",
            "Without those two tools the finding would have stayed an impression",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Mesurer avant de décider : sans protocole d'essai reproductible, on optimise ce que l'on sait mesurer plutôt que ce qui limite réellement",
            "La chaîne de vision complète, de la constitution du jeu d'images au déploiement d'un moteur d'inférence optimisé",
            "Des bases d'automatique acquises sur le terrain, en concevant une boucle qui doit rester stable malgré son retard",
            "Un critère que je n'avais jamais considéré : la licence, qui peut rendre inutilisable une bibliothèque performante",
            "Le conditionnement d'une application pour un poste isolé, où rien ne peut être téléchargé à l'installation",
          ],
          en: [
            "Measure before deciding: without a reproducible test protocol you optimise what you can measure rather than what actually limits you",
            "The full vision pipeline, from building the image set to deploying an optimised inference engine",
            "Control-theory basics learned in the field, designing a loop that must stay stable despite its own delay",
            "A criterion I had never considered: licensing, which can make a high-performing library unusable",
            "Packaging an application for an isolated machine, where nothing can be downloaded at install time",
          ],
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "breezy",
    featured: true,
    status: "shipped",
    period: { fr: "2026", en: "2026" },
    title: "Breezy",
    tagline: {
      fr: "Réseau social inspiré de X, découpé en six services indépendants derrière une passerelle unique.",
      en: "An X-like social network split into six independent services behind a single gateway.",
    },
    context: {
      fr: "CESI · Applications distribuées · Projet d'équipe",
      en: "CESI · Distributed applications · Team project",
    },
    domain: "web",
    stack: [
      "Node.js",
      "Express",
      "Next.js",
      "React",
      "PostgreSQL",
      "MongoDB",
      "RabbitMQ",
      "Socket.IO",
      "Nginx",
      "Docker",
      "JWT",
    ],
    repo: "https://github.com/DAD-groupe-6/Breezy",
    // Visuel d'illustration en attendant une capture de l'application.
    cover: {
      src: "/images/breezy-cover.jpg",
      width: 1376,
      height: 768,
      alt: { fr: "Illustration : services en réseau", en: "Illustration: networked services" },
    },
    facts: [
      {
        label: { fr: "Rôle", en: "Role" },
        value: {
          fr: "Interface, service Post, service Notification",
          en: "Front end, Post service, Notification service",
        },
      },
      {
        label: { fr: "Équipe", en: "Team" },
        value: { fr: "4 développeurs, 417 commits", en: "4 developers, 417 commits" },
      },
      {
        label: { fr: "Services", en: "Services" },
        value: {
          fr: "6 microservices + passerelle + interface",
          en: "6 microservices + gateway + front end",
        },
      },
      {
        label: { fr: "Bases", en: "Databases" },
        value: { fr: "2 PostgreSQL, 4 MongoDB", en: "2 PostgreSQL, 4 MongoDB" },
      },
    ],
    highlights: {
      fr: [
        "Six services indépendants, chacun avec sa base, derrière une passerelle Nginx unique",
        "Deux moteurs de base selon le besoin : relationnel pour les identités, documents pour les contenus",
        "Bus d'événements RabbitMQ : publier un post ne dépend pas du service de notification",
        "Temps réel par WebSocket pour la messagerie et les notifications",
      ],
      en: [
        "Six independent services, each with its own database, behind a single Nginx gateway",
        "Two database engines by need: relational for identities, documents for content",
        "RabbitMQ event bus: publishing a post does not depend on the notification service",
        "Real-time WebSockets for direct messages and notifications",
      ],
    },
    video: {
      // Version réencodée avec l'index en tête : démarrage sans télécharger
      // tout le fichier.
      mp4: "/videos/breezy-demo.mp4",
      poster: "/images/breezy-poster.jpg",
      // Rapport exact de l'enregistrement, pour éviter les bandes noires.
      aspect: "1280 / 750",
      caption: {
        fr: "Démonstration : publication d'un post, notification reçue en temps réel par un autre compte, messagerie privée.",
        en: "Walkthrough: publishing a post, another account receiving the notification live, direct messaging.",
      },
    },
    pipeline: [
      {
        id: "gateway",
        title: { fr: "Une seule porte d'entrée", en: "A single front door" },
        body: {
          fr: "Tout passe par une passerelle Nginx sur le port 80 : l'interface comme les API. Elle porte ce qui n'a pas à être réécrit dans six services, la politique CORS, avec une liste d'origines autorisées, et la limitation de débit, réglée à 30 requêtes par seconde en général mais à 2 sur la connexion et l'inscription, là où on tente les mots de passe.",
          en: "Everything goes through an Nginx gateway on port 80: the interface as well as the APIs. It carries what should not be rewritten in six services, the CORS policy, with an allowlist of origins, and rate limiting, set to 30 requests per second in general but 2 on login and registration, where passwords get guessed.",
        },
      },
      {
        id: "auth",
        title: { fr: "Prouver qui l'on est", en: "Proving who you are" },
        body: {
          fr: "Le service Auth vérifie le mot de passe, haché avec bcrypt, et signe un JWT. Pour les pages protégées, la passerelle ne devine rien : elle sous-traite la validation au service Auth avant de servir la page. Chaque service métier revérifie ensuite le jeton de son côté, aucun ne fait confiance à son appelant.",
          en: "The Auth service checks the password, hashed with bcrypt, and signs a JWT. For protected pages the gateway guesses nothing: it delegates validation to the Auth service before serving the page. Each business service then re-checks the token on its own, none of them trusts its caller.",
        },
      },
      {
        id: "domain",
        title: { fr: "Le service concerné répond", en: "The relevant service answers" },
        body: {
          fr: "Six domaines, six services, six bases : Auth et User sur PostgreSQL, Post, Message, Media et Notification sur MongoDB. Un domaine qui tombe n'emporte pas les autres, un service Média indisponible empêche d'ajouter une image, pas de lire le flux.",
          en: "Six domains, six services, six databases: Auth and User on PostgreSQL, Post, Message, Media and Notification on MongoDB. A domain going down does not take the others with it, an unavailable Media service stops image uploads, not feed reading.",
        },
      },
      {
        id: "events",
        title: { fr: "L'événement se propage", en: "The event propagates" },
        body: {
          fr: "Quand un post est publié ou aimé, le service Post ne prévient pas le service Notification : il dépose un événement dans RabbitMQ et passe à la suite. Notification le consomme de son côté. Les deux services n'ont donc besoin ni de se connaître, ni d'être debout en même temps.",
          en: "When a post is published or liked, the Post service does not call the Notification service: it drops an event onto RabbitMQ and moves on. Notification consumes it in its own time. Neither service needs to know the other, or to be up at the same moment.",
        },
      },
      {
        id: "realtime",
        title: { fr: "L'écran se met à jour", en: "The screen updates" },
        body: {
          fr: "Notification et Message tiennent chacun une connexion WebSocket ouverte vers le navigateur. La notification apparaît sans rechargement, le message privé arrive pendant qu'on écrit, sans que l'interface ait à interroger le serveur en boucle.",
          en: "Notification and Message each hold an open WebSocket to the browser. The notification shows up with no reload, the direct message arrives while you type, without the interface polling the server in a loop.",
        },
      },
    ],
    sections: [
      {
        id: "product",
        title: { fr: "Ce que fait l'application", en: "What the application does" },
        body: {
          fr: "Breezy fait ce qu'on attend d'un réseau social court : publier des posts et y répondre, aimer, suivre des comptes, chercher par contenu ou par tag, joindre images et vidéos, s'écrire en privé, recevoir des notifications. Les droits sont portés par quatre rôles, visiteur, utilisateur, modérateur, administrateur, et une vingtaine de permissions nommées, ce qui permet d'activer ou de couper une fonctionnalité sans toucher au code.",
          en: "Breezy does what a short-form social network is expected to do: publish posts and reply to them, like, follow accounts, search by content or tag, attach images and video, message privately, receive notifications. Rights are carried by four roles, visitor, user, moderator, administrator, and around twenty named permissions, which makes it possible to switch a feature on or off without touching the code.",
        },
      },
      {
        id: "context",
        title: { fr: "La contrainte du module", en: "The module's constraint" },
        body: {
          fr: "Le sujet imposait une architecture réellement distribuée, pas un monolithe déguisé en services. La difficulté n'est pas d'écrire six serveurs Express : c'est de choisir où passent les frontières, puis d'assumer ce que ce découpage coûte, une requête qui traverse trois processus, un état qui n'est plus partagé, des services qui démarrent dans le désordre.",
          en: "The brief called for a genuinely distributed architecture, not a monolith dressed up as services. The hard part is not writing six Express servers: it is choosing where the boundaries fall, then living with what that split costs, a request crossing three processes, state that is no longer shared, services starting in any order.",
        },
      },
      {
        id: "databases",
        title: {
          fr: "Pourquoi deux moteurs de base",
          en: "Why two database engines",
        },
        body: {
          fr: "Le choix n'est pas décoratif, il suit la forme de la donnée.",
          en: "The choice is not decorative; it follows the shape of the data.",
        },
        bullets: {
          fr: [
            "PostgreSQL pour Auth et User : des comptes, des rôles, des permissions et des relations de suivi, des tables, des clés étrangères et des contraintes d'unicité, exactement ce qu'un moteur relationnel garantit mieux que du code applicatif",
            "MongoDB pour Post, Message, Media et Notification : des documents qui varient d'un cas à l'autre, un post avec ou sans média, avec ou sans réponses, et qu'on lit presque toujours en entier",
            "Chaque service possède sa base et personne d'autre n'y touche : c'est cette règle, plus que le découpage du code, qui rend les services réellement indépendants",
          ],
          en: [
            "PostgreSQL for Auth and User: accounts, roles, permissions and follow relations, tables, foreign keys and uniqueness constraints, exactly what a relational engine guarantees better than application code",
            "MongoDB for Post, Message, Media and Notification: documents that vary case by case, a post with or without media, with or without replies, and that are almost always read whole",
            "Each service owns its database and nobody else touches it: that rule, more than the code split, is what makes the services genuinely independent",
          ],
        },
      },
      {
        id: "gateway-detail",
        title: {
          fr: "La passerelle ne fait pas que router",
          en: "The gateway does more than route",
        },
        bullets: {
          fr: [
            "Elle résout les noms des services à chaque requête plutôt qu'au démarrage : sans ça, un service encore en train de démarrer reste introuvable jusqu'au redémarrage de la passerelle",
            "Elle applique un débit maximal différent selon la route, une limite globale, et une limite bien plus basse sur connexion et inscription",
            "Elle centralise la politique CORS : une origine non autorisée ne reçoit aucun en-tête et se fait bloquer par le navigateur",
            "Elle délègue la validation des jetons au service Auth pour les pages protégées, au lieu de reproduire une logique de sécurité dans la configuration",
          ],
          en: [
            "It resolves service names on every request rather than at startup: without that, a service still booting stays unreachable until the gateway restarts",
            "It applies a different rate cap per route, a global limit, and a far lower one on login and registration",
            "It centralises the CORS policy: an unauthorised origin gets no headers at all and is blocked by the browser",
            "It delegates token validation to the Auth service for protected pages, instead of duplicating security logic in configuration",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Découper un domaine en services : où placer les frontières, et le coût de se tromper",
            "L'asynchrone n'est pas un détail d'implémentation, passer par un bus change qui dépend de qui",
            "Un environnement complet reproductible en une commande, base de données et bus compris",
            "Travail à quatre sur un dépôt commun, avec revue de code et branches de fonctionnalité",
          ],
          en: [
            "Splitting a domain into services: where to draw boundaries, and the cost of getting it wrong",
            "Asynchrony is not an implementation detail, going through a bus changes who depends on whom",
            "A complete environment reproducible with one command, databases and message bus included",
            "Working as a team of four on a shared repository, with code review and feature branches",
          ],
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "easysave",
    featured: true,
    status: "shipped",
    period: { fr: "2025 – 2026", en: "2025 – 2026" },
    title: "EasySave",
    tagline: {
      fr: "Logiciel de sauvegarde .NET livré en trois versions, de la console au tableau de bord temps réel.",
      en: "A .NET backup tool delivered across three releases, from console app to real-time dashboard.",
    },
    context: {
      fr: "CESI · Génie logiciel · Projet d'équipe",
      en: "CESI · Software engineering · Team project",
    },
    domain: "software",
    stack: ["C#", ".NET 10", "WPF", "MVVM", "Tâches parallèles", "Docker", "JSON / XML"],
    repo: "https://github.com/lmrt0572/EasySave",
    // Illustration générée (barres grises, pas de texte), pas une capture réelle.
    cover: {
      src: "/images/easysave-cover.jpg",
      width: 1376,
      height: 768,
      alt: {
        fr: "Illustration : tableau de bord de sauvegarde",
        en: "Illustration: backup dashboard",
    },
    },
    facts: [
      {
        label: { fr: "Commanditaire", en: "Client" },
        value: {
          fr: "ProSoft, éditeur fictif du cahier des charges",
          en: "ProSoft, the fictional client of the brief",
        },
      },
      {
        label: { fr: "Équipe", en: "Team" },
        value: { fr: "3 développeurs", en: "3 developers" },
      },
      {
        label: { fr: "Livraisons", en: "Releases" },
        value: {
          fr: "v1 console → v2 WPF → v3 parallèle",
          en: "v1 console → v2 WPF → v3 parallel",
        },
      },
      {
        label: { fr: "Cible", en: "Target" },
        value: { fr: "Windows 10/11, .NET 10", en: "Windows 10/11, .NET 10" },
      },
    ],
    highlights: {
      fr: [
        "Trois livraisons successives sur une même base de code",
        "Tous les travaux s'exécutent en parallèle, avec Play / Pause / Stop par travail",
        "Règles inter-travaux : fichiers prioritaires, un seul fichier volumineux à la fois",
        "Journalisation JSON ou XML, en local et vers un service Docker",
      ],
      en: [
        "Three successive releases on a single codebase",
        "All jobs run in parallel, with per-job play / pause / stop",
        "Cross-job rules: priority files, one large file at a time",
        "JSON or XML logging, locally and to a Docker service",
      ],
    },
    documents: [
      {
        href: "/documents/EasySave_v3_Documentation_Technique.pdf",
        label: {
          fr: "Documentation technique v3",
          en: "v3 technical documentation",
        },
      },
    ],
    video: {
      mp4: "/videos/easysave-demo.mp4",
      poster: "/images/easysave-cover.jpg",
      aspect: "16 / 9",
      caption: {
        fr: "Démonstration : trois travaux lancés en parallèle, mise en pause de l'un d'eux, reprise et journal des opérations.",
        en: "Walkthrough: three jobs running in parallel, one paused, resumed, and the operation log.",
      },
    },
    pipeline: [
      {
        id: "configure",
        title: { fr: "Définir un travail", en: "Define a job" },
        body: {
          fr: "Un travail de sauvegarde tient en trois informations : un dossier source, un dossier cible, et un type, complet, ou différentiel. La liste des travaux est enregistrée dans un fichier de configuration, avec les extensions à chiffrer, celles déclarées prioritaires, le seuil de taille au-delà duquel un fichier est considéré comme volumineux, et le nom du logiciel métier à surveiller.",
          en: "A backup job is three pieces of information: a source folder, a target folder, and a type, full or differential. The job list lives in a configuration file, along with the extensions to encrypt, those declared as priority, the size threshold above which a file counts as large, and the name of the business software to watch for.",
        },
      },
      {
        id: "scan",
        title: { fr: "Parcourir et comparer", en: "Scan and compare" },
        body: {
          fr: "L'arborescence source est parcourue en entier. En sauvegarde complète, tout est retenu ; en différentielle, chaque fichier est comparé à son équivalent dans la cible et n'est retenu que s'il a changé. Les deux comportements sont deux stratégies interchangeables derrière la même interface, c'est ce qui permet d'ajouter un mode sans toucher au moteur.",
          en: "The whole source tree is walked. In a full backup everything is kept; in a differential one, each file is compared with its counterpart in the target and kept only if it changed. The two behaviours are interchangeable strategies behind one interface, which is what makes adding a mode possible without touching the engine.",
        },
      },
      {
        id: "copy",
        title: { fr: "Copier", en: "Copy" },
        body: {
          fr: "Les fichiers retenus sont copiés un par un, et c'est là que les règles s'appliquent : un fichier ordinaire attend qu'aucun fichier prioritaire ne soit en file, tous travaux confondus ; un fichier volumineux attend son tour pour ne pas saturer le réseau. La progression de chaque travail remonte à l'interface pendant la copie, pas à la fin.",
          en: "Selected files are copied one by one, and this is where the rules apply: an ordinary file waits until no priority file is queued anywhere across all jobs; a large file waits its turn so the network is not saturated. Each job's progress reaches the interface during the copy, not at the end.",
        },
      },
      {
        id: "encrypt",
        title: { fr: "Chiffrer", en: "Encrypt" },
        body: {
          fr: "Les fichiers dont l'extension figure dans la configuration sont passés à CryptoSoft, un exécutable séparé qui applique un chiffrement par XOR. Il ne peut s'exécuter qu'en un seul exemplaire à la fois sur la machine, contrainte du cahier des charges, obtenue par un verrou nommé au niveau du système et non du processus.",
          en: "Files whose extension appears in the configuration are handed to CryptoSoft, a separate executable applying XOR encryption. Only one instance may run at a time on the machine, a requirement of the brief, enforced by a named lock at system level rather than process level.",
        },
      },
      {
        id: "log",
        title: { fr: "Journaliser", en: "Log" },
        body: {
          fr: "Chaque fichier traité produit une ligne de journal : horodatage, chemins source et cible, taille, durée de transfert, durée de chiffrement. Le journal est écrit au format JSON ou XML au choix, en local, vers un service de centralisation conteneurisé, ou les deux. Un fichier d'état séparé décrit en continu ce que fait chaque travail, ce qui rend l'exécution observable de l'extérieur.",
          en: "Every processed file produces a log line: timestamp, source and target paths, size, transfer time, encryption time. The log is written as JSON or XML, locally, to a containerised collection service, or both. A separate state file continuously describes what each job is doing, making execution observable from outside.",
        },
      },
    ],
    sections: [
      {
        id: "product",
        title: { fr: "Ce que fait le logiciel", en: "What the software does" },
        body: {
          fr: "EasySave sauvegarde des dossiers, sur demande ou avant une opération risquée. L'utilisateur déclare des travaux, les lance depuis un tableau de bord, et suit leur avancement fichier par fichier. Certaines extensions sont chiffrées au passage, tout est journalisé, et le logiciel s'interrompt de lui-même si l'application métier de l'entreprise démarre, parce qu'une sauvegarde n'a pas à ralentir le travail de quelqu'un.",
          en: "EasySave backs up folders, on demand or before a risky operation. The user declares jobs, launches them from a dashboard, and follows their progress file by file. Some extensions get encrypted along the way, everything is logged, and the software pauses itself if the company's business application starts, because a backup has no business slowing someone down.",
        },
      },
      {
        id: "context",
        title: { fr: "La contrainte du module", en: "The module's constraint" },
        body: {
          fr: "Le sujet imposait une contrainte plus intéressante que le produit : livrer trois versions successives pour un éditeur fictif, ProSoft, en faisant évoluer l'architecture à chaque itération sans réécrire depuis zéro. Chaque version arrivait avec son propre cahier des charges, découvert seulement une fois la précédente livrée, donc impossible d'anticiper en concevant tout d'avance.",
          en: "The brief imposed a constraint more interesting than the product: deliver three successive versions for a fictional client, ProSoft, evolving the architecture at each iteration without rewriting from scratch. Each version came with its own requirements, revealed only once the previous one had shipped, so designing everything upfront was not an option.",
        },
      },
      {
        id: "versions",
        title: { fr: "Les trois versions", en: "The three releases" },
        body: {
          fr: "Ce qui change d'une version à l'autre n'est pas la quantité de fonctionnalités mais l'endroit où vit le code.",
          en: "What changes from one release to the next is not the amount of features but where the code lives.",
        },
        bullets: {
          fr: [
            "v1, console, le moteur : parcours des dossiers, sauvegarde complète ou différentielle, chiffrement par extension, journal quotidien, fichier d'état, interface en français et en anglais. Cinq travaux maximum, exécutés à la suite.",
            "v2, interface graphique, le moteur est extrait dans une bibliothèque partagée par la console et la nouvelle fenêtre WPF, construite en MVVM. La vue ne connaît plus la logique, la journalisation devient un composant à part avec JSON et XML au choix, et le nombre de travaux n'est plus limité.",
            "v3, tableau de bord, tous les travaux s'exécutent en même temps, chacun pilotable individuellement ou tous ensemble, avec les règles qui deviennent nécessaires dès qu'on ne s'exécute plus à la file. Les journaux peuvent partir vers un service conteneurisé.",
          ],
          en: [
            "v1, console, the engine: folder walking, full or differential backup, per-extension encryption, daily log, state file, French and English interface. Five jobs maximum, run one after another.",
            "v2, graphical interface, the engine is extracted into a library shared by the console and the new WPF window, built in MVVM. The view no longer knows the logic, logging becomes a separate component with JSON or XML, and the job limit disappears.",
            "v3, dashboard, every job runs at once, each controllable individually or all together, with the rules that become necessary as soon as things stop running in single file. Logs can be sent to a containerised service.",
          ],
        },
      },
      {
        id: "architecture",
        title: { fr: "Comment c'est découpé", en: "How it is split up" },
        body: {
          fr: "La solution compte sept projets, et ce découpage est le vrai livrable du module : c'est lui qui a permis d'absorber trois cahiers des charges successifs.",
          en: "The solution holds seven projects, and that split is the module's real deliverable: it is what absorbed three successive sets of requirements.",
        },
        bullets: {
          fr: [
            "Core, modèles, services, stratégies de sauvegarde et ViewModels : tout ce qui ne dépend d'aucune interface",
            "Console et WPF, deux interfaces sur le même moteur, la seconde ajoutée sans modifier la première",
            "EasyLog, journalisation isolée, avec une stratégie par format d'écriture",
            "CryptoSoft, exécutable de chiffrement séparé, appelé comme un outil externe",
            "LogServer, petite API conteneurisée qui reçoit les journaux de plusieurs postes",
            "Tests, unitaires et d'intégration sur le moteur",
          ],
          en: [
            "Core, models, services, backup strategies and ViewModels: everything that depends on no interface",
            "Console and WPF, two front ends on the same engine, the second added without touching the first",
            "EasyLog, logging kept separate, with one strategy per output format",
            "CryptoSoft, standalone encryption executable, called as an external tool",
            "LogServer, a small containerised API collecting logs from several machines",
            "Tests, unit and integration tests on the engine",
          ],
        },
      },
      {
        id: "parallel",
        title: {
          fr: "Ce que le parallélisme a vraiment coûté",
          en: "What parallelism actually cost",
        },
        body: {
          fr: "Passer du séquentiel au parallèle ne consiste pas à lancer les travaux en même temps : c'est le moment où des règles qui allaient de soi doivent être écrites explicitement, parce que plus personne n'attend son tour.",
          en: "Going from sequential to parallel is not about launching jobs at the same time: it is the moment when rules that used to be implicit have to be written down, because nothing waits its turn any more.",
        },
        bullets: {
          fr: [
            "Chaque travail tourne dans sa propre tâche, avec son jeton d'annulation pour l'arrêt et son signal d'attente pour la pause, qui ne prend effet qu'à la fin du fichier en cours, sinon on laisse une copie à moitié écrite",
            "Les fichiers prioritaires sont arbitrés par un coordinateur partagé entre tous les travaux : aucun fichier ordinaire ne démarre tant qu'une extension prioritaire reste en attente, quel que soit le travail qui la détient",
            "La bande passante est protégée par un sémaphore global : au-delà d'un seuil paramétrable, un seul fichier volumineux circule à la fois",
            "L'outil de chiffrement est verrouillé par un mutex système nommé, donc unique à l'échelle de la machine et pas seulement du processus",
            "Une pause automatique se déclenche si le logiciel métier du client est détecté, avec reprise à sa fermeture",
          ],
          en: [
            "Each job runs in its own task, with a cancellation token for stop and a wait handle for pause, which only takes effect once the current file is done, otherwise you leave a half-written copy behind",
            "Priority files are arbitrated by a coordinator shared across every job: no ordinary file starts while a priority extension is still queued, whichever job holds it",
            "Bandwidth is protected by a global semaphore: past a configurable threshold, only one large file moves at a time",
            "The encryption tool is guarded by a named system mutex, making it unique machine-wide rather than merely process-wide",
            "An automatic pause triggers if the client's business software is detected, resuming when it closes",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "MVVM : pourquoi séparer la vue de la logique change tout au moment de la v2",
            "La concurrence se conçoit, elle ne se rajoute pas : les règles inter-travaux de la v3 n'existaient pas tant que tout s'exécutait à la suite",
            "Une architecture se juge à sa deuxième version, pas à la première",
            "Documentation technique et livraison en équipe sur un rythme imposé",
          ],
          en: [
            "MVVM: why separating view from logic changes everything when v2 lands",
            "Concurrency is designed in, not bolted on: the cross-job rules of v3 simply did not exist while everything ran one after another",
            "An architecture is judged on its second version, not its first",
            "Technical documentation and team delivery on an imposed schedule",
          ],
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "tsp-resolver",
    featured: false,
    status: "shipped",
    period: { fr: "2025", en: "2025" },
    title: "TSP Resolver",
    tagline: {
      fr: "Tournées de livraison sous contraintes : huit heuristiques implémentées, calibrées et comparées de 5 à 3 000 villes.",
      en: "Constrained delivery routing: eight heuristics implemented, tuned and benchmarked from 5 to 3,000 cities.",
    },
    context: {
      fr: "CESI · Recherche opérationnelle · Projet d'équipe (5 personnes)",
      en: "CESI · Operations research · Team project (5 people)",
    },
    domain: "algorithms",
    stack: [
      "Python",
      "NumPy",
      "Jupyter",
      "Recuit simulé",
      "Recherche tabou",
      "Algorithme génétique",
      "Colonie de fourmis",
      "2-opt",
    ],
    repo: "https://github.com/clementmns/tsp-resolver",
    demo: "tsp",
    cover: {
      src: "/images/tsp.jpg",
      width: 1024,
      height: 506,
      alt: { fr: "Illustration : grille algorithmique", en: "Illustration: algorithmic grid" },
    },
    facts: [
      {
        label: { fr: "Commande", en: "Brief" },
        value: {
          fr: "ADEME → CesiCDP : réduire les émissions liées aux tournées",
          en: "ADEME → CesiCDP: cutting emissions from delivery rounds",
        },
      },
      {
        label: { fr: "Problème", en: "Problem" },
        value: {
          fr: "TSP-PC-ER, NP-difficile",
          en: "TSP-PC-ER, NP-hard",
        },
      },
      {
        label: { fr: "Algorithmes", en: "Algorithms" },
        value: {
          fr: "8 heuristiques, 4 familles",
          en: "8 heuristics, 4 families",
        },
      },
      {
        label: { fr: "Plan d'expérience", en: "Experimental plan" },
        value: {
          fr: "N de 5 à 3 000, 5 instances par taille",
          en: "N from 5 to 3,000, 5 instances per size",
        },
      },
    ],
    highlights: {
      fr: [
        "NP-difficulté démontrée par réduction : Ham-Cycle ≤p TSP ≤p TSP-PC-ER",
        "Huit heuristiques implémentées, chacune calibrée par son propre plan d'expérience",
        "Instances partagées et graine fixée : tous les algorithmes jugés sur les mêmes graphes",
        "Recommandation par régime de taille, et limites de l'expérience explicitées",
      ],
      en: [
        "NP-hardness proved by reduction: Ham-Cycle ≤p TSP ≤p TSP-PC-ER",
        "Eight heuristics implemented, each tuned by its own experimental plan",
        "Shared instances with a fixed seed: every algorithm judged on the same graphs",
        "Recommendation by size regime, with the study's own limits spelled out",
      ],
    },
    pipeline: [
      {
        id: "model",
        title: { fr: "Modéliser le terrain", en: "Model the ground truth" },
        body: {
          fr: "Le réseau devient un graphe complet dont chaque arête porte un coût réel : péage plus prix du carburant au kilomètre. Deux contraintes viennent du métier, certaines routes sont interdites, et certaines villes doivent être livrées avant d'autres.",
          en: "The network becomes a complete graph where every edge carries a real cost: toll plus fuel price per kilometre. Two constraints come from the field, some roads are closed, and some cities must be delivered before others.",
        },
      },
      {
        id: "prove",
        title: {
          fr: "Prouver qu'on a le droit de renoncer",
          en: "Prove we are entitled to give up",
        },
        body: {
          fr: "Avant d'écrire une heuristique, il faut établir qu'aucun algorithme exact raisonnable n'existe. C'est fait par réduction polynomiale depuis le cycle hamiltonien, en passant par le TSP classique. Sans cette étape, choisir une approximation serait un aveu de paresse plutôt qu'une décision.",
          en: "Before writing a heuristic, you have to establish that no reasonable exact algorithm exists. That is done by polynomial reduction from Hamiltonian cycle, through the classic TSP. Without this step, choosing an approximation would be an admission of laziness rather than a decision.",
        },
      },
      {
        id: "implement",
        title: { fr: "Couvrir quatre familles", en: "Cover four families" },
        body: {
          fr: "Huit algorithmes plutôt qu'un seul, choisis pour couvrir un large spectre du compromis qualité/temps : une heuristique constructive, une recherche locale, quatre métaheuristiques à solution unique, deux méthodes à population.",
          en: "Eight algorithms rather than one, chosen to span a wide range of the quality/time trade-off: one construction heuristic, one local search, four single-solution metaheuristics, two population-based methods.",
        },
      },
      {
        id: "calibrate",
        title: { fr: "Calibrer avant de comparer", en: "Tune before comparing" },
        body: {
          fr: "Chaque algorithme a d'abord son propre plan d'expérience pour fixer ses paramètres, taux d'évaporation des phéromones, schéma de refroidissement, longueur de la liste tabou. Comparer des méthodes mal réglées ne dit rien sur les méthodes, seulement sur les réglages.",
          en: "Each algorithm first gets its own experimental plan to fix its parameters, pheromone evaporation rate, cooling schedule, tabu list length. Comparing badly tuned methods says nothing about the methods, only about the tuning.",
        },
      },
      {
        id: "measure",
        title: { fr: "Mesurer sur les mêmes graphes", en: "Measure on the same graphs" },
        body: {
          fr: "Un générateur unique à graine fixée produit toutes les instances. Les huit algorithmes affrontent exactement les mêmes graphes, de 5 à 3 000 sommets, à raison de cinq instances par taille, ce qui élimine le biais d'une méthode chanceuse sur des cas faciles.",
          en: "A single seeded generator produces every instance. All eight algorithms face exactly the same graphs, from 5 to 3,000 nodes, with five instances per size, which removes the bias of a method that got lucky on easy cases.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Commande fictive de l'ADEME à CesiCDP : optimiser des tournées de livraison pour réduire la consommation de carburant et les émissions associées. L'instance servant de fil rouge est volontairement concrète, une boucherie qui doit livrer ses commandes de Noël depuis un dépôt à Paris vers Rennes, Rouen, Bordeaux, Toulouse et Lyon.",
          en: "A simulated brief from ADEME to CesiCDP: optimise delivery rounds to cut fuel consumption and the emissions that go with it. The running example is deliberately concrete, a butcher's shop delivering Christmas orders from a Paris depot to Rennes, Rouen, Bordeaux, Toulouse and Lyon.",
        },
      },
      {
        id: "notplain",
        title: {
          fr: "Ce n'est pas le voyageur de commerce des manuels",
          en: "This is not the textbook travelling salesman",
        },
        body: {
          fr: "Le TSP scolaire minimise une distance sur un graphe où tout est permis. Le problème traité ici, noté TSP-PC-ER, ajoute deux couches qui viennent du terrain et changent la nature du travail.",
          en: "The textbook TSP minimises a distance on a graph where everything is allowed. The problem tackled here, written TSP-PC-ER, adds two layers that come from the field and change the nature of the work.",
        },
        bullets: {
          fr: [
            "Un coût réel plutôt qu'une distance : péage + prix du carburant au kilomètre",
            "Arêtes interdites (Edge Restrictions) : une route en travaux ne peut pas être empruntée",
            "Contraintes de précédence (Precedence Constraints) : certaines villes doivent être livrées avant d'autres",
            "Conséquence pratique : une solution mathématiquement optimale mais qui emprunte une route fermée ne vaut rien",
          ],
          en: [
            "A real cost rather than a distance: toll + fuel price per kilometre",
            "Edge restrictions: a road under works cannot be taken",
            "Precedence constraints: some cities must be delivered before others",
            "Practical consequence: a mathematically optimal solution that uses a closed road is worthless",
          ],
        },
      },
      {
        id: "hardness",
        title: {
          fr: "Établir la difficulté avant de choisir l'approche",
          en: "Establish the hardness before choosing the approach",
        },
        body: {
          fr: "L'appartenance à NP se vérifie sur un certificat, une tournée ordonnée, en temps linéaire : chaque sommet apparaît une fois, aucune arête empruntée n'est interdite, le coût tient sous le seuil, les précédences sont respectées. La difficulté se démontre ensuite par réduction depuis le TSP classique, en posant simplement aucune précédence et aucune route bloquée : le TSP est un cas particulier du nôtre.",
          en: "Membership in NP is checked on a certificate, an ordered tour, in linear time: each node appears once, no edge used is forbidden, the cost stays under the threshold, precedences hold. Hardness then follows by reduction from the classic TSP, simply by setting no precedence and no blocked road: the TSP is a special case of ours.",
        },
        bullets: {
          fr: [
            "Le nombre de tournées distinctes vaut (n−1)!/2",
            "À 15 villes : plus de 4 × 10¹⁰ parcours",
            "À 20 villes : plus de 6 × 10¹⁶",
            "Les contraintes réduisent ce nombre, mais diviser par une constante ne change pas l'ordre de grandeur",
          ],
          en: [
            "The number of distinct tours is (n−1)!/2",
            "At 15 cities: more than 4 × 10¹⁰ routes",
            "At 20 cities: more than 6 × 10¹⁶",
            "Constraints shrink that number, but dividing by a constant does not change the order of magnitude",
          ],
        },
      },
      {
        id: "algorithms",
        title: { fr: "Huit algorithmes, quatre familles", en: "Eight algorithms, four families" },
        body: {
          fr: "Le choix n'est pas de trouver « le bon » algorithme mais de couvrir le compromis qualité/temps assez largement pour que la comparaison ait du sens.",
          en: "The point is not to find \"the right\" algorithm but to span the quality/time trade-off widely enough for the comparison to mean something.",
        },
        bullets: {
          fr: [
            "Constructif, Plus Proche Voisin, en variante multi-start",
            "Recherche locale, Hill Climbing multi-start",
            "Solution unique, Recuit simulé, recuit simulé multi-start, recherche tabou, recherche tabou 2-opt",
            "Population, algorithme génétique, colonie de fourmis",
          ],
          en: [
            "Construction, Nearest Neighbour, in a multi-start variant",
            "Local search, multi-start Hill Climbing",
            "Single solution, simulated annealing, multi-start annealing, tabu search, tabu search with 2-opt",
            "Population, genetic algorithm, ant colony optimisation",
          ],
        },
      },
      {
        id: "results",
        title: { fr: "Ce que les mesures ont montré", en: "What the measurements showed" },
        body: {
          fr: "Aucun algorithme ne gagne partout, et c'est le résultat intéressant : la bonne réponse dépend de la taille de l'instance et du temps qu'on accepte d'y consacrer.",
          en: "No algorithm wins everywhere, and that is the interesting result: the right answer depends on instance size and on how much time you are willing to spend.",
        },
        bullets: {
          fr: [
            "Jusqu'à N ≈ 300 et quand la qualité prime : la recherche tabou 2-opt domine",
            "Au-delà de N ≈ 300 : le recuit simulé passe devant, son temps d'exécution croissant quasi linéairement",
            "À toute taille, comme référence rapide : le Plus Proche Voisin multi-start, très bon rapport qualité/temps",
            "Génétique et colonie de fourmis décrochent au-delà de N ≈ 50 avec les paramètres retenus",
            "Le recuit multi-start n'améliore pas le recuit simple : le budget d'itérations réparti entre les relances devient insuffisant pour que chacune converge",
          ],
          en: [
            "Up to N ≈ 300 when quality matters most: tabu search with 2-opt dominates",
            "Beyond N ≈ 300: simulated annealing takes over, its runtime growing near-linearly",
            "At any size, as a fast reference: multi-start Nearest Neighbour, with a very good quality/time ratio",
            "Genetic and ant colony fall off beyond N ≈ 50 with the chosen parameters",
            "Multi-start annealing does not beat plain annealing: splitting the iteration budget across restarts leaves each one short of converging",
          ],
        },
      },
      {
        id: "limits",
        title: {
          fr: "Ce que l'expérience ne dit pas",
          en: "What the experiment does not say",
        },
        body: {
          fr: "C'est la partie du livrable dont je suis le plus satisfait. Les écarts mesurés sont exprimés par rapport à une borne inférieure volontairement simple, la demi-somme des minima sortants, qui sous-estime largement le coût optimal. Les pourcentages d'écart paraissent donc énormes et ne reflètent pas la qualité réelle des solutions : ils servent à classer les algorithmes entre eux, pas à mesurer une distance à l'optimum.",
          en: "This is the part of the report I am happiest with. The measured gaps are expressed against a deliberately simple lower bound, half the sum of outgoing minima, which badly underestimates the optimal cost. The gap percentages therefore look enormous and do not reflect the true quality of the solutions: they rank the algorithms against each other, they do not measure a distance to the optimum.",
        },
        bullets: {
          fr: [
            "Une borne plus serrée (Held-Karp, relaxation linéaire) donnerait une image bien plus juste",
            "Cinq graines par taille : trop peu pour conclure sous N = 30, où les écarts restent dans le bruit",
            "Paramètres calibrés sur N ≤ 30 : leur transfert aux grandes instances est approximatif, et un pic d'écart vers N ≈ 50 le trahit",
            "Ce pic n'est pas une propriété des algorithmes mais un artefact de notre calibration, le distinguer était l'enjeu de l'analyse",
          ],
          en: [
            "A tighter bound (Held-Karp, linear relaxation) would give a far more accurate picture",
            "Five seeds per size: too few to conclude below N = 30, where differences stay within noise",
            "Parameters tuned on N ≤ 30: transferring them to large instances is approximate, and a gap spike around N ≈ 50 gives it away",
            "That spike is not a property of the algorithms but an artefact of our own tuning, telling the two apart was the point of the analysis",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Prouver la difficulté d'un problème avant de choisir comment l'attaquer, plutôt que l'inverse",
            "Calibrer chaque méthode avant de la comparer : sinon on compare des réglages, pas des méthodes",
            "Une mesure ne vaut que ce que vaut sa référence, ici, une borne lâche rendait les écarts spectaculaires et peu informatifs",
            "Savoir distinguer un résultat d'un artefact de protocole",
            "Le même réflexe me sert chez Thales : arbitrer précision contre latence sur des mesures dont je connais les limites",
          ],
          en: [
            "Proving a problem's hardness before choosing how to attack it, rather than the other way round",
            "Tuning each method before comparing: otherwise you compare settings, not methods",
            "A measurement is only as good as its reference, here a loose bound made the gaps spectacular and uninformative",
            "Telling a result apart from an artefact of the protocol",
            "The same reflex serves me at Thales: trading accuracy against latency on measurements whose limits I know",
          ],
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "stagelink",
    featured: false,
    status: "shipped",
    period: { fr: "2025", en: "2025" },
    title: "StageLink",
    tagline: {
      fr: "Plateforme de gestion des offres de stage, en PHP MVC écrit à la main.",
      en: "Internship management platform, built on hand-written PHP MVC.",
    },
    context: {
      fr: "CESI · Développement web · Projet d'équipe",
      en: "CESI · Web development · Team project",
    },
    domain: "web",
    stack: ["PHP", "MVC", "MySQL", "Twig", "JavaScript", "Apache", "Composer"],
    repo: "https://github.com/Lucacist/StageLinkV1",
    cover: {
      src: "/images/stagelink.jpg",
      width: 1024,
      height: 1024,
      alt: { fr: "Page d'accueil de StageLink", en: "StageLink home page" },
    },
    facts: [
      {
        label: { fr: "Rôle", en: "Role" },
        value: {
          fr: "Contrôleurs, modèles et intégration",
          en: "Controllers, models and integration",
        },
      },
      {
        label: { fr: "Équipe", en: "Team" },
        value: { fr: "4 développeurs", en: "4 developers" },
      },
      {
        label: { fr: "Profils gérés", en: "User types" },
        value: {
          fr: "Étudiant, pilote de promotion, administrateur",
          en: "Student, programme lead, administrator",
        },
      },
      {
        label: { fr: "Sans framework", en: "No framework" },
        value: {
          fr: "Routeur, MVC et accès aux données écrits à la main",
          en: "Router, MVC and data access written by hand",
        },
      },
    ],
    video: {
      mp4: "/videos/stagelink-demo.mp4",
      poster: "/images/stagelink-offers.png",
      aspect: "1918 / 967",
      caption: {
        fr: "Démonstration : recherche d'une offre, ajout à la wish-list, candidature et suivi côté étudiant.",
        en: "Walkthrough: searching an offer, adding it to the wish list, applying and tracking it as a student.",
      },
    },
    gallery: [
      {
        src: "/images/stagelink-offers.png",
        alt: { fr: "Liste des offres de stage", en: "Internship offer list" },
        width: 1918,
        height: 967,
      },
      {
        src: "/images/stagelink-offers-details.jpg",
        alt: { fr: "Détail d'une offre", en: "Offer detail view" },
        width: 1918,
        height: 967,
      },
      {
        src: "/images/stagelink-dashboard.jpg",
        alt: { fr: "Tableau de bord", en: "Dashboard" },
        width: 1918,
        height: 966,
      },
      {
        src: "/images/stagelink-company.jpg",
        alt: { fr: "Fiche entreprise", en: "Company profile" },
        width: 1918,
        height: 963,
      },
      {
        src: "/images/stagelink-apply.jpg",
        alt: { fr: "Formulaire de candidature", en: "Application form" },
        width: 880,
        height: 680,
      },
      {
        src: "/images/stagelink-responsive.jpg",
        alt: { fr: "Affichage responsive", en: "Responsive layout" },
        width: 1918,
        height: 975,
      },
    ],
    highlights: {
      fr: [
        "Routeur et couche MVC écrits à la main, sans framework",
        "Trois profils d'utilisateur aux droits distincts",
        "Wish-list, candidature avec CV et lettre, suivi des réponses",
        "Requêtes préparées partout, échappement des vues par Twig",
      ],
      en: [
        "Router and MVC layer written by hand, without a framework",
        "Three user profiles with distinct rights",
        "Wish list, application with CV and cover letter, response tracking",
        "Prepared statements throughout, view escaping handled by Twig",
      ],
    },
    pipeline: [
      {
        id: "route",
        title: { fr: "L'URL est décodée", en: "The URL is decoded" },
        body: {
          fr: "Toutes les requêtes entrent par un fichier unique. Il reconstruit la route depuis l'URL, la forme lisible `/StageLinkV1/offres` comme la forme historique avec un paramètre, puis vérifie qu'une session existe. Sans session et hors des quelques routes publiques, la requête repart vers la page de connexion avant qu'aucun code métier ne s'exécute.",
          en: "Every request enters through a single file. It rebuilds the route from the URL, both the readable `/StageLinkV1/offers` form and the legacy query-parameter form, then checks that a session exists. Without one, and outside a few public routes, the request is sent back to the login page before any business code runs.",
        },
      },
      {
        id: "controller",
        title: { fr: "Le contrôleur prend la main", en: "The controller takes over" },
        body: {
          fr: "Chaque route désigne un contrôleur : offres, entreprises, wish-list, tableau de bord, utilisateurs. Il lit les paramètres, décide quoi demander au modèle, et ne contient ni SQL ni HTML. C'est cette discipline qui rend le motif MVC lisible quand on l'écrit soi-même plutôt que de l'hériter.",
          en: "Each route names a controller: offers, companies, wish list, dashboard, users. It reads the parameters, decides what to ask the model for, and holds neither SQL nor HTML. That discipline is what makes the MVC pattern legible when you write it yourself rather than inherit it.",
        },
      },
      {
        id: "model",
        title: { fr: "Le modèle interroge la base", en: "The model queries the database" },
        body: {
          fr: "Les modèles portent l'accès aux données et la logique métier. Toutes les requêtes passent par des requêtes préparées, plus de quatre-vingts dans le projet, ce qui écarte les injections SQL par construction plutôt que par vigilance.",
          en: "Models carry data access and business logic. Every query goes through prepared statements, more than eighty across the project, which rules out SQL injection by construction rather than by vigilance.",
        },
      },
      {
        id: "view",
        title: { fr: "Twig rend la page", en: "Twig renders the page" },
        body: {
          fr: "Les gabarits reçoivent des données déjà prêtes et ne font que les mettre en forme. L'échappement des sorties est celui de Twig, actif par défaut : la protection contre les injections de script vient du moteur, pas d'un appel oublié quelque part.",
          en: "Templates receive ready-made data and only lay it out. Output escaping is Twig's own, on by default: protection against script injection comes from the engine, not from a call someone might forget.",
        },
      },
    ],
    sections: [
      {
        id: "product",
        title: { fr: "Ce que fait la plateforme", en: "What the platform does" },
        body: {
          fr: "StageLink réunit au même endroit ce qui est habituellement éparpillé : les offres de stage, les fiches des entreprises partenaires et le suivi des candidatures. Un étudiant cherche une offre par mots-clés, compétences ou durée, la met en wish-list, candidate avec son CV et sa lettre, puis suit l'état de ses réponses. Un pilote de promotion gère les offres, les entreprises et les comptes de sa promotion, et suit l'avancement de la recherche de stage. Un administrateur gère les pilotes eux-mêmes. Les entreprises peuvent être évaluées, et les offres agrégées en statistiques par compétence ou par durée.",
          en: "StageLink brings together what is usually scattered: internship offers, partner company profiles and application tracking. A student searches offers by keyword, skill or duration, adds one to a wish list, applies with a CV and cover letter, then follows the state of each reply. A programme lead manages offers, companies and their cohort's accounts, and monitors how the search is going. An administrator manages the leads themselves. Companies can be rated, and offers aggregated into statistics by skill or duration.",
        },
      },
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Les étudiants du CESI cherchent leurs stages en activant leurs réseaux personnels, sans point d'entrée commun. Le sujet demandait une application web complète construite sans framework : ni Symfony, ni Laravel, seulement PHP, un moteur de gabarits et une base MySQL. La contrainte est l'intérêt du projet, elle oblige à écrire soi-même le routage, la séparation des responsabilités et l'accès aux données.",
          en: "CESI students look for internships through personal networks, with no shared entry point. The brief asked for a complete web application built without a framework: no Symfony, no Laravel, only PHP, a template engine and a MySQL database. That constraint is the point of the project, it forces you to write the routing, the separation of concerns and the data access yourself.",
        },
      },
      {
        id: "security",
        title: {
          fr: "Sécurité : ce qui est en place, et ce qui manque",
          en: "Security: what is in place, and what is missing",
        },
        body: {
          fr: "En relisant le code pour cette page, j'ai préféré séparer les deux. Une liste de bonnes pratiques est facile à écrire ; c'est ce qui s'y trouve réellement qui compte.",
          en: "Rereading the code for this page, I preferred to separate the two. A list of good practices is easy to write; what matters is what is actually there.",
        },
        bullets: {
          fr: [
            "En place, mots de passe hachés par `password_hash`, qui applique bcrypt",
            "En place, requêtes préparées sur l'ensemble des accès à la base",
            "En place, échappement automatique des variables par Twig, avec deux exceptions explicites sur la pagination",
            "Manquant, aucun jeton anti-CSRF sur les formulaires",
            "Manquant, pas de régénération d'identifiant de session après connexion, donc pas de protection contre la fixation de session",
          ],
          en: [
            "In place, passwords hashed with `password_hash`, which applies bcrypt",
            "In place, prepared statements across every database access",
            "In place, automatic variable escaping by Twig, with two explicit exceptions on pagination",
            "Missing, no anti-CSRF token on forms",
            "Missing, no session ID regeneration after login, so no protection against session fixation",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Le motif MVC compris de l'intérieur, sans magie de framework",
            "Conception d'un schéma relationnel et d'un modèle de droits par profil",
            "Ce qu'un framework apporte vraiment, relire ce code deux ans après le montre mieux que n'importe quel cours",
            "Gestion de version et travail d'équipe sur une base de code partagée",
          ],
          en: [
            "The MVC pattern understood from the inside, without framework magic",
            "Designing a relational schema and a per-profile rights model",
            "What a framework actually buys you, rereading this code two years on shows it better than any lecture",
            "Version control and teamwork on a shared codebase",
          ],
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "qualite-air",
    featured: false,
    status: "shipped",
    period: { fr: "2024", en: "2024" },
    title: {
      fr: "Base de données qualité de l'air",
      en: "Air quality database",
    },
    tagline: {
      fr: "Modélisation complète d'un système de suivi de la qualité de l'air.",
      en: "Full data model for an air quality monitoring system.",
    },
    context: {
      fr: "CESI · Bases de données · Projet d'équipe",
      en: "CESI · Databases · Team project",
    },
    domain: "data",
    stack: ["SQL", "Merise", "MCD / MLD / MPD", "Algèbre relationnelle", "Jeux de test"],
    demo: "algebra",
    cover: {
      src: "/images/bddBackground.png",
      width: 1024,
      height: 771,
      alt: { fr: "Schéma de base de données", en: "Database schema" },
    },
    facts: [
      {
        label: { fr: "Commanditaire", en: "Client" },
        value: {
          fr: "Ministère de l'écologie, mise en situation",
          en: "Ministry of Ecology, simulated brief",
        },
      },
      {
        label: { fr: "Équipe", en: "Team" },
        value: {
          fr: "4 rôles : chef de projet, analyste, développeur, testeur",
          en: "4 roles: project lead, analyst, developer, tester",
        },
      },
      {
        label: { fr: "Méthode", en: "Method" },
        value: { fr: "Merise, du dictionnaire au SQL", en: "Merise, from dictionary to SQL" },
      },
      {
        label: { fr: "Durée", en: "Duration" },
        value: { fr: "Deux mois, quatre jalons", en: "Two months, four milestones" },
      },
    ],
    highlights: {
      fr: [
        "Chaîne Merise complète : dictionnaire, MCD, MLD, MPD, puis SQL",
        "Neuf familles de données recensées avant d'écrire la moindre table",
        "Requêtes analysées en arbres algébriques pour situer le coût",
        "Base peuplée de données de test, puis interrogée et validée",
      ],
      en: [
        "Full Merise chain: dictionary, conceptual, logical and physical models, then SQL",
        "Nine data families catalogued before a single table was written",
        "Queries analysed as algebraic trees to locate their cost",
        "Database populated with test data, then queried and validated",
      ],
    },
    pipeline: [
      {
        id: "dictionary",
        title: { fr: "Le dictionnaire de données", en: "The data dictionary" },
        body: {
          fr: "Avant toute table, on recense chaque information à conserver : son nom, son type, sa taille, sa portée et ce qu'elle signifie. Neuf grandes familles ont été identifiées. C'est l'étape la plus ingrate et celle qui évite le plus d'erreurs : deux personnes qui appellent « région » deux choses différentes s'en aperçoivent ici, pas au moment des jointures.",
          en: "Before any table, you catalogue every piece of information to keep: its name, type, size, scope and meaning. Nine broad families were identified. It is the most thankless stage and the one that prevents the most mistakes: two people calling \"region\" two different things find out here, not when writing joins.",
        },
      },
      {
        id: "mcd",
        title: { fr: "Le modèle conceptuel", en: "The conceptual model" },
        body: {
          fr: "Les données se regroupent en neuf entités (Région, Ville, Agence, Personnel, Capteur, Gaz, Secteur d'activité, Relevé, Rapport), chacune dotée d'un identifiant unique. Les associations qui les relient portent un verbe à l'infinitif, et surtout des cardinalités : un capteur appartient à une agence, une agence en compte plusieurs ; une région émet plusieurs gaz, et un même gaz est émis par plusieurs régions. C'est ici qu'on tranche, et ces décisions ne se rattrapent pas plus tard sans tout casser.",
          en: "Data groups into nine entities (Region, City, Agency, Staff, Sensor, Gas, Business sector, Reading, Report), each with a unique identifier. The associations linking them carry an infinitive verb and, above all, cardinalities: a sensor belongs to one agency, an agency has several; a region emits several gases, and the same gas is emitted by several regions. This is where you decide, and those decisions cannot be walked back later without breaking everything.",
        },
      },
      {
        id: "mld",
        title: { fr: "Le modèle logique", en: "The logical model" },
        body: {
          fr: "Le passage au relationnel suit des règles mécaniques : chaque entité devient une table, chaque identifiant une clé primaire, chaque association 1:N une clé étrangère du côté « plusieurs ». Les associations N:N, elles, deviennent une table à part entière. Cette mécanique est ce qui rend le modèle vérifiable plutôt qu'affaire de goût.",
          en: "Moving to the relational world follows mechanical rules: each entity becomes a table, each identifier a primary key, each 1:N association a foreign key on the \"many\" side. N:N associations become tables in their own right. That mechanical quality is what makes the model checkable rather than a matter of taste.",
        },
      },
      {
        id: "mpd",
        title: { fr: "Le modèle physique", en: "The physical model" },
        body: {
          fr: "Le schéma devient exécutable : types concrets, longueurs, contraintes de clé primaire et étrangère, valeurs obligatoires. C'est le moment où l'on décide qu'un relevé porte une valeur en ppm et un horodatage, et où le SGBD se met à refuser les données incohérentes à notre place.",
          en: "The schema becomes executable: concrete types, lengths, primary and foreign key constraints, mandatory values. This is when you decide a reading carries a ppm value and a timestamp, and when the database engine starts rejecting inconsistent data on your behalf.",
        },
      },
      {
        id: "sql",
        title: { fr: "Les requêtes", en: "The queries" },
        body: {
          fr: "La base est peuplée de données de test, puis interrogée. Chaque requête utile a été doublée d'un arbre algébrique (jointures, projections, sélections) pour voir où passe le coût. La démonstration ci-dessous porte sur celle qui cherche le secteur le plus polluant d'une région.",
          en: "The database is populated with test data, then queried. Each useful query was paired with an algebraic tree (joins, projections, selections) to see where the cost goes. The demo below covers the one finding the most polluting sector in a region.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Mise en situation : à la suite d'un rapport du GIEC, le ministère de l'écologie confie à notre équipe la conception d'un système national de suivi de la qualité de l'air. Il doit centraliser les mesures remontées par plusieurs agences météorologiques et permettre de les exploiter, donc gérer les agences et leur personnel, les capteurs déployés sur le territoire, les relevés qu'ils produisent, et les rapports que l'on en tire.",
          en: "A simulated brief: following an IPCC report, the Ministry of Ecology asks our team to design a national air quality monitoring system. It must centralise measurements sent in by several weather agencies and make them usable, so it has to handle the agencies and their staff, the sensors deployed across the country, the readings they produce, and the reports drawn from them.",
        },
      },
      {
        id: "why",
        title: {
          fr: "Pourquoi ne pas commencer par écrire des tables",
          en: "Why not start by writing tables",
        },
        body: {
          fr: "L'intérêt de ce projet n'est pas le SQL, qui s'apprend en quelques heures, mais ce qui vient avant. Une base de données est la seule partie d'un système qu'on ne peut pas refactoriser tranquillement : le jour où des données réelles y vivent, changer une cardinalité veut dire migrer. La méthode Merise force donc à trancher les questions structurantes pendant qu'elles ne coûtent encore rien.",
          en: "The point of this project is not the SQL, which takes a few hours to learn, but everything before it. A database is the one part of a system you cannot refactor quietly: once real data lives in it, changing a cardinality means migrating. Merise therefore forces the structural questions to be settled while they still cost nothing.",
        },
        bullets: {
          fr: [
            "Une agence est rattachée à une ville, et la ville à une région, plutôt que l'agence directement à la région. Un niveau de plus, mais c'est ce qui permet plus tard de compter par ville sans avoir à redécouper",
            "Une région émet plusieurs gaz et un gaz vient de plusieurs régions : cette réciprocité ne se range dans aucune des deux tables, elle devient une table à part entière",
            "Un relevé porte quatre clés étrangères : le gaz mesuré, le capteur, l'opérateur et la région. Chacune répond à une question qu'on aurait sinon dû reconstituer après coup",
            "Ces décisions se prennent sur le papier. Une fois des données réelles en base, changer une cardinalité veut dire migrer",
          ],
          en: [
            "An agency attaches to a city, and the city to a region, rather than the agency straight to the region. One level more, but it is what later allows counting by city without re-cutting anything",
            "A region emits several gases and a gas comes from several regions: that reciprocity fits in neither table, so it becomes a table of its own",
            "A reading carries four foreign keys: the gas measured, the sensor, the operator and the region. Each answers a question you would otherwise have to reconstruct afterwards",
            "These decisions are made on paper. Once real data lives in the database, changing a cardinality means migrating",
          ],
        },
      },
      {
        id: "optimisation",
        title: {
          fr: "L'arbre algébrique, ou pourquoi l'ordre compte",
          en: "The algebraic tree, or why order matters",
        },
        body: {
          fr: "Une requête SQL dit ce qu'on veut, pas comment l'obtenir. L'arbre algébrique, lui, montre le comment : les tables sont les feuilles, et chaque nœud est une opération : une jointure qui combine, une sélection qui filtre les lignes, une projection qui ne garde que certaines colonnes. Le résultat est identique quel que soit l'ordre, mais le volume manipulé au passage ne l'est pas du tout.",
          en: "A SQL query says what you want, not how to get it. The algebraic tree shows the how: tables are the leaves, and each node is an operation: a join that combines, a selection that filters rows, a projection that keeps only some columns. The result is the same whatever the order, but the volume handled along the way is not.",
        },
        bullets: {
          fr: [
            "Filtrer après avoir joint oblige à construire un résultat intermédiaire énorme pour n'en garder qu'une fraction",
            "Descendre la sélection au plus près des feuilles réduit ce que chaque jointure doit traiter",
            "C'est un raisonnement sur le volume, indépendant du moteur : il vaut avant même de parler d'index",
            "Les moteurs modernes savent souvent réordonner seuls ; savoir lire l'arbre reste ce qui permet de comprendre leur plan d'exécution",
          ],
          en: [
            "Filtering after joining forces you to build a huge intermediate result and keep a fraction of it",
            "Pushing the selection down towards the leaves shrinks what each join has to process",
            "It is reasoning about volume, independent of the engine: it holds before indexes even come up",
            "Modern engines often reorder on their own; reading the tree is what lets you understand their execution plan",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Un schéma se conçoit avant d'être écrit, parce qu'il se corrige mal une fois peuplé",
            "Les cardinalités sont des décisions métier déguisées en notation",
            "Lire un arbre algébrique donne l'intuition du coût d'une requête avant de la mesurer",
            "Le travail en équipe avec des rôles séparés, et la traçabilité que ça impose",
          ],
          en: [
            "A schema is designed before it is written, because it corrects badly once populated",
            "Cardinalities are business decisions dressed up as notation",
            "Reading an algebraic tree gives an intuition of a query's cost before measuring it",
            "Team work with separate roles, and the traceability that imposes",
          ],
        },
      },
    ],
    documents: [
      {
        href: "/documents/P4_soutenance.pdf",
        label: { fr: "Support de soutenance", en: "Defence presentation" },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "station-meteo",
    featured: false,
    status: "shipped",
    period: { fr: "2024", en: "2024" },
    title: { fr: "Station météo", en: "Weather station" },
    tagline: {
      fr: "Système embarqué de collecte et d'enregistrement de données météorologiques.",
      en: "Embedded system for collecting and logging weather data.",
    },
    context: {
      fr: "CESI · Systèmes embarqués · Projet d'équipe",
      en: "CESI · Embedded systems · Team project",
    },
    domain: "embedded",
    stack: ["C / C++", "ATmega328", "Arduino", "UML / SysML", "Carte SD"],
    demo: "weather",
    cover: {
      src: "/images/meteo.jpg",
      width: 1024,
      height: 1024,
      alt: { fr: "Prototype de station météo", en: "Weather station prototype" },
    },
    documents: [
      {
        href: "/documents/Projet2livrable1.pdf",
        label: { fr: "Analyse du système", en: "System analysis" },
      },
      {
        href: "/documents/Projet2livrable4.pdf",
        label: { fr: "Documentation utilisateur", en: "User documentation" },
      },
    ],
    highlights: {
      fr: [
        "Quatre grandeurs mesurées : pression, humidité, luminosité, température",
        "Enregistrement horodaté sur carte SD",
        "Interface de consultation embarquée",
        "Documentation utilisateur rédigée",
      ],
      en: [
        "Four measured quantities: pressure, humidity, light, temperature",
        "Timestamped logging to SD card",
        "On-board readout interface",
        "User documentation written",
      ],
    },
    facts: [
      {
        label: { fr: "Destination", en: "Intended use" },
        value: { fr: "Équiper des navires", en: "Fitted to ships" },
      },
      {
        label: { fr: "Cible", en: "Target" },
        value: { fr: "ATmega328, 2 Ko de RAM", en: "ATmega328, 2 KB of RAM" },
      },
      {
        label: { fr: "Grandeurs", en: "Quantities" },
        value: {
          fr: "Pression, humidité, luminosité, température",
          en: "Pressure, humidity, light, temperature",
        },
      },
      {
        label: { fr: "Livraisons", en: "Deliveries" },
        value: {
          fr: "Analyse, architecture, maquette, documentation",
          en: "Analysis, architecture, mock-up, documentation",
        },
      },
    ],
    pipeline: [
      {
        id: "analysis",
        title: { fr: "Analyser avant de câbler", en: "Analyse before wiring" },
        body: {
          fr: "Le système a d'abord été décrit en UML et SysML : ce qu'il doit faire, quels acteurs interviennent, comment les blocs s'articulent. Sur un projet embarqué, ce détour n'est pas un exercice scolaire : une fois la carte câblée et le boîtier fermé, changer d'avis coûte un démontage.",
          en: "The system was first described in UML and SysML: what it must do, which actors are involved, how the blocks fit together. On an embedded project this detour is not a school exercise: once the board is wired and the case closed, changing your mind costs a teardown.",
        },
      },
      {
        id: "architecture",
        title: { fr: "L'architecture du programme", en: "The program architecture" },
        body: {
          fr: "Fonctions, variables, découpage des responsabilités : la structure logicielle a été posée sur le papier avant d'être écrite. Sur un microcontrôleur, chaque variable globale consomme une mémoire qui se compte en kilooctets, et le compilateur ne prévient pas quand il n'en reste plus assez pour la pile.",
          en: "Functions, variables, division of responsibilities: the software structure was laid out on paper before being written. On a microcontroller each global variable eats memory measured in kilobytes, and the compiler gives no warning when there is no longer enough left for the stack.",
        },
      },
      {
        id: "sensors",
        title: { fr: "Les quatre capteurs", en: "The four sensors" },
        body: {
          fr: "Un baromètre pour la pression, un hygromètre pour l'humidité, une photorésistance pour la luminosité et une sonde de température. Chacun a sa propre façon de répondre : certains rendent une valeur numérique directement lisible, d'autres une tension qu'il faut convertir et étalonner.",
          en: "A barometer for pressure, a hygrometer for humidity, a photoresistor for light and a temperature probe. Each answers in its own way: some return a digital value ready to read, others a voltage that must be converted and calibrated.",
        },
      },
      {
        id: "storage",
        title: { fr: "L'enregistrement", en: "Logging" },
        body: {
          fr: "Chaque relevé est écrit sur carte SD avec son horodatage, afin qu'on puisse rejouer une période après coup et pas seulement lire l'instant présent. C'est ce qui sépare un afficheur d'une station de mesure : la première ne sert qu'à celui qui regarde, la seconde produit une donnée exploitable plus tard.",
          en: "Each reading is written to the SD card with its timestamp, so a period can be replayed afterwards rather than only read live. That is what separates a display from a measuring station: the first serves only whoever is looking, the second produces data usable later.",
        },
      },
      {
        id: "ui",
        title: { fr: "La consultation sur place", en: "On-site readout" },
        body: {
          fr: "Une interface embarquée permet de lire les valeurs courantes et l'historique sans brancher d'ordinateur. Sur un navire, c'est une contrainte d'usage plus qu'un confort : personne ne va chercher un portable pour savoir si la pression baisse.",
          en: "An on-board interface shows current values and history without plugging in a computer. On a ship this is a usage constraint rather than a convenience: nobody fetches a laptop to find out whether the pressure is dropping.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Concevoir une station météo embarquée destinée à équiper des navires. Les mesures servent à deux choses : une lecture immédiate pour l'équipage, et un historique conservé sur carte SD pour analyse ultérieure. L'intérêt du sujet tient à sa destination : un système exposé aux embruns, alimenté sans garantie, et que personne ne viendra redémarrer.",
          en: "Design an embedded weather station to equip ships. The measurements serve two purposes: an immediate readout for the crew, and a history kept on an SD card for later analysis. What makes the brief interesting is where it ends up: a system exposed to sea spray, powered without guarantees, and that nobody will come to reboot.",
        },
      },
      {
        id: "constraints",
        title: {
          fr: "Ce que change un microcontrôleur",
          en: "What a microcontroller changes",
        },
        body: {
          fr: "Écrire pour un ATmega328 n'a pas grand-chose à voir avec écrire pour un ordinateur. Deux kilooctets de mémoire vive, pas de système d'exploitation, pas d'allocation dynamique raisonnable, et un programme qui doit tourner des semaines sans fuite ni remise à zéro.",
          en: "Writing for an ATmega328 has little in common with writing for a computer. Two kilobytes of RAM, no operating system, no sensible dynamic allocation, and a program that has to run for weeks without a leak or a reset.",
        },
        bullets: {
          fr: [
            "Pas de mémoire allouée à la volée : tout est dimensionné à la compilation, sinon la pile finit par mordre sur les données",
            "Les chaînes de caractères coûtent cher : un simple message d'erreur occupe une part notable de la mémoire disponible",
            "L'écriture sur carte SD est lente et doit être espacée, sinon elle bloque la lecture des capteurs",
            "Un capteur qui ne répond pas ne doit pas figer la station : la boucle continue avec les autres grandeurs",
          ],
          en: [
            "No allocation on the fly: everything is sized at compile time, or the stack eventually eats into the data",
            "Strings are expensive: a single error message takes a noticeable share of available memory",
            "Writing to the SD card is slow and must be spaced out, or it stalls sensor reading",
            "A sensor that stops answering must not freeze the station: the loop carries on with the other quantities",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Programmer sous contrainte mémoire, où chaque variable se justifie",
            "Modéliser en UML et SysML avant de câbler, parce qu'un montage ne se refactorise pas",
            "Lire des capteurs de natures différentes et convertir des tensions en grandeurs physiques",
            "Rendre une donnée persistante et horodatée, donc exploitable après coup",
            "Rédiger une documentation destinée à quelqu'un qui n'a pas écrit le code",
          ],
          en: [
            "Programming under memory constraints, where every variable has to justify itself",
            "Modelling in UML and SysML before wiring, because a build does not refactor",
            "Reading sensors of different natures and converting voltages into physical quantities",
            "Making data persistent and timestamped, therefore usable afterwards",
            "Writing documentation for someone who did not write the code",
          ],
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "strongbox",
    featured: false,
    status: "shipped",
    period: { fr: "2023", en: "2023" },
    title: "StrongBox 3000",
    tagline: {
      fr: "Coffre-fort électronique à authentification multi-niveaux.",
      en: "Electronic safe with multi-level authentication.",
    },
    context: {
      fr: "CESI · Systèmes embarqués · Projet d'équipe",
      en: "CESI · Embedded systems · Team project",
    },
    domain: "embedded",
    stack: ["C++", "Arduino", "Électronique", "Programmation embarquée", "Algorithmique"],
    demo: "strongbox",
    cover: {
      src: "/images/strongbox.jpg",
      width: 372,
      height: 452,
      alt: { fr: "Prototype du coffre-fort", en: "Safe prototype" },
    },
    documents: [
      {
        href: "/documents/Projet1Livrable1.pdf",
        label: { fr: "Livrable 1, Analyse", en: "Deliverable 1, Analysis" },
      },
      {
        href: "/documents/Projet1Livrable2.pdf",
        label: { fr: "Livrable 2, Conception", en: "Deliverable 2, Design" },
      },
      {
        href: "/documents/Projet1Livrable3.pdf",
        label: { fr: "Livrable 3, Réalisation", en: "Deliverable 3, Build" },
      },
      {
        href: "/documents/Projet1Livrable4.pdf",
        label: { fr: "Livrable 4, Bilan", en: "Deliverable 4, Review" },
      },
    ],
    facts: [
      {
        label: { fr: "Commanditaire", en: "Client" },
        value: { fr: "Agence MI7, mise en situation", en: "MI7 agency, simulated brief" },
      },
      {
        label: { fr: "Cible", en: "Target" },
        value: { fr: "Arduino, microcontrôleur 8 bits", en: "Arduino, 8-bit microcontroller" },
      },
      {
        label: { fr: "Livraisons", en: "Deliveries" },
        value: {
          fr: "4 jalons, du circuit au prototype complet",
          en: "4 milestones, from circuit to full prototype",
        },
      },
      {
        label: { fr: "Facteurs", en: "Factors" },
        value: {
          fr: "Carte reconnue + combinaison physique",
          en: "Recognised card + physical combination",
        },
      },
    ],
    highlights: {
      fr: [
        "Deux facteurs indépendants : ni la carte ni la combinaison ne suffit seule",
        "Circuit conçu avant le code : le schéma électronique fixe ce que le programme peut lire",
        "Algorithme d'authentification à plusieurs niveaux de droits",
        "Quatre livrables, du premier circuit au coffre assemblé",
      ],
      en: [
        "Two independent factors: neither the card nor the combination is enough alone",
        "Circuit designed before the code: the wiring decides what the program can read",
        "Multi-level authentication algorithm with distinct access rights",
        "Four deliverables, from first circuit to assembled safe",
      ],
    },
    pipeline: [
      {
        id: "circuit",
        title: { fr: "Le circuit d'abord", en: "The circuit first" },
        body: {
          fr: "Avant toute ligne de code, le schéma électronique : les interrupteurs qui forment la combinaison, les contacts de lecture de la carte, les LED de retour, et les résistances qui vont avec. En embarqué, cet ordre n'est pas un choix : le nombre de broches disponibles décide de ce que le programme pourra lire, et pas l'inverse.",
          en: "Before any code, the wiring: the switches forming the combination, the card-reading contacts, the feedback LEDs, and the resistors that go with them. In embedded work this order is not a preference: the number of available pins decides what the program can read, not the other way round.",
        },
      },
      {
        id: "prototype",
        title: { fr: "Le montage sur plaque", en: "The breadboard build" },
        body: {
          fr: "Le schéma devient un montage réel sur plaque d'essai, câblé autour de l'Arduino. C'est l'étape où le papier rencontre la réalité : une résistance mal calculée et la LED grille, un fil mal placé et l'entrée flotte au lieu de valoir zéro.",
          en: "The schematic becomes a real breadboard build wired around the Arduino. This is where paper meets reality: one miscalculated resistor and the LED burns out, one misplaced wire and the input floats instead of reading zero.",
        },
      },
      {
        id: "algo",
        title: { fr: "L'algorithme d'authentification", en: "The authentication algorithm" },
        body: {
          fr: "La logique de sécurité proprement dite : reconnaître la carte présentée, lire la combinaison d'interrupteurs, et n'ouvrir que si les deux concordent. Plusieurs niveaux de droits ont été définis, tous les agents n'ouvrant pas les mêmes compartiments.",
          en: "The security logic proper: recognise the presented card, read the switch combination, and open only if both agree. Several levels of rights were defined, since not every agent opens the same compartments.",
        },
      },
      {
        id: "assembly",
        title: { fr: "Le coffre assemblé", en: "The assembled safe" },
        body: {
          fr: "Les briques précédentes réunies dans un prototype complet, présenté au commanditaire. Un système qui marche sur la paillasse et un système qui marche une fois refermé dans sa boîte ne sont pas tout à fait le même objet.",
          en: "The previous pieces brought together into a complete prototype, presented to the client. A system that works on the bench and one that works once closed inside its box are not quite the same object.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Mise en situation : l'agence MI7 a besoin d'un coffre pour ses documents sensibles. Premier projet de systèmes embarqués du cursus, et première fois où le programme que j'écris commande quelque chose de physique plutôt que d'afficher un résultat à l'écran.",
          en: "A simulated brief: the MI7 agency needs a safe for its sensitive documents. The first embedded systems project of the course, and the first time a program I wrote drove something physical rather than printing a result to a screen.",
        },
      },
      {
        id: "twofactor",
        title: {
          fr: "Pourquoi deux facteurs, et pourquoi indépendants",
          en: "Why two factors, and why independent",
        },
        body: {
          fr: "Une carte seule se vole. Une combinaison seule s'observe par-dessus l'épaule. L'intérêt de les exiger ensemble n'est pas d'additionner deux protections mais d'obliger un attaquant à réussir deux attaques de natures différentes : dérober un objet, et surprendre un geste. C'est le raisonnement qui fonde l'authentification à deux facteurs, et le voir sur un montage de vingt composants le rend plus concret que n'importe quel schéma de cours.",
          en: "A card alone gets stolen. A combination alone gets watched over a shoulder. Requiring both is not about stacking two protections but about forcing an attacker to succeed at two attacks of different kinds: steal an object, and observe a gesture. That is the reasoning behind two-factor authentication, and seeing it on a twenty-component build makes it far more concrete than any lecture diagram.",
        },
        bullets: {
          fr: [
            "Les deux facteurs sont lus par des entrées distinctes : compromettre l'une ne donne rien sur l'autre",
            "Le coffre ne dit pas lequel des deux est faux, sinon il aide l'attaquant à chercher séparément",
            "Les niveaux de droits ouvrent des compartiments différents plutôt que de tout donner à quiconque entre",
          ],
          en: [
            "The two factors are read on separate inputs: compromising one reveals nothing about the other",
            "The safe does not say which of the two is wrong, otherwise it helps the attacker search separately",
            "Rights levels open different compartments rather than giving everything to whoever gets in",
          ],
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Un programme embarqué se conçoit avec le circuit, pas après lui",
            "Le raisonnement derrière l'authentification à deux facteurs, vu de l'intérieur",
            "Mener un projet de bout en bout, de l'analyse du besoin au prototype présenté",
            "Ce qu'un message d'erreur trop bavard peut donner à un attaquant",
          ],
          en: [
            "An embedded program is designed with the circuit, not after it",
            "The reasoning behind two-factor authentication, seen from the inside",
            "Running a project end to end, from requirements to a presented prototype",
            "What an over-talkative error message hands to an attacker",
          ],
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "traitement-signal",
    featured: false,
    status: "shipped",
    period: { fr: "2024", en: "2024" },
    title: { fr: "Traitement du signal", en: "Signal processing" },
    tagline: {
      fr: "Chaîne de transmission sonore pour communication en environnement contraint.",
      en: "Acoustic transmission chain for communication in constrained environments.",
    },
    context: {
      fr: "CESI · Traitement du signal",
      en: "CESI · Signal processing",
    },
    domain: "embedded",
    stack: ["Python", "NumPy", "SciPy", "Matplotlib", "Jupyter", "Modulation FSK"],
    demo: "signal",
    cover: {
      src: "/images/signal.jpg",
      width: 780,
      height: 530,
      alt: { fr: "Analyse spectrale d'un signal", en: "Spectral analysis of a signal" },
    },
    facts: [
      {
        label: { fr: "Contrainte", en: "Constraint" },
        value: {
          fr: "Un micro pour seul émetteur",
          en: "A microphone as the only transmitter",
        },
      },
      {
        label: { fr: "Modulation", en: "Modulation" },
        value: { fr: "FSK, deux fréquences", en: "FSK, two frequencies" },
      },
      {
        label: { fr: "Validation", en: "Validation" },
        value: {
          fr: "Modélisation numérique sous Python",
          en: "Numerical modelling in Python",
        },
      },
      {
        label: { fr: "Livraisons", en: "Deliveries" },
        value: {
          fr: "4 jalons, de la théorie au prototype",
          en: "4 milestones, from theory to prototype",
        },
      },
    ],
    highlights: {
      fr: [
        "Chaîne complète : codage, modulation, canal bruité, filtrage, décision",
        "Modulation par déplacement de fréquence, choisie pour sa robustesse au bruit",
        "Filtrage passe-bande pour isoler la bande utile du bruit ambiant",
        "Validation par modélisation numérique avant toute réalisation matérielle",
      ],
      en: [
        "Full chain: coding, modulation, noisy channel, filtering, decision",
        "Frequency-shift keying, chosen for its robustness to noise",
        "Band-pass filtering to isolate the useful band from ambient noise",
        "Validated by numerical modelling before any hardware build",
      ],
    },
    pipeline: [
      {
        id: "wave",
        title: { fr: "Ce qu'est une onde", en: "What a wave is" },
        body: {
          fr: "Point de départ : amplitude, fréquence, phase. Trois grandeurs, et donc trois façons de transporter de l'information dans un son. Choisir laquelle est la première décision du projet, et elle dépend entièrement de ce que le canal va abîmer.",
          en: "Starting point: amplitude, frequency, phase. Three quantities, and therefore three ways of carrying information inside a sound. Choosing which one is the project's first decision, and it depends entirely on what the channel will damage.",
        },
      },
      {
        id: "modulate",
        title: { fr: "Coder les bits en fréquences", en: "Coding bits as frequencies" },
        body: {
          fr: "La modulation FSK associe une fréquence à chaque état binaire : un ton grave pour le 0, un ton aigu pour le 1. Ce choix n'est pas arbitraire. Un bruit ambiant fait varier l'amplitude en permanence, et une modulation d'amplitude y perdrait ses bits, alors qu'il déplace beaucoup plus rarement une fréquence.",
          en: "FSK modulation assigns a frequency to each binary state: a low tone for 0, a high tone for 1. That choice is not arbitrary. Ambient noise varies amplitude constantly, and amplitude modulation would lose its bits to it, whereas it far more rarely shifts a frequency.",
        },
      },
      {
        id: "channel",
        title: { fr: "Traverser le canal", en: "Crossing the channel" },
        body: {
          fr: "Entre le micro et l'oreille, le signal ramasse tout ce qui traîne : bruit de fond, réverbération, atténuation. C'est ce que la modélisation permet d'ajouter volontairement, en quantité choisie, pour voir à partir de quel niveau la transmission cesse de fonctionner.",
          en: "Between microphone and ear, the signal picks up everything lying around: background noise, reverberation, attenuation. That is what the model lets you add deliberately, in chosen amounts, to see at what level transmission stops working.",
        },
      },
      {
        id: "filter",
        title: { fr: "Filtrer avant de décider", en: "Filter before deciding" },
        body: {
          fr: "Un filtre passe-bande ne garde que la portion du spectre où vivent nos deux tons et écarte le reste. L'étude de la réponse fréquentielle sert exactement à ça : savoir ce qu'un filtre laisse passer et ce qu'il coupe, avant de s'en servir.",
          en: "A band-pass filter keeps only the slice of spectrum where our two tones live and discards the rest. Studying the frequency response is exactly for that: knowing what a filter passes and what it cuts, before relying on it.",
        },
      },
      {
        id: "decide",
        title: { fr: "Décider bit par bit", en: "Deciding bit by bit" },
        body: {
          fr: "Sur chaque intervalle, on compare l'énergie présente autour des deux fréquences et on tranche : celle qui domine donne le bit. Une décision simple, mais qui n'est fiable que parce que tout ce qui précède a fait son travail.",
          en: "On each interval, the energy present around the two frequencies is compared and a call is made: whichever dominates gives the bit. A simple decision, reliable only because everything before it did its job.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Mise en situation : un agent est enfermé dans une pièce et ne dispose que d'un micro pour transmettre un message. Il faut concevoir la chaîne de transmission complète qui rend ça possible, puis la modéliser numériquement pour démontrer qu'elle tient. Le sujet est fictif ; les questions qu'il pose ne le sont pas : c'est exactement ce qu'on résout pour faire passer des données sur un canal qu'on ne maîtrise pas.",
          en: "A scenario: an agent is locked in a room with only a microphone to send a message. The task is to design the full transmission chain that makes it possible, then model it numerically to show it holds up. The premise is fictional; the questions it raises are not: this is exactly what you solve to push data through a channel you do not control.",
        },
      },
      {
        id: "why-fsk",
        title: {
          fr: "Pourquoi la fréquence plutôt que l'amplitude",
          en: "Why frequency rather than amplitude",
        },
        body: {
          fr: "C'est la décision structurante du projet, et elle se déduit du canal. Le son transporte de l'information par trois grandeurs, mais un canal bruité ne les abîme pas de la même façon.",
          en: "This is the project's structural decision, and it follows from the channel. Sound carries information through three quantities, but a noisy channel does not damage them equally.",
        },
        bullets: {
          fr: [
            "L'amplitude est ce que le bruit perturbe le plus : un bruit de fond s'additionne directement au niveau du signal",
            "La phase est précise mais fragile : la moindre réverbération la décale, et une pièce fermée en produit beaucoup",
            "La fréquence, elle, survit : un écho arrive plus tard et moins fort, mais il arrive à la même fréquence",
            "D'où la FSK : deux tons bien séparés, dont on cherche lequel domine plutôt que de mesurer un niveau",
          ],
          en: [
            "Amplitude is what noise disturbs most: background noise adds directly to the signal level",
            "Phase is precise but fragile: the slightest reverberation shifts it, and a closed room produces plenty",
            "Frequency survives: an echo arrives later and quieter, but it arrives at the same frequency",
            "Hence FSK: two well-separated tones, where you look for which dominates rather than measuring a level",
          ],
        },
      },
      {
        id: "modelling",
        title: {
          fr: "Modéliser plutôt que bricoler",
          en: "Modelling rather than tinkering",
        },
        body: {
          fr: "Toute la chaîne a été écrite en Python avant d'exister sous forme de matériel. L'intérêt n'est pas la commodité : c'est de pouvoir faire varier une seule chose à la fois. On fixe le niveau de bruit, on change la largeur du filtre, on compte les bits perdus. Avec un montage réel, on n'aurait jamais su si l'amélioration venait du filtre ou d'un couloir plus silencieux ce jour-là.",
          en: "The whole chain was written in Python before existing as hardware. The point is not convenience: it is being able to vary one thing at a time. Fix the noise level, change the filter width, count the lost bits. With a real build you would never know whether the improvement came from the filter or from a quieter corridor that day.",
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Le choix d'une modulation se déduit du canal, pas du confort de calcul",
            "Un filtre se conçoit à partir d'une réponse fréquentielle, pas à l'oreille",
            "Modéliser permet d'isoler une variable, ce qu'une manip réelle interdit",
            "Le même réflexe m'a resservi sur la caméra PTZ : mesurer avant d'optimiser",
          ],
          en: [
            "The choice of a modulation follows from the channel, not from what is easy to compute",
            "A filter is designed from a frequency response, not by ear",
            "Modelling lets you isolate one variable, which a real setup never allows",
            "The same reflex served me again on the PTZ camera: measure before optimising",
          ],
        },
      },
    ],
  },
];

/**
 * Ordre d'affichage de la grille, du plus représentatif au plus ancien.
 * Écrit à la main : la pertinence ne se déduit ni d'une date ni du drapeau
 * `featured`.
 */
const displayOrder = [
  "camera-ptz",
  "breezy",
  "easysave",
  "tsp-resolver",
  "stagelink",
  "qualite-air",
  "station-meteo",
  "traitement-signal",
  "strongbox",
];

const rank = (slug: string) => {
  const i = displayOrder.indexOf(slug);
  // Un projet ajouté sans être classé passe à la fin plutôt qu'en tête.
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

export const orderedProjects = [...projects].sort(
  (a, b) => rank(a.slug) - rank(b.slug),
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const projectSlugs = projects.map((p) => p.slug);
