// You need to complete this controller with the required 7 actions
const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');


exports.index = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    const reservations = await Reservation
      .find({user: user._id})
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Reserved Guests',
      reservations: reservations
    });
  } catch (error) {
    req.flash('danger', `Opps!!Cannot display the reserved guests: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    .populate('user');
    res.render(`${viewPath}/show`, {
      pageTitle: reservation.title,
      reservation: reservation
    });
  } catch (error) {
    req.flash('danger', `Opps!!Cannot display the guest: ${error}`);
    res.redirect('/');
  }
};
const restaurants = [
    'Kelseys',
    'Montanas',
    'Harveys',
    'Swiss Chalet',
    'Outbacks'
  ];
exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Guest',
    restaurants: restaurants
  });
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    const reservation = await Reservation.create({user: user._id, ...req.body});
    req.flash('success', 'The reservation is successfully done.');
    res.redirect(`/reservations/${reservation.id}`);
  } catch (error) {
    req.flash('danger', `Opps!!Cannot reserve the guest: ${error}`);
    req.session.formData = req.body;
    res.redirect('/reservations/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: reservation.title,
      formData: reservation,
      restaurants: restaurants
    });
  } catch (error) {
    req.flash('danger', `Opps!!Cannot access the guest: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let reservation = await Reservation.findById(req.body.id);
    if (!reservation) throw new Error('Guest could not be found');

    const attributes = {user: user._id, ...req.body};
    await Reservation.validate(attributes);
    await Reservation.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The reservation is successfully updated.');
    res.redirect(`/reservations/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `Opps!!Cannot update this reservation: ${error}`);
    res.redirect(`/reservations/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Reservation.deleteOne({_id: req.body.id});
    req.flash('success', 'The guest is successfully deleted.');
    res.redirect(`/reservations`);
  } catch (error) {
    req.flash('danger', `Opps!!Cannot delete the guest: ${error}`);
    res.redirect(`/reservations`);
  }
};