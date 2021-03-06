var superagent = require('superagent')

var Persona = function (app) {
  
  // Persona Login
  app.post(app.pathPrefix + 'persona', function(req, res, next) {

    var assertion = req.body.assertion

    superagent
      .post('https://verifier.login.persona.org/verify')
      .send({ assertion: assertion, audience: 'http://' + app.domain })
      .end(function(error, result){

        if (error)
          return res.send(error)

        var email = result.body.email

        app.team.get(email, function (err, maker) {
          
          if (err)
            return res.send('No user with email ' + email)

          // Login successful!
          res.cookie('nudgepadEmail', email, { expires: new Date(Date.now() + 5184000000)})
          res.cookie('nudgepadKey', maker.get('key'), { expires: new Date(Date.now() + 5184000000)})
          res.cookie('nudgepadName', maker.get('name'), { expires: new Date(Date.now() + 5184000000)})
          res.redirect('/nudgepad')
          
        })

      })
  })
  
}

module.exports = Persona
