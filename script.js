// ==========================
// AUTH (USUÁRIOS)
// ==========================

const Auth = {
  usuarios: JSON.parse(localStorage.getItem("users")) || [],
  logado: JSON.parse(localStorage.getItem("sessao")),

  salvar() {
    localStorage.setItem("users", JSON.stringify(this.usuarios));
  },

  criar(user, pass) {
    if (this.usuarios.find(u => u.user === user)) return false;

    const novo = { user, pass };
    this.usuarios.push(novo);
    this.salvar();
    this.login(user, pass);
    return true;
  },

  login(user, pass) {
    const u = this.usuarios.find(
      x => x.user === user && x.pass === pass
    );

    if (!u) return false;

    this.logado = u;
    localStorage.setItem("sessao", JSON.stringify(u));
    return true;
  },

  logout() {
    localStorage.removeItem("sessao");
    this.logado = null;
  }
};

// ==========================
// HISTÓRICO POR USUÁRIO
// ==========================

function getUsuarioAtual() {
  return Auth.logado?.user;
}

function carregarHistorico() {
  const dados =
    JSON.parse(localStorage.getItem("historico")) || {};

  return dados[getUsuarioAtual()] || [];
}

function salvarHistorico(item) {
  const dados =
    JSON.parse(localStorage.getItem("historico")) || {};

  const user = getUsuarioAtual();

  if (!dados[user]) dados[user] = [];

  dados[user].push(item);

  localStorage.setItem(
    "historico",
    JSON.stringify(dados)
  );
}

// ==========================
// VIEW
// ==========================

const View = {
  el: document.getElementById("conteudo"),

  render(html) {
    this.el.innerHTML = html;
  }
};

// ==========================
// CONTROLLER
// ==========================

const Controller = {

  // ---------- LOGIN ----------

login() {

  View.render(`
    <h2>Login</h2>

    <input id="user" placeholder="Usuário">
    <input id="pass" type="password" placeholder="Senha">

    <button id="btnEntrar">Entrar</button>
    <button id="btnCriar">Criar conta</button>
  `);

  // ===== ENTRAR =====
  document.getElementById("btnEntrar").onclick = () => {

    const u = user.value;
    const p = pass.value;

    if (!u || !p) return alert("Preencha tudo");

    if (!Auth.login(u, p)) {
      alert("Usuário ou senha incorretos");
      return;
    }

    Controller.home();
  };

  // ===== CRIAR CONTA =====
  document.getElementById("btnCriar").onclick = () => {

    const u = user.value;
    const p = pass.value;

    if (!u || !p) return alert("Preencha tudo");

    if (!Auth.criar(u, p)) {
      alert("Usuário já existe");
      return;
    }

    alert("Conta criada com sucesso!");
    Controller.home();
  };
},

  // ---------- HOME ----------

  home() {

    View.render(`
      <h2>Olá, ${Auth.logado.user}</h2>

      <button id="imc">IMC</button>
      <button id="agua">Água diária</button>
      <button id="calorias">Gasto energético</button>
      <button id="historico">Histórico</button>
      <button id="logout">Sair</button>
    `);

    imc.onclick = () => Controller.imc();
    agua.onclick = () => Controller.agua();
    calorias.onclick = () => Controller.calorias();
    historico.onclick = () => Controller.historico();

    logout.onclick = () => {
      Auth.logout();
      Controller.login();
    };
  },

  // ---------- IMC ----------

  imc() {

    View.render(`
      <h2>IMC</h2>
      <input id="peso" placeholder="Peso (kg)">
      <input id="altura" placeholder="Altura (m)">
      <button id="calc">Calcular</button>
      <p id="res"></p>
      <button id="voltar">Voltar</button>
    `);

    calc.onclick = () => {

      const p = +peso.value;
      const a = +altura.value;

      if (!p || !a) return res.innerHTML = "Valores inválidos";

      const imc = p / (a * a);

      res.innerHTML =
        `IMC: ${imc.toFixed(2)}`;

      salvarHistorico({
        tipo: "IMC",
        resultado: imc.toFixed(2),
        data: new Date().toLocaleString()
      });
    };

    voltar.onclick = () => Controller.home();
  },

  // ---------- ÁGUA ----------

  agua() {

    View.render(`
      <h2>Água diária</h2>
      <input id="peso" placeholder="Peso (kg)">
      <button id="calc">Calcular</button>
      <p id="res"></p>
      <button id="voltar">Voltar</button>
    `);

    calc.onclick = () => {

      const p = +peso.value;

      if (!p) return res.innerHTML = "Valor inválido";

      const agua = (p * 35) / 1000;

      res.innerHTML =
        `${agua.toFixed(2)} L/dia`;

      salvarHistorico({
        tipo: "Água",
        resultado: agua.toFixed(2) + " L",
        data: new Date().toLocaleString()
      });
    };

    voltar.onclick = () => Controller.home();
  },

  // ---------- CALORIAS ----------

  calorias() {

    View.render(`
      <h2>Gasto energético</h2>

      <input id="peso" placeholder="Peso (kg)">
      <input id="altura" placeholder="Altura (cm)">
      <input id="idade" placeholder="Idade">

      <select id="genero">
        <option value="">Gênero</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
      </select>

      <select id="atividade">
        <option value="">Atividade</option>
        <option value="1.2">Sedentário</option>
        <option value="1.375">Leve</option>
        <option value="1.55">Moderado</option>
        <option value="1.725">Intenso</option>
      </select>

      <button id="calc">Calcular</button>
      <p id="res"></p>
      <button id="voltar">Voltar</button>
    `);

    calc.onclick = () => {

      const p = +peso.value;
      const a = +altura.value;
      const i = +idade.value;
      const g = genero.value;
      const at = +atividade.value;

      if (!p || !a || !i || !g || !at)
        return res.innerHTML = "Preencha tudo";

      let tmb;

      if (g === "masculino") {
        tmb = 66.5 + (13.75*p) + (5.003*a) - (6.755*i);
      } else {
        tmb = 655.1 + (9.563*p) + (1.850*a) - (4.676*i);
      }

      const total = tmb * at;

      res.innerHTML =
        `Total: ${Math.round(total)} kcal`;

      salvarHistorico({
        tipo: "Gasto energético",
        resultado: Math.round(total) + " kcal",
        data: new Date().toLocaleString()
      });
    };

    voltar.onclick = () => Controller.home();
  },

  // ---------- HISTÓRICO ----------

  historico() {

    const lista = carregarHistorico();

    if (!lista.length) {
      View.render(`
        <h2>Sem histórico</h2>
        <button id="voltar">Voltar</button>
      `);

      voltar.onclick = () => Controller.home();
      return;
    }

    View.render(`
      <h2>Histórico</h2>

      ${lista.map(i => `
        <div style="margin:10px 0;">
          <b>${i.tipo}</b><br>
          ${i.resultado}<br>
          <small>${i.data}</small>
        </div>
      `).join("")}

      <button id="voltar">Voltar</button>
    `);

    voltar.onclick = () => Controller.home();
  }
};

// ==========================
// APP START
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  Auth.logado ? Controller.home() : Controller.login();
});