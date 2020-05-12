'use strict';
/**
 * 运营商模型
 * 没有存储运营商账号密码
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const operatorSchema = new Schema({
    operatorID: Schema.Types.ObjectId,
    account: { type: String, required: true },
    password: { type: String, required: true },
    operatorName: { type: String },
    operatorAddTime: { type: Date },
    operatorReviseTime: { type: Date },
    operatorDeleteTime: { type: Date },
    operatorIntroduction: { type: String },
    content: { type: String },
    operatorProof: { type: String },
    legalPerson: { type: String },
    legalPersonIdNo: { type: String },
    legalPersonPhone: { type: String },
    legalPersonEmail: { type: String },
    legalPersonPhoto: { type: String },
    legalPersonAdress: { type: String },
    operatorExamineTF: { type: String },
    operatorReason: { type: String },
    operatorState: { type: String },
  });

  operatorSchema
    .virtual('localtime')
    .get(function() {
      return new Date(this.operatorAddTime.getTime() - (this.operatorAddTime.getTimezoneOffset() * 60000));
    });

  return mongoose.model('Operator', operatorSchema);
};
