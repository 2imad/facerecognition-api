const onProfileRequest =  (req, res , db) => {
    const { id } = req.params
    db.select('*').from('users').where({ id }).then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(404).json('User Not found')
        }
    }).catch(err => {
        res.json('Error loading Profile ')
    })
}

module.exports = {
    onProfileRequest : onProfileRequest
}