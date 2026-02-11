function calcularIMC() {
  let peso = document.getElementById("peso").value;
  let altura = document.getElementById("altura").value;

  let imc = peso / (altura * altura);
  imc = imc.toFixed(2);

  let classificacao = "";

  if (imc < 18.5) {
    classificacao = "Abaixo do peso";
  } else if (imc < 25) {
    classificacao = "Peso normal";
  } else if (imc < 30) {
    classificacao = "Sobrepeso";
  } else {
    classificacao = "Obesidade";
  }

 let resultado = document.getElementById("resultado");

resultado.innerText = "Seu IMC é: " + imc + " — " + classificacao;

if (imc < 18.5) {
  resultado.style.color = "#f6c23e"; // amarelo
} else if (imc < 25) {
  resultado.style.color = "#1cc88a"; // verde
} else if (imc < 30) {
  resultado.style.color = "#fd7e14"; // laranja
} else {
  resultado.style.color = "#e74a3b"; // vermelho
}

}
