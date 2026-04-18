const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    isAdmin:         { type: Boolean, default: false },
    viewCount:       { type: Number, default: 0 },
    viewedSites:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'HeritageSite' }],
    feedbackGiven:   { type: Boolean, default: false },
    nextTriggerAt:   { type: Number, default: 5 },
}, { timestamps: true, collection: 'users' });

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
