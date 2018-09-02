const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    updated_at: {
        type: Date,
        default: Date.now
    },
    loggedInToken: {
        type: Object
    },
    name: {
        type: String
    },
    userName: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        reuired: true,
        select: false
    }
});

UserSchema.pre('save', function(done) {
    let self = this;
    if (self.isModified('password')) {
        bcrypt.hash(self.password, null, null, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            this.updated_at = new Date().toISOString();
            done();
        });
    } else {
        return done();
    }
});

UserSchema.methods.comparePassword = function(password) {
    let promise = new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err) {
                reject();
            } else {
                resolve(isMatch);
            }
        });
    })
    return promise;
};

module.exports = mongoose.model('users', UserSchema);