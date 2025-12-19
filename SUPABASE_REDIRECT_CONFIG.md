# CONFIGURAÇÃO DE REDIRECT URLs NO SUPABASE

Para que o link de confirmação de email funcione corretamente, você precisa configurar as URLs de redirect no Supabase:

## 1. Acesse o Dashboard do Supabase
https://umbgtudgphbwpkeoebry.supabase.co

## 2. Vá em Authentication → URL Configuration

## 3. Configure as seguintes URLs:

### Site URL:
```
https://biblia-interativa-wine.vercel.app
```

### Redirect URLs (adicione todas estas):
```
http://localhost:3000/auth/callback
http://localhost:3000/**
https://biblia-interativa-wine.vercel.app/auth/callback
https://biblia-interativa-wine.vercel.app/**
https://biblia-interativa-q6n8.vercel.app/auth/callback
https://biblia-interativa-q6n8.vercel.app/**
```

## 4. Email Templates

Vá em Authentication → Email Templates e ajuste o template de confirmação:

### Confirm signup
```html
<h2>Confirme seu email</h2>
<p>Olá,</p>
<p>Clique no link abaixo para confirmar seu email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar meu email</a></p>
```

### ⚠️ IMPORTANTE:
O `.ConfirmationURL` deve ser usado exatamente assim. O Supabase irá substituir automaticamente pela URL correta.

## 5. Salvar e Testar

Após configurar:
1. Salve as configurações
2. Tente criar uma nova conta
3. Verifique se o email chega com o link correto
4. Ao clicar no link, você será redirecionado para `/auth/callback` e depois para `/inicio`

## 6. Verificação de Domínio

Se o link continuar offline, verifique:
- O domínio está ativo na Vercel
- As variáveis de ambiente estão configuradas na Vercel
- O Supabase aceita requests do seu domínio
