const API_URL = "http://127.0.0.1:5000";

const urlParams = new URLSearchParams(window.location.search);
const pedidoId = urlParams.get("id");

// Função para carregar os selects e depois os dados do pedido atual
window.addEventListener("DOMContentLoaded", async () => {
    if (!pedidoId) {
        alert("ID do pedido não encontrado na URL!");
        return;
    }

    try {
        // 1. Carrega opções de Usuários e Produtos para os selects
        await carregarUsuariosESeletor();
        await carregarProdutosESeletor();

        // 2. Busca os dados do pedido específico
        const response = await fetch(`${API_URL}/pedidos/${pedidoId}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do pedido.");

        const pedido = await response.json();

        // 3. Preenche o formulário
        document.getElementById("id").value = pedido.id;
        document.getElementById("usuario_id").value = pedido.usuario_id;
        document.getElementById("produto_id").value = pedido.produto_id;
        document.getElementById("quantidade").value = pedido.quantidade;

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar os dados: " + error.message);
    }
});

async function carregarUsuariosESeletor() {
    const response = await fetch(`${API_URL}/usuarios`);
    const usuarios = await response.json();
    const select = document.getElementById("usuario_id");
    
    select.innerHTML = '<option value="">Selecione um usuário...</option>';
    usuarios.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.nome}</option>`;
    });
}

async function carregarProdutosESeletor() {
    const response = await fetch(`${API_URL}/produtos`);
    const produtos = await response.json();
    const select = document.getElementById("produto_id");
    
    select.innerHTML = '<option value="">Selecione um produto...</option>';
    produtos.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nome} (R$ ${p.preco})</option>`;
    });
}

// Evento de envio do formulário de edição
document.getElementById("formEditarPedido").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
        usuario_id: parseInt(document.getElementById("usuario_id").value, 10),
        produto_id: parseInt(document.getElementById("produto_id").value, 10),
        quantidade: parseInt(document.getElementById("quantidade").value, 10)
    };

    try {
        const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) throw new Error("Erro ao atualizar o pedido.");

        const resultado = await response.json();
        alert(resultado.mensagem || "Pedido atualizado com sucesso!");

        window.location.href = "pedidos.html";

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao salvar: " + error.message);
    }
});