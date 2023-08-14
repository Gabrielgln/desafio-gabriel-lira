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
    //Função para remover o acento da string
    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    validarProduto(formaDePagamento,itens){
        var principal = false;
        var extra = false;
        var combo = false;
        var countExtraSemPrincipal = 0;
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

        if(this.formasDePagamento.indexOf(formaDePagamento) == -1){
            return "Forma de pagamento inválida!";
        }

        for(var produto of produtos){
            for(var produtoCardapio of this.cardapio){
                var [codigo, descricao, preco] = produtoCardapio.split(',');   
                if(produto == codigo){
                    if(descricao.includes('extra')){
                        extra = true;
                        //Comando para receber a descrição sem os acentos e toda em minúsculas.
                        var descricaoExtraFormatada = this.removeAccents(descricao.toLowerCase());
                        //Comando para adicionar na lista somente a parte da descrição que está dentro do "()"
                        descricaoExtras.push(descricaoExtraFormatada.match(/\(([^)]+)\)/)?.[1] || "");
                    }
                    else if(codigo.includes('combo')){
                        combo = true;
                    }
                    else{
                        principal = true;
                    }
                }
            }
        }
        //Comando para verificar se tem itens extras sem pelo menos um principal
        if(principal == false && extra){
            return "Item extra não pode ser pedido sem o principal";
        }
        //Comando para verificar se tem combos, mas não tem itens principais
        else if(principal == false && combo){
            return "Item extra não pode ser pedido sem o principal";
        }
        else if(principal && extra){
            for(var produto of produtos){
                for(var descricaoExtra of descricaoExtras){
                    if(!descricaoExtra.includes(produto)){
                        countExtraSemPrincipal++;
                    }
                }
            }  
        }
        //Comando para verificar se o item "extra" tem o seu principal referente
        if(countExtraSemPrincipal == produtos.length){
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

    calcularMetodoDePagamentoComSubTotal(formaDePagamento, subTotal){
        var valorTotal = 0;
        var valorFormaDePagamento = 0;
        switch(formaDePagamento){
            case 'dinheiro':
                valorFormaDePagamento = (subTotal * 5) / 100;
                valorTotal = subTotal - valorFormaDePagamento;
                break;
            case 'debito':
                valorTotal = subTotal;
                break;
            case 'credito':
                valorFormaDePagamento = (subTotal * 3) / 100;
                valorTotal = subTotal + valorFormaDePagamento;
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
console.log(caixa.calcularValorDaCompra('credito', ['queijo,1','combo1,2']));
console.log(caixa.calcularValorDaCompra('credito', ['combo1,2']));
export { CaixaDaLanchonete };
