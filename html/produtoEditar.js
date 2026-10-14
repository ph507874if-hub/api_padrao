const API_URL = "http://127.0.0.1:5000";

const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get("id");

window.addEventListener("DOMContentLoaded", async () => {
    if (!produtoId) {
        alert("ID do produto não encontrado na URL!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/produtos/${produtoId}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do produto.");

        const produto = await response.json();

        document.getElementById("id").value = produto.id;
        document.getElementById("nome").value = produto.nome;
        document.getElementById("preco").value = produto.preco;
        document.getElementById("quantidade").value = produto.quantidade;

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar os dados: " + error.message);
    }
});

document.getElementById("formEditarProduto").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
        nome: document.getElementById("nome").value,
        preco: parseFloat(document.getElementById("preco").value),
        quantidade: parseInt(document.getElementById("quantidade").value, 10)
    };

    try {
        const response = await fetch(`${API_URL}/produtos/${produtoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) throw new Error("Erro ao atualizar o produto.");

        const resultado = await response.json();
        alert(resultado.mensagem || "Produto atualizado com sucesso!");

        window.location.href = "produtos.html";

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao salvar: " + error.message);
    }
});