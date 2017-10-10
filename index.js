const express = require('express')
const parseurl = require('parseurl')
const session = require('express-session')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const app = express()

app.use(session({
  secret: 'namduyen',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 300000  
}
}))

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,

})
app.engine('html',nunjucks.render)

app.set('view engine','html')
// app.use(session({secret: 'namduyen',saveUninitialized: true,resave: true}));
app.use(bodyParser.urlencoded({
  extended: true
}))
// parse application/json
app.use(bodyParser.json())


app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  // get the url pathname
  const pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  console.log(req.session.views[pathname])
  next()
})


app.get('/',(req, res) => {
  console.log(req.sessionID)

  res.render('index', {
    session: req.sessionID
  })
})

app.get('/foo', function (req, res, next) {
  // console.log(req.session.views)
  console.log(req.sessionID) 
  res.render('foo', {
    session: req.sessionID,
    time: req.session.views['/foo']
  })
})

app.get('/bar', function (req, res, next) {
  console.log(req.sessionID) 
  res.render('bar', {
    session: req.sessionID,
    time: req.session.views['/bar']
  })
})

app.listen(4000, function () {
    console.log(` server on running on port 4000! `)
})