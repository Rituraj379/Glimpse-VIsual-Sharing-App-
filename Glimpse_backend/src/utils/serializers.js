export const serializeUser = (user) => ({
  _id: user.googleId,
  googleId: user.googleId,
  userName: user.userName,
  image: user.image,
});

export const serializePin = (pin) => ({
  _id: pin._id.toString(),
  title: pin.title,
  about: pin.about,
  destination: pin.destination,
  category: pin.category,
  image: {
    asset: {
      url: pin.imageUrl,
    },
  },
  postedBy: pin.postedBy ? serializeUser(pin.postedBy) : null,
  save: Array.isArray(pin.saves)
    ? pin.saves.map((savedUser) => ({
        _key: savedUser._id?.toString?.() || savedUser.googleId,
        postedBy: serializeUser(savedUser),
      }))
    : [],
  comments: Array.isArray(pin.comments)
    ? pin.comments.map((comment) => ({
        _key: comment._id.toString(),
        comment: comment.comment,
        postedBy: comment.postedBy ? serializeUser(comment.postedBy) : null,
      }))
    : [],
  createdAt: pin.createdAt,
});
