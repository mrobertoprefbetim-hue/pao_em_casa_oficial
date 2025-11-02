Atualizações para Pão em Casa

Arquivos gerados:
- server/migrations/001_initial_migration.js
- server/migrations_run.js
- server/index.js (endpoints estendidos)
- server/db.js
- server/s3.js (template)
- frontend/index.html (cadastros)
- frontend/admin.html (admin simples)

Como testar localmente:
1. npm install (instale dependências no projeto)
2. node server/migrations_run.js
3. node server/index.js
4. Abra http://localhost:4000

Lembre-se: implemente autenticação JWT e substitua storage local por S3 em produção.
