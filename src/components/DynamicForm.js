import React, { useState } from 'react'
import { View, Button } from 'react-native'
import { Layout, Text } from '@ui-kitten/components'
import  OptionSelector, { OptionComponentType, OptionSelectorFeatures } from './selector/OptionSelector' // Componente personalizado para el selector
import EntradaTexto from './EntradaTexto' // Componente personalizado para el campo de texto
import DateSelector, {OptionDateFeatures} from './DateSelector' // Componente personalizado para la selección de fecha


const DynamicForm = ({ formData }) => {
const [formState, setFormState] = useState({})

// Función para manejar el cambio de estado en los campos
const handleInputChange = (field, value) => {
    setFormState({ ...formState, [field]: value })
}

// Función que renderiza los campos del formulario dinámico según el tipo
const renderField = (field) => {
    switch (field.tipo) {
    case 'selector':
        return (
            <OptionSelector
            type={OptionComponentType.DROPDOWN}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionSelectorFeatures({
                title:field.nombre,
                defaultOption:field['opcion predeterminada'],
                placeholder:field['texto predeterminado'],
                required:true})}
            />
        )
    case 'checkbox':
        return (
            <OptionSelector
            type={OptionComponentType.CHECKBOX}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionSelectorFeatures({
                title:field.nombre,
                defaultOption:field['opcion predeterminada'],
                placeholder:field['texto predeterminado'],
                maxChecked: field['cantidad de elecciones'],
                required:true})}
            />
        )
    case 'radio':
        return (
            <OptionSelector
            type={OptionComponentType.RADIO}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionSelectorFeatures({
                title:field.nombre,
                defaultOption:field['opcion predeterminada'],
                placeholder:field['texto predeterminado'],
                maxChecked: field['cantidad de elecciones'],
                required:true})}
            />
        )
    
    

    case 'fecha':
        return (
        <DateSelector
            value={formState[field.salida]}
            onChange={(date) => handleInputChange(field.salida, date)}
            optionalFeatures={OptionDateFeatures({
                title:field.nombre,
                placeholder:field["texto predeterminado"],
                defaultDate:field["fecha predeterminada"],
                dateFormat: field["formato"],
                disabled: field["limitaciones"].includes("no editable"),
                required: field["obligatorio"]
            })}
        />
        )

    default:
        return null
    }
}

// Función que maneja el envío del formulario
const handleSubmit = () => {
    console.log("Formulario enviado:", formState)
    eval(formData.accionPersonalizada)
}

return (
    <Layout>
    {formData.campos.map((field) => renderField(field))}
    <Button title="Enviar" onPress={handleSubmit} />
    </Layout>
)
}

export default DynamicForm
