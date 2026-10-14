const API_URL = "http://127.0.0.1:5000";

async function carregarTodosProdutos() {
  try {
    const response = await fetch(`${API_URL}/produtos`);
    if (!response.ok) throw new Error("Erro ao carregar produtos");

    const produtos = await response.json();
    const tbody = document.querySelector("#tabelaProdutos tbody");

    if (!tbody) return;
    tbody.innerHTML = "";

    produtos.forEach(produto => {
      const tr = document.createElement("tr");

      const precoFormatado = typeof produto.preco === "number"
        ? produto.preco.toFixed(2)
        : Number(produto.preco || 0).toFixed(2);

      tr.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>R$ ${precoFormatado}</td>
        <td>${produto.quantidade}</td>
        <td>
          <button 
            class="btn btn-warning" 
            onclick="editarProduto(${produto.id})">
            Editar
          </button>
          
          <button 
            class="btn btn-danger" 
            onclick="apagarProduto(${produto.id})">
            Apagar
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

async function editarProduto(id) {
  // Redireciona para a página de edição levando o ID na URL
  window.location.href = `produtoEditar.html?id=${id}`;
}

async function apagarProduto(id) {
  if (!confirm("Deseja realmente apagar este produto?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao apagar produto");
    }

    carregarTodosProdutos();
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

// Inicializa o carregamento da lista
carregarTodosProdutos();