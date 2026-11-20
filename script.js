// Luăm elementele din pagină cu care vom lucra
const formular = document.getElementById("formular");
const campText = document.getElementById("campText");
const lista = document.getElementById("lista");

// Încărcăm sarcinile salvate (sau o listă goală, dacă nu există nimic salvat)
let sarcini = JSON.parse(localStorage.getItem("sarcini")) || [];

// Salvează lista de sarcini în browser
function salveaza() {
  localStorage.setItem("sarcini", JSON.stringify(sarcini));
}

// Desenează din nou toată lista pe pagină
function afiseaza() {
  lista.innerHTML = "";

  for (let i = 0; i < sarcini.length; i++) {
    const sarcina = sarcini[i];

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
}

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
