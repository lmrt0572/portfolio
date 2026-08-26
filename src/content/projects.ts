import type { Project } from "./types";

/**
 * Source unique de vérité des projets. L'ordre du tableau est l'ordre d'affichage.
 * Ajouter un projet = ajouter une entrée ici, rien d'autre.
 */
export const projects: Project[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "tourelle-ia",
    featured: true,
    status: "ongoing",
    confidential: true,
    period: { fr: "Depuis 2025", en: "Since 2025" },
    title: {
      fr: "Tourelle vidéo pilotée par IA",
      en: "AI-driven video turret",
    },
    tagline: {
      fr: "Détection et suivi de cibles maritimes en temps réel, avec asservissement d'une caméra PTZ.",
      en: "Real-time maritime target detection and tracking, with closed-loop PTZ camera control.",
    },
    context: { fr: "Thales LAS ACR · Alternance", en: "Thales LAS ACR · Apprenticeship" },
    domain: "computer-vision",
    stack: [
      "Python",
      "PyTorch",
      "TensorRT",
      "OpenCV",
      "RF-DETR",
      "RT-DETR",
      "CVAT",
      "Docker",
      "Linux",
    ],
    cover: {
      src: "/images/pocptz.jpg",
      width: 1024,
      height: 559,
      alt: {
           },
    },
    facts: [
      {
        label: { fr: "Rôle", en: "Role" },
        value: {
          fr: "Alternant ingénieur — conception et mise en œuvre de la chaîne",
          en: "Apprentice engineer — pipeline design and implementation",
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
        label: { fr: "Domaine", en: "Field" },
        value: {
          fr: "Surveillance maritime, imagerie temps réel",
          en: "Maritime surveillance, real-time imaging",
        },
      },
      {
        label: { fr: "Environnement", en: "Environment" },
        value: {
          fr: "Serveur Linux isolé du réseau",
          en: "Air-gapped Linux server",
        },
      },
    ],
    highlights: {
      fr: [
        "Chaîne complète en boucle fermée : acquisition, détection, suivi, commande de la tourelle",
        "Trois détecteurs transformer comparés sur les images du site, ByteTrack et filtre de Kalman pour le suivi",
        "Inférence temps réel optimisée, déployée sur un poste sans accès à Internet",
        "Le facteur limitant identifié par la mesure : la disponibilité de la détection, pas la commande",
      ],
      en: [
        "Full closed-loop pipeline: capture, detection, tracking, turret control",
        "Three transformer detectors compared on site imagery, ByteTrack and a Kalman filter for tracking",
        "Optimised real-time inference, deployed on a machine with no internet access",
        "The limiting factor identified by measurement: detection availability, not camera control",
      ],
    },
    pipeline: [
      {
        id: "capture",
        title: { fr: "Acquisition", en: "Capture" },
        body: {
          fr: "La caméra diffuse sa vidéo en RTSP. Trois bibliothèques de décodage ont été essayées avant d'en retenir une qui accepte les flux aux en-têtes mal formés — fréquents sur le matériel de terrain — et qui donne un accès réel au transport et au tampon réseau, les deux réglages qui décident de la latence. Un décodeur unique alimente à la fois l'affichage et l'analyse.",
          en: "The camera streams over RTSP. Three decoding libraries were tried before settling on one that accepts malformed stream headers — common on field hardware — and gives real access to transport and network buffering, the two settings that determine latency. A single decoder feeds both display and analysis.",
        },
      },
      {
        id: "detect",
        title: { fr: "Détection", en: "Detection" },
        body: {
          fr: "Un détecteur de la famille DETR localise les embarcations, du cargo au jet-ski. Trois architectures ont été comparées sur les images du site — et non sur un jeu public, où leurs scores trop proches ne les départageaient plus. Le seuil de confiance est un arbitrage : assez bas pour que les petites cibles ne disparaissent pas des trajectoires, assez haut pour que l'écran reste lisible.",
          en: "A DETR-family detector locates vessels, from cargo ship to jet ski. Three architectures were compared on site imagery — not on a public set, where their scores sat too close to separate them. The confidence threshold is a trade-off: low enough that small targets do not drop out of tracks, high enough that the screen stays readable.",
        },
      },
      {
        id: "track",
        title: { fr: "Suivi", en: "Tracking" },
        body: {
          fr: "ByteTrack prédit où chaque cible devrait se trouver grâce à un filtre de Kalman, puis associe les nouvelles détections aux pistes existantes. Le filtre rend un second service, moins attendu : la boîte de détection tremble d'une image à l'autre même sur une cible immobile, et le lissage donne à l'asservissement une consigne stable au lieu d'une consigne qui vibre. Un filtre écarte les détections qui restent trop longtemps au même endroit — sans lui, le suivi s'accroche à une bouée, cible idéale du point de vue du détecteur, plutôt qu'au jet-ski visé.",
          en: "ByteTrack predicts where each target should be using a Kalman filter, then matches new detections to existing tracks. The filter renders a second, less expected service: the detection box jitters between frames even on a stationary target, and smoothing gives the control loop a steady set-point instead of a vibrating one. A filter discards detections that stay too long in one place — without it, tracking latches onto a buoy, an ideal target from the detector's point of view, rather than the jet ski being followed.",
        },
      },
      {
        id: "servo",
        title: { fr: "Asservissement", en: "Camera control" },
        body: {
          fr: "L'écart entre la cible et le centre de l'image devient une vitesse de rotation, envoyée en ONVIF — un standard, pour que le système fonctionne avec d'autres caméras que celle installée. Le terrain a imposé quatre ajouts au régulateur proportionnel de départ : deux régimes de gain, une zone morte pour ne pas réagir au tremblement de la détection, une hystérésis pour ne pas sautiller à sa frontière, et une compensation du zoom — un réglage valable au grand-angle rend le système instable au téléobjectif. Le rapport entre les gains n'a pas été réglé à l'œil mais par une procédure de calibration, pointée sur une zone bâtie car sur la mer elle aurait mesuré le mouvement des vagues.",
          en: "The gap between target and frame centre becomes a rotation speed, sent over ONVIF — a standard, so the system works with cameras other than the one installed. The field imposed four additions to the initial proportional controller: two gain regimes, a dead band so it does not react to detection jitter, hysteresis so it does not stutter at that band's edge, and zoom compensation — a setting valid at wide angle makes the system unstable at full telephoto. The ratio between gains was not eyeballed but set by a calibration procedure, aimed at a built-up area because over the sea it would have measured the waves.",
        },
      },
      {
        id: "learn",
        title: { fr: "Apprentissage actif", en: "Active learning" },
        body: {
          fr: "Les corrections apportées par l'opérateur en cours d'utilisation sont capturées et réinjectées dans le jeu d'entraînement. Le système se spécialise sur les conditions réelles de son déploiement au lieu de rester figé sur la distribution du dataset initial.",
          en: "Corrections made by the operator during use are captured and fed back into the training set. The system specialises on the real conditions of its deployment instead of staying frozen on the initial dataset distribution.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Preuve de concept menée dans le cadre de mon alternance d'ingénieur chez Thales LAS ACR : démontrer qu'une tourelle vidéo peut détecter, classifier et suivre automatiquement des cibles en milieu maritime, sans qu'un opérateur ait à garder les yeux sur l'écran en permanence. L'enjeu n'est pas de remplacer l'opérateur mais de lui rendre son attention : la machine surveille en continu, l'humain arbitre.",
          en: "A proof of concept built during my engineering apprenticeship at Thales LAS ACR: showing that a video turret can automatically detect, classify and track targets in a maritime environment, without an operator having to watch the screen continuously. The goal is not to replace the operator but to give their attention back: the machine watches continuously, the human decides.",
        },
      },
      {
        id: "difficulty",
        title: {
          fr: "Pourquoi la mer est un cas difficile",
          en: "Why the sea is a hard case",
        },
        body: {
          fr: "La détection d'objets sur une scène maritime ne ressemble pas à de la détection sur route ou en intérieur. Le fond n'est jamais deux fois le même, et plusieurs difficultés se cumulent.",
          en: "Object detection on a maritime scene is nothing like detection on roads or indoors. The background is never the same twice, and several difficulties compound.",
        },
        bullets: {
          fr: [
            "Fond mouvant : la houle crée des motifs qui bougent et changent en permanence, sans jamais constituer un objet",
            "Reflets spéculaires : le soleil sur l'eau produit des taches très lumineuses qui saturent le capteur et masquent les cibles",
            "Écart d'échelle considérable : une même classe de bateau occupe quelques pixels à l'horizon et une bonne partie de l'image à courte distance",
            "Horizon instable : la ligne d'horizon se déplace dans l'image dès que la caméra bouge ou que le porteur tangue",
            "Sillages et écume : traînées mobiles, souvent confondues avec des objets par un modèle mal entraîné",
            "Conditions de lumière très variables : contre-jour, brume, crépuscule, pluie",
          ],
          en: [
            "Moving background: swell creates patterns that shift constantly without ever being an object",
            "Specular reflections: sun on water produces very bright patches that saturate the sensor and hide targets",
            "Huge scale range: the same boat class occupies a few pixels at the horizon and much of the frame up close",
            "Unstable horizon: the horizon line moves within the frame as soon as the camera turns or the platform rolls",
            "Wakes and foam: moving trails, easily mistaken for objects by an undertrained model",
            "Highly variable light: backlight, haze, dusk, rain",
          ],
        },
      },
      {
        id: "dataset",
        title: {
          fr: "Le jeu de données, d'abord",
          en: "The dataset comes first",
        },
        body: {
          fr: "Deux sources alimentent le modèle. Un jeu public de scènes maritimes annotées apprend à quoi ressemble un bateau en général ; les enregistrements du site, annotés à la main sous CVAT, apprennent à quoi il ressemble ici. C'est la seconde qui compte : le jeu public a été filmé dans un port tropical, mer calme et ciel dégagé, quand nous observons la Manche avec de la houle, du brouillard, de la pluie et des contre-jours. Un modèle entraîné uniquement dessus reste excellent dans des conditions qu'il ne rencontrera jamais.",
          en: "Two sources feed the model. A public set of annotated maritime scenes teaches what a boat looks like in general; recordings from the site, hand-annotated in CVAT, teach what one looks like here. The second is what counts: the public set was filmed in a tropical harbour, calm sea and clear sky, while we watch the Channel with swell, fog, rain and backlight. A model trained on it alone stays excellent in conditions it will never meet.",
        },
        bullets: {
          fr: [
            "L'annotation reste sur un serveur local : les images du site ne sortent jamais de l'entreprise",
            "Répartition par vidéo entière et non image par image — deux images consécutives se ressemblent trop, et les répartir au hasard revient à évaluer le modèle sur ce qu'il a déjà vu",
            "Le score obtenu est plus bas, mais c'est celui qui prédit le comportement sur une scène nouvelle",
            "Du flou de mouvement est ajouté à une partie des images : nos vidéos sont floues dès que la caméra pivote, le jeu public est filmé caméra fixe",
            "Les corrections faites par l'opérateur pendant l'exploitation reviennent dans le jeu d'entraînement",
          ],
          en: [
            "Annotation stays on a local server: site images never leave the company",
            "Split by whole video rather than by frame — consecutive frames are far too similar, and splitting at random amounts to evaluating the model on what it has already seen",
            "The resulting score is lower, but it is the one that predicts behaviour on a new scene",
            "Motion blur is added to part of the training images: our footage blurs as soon as the camera pans, the public set is shot on a fixed camera",
            "Corrections made by the operator during use flow back into the training set",
          ],
        },
      },
      {
        id: "models",
        title: {
          fr: "Pourquoi ce détecteur, et pourquoi ce tracker",
          en: "Why this detector, and why this tracker",
        },
        body: {
          fr: "Trois critères, fixés avant de comparer quoi que ce soit : voir des cibles minuscules, tenir le temps réel sur le matériel disponible, et pouvoir être intégré dans un produit. Le troisième s'est révélé le plus discriminant.",
          en: "Three criteria, set before comparing anything: see tiny targets, hold real time on the available hardware, and be integrable into a product. The third turned out to be the most discriminating.",
        },
        bullets: {
          fr: [
            "Famille DETR plutôt que les détecteurs à ancres : elle produit d'emblée un nombre fixe de prédictions et supprime l'étape de filtrage des doublons — un filtre trop sévère fusionne une bouée et une embarcation alignées, trop permissif il laisse passer des doublons",
            "RF-DETR l'emporte sur RT-DETRv4 et D-FINE sur les images du site, surtout sur les petites cibles, grâce à un extracteur pré-entraîné sans annotations qui demande beaucoup moins d'exemples pour s'adapter",
            "Le classement obtenu sur les images du site est l'inverse de celui obtenu sur le jeu public : un modèle peut être meilleur sur des données publiques et moins bon sur le terrain",
            "ByteTrack conserve les détections de faible score pour une seconde tentative d'association — quand une petite embarcation s'éloigne et que son score chute, sa trajectoire survit",
            "La licence a tranché : BoT-SORT, plus performant sur le papier, est sous AGPL-3.0, ce qui obligerait à publier le code de tout produit l'intégrant. Même raisonnement pour les versions récentes de YOLO. Toutes les briques retenues sont sous Apache 2.0 ou équivalent",
          ],
          en: [
            "The DETR family rather than anchor-based detectors: it emits a fixed number of predictions outright and removes the duplicate-filtering step — too strict a filter merges an aligned buoy and vessel, too permissive it lets duplicates through",
            "RF-DETR beats RT-DETRv4 and D-FINE on site images, especially on small targets, thanks to a backbone pre-trained without annotations that needs far fewer examples to adapt",
            "The ranking on site images is the reverse of the ranking on the public set: a model can be better on public data and worse in the field",
            "ByteTrack keeps low-score detections for a second association attempt — when a small vessel moves away and its score drops, its track survives",
            "Licensing settled it: BoT-SORT, stronger on paper, is AGPL-3.0, which would force publishing the source of any product embedding it. Same reasoning for recent YOLO releases. Every brick retained is Apache 2.0 or equivalent",
          ],
        },
      },
      {
        id: "realtime",
        title: {
          fr: "Le terrain impose ses arbitrages",
          en: "The field imposes its trade-offs",
        },
        body: {
          fr: "Plusieurs décisions n'ont rien d'élégant sur le papier et se sont imposées à l'usage. Elles disent mieux que tout le reste ce que « temps réel » signifie dans une boucle fermée.",
          en: "Several decisions look inelegant on paper and imposed themselves in use. They say better than anything else what \"real time\" means inside a closed loop.",
        },
        bullets: {
          fr: [
            "Transport vidéo en UDP plutôt qu'en TCP : en TCP, un paquet perdu bloque tout le flux le temps d'être retransmis, et l'image gèle — systématiquement pendant les mouvements de tourelle, quand le débit augmente d'un coup. Pour une boucle d'asservissement, une image un peu abîmée vaut mieux qu'une image figée, car un gel fige aussi la commande",
            "Un seul décodeur alimente l'affichage et l'analyse : avec deux, l'opérateur voit une image légèrement différente de celle que le système analyse, ce qui pose problème au moment de désigner une cible en cliquant dessus",
            "Découpage de l'image en quadrants pour agrandir les petites cibles : le gain est réel, mais la cadence tombe de plus de moitié. Désactivé — une détection plus précise qui arrive trop tard dégrade le suivi au lieu de l'améliorer",
            "Accélération par TensorRT en calculant sur 16 bits au lieu de 32 : vérification faite, la précision est intégralement conservée, y compris sur les petites cibles déjà fragiles",
          ],
          en: [
            "UDP rather than TCP for video transport: in TCP a lost packet stalls the whole stream until it is resent, and the picture freezes — systematically during turret movement, when bitrate spikes. For a control loop a slightly damaged frame beats a frozen one, because a freeze also freezes the command",
            "One decoder feeds both display and analysis: with two, the operator sees a slightly different frame from the one the system analyses, which matters the moment you designate a target by clicking on it",
            "Splitting the frame into quadrants to enlarge small targets: the gain is real, but the detection rate more than halves. Disabled — a more accurate detection arriving too late degrades tracking instead of improving it",
            "TensorRT acceleration computing in 16 bits instead of 32: verified, accuracy is fully preserved, including on the already fragile small targets",
          ],
        },
      },
      {
        id: "finding",
        title: {
          fr: "Identifier le vrai maillon faible",
          en: "Identifying the real weak link",
        },
        body: {
          fr: "Le système suit correctement une embarcation de taille normale mais décroche sur les cibles petites et rapides. Restait à savoir lequel des trois maillons en était responsable : la détection, le suivi ou la commande. Mon intuition désignait le régulateur, supposé trop lent pour un jet-ski. L'analyse des enregistrements a montré l'inverse : plus la détection a de trous, plus les poursuites sont courtes et hachées, mais ces trous n'expliquent en rien l'écart au centre de l'image. Quand la cible est détectée, la caméra vise juste. Le système ne perd pas la cible parce qu'il la vise mal ; il la vise mal par moments parce qu'il ne la voit pas assez souvent.",
          en: "The system follows a normal-sized vessel correctly but loses small, fast targets. Which of the three links was responsible — detection, tracking or control? My instinct pointed at the controller, presumed too slow for a jet ski. Analysing the recordings showed the opposite: the more gaps in detection, the shorter and choppier the pursuits, yet those gaps explain nothing about the off-centre error. When the target is detected, the camera aims true. The system does not lose the target because it aims badly; it aims badly at times because it does not see it often enough.",
        },
        bullets: {
          fr: [
            "L'effort est passé du réglage de la commande à la disponibilité de la détection",
            "Un projet non instrumenté aurait optimisé le régulateur, avec conviction et sans effet",
            "C'est le protocole de mesure reproductible qui a permis de désigner le facteur limitant, pas l'intuition",
            "Deux outils ont rendu ce protocole possible : l'enregistrement des sessions, pour rejouer la même scène avec deux réglages — la mer et la lumière ne sont jamais deux fois les mêmes —, et un banc de réglage intégré pour changer un paramètre sans redémarrer",
          ],
          en: [
            "Effort moved from tuning the controller to detection availability",
            "An uninstrumented project would have optimised the controller, with conviction and no effect",
            "It was the reproducible measurement protocol that identified the limiting factor, not intuition",
            "Two tools made that protocol possible: session recording, to replay the same scene with two settings — sea and light are never the same twice — and an in-app tuning bench to change a parameter without restarting",
          ],
        },
      },
      {
        id: "limit",
        title: {
          fr: "Une limite assumée plutôt que masquée",
          en: "A limit owned rather than hidden",
        },
        body: {
          fr: "Pour qu'une détection serve au-delà de l'écran, il faut savoir dans quelle direction la caméra regarde. Le protocole ONVIF prévoit une requête qui renvoie la position de la tourelle, et la solution semblait immédiate. Mes essais ont montré que cette caméra renvoie toujours la même valeur, même en rotation : la fonction existe dans le standard, le constructeur ne l'alimente pas. La conformité à un standard garantit qu'une requête sera acceptée et qu'une réponse arrivera, pas que la valeur qu'elle contient soit réelle.",
          en: "For a detection to be useful beyond the screen, you need to know where the camera is pointing. The ONVIF protocol provides a request returning the turret's position, so the solution looked immediate. My tests showed this camera always returns the same value, even while turning: the function exists in the standard, the manufacturer does not populate it. Conforming to a standard guarantees a request will be accepted and an answer will arrive, not that the value inside is real.",
        },
        bullets: {
          fr: [
            "Quatre autres pistes étudiées, contre trois critères fixés à l'avance : rester fiable dans le temps, ne dépendre d'aucun autre logiciel, n'ouvrir aucun nouvel accès sur le réseau du site",
            "Aucune ne remplissait les trois — la fonction a été retirée du périmètre livré plutôt que fournie avec une fiabilité douteuse",
            "L'interface n'affiche donc aucune direction : elle ne montre que ce que le système sait garantir",
            "Le coût est réel, puisqu'on ne peut pas encore remonter de position géographique vers la supervision, mais il est documenté plutôt que caché derrière un chiffre faux",
          ],
          en: [
            "Four other routes studied, against three criteria set in advance: stay reliable over time, depend on no other software, open no new access on the site network",
            "None met all three — the function was removed from the delivered scope rather than shipped with doubtful reliability",
            "The interface therefore displays no bearing: it shows only what the system can guarantee",
            "The cost is real, since no geographic position can yet be pushed to the supervision system, but it is documented rather than hidden behind a false number",
          ],
        },
      },
      {
        id: "deploy",
        title: {
          fr: "Déployer sur une machine coupée du réseau",
          en: "Deploying on a machine with no network",
        },
        body: {
          fr: "Le système tourne sur un serveur isolé du réseau. Cette contrainte, banale à énoncer, change beaucoup de choses en pratique : plus de `pip install` au moment du déploiement, plus de poids de modèle téléchargés à la volée, plus de correctif de dernière minute. Tout doit être figé, transporté et rejouable à l'identique — ce qui oblige à une rigueur sur les versions et les dépendances qu'un environnement connecté pardonne facilement.",
          en: "The system runs on an air-gapped server. That constraint is trivial to state and changes a great deal in practice: no `pip install` at deployment time, no model weights fetched on the fly, no last-minute patch. Everything has to be frozen, carried over and reproducible exactly — which forces a discipline about versions and dependencies that a connected environment forgives easily.",
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Mesurer avant de décider : mon réflexe était de modifier le code puis de juger à l'œil. Une boucle fermée ne se juge pas ainsi — sans protocole reproductible, on optimise ce qu'on sait mesurer plutôt que ce qui limite",
            "Des bases d'automatique acquises sur le terrain : gain, zone morte, hystérésis, retard de boucle — des notions que je n'avais jamais manipulées concrètement",
            "La chaîne de vision complète, de la constitution du jeu de données au moteur d'inférence optimisé",
            "Un critère que je n'avais jamais considéré : la licence. Qu'une bibliothèque performante soit inutilisable en contexte industriel à cause de sa licence a été un vrai apprentissage",
            "Assumer une limite plutôt que la masquer, quitte à réduire le périmètre livré",
          ],
          en: [
            "Measure before deciding: my instinct was to change the code then judge by eye. A closed loop cannot be judged that way — without a reproducible protocol you optimise what you can measure rather than what limits you",
            "Control-theory basics learned in the field: gain, dead band, hysteresis, loop delay — notions I had never handled concretely",
            "The full vision pipeline, from building the dataset to the optimised inference engine",
            "A criterion I had never considered: licensing. That a high-performing library can be unusable in an industrial context because of its licence was a real lesson",
            "Owning a limit rather than hiding it, even at the cost of a narrower delivered scope",
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
      src: "/images/breezyy.jfif",
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
      // Version réencodée : l'original faisait 144 Mo avec son index en fin de
      // fichier, ce qui obligeait le navigateur à tout parcourir avant la
      // première image.
      mp4: "/videos/breezy-demo.mp4",
      poster: "/images/breezy-poster.jpg",
      // Rapport exact de l'enregistrement (capture de fenêtre) : annoncer 16/9
      // ajouterait des bandes noires en haut et en bas.
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
          fr: "Tout passe par une passerelle Nginx sur le port 80 : l'interface comme les API. Elle porte ce qui n'a pas à être réécrit dans six services — la politique CORS, avec une liste d'origines autorisées, et la limitation de débit, réglée à 30 requêtes par seconde en général mais à 2 sur la connexion et l'inscription, là où on tente les mots de passe.",
          en: "Everything goes through an Nginx gateway on port 80: the interface as well as the APIs. It carries what should not be rewritten in six services — the CORS policy, with an allowlist of origins, and rate limiting, set to 30 requests per second in general but 2 on login and registration, where passwords get guessed.",
        },
      },
      {
        id: "auth",
        title: { fr: "Prouver qui l'on est", en: "Proving who you are" },
        body: {
          fr: "Le service Auth vérifie le mot de passe, haché avec bcrypt, et signe un JWT. Pour les pages protégées, la passerelle ne devine rien : elle sous-traite la validation au service Auth avant de servir la page. Chaque service métier revérifie ensuite le jeton de son côté — aucun ne fait confiance à son appelant.",
          en: "The Auth service checks the password, hashed with bcrypt, and signs a JWT. For protected pages the gateway guesses nothing: it delegates validation to the Auth service before serving the page. Each business service then re-checks the token on its own — none of them trusts its caller.",
        },
      },
      {
        id: "domain",
        title: { fr: "Le service concerné répond", en: "The relevant service answers" },
        body: {
          fr: "Six domaines, six services, six bases : Auth et User sur PostgreSQL, Post, Message, Media et Notification sur MongoDB. Un domaine qui tombe n'emporte pas les autres — un service Média indisponible empêche d'ajouter une image, pas de lire le flux.",
          en: "Six domains, six services, six databases: Auth and User on PostgreSQL, Post, Message, Media and Notification on MongoDB. A domain going down does not take the others with it — an unavailable Media service stops image uploads, not feed reading.",
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
          fr: "Notification et Message tiennent chacun une connexion WebSocket ouverte vers le navigateur. La notification apparaît sans rechargement, le message privé arrive pendant qu'on écrit — sans que l'interface ait à interroger le serveur en boucle.",
          en: "Notification and Message each hold an open WebSocket to the browser. The notification shows up with no reload, the direct message arrives while you type — without the interface polling the server in a loop.",
        },
      },
    ],
    sections: [
      {
        id: "product",
        title: { fr: "Ce que fait l'application", en: "What the application does" },
        body: {
          fr: "Breezy fait ce qu'on attend d'un réseau social court : publier des posts et y répondre, aimer, suivre des comptes, chercher par contenu ou par tag, joindre images et vidéos, s'écrire en privé, recevoir des notifications. Les droits sont portés par quatre rôles — visiteur, utilisateur, modérateur, administrateur — et une vingtaine de permissions nommées, ce qui permet d'activer ou de couper une fonctionnalité sans toucher au code.",
          en: "Breezy does what a short-form social network is expected to do: publish posts and reply to them, like, follow accounts, search by content or tag, attach images and video, message privately, receive notifications. Rights are carried by four roles — visitor, user, moderator, administrator — and around twenty named permissions, which makes it possible to switch a feature on or off without touching the code.",
        },
      },
      {
        id: "context",
        title: { fr: "La contrainte du module", en: "The module's constraint" },
        body: {
          fr: "Le sujet imposait une architecture réellement distribuée, pas un monolithe déguisé en services. La difficulté n'est pas d'écrire six serveurs Express : c'est de choisir où passent les frontières, puis d'assumer ce que ce découpage coûte — une requête qui traverse trois processus, un état qui n'est plus partagé, des services qui démarrent dans le désordre.",
          en: "The brief called for a genuinely distributed architecture, not a monolith dressed up as services. The hard part is not writing six Express servers: it is choosing where the boundaries fall, then living with what that split costs — a request crossing three processes, state that is no longer shared, services starting in any order.",
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
            "PostgreSQL pour Auth et User : des comptes, des rôles, des permissions et des relations de suivi — des tables, des clés étrangères et des contraintes d'unicité, exactement ce qu'un moteur relationnel garantit mieux que du code applicatif",
            "MongoDB pour Post, Message, Media et Notification : des documents qui varient d'un cas à l'autre — un post avec ou sans média, avec ou sans réponses — et qu'on lit presque toujours en entier",
            "Chaque service possède sa base et personne d'autre n'y touche : c'est cette règle, plus que le découpage du code, qui rend les services réellement indépendants",
          ],
          en: [
            "PostgreSQL for Auth and User: accounts, roles, permissions and follow relations — tables, foreign keys and uniqueness constraints, exactly what a relational engine guarantees better than application code",
            "MongoDB for Post, Message, Media and Notification: documents that vary case by case — a post with or without media, with or without replies — and that are almost always read whole",
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
            "Elle applique un débit maximal différent selon la route — une limite globale, et une limite bien plus basse sur connexion et inscription",
            "Elle centralise la politique CORS : une origine non autorisée ne reçoit aucun en-tête et se fait bloquer par le navigateur",
            "Elle délègue la validation des jetons au service Auth pour les pages protégées, au lieu de reproduire une logique de sécurité dans la configuration",
          ],
          en: [
            "It resolves service names on every request rather than at startup: without that, a service still booting stays unreachable until the gateway restarts",
            "It applies a different rate cap per route — a global limit, and a far lower one on login and registration",
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
            "L'asynchrone n'est pas un détail d'implémentation — passer par un bus change qui dépend de qui",
            "Un environnement complet reproductible en une commande, base de données et bus compris",
            "Travail à quatre sur un dépôt commun, avec revue de code et branches de fonctionnalité",
          ],
          en: [
            "Splitting a domain into services: where to draw boundaries, and the cost of getting it wrong",
            "Asynchrony is not an implementation detail — going through a bus changes who depends on whom",
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
    // Illustration générée, pas une capture : les libellés sont des barres
    // grises et non du texte, pour qu'on ne puisse pas la prendre pour une
    // vraie fenêtre de l'application.
    cover: {
      src: "/images/easysave.jfif",
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
      poster: "/images/easysave.jfif",
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
          fr: "Un travail de sauvegarde tient en trois informations : un dossier source, un dossier cible, et un type — complet, ou différentiel. La liste des travaux est enregistrée dans un fichier de configuration, avec les extensions à chiffrer, celles déclarées prioritaires, le seuil de taille au-delà duquel un fichier est considéré comme volumineux, et le nom du logiciel métier à surveiller.",
          en: "A backup job is three pieces of information: a source folder, a target folder, and a type — full or differential. The job list lives in a configuration file, along with the extensions to encrypt, those declared as priority, the size threshold above which a file counts as large, and the name of the business software to watch for.",
        },
      },
      {
        id: "scan",
        title: { fr: "Parcourir et comparer", en: "Scan and compare" },
        body: {
          fr: "L'arborescence source est parcourue en entier. En sauvegarde complète, tout est retenu ; en différentielle, chaque fichier est comparé à son équivalent dans la cible et n'est retenu que s'il a changé. Les deux comportements sont deux stratégies interchangeables derrière la même interface — c'est ce qui permet d'ajouter un mode sans toucher au moteur.",
          en: "The whole source tree is walked. In a full backup everything is kept; in a differential one, each file is compared with its counterpart in the target and kept only if it changed. The two behaviours are interchangeable strategies behind one interface — which is what makes adding a mode possible without touching the engine.",
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
          fr: "Les fichiers dont l'extension figure dans la configuration sont passés à CryptoSoft, un exécutable séparé qui applique un chiffrement par XOR. Il ne peut s'exécuter qu'en un seul exemplaire à la fois sur la machine — contrainte du cahier des charges, obtenue par un verrou nommé au niveau du système et non du processus.",
          en: "Files whose extension appears in the configuration are handed to CryptoSoft, a separate executable applying XOR encryption. Only one instance may run at a time on the machine — a requirement of the brief, enforced by a named lock at system level rather than process level.",
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
          fr: "EasySave sauvegarde des dossiers, sur demande ou avant une opération risquée. L'utilisateur déclare des travaux, les lance depuis un tableau de bord, et suit leur avancement fichier par fichier. Certaines extensions sont chiffrées au passage, tout est journalisé, et le logiciel s'interrompt de lui-même si l'application métier de l'entreprise démarre — parce qu'une sauvegarde n'a pas à ralentir le travail de quelqu'un.",
          en: "EasySave backs up folders, on demand or before a risky operation. The user declares jobs, launches them from a dashboard, and follows their progress file by file. Some extensions get encrypted along the way, everything is logged, and the software pauses itself if the company's business application starts — because a backup has no business slowing someone down.",
        },
      },
      {
        id: "context",
        title: { fr: "La contrainte du module", en: "The module's constraint" },
        body: {
          fr: "Le sujet imposait une contrainte plus intéressante que le produit : livrer trois versions successives pour un éditeur fictif, ProSoft, en faisant évoluer l'architecture à chaque itération sans réécrire depuis zéro. Chaque version arrivait avec son propre cahier des charges, découvert seulement une fois la précédente livrée — donc impossible d'anticiper en concevant tout d'avance.",
          en: "The brief imposed a constraint more interesting than the product: deliver three successive versions for a fictional client, ProSoft, evolving the architecture at each iteration without rewriting from scratch. Each version came with its own requirements, revealed only once the previous one had shipped — so designing everything upfront was not an option.",
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
            "v1, console — le moteur : parcours des dossiers, sauvegarde complète ou différentielle, chiffrement par extension, journal quotidien, fichier d'état, interface en français et en anglais. Cinq travaux maximum, exécutés à la suite.",
            "v2, interface graphique — le moteur est extrait dans une bibliothèque partagée par la console et la nouvelle fenêtre WPF, construite en MVVM. La vue ne connaît plus la logique, la journalisation devient un composant à part avec JSON et XML au choix, et le nombre de travaux n'est plus limité.",
            "v3, tableau de bord — tous les travaux s'exécutent en même temps, chacun pilotable individuellement ou tous ensemble, avec les règles qui deviennent nécessaires dès qu'on ne s'exécute plus à la file. Les journaux peuvent partir vers un service conteneurisé.",
          ],
          en: [
            "v1, console — the engine: folder walking, full or differential backup, per-extension encryption, daily log, state file, French and English interface. Five jobs maximum, run one after another.",
            "v2, graphical interface — the engine is extracted into a library shared by the console and the new WPF window, built in MVVM. The view no longer knows the logic, logging becomes a separate component with JSON or XML, and the job limit disappears.",
            "v3, dashboard — every job runs at once, each controllable individually or all together, with the rules that become necessary as soon as things stop running in single file. Logs can be sent to a containerised service.",
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
            "Core — modèles, services, stratégies de sauvegarde et ViewModels : tout ce qui ne dépend d'aucune interface",
            "Console et WPF — deux interfaces sur le même moteur, la seconde ajoutée sans modifier la première",
            "EasyLog — journalisation isolée, avec une stratégie par format d'écriture",
            "CryptoSoft — exécutable de chiffrement séparé, appelé comme un outil externe",
            "LogServer — petite API conteneurisée qui reçoit les journaux de plusieurs postes",
            "Tests — unitaires et d'intégration sur le moteur",
          ],
          en: [
            "Core — models, services, backup strategies and ViewModels: everything that depends on no interface",
            "Console and WPF — two front ends on the same engine, the second added without touching the first",
            "EasyLog — logging kept separate, with one strategy per output format",
            "CryptoSoft — standalone encryption executable, called as an external tool",
            "LogServer — a small containerised API collecting logs from several machines",
            "Tests — unit and integration tests on the engine",
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
            "Chaque travail tourne dans sa propre tâche, avec son jeton d'annulation pour l'arrêt et son signal d'attente pour la pause — qui ne prend effet qu'à la fin du fichier en cours, sinon on laisse une copie à moitié écrite",
            "Les fichiers prioritaires sont arbitrés par un coordinateur partagé entre tous les travaux : aucun fichier ordinaire ne démarre tant qu'une extension prioritaire reste en attente, quel que soit le travail qui la détient",
            "La bande passante est protégée par un sémaphore global : au-delà d'un seuil paramétrable, un seul fichier volumineux circule à la fois",
            "L'outil de chiffrement est verrouillé par un mutex système nommé, donc unique à l'échelle de la machine et pas seulement du processus",
            "Une pause automatique se déclenche si le logiciel métier du client est détecté, avec reprise à sa fermeture",
          ],
          en: [
            "Each job runs in its own task, with a cancellation token for stop and a wait handle for pause — which only takes effect once the current file is done, otherwise you leave a half-written copy behind",
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
          fr: "Le réseau devient un graphe complet dont chaque arête porte un coût réel : péage plus prix du carburant au kilomètre. Deux contraintes viennent du métier — certaines routes sont interdites, et certaines villes doivent être livrées avant d'autres.",
          en: "The network becomes a complete graph where every edge carries a real cost: toll plus fuel price per kilometre. Two constraints come from the field — some roads are closed, and some cities must be delivered before others.",
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
          fr: "Chaque algorithme a d'abord son propre plan d'expérience pour fixer ses paramètres — taux d'évaporation des phéromones, schéma de refroidissement, longueur de la liste tabou. Comparer des méthodes mal réglées ne dit rien sur les méthodes, seulement sur les réglages.",
          en: "Each algorithm first gets its own experimental plan to fix its parameters — pheromone evaporation rate, cooling schedule, tabu list length. Comparing badly tuned methods says nothing about the methods, only about the tuning.",
        },
      },
      {
        id: "measure",
        title: { fr: "Mesurer sur les mêmes graphes", en: "Measure on the same graphs" },
        body: {
          fr: "Un générateur unique à graine fixée produit toutes les instances. Les huit algorithmes affrontent exactement les mêmes graphes, de 5 à 3 000 sommets, à raison de cinq instances par taille — ce qui élimine le biais d'une méthode chanceuse sur des cas faciles.",
          en: "A single seeded generator produces every instance. All eight algorithms face exactly the same graphs, from 5 to 3,000 nodes, with five instances per size — which removes the bias of a method that got lucky on easy cases.",
        },
      },
    ],
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Commande fictive de l'ADEME à CesiCDP : optimiser des tournées de livraison pour réduire la consommation de carburant et les émissions associées. L'instance servant de fil rouge est volontairement concrète — une boucherie qui doit livrer ses commandes de Noël depuis un dépôt à Paris vers Rennes, Rouen, Bordeaux, Toulouse et Lyon.",
          en: "A simulated brief from ADEME to CesiCDP: optimise delivery rounds to cut fuel consumption and the emissions that go with it. The running example is deliberately concrete — a butcher's shop delivering Christmas orders from a Paris depot to Rennes, Rouen, Bordeaux, Toulouse and Lyon.",
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
          fr: "L'appartenance à NP se vérifie sur un certificat — une tournée ordonnée — en temps linéaire : chaque sommet apparaît une fois, aucune arête empruntée n'est interdite, le coût tient sous le seuil, les précédences sont respectées. La difficulté se démontre ensuite par réduction depuis le TSP classique, en posant simplement aucune précédence et aucune route bloquée : le TSP est un cas particulier du nôtre.",
          en: "Membership in NP is checked on a certificate — an ordered tour — in linear time: each node appears once, no edge used is forbidden, the cost stays under the threshold, precedences hold. Hardness then follows by reduction from the classic TSP, simply by setting no precedence and no blocked road: the TSP is a special case of ours.",
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
            "Constructif — Plus Proche Voisin, en variante multi-start",
            "Recherche locale — Hill Climbing multi-start",
            "Solution unique — Recuit simulé, recuit simulé multi-start, recherche tabou, recherche tabou 2-opt",
            "Population — algorithme génétique, colonie de fourmis",
          ],
          en: [
            "Construction — Nearest Neighbour, in a multi-start variant",
            "Local search — multi-start Hill Climbing",
            "Single solution — simulated annealing, multi-start annealing, tabu search, tabu search with 2-opt",
            "Population — genetic algorithm, ant colony optimisation",
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
          fr: "C'est la partie du livrable dont je suis le plus satisfait. Les écarts mesurés sont exprimés par rapport à une borne inférieure volontairement simple — la demi-somme des minima sortants — qui sous-estime largement le coût optimal. Les pourcentages d'écart paraissent donc énormes et ne reflètent pas la qualité réelle des solutions : ils servent à classer les algorithmes entre eux, pas à mesurer une distance à l'optimum.",
          en: "This is the part of the report I am happiest with. The measured gaps are expressed against a deliberately simple lower bound — half the sum of outgoing minima — which badly underestimates the optimal cost. The gap percentages therefore look enormous and do not reflect the true quality of the solutions: they rank the algorithms against each other, they do not measure a distance to the optimum.",
        },
        bullets: {
          fr: [
            "Une borne plus serrée (Held-Karp, relaxation linéaire) donnerait une image bien plus juste",
            "Cinq graines par taille : trop peu pour conclure sous N = 30, où les écarts restent dans le bruit",
            "Paramètres calibrés sur N ≤ 30 : leur transfert aux grandes instances est approximatif, et un pic d'écart vers N ≈ 50 le trahit",
            "Ce pic n'est pas une propriété des algorithmes mais un artefact de notre calibration — le distinguer était l'enjeu de l'analyse",
          ],
          en: [
            "A tighter bound (Held-Karp, linear relaxation) would give a far more accurate picture",
            "Five seeds per size: too few to conclude below N = 30, where differences stay within noise",
            "Parameters tuned on N ≤ 30: transferring them to large instances is approximate, and a gap spike around N ≈ 50 gives it away",
            "That spike is not a property of the algorithms but an artefact of our own tuning — telling the two apart was the point of the analysis",
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
            "Une mesure ne vaut que ce que vaut sa référence — ici, une borne lâche rendait les écarts spectaculaires et peu informatifs",
            "Savoir distinguer un résultat d'un artefact de protocole",
            "Le même réflexe me sert chez Thales : arbitrer précision contre latence sur des mesures dont je connais les limites",
          ],
          en: [
            "Proving a problem's hardness before choosing how to attack it, rather than the other way round",
            "Tuning each method before comparing: otherwise you compare settings, not methods",
            "A measurement is only as good as its reference — here a loose bound made the gaps spectacular and uninformative",
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
      src: "/images/st.png",
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
          fr: "Toutes les requêtes entrent par un fichier unique. Il reconstruit la route depuis l'URL — la forme lisible `/StageLinkV1/offres` comme la forme historique avec un paramètre — puis vérifie qu'une session existe. Sans session et hors des quelques routes publiques, la requête repart vers la page de connexion avant qu'aucun code métier ne s'exécute.",
          en: "Every request enters through a single file. It rebuilds the route from the URL — both the readable `/StageLinkV1/offers` form and the legacy query-parameter form — then checks that a session exists. Without one, and outside a few public routes, the request is sent back to the login page before any business code runs.",
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
          fr: "Les modèles portent l'accès aux données et la logique métier. Toutes les requêtes passent par des requêtes préparées — plus de quatre-vingts dans le projet — ce qui écarte les injections SQL par construction plutôt que par vigilance.",
          en: "Models carry data access and business logic. Every query goes through prepared statements — more than eighty across the project — which rules out SQL injection by construction rather than by vigilance.",
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
          fr: "Les étudiants du CESI cherchent leurs stages en activant leurs réseaux personnels, sans point d'entrée commun. Le sujet demandait une application web complète construite sans framework : ni Symfony, ni Laravel, seulement PHP, un moteur de gabarits et une base MySQL. La contrainte est l'intérêt du projet — elle oblige à écrire soi-même le routage, la séparation des responsabilités et l'accès aux données.",
          en: "CESI students look for internships through personal networks, with no shared entry point. The brief asked for a complete web application built without a framework: no Symfony, no Laravel, only PHP, a template engine and a MySQL database. That constraint is the point of the project — it forces you to write the routing, the separation of concerns and the data access yourself.",
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
            "En place — mots de passe hachés par `password_hash`, qui applique bcrypt",
            "En place — requêtes préparées sur l'ensemble des accès à la base",
            "En place — échappement automatique des variables par Twig, avec deux exceptions explicites sur la pagination",
            "Manquant — aucun jeton anti-CSRF sur les formulaires",
            "Manquant — pas de régénération d'identifiant de session après connexion, donc pas de protection contre la fixation de session",
          ],
          en: [
            "In place — passwords hashed with `password_hash`, which applies bcrypt",
            "In place — prepared statements across every database access",
            "In place — automatic variable escaping by Twig, with two explicit exceptions on pagination",
            "Missing — no anti-CSRF token on forms",
            "Missing — no session ID regeneration after login, so no protection against session fixation",
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
            "Ce qu'un framework apporte vraiment — relire ce code deux ans après le montre mieux que n'importe quel cours",
            "Gestion de version et travail d'équipe sur une base de code partagée",
          ],
          en: [
            "The MVC pattern understood from the inside, without framework magic",
            "Designing a relational schema and a per-profile rights model",
            "What a framework actually buys you — rereading this code two years on shows it better than any lecture",
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
    stack: ["SQL", "MCD / MLD / MPD", "Algèbre relationnelle", "Merise"],
    cover: {
      src: "/images/bddBackground.png",
      width: 1024,
      height: 771,
      alt: { fr: "Schéma de base de données", en: "Database schema" },
    },
    gallery: [
      {
        src: "/images/requete_sql.png",
        alt: { fr: "Requête SQL optimisée", en: "Optimised SQL query" },
      },
      {
        src: "/images/arbre_algebrique.png",
        alt: { fr: "Arbre algébrique d'une requête", en: "Algebraic query tree" },
      },
      {
        src: "/images/arbre_algebrique1.png",
        alt: { fr: "Arbre algébrique optimisé", en: "Optimised algebraic tree" },
      },
    ],
    highlights: {
      fr: [
        "Chaîne de modélisation complète : dictionnaire, MCD, MLD, MPD",
        "Optimisation de requêtes par arbres algébriques",
        "Gestion des agences, du personnel et des capteurs environnementaux",
      ],
      en: [
        "Complete modelling chain: data dictionary, conceptual, logical and physical models",
        "Query optimisation through algebraic trees",
        "Management of agencies, staff and environmental sensors",
      ],
    },
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Commande fictive du ministère de l'écologie : concevoir la base de données d'un système national de suivi de la qualité de l'air — agences, personnel, capteurs déployés, relevés et rapports.",
          en: "A simulated request from the French Ministry of Ecology: design the database for a national air quality monitoring system — agencies, staff, deployed sensors, readings and reports.",
        },
      },
      {
        id: "modelling",
        title: { fr: "La modélisation", en: "Modelling" },
        body: {
          fr: "Le projet suit la chaîne Merise complète : dictionnaire de données, modèle conceptuel, modèle logique, modèle physique. Chaque étape contraint la suivante, ce qui oblige à trancher tôt sur les cardinalités plutôt qu'à bricoler le schéma une fois les requêtes écrites.",
          en: "The project follows the full Merise chain: data dictionary, conceptual model, logical model, physical model. Each stage constrains the next, forcing early decisions on cardinalities rather than patching the schema once queries are written.",
        },
      },
      {
        id: "optimisation",
        title: { fr: "Optimisation des requêtes", en: "Query optimisation" },
        body: {
          fr: "Les requêtes ont été analysées sous forme d'arbres algébriques — jointures, projections, sélections — pour montrer l'effet de l'ordre des opérations sur le volume de données manipulé. Descendre les sélections au plus près des feuilles réduit le coût avant même de toucher aux index.",
          en: "Queries were analysed as algebraic trees — joins, projections, selections — to show how operation order affects the volume of data handled. Pushing selections down towards the leaves cuts cost before indexes even come into play.",
        },
      },
    ],
    documents: [
      {
        href: "/documents/P4_L0.pdf",
        label: { fr: "Livrable 0 — Organisation", en: "Deliverable 0 — Organisation" },
      },
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
    stack: ["C", "Arduino", "Capteurs I2C", "Carte SD"],
    cover: {
      src: "/images/P2_1.png",
      width: 1024,
      height: 1024,
      alt: { fr: "Prototype de station météo", en: "Weather station prototype" },
    },
    gallery: [
      { src: "/images/P2_2.jpg", alt: { fr: "Montage électronique", en: "Electronics assembly" } },
      { src: "/images/P2_3.jpg", alt: { fr: "Câblage des capteurs", en: "Sensor wiring" } },
      { src: "/images/P2_4.jpg", alt: { fr: "Interface de consultation", en: "Readout interface" } },
    ],
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
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Concevoir une station autonome capable de relever et d'enregistrer des paramètres météorologiques en environnement exposé, avec une consultation possible sans matériel externe.",
          en: "Design an autonomous station able to read and log weather parameters in an exposed environment, with readings accessible without external equipment.",
        },
      },
      {
        id: "learned",
        title: { fr: "Ce que j'en retire", en: "What I took away" },
        bullets: {
          fr: [
            "Programmation de microcontrôleur sous contrainte mémoire",
            "Lecture de capteurs et gestion des bus de communication",
            "Persistance fiable des données sur support amovible",
            "Rédaction de documentation destinée à un utilisateur non technique",
          ],
          en: [
            "Microcontroller programming under memory constraints",
            "Sensor reading and communication bus handling",
            "Reliable data persistence on removable media",
            "Writing documentation for a non-technical user",
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
    stack: ["C", "Arduino", "RFID", "Électronique"],
    cover: {
      src: "/images/P1_1.jpg",
      width: 372,
      height: 452,
      alt: { fr: "Prototype du coffre-fort", en: "Safe prototype" },
    },
    gallery: [
      { src: "/images/P1_2.jpg", alt: { fr: "Circuit électronique", en: "Electronic circuit" } },
      { src: "/images/P1_3.jpg", alt: { fr: "Lecteur de carte", en: "Card reader" } },
      { src: "/images/P1_4.jpg", alt: { fr: "Prototype assemblé", en: "Assembled prototype" } },
    ],
    documents: [
      {
        href: "/documents/Projet1Livrable1.pdf",
        label: { fr: "Livrable 1 — Analyse", en: "Deliverable 1 — Analysis" },
      },
      {
        href: "/documents/Projet1Livrable2.pdf",
        label: { fr: "Livrable 2 — Conception", en: "Deliverable 2 — Design" },
      },
      {
        href: "/documents/Projet1Livrable3.pdf",
        label: { fr: "Livrable 3 — Réalisation", en: "Deliverable 3 — Build" },
      },
      {
        href: "/documents/Projet1Livrable4.pdf",
        label: { fr: "Livrable 4 — Bilan", en: "Deliverable 4 — Review" },
      },
    ],
    highlights: {
      fr: [
        "Reconnaissance de cartes électroniques",
        "Second facteur par combinaison d'interrupteurs",
        "Prototype fonctionnel sur Arduino",
      ],
      en: [
        "Electronic card recognition",
        "Second factor through a switch combination",
        "Working Arduino-based prototype",
      ],
    },
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Premier projet de systèmes embarqués : concevoir un coffre-fort dont l'ouverture demande deux facteurs indépendants, une carte reconnue et une combinaison physique, afin qu'aucun des deux ne suffise seul.",
          en: "First embedded systems project: build a safe whose opening requires two independent factors — a recognised card and a physical combination — so that neither alone is enough.",
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
    stack: ["Modulation FSK", "Filtrage fréquentiel", "Analyse spectrale", "Modélisation numérique"],
    cover: {
      src: "/images/signal.jpg",
      width: 780,
      height: 530,
      alt: { fr: "Analyse spectrale d'un signal", en: "Spectral analysis of a signal" },
    },
    gallery: [
      { src: "/images/L2_signal.jpg", alt: { fr: "Réponse fréquentielle", en: "Frequency response" } },
      { src: "/images/L3_signal.jpg", alt: { fr: "Chaîne de transmission", en: "Transmission chain" } },
    ],
    highlights: {
      fr: [
        "Chaîne de transmission complète, de l'émission à la démodulation",
        "Modulation FSK et filtrage fréquentiel",
        "Modélisation numérique pour valider la faisabilité",
      ],
      en: [
        "Complete transmission chain, from emission to demodulation",
        "FSK modulation and frequency filtering",
        "Numerical modelling to validate feasibility",
      ],
    },
    sections: [
      {
        id: "context",
        title: { fr: "Le contexte", en: "Context" },
        body: {
          fr: "Concevoir une solution de communication robuste dans un environnement où les canaux habituels sont indisponibles — situations d'urgence, milieux confinés. Le projet couvre l'étude de la réponse fréquentielle, le filtrage, la modulation FSK et la validation par modélisation numérique.",
          en: "Design a robust communication solution for environments where usual channels are unavailable — emergency situations, confined spaces. The project covers frequency response analysis, filtering, FSK modulation and validation through numerical modelling.",
        },
      },
    ],
  },
];

/**
 * Ordre d'affichage de la grille, du plus représentatif au plus ancien.
 *
 * La page ne sépare plus « projets phares » et « autres projets » : c'est cet
 * ordre seul qui porte la hiérarchie. Il est écrit à la main plutôt que déduit
 * d'une date ou du drapeau `featured`, parce que la pertinence d'un projet ne
 * se déduit d'aucun champ : l'alternance chez Thales passe avant tout, le
 * TSP-PC-ER suit parce qu'il est le plus argumenté et le seul démontrable
 * directement dans la page.
 */
const displayOrder = [
  "tourelle-ia",
  "breezy",
  "easysave",
  "tsp-resolver",
  "stagelink",
  "qualite-air",
  "strongbox",
  "station-meteo",
  "traitement-signal",
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
