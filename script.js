// Luăm elementele din pagină cu care vom lucra
const formular = document.getElementById("formular");
const campText = document.getElementById("campText");
const lista = document.getElementById("lista");
const contor = document.getElementById("contor");
const filtruToate = document.getElementById("filtruToate");
const filtruActive = document.getElementById("filtruActive");
const filtruTerminate = document.getElementById("filtruTerminate");

// Încărcăm sarcinile salvate (sau o listă goală, dacă nu există nimic salvat)
let sarcini = JSON.parse(localStorage.getItem("sarcini")) || [];

// Ce sarcini arătăm acum: "toate", "active" sau "terminate"
let filtru = "toate";

// Salvează lista de sarcini în browser
function salveaza() {
  localStorage.setItem("sarcini", JSON.stringify(sarcini));
}

// Desenează din nou toată lista pe pagină
function afiseaza() {
  lista.innerHTML = "";

  for (let i = 0; i < sarcini.length; i++) {
    const sarcina = sarcini[i];

    // Sărim peste sarcinile care nu se potrivesc cu filtrul ales
    if (filtru === "active" && sarcina.terminata) {
      continue;
    }
    if (filtru === "terminate" && !sarcina.terminata) {
      continue;
    }

    const li = document.createElement("li");
    if (sarcina.terminata) {
      li.classList.add("terminata");
    }

    // Căsuța de bifat
    const casuta = document.createElement("input");
    casuta.type = "checkbox";
    casuta.checked = sarcina.terminata;
    casuta.addEventListener("change", function () {
      sarcini[i].terminata = casuta.checked;
      salveaza();
      afiseaza();
    });

    // Textul sarcinii
    const text = document.createElement("span");
    text.textContent = sarcina.text;

    // Dublu-clic pe text: îl înlocuim cu un câmp în care poți scrie
    text.addEventListener("dblclick", function () {
      editeaza(i, li, text);
    });

    // Butonul de ștergere
    const butonSterge = document.createElement("button");
    butonSterge.textContent = "Șterge";
    butonSterge.className = "buton-sterge";
    butonSterge.addEventListener("click", function () {
      sarcini.splice(i, 1);
      salveaza();
      afiseaza();
    });

    li.appendChild(casuta);
    li.appendChild(text);
    li.appendChild(butonSterge);
    lista.appendChild(li);
  }

  actualizeazaContor();
  actualizeazaFiltre();
}

// Transformă textul unei sarcini într-un câmp care poate fi editat
function editeaza(i, li, text) {
  const campEditare = document.createElement("input");
  campEditare.type = "text";
  campEditare.className = "camp-editare";
  campEditare.value = sarcini[i].text;

  // Punem câmpul în locul textului și mutăm cursorul în el
  li.replaceChild(campEditare, text);
  campEditare.focus();

  let anuleaza = false;

  campEditare.addEventListener("keydown", function (eveniment) {
    if (eveniment.key === "Enter") {
      campEditare.blur(); // ieșim din câmp, iar „blur” de mai jos salvează
    }
    if (eveniment.key === "Escape") {
      anuleaza = true;    // ținem minte că NU vrem să salvăm
      campEditare.blur();
    }
  });

  // „blur” = ai ieșit din câmp (Enter, Escape sau clic în altă parte)
  campEditare.addEventListener("blur", function () {
    const textNou = campEditare.value.trim();

    // Salvăm doar dacă nu ai anulat și dacă textul nu e gol
    if (!anuleaza && textNou !== "") {
      sarcini[i].text = textNou;
      salveaza();
    }

    afiseaza();
  });
}

// Scrie câte sarcini mai sunt de făcut, de exemplu „3 rămase”
function actualizeazaContor() {
  let ramase = 0;
  for (let i = 0; i < sarcini.length; i++) {
    if (!sarcini[i].terminata) {
      ramase = ramase + 1;
    }
  }

  if (ramase === 1) {
    contor.textContent = "1 rămasă";
  } else {
    contor.textContent = ramase + " rămase";
  }
}

// Colorează în albastru butonul filtrului ales
function actualizeazaFiltre() {
  filtruToate.classList.toggle("activ", filtru === "toate");
  filtruActive.classList.toggle("activ", filtru === "active");
  filtruTerminate.classList.toggle("activ", filtru === "terminate");
}

// Când apeși un buton de filtru, schimbăm filtrul și redesenăm lista
filtruToate.addEventListener("click", function () {
  filtru = "toate";
  afiseaza();
});

filtruActive.addEventListener("click", function () {
  filtru = "active";
  afiseaza();
});

filtruTerminate.addEventListener("click", function () {
  filtru = "terminate";
  afiseaza();
});

// Când apăsăm „Adaugă" (sau Enter)
formular.addEventListener("submit", function (eveniment) {
  eveniment.preventDefault(); // oprește reîncărcarea paginii

  const textNou = campText.value.trim();
  if (textNou === "") {
    return; // nu adăugăm sarcini goale
  }

  sarcini.push({ text: textNou, terminata: false });
  salveaza();
  afiseaza();

  campText.value = "";
});

// La deschiderea paginii, afișăm sarcinile salvate
afiseaza();
