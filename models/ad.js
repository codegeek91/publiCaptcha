var mongoose = require("mongoose");

var adSchema = mongoose.Schema({
    uri: { type: String, required: true, unique: true },
    adPrice: { type: String, required: true},
    adHeader: { type: String, required: true},
    adBody: { type: String, required: true},
    adEmail: { type: String, required: true},
    adPersonaName: { type: String, required: true},
    adPersonaPhone: { type: String, required: true},
    adCaptchaId: { type: String, required: true}
});

var Ad = mongoose.model("Ad", adSchema);
module.exports = Ad;