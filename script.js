// ==========================
// STATE
// ==========================

const State = {
  historico: JSON.parse(localStorage.getItem("nutriHistorico")) || []
};

const salvarHistorico = () => {
  localStorage.setItem("nutriHistorico", JSON.stringify(State.historico));
};

// ==========================
// MODEL
// ==========================

const Model = {
  imc: (p, a) => p / (a * a),

  classificarIMC(imc) {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidade";
  },

  agua: p => (p * 35) / 1000,

  tmb(p, a, i, s) {
    return s === "homem"
      ? 88.36 + 13.4 * p + 4.8 * a - 5.7 * i
      : 447.6 + 9.2 * p + 3.1 * a - 4.3 * i;
  },

  ajustar(get, obj) {
    if (obj === "emagrecer") return get * 0.8;
    if (obj === "ganhar") return get * 1.15;
    return get;
  }
};

// ==========================
// VIEW
// ==========================

const View = {
  get el() {
    return document.getElementById("conteudo");
  },
  
  render(html) {
    this.el.classList.remove("fade");
    void this.el.offsetWidth;
    this.el.classList.add("fade");
    this.el.innerHTML = html;
  }
};

// ==========================
// CONTROLLER
// ==========================

const Controller = {

  telas: {

    imc() {
      View.render(`
        <h2>IMC</h2>
        <input id="peso" placeholder="Peso">
        <input id="altura" placeholder="Altura">
        <button id="calc">Calcular</button>
        <p id="res"></p>
      `);

      document.getElementById("calc").onclick = () => {
        const p = +peso.value;
        const a = +altura.value;

        if (!p || !a) return res.innerHTML = "Valores inválidos";

        const imc = Model.imc(p, a);
        const cls = Model.classificarIMC(imc);

        res.innerHTML = `${imc.toFixed(2)} — ${cls}`;
      };
    },

    agua() {
      View.render(`
        <h2>Água</h2>
        <input id="peso" placeholder="Peso">
        <button id="calc">Calcular</button>
        <p id="res"></p>
      `);

      calc.onclick = () => {
        const p = +peso.value;
        if (!p) return res.innerHTML = "Peso inválido";
        res.innerHTML = `${Model.agua(p).toFixed(2)} L/dia`;
      };
    },

    calorias() {
      View.render(`
        <h2>Calorias</h2>
        <input id="peso" placeholder="Peso">
        <input id="altura" placeholder="Altura">
        <input id="idade" placeholder="Idade">

        <select id="sexo">
          <option value="">Sexo</option>
          <option value="homem">Homem</option>
          <option value="mulher">Mulher</option>
        </select>

        <select id="obj">
          <option value="manter">Manter</option>
          <option value="emagrecer">Emagrecer</option>
          <option value="ganhar">Ganhar</option>
        </select>

        <button id="calc">Calcular</button>
        <p id="res"></p>
      `);

      calc.onclick = () => {
        const tmb = Model.tmb(+peso.value, +altura.value, +idade.value, sexo.value);
        const final = Model.ajustar(tmb * 1.55, obj.value);

        res.innerHTML = `${final.toFixed(0)} kcal`;

        State.historico.push({
          tipo: "Calorias",
          resultado: final.toFixed(0),
          data: new Date().toLocaleString()
        });

        salvarHistorico();
      };
    },

historico() {

  if (!State.historico.length)
    return View.render("<h2>Sem histórico</h2>");

  View.render(`
    <h2>Histórico</h2>

    <button id="limparHist" class="btn-limpar">
      🗑 Limpar histórico
    </button>

    ${State.historico.map(h => `
      <div class="card-historico">
        ${h.tipo}: ${h.resultado}<br>
        <small>${h.data}</small>
      </div>
    `).join("")}
  `);

  document.getElementById("limparHist").onclick = () => {
    State.historico = [];
    salvarHistorico();
    Controller.telas.historico();
  };
}

    }

  }

// ==========================
// APP
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".menu button")
    .forEach(btn =>
      btn.onclick = () =>
        Controller.telas[btn.dataset.tela]()
    );
});