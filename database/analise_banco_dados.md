# Análise da Estrutura do Banco de Dados

## Comparação entre a Estrutura Visualizada e os Scripts SQL

### Tabelas Definidas nos Scripts SQL

Analisando os arquivos SQL do projeto (`new_schema.sql` e `complete_database_setup.sql`), encontramos as seguintes tabelas definidas:

1. **usuarios** - Visualizada na imagem
   - Campos: id, nome, email, senha, role, created_at, updated_at, last_login
   - Índices: PRIMARY, email

2. **historia** - Não visualizada na imagem
   - Campos: id, conteudo, autor_id, created_at, updated_at
   - Chaves estrangeiras: autor_id referencia usuarios(id)

3. **playlists** - Não visualizada na imagem
   - Campos: id, titulo, subtitulo, imagem_url, compositor, created_at, updated_at, autor_id, num_pontos, num_followers, num_downloads
   - Chaves estrangeiras: autor_id referencia usuarios(id)

4. **pontos** - Não visualizada na imagem
   - Campos: id, playlist_id, titulo, compositor, audio_url, letra, created_at, updated_at, autor_id
   - Chaves estrangeiras: playlist_id referencia playlists(id), autor_id referencia usuarios(id)

5. **comentarios** - Não visualizada na imagem
   - Campos: id, ponto_id, usuario_id, conteudo, created_at, updated_at
   - Chaves estrangeiras: ponto_id referencia pontos(id), usuario_id referencia usuarios(id)

6. **favoritos** - Não visualizada na imagem
   - Campos: id, usuario_id, playlist_id, ponto_id, created_at
   - Chaves estrangeiras: usuario_id referencia usuarios(id), playlist_id referencia playlists(id), ponto_id referencia pontos(id)

### Análise da Implementação no Código

No arquivo `server.js`, encontramos rotas implementadas para as seguintes tabelas:

1. **playlists** - Rotas completas (GET, POST, PUT, DELETE)
2. **pontos** - Rotas completas (GET, POST, PUT)
3. **historia** - Rota GET implementada

No entanto, não foram encontradas rotas implementadas para as tabelas:

1. **usuarios** - Não implementada
2. **comentarios** - Não implementada
3. **favoritos** - Não implementada

### Configuração de Conexão

A configuração de conexão no arquivo `.env` está definida para:

```
DB_HOST=192.168.0.115
DB_USER=leno
DB_PASSWORD="Ftec@148750W559rt"
DB_NAME=simple_ink_umbanda
```

Esta configuração é utilizada no arquivo `server.js` para criar o pool de conexões MySQL.

### Conclusão

1. **Discrepância entre Banco de Dados e Código**: A imagem mostra apenas a tabela `usuarios`, enquanto os scripts SQL definem 6 tabelas. Isso pode indicar que:
   - As outras tabelas ainda não foram criadas no banco de dados
   - A imagem mostra apenas uma parte do esquema completo

2. **Implementação Parcial das Rotas**: Apenas 3 das 6 tabelas têm rotas implementadas no servidor, o que sugere que a aplicação pode estar em desenvolvimento ou que algumas funcionalidades ainda não foram implementadas.

3. **Recomendações**:
   - Verificar se todas as tabelas definidas nos scripts SQL foram criadas no banco de dados
   - Implementar rotas para as tabelas `usuarios`, `comentarios` e `favoritos` se necessário para a funcionalidade completa da aplicação
   - Garantir que o usuário `umbanda_user` tenha as permissões necessárias para acessar todas as tabelas