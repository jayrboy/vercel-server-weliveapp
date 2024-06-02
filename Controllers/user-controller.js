import User from '../Models/User.js'

export const getAll = (req, res) => {
  User.find()
    .select('-password')
    .exec()
    .then((docs) => {
      //   console.log(docs)
      res.json(docs)
    })
}

export const updateRole = async (req, res) => {
  // console.log(req.body)
  const newRole = req.body.data
  await User.findByIdAndUpdate(newRole.id, newRole, { new: true })
    .select('-password')
    .exec()
    .then((docs) => {
      // console.log(docs)
      res.json(docs)
    })
    .catch((err) => console.log(err))
}
