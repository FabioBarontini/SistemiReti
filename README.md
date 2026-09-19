# SYNORA — Il Piano regolatore dei mondi connessi

Escape room didattica per Sistemi e Reti, progettata per Next.js + Supabase + Vercel.

## Avvio

1. Crea un progetto Supabase.
2. Esegui `supabase/schema.sql` nel SQL Editor.
3. Copia `.env.example` in `.env.local` e inserisci URL e publishable key.
4. `npm install`
5. `npm run dev`

La sessione viene gestita con cookie SSR tramite `@supabase/ssr`; è la configurazione raccomandata dalla documentazione Supabase per Next.js.

## Deploy

Il progetto è pronto per GitHub/Vercel. L'integrazione Vercel + Supabase può sincronizzare le variabili d'ambiente e gestire il collegamento fra i due progetti.

## Struttura del gioco

8 distretti: OSI/PDU, IPv4/VLSM, CIDR/supernetting, routing/traceroute, diagnosi router, VLAN/Wi-Fi, ridondanza/STP, Cisco CLI.

Le prove vengono validate server-side e lo stato di avanzamento è persistito in Supabase.

## V5 — difficoltà e varietà visiva
- Le missioni aperte privilegiano input testuali e attività operative rispetto ai menu a tendina.
- Il server valida la traccia completa; per le spiegazioni lunghe usa una validazione per concetti tecnici, non una singola stringa obbligatoria.
- Il Distretto 8 include l'indagine Helios Corp con cinque sospettati, dossier, profili, timeline, log e selezione vincolata delle evidenze.
- Ogni distretto ha una variante visiva dedicata per evitare la ripetizione della stessa composizione.


## V6 — SYNORA EXPERIENCE
- Mappa cittadina interattiva con nodi online, tracce e livello di interferenza.
- Console live con telemetria narrativa della rete.
- Archivio degli artefatti recuperati.
- Eventi anomali narrativi e messaggi di errore diegetici.
- NEXUS come assistente narrativo che non fornisce direttamente le risposte.
- Black Box con animazione del viaggio del pacchetto.
- Cronometro narrativo di missione.
- Finale cinematografico e profilo narrativo variabile al completamento della città.
- Atmosfere grafiche distinte per i distretti.
- Helios Corp mantiene dossier, sospettati, timeline, log ed evidenze come caso investigativo.

## V8 — Experience Layer
- Intro cinematica all'ingresso, con stato della rete e accesso alla città.
- Network Weather, presenza fisica di NEXUS e comunicazioni radio.
- Blackout Mode e Packet Vision per rendere visibili diagnostica, forwarding e incapsulamento.
- Incident Log, oggetti nascosti e frammenti di meta-storia distribuiti tra i distretti.
- Finale con report personale del tecnico.
- Messaggio di ritorno che ricorda lo stato precedente della città.
- La stanza segreta / Node 09 non è stata aggiunta, su richiesta.
