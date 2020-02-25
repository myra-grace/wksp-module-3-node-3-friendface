'use strict';
const express = require('express');
const morgan = require('morgan');
const { users } = require('./data/users');
const PORT = process.env.PORT || 8000;

let currentUser = null;

const handleHome = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return;}
    let user = users.find(user => user.name === currentUser.name);
    let amigos = users.filter((person) => {
        return currentUser.friends.includes(person.id)}
    );
    res.render('pages/userHome', {
        title: `${user.name}'s Friendface Page`,
        user: user,
        amigos: amigos
    });
}
const handleSignin = (req, res) => {
    if (currentUser) {res.redirect('/'); return;}
    res.render('pages/signinPage', {
        title: 'Signin to Friendface!'
    });
}
const handleUser = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return;}
    const id = req.params.id;
    res.send(`user id is ${id}`);
}
const handleName = (req, res) => {
    const firstName = req.query.firstName;
    currentUser = users.find(user => user.name === firstName) || null;
    if (currentUser) {
        res.redirect('/');
        return;
    };
    res.send('Name recieved.');
    // res.direct('${currentUser ? '/' : 'signin'}'); OTHER OPTION AS OPPOSED TO IF
}
const handleUserBrowsing = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return;}
    let user = users.find(user => user.id === req.body.submittedUserId);
    let amigos = users.filter((person) => {
        return user.friends.includes(person.id)}
    );

    res.render('pages/userHome', {
        title: `${user.name}'s Friendface Page`,
        user: user,
        amigos: amigos
    });
}
// -----------------------------------------------------
// server endpoints
express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')
    // endpoints
    .get('/', handleHome)
    .get('/signin', handleSignin)
    .get('/user/:id', handleUser)
    .get('/getName', handleName)
    .post('/browseUser', handleUserBrowsing)

    .get('*', (req, res) => {
        console.log('req' + req.originalUrl);
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));