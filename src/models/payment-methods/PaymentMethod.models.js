import PaymentMethodSchema from './PaymentMethod.schema.js'

export const insertPaymentMethod = obj =>{
    return PaymentMethodSchema(obj).save()
}

export const getAPaymentMethod = filter =>{
    return PaymentMethodSchema.findOne(filter)
}

export const getPaymentMethod = filter =>{
    return PaymentMethodSchema.find(filter)
}

export const getAllPaymentMethod = () =>{
    return PaymentMethodSchema.find()
}

export const deletePaymentMethodByID = _id => {
return PaymentMethodSchema.findByIdAndDelete(_id)
}

export const updatePaymentMethodById = (_id,updateObj) => {
    return PaymentMethodSchema.findByIdAndUpdate(_id,updateObj,{new:true})
    }
