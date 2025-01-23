import moment from 'moment-timezone';
import axios from 'axios';
import ical from "node-ical";

// Fonction qui récupère l'agenda sur internet
export async function get_agenda(url) {
    const response = await axios.get(url);
    const cal = ical.parseICS(response.data);
    return cal;
}

// Fonction qui récupère chaque cours du calendrier
export function get_current_event(calendar) {
    // Obtient l'heure actuelle en UTC
    const currentUtc = moment.utc();

    // Initialise un tableau pour stocker les événements
    const TAb_events = [];

    // Parcours le calendrier
    for (const key in calendar) {
        if (calendar.hasOwnProperty(key)) {
            const event = calendar[key];
            if (event.type === 'VEVENT') {

                // Extrait les informations de l'événement
                const start = moment(event.start)
                const end = moment(event.end)
                const summary = event.summary;
                const location = event.location;
                const description = event.description;

                // Ajoute un objet représentant l'événement au tableau
                TAb_events.push({
                    start,
                    end,
                    nom_cours: summary,
                    salle: location,
                    nom_prof: description,
                });
            }
        }
    }

    return TAb_events;
}

// Fonction qui retourne les cours associés à une date
export function date_cours(cal, DATE) {
    const TAB_events = get_current_event(cal);

    // Convertit la date en objet 'Date'
    const targetDate = moment(DATE).toDate();

    // Initialise un tableau pour stocker les informations sur les cours
    const courseInfoList = [];

    // Parcourt le tableau de tous les événements
    for (const event of TAB_events) {
        const eventStartDate = moment(event.start).toDate();

        if (moment(eventStartDate).isSame(targetDate, 'day')) {
            const courseInfo = {
                nom_cours: event.nom_cours,
                salle: event.salle,
                start: moment(event.start).format('HH:mm'),
                end: moment(event.end).format('HH:mm'),
            };

            courseInfoList.push(courseInfo);
        }
    }

    console.log("Cours :");
    console.log(courseInfoList);
    return courseInfoList;
}

export function verifier_date(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // expression régulière pour le format AAAA-MM-JJ

    if (regex.test(date)) {
        return "true"; // La date est au format correct
    } else {
        return "false"; // La date n'est pas au format correct
    }
}

export function transfo_date(date) {
    let transformedDate;
    let date_annee;
    let mois;
    transformedDate = date;
    if (typeof date !== 'string') {
        return transformedDate = 'La date doit être une chaîne de caractères';
    }

    if (date === "today" || date === "") {
        const date_jour = moment.utc();
        transformedDate = date_jour.format("YYYY-MM-DD");
    }
    else if (date === "demain" || date === "tomorrow") {
        const date_demain = moment.utc().add(1, 'days');
        transformedDate = date_demain.format("YYYY-MM-DD");
    }
    else if (date.length === 2) {
        const date_jour = moment.utc();
        date_annee = date_jour.format("YYYY-MM-DD").split("-")[0];
        mois = parseInt(date_jour.format("MM"));
        const jour = parseInt(date);

        if (jour < 1 || jour > 31) {
            return transformedDate = "Jour invalide";
        }
        if (mois === 2 && jour > 29) {
            return transformedDate = "Février ne peut pas avoir plus de 29 jours"
        }
        if ((mois === 4 || mois === 6 || mois === 9 || mois === 11) && jour > 30) {
            return transformedDate = "Ce mois ne peut pas avoir plus de 30 jours";
        }
        if (mois === 1 || mois === 3 || mois === 5 || mois === 7 || mois === 8 || mois === 10 || mois === 12) {
            if (jour > 31) {
                return transformedDate = "Ce mois ne peut pas avoir plus de 31 jours";
            }
        }
        if (jour < date_jour.date()) {
            let mois_suivant = mois === 12 ? 1 : mois + 1;
            transformedDate = `${date_annee}-${mois_suivant.toString().padStart(2, '0')}-${date}`;
        } else if (mois === 12) {
            let annee_suivante = parseInt(date_annee) + 1;
            return transformedDate = `${annee_suivante}-${mois.toString().padStart(2, '0')}-${date}`;
        }
        transformedDate = `${date_annee}-${mois.toString().padStart(2, '0')}-${date}`;
    }

    return transformedDate;
}
