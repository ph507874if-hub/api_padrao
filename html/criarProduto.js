const API_URL = "http://127.0.0.1:5000";

async function criarProduto() {

    try {

        let forNome = document.getElementById('produto_nome').value
        let forPreco = parseFloat(document.getElementById('produto_preco').value)
        let forQuantidade = parseInt(document.getElementById('produto_quantidade').value)


        const response = await fetch(`${API_URL}/produtos`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: JSON.stringify({
                nome: forNome,
                preco: forPreco,
                quantidade: forQuantidade

            })

        })


        if (!response.ok) throw new Error("Erro ao cadastrar produto");
        const resultado = await response.json();
        alert(resultado.mensagem);
    } catch (error) {

        alert("Erro: " + error.message);

    }

}