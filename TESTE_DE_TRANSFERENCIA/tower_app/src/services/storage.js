// Sistema de armazenamento local para o Tower

class StorageService {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem('tower_categories')) {
      localStorage.setItem('tower_categories', JSON.stringify([]));
    }
    if (!localStorage.getItem('tower_items')) {
      localStorage.setItem('tower_items', JSON.stringify([]));
    }
  }

  // Categorias
  getCategories() {
    return JSON.parse(localStorage.getItem('tower_categories') || '[]');
  }

  addCategory(category) {
    const categories = this.getCategories();
    const newCategory = {
      id: Date.now(),
      ...category,
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    localStorage.setItem('tower_categories', JSON.stringify(categories));
    return newCategory;
  }

  saveCategory(category) {
    return this.addCategory(category);
  }

  deleteCategory(id) {
    const categories = this.getCategories();
    const filtered = categories.filter(cat => cat.id !== id);
    localStorage.setItem('tower_categories', JSON.stringify(filtered));
  }

  getCategoryByCodeRange(code) {
    const categories = this.getCategories();
    return categories.find(cat => {
      const codeNum = parseInt(code);
      return codeNum >= cat.startCode && codeNum <= cat.endCode;
    });
  }

  // Itens (Produtos e Insumos)
  getItems() {
    return JSON.parse(localStorage.getItem('tower_items') || '[]');
  }

  getNextCode(categoryId) {
    const category = this.getCategories().find(cat => cat.id === categoryId);
    if (!category) return null;

    const items = this.getItems();
    const categoryItems = items.filter(item => {
      const code = parseInt(item.codigo);
      return code >= category.startCode && code <= category.endCode;
    });

    if (categoryItems.length === 0) {
      return category.startCode;
    }

    const maxCode = Math.max(...categoryItems.map(item => parseInt(item.codigo)));
    const nextCode = maxCode + 1;

    if (nextCode > category.endCode) {
      return null; // Categoria cheia
    }

    return nextCode;
  }

  addItem(itemData) {
    const items = this.getItems();
    
    console.log('=== SALVANDO ITEM ===');
    console.log('Dados recebidos:', itemData);
    
    // IMPORTANTE: Garantir que categoriaId seja um número
    const categoriaId = parseInt(itemData.categoriaId);
    
    console.log('categoriaId convertido:', categoriaId);
    
    if (!categoriaId || isNaN(categoriaId)) {
      console.error('ERRO: categoriaId inválido!', itemData.categoriaId);
      throw new Error('ID da categoria é obrigatório!');
    }
    
    // Se já tem código (edição), mantém o item
    if (itemData.codigo && itemData.id) {
      const newItem = {
        ...itemData,
        categoriaId: categoriaId, // Garantir que seja número
        updatedAt: new Date().toISOString()
      };
      
      const index = items.findIndex(i => i.id === itemData.id);
      if (index !== -1) {
        items[index] = newItem;
      } else {
        items.push(newItem);
      }
      
      localStorage.setItem('tower_items', JSON.stringify(items));
      console.log('Item atualizado:', newItem);
      return newItem;
    }
    
    // Gerar código automático baseado na categoria
    const nextCode = this.getNextCode(categoriaId);
    if (nextCode === null) {
      throw new Error('Categoria cheia! Não há mais códigos disponíveis nesta faixa.');
    }

    const newItem = {
      id: Date.now(),
      codigo: nextCode.toString(),
      tipo: itemData.tipo,
      categoria: itemData.categoria,
      categoriaId: categoriaId, // SEMPRE salvar como número
      descricao: itemData.descricao,
      unidade: itemData.unidade,
      qtdEmbalagem: itemData.qtdEmbalagem,
      custoEmbalagem: itemData.custoEmbalagem,
      custoUnitario: itemData.custoUnitario,
      createdAt: new Date().toISOString()
    };
    
    console.log('Novo item criado:', newItem);
    
    items.push(newItem);
    localStorage.setItem('tower_items', JSON.stringify(items));
    
    console.log('Item salvo com sucesso!');
    return newItem;
  }

  saveItem(item) {
    return this.addItem(item);
  }

  updateItem(id, updates) {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      // Garantir que categoriaId seja número
      if (updates.categoriaId) {
        updates.categoriaId = parseInt(updates.categoriaId);
      }
      
      items[index] = { 
        ...items[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('tower_items', JSON.stringify(items));
      return items[index];
    }
    return null;
  }

  deleteItem(id) {
    const items = this.getItems();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem('tower_items', JSON.stringify(filtered));
  }

  getItemsByType(type) {
    return this.getItems().filter(item => item.tipo === type);
  }

  getItemsByCategory(categoryId) {
    const category = this.getCategories().find(cat => cat.id === categoryId);
    if (!category) return [];

    return this.getItems().filter(item => {
      const code = parseInt(item.codigo);
      return code >= category.startCode && code <= category.endCode;
    });
  }

  // Estatísticas
  getStats() {
    const items = this.getItems();
    const categories = this.getCategories();

    const produtos = items.filter(item => item.tipo === 'Produto');
    const insumos = items.filter(item => item.tipo === 'Insumo');

    return {
      totalItems: items.length,
      totalProdutos: produtos.length,
      totalInsumos: insumos.length,
      totalCategorias: categories.length
    };
  }

  // Limpar todos os dados
  clearAll() {
    localStorage.removeItem('tower_categories');
    localStorage.removeItem('tower_items');
    this.initializeStorage();
  }
}

export default new StorageService();

