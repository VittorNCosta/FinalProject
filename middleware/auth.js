function autenticacaoLogin(req, res, next) {
  if (req.session?.userId) return next();
  return res.redirect('/login');
}

function autenticacaoAdmin(req, res, next) {
  if (req.session?.funcao === 'admin') return next();
  return res.status(403).send('Acesso negado. Apenas administradores.');
}

module.exports = { autenticacaoLogin, autenticacaoAdmin };