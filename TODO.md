## Facilitar o entendimento dos campos ao criar imóvel

### Sugestão de ação/tarefa

Criar uma documentação ou tabela de referência para todos os campos necessários na criação de um imóvel, explicando o que significa cada campo, exemplos e se é obrigatório ou opcional.

### Estrutura sugerida

| Campo           | Significado                                      | Exemplo                      | Obrigatório |
|-----------------|--------------------------------------------------|------------------------------|-------------|
| `titulo`        | Título do imóvel                                 | "Casa ampla no centro"       | Sim         |
| `slug`          | URL amigável e única do imóvel                   | "casa-ampla-centro"          | Sim         |
| `descricao`     | Descrição detalhada                              | "Casa de 3 quartos, etc."    | Sim         |
| `valor`         | Preço do imóvel                                  | 350000                       | Sim         |
| `finalidade`    | Destino: venda ou aluguel                        | "venda", "aluguel"           | Sim         |
| `tipo`          | Tipo do imóvel                                   | "casa", "apartamento", etc.  | Sim         |
| `cidade`        | Cidade do imóvel                                 | "Corumbá", "Ladário"         | Sim         |
| `bairro`        | Bairro                                           | "Centro"                     | Opcional    |
| `status`        | Situação do anúncio                              | "disponível", "vendido", etc.| Sim         |
| `area_total`    | Área total em m²                                 | 250                          | Opcional    |
| `area_util`     | Área útil em m²                                  | 180                          | Opcional    |
| `quartos`       | Quantidade de quartos                            | 3                            | Opcional    |
| `banheiros`     | Quantidade de banheiros                          | 2                            | Opcional    |
| `garagens`      | Vagas de garagem                                 | 2                            | Opcional    |
| `imagens`       | Lista de URLs/metadados de imagens               | [array de imagens]           | Opcional    |
| `destaque`      | Destaque na listagem?                            | true/false                   | Opcional    |
| `tags`          | Tags livres para busca ou filtros                | "com piscina", "esquina"     | Opcional    |

### Para implementar

- Adicionar essa tabela nos formulários de criação de imóvel (como tooltip/botão de ajuda).
- Avaliar exibir descrições curtas perto de cada campo no app.
- Se aplicável, criar tipos TypeScript/documentação JSDoc para cada campo (src/types/Property.ts).
- Opcional: criar um componente de "Guia de campos" acessível na tela de criar/editar imóvel.

### Objetivo

Facilitar para qualquer usuário/operador/admin entender exatamente o que preencher, reduzir erros e garantir consistência dos dados dos imóveis.