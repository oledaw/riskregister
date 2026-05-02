# "Lepiej zapobiegać niż leczyć" - rejestr ryzyk projektowych

Narzędzie do wspólnego zarządzania ryzykami przez PM i Project Ownera (Stakeholdera). Rejestr działa jako żywy dokument aktualizowany na bieżąco — nie raport tworzony raz na sprint.

---

## Workflow: PM × Project Owner

Rejestr jest współdzielony — każda ze stron może dodawać ryzyka i aktualizować ich status. Podział odpowiedzialności jest następujący:

| Czynność | PM | Project Owner |
|---|---|---|
| Dodaje ryzyka operacyjne (zespół, proces, harmonogram) i biznesowe | ✅ | ✅ |
| Ocenia efekt i przypisuje mitygację | ✅ | ✅ |
| Monitoruje status ryzyk co tydzień | ✅ | |
| Uczestniczy w catch-upach dla ryzyk oznaczonych flagą | ✅ | ✅ |
| Zamyka ryzyko po wykonaniu mitygacji (w zależności kto jest ownerem) | ✅ | ✅ |
| Pilnuje braków | ✅ | |
| Decyduje | | ✅ |

### Rytm pracy

```
Poniedziałek (PM)
└── Przegląd rejestru przed tygodniem
    ├── Aktualizacja statusów
    ├── Sprawdzenie czy pojawiły się nowe blokery
    └── Przygotowanie agendy catch-upu

Środa lub czwartek (PM + Project Owner)
└── Catch-up — tylko ryzyka z flagą „wymaga catch-upu"
    ├── Omówienie mitygacji w toku
    ├── Decyzje dotyczące zasobów i eskalacji
    └── Odznaczenie flagi po omówieniu

Koniec sprintu (PM)
└── Retrospekcja rejestru
    ├── Zamknięcie obsłużonych ryzyk
    ├── Weryfikacja ryzyk „w trakcie" — czy mitygacja postępuje?
    └── Identyfikacja nowych ryzyk na kolejny sprint
```

---

## Tworzenie ryzyka — definicje pól

Formularz podzielony jest na trzy sekcje, które prowadzą przez proces od diagnozy do planu działania.

### Sekcja 1 — Zdefiniuj

**Opis** — punkt wejścia. Możesz wpisać luźną notatkę („developer jest przeciążony") lub pełny scenariusz w formacie:
> *Jeżeli [warunek], to [skutek dla projektu].*

Przycisk **Uzupełnij AI** przekształci notatkę w kompletny wpis — wypełni wszystkie pola poniżej. Możesz potem ręcznie poprawić każde z nich.

**Tytuł** — zwięzłe zdanie identyfikujące ryzyko. Powinno zaczynać się od rzeczownika lub podmiotu i być zrozumiałe bez czytania opisu.
> ✅ *Nieautoryzowane angażowanie developera w zadania spoza projektu*
> ❌ *Problem z developerem*

**Konsekwencja** — co konkretnie stanie się z projektem, jeśli ryzyko się zmaterializuje. Najlepiej z oszacowaniem: ile czasu, co przepada, co wymaga renegocjacji.

**Dodaje** — kto zgłasza ryzyko: PM lub Stakeholder. Wpływa na kontekst i odpowiedzialność za śledzenie.

---

### Sekcja 2 — Oceń

**Efekt** — jeden z trzech poziomów, wybierany jako kafelek:

| Efekt | Znaczenie |
|---|---|
| **Przesuwa termin** | Projekt dotrze do celu, ale później niż zakładano |
| **Psuje rezultat** | Dostarczymy coś innego lub gorszego niż zakładano |
| **Zatrzyma projekt** | Twarda blokada — prace stają do czasu rozwiązania |

---

### Sekcja 3 — Działaj

**Mitygacja** — konkretny next step w formacie: *kto, co, kiedy*. Nie „monitorować sytuację", tylko działanie z właścicielem i terminem.
> ✅ *PM eskaluje do PMO do piątku. Stakeholder potwierdza alokację developera do końca tygodnia.*

**Gdzie wprowadzamy zmianę** — jeden lub kilka obszarów, w których mitygacja wymaga interwencji:

| Obszar | Kiedy zaznaczać |
|---|---|
| **W wymaganiach** | Trzeba doprecyzować AC, zakres lub założenia |
| **W planie** | Zmieniamy harmonogram, taski lub alokację |
| **W zespole** | Zmieniamy dostępność, odpowiedzialność lub skład |
| **W komunikacji** | Ustalamy SLA, proces decyzyjny lub synchronizację |
| **W rozwiązaniu technicznym** | Zmieniamy API, dane lub implementację |

**Właściciel mitygacji** — osoba odpowiedzialna za wykonanie akcji. Nie musi być tożsama z osobą, która ryzyko zgłosiła.

**Wymaga catch-upu** — flaga dla ryzyk, które wymagają omówienia na najbliższym spotkaniu. Odznacza się po omówieniu przyciskiem „Omówiono" w panelu szczegółów.

---

## Zarządzanie i utrzymanie rejestru

### Statusy ryzyka

```
otwarty  ──►  w trakcie  ──►  zamknięty
                │
                └──►  zmaterializowany  ──►  zamknięty (archiwum)
                │
                └──►  skipnięty
```

| Status | Znaczenie |
|---|---|
| **Otwarty** | Ryzyko zidentyfikowane, mitygacja jeszcze nie rozpoczęta |
| **W trakcie** | Mitygacja w toku — ktoś aktywnie pracuje nad obsługą |
| **Zamknięty** | Ryzyko obsłużone lub nieaktualne |
| **Zmaterializowany** | Ryzyko wystąpiło — stało się problemem, wymaga zarządzania jako incydent |
| **Skipnięty** | Świadoma decyzja o niedziałaniu — ryzyko zaakceptowane |

### Zasady higieny rejestru

**Nie zostawiaj ryzyk w statusie „otwarty" bez właściciela mitygacji.** Ryzyko bez akcji to tylko lista strachu.

**Regularnie przeglądaj ryzyka „w trakcie".** Jeśli mitygacja trwa dłużej niż sprint bez postępu — to sygnał do eskalacji lub zmiany podejścia.

**Zamykaj i archiwizuj.** Rejestr traci wartość, gdy gromadzi dziesiątki nieaktualnych wpisów. Zamknięte ryzyka zostawiają ślad historyczny, ale nie zaśmiecają widoku dzięki filtrom.

**Zmaterializowane ryzyko ≠ porażka.** Wpis w statusie „zmaterializowany" to cenna informacja — pokazuje, co się sprawdziło jako prognoza i gdzie mitygacja zawiodła. Archiwizuj z notatką.

**Catch-up tylko z flagą.** Nie omawiaj całego rejestru na każdym spotkaniu. Flaga „wymaga catch-upu" wskazuje dokładnie te ryzyka, które wymagają decyzji lub aktualizacji.

### Filtry — kiedy ich używać

| Filtr | Użycie |
|---|---|
| **Efekt → Zatrzyma projekt** | Przed każdym spotkaniem statusowym — co może nas zablokować? |
| **Status → W trakcie** | Tygodniowy przegląd postępu mitygacji |
| **Zmiana w → Zespół / Plan** | Planowanie sprintu — co wymaga zmian w alokacji? |
| **Stat: Wymaga catch-upu** | Przygotowanie agendy spotkania PM × Stakeholder |

---

*Rejestr jest tak dobry, jak regularność jego aktualizacji. 10 minut tygodniowo wystarczy — pod warunkiem że się to robi.*
