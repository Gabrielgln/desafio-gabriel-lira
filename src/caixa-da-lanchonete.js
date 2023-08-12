class CaixaDaLanchonete {
    
    cardapio = [
        'cafe,Café,3.00',
        'chantily,Chantily (extra do Café),1.50',
        'suco,Suco Natural,6.20',
        'sanduiche,Sanduíche,6.50',
        'queijo,Queijo (extra do Sanduíche),2.00',
        'salgado,Salgado,7.25',
        'combo1,1 Suco e 1 Sanduíche,9.50',
        'combo2,1 Café e 1 Sanduíche,7.50'
    ]

    formasDePagamento = [
        'dinheiro',
        'debito',
        'credito'
    ]

    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    validarProduto(metodoDePagamento,itens){
        var pricipal = false;
        var extra = false;
        var combo = false;
        var produtos = [];
        var descricaoExtras = [];

        if(itens.length == 0){
            return "Não há itens no carrinho de compra!";
        }

        for(var item of itens){
            var [codigo,quantidade] = item.split(',');
            if(!quantidade){
                return "Item inválido!";
            }
            if(quantidade == 0){
                return "Quantidade inválida!";
            }
            if(this.cardapio.every(itemCardapio => itemCardapio.indexOf(codigo) === -1)){
                return "Item inválido!";
            }
            produtos.push(codigo);
        }

        if(this.formasDePagamento.indexOf(metodoDePagamento) == -1){
            return "Forma de pagamento inválida!";
        }
        for(var produto of produtos){
            for(var produtoCardapio of this.cardapio){
                var [codigo, descricao, preco] = produtoCardapio.split(',');   
                if(produto == codigo){
                    if(descricao.includes('extra')){
                        extra = true;
                        var descricaoExtraFormatada = this.removeAccents(descricao.toLowerCase());
                        descricaoExtras.push(descricaoExtraFormatada.match(/\(([^)]+)\)/)?.[1] || "");
                    }
                    else if(codigo.includes('combo')){
                        combo = true;
                    }
                    else{
                        pricipal = true;
                    }
                }
            }
        }
        var count = 0;
        if(pricipal == false && extra == true){
            return "Item extra não pode ser pedido sem o principal";
        }
        else if(pricipal == true && extra == true){
            for(var produto of produtos){
                for(var descricaoExtra of descricaoExtras){
                    if(!descricaoExtra.includes(produto)){
                        count++;
                    }
                }
            }  
        }
        if(count == produtos.length){
            return "Item extra não pode ser pedido sem o principal";
        }
        return "";
    }
    
    pegarValorDoProduto(codigoProduto){
        var valorProduto = 0
        for (var produtoCardapio of this.cardapio){
            var [codigo, descricao, valor] = produtoCardapio.split(',');
            if(codigo == codigoProduto){
                valorProduto = Number(valor);
            }
        }
        return valorProduto; 
    }

    calcularMetodoDePagamentoComSubTotal(metodoDePagamento, subTotal){
        var valorTotal = 0;
        var valorMetodoDePagamento = 0;
        switch(metodoDePagamento){
            case 'dinheiro':
                valorMetodoDePagamento = (subTotal * 5) / 100;
                valorTotal = subTotal - valorMetodoDePagamento;
                break;
            case 'debito':
                valorTotal = subTotal;
                break;
            case 'credito':
                valorMetodoDePagamento = (subTotal * 3) / 100;
                valorTotal = subTotal + valorMetodoDePagamento;
                break;
        }
        return valorTotal;
    }

    calcularValorDaCompra(formaDePagamento, itens) {
        var valorTotal = 0;
        var validaProduto = this.validarProduto(formaDePagamento,itens);
        if(validaProduto.length > 0){
            return validaProduto;
        }
        for(var item of itens){
            var [codigo, quantidade] = item.split(',');
            valorTotal = valorTotal + (this.pegarValorDoProduto(codigo)*quantidade);
        }
        var valorTotalFinal = this.calcularMetodoDePagamentoComSubTotal(formaDePagamento,valorTotal);
        valorTotalFinal = valorTotalFinal.toFixed(2);
        var valorTotalFinalComPonto = valorTotalFinal.toString().replace('.',',');
        return "R$ "+valorTotalFinalComPonto;
    }
}

var caixa = new CaixaDaLanchonete();
console.log(caixa.calcularValorDaCompra('credito', ['chantily,1','sanduiche,2']));
console.log(caixa.calcularValorDaCompra('credito', ['chantily,1','sanduiche,2','queijo,1']));
console.log(caixa.calcularValorDaCompra('credito', []));
console.log(caixa.calcularValorDaCompra('credito', ['queijo,0','cafe,2']));
console.log(caixa.calcularValorDaCompra('credito', ['0','cafe,2']));
console.log(caixa.calcularValorDaCompra('creditoo', ['queijo,1','cafe,2']));
export { CaixaDaLanchonete };
