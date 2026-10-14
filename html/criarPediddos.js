const API_URL = "http://127.0.0.1:5000";

async function criarPedido() {

    try {

        let forUsuario = parseInt(document.getElementById('pedido_usuario').value)
        let forProduto = parseInt(document.getElementById('pedido_produto').value)
        let forQuantidade = parseInt(document.getElementById('pedido_quantidade').value)

        const response = await fetch(`${API_URL}/pedidos`, {

            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                usuario_id: forUsuario,
                produto_id: forProduto,
                quantidade: forQuantidade
            })

        })


        if (!response.ok) throw new Error("Erro ao cadastrar pedido");
        const resultado = await response.json();
        alert(
            resultado.mensagem +
            "\nTotal: R$ " +
            resultado.total.toFixed(2)
        );

    } catch (error) {

        alert("Erro: " + error.message);

    }

}