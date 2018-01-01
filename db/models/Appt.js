var mongoose=require('mongoose');
var Schema = mongoose.Schema; 

var apptSchema = Schema({appt_id: Schema.Types.ObjectId,
                         venue_id: String,
                         user_id: {type:Schema.Types.ObjectId, ref:'User'}},  { timestamps: { createdAt: 'created_at' }});

module.exports = mongoose.model("Appt", apptSchema);