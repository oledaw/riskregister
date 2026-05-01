# riskregister


## Workflow pracy dla formuły "Lepiej zapobiegać niż leczyć" pomiędzy Project Owner ↔ PM

## 1. Dodawanie potencjalnych problemów (źródło prawdy)
**PM i stakeholder dodają ryzyka** w momencie ich zauważenia — bez czekania na spotkanie. 
Prawdopodobnie będą **związane z obszarami: zakres projektu, harmonogram, zasoby, zespół.**

Każde ryzyko musi zawierać:
- opis (**co się stanie?**)
- konsekwencję (**co z tego wyniknie?**)
- wpływ (**czas, zakres czy blokada**)
- mitygację (**co robimy teraz?**)

**Brak** któregokolwiek elementu **= ryzyko niekompletne**.

---

## 2. Ownership
Każde ryzyko ma:
- autora
- **ownera** (PM lub stakeholder)
- konkretny **next step** (**kto, co, kiedy**)

**Unikamy ogólników typu „zespół zrobi”.**

---

## 3. Codzienna praca (async)
PM:
- **przegląda** nowe ryzyka
- **pilnuje braków** (mitygacja, owner)
- **monitoruje** statusy

Stakeholder:
- **reaguje** na przypisane mitygacje
- **decyduje**
- **odpowiada na ryzyka oznaczone jako „catch-up”**

---

## 4. Cotygodniowy Risk Review (15-30 min)
Spotkanie PM + stakeholder.

**Agenda:**
1. Ryzyka **blokujące** projekt („zatrzyma projekt”)
2. Ryzyka **z flagą „catch-up”**
3. Nowe ryzyka (walidacja jakości)
4. Aktualizacja statusów

Cel: **decyzje, nie raportowanie.**

---

## 5. Statusy i przepływ
- **otwarty** → zidentyfikowane
- **w trakcie** → trwa mitygacja
- **zamknięty** → rozwiązane
- **zmaterializowany** → problem się wydarzył
- **skipnięty** → świadomie ignorowane

---

## 6. Priorytety ryzyk – jak je rozumieć

### 🔴 HIGH — „Zatrzyma projekt”

**Jak to rozumieć:**  
Bez rozwiązania tego ryzyka projekt nie może iść dalej.

**Sygnały:**
- blocker / brak możliwości pracy  
- brak danych / decyzji / środowiska  
- zależność zewnętrzna blokuje wszystko  

**Przykład:**  
API nie istnieje → frontend stoi → nic nie da się testować  

**Test decyzyjny:**  
👉 „Czy zespół może pracować dalej mimo tego?”  
→ jeśli **nie** → to jest **HIGH**

### 🟠 MEDIUM — „Psuje rezultat”

**Jak to rozumieć:**  
Projekt pójdzie dalej, ale dowiezie coś gorszego niż planowaliśmy.

**Sygnały:**
- kompromisy jakościowe  
- niepełne feature’y  
- rework / zmiany scope’u  

**Przykład:**  
Feature działa, ale nie spełnia wymagań biznesowych → trzeba poprawiać  

**Test decyzyjny:**  
👉 „Czy dowieziemy coś innego niż obiecaliśmy?”  
→ jeśli **tak** → to **MEDIUM**

### 🟢 LOW — „Przesuwa termin”

**Jak to rozumieć:**  
Dowieziemy to, co trzeba — tylko później.

**Sygnały:**
- chwilowy brak zasobów  
- opóźnienia w komunikacji  
- drobne blokady operacyjne  

**Przykład:**  
Developer dostępny za tydzień → timeline się przesuwa  

**Test decyzyjny:**  
👉 „Czy jedyny problem to czas?”  
→ jeśli **tak** → to **LOW**

---

## 6. Zmaterializowane ryzyko
Gdy ryzyko się wydarzy:
- PM oznacza ryzyko jak zmaterializowane

**Ryzyko przestaje być hipotezą — staje się realnym problemem.**

---

## 7. Wykorzystanie metryk
Dashboard służy do sterowania rozmową:
- aktywne ryzyka → **trend**
- blokujące → **priorytet**
- catch-up → **pomoc/decyzje**

---

## 8. Zasady współpracy
- brak mitygacji = ryzyko nieważne
- każde ryzyko ma ownera
- flaga „catch-up” = reakcja w 48h
- review odbywa się co tydzień

---

## 9. Kluczowa zasada
Nie rejestrujemy wszystkiego — tylko ryzyka, które mogą wpłynąć na decyzje, zakres, czas lub wynik projektu.
