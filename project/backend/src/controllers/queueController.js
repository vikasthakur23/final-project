const Queue = require('../models/Queue');
const Venue = require('../models/Venue');

// create venue queue
exports.createQueue = async (req, res) => {
  try {
    const { venueId } = req.body;
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const q = new Queue({ venue: venue._id });
    await q.save();
    res.json(q);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// get queue by venue
exports.getQueueByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    let q = await Queue.findOne({ venue: venueId }).populate('tokens.user','name email');
    if (!q) return res.json({ tokens: [], lastNumber:0 });
    res.json(q);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// issue token for current user
exports.issueToken = async (req, res) => {
  try {
    const { venueId } = req.params;
    let q = await Queue.findOne({ venue: venueId });
    if (!q) {
      q = new Queue({ venue: venueId, tokens: [], lastNumber: 0 });
    }

    q.lastNumber += 1;
    const newToken = { number: q.lastNumber, user: req.user._id };
    q.tokens.push(newToken);
    await q.save();

    // populate user for response
    await q.populate('tokens.user','name email');

    // notify via socket
    req.io.to(venueId).emit('queueUpdated', q);

    res.json({ ok: true, token: newToken, queue: q });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// admin action: call next token (mark served)
exports.callNext = async (req, res) => {
  try {
    const { venueId } = req.params;
    let q = await Queue.findOne({ venue: venueId });
    if (!q || !q.tokens.length) return res.status(400).json({ message: 'No tokens' });

    // find first waiting
    const idx = q.tokens.findIndex(t => t.status === 'waiting');
    if (idx === -1) return res.status(400).json({ message: 'No waiting tokens' });

    q.tokens[idx].status = 'served';
    await q.save();
    await q.populate('tokens.user','name email');

    req.io.to(venueId).emit('queueUpdated', q);
    res.json({ ok: true, queue: q, called: q.tokens[idx] });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// cancel a token
exports.cancelToken = async (req, res) => {
  const { venueId, number } = req.params;
  const q = await Queue.findOne({ venue: venueId });
  if (!q) return res.status(404).json({ message: 'Queue not found' });
  const t = q.tokens.find(t => t.number === Number(number));
  if (!t) return res.status(404).json({ message: 'Token not found' });
  t.status = 'cancelled';
  await q.save();
  await q.populate('tokens.user','name email');
  req.io.to(venueId).emit('queueUpdated', q);
  res.json({ ok: true, queue: q });
};
