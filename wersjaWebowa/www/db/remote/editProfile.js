const {verify} = require('../../tokens');

function editProfile (req, res){
    //przekierowanie do edycji profilu
    let payload = verify(req.params.token);
    if (!payload) return res.sendStatus(418);
    req.session.user = { imie: payload.imie, nazwisko: payload.nazwisko, id: payload.id, typ: "uczen", username: payload.username, loggedin: true };
    req.flash('desiredElem', 'editProfileUcz');
    return res.redirect(`/user/${req.session.user.username}`);
}

module.exports = editProfile;