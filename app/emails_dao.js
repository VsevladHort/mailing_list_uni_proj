const mongoose = require('mongoose').default;
mongoose.connect(process.env.MONGO_DB_CONNECTION_URL).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log(err));

const { Schema } = mongoose;

const emailModelSchema = new Schema({
    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: true
    },
    p_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const EmailModel = mongoose.model('EmailModel', emailModelSchema, 'mail_list');

module.exports = EmailModel;




