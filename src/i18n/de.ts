import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Excel-Arbeitsmappen zusammenführen — alle Blätter, kein Upload | runlocally',
    description:
      'Führe mehrere XLSX- oder XLSM-Arbeitsmappen im Browser zu einer XLSX-Datei zusammen. Die Blattreihenfolge bleibt erhalten, doppelte Namen werden angepasst.',
    ogTitle: 'Excel-Arbeitsmappen im Browser zusammenführen',
    ogDescription:
      'Übernimm alle Tabellenblätter aus mehreren XLSX- oder XLSM-Dateien in eine XLSX-Datei, ohne die Quelldateien hochzuladen.',
  },

  hero: {
    h1: 'Excel-Arbeitsmappen zusammenführen',
    tagline:
      'Alle Tabellenblätter aus mehreren XLSX- oder XLSM-Dateien in einer Arbeitsmappe sammeln. Die Verarbeitung findet im Browser statt.',
  },

  intro: {
    h2: 'Eine Arbeitsmappe für alle ausgewählten Tabellenblätter',
    paras: [
      'Das Werkzeug öffnet die ausgewählten Excel-Arbeitsmappen nacheinander und kopiert ihre Tabellenblätter in die neue Datei merged.xlsx. Die Reihenfolge der Eingabedateien und die Blattreihenfolge innerhalb jeder Quelldatei bleiben erhalten.',
      'Zusammengeführt werden vollständige Tabellenblätter. Zeilen ähnlicher Tabellen werden nicht untereinander angefügt und Spalten nicht abgeglichen. Bei gleichen Blattnamen erhält das spätere Blatt einen Zusatz aus dem Quelldateinamen; die Excel-Grenze von 31 Zeichen wird dabei eingehalten.',
    ],
  },

  privacy: {
    h2: 'Die Arbeitsmappen bleiben auf deinem Gerät',
    lead:
      'Der Browser liest die ausgewählten Dateien und erstellt die zusammengeführte Arbeitsmappe lokal. Ein Upload ist nicht Teil des Ablaufs:',
    points: [
      'Der Inhalt der Arbeitsmappen wird vom Code in der Seite verarbeitet.',
      'Die Ergebnisdatei entsteht im Browserspeicher und wird von derselben Seite heruntergeladen.',
      'Die statische Seite sendet die ausgewählten Dateien nicht an einen Konvertierungsdienst.',
      'Der Quellcode kann unter der MIT-Lizenz eingesehen werden.',
    ],
    note:
      'Im Netzwerk-Panel des Browsers lässt sich während der Verarbeitung prüfen, dass keine Anfrage Daten aus den Arbeitsmappen enthält.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So führst du Arbeitsmappen zusammen',
    steps: [
      {
        h3: 'Mindestens zwei Arbeitsmappen auswählen',
        p: 'Wähle mehrere .xlsx- oder .xlsm-Dateien gemeinsam aus oder lege sie auf der Seite ab. Die Auswahlreihenfolge bestimmt die spätere Reihenfolge der Tabellenblätter.',
      },
      {
        h3: 'Tabellenblätter kopieren lassen',
        p: 'Die Seite öffnet jede Arbeitsmappe der Reihe nach, vergibt bei Namenskonflikten eindeutige Blattnamen und schreibt eine neue XLSX-Datei.',
      },
      {
        h3: 'merged.xlsx speichern',
        p: 'Nach dem Schreiben beginnt der Download. Im Ergebnis stehen die Anzahl der Quelldateien und der übernommenen Blätter; dort kann die Datei erneut heruntergeladen werden.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Werden meine Excel-Dateien hochgeladen?',
      a: 'Nein. Lesen, Kopieren und Schreiben erfolgen im Browser. Die ausgewählten Arbeitsmappen werden nicht an einen Konvertierungsserver gesendet.',
    },
    {
      q: 'Welche Inhalte werden kopiert?',
      a: 'Kopiert werden Zellwerte und Formeln, Zahlenformate, Spaltenbreiten und Zeilenhöhen. Auch die Blattreihenfolge bleibt erhalten. Formeln werden unverändert übernommen; Verweise werden daher nicht angepasst, wenn ein doppelter Blattname geändert werden muss.',
    },
    {
      q: 'Welche Inhalte werden nicht übertragen?',
      a: 'Diagramme, eingebettete Bilder, Makros, bedingte Formatierungen, benannte Bereiche und weitere Funktionen auf Arbeitsmappenebene werden nicht übertragen. Wenn sie erhalten bleiben müssen, verwende Excel oder ein anderes Tabellenkalkulationsprogramm.',
    },
    {
      q: 'Was geschieht bei gleichen Blattnamen?',
      a: 'Das erste Blatt behält seinen Namen. Ein späteres Blatt erhält einen Zusatz aus dem Quelldateinamen und bei Bedarf zusätzlich eine Nummer. Ungültige Zeichen werden ersetzt, und der Name bleibt auf 31 Zeichen begrenzt.',
    },
    {
      q: 'Kann das Werkzeug Zeilen aus gleich aufgebauten Tabellen verbinden?',
      a: 'Nein. Jedes Quellblatt bleibt im Ergebnis ein eigenes Tabellenblatt. Es werden keine Zeilen angefügt, Spalten abgeglichen, Datensätze bereinigt oder Summen über mehrere Dateien gebildet.',
    },
    {
      q: 'Kann ich .xls-Dateien oder passwortgeschützte Arbeitsmappen verwenden?',
      a: 'Das ältere .xls-Format wird nicht unterstützt. Passwortgeschützte Arbeitsmappen können ebenfalls nicht geöffnet werden. Entferne den Schutz zuvor in einem Tabellenkalkulationsprogramm.',
    },
    {
      q: 'Bleiben Makros aus .xlsm-Dateien erhalten?',
      a: 'Nein. .xlsm-Dateien werden als Quellen akzeptiert, damit ihre Zellinhalte gelesen werden können. Die Ausgabe ist merged.xlsx; VBA-Makros werden nicht kopiert.',
    },
    {
      q: 'Gibt es eine feste Dateigrößenbegrenzung?',
      a: 'Das Werkzeug setzt keine feste Byte-Grenze. Alle Quellen und die Ausgabe belegen Browserspeicher. Die praktisch verarbeitbare Größe hängt daher von Gerät, Browser und Inhalt der Arbeitsmappen ab.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '– kleine Werkzeuge, die lokal auf deinem Gerät laufen.',
    colophon:
      'Entwickelt und gepflegt von Geppetto. Bei Teilen von Code und Text kommt KI-Unterstützung zum Einsatz; das Ergebnis wird vom Maintainer geprüft.',
    securityText: 'Sicherheit',
  },
};
